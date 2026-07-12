// ══════════════════════════════════════════════
// CONTENT MANAGER (§26) — the second founder surface under #admin.
// Distinct job from the demo panel (§28.2): the demo panel simulates app
// states for presentation; this manages the underlying content database.
// Function over form, per spec: searchable tables, inline editing, bulk
// actions, export. Local-first: edits are stored as overrides in this
// browser and applied on top of the shipped data at load — the server
// content pipeline slots in behind the same shapes later.
// ══════════════════════════════════════════════

const CONTENT_KEY = 'tariga_content_v1';

function _content() {
  try {
    return { scenarios: {}, vocab: {}, deletedScenarios: [], deletedVocab: [], custom: [], calls: {}, ...JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}') };
  } catch (e) {
    return { scenarios: {}, vocab: {}, deletedScenarios: [], deletedVocab: [], custom: [], calls: {} };
  }
}
function _saveContent(c) {
  try { localStorage.setItem(CONTENT_KEY, JSON.stringify(c)); } catch (e) {}
}

// apply this browser's overrides onto the shipped data (runs once at load)
function contentApplyOverrides() {
  const c = _content();
  c.custom.forEach(s => { if (!GUIDED_SCENARIOS.some(g => g.id === s.id)) GUIDED_SCENARIOS.push(s); });
  Object.entries(c.scenarios).forEach(([id, patch]) => {
    const g = GUIDED_SCENARIOS.find(x => x.id === id);
    if (g) Object.assign(g, patch);
  });
  c.deletedScenarios.forEach(id => {
    const i = GUIDED_SCENARIOS.findIndex(x => x.id === id);
    if (i >= 0) GUIDED_SCENARIOS.splice(i, 1);
  });
  Object.entries(c.calls).forEach(([id, turns]) => {
    const cs = CALL_SEQUENCES.find(x => x.id === id);
    if (cs && Array.isArray(turns)) cs.turns = turns;
  });
  const vocabAll = [...V1, ...V2, ...P2, ...EXTRA];
  Object.entries(c.vocab).forEach(([origA, patch]) => {
    const v = vocabAll.find(x => x.a === origA);
    if (v) Object.assign(v, patch);
  });
  [V1, V2, P2, EXTRA].forEach(arr => {
    c.deletedVocab.forEach(a => {
      const i = arr.findIndex(x => x.a === a);
      if (i >= 0) arr.splice(i, 1);
    });
  });
}
contentApplyOverrides();

// ── content-manager UI state ──
let cmTable = 'scenarios';
let cmQuery = '';
let cmFilter = { domain: null, tier: null, status: null };
let cmOpen = null; // id of the row expanded for editing

function cmSet(table) { cmTable = table; cmOpen = null; cmQuery = ''; renderAdmin(); }
function cmSearch(v) { cmQuery = v; cmRedrawRows(); }
function cmChip(k, v) { cmFilter[k] = cmFilter[k] === v ? null : v; renderAdmin(); }
function cmToggle(id) { cmOpen = cmOpen === id ? null : id; renderAdmin(); }

// redraw only the row list so the search box keeps focus while typing
function cmRedrawRows() {
  const host = document.getElementById('cm-rows');
  if (host) host.innerHTML = cmRowsHTML();
}

function _cmMatch(hay) {
  if (!cmQuery.trim()) return true;
  return hay.toLowerCase().includes(cmQuery.trim().toLowerCase());
}

function cmScenarioList() {
  return GUIDED_SCENARIOS.filter(g =>
    (!cmFilter.domain || g.domain === cmFilter.domain) &&
    (!cmFilter.tier || g.tier === cmFilter.tier) &&
    (!cmFilter.status || (g.verification_status || '') === cmFilter.status) &&
    _cmMatch([g.id, g.title, g.say_en, (g.targets || []).map(t => t.ar + ' ' + t.ph).join(' ')].join(' ')));
}

function cmVocabList() {
  return [...V1, ...V2, ...P2, ...EXTRA].filter(v => _cmMatch([v.a, v.p, v.e].join(' ')));
}

