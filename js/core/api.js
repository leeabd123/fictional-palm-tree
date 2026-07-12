// Coach API transport.
// Two modes, chosen in the coach settings panel:
//   'worker' — POST to the deployed Cloudflare Worker (see worker/README.md).
//              The key lives on Cloudflare; safe to share with real users.
//   'direct' — call the Anthropic API straight from this browser with a key
//              the user pastes (stored ONLY in this browser's localStorage).
//              For the developer's own testing before the worker exists.

const API_CFG_KEY = 'tariga_api_config_v1';
const DIRECT_MODEL = 'claude-opus-4-8';

function getApiConfig() {
  try { return JSON.parse(localStorage.getItem(API_CFG_KEY) || 'null'); } catch (e) { return null; }
}

function saveApiConfig(cfg) {
  try { localStorage.setItem(API_CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
}

function clearApiConfig() {
  try { localStorage.removeItem(API_CFG_KEY); } catch (e) {}
}

function apiConfigured() {
  const c = getApiConfig();
  return !!(c && ((c.mode === 'worker' && c.workerUrl) || (c.mode === 'direct' && c.apiKey)));
}

// Sends a built coach request; resolves with the parsed feedback object.
// Graceful-degradation path (§28.1): every call gets a hard timeout, and
// transient failures (network drop, 5xx, timeout) retry once automatically
// before surfacing an error — the caller keeps the user's answer either way.
const COACH_TIMEOUT_MS = 60000;

async function coachEvaluate(req) {
  try {
    return await _coachEvaluateOnce(req);
  } catch (e) {
    const msg = String(e.message || e);
    const transient = msg === 'timeout' || msg.startsWith('api_error:5') || /failed to fetch|networkerror|load failed/i.test(msg);
    if (!transient) throw e;
    await new Promise(r => setTimeout(r, 1500));
    return _coachEvaluateOnce(req);
  }
}

async function _coachEvaluateOnce(req) {
  const cfg = getApiConfig();
  if (!cfg) throw new Error('not_configured');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), COACH_TIMEOUT_MS);

  let res;
  try {
  if (cfg.mode === 'worker') {
    res = await fetch(cfg.workerUrl.replace(/\/$/, '') + '/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: ctrl.signal,
    });
  } else {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: DIRECT_MODEL,
        max_tokens: 3000,
        system: req.system,
        messages: req.messages,
        output_config: { format: { type: 'json_schema', schema: req.output_schema } },
      }),
      signal: ctrl.signal,
    });
  }
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('timeout');
    throw e;
  }
  clearTimeout(timer);

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).error?.message || (await res.text()); } catch (e) {}
    if (res.status === 401) throw new Error('bad_key');
    if (res.status === 429) throw new Error('rate_limited');
    throw new Error('api_error:' + res.status + (detail ? ' ' + detail : ''));
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') throw new Error('refused');
  const textBlock = (data.content || []).find(b => b.type === 'text');
  if (!textBlock) throw new Error('empty_response');
  try {
    return JSON.parse(textBlock.text);
  } catch (e) {
    throw new Error('bad_feedback_json');
  }
}
