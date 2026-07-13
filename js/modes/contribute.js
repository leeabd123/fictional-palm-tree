// Contribute — the community contribution pipeline (front-end flow, local-only),
// in the designed single-card layout: prompt, answer box, Region and
// generation tag pills, gold "Add to the library →" button, 2–3-reviewer note.

const CONTRIB_KEY = 'tariga_contributions_v1';
const CONTRIB_PROMPTS = [
  { en: "Your khalto puts a huge plate of food in front of you and says you look too thin. What do you say?", ar: "خالتك حطت ليك صحن أكل كبير وقالت ليك إنت ضعفت — بتقول شنو؟" },
  { en: "Your grandmother asks why you don't visit more often. How do you answer warmly?", ar: "حبوبتك سألتك ليه ما بتجي تزورنا كتير — بتجاوب كيف؟" },
  { en: "A cousin teases you about your accent when you speak Arabic. What's your comeback?", ar: "ود عمك بيضحك على لهجتك لما تتكلم عربي — بترد عليه بشنو؟" },
  { en: "You're introducing your best friend (who isn't Sudanese) to your family for the first time. What do you say?", ar: "بتقدم صاحبك لأهلك أول مرة — بتقول شنو؟" },
  { en: "Someone older asks about your studies/work and you want to answer with proper respect. How?", ar: "زول أكبر منك سألك عن دراستك أو شغلك — بتجاوب كيف بأدب؟" },
];

let contribPromptIdx = 0;
let contribSubmitted = false;
let contribKind = 'prompt';   // 'prompt' — answer this week's prompt · 'phrase' — suggest any phrase
let contribTags = { region: null, generation: null, formality: null };

// §28.4 — pre-select the region they named at onboarding (still changeable)
try {
  const _p = JSON.parse(localStorage.getItem('tariga_profile_v1') || '{}');
  if (_p.region) contribTags.region = _p.region;
} catch (e) {}

function _loadContribs() {
  try { return JSON.parse(localStorage.getItem(CONTRIB_KEY) || '[]'); } catch (e) { return []; }
}
function _saveContribs(list) {
  try { localStorage.setItem(CONTRIB_KEY, JSON.stringify(list)); } catch (e) {}
}

// ── gap detection (§17.8) — the agent scans the content database for thin
// coverage and turns it into a targeted ask. It routes and structures;
// it NEVER invents dialect content — humans fill the gap it found.
function contribGap() {
  const gaps = [];
  DOMAINS.filter(d => d.live).forEach(d => {
    const beg = GUIDED_SCENARIOS.filter(g => g.domain === d.id && g.tier === 'Beginning').length;
    const com = GUIDED_SCENARIOS.filter(g => g.domain === d.id && g.tier === 'Comfortable').length;
    const pending = GUIDED_SCENARIOS.filter(g => g.domain === d.id && g.verification_status === 'pending-review').length;
    if (pending) gaps.push({ w: pending * 3, ask: `${pending} ${d.label} scenario${pending === 1 ? '' : 's'} awaiting a native ear — reviewing them beats writing new ones` });
    if (com < 2) gaps.push({ w: 2, ask: `${d.label} is thin at Comfortable tier — how would YOUR family handle a harder ${d.label.toLowerCase()} moment?` });
    if (beg < 5) gaps.push({ w: 5 - beg, ask: `${d.label} needs more everyday basics — the first phrases someone would reach for` });
  });
  const live = _loadContribs().filter(c => c.status === 'live');
  const regions = new Set(live.map(c => c.tags && c.tags.region).filter(Boolean));
  ['Port Sudan', 'North', 'West'].forEach(rg => {
    if (!regions.has(rg)) gaps.push({ w: 1, ask: `no verified phrases from ${rg} yet — does your family come from there?` });
  });
  // §28.4 / §25 — the ask gets personal when we know their region
  const myRegion = (typeof getProfile === 'function') ? getProfile().region : null;
  if (myRegion && !regions.has(myRegion)) {
    gaps.push({ w: 20, ask: `since your family's from ${myRegion} — there are no verified ${myRegion} phrases yet. Your ear is exactly what's missing.` });
  }
  gaps.sort((a, b) => b.w - a.w);
  return gaps[0] || null;
}