// ── scenario editing ──
function cmSaveScenario(id) {
  const g = GUIDED_SCENARIOS.find(x => x.id === id);
  if (!g) return;
  const f = (fid) => document.getElementById('cm-' + fid)?.value ?? '';
  const patch = {
    title: f('title').trim() || g.title,
    domain: f('domain') || g.domain,
    tier: f('tier') || g.tier,
    setup: f('setup').trim(),
    say_en: f('sayen').trim(),
    note: f('note').trim() || null,
    verification_status: f('status') || g.verification_status,
    required: f('required').split(',').map(s => s.trim()).filter(Boolean),
    targets: (g.targets || []).map((t, i) => i === 0
      ? { ...t, ar: f('tar').trim() || t.ar, ph: f('tph').trim() || t.ph, en: f('ten').trim() || t.en }
      : t),
  };
  Object.assign(g, patch);
  const c = _content();
  if (c.custom.some(s => s.id === id)) {
    c.custom = c.custom.map(s => s.id === id ? { ...s, ...patch } : s);
  } else {
    c.scenarios[id] = { ...(c.scenarios[id] || {}), ...patch };
  }
  _saveContent(c);
  cmOpen = null;
  renderAdmin();
}

function cmDeleteScenario(id) {
  if (!confirm('Delete this scenario from this browser\'s library?')) return;
  const c = _content();
  if (c.custom.some(s => s.id === id)) c.custom = c.custom.filter(s => s.id !== id);
  else if (!c.deletedScenarios.includes(id)) c.deletedScenarios.push(id);
  _saveContent(c);
  const i = GUIDED_SCENARIOS.findIndex(x => x.id === id);
  if (i >= 0) GUIDED_SCENARIOS.splice(i, 1);
  cmOpen = null;
  renderAdmin();
}

// ── vocab editing ──
function cmSaveVocab(encA) {
  const origA = decodeURIComponent(encA);
  const v = [...V1, ...V2, ...P2, ...EXTRA].find(x => x.a === origA);
  if (!v) return;
  const patch = {
    a: document.getElementById('cm-va')?.value.trim() || v.a,
    p: document.getElementById('cm-vp')?.value.trim() || v.p,
    e: document.getElementById('cm-ve')?.value.trim() || v.e,
  };
  Object.assign(v, patch);
  const c = _content();
  c.vocab[origA] = { ...(c.vocab[origA] || {}), ...patch };
  _saveContent(c);
  cmOpen = null;
  renderAdmin();
}

function cmDeleteVocab(encA) {
  const a = decodeURIComponent(encA);
  if (!confirm('Delete this vocab item from this browser\'s deck?')) return;
  const c = _content();
  if (!c.deletedVocab.includes(a)) c.deletedVocab.push(a);
  _saveContent(c);
  [V1, V2, P2, EXTRA].forEach(arr => {
    const i = arr.findIndex(x => x.a === a);
    if (i >= 0) arr.splice(i, 1);
  });
  cmOpen = null;
  renderAdmin();
}

// ── call-sequence editing (turns as a unit, per §26) ──
function cmSaveCall(id) {
  const raw = document.getElementById('cm-call-json')?.value || '';
  let turns;
  try { turns = JSON.parse(raw); } catch (e) { alert('That is not valid JSON — fix it and save again.'); return; }
  if (!Array.isArray(turns) || !turns.every(t => t.who && t.ar)) { alert('Turns must be an array of {who, ar, ph, en} objects.'); return; }
  const cs = CALL_SEQUENCES.find(x => x.id === id);
  if (!cs) return;
  cs.turns = turns;
  const c = _content();
  c.calls[id] = turns;
  _saveContent(c);
  cmOpen = null;
  renderAdmin();
}

