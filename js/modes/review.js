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
  const tiers = TARIGA_CONFIG.review.tiers;
  return [...tiers].reverse().find(t => (r || _reviewer()).count >= t.min) || tiers[0];
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

      ${reviewDidYouKnow ? `
      <div class="d2-inset" style="border-color:rgba(79,216,196,.25);margin-bottom:14px">
        <div class="d2-label" style="margin-bottom:6px">Did you know</div>
        <div class="d2-star-ar" style="font-size:17px">${escAttr(reviewDidYouKnow.a)}</div>
        <div class="d2-star-ph">${escAttr(reviewDidYouKnow.p)}</div>
        <div class="d2-star-en">${escAttr(reviewDidYouKnow.e)}</div>
      </div>` : ''}

      ${!item ? `
      <div class="d2-card" style="text-align:center">
        <div style="font-size:34px">🤍</div>
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

        ${reviewEditOpen ? `
        <textarea id="review-edit" dir="auto" rows="2"
          style="width:100%;margin-top:14px;border:1px solid rgba(86,201,143,.35);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:15px;line-height:1.7;padding:12px 14px;resize:none;outline:none">${escAttr(item.text)}</textarea>
        <div class="d2-pill-row" style="margin-top:10px">
          <button class="c2-ghost-pill" onclick="reviewEditOpen=false;renderReview()">cancel</button>
          <button class="d2-pill-green" onclick="reviewEditApprove()">Save fix & approve ✓</button>
        </div>` : reviewFlagOpen ? `
        <div class="d2-note" style="margin:14px 0 8px">Why doesn't it work?</div>
        <div class="d2-tab-row">
          ${['wrong register', 'not natural', 'other dialect', 'misspelled'].map(rr =>
            `<button class="d2-tab" onclick="reviewFlag('${rr}')">${rr}</button>`).join('')}
          <button class="d2-tab" onclick="reviewFlagOpen=false;renderReview()">cancel</button>
        </div>` : `
        <div class="d2-pill-row" style="margin-top:16px">
          <button class="d2-pill-red" onclick="reviewFlagOpen=true;renderReview()">Flag</button>
          <button class="c2-ghost-pill" onclick="reviewEditOpen=true;renderReview()">Edit & approve</button>
          <button class="d2-pill-green" style="flex:1;max-width:200px" onclick="reviewApprove()">Approve ✓</button>
        </div>
        <div class="d2-note" style="text-align:center;margin:10px 0 0">${pending.length - 1} more waiting · your vote counts ×${tier.weight}</div>`}
      </div>`}

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

function reviewFlag(reason) {
  _reviewApply(item => {
    item.status = 'flagged';
    item.flagReason = reason;
  }, false);
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