function renderContribute() {
  const ca = document.getElementById('content-area');
  const prompt = CONTRIB_PROMPTS[contribPromptIdx % CONTRIB_PROMPTS.length];
  const mine = _loadContribs();
  const gap = contribGap();

  if (contribSubmitted) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">← all modes</button>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:40px">♡</div>
          <div class="d2-title" style="margin:10px 0 6px">شكراً — one more phrase preserved</div>
          <div class="d2-note" style="margin:0 auto;max-width:400px">Your phrasing joins the review queue. It goes live once <b style="color:var(--text)">2–3 independent native speakers</b> confirm it sounds natural — no single person's judgment, ever. <i>(In this prototype the queue lives on your device.)</i></div>
          <div class="d2-pill-row" style="margin-top:18px">
            <button class="d2-pill-gold" onclick="contribAnother()">Answer another prompt →</button>
          </div>
        </div>
        ${contribMineHTML(mine)}
      </div>`;
    return;
  }

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title">Contribute</div>
      <div class="d2-note" style="margin-bottom:18px">Help preserve the dialect — answer the way <em style="color:var(--accent2)">your</em> family actually says it.</div>

      ${gap ? `
      <div class="d2-inset" style="border-color:rgba(201,169,110,.3);margin-bottom:14px">
        <div class="d2-label gold" style="margin-bottom:6px">Where the library is thin right now</div>
        <div class="d2-when-body">${escAttr(gap.ask)}</div>
      </div>` : ''}

      <div class="d2-tab-row">
        <button class="d2-tab ${contribKind === 'prompt' ? 'on' : ''}" onclick="contribSetKind('prompt')">Answer the prompt</button>
        <button class="d2-tab ${contribKind === 'phrase' ? 'on' : ''}" onclick="contribSetKind('phrase')">Suggest a phrase</button>
      </div>

      <div class="d2-card">
        ${contribKind === 'prompt' ? `
        <div class="d2-label">This week's prompt <span style="letter-spacing:0;text-transform:none;color:var(--text3)">· ${(contribPromptIdx % CONTRIB_PROMPTS.length) + 1} of ${CONTRIB_PROMPTS.length}</span></div>
        <div class="d2-prompt" style="font-size:17px">${escAttr(prompt.en)}</div>
        <div class="d2-acc-ar" style="font-size:16px;color:var(--text2);margin-top:8px">${escAttr(prompt.ar)}</div>
        <div style="text-align:right;margin-top:6px">
          <button class="c2-linklike" onclick="contribSkip()">different prompt ↻</button>
        </div>` : `
        <div class="d2-label">Suggest any phrase</div>
        <div class="d2-prompt" style="font-size:15px">A word or saying your family uses that learners should know — the way it's <em>actually</em> said.</div>
        <input id="contrib-meaning" placeholder="what it means in English" style="width:100%;margin-top:14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans);font-size:14px;padding:11px 14px;outline:none">
        <input id="contrib-when" placeholder="when you'd say it (optional)" style="width:100%;margin-top:8px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans);font-size:14px;padding:11px 14px;outline:none">`}

        <textarea id="contrib-text" dir="auto" rows="2" placeholder="${contribKind === 'prompt' ? "اكتب هنا… your family's way (Arabic script or Arabizi)" : 'اكتب العبارة هنا… the phrase itself (Arabic script or Arabizi)'}"
          style="width:100%;margin-top:14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.03);color:#f0ede8;font-family:var(--sans),'Noto Naskh Arabic';font-size:15px;line-height:1.7;padding:12px 14px;resize:none;outline:none"></textarea>

        ${apiConfigured() ? `
        <div style="text-align:right;margin-top:8px">
          <button class="c2-linklike" id="contrib-suggest-btn" onclick="contribSuggestTags()">✧ suggest tags (AI proposes, you confirm)</button>
          <span id="contrib-suggest-out" class="d2-item-note" style="display:block;text-align:left;margin-top:6px"></span>
        </div>` : ''}
        <div class="d2-note" style="margin:14px 0 8px">Region</div>
        <div class="d2-tab-row" style="margin-bottom:0">${['Khartoum', 'Omdurman', 'Port Sudan', 'North', 'West', 'Diaspora'].map(t =>
          `<button class="d2-tab ${contribTags.region === t ? 'on' : ''}" onclick="contribTag('region','${t}')">${t}</button>`).join('')}
        </div>
        <div class="d2-note" style="margin:14px 0 8px">Whose way of saying it?</div>
        <div class="d2-tab-row" style="margin-bottom:0">${["Grandparents'", "Parents'", 'My generation'].map(t =>
          `<button class="d2-tab ${contribTags.generation === t ? 'on' : ''}" onclick="contribTag('generation',&quot;${t}&quot;)">${t}</button>`).join('')}
        </div>

        ${contribDupWarn ? `
        <div class="d2-inset" style="border-color:rgba(232,201,154,.35);margin-top:14px">
          <div class="d2-label gold" style="margin-bottom:6px">This looks similar to something already here</div>
          <div class="d2-star-ar" style="font-size:16px" dir="auto">${escAttr(contribDupWarn.match.text)}</div>
          <div class="d2-item-note" style="margin:4px 0 10px">${escAttr(contribDupWarn.match.what)}</div>
          <div class="d2-when-body" style="margin-bottom:10px">Same thing, a regional variant, or genuinely different? Variation across regions is the data we're collecting — only exact duplicates aren't needed twice.</div>
          <div class="d2-pill-row">
            <button class="c2-ghost-pill" onclick="contribDupWarn=null;renderContribute()">same thing — skip it</button>
            <button class="d2-pill-teal" onclick="contribDupWarn.variant=true;contribSubmit(true)">my region's variant →</button>
            <button class="d2-pill-green" onclick="contribSubmit(true)">genuinely different →</button>
          </div>
        </div>` : `
        <button id="contrib-submit-btn" class="c2-compare" style="width:100%;margin-top:18px;padding:14px;font-size:14px" onclick="contribSubmit()">Add to the library →</button>`}
        <div class="d2-note" style="text-align:center;margin:10px 0 0">Reviewed by hand before going live — the community reviewer network is the next build.</div>
      </div>

      ${contribMineHTML(mine)}

      <div style="text-align:center;margin-top:26px">
        <button class="c2-linklike" onclick="setMode('review')">Native speaker? Enter reviewer mode →</button>
      </div>
    </div>
  `;
  // keep what they typed visible while the duplicate question is open
  if (contribDupWarn) {
    const ta = document.getElementById('contrib-text');
    if (ta) ta.value = contribDupWarn.text;
    const m = document.getElementById('contrib-meaning');
    if (m && contribDupWarn.meaning) m.value = contribDupWarn.meaning;
    const w = document.getElementById('contrib-when');
    if (w && contribDupWarn.when) w.value = contribDupWarn.when;
  }
}

