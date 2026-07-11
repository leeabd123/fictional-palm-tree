// ══════════════════════════════════════════════
// EVENTS — anonymized usage logging (§9). Fire-and-forget: events queue
// locally and flush in small batches to the Worker's /api/events endpoint
// whenever a worker is configured. No PII, no user ids — mode entered,
// item ids, timings. Logging must never break or slow the app.
// ══════════════════════════════════════════════

const EVENTS_KEY = 'tariga_events_v1';

function logEvent(t, data) {
  try {
    const q = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    q.push({ t, ...data, at: Date.now() });
    localStorage.setItem(EVENTS_KEY, JSON.stringify(q.slice(-100)));
    if (q.length >= 10) flushEvents();
  } catch (e) {}
}

let _flushing = false;
function flushEvents() {
  if (_flushing) return;
  const cfg = typeof getApiConfig === 'function' ? getApiConfig() : null;
  if (!cfg || cfg.mode !== 'worker' || !cfg.workerUrl) return;
  let q;
  try { q = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); } catch (e) { return; }
  if (!q.length) return;
  _flushing = true;
  fetch(cfg.workerUrl.replace(/\/$/, '') + '/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: q }),
  }).then(r => {
    if (r.ok || r.status === 204) { try { localStorage.setItem(EVENTS_KEY, '[]'); } catch (e) {} }
  }).catch(() => {}).finally(() => { _flushing = false; });
}

// flush leftovers when the tab goes to background
try {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents();
  });
} catch (e) {}
