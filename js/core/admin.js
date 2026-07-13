// ══════════════════════════════════════════════
// FOUNDER TOOLS (demo/admin mode) — for demos and testing, not learners.
// One switch unlocks every gated feature (Comfortable scenarios, Free-form,
// Live call, speed rounds) and a panel simulates any app state without
// grinding. Everything is local to this browser. Open with the ADMIN link
// on the "How Tariga works" page, or by adding #admin to the URL.
// ══════════════════════════════════════════════

const ADMIN_KEY = 'tariga_admin_v1';

function adminOn() {
  try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch (e) { return false; }
}

function adminSet(on) {
  try { on ? localStorage.setItem(ADMIN_KEY, '1') : localStorage.removeItem(ADMIN_KEY); } catch (e) {}
  adminBadge();
}

// small fixed badge so demo mode is never mistaken for real progress
function adminBadge() {
  let el = document.getElementById('admin-badge');
  if (!adminOn()) { el?.remove(); return; }
  if (el) return;
  el = document.createElement('button');
  el.id = 'admin-badge';
  el.textContent = 'DEMO — all unlocked';
  el.title = 'Founder tools — everything gated is open. Tap to manage.';
  el.onclick = () => setMode('admin');
  document.body.appendChild(el);
}

// unlock helper used by every gate: real progress OR demo mode
function comfortUnlocked(domainId) {
  return adminOn() || domainTier(domainId) !== 'Beginning';
}

// ── state simulators ──
function adminMarkPracticed(domainId) {
  const prog = getGuidedProgress();
  GUIDED_SCENARIOS
    .filter(g => (!domainId || g.domain === domainId))
    .forEach(g => { prog[g.id] = prog[g.id] || { ts: Date.now(), hits: 3, total: 3, demo: true }; });
  try { localStorage.setItem('tariga_guided_v1', JSON.stringify(prog)); } catch (e) {}
  renderAdmin();
}

function adminClearProgress() {
  ['tariga_guided_v1', 'tariga_attempts_v1', 'tariga_activity_v1'].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });
  renderAdmin();
}

function adminSimulateAway(days) {
  const d = new Date(); d.setDate(d.getDate() - days);
  const day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  try { localStorage.setItem('tariga_activity_v1', JSON.stringify([day])); } catch (e) {}
  // warm-up needs history — make sure a couple of items exist
  const prog = getGuidedProgress();
  if (Object.keys(prog).length < 2) {
    GUIDED_SCENARIOS.slice(0, 2).forEach(g => prog[g.id] = { ts: Date.now() - days * 86400000, hits: 3, total: 3, demo: true });
    try { localStorage.setItem('tariga_guided_v1', JSON.stringify(prog)); } catch (e) {}
  }
  renderAdmin();
}

function adminSetReviewer(kind) {
  const rec = kind === 'elder' ? { count: 0, approved: 0, vouched: true, vouchedTs: Date.now() }
    : kind === 'trusted' ? { count: 15, approved: 14 }
    : { count: 0, approved: 0 };
  try { localStorage.setItem('tariga_reviewer_v1', JSON.stringify(rec)); } catch (e) {}
  renderAdmin();
}

function adminResetIntro() {
  try { localStorage.removeItem('tariga_intro_v1'); localStorage.removeItem('tariga_profile_v1'); } catch (e) {}
  renderAdmin();
}

function adminWipeAll() {
  if (!confirm('Wipe ALL app data in this browser (progress, stars, contributions, settings)?')) return;
  const keep = adminOn();
  try { localStorage.clear(); } catch (e) {}
  if (keep) adminSet(true);
  renderAdmin();
}

// ── the panel ──
const ADMIN_JUMPS = [
  ['home', 'Home'], ['tree', '◈ Domain map'], ['guided', 'Guided'], ['speak', 'Your coach'], ['freeform', 'Free-form'],
  ['livecall', '◉ Live call'], ['speed', '≫ Speed round'], ['warmup', 'Warm-up'],
  ['flash', 'Flashcards'], ['deep', 'Deep cards'], ['listen', 'Tune your ear'], ['convo', 'Conversation'],
  ['journey', 'Journey'], ['map', 'Map'], ['contribute', 'Contribute'], ['review', 'Reviewer mode'],
  ['about', 'How it works'], ['starred', 'Starred'], ['shadow', 'Shadowing'], ['build', 'Builder'],
  ['mc', 'Quiz'], ['deepquiz', 'Deep quiz'], ['flow', 'Flow'], ['trans', 'Transitions'], ['vocab', 'Vocab'], ['ref', 'Reference'],
];

