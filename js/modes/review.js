// ══════════════════════════════════════════════
// REVIEWER MODE — a distinct, focused surface (§16), NOT the learner nav:
// a stack of pending submissions, one at a time, with big clear actions.
// Organic trust track only (§17.1 Track 1): review accuracy grows your
// tier, higher tiers carry more vote weight, a submission goes live when
// accumulated weight crosses the threshold ("2-3 approvals; experienced
// reviewers count more"). Local-first: the queue lives in this browser —
// the server pipeline slots in behind the same shapes later.
// ══════════════════════════════════════════════

const REVIEWER_KEY = 'tariga_reviewer_v1';

// demo submissions so the surface is demonstrable before real traffic —
// drawn from the glossary (already-verified phrases wearing the
// "community submission" shape). Clearly marked.
const REVIEW_SEEDS = [
  { kind: 'phrase', prompt: 'Suggested phrase — take it easy / relax', text: 'براحة يا زول', when: 'calming someone down', tags: { region: 'Khartoum', generation: 'My generation' }, ts: 0, demo: true },
  { kind: 'phrase', prompt: 'Suggested phrase — the vibe/buzz between people', text: 'الكبريش', when: 'two people clicking', tags: { region: 'Omdurman', generation: 'My generation' }, ts: 0, demo: true },
  { kind: 'prompt', prompt: "Your grandmother asks why you don't visit more often.", text: 'معلش يا حبوبة والله مشغولين، لكن إنتي في بالنا دايماً', when: null, tags: { region: 'North', generation: "Parents'" }, ts: 0, demo: true },
];

function _reviewer() {
  try { return JSON.parse(localStorage.getItem(REVIEWER_KEY) || '{"count":0,"approved":0}'); } catch (e) { return { count: 0, approved: 0 }; }
}
function _saveReviewer(r) {
  try { localStorage.setItem(REVIEWER_KEY, JSON.stringify(r)); } catch (e) {}
}
function reviewerTier(r) {
  const rec = r || _reviewer();
  // vouched fast track (§17.1 Track 2): real-world linguistic authority is
  // the credential — a vouched elder lands with full weight from day one
  if (rec.vouched) return { ...TARIGA_CONFIG.review.elder };
  const tiers = TARIGA_CONFIG.review.tiers;
  return [...tiers].reverse().find(t => rec.count >= t.min) || tiers[0];
}

// ── vouch codes — created by trusted members, redeemed by elders ──
const VOUCH_KEY = 'tariga_vouches_v1';
function _vouches() {
  try { return JSON.parse(localStorage.getItem(VOUCH_KEY) || '[]'); } catch (e) { return []; }
}
function _saveVouches(v) {
  try { localStorage.setItem(VOUCH_KEY, JSON.stringify(v)); } catch (e) {}
}
function reviewCanVouch() {
  const t = reviewerTier();
  return t.name === TARIGA_CONFIG.review.vouchMinTier || t.name === TARIGA_CONFIG.review.elder.name;
}
function reviewCreateVouch() {
  const code = 'TRG-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const v = _vouches();
  v.push({ code, ts: Date.now(), used: false });
  _saveVouches(v);
  renderReview();
}
function reviewRedeemVouch() {
  const code = (document.getElementById('vouch-code')?.value || '').trim().toUpperCase();
  if (!code) return;
  const v = _vouches();
  const hit = v.find(x => x.code === code && !x.used);
  if (!hit) {
    const el = document.getElementById('vouch-code');
    if (el) { el.style.borderColor = 'rgba(217,107,90,.6)'; setTimeout(() => el.style.borderColor = '', 1200); }
    return;
  }
  hit.used = true;
  _saveVouches(v);
  const r = _reviewer();
  r.vouched = true; r.vouchedTs = Date.now();
  _saveReviewer(r);
  renderReview();
}

// queue = pending items in the contributions store (seeded once if empty)
function _reviewQueue() {
  let all = _loadContribs();
  if (!all.some(c => c.demo)) {
    all = [...all, ...REVIEW_SEEDS.map(x => ({ ...x, ts: Date.now() - 86400000 }))];
    _saveContribs(all);
  }
  return all;
}
function _pending(all) { return all.filter(c => (c.status || 'pending') === 'pending'); }

let reviewEditOpen = false;
let reviewFlagOpen = false;
let reviewDidYouKnow = null;
let reviewTab = 'new';        // §25: two distinct queues — 'new' | 'audit'