// ── quick-add: founder-seeded content skips the review pipeline (§26) ──
function cmQuickAdd() {
  const f = (fid) => document.getElementById('qa-' + fid)?.value.trim() || '';
  if (!f('title') || !f('sayen') || !f('tar')) { alert('Title, "say in English", and the Arabic target are required.'); return; }
  const s = {
    id: 'custom-' + Date.now().toString(36),
    domain: f('domain') || 'family', tier: f('tier') || 'Beginning',
    title: f('title'),
    setup: f('setup') || f('title'),
    register_note: 'founder-added',
    prompt: null,
    say_en: f('sayen'),
    targets: [{ ar: f('tar'), ph: f('tph'), en: f('ten') || f('sayen'), gender: 'any' }],
    required: f('required').split(',').map(x => x.trim()).filter(Boolean),
    note: f('note') || null,
    source: 'founder-seeded', verification_status: 'pending-review',
  };
  GUIDED_SCENARIOS.push(s);
  const c = _content();
  c.custom.push(s);
  _saveContent(c);
  cmOpen = null;
  renderAdmin();
}

// ── pending-queue overrides (force approve/reject, bypassing vote weight) ──
function cmForce(ts, approve) {
  const all = _loadContribs();
  const item = all.find(x => x.ts === ts);
  if (!item) return;
  if (approve) { item.status = 'live'; item.liveTs = Date.now(); item.forced = true; }
  else { item.status = 'removed'; item.flagReason = 'removed by admin'; item.forced = true; }
  _saveContribs(all);
  renderAdmin();
}
function cmForceAllPending(approve) {
  const all = _loadContribs();
  const pend = all.filter(x => (x.status || 'pending') === 'pending');
  if (!pend.length) return;
  if (!confirm((approve ? 'Force-approve' : 'Reject') + ' all ' + pend.length + ' pending submissions?')) return;
  pend.forEach(item => {
    if (approve) { item.status = 'live'; item.liveTs = Date.now(); item.forced = true; }
    else { item.status = 'removed'; item.flagReason = 'removed by admin'; item.forced = true; }
  });
  _saveContribs(all);
  renderAdmin();
}