function contribMineHTML(mine) {
  if (!mine.length) return '';
  return `
    <div style="margin-top:30px">
      <div class="d2-label">Your contributions</div>
      ${mine.slice().reverse().map(c => `
        <div class="d2-star-row" style="align-items:center">
          <div style="flex:1">
            <div class="d2-star-en" style="margin:0;color:var(--text)" dir="auto">${escAttr(c.text)}</div>
            <div class="d2-item-note">${escAttr(c.prompt)} · ${[c.tags.region, c.tags.generation, c.tags.formality].filter(Boolean).map(escAttr).join(' · ') || 'untagged'}</div>
            ${c.status === 'returned' && c.reviewerNote ? `<div class="d2-when-body" style="margin-top:6px;color:#e0b3a8">reviewer: "${escAttr(c.reviewerNote)}" <button class="c2-linklike" onclick="contribResubmit(${c.ts})">fix & resubmit →</button></div>` : ''}
          </div>
          <span class="d2-badge" style="white-space:nowrap;${c.status === 'live' ? 'color:var(--mint);border-color:rgba(86,201,143,.4)' : (c.status === 'flagged' || c.status === 'returned' || c.status === 'removed') ? 'color:#e08a7a;border-color:rgba(217,107,90,.4)' : ''}">${c.status === 'live' ? '✓ live' : c.status === 'removed' ? 'removed' : c.status === 'returned' ? 'sent back — ' + escAttr(c.flagReason || '') : c.status === 'flagged' ? 'flagged — ' + escAttr(c.flagReason || '') : 'pending · ' + ((c.votes || []).reduce((n, v) => n + v.w, 0)) + '/' + TARIGA_CONFIG.review.liveThreshold}</span>
        </div>`).join('')}
    </div>`;
}