function adminStorageRows() {
  const KEYS = [
    ['tariga_guided_v1', 'guided progress', v => Object.keys(JSON.parse(v)).length + ' items'],
    ['tariga_attempts_v1', 'coach attempts', v => Object.values(JSON.parse(v)).reduce((n, a) => n + a.length, 0) + ' attempts'],
    ['tariga_starred_v1', 'starred', v => JSON.parse(v).length + ' stars'],
    ['tariga_contributions_v1', 'contributions', v => JSON.parse(v).length + ' items'],
    ['tariga_reviewer_v1', 'reviewer record', v => { const r = JSON.parse(v); return (r.vouched ? 'Elder' : r.count + ' reviews'); }],
    ['tariga_activity_v1', 'practice days', v => JSON.parse(v).length + ' days'],
    ['tariga_events_v1', 'queued events', v => JSON.parse(v).length + ' queued'],
    ['tariga_profile_v1', 'profile', v => { const p = JSON.parse(v); return [p.name, p.comfort, p.focusDomain].filter(Boolean).join(' · ') || 'set'; }],
    ['tariga_api_config_v1', 'coach connection', v => JSON.parse(v).mode],
  ];
  return KEYS.map(([k, label, fmt]) => {
    let val = '—';
    try { const raw = localStorage.getItem(k); if (raw) val = fmt(raw); } catch (e) { val = '?'; }
    return `<div class="j2-num-row"><span>${label}</span><span class="j2-num-vals"><span class="j2-num-now" style="font-size:13px">${escAttr(String(val))}</span></span></div>`;
  }).join('');
}

// two distinct founder surfaces under one entry point (§28.2):
// 'demo' simulates app states for presentation; 'content' manages the database
let adminTab = 'demo';
function adminSetTab(t) { adminTab = t; renderAdmin(); }

function renderAdmin() {
  const ca = document.getElementById('content-area');
  const on = adminOn();
  const r = (typeof _reviewer === 'function') ? _reviewer() : { count: 0 };
  const tierName = (typeof reviewerTier === 'function') ? reviewerTier(r).name : '—';
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← back to the app</button>
      <div class="c2-head">
        <div>
          <div class="c2-title" style="color:var(--accent2)">Founder tools</div>
          <div class="c2-sub">two jobs, two tabs — demos on the left, the content database on the right</div>
        </div>
      </div>

      <div class="d2-tab-row" style="margin-bottom:14px">
        <button class="d2-tab ${adminTab === 'demo' ? 'on' : ''}" onclick="adminSetTab('demo')">Demo &amp; simulate</button>
        <button class="d2-tab ${adminTab === 'content' ? 'on' : ''}" onclick="adminSetTab('content')">Content manager</button>
      </div>

      ${adminTab === 'content' ? renderAdminContentHTML() : `
      <div class="d2-card" style="padding:18px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:14.5px;font-weight:600;color:var(--text)">Demo unlock</div>
            <div class="d2-item-note" style="margin-top:3px">opens every gate: Comfortable scenarios, Free-form, Live call, speed rounds — with a visible DEMO badge</div>
          </div>
          <button class="${on ? 'd2-pill-green' : 'c2-ghost-pill'}" onclick="adminSet(${on ? 'false' : 'true'});renderAdmin()">${on ? 'ON ✓' : 'OFF'}</button>
        </div>
      </div>

      <div class="j2-sec-label">Design system</div>
      <div class="d2-tab-row">
        <button class="d2-tab ${!neonOn() ? 'on' : ''}" onclick="themeSet('warm')">Warm candlelit</button>
        <button class="d2-tab ${neonOn() ? 'on' : ''}" onclick="themeSet('neon')">Neon ink-navy</button>
      </div>

      <div class="j2-sec-label" style="margin-top:18px">Simulate a state</div>
      <div class="d2-tab-row">
        <button class="d2-tab" onclick="adminMarkPracticed('family')">Family basics done</button>
        <button class="d2-tab" onclick="adminMarkPracticed(null)">ALL scenarios practiced</button>
        <button class="d2-tab" onclick="adminSimulateAway(3)">3 days away (warm-up)</button>
        <button class="d2-tab" onclick="adminResetIntro()">Replay intro</button>
        <button class="d2-tab" onclick="adminClearProgress()">Clear progress</button>
        <button class="d2-tab" style="color:#e08a7a;border-color:rgba(217,107,90,.4)" onclick="adminWipeAll()">Wipe everything</button>
      </div>

      <div class="j2-sec-label" style="margin-top:18px">Reviewer tier <span style="letter-spacing:0;text-transform:none">· currently: ${escAttr(tierName)}</span></div>
      <div class="d2-tab-row">
        <button class="d2-tab" onclick="adminSetReviewer('new')">New reviewer ×1</button>
        <button class="d2-tab" onclick="adminSetReviewer('trusted')">Trusted ×3</button>
        <button class="d2-tab" onclick="adminSetReviewer('elder')">Community Elder ★</button>
      </div>

      <div class="j2-sec-label" style="margin-top:18px">Jump anywhere</div>
      <div class="d2-tab-row">
        ${ADMIN_JUMPS.map(([m, label]) => `<button class="d2-tab" onclick="setMode('${m}')">${label}</button>`).join('')}
      </div>

      <div class="j2-sec-label" style="margin-top:18px">This browser's data</div>
      <div class="j2-nums">${adminStorageRows()}</div>

      <div class="d2-note" style="text-align:center;margin-top:16px">
        internal usage stats live at <b>stats.html</b> (needs the Worker's STATS_KEY + D1) ·
        reopen this panel anytime via <b>#admin</b> in the URL or the link on "How Tariga works"
      </div>`}
    </div>
  `;
}

// boot: #admin or ?admin=1 in the URL enables demo mode and opens the panel
function adminBootCheck() {
  try {
    const wantsAdmin = location.hash === '#admin' || new URLSearchParams(location.search).get('admin') === '1';
    if (wantsAdmin) { adminSet(true); setMode('admin'); }
    adminBadge();
  } catch (e) {}
}