// ── audit queue (§25): already-live content periodically resurfaces for
// re-confirmation — including founder-seeded items that haven't had
// independent community eyes yet. Confirms accumulate per item. ──
const AUDIT_KEY = 'tariga_audit_v1';
function _audit() {
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || '{}'); } catch (e) { return {}; }
}
function _saveAudit(a) { try { localStorage.setItem(AUDIT_KEY, JSON.stringify(a)); } catch (e) {} }

function reviewAuditPool() {
  return GUIDED_SCENARIOS.filter(g => g.verification_status !== 'verified-live');
}
function reviewAuditPick() {
  const a = _audit();
  const pool = reviewAuditPool().filter(g => !(a[g.id] && a[g.id].flagged));
  if (!pool.length) return null;
  // least independently-confirmed first, oldest look first
  pool.sort((x, y) => ((a[x.id]?.confirms || 0) - (a[y.id]?.confirms || 0)) || ((a[x.id]?.ts || 0) - (a[y.id]?.ts || 0)));
  return pool[0];
}
function reviewAuditConfirm(id) {
  const a = _audit();
  a[id] = { ...(a[id] || {}), confirms: (a[id]?.confirms || 0) + 1, ts: Date.now() };
  _saveAudit(a);
  const r = _reviewer(); r.count++; r.approved++; _saveReviewer(r);
  try { reviewDidYouKnow = shuf(P2)[0]; } catch (e) { reviewDidYouKnow = null; }
  renderReview();
}
function reviewAuditFlag(id) {
  const note = (document.getElementById('audit-flag-note')?.value || '').trim();
  const a = _audit();
  a[id] = { ...(a[id] || {}), flagged: true, note: note || null, ts: Date.now() };
  _saveAudit(a);
  const r = _reviewer(); r.count++; _saveReviewer(r);
  renderReview();
}
// flagged audit items surface in the founder content manager
function auditFlags() {
  const a = _audit();
  return Object.entries(a).filter(([, v]) => v.flagged).map(([id, v]) => ({ id, note: v.note }));
}

// ── voice option on review items (§25) — a natural byproduct source for
// the native-voice gap. Consent first, always (§28 audio-consent note). ──
let reviewConsent = false;
let reviewRec = null;

async function reviewRecToggle(ts) {
  if (reviewRec) { reviewRec.stop(); return; }
  if (!reviewConsent) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      reviewRec = null;
      const fr = new FileReader();
      fr.onload = () => {
        const all = _loadContribs();
        const item = all.find(x => x.ts === ts);
        if (item) { item.voiceNote = fr.result; item.voiceConsent = true; _saveContribs(all); }
        renderReview();
      };
      fr.readAsDataURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
    };
    mr.start();
    reviewRec = mr;
    setTimeout(() => { if (reviewRec === mr && mr.state === 'recording') mr.stop(); }, 8000);
    renderReview();
  } catch (e) {
    reviewRec = null;
    alert('Could not reach the microphone — check browser permissions.');
  }
}
function reviewPlayVoice(ts) {
  const item = _loadContribs().find(x => x.ts === ts);
  if (item && item.voiceNote) new Audio(item.voiceNote).play();
}