function contribSetKind(k) {
  if (k === contribKind) return;
  contribKind = k;
  renderContribute();
}

function contribTag(k, v) {
  contribTags[k] = contribTags[k] === v ? null : v;
  const text = document.getElementById('contrib-text')?.value || '';
  renderContribute();
  const ta = document.getElementById('contrib-text');
  if (ta) ta.value = text;
}

function contribSkip() {
  contribPromptIdx++;
  renderContribute();
}

// ── duplicate detection (§25): the system checks, not the contributor.
// Token-overlap similarity against existing content — same thing, a
// regional variant, or genuinely different is the human's call. ──
function _contribTokens(s) {
  return new Set(String(s).replace(/[.,!?؟،—:؛"']/g, ' ').toLowerCase().split(/\s+/).filter(w => w.length > 1));
}
function contribFindSimilar(text) {
  const t = _contribTokens(text);
  if (!t.size) return null;
  const pool = [
    ..._loadContribs().filter(c => c.status !== 'removed').map(c => ({ text: c.text, what: 'a community submission' })),
    ...[...P2, ...V1.slice(0, 40)].map(v => ({ text: v.a, what: v.e })),
  ];
  let best = null;
  pool.forEach(p => {
    const u = _contribTokens(p.text);
    if (!u.size) return;
    let inter = 0;
    t.forEach(w => { if (u.has(w)) inter++; });
    const sim = inter / Math.min(t.size, u.size);
    if (sim >= 0.6 && (!best || sim > best.sim) && p.text !== text) best = { ...p, sim };
  });
  return best;
}

let contribDupWarn = null;   // { match, text } while waiting for the human's call

// §25 — the doc asks for SEMANTIC similarity (Claude comparing meaning and
// context, not just text overlap). When the coach is connected, borderline
// candidates get a meaning-level check; the token check is the offline fallback.
async function contribSemanticCheck(text, meaning) {
  const t = _contribTokens(text);
  const candidates = [
    ..._loadContribs().filter(c => c.status !== 'removed').map(c => ({ text: c.text, what: 'a community submission' })),
    ...P2.map(v => ({ text: v.a, what: v.e })),
  ].filter(p => {
    const u = _contribTokens(p.text);
    let inter = 0; t.forEach(w => { if (u.has(w)) inter++; });
    return inter > 0 && p.text !== text;
  }).slice(0, 12);
  if (!candidates.length) return null;
  const res = await coachEvaluate({
    system: 'You check a new Sudanese Arabic phrase submission against existing library entries for MEANING-level duplication — same meaning in different words still counts. Regional variants are valuable, not duplicates. Compare meaning and usage context, not spelling.',
    messages: [{ role: 'user', content: `New submission: ${text}${meaning ? '\nSubmitter says it means: ' + meaning : ''}\n\nExisting entries:\n${candidates.map((c, i) => (i + 1) + '. ' + c.text + ' — ' + c.what).join('\n')}` }],
    output_schema: {
      type: 'object',
      properties: {
        similar: { type: 'boolean', description: 'true if any existing entry means the same thing' },
        existing: { type: 'string', description: 'the closest existing entry text, empty if none' },
        note: { type: 'string', description: 'one short sentence on the relationship' },
      },
      required: ['similar', 'existing', 'note'], additionalProperties: false,
    },
    max_tokens: 300,
  });
  return (res.similar && res.existing) ? { text: res.existing, what: res.note || 'the AI judged these to mean the same thing' } : null;
}

async function contribSubmit(force) {
  const text = (document.getElementById('contrib-text')?.value || '').trim() || (contribDupWarn && contribDupWarn.text) || '';
  if (!text) {
    const ta = document.getElementById('contrib-text');
    if (ta) { ta.focus(); ta.style.borderColor = 'var(--red)'; setTimeout(() => ta.style.borderColor = '', 1200); }
    return;
  }
  if (!force) {
    const meaning = (document.getElementById('contrib-meaning')?.value || '').trim();
    let match = contribFindSimilar(text);
    if (!match && apiConfigured()) {
      const btn = document.getElementById('contrib-submit-btn');
      if (btn) btn.textContent = 'checking against the library…';
      try { match = await contribSemanticCheck(text, meaning); } catch (e) { match = null; }
      if (btn) btn.textContent = 'Add to the library →';
    }
    if (match) {
      contribDupWarn = { match, text, meaning, when: (document.getElementById('contrib-when')?.value || '').trim() };
      renderContribute();
      return;
    }
  }
  const mine = _loadContribs();
  const meaning = (document.getElementById('contrib-meaning')?.value || '').trim() || (contribDupWarn && contribDupWarn.meaning) || '';
  mine.push({
    kind: contribKind,
    prompt: contribKind === 'prompt'
      ? CONTRIB_PROMPTS[contribPromptIdx % CONTRIB_PROMPTS.length].en
      : ('Suggested phrase' + (meaning ? ' — ' + meaning : '')),
    when: (document.getElementById('contrib-when')?.value || '').trim() || (contribDupWarn && contribDupWarn.when) || null,
    text,
    tags: { ...contribTags },
    variantOf: (contribDupWarn && contribDupWarn.variant) ? contribDupWarn.match.text : null,
    ts: Date.now(),
  });
  contribDupWarn = null;
  _saveContribs(mine);
  recordActivity();
  contribSubmitted = true;
  renderContribute();
}

function contribAnother() {
  contribSubmitted = false;
  contribDupWarn = null;
  contribPromptIdx++;
  contribTags = { region: (typeof getProfile === 'function' && getProfile().region) || null, generation: null, formality: null };
  renderContribute();
}


// a returned submission goes back to pending after the contributor edits it
function contribResubmit(ts) {
  const all = _loadContribs();
  const item = all.find(c => c.ts === ts);
  if (!item) return;
  const fixed = prompt('Fix it and resubmit — the reviewer said: ' + (item.reviewerNote || item.flagReason || ''), item.text);
  if (!fixed || !fixed.trim()) return;
  item.text = fixed.trim();
  item.status = 'pending';
  item.votes = [];
  item.resubmitted = true;
  _saveContribs(all);
  renderContribute();
}


// §17.4 — AI suggests domain/tier/register from the raw text; the human
// confirms. Region and generation stay human-only (they are personal facts).
async function contribSuggestTags() {
  const text = (document.getElementById('contrib-text')?.value || '').trim();
  if (!text) { document.getElementById('contrib-text')?.focus(); return; }
  const btn = document.getElementById('contrib-suggest-btn');
  const out = document.getElementById('contrib-suggest-out');
  if (btn) btn.textContent = 'thinking…';
  try {
    const meaning = (document.getElementById('contrib-meaning')?.value || '').trim();
    const sug = await coachEvaluate(buildTagSuggestRequest(text, meaning));
    if (out) out.textContent = `suggested: ${sug.domain} · ${sug.tier} · ${sug.register} — ${sug.reasoning} (tap the pills below to confirm or change)`;
    // pre-select the matching register pill when one exists
    const regMap = { 'warm/family': 'Warm/family', 'respectful/formal': 'Respectful/formal', 'playful/teasing': 'Playful/teasing' };
    if (regMap[sug.register]) contribTags.formality = regMap[sug.register];
  } catch (e) {
    if (out) out.textContent = 'could not reach the tagger — pick tags by hand.';
  }
  if (btn) btn.textContent = '✧ suggest tags (AI proposes, you confirm)';
}
