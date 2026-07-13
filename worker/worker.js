/**
 * Tariga coach proxy — Cloudflare Worker
 *
 * Keeps the Anthropic API key off the static GitHub Pages frontend.
 * The client builds the coaching prompt (js/core/coach-prompt.js) and sends
 * { system, messages, output_schema } here; this worker enforces the model,
 * token cap, and origin, attaches the secret key, and forwards to Anthropic.
 *
 * Deploy:  see worker/README.md  (wrangler deploy + one secret, ~10 minutes)
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MAX_TOKENS_CAP = 3000;
const MAX_BODY_BYTES = 50_000;

// Very light per-isolate rate limit (resets when the isolate recycles).
// Real protection = Cloudflare dashboard rate rules; this just blunts loops.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > WINDOW_MS) { rec.n = 0; rec.t = now; }
  rec.n++;
  hits.set(ip, rec);
  return rec.n > MAX_PER_WINDOW;
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
}

// Hard origin check, not just CORS: CORS headers only stop BROWSERS from
// reading responses — they don't stop curl or scripts from burning the API
// key. When ALLOWED_ORIGINS is set, requests from anywhere else get a 403.
// (Empty ALLOWED_ORIGINS = dev mode, accept anything.)
function originForbidden(env, origin) {
  const allowed = allowedOrigins(env);
  return allowed.length > 0 && !allowed.includes(origin);
}

function corsHeaders(env, origin) {
  const allowed = allowedOrigins(env);
  const ok = allowed.length === 0 || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? (origin || '*') : allowed[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    // hard origin gate for every non-preflight request (see originForbidden)
    if (originForbidden(env, origin)) return json({ error: 'origin_forbidden' }, 403, cors);

    const url = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // ── anonymized event logging (learning-design doc §9) ──
    // POST /api/events {events:[{t, mode, id?, ms?, extra?}]}. No PII, no
    // user ids. Written to D1 when a database is bound as `DB`
    // (wrangler d1 create tariga && add binding), silently accepted otherwise
    // so the client never has to care.
    if (url.pathname === '/api/events' && request.method === 'POST') {
      if (rateLimited('ev:' + ip)) return new Response(null, { status: 429, headers: cors });
      let evBody;
      try {
        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413, cors);
        evBody = JSON.parse(raw);
      } catch { return json({ error: 'bad_json' }, 400, cors); }
      const events = Array.isArray(evBody && evBody.events) ? evBody.events.slice(0, 50) : [];
      if (env.DB && events.length) {
        try {
          await env.DB.prepare(
            'CREATE TABLE IF NOT EXISTS events (ts INTEGER, t TEXT, mode TEXT, id TEXT, ms INTEGER, extra TEXT)'
          ).run();
          const stmt = env.DB.prepare('INSERT INTO events (ts, t, mode, id, ms, extra) VALUES (?, ?, ?, ?, ?, ?)');
          await env.DB.batch(events.map(e => stmt.bind(
            Date.now(), String(e.t || '').slice(0, 40), String(e.mode || '').slice(0, 40),
            String(e.id || '').slice(0, 80), Number(e.ms) || 0, JSON.stringify(e.extra || null).slice(0, 500)
          )));
        } catch (e) { /* logging must never break the app */ }
      }
      return new Response(null, { status: 204, headers: cors });
    }

    // ── scrappy internal stats (§9): GET /api/stats?key=... reads the D1
    // event log. Guarded by a STATS_KEY secret; founder-only, not public.
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      if (!env.STATS_KEY || url.searchParams.get('key') !== env.STATS_KEY) {
        return json({ error: 'forbidden' }, 403, cors);
      }
      if (!env.DB) return json({ error: 'no_database', detail: 'bind a D1 database as DB' }, 501, cors);
      try {
        const byType = await env.DB.prepare(
          'SELECT t, COUNT(*) n FROM events GROUP BY t ORDER BY n DESC').all();
        const byMode = await env.DB.prepare(
          "SELECT mode, COUNT(*) n FROM events WHERE t='mode_enter' GROUP BY mode ORDER BY n DESC").all();
        const days = await env.DB.prepare(
          "SELECT date(ts/1000,'unixepoch') d, COUNT(*) n FROM events GROUP BY d ORDER BY d DESC LIMIT 14").all();
        return json({ byType: byType.results, byMode: byMode.results, days: days.results }, 200, cors);
      } catch (e) {
        return json({ error: 'query_failed', detail: String(e) }, 500, cors);
      }
    }

    if (url.pathname !== '/api/coach' || request.method !== 'POST') {
      return json({ error: 'not_found' }, 404, cors);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'server_not_configured', detail: 'ANTHROPIC_API_KEY secret missing' }, 500, cors);
    }

    if (rateLimited(ip)) return json({ error: 'rate_limited' }, 429, cors);

    let body;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413, cors);
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'bad_json' }, 400, cors);
    }

    const { system, messages, output_schema } = body || {};
    if (typeof system !== 'string' || !Array.isArray(messages) || typeof output_schema !== 'object') {
      return json({ error: 'bad_request', detail: 'expected {system, messages, output_schema}' }, 400, cors);
    }
    // shape caps: a coaching exchange is short; anything bigger is abuse
    if (messages.length > 24) return json({ error: 'too_many_messages' }, 400, cors);

    const anthropicReq = {
      model: env.MODEL || 'claude-opus-4-8',
      max_tokens: MAX_TOKENS_CAP,
      system,
      messages,
      output_config: { format: { type: 'json_schema', schema: output_schema } },
    };

    let upstream;
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(anthropicReq),
      });
    } catch (e) {
      return json({ error: 'upstream_unreachable', detail: String(e) }, 502, cors);
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  },
};