function renderReview() {
  const ca = document.getElementById('content-area');
  const all = _reviewQueue();
  const pending = _pending(all);
  const r = _reviewer();
  const tier = reviewerTier(r);
  const liveAll = all.filter(c => c.status === 'live');
  const liveWeek = liveAll.filter(c => c.liveTs && Date.now() - c.liveTs < 7 * 86400000).length;
  const item = pending[0];

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('contribute')">← back to learning</button>
      <div class="c2-head">
        <div>
          <div class="c2-title" style="color:var(--mint)">Reviewer mode</div>
          <div class="c2-sub">you're the native ear here — nothing goes live without one</div>
        </div>
        <span class="d2-badge" title="Vote weight ×${tier.weight} — grows with review accuracy">${tier.name} · ×${tier.weight}</span>
      </div>

      <div class="d2-grid2" style="margin-bottom:14px">
        <div class="d2-item" style="text-align:center">
          <div style="font-size:22px;color:var(--mint);font-weight:600">${r.count}</div>
          <div class="d2-item-note" style="margin-top:2px">reviews by you</div>
        </div>
        <div class="d2-item" style="text-align:center">
          <div style="font-size:22px;color:var(--accent2);font-weight:600">${liveAll.length}</div>
          <div class="d2-item-note" style="margin-top:2px">phrases live · ${liveWeek} this week — look what we built together</div>
        </div>
      </div>

      ${(() => { const gap = (typeof contribGap === 'function') ? contribGap() : null; return gap ? `
      <div class="d2-inset" style="border-color:rgba(201,169,110,.3);margin-bottom:14px">
        <div class="d2-label gold" style="margin-bottom:6px">Where your ear is needed right now</div>
        <div class="d2-when-body">${escAttr(gap.ask)}</div>
      </div>` : ''; })()}

      ${reviewDidYouKnow ? `
      <div class="d2-inset" style="border-color:rgba(79,216,196,.25);margin-bottom:14px">
        <div class="d2-label" style="margin-bottom:6px">Did you know</div>
        <div class="d2-star-ar" style="font-size:17px">${escAttr(reviewDidYouKnow.a)}</div>
        <div class="d2-star-ph">${escAttr(reviewDidYouKnow.p)}</div>
        <div class="d2-star-en">${escAttr(reviewDidYouKnow.e)}</div>
      </div>` : ''}

      <div class="d2-tab-row">
        <button class="d2-tab ${reviewTab === 'new' ? 'on' : ''}" onclick="reviewTab='new';renderReview()">New submissions${pending.length ? ' (' + pending.length + ')' : ''}</button>
        <button class="d2-tab ${reviewTab === 'audit' ? 'on' : ''}" onclick="reviewTab='audit';renderReview()">Audit queue — re-check what's live</button>
      </div>

      ${reviewTab === 'audit' ? reviewAuditHTML() : !item ? `
      <div class="d2-card" style="text-align:center">
        <div style="font-size:34px">♡</div>
        <div class="c2-title" style="font-size:19px;margin:10px 0 6px">Queue is clear</div>
        <div class="d2-note" style="margin:0 auto;max-width:360px">Every pending submission has been reviewed. New ones land here as the community contributes.</div>
      </div>` : `
      <div class="d2-card">
        <div class="d2-label">${escAttr(item.kind === 'phrase' ? 'Suggested phrase' : 'Prompt answer')} ${item.demo ? '· <span style="color:var(--text3)">demo submission</span>' : ''}</div>
        <div class="d2-note" style="margin-bottom:10px">${escAttr(item.prompt)}</div>
        <div class="d2-star-ar" style="font-size:22px">${escAttr(item.text)}</div>
        ${item.when ? `<div class="d2-item-note" style="margin-top:6px">said when: ${escAttr(item.when)}</div>` : ''}
        <div class="d2-tab-row" style="margin:12px 0 0">
          ${[item.tags && item.tags.region, item.tags && item.tags.generation].filter(Boolean).map(t => `<span class="d2-badge">${escAttr(t)}</span>`).join('')}
          <span class="d2-item-note" style="align-self:center">weight so far: ${reviewWeight(item)} of ${TARIGA_CONFIG.review.liveThreshold}</span>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,.05);margin-top:12px;padding-top:10px">
          ${item.voiceNote ? `
          <button class="c2-linklike" onclick="reviewPlayVoice(${item.ts})">▶ play the native voice note attached to this</button>` : `
          <label class="d2-item-note" style="display:flex;gap:8px;align-items:flex-start;cursor:pointer">
            <input type="checkbox" ${reviewConsent ? 'checked' : ''} onchange="reviewConsent=this.checked;renderReview()" style="margin-top:2px">
            <span>Optional: record yourself saying it — I'm okay with my recording being used to teach learners pronunciation later.</span>
          </label>
          ${reviewConsent ? `
          <button class="c2-ghost-pill" style="margin-top:8px;${reviewRec ? 'border-color:rgba(217,107,90,.5);color:#e08a7a' : ''}" onclick="reviewRecToggle(${item.ts})">${reviewRec ? '■ stop recording' : '${UI_MIC} record it (max 8s)'}</button>` : ''}`}
        </div>

        ${reviewEditOpen ? `
        <textarea id="review-edit" dir="auto" rows="2"
          style="width:100%;margin-top:14px;border:1px solid rgba(86,201,143,.35);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:15px;line-height:1.7;padding:12px 14px;resize:none;outline:none">${escAttr(item.text)}</textarea>
        <div class="d2-pill-row" style="margin-top:10px">
          <button class="c2-ghost-pill" onclick="reviewEditOpen=false;renderReview()">cancel</button>
          <button class="d2-pill-green" onclick="reviewEditApprove()">Save fix & approve ✓</button>
        </div>` : reviewFlagOpen ? `
        <div class="d2-note" style="margin:14px 0 8px">Why doesn't it work? It goes back to the contributor with your note — never silently gone (§17.2).</div>
        <div class="d2-tab-row" id="review-flag-reasons">
          ${['wrong register', 'not natural', 'other dialect', 'misspelled'].map(rr =>
            `<button class="d2-tab" onclick="reviewPickReason(this,'${rr}')">${rr}</button>`).join('')}
          <button class="d2-tab" style="color:#e08a7a" onclick="reviewPickReason(this,'inappropriate')"> inappropriate/spam</button>
        </div>
        <textarea id="review-flag-note" dir="auto" rows="2" placeholder="a sentence for the contributor — what would make it work?"
          style="width:100%;margin-top:10px;border:1px solid rgba(217,107,90,.3);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:13.5px;line-height:1.6;padding:10px 14px;resize:none;outline:none"></textarea>
        <div class="d2-pill-row" style="margin-top:10px">
          <button class="c2-ghost-pill" onclick="reviewFlagOpen=false;renderReview()">cancel</button>
          <button class="d2-pill-red" onclick="reviewSendBack()">Send back with note</button>
        </div>` : `
        <div class="d2-pill-row" style="margin-top:16px">
          <button class="d2-pill-red" onclick="reviewFlagOpen=true;renderReview()">Flag</button>
          <button class="c2-ghost-pill" onclick="reviewEditOpen=true;renderReview()">Edit & approve</button>
          <button class="d2-pill-green" style="flex:1;max-width:200px" onclick="reviewApprove()">Approve ✓</button>
        </div>
        <div class="d2-note" style="text-align:center;margin:10px 0 0">${pending.length - 1} more waiting · your vote counts ×${tier.weight}</div>`}
      </div>`}

      <div class="j2-sec-label" style="margin-top:24px">The vouch fast-track</div>
      <div class="d2-card" style="padding:18px">
        ${r.vouched ? `
          <div class="d2-prompt" style="font-size:14px">★ You were vouched in as a <b style="color:var(--accent2)">Community Elder</b> — your single approval takes a phrase live. Your ear is the credential.</div>
        ` : `
          <div class="d2-note" style="margin-bottom:8px">Were you vouched in by a trusted member? Elders shouldn't grind points — identity does that work.</div>
          <div style="display:flex;gap:8px">
            <input id="vouch-code" placeholder="TRG-XXXXX" style="flex:1;border:1px solid rgba(255,255,255,0.12);border-radius:100px;background:rgba(255,255,255,0.04);color:#f0ede8;font-family:var(--sans);font-size:13px;padding:10px 16px;outline:none;text-transform:uppercase">
            <button class="d2-pill-teal" onclick="reviewRedeemVouch()">Redeem</button>
          </div>
        `}
        ${reviewCanVouch() ? `
          <div style="border-top:1px solid rgba(255,255,255,.06);margin-top:14px;padding-top:12px">
            <div class="d2-note" style="margin-bottom:8px">You can vouch someone in — a khalto, a habooba, anyone whose Sudanese is the real thing. Share a code:</div>
            <div class="d2-tab-row" style="margin-bottom:8px">
              ${_vouches().filter(v => !v.used).slice(-3).map(v => `<span class="d2-badge" style="font-family:monospace">${v.code}</span>`).join('') || '<span class="d2-item-note">no open codes</span>'}
            </div>
            <button class="c2-ghost-pill" onclick="reviewCreateVouch()">+ Create a vouch code</button>
          </div>` : ''}
      </div>

      ${liveAll.length ? `
      <div class="j2-sec-label" style="margin-top:24px">Verified — live for learners</div>
      ${liveAll.slice(-4).reverse().map(c => `
        <div class="d2-star-row" style="align-items:center">
          <span style="color:var(--mint)">✓</span>
          <div style="flex:1">
            <div class="d2-star-en" style="margin:0;color:var(--text)" dir="auto">${escAttr(c.text)}</div>
            <div class="d2-item-note">${escAttr((c.tags && c.tags.region) || 'untagged')} · feeds the map</div>
          </div>
        </div>`).join('')}` : ''}
    </div>
  `;
}

function reviewWeight(item) {
  return (item.votes || []).reduce((n, v) => n + v.w, 0);
}

// the audit-queue card (§25): one live/founder-seeded item at a time,
// re-confirmed by independent community ears over time
function reviewAuditHTML() {
  const g = reviewAuditPick();
  if (!g) return `
      <div class="d2-card" style="text-align:center">
        <div style="font-size:34px">♡</div>
        <div class="c2-title" style="font-size:19px;margin:10px 0 6px">Audit queue is clear</div>
        <div class="d2-note" style="margin:0 auto;max-width:360px">Everything live has been re-confirmed or flagged for a fix. It resurfaces again over time — verification is never "permanently done".</div>
      </div>`;
  const a = _audit();
  const confirms = a[g.id]?.confirms || 0;
  const t = g.targets?.[0] || {};
  return `
      <div class="d2-card">
        <div class="d2-label">Already live — does it still sound right? ${g.verification_status === 'native-corrected' ? '· <span style="color:var(--mint)">native-corrected once</span>' : '· <span style="color:var(--accent2)">' + escAttr(g.verification_status || '') + '</span>'}</div>
        <div class="d2-note" style="margin-bottom:10px">${escAttr(g.setup || g.title)}</div>
        <div class="d2-star-ar" style="font-size:22px">${escAttr(t.ar || '')}</div>
        <div class="d2-star-ph">${escAttr(t.ph || '')}</div>
        <div class="d2-star-en">${escAttr(t.en || '')}</div>
        <div class="d2-item-note" style="margin-top:8px">${confirms} independent confirmation${confirms === 1 ? '' : 's'} so far · founder-seeded content earns trust the same way community content does</div>
        <textarea id="audit-flag-note" dir="auto" rows="1" placeholder="if something's off — what would your family say instead?"
          style="width:100%;margin-top:12px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:13.5px;line-height:1.6;padding:10px 14px;resize:none;outline:none"></textarea>
        <div class="d2-pill-row" style="margin-top:12px">
          <button class="d2-pill-red" onclick="reviewAuditFlag('${g.id}')">Needs another look</button>
          <button class="d2-pill-green" style="flex:1;max-width:240px" onclick="reviewAuditConfirm('${g.id}')">Still sounds right ✓</button>
        </div>
        <div class="d2-note" style="text-align:center;margin:10px 0 0">${reviewAuditPool().length - 1} more in the audit rotation · flags land on the founder's desk</div>
      </div>`;
}

function _reviewApply(mutate, approved) {
  const all = _reviewQueue();
  const pending = _pending(all);
  if (!pending.length) return;
  const idx = all.indexOf(pending[0]);
  mutate(all[idx]);
  _saveContribs(all);
  const r = _reviewer();
  r.count++;
  if (approved) r.approved++;
  _saveReviewer(r);
  // review as discovery (§17.6): surface a related phrase after each action
  try { reviewDidYouKnow = shuf(P2)[0]; } catch (e) { reviewDidYouKnow = null; }
  reviewEditOpen = false; reviewFlagOpen = false;
  renderReview();
}

function reviewApprove() {
  const w = reviewerTier().weight;
  _reviewApply(item => {
    item.votes = item.votes || [];
    item.votes.push({ w, ts: Date.now() });
    if (reviewWeight(item) >= TARIGA_CONFIG.review.liveThreshold) {
      item.status = 'live';
      item.liveTs = Date.now();
    }
  }, true);
}

function reviewEditApprove() {
  const fixed = (document.getElementById('review-edit')?.value || '').trim();
  if (!fixed) return;
  const w = reviewerTier().weight;
  _reviewApply(item => {
    item.text = fixed;
    item.edited = true;
    item.votes = item.votes || [];
    item.votes.push({ w, ts: Date.now() });
    if (reviewWeight(item) >= TARIGA_CONFIG.review.liveThreshold) {
      item.status = 'live';
      item.liveTs = Date.now();
    }
  }, true);
}

let _flagReason = null;
function reviewPickReason(btn, reason) {
  _flagReason = reason;
  document.querySelectorAll('#review-flag-reasons .d2-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}
function reviewSendBack() {
  const note = (document.getElementById('review-flag-note')?.value || '').trim();
  const reason = _flagReason || 'not natural';
  _reviewApply(item => {
    if (reason === 'inappropriate') {
      // moderation (§28.3) is a different path from dialect accuracy:
      // spam/offensive content is removed, not returned for another try
      item.status = 'removed';
      item.flagReason = reason;
      item.reviewerNote = note || null;
    } else {
      item.status = 'returned';         // §17.2: back to the contributor, not gone
      item.flagReason = reason;
      item.reviewerNote = note || null;
    }
  }, false);
  _flagReason = null;
}

// live community counts per map region (§17.5 — the map pulls from this)
function communityRegionCounts() {
  const counts = {};
  _loadContribs().filter(c => c.status === 'live').forEach(c => {
    const id = REGION_TAG_MAP[(c.tags && c.tags.region) || ''];
    if (id) counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
}