// ── export (JSON / CSV) ──
function cmDownload(name, mime, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function cmExportJSON() {
  cmDownload('tariga-content.json', 'application/json', JSON.stringify({
    exported: new Date().toISOString(),
    scenarios: GUIDED_SCENARIOS, call_sequences: CALL_SEQUENCES,
    vocabulary: { v1: V1, v2: V2, glossary: P2, extra: EXTRA },
    contributions: _loadContribs(),
  }, null, 2));
}
function cmExportCSV() {
  const esc = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  const rows = [['id', 'domain', 'tier', 'title', 'say_en', 'target_ar', 'target_ph', 'verification_status', 'source'].join(',')];
  GUIDED_SCENARIOS.forEach(g => rows.push([g.id, g.domain, g.tier, g.title, g.say_en, g.targets?.[0]?.ar, g.targets?.[0]?.ph, g.verification_status, g.source].map(esc).join(',')));
  cmDownload('tariga-scenarios.csv', 'text/csv', rows.join('\n'));
}

// ── the rows for the active table ──
function cmRowsHTML() {
  const fieldStyle = 'width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-family:var(--sans),\'Noto Naskh Arabic\';font-size:13px;padding:8px 10px;outline:none';
  const lbl = (t) => `<div class="d2-item-note" style="margin-top:10px">${t}</div>`;

  if (cmTable === 'scenarios') {
    const list = cmScenarioList();
    const flags = (typeof auditFlags === 'function') ? auditFlags() : [];
    return `
      ${flags.length ? `
      <div class="d2-inset" style="border-color:rgba(217,107,90,.35);margin-bottom:10px">
        <div class="d2-label" style="color:#e08a7a;margin-bottom:6px">Flagged in the community audit queue — needs your look</div>
        ${flags.map(f => {
          const g = GUIDED_SCENARIOS.find(x => x.id === f.id);
          return `<div class="d2-when-body" style="margin-bottom:4px">• ${escAttr(g ? g.title : f.id)}${f.note ? ' — "' + escAttr(f.note) + '"' : ''} <button class="c2-linklike" onclick="cmToggle('${f.id}')">edit →</button></div>`;
        }).join('')}
      </div>` : ''}
      <div class="d2-item-note" style="margin:4px 0 8px">${list.length} of ${GUIDED_SCENARIOS.length} scenarios</div>
      ${list.map(g => `
      <div class="d2-item" style="margin-bottom:6px;cursor:pointer" onclick="if(event.target.tagName!=='INPUT'&&event.target.tagName!=='TEXTAREA'&&event.target.tagName!=='SELECT'&&event.target.tagName!=='BUTTON')cmToggle('${g.id}')">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <span style="flex:1;min-width:160px;font-size:13.5px;color:var(--text)">${escAttr(g.title)}</span>
          <span class="d2-badge">${escAttr(g.domain)}</span>
          <span class="d2-badge">${escAttr(g.tier)}</span>
          <span class="d2-badge" style="${g.verification_status === 'native-corrected' ? 'color:var(--mint);border-color:rgba(86,201,143,.4)' : 'color:var(--accent2)'}">${escAttr(g.verification_status || '—')}</span>
        </div>
        ${cmOpen === g.id ? `
        <div style="margin-top:8px" onclick="event.stopPropagation()">
          ${lbl('title')}<input id="cm-title" style="${fieldStyle}" value="${escAttr(g.title)}">
          <div style="display:flex;gap:8px">
            <span style="flex:1">${lbl('domain')}<select id="cm-domain" style="${fieldStyle}">${DOMAINS.map(d => `<option ${d.id === g.domain ? 'selected' : ''}>${d.id}</option>`).join('')}</select></span>
            <span style="flex:1">${lbl('tier')}<select id="cm-tier" style="${fieldStyle}">${TIERS.map(t => `<option ${t === g.tier ? 'selected' : ''}>${t}</option>`).join('')}</select></span>
            <span style="flex:1">${lbl('verification')}<select id="cm-status" style="${fieldStyle}">${['native-corrected', 'pending-review', 'verified-live'].map(t => `<option ${t === g.verification_status ? 'selected' : ''}>${t}</option>`).join('')}</select></span>
          </div>
          ${lbl('setup')}<textarea id="cm-setup" rows="2" style="${fieldStyle};resize:none">${escAttr(g.setup || '')}</textarea>
          ${lbl('say in English')}<input id="cm-sayen" style="${fieldStyle}" value="${escAttr(g.say_en || '')}">
          ${lbl('target — Arabic · phonetic · English')}
          <input id="cm-tar" dir="rtl" style="${fieldStyle}" value="${escAttr(g.targets?.[0]?.ar || '')}">
          <input id="cm-tph" style="${fieldStyle}" value="${escAttr(g.targets?.[0]?.ph || '')}">
          <input id="cm-ten" style="${fieldStyle}" value="${escAttr(g.targets?.[0]?.en || '')}">
          ${lbl('required words (comma-separated)')}<input id="cm-required" dir="auto" style="${fieldStyle}" value="${escAttr((g.required || []).join(', '))}">
          ${lbl('coach note')}<textarea id="cm-note" rows="2" style="${fieldStyle};resize:none">${escAttr(g.note || '')}</textarea>
          <div class="d2-pill-row" style="margin-top:10px">
            <button class="d2-pill-red" onclick="cmDeleteScenario('${g.id}')">Delete</button>
            <button class="c2-ghost-pill" onclick="cmToggle('${g.id}')">cancel</button>
            <button class="d2-pill-green" onclick="cmSaveScenario('${g.id}')">Save ✓</button>
          </div>
        </div>` : ''}
      </div>`).join('')}`;
  }

  if (cmTable === 'vocab') {
    const list = cmVocabList().slice(0, 60);
    const total = cmVocabList().length;
    return `
      <div class="d2-item-note" style="margin:4px 0 8px">${total} matching item${total === 1 ? '' : 's'}${total > 60 ? ' · showing first 60 — narrow with search' : ''}</div>
      ${list.map(v => {
        const enc = encodeURIComponent(v.a);
        return `
      <div class="d2-item" style="margin-bottom:6px;cursor:pointer" onclick="if(event.target.tagName!=='INPUT'&&event.target.tagName!=='BUTTON')cmToggle('v:${escAttr(enc)}')">
        <div style="display:flex;gap:10px;align-items:center">
          <span dir="rtl" style="font-size:15px;color:var(--text)">${escAttr(v.a)}</span>
          <span class="d2-item-note" style="flex:1">${escAttr(v.p)} · ${escAttr(v.e)}</span>
          <span class="d2-badge">${v.src === 'v1' ? 'Solja' : v.src === 'v2' ? 'Ala' : 'glossary'}</span>
        </div>
        ${cmOpen === 'v:' + enc ? `
        <div style="margin-top:8px" onclick="event.stopPropagation()">
          <input id="cm-va" dir="rtl" style="${fieldStyle}" value="${escAttr(v.a)}">
          <input id="cm-vp" style="${fieldStyle}" value="${escAttr(v.p)}">
          <input id="cm-ve" style="${fieldStyle}" value="${escAttr(v.e)}">
          <div class="d2-pill-row" style="margin-top:10px">
            <button class="d2-pill-red" onclick="cmDeleteVocab('${escAttr(enc)}')">Delete</button>
            <button class="c2-ghost-pill" onclick="cmToggle('v:${escAttr(enc)}')">cancel</button>
            <button class="d2-pill-green" onclick="cmSaveVocab('${escAttr(enc)}')">Save ✓</button>
          </div>
        </div>` : ''}
      </div>`;
      }).join('')}`;
  }

  if (cmTable === 'calls') {
    return CALL_SEQUENCES.map(cs => `
      <div class="d2-item" style="margin-bottom:6px;cursor:pointer" onclick="if(event.target.tagName!=='TEXTAREA'&&event.target.tagName!=='BUTTON')cmToggle('${cs.id}')">
        <div style="display:flex;gap:8px;align-items:center">
          <span style="flex:1;font-size:13.5px;color:var(--text)">📞 ${escAttr(cs.title)}</span>
          <span class="d2-badge">${escAttr(cs.domain)}</span>
          <span class="d2-badge">${cs.turns.length} turns</span>
        </div>
        ${cmOpen === cs.id ? `
        <div style="margin-top:8px" onclick="event.stopPropagation()">
          <div class="d2-item-note" style="margin-bottom:6px">edit the turns as a unit — array of {who, ar, ph, en}</div>
          <textarea id="cm-call-json" rows="10" dir="ltr" style="width:100%;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-family:monospace;font-size:11.5px;line-height:1.5;padding:10px;outline:none;resize:vertical">${escAttr(JSON.stringify(cs.turns, null, 1))}</textarea>
          <div class="d2-pill-row" style="margin-top:10px">
            <button class="c2-ghost-pill" onclick="cmToggle('${cs.id}')">cancel</button>
            <button class="d2-pill-green" onclick="cmSaveCall('${cs.id}')">Save turns ✓</button>
          </div>
        </div>` : ''}
      </div>`).join('');
  }

  if (cmTable === 'people') {
    const r = _reviewer();
    const tier = reviewerTier(r);
    const vouches = _vouches();
    return `
      <div class="d2-item" style="margin-bottom:6px">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <span style="flex:1;font-size:13.5px;color:var(--text)">This browser's reviewer</span>
          <span class="d2-badge">${escAttr(tier.name)} · ×${tier.weight}</span>
          <span class="d2-badge">${r.count || 0} reviews</span>
          <span class="d2-badge">${r.approved || 0} approved</span>
        </div>
        <div class="d2-pill-row" style="margin-top:10px">
          ${r.vouched ? '<span class="d2-item-note" style="align-self:center">🌟 vouched Community Elder</span>'
            : '<button class="d2-pill-gold" onclick="adminSetReviewer(\'elder\')">Vouch as Community Elder 🌟</button>'}
        </div>
      </div>
      <div class="j2-sec-label" style="margin-top:14px">Vouch codes</div>
      ${vouches.length ? vouches.slice().reverse().map(v => `
        <div class="d2-star-row" style="align-items:center">
          <span style="font-family:monospace;color:var(--accent2)">${escAttr(v.code)}</span>
          <span class="d2-item-note" style="flex:1">${v.used ? 'redeemed' : 'open'}</span>
        </div>`).join('') : '<div class="d2-item-note">none yet — create them in Reviewer mode</div>'}
      <div class="d2-note" style="margin-top:12px">Real contributor accounts need a backend identity layer (§28.1) — until then this table shows this browser only.</div>`;
  }

  if (cmTable === 'queue') {
    const all = _loadContribs().slice().reverse();
    const pending = all.filter(x => (x.status || 'pending') === 'pending');
    return `
      <div class="d2-pill-row" style="margin-bottom:10px">
        <button class="d2-pill-green" onclick="cmForceAllPending(true)">Force-approve all pending (${pending.length})</button>
        <button class="d2-pill-red" onclick="cmForceAllPending(false)">Reject all pending</button>
      </div>
      ${all.length ? all.map(x => `
      <div class="d2-item" style="margin-bottom:6px">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <span dir="auto" style="flex:1;min-width:160px;font-size:13.5px;color:var(--text)">${escAttr(x.text)}</span>
          <span class="d2-badge" style="${x.status === 'live' ? 'color:var(--mint);border-color:rgba(86,201,143,.4)' : x.status === 'removed' ? 'color:#e08a7a' : ''}">${escAttr(x.status || 'pending')}${x.forced ? ' · forced' : ''}</span>
          ${(x.status || 'pending') === 'pending' ? `
          <button class="d2-pill-green" style="padding:5px 12px;font-size:11px" onclick="cmForce(${x.ts},true)">approve</button>
          <button class="d2-pill-red" style="padding:5px 12px;font-size:11px" onclick="cmForce(${x.ts},false)">reject</button>` : ''}
        </div>
        <div class="d2-item-note" style="margin-top:4px">${escAttr(x.prompt || '')} · ${[x.tags?.region, x.tags?.generation].filter(Boolean).map(escAttr).join(' · ') || 'untagged'}</div>
      </div>`).join('') : '<div class="d2-item-note">no submissions yet</div>'}
      <div class="d2-note" style="margin-top:10px">Force actions bypass the weighted vote — for urgent fixes only (§26).</div>`;
  }

  // analytics glance
  const events = (() => { try { return JSON.parse(localStorage.getItem('tariga_events_v1') || '[]'); } catch (e) { return []; } })();
  const byType = {};
  events.forEach(ev => { byType[ev.type] = (byType[ev.type] || 0) + 1; });
  const lookups = (typeof wordstarLookups === 'function') ? wordstarLookups() : [];
  return `
    <div class="j2-nums">
      <div class="j2-num-row"><span>events queued in this browser</span><span class="j2-num-vals"><span class="j2-num-now">${events.length}</span></span></div>
      ${Object.entries(byType).map(([t, n]) => `<div class="j2-num-row"><span style="padding-left:14px">${escAttr(t)}</span><span class="j2-num-vals"><span class="j2-num-now" style="font-size:13px">${n}</span></span></div>`).join('')}
    </div>
    ${lookups.length ? `
    <div class="j2-sec-label" style="margin-top:16px">Most looked-up words not in the library (§27.4 — demand-driven gaps)</div>
    ${lookups.slice(0, 8).map(l => `
      <div class="d2-star-row" style="align-items:center">
        <span dir="rtl" style="font-size:15px;color:var(--text)">${escAttr(l.w)}</span>
        <span class="d2-item-note" style="flex:1">${l.n} lookup${l.n === 1 ? '' : 's'}</span>
      </div>`).join('')}` : ''}
    <div class="d2-note" style="margin-top:12px">Cross-user aggregates live at <b>stats.html</b> once the Worker's D1 + STATS_KEY are set up (§9).</div>`;
}

function renderAdminContentHTML() {
  const TABLES = [
    ['scenarios', 'Scenarios'], ['vocab', 'Vocabulary'], ['calls', 'Call sequences'],
    ['people', 'Contributors'], ['queue', 'Pending queue'], ['analytics', 'Analytics'],
  ];
  const showSearch = cmTable === 'scenarios' || cmTable === 'vocab';
  return `
    <div class="d2-tab-row">
      ${TABLES.map(([id, label]) => `<button class="d2-tab ${cmTable === id ? 'on' : ''}" onclick="cmSet('${id}')">${label}</button>`).join('')}
    </div>
    ${showSearch ? `
    <input id="cm-search" placeholder="search ${cmTable} — Arabic, phonetic, or English" value="${escAttr(cmQuery)}"
      oninput="cmSearch(this.value)"
      style="width:100%;margin:4px 0 8px;border:1px solid rgba(255,255,255,0.12);border-radius:100px;background:rgba(255,255,255,0.04);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:13px;padding:10px 16px;outline:none">` : ''}
    ${cmTable === 'scenarios' ? `
    <div class="d2-tab-row" style="margin-bottom:8px">
      ${DOMAINS.map(d => `<button class="d2-tab ${cmFilter.domain === d.id ? 'on' : ''}" onclick="cmChip('domain','${d.id}')">${d.icon} ${d.label}</button>`).join('')}
      ${['Beginning', 'Comfortable'].map(t => `<button class="d2-tab ${cmFilter.tier === t ? 'on' : ''}" onclick="cmChip('tier','${t}')">${t}</button>`).join('')}
      ${['native-corrected', 'pending-review'].map(s => `<button class="d2-tab ${cmFilter.status === s ? 'on' : ''}" onclick="cmChip('status','${s}')">${s}</button>`).join('')}
    </div>` : ''}
    <div id="cm-rows">${cmRowsHTML()}</div>

    ${cmTable === 'scenarios' ? `
    <div class="j2-sec-label" style="margin-top:18px">Quick-add — founder content, skips the review pipeline</div>
    <div class="d2-item">
      <input id="qa-title" placeholder="title" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <div style="display:flex;gap:8px;margin-top:6px">
        <select id="qa-domain" style="flex:1;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">${DOMAINS.map(d => `<option>${d.id}</option>`).join('')}</select>
        <select id="qa-tier" style="flex:1;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">${TIERS.slice(0, 2).map(t => `<option>${t}</option>`).join('')}</select>
      </div>
      <input id="qa-setup" placeholder="setup — the situation" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <input id="qa-sayen" placeholder="what to say, in English" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <input id="qa-tar" dir="rtl" placeholder="الهدف بالعربي — target in Arabic" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-family:'Noto Naskh Arabic';font-size:14px;padding:8px 10px;outline:none">
      <input id="qa-tph" placeholder="phonetic" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <input id="qa-ten" placeholder="target in English (optional)" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <input id="qa-required" dir="auto" placeholder="required words, comma-separated (optional)" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <input id="qa-note" placeholder="coach note (optional)" style="width:100%;margin-top:6px;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(255,255,255,0.04);color:#f0ede8;font-size:13px;padding:8px 10px;outline:none">
      <button class="d2-pill-gold" style="margin-top:10px" onclick="cmQuickAdd()">+ Add to the library</button>
      <div class="d2-item-note" style="margin-top:6px">lands as pending-review so it still gets a native ear before being treated as verified</div>
    </div>` : ''}

    <div class="d2-pill-row" style="margin-top:16px">
      <button class="c2-ghost-pill" onclick="cmExportJSON()">⬇ Export everything (JSON)</button>
      <button class="c2-ghost-pill" onclick="cmExportCSV()">⬇ Scenarios (CSV)</button>
    </div>
    <div class="d2-note" style="margin-top:10px">Edits live in this browser as overrides on the shipped content — export JSON to hand the edited database back to development.</div>`;
}
