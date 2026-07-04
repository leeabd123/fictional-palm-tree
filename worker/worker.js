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

function corsHeaders(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
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

    const url = new URL(request.url);
    if (url.pathname !== '/api/coach' || request.method !== 'POST') {
      return json({ error: 'not_found' }, 404, cors);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'server_not_configured', detail: 'ANTHROPIC_API_KEY secret missing' }, 500, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
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
