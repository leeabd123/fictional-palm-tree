// Contribute — the community contribution pipeline (front-end flow, local-only).
// Design per the research doc: micro-tasks not open-ended asks, variation tagged
// by region/generation/formality, and the 2-3 native-reviewer trust threshold
// stated up front. Submissions persist locally as "pending review" until the
// real backend exists — the flow itself is the product evidence.

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
let contribTags = { region: null, generation: null, formality: null };

function _loadContribs() {
  try { return JSON.parse(localStorage.getItem(CONTRIB_KEY) || '[]'); } catch (e) { return []; }
}
function _saveContribs(list) {
  try { localStorage.setItem(CONTRIB_KEY, JSON.stringify(list)); } catch (e) {}
}

function renderContribute() {
  const ca = document.getElementById('content-area');
  const prompt = CONTRIB_PROMPTS[contribPromptIdx % CONTRIB_PROMPTS.length];
  const mine = _loadContribs();

  if (contribSubmitted) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <div class="contrib-thanks">
          <div class="contrib-thanks-icon">🫶</div>
          <div class="contrib-thanks-title">شكراً — that's one more phrase preserved</div>
          <div class="contrib-thanks-body">Your phrasing joins the review queue. It goes live for learners once <b>2–3 independent native speakers</b> confirm it sounds natural — no single person's judgment, ever.<br><br><i>(In this prototype the queue is stored on your device; the live review pipeline is the next build.)</i></div>
          <div class="coach-fb-actions" style="margin-top:20px">
            <button class="btn btn-accent" onclick="contribAnother()">Answer another prompt →</button>
          </div>
        </div>
        ${contribMineHTML(mine)}
      </div>`;
    return;
  }

  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="contrib-hero">
        <div class="contrib-hero-title">Help preserve Sudanese Arabic</div>
        <div class="contrib-hero-sub">One prompt. One answer, the way <b>your family</b> actually says it.<br>Two minutes of your fluency becomes someone else's bridge home.</div>
      </div>

      <div class="contrib-card">
        <div class="contrib-step">The prompt · ${(contribPromptIdx % CONTRIB_PROMPTS.length) + 1} of ${CONTRIB_PROMPTS.length}</div>
        <div class="contrib-q">${escAttr(prompt.en)}</div>
        <div class="contrib-q-ar">${escAttr(prompt.ar)}</div>
        <div style="text-align:right;margin-top:8px">
          <button class="coach-reveal-link" onclick="contribSkip()">different prompt ↻</button>
        </div>
      </div>

      <div class="contrib-card">
        <div class="contrib-step">Your natural answer</div>
        <textarea id="contrib-text" class="contrib-textarea" dir="auto"
          placeholder="اكتب الرد زي ما أهلك بقولوه… (Arabic script or Arabizi — write it how it's actually said, not how it's 'supposed' to be said)"></textarea>
        <div class="contrib-note">🎙️ Voice recording lands with the community release — spoken answers carry the rhythm text can't.</div>
      </div>

      <div class="contrib-card">
        <div class="contrib-step">Tag the variation <span style="text-transform:none;letter-spacing:0;color:var(--text3)">— because there is no single "correct way"</span></div>
        <div class="contrib-note" style="margin:0 0 6px">Region</div>
        <div class="contrib-tag-row">${['Khartoum','Omdurman','North','East','West','Diaspora mix'].map(t =>
          `<button class="contrib-tag ${contribTags.region === t ? 'on' : ''}" onclick="contribTag('region','${t}')">${t}</button>`).join('')}
        </div>
        <div class="contrib-note" style="margin:12px 0 6px">Whose voice is this?</div>
        <div class="contrib-tag-row">${['Grandparents say it','Parents say it','My generation'].map(t =>
          `<button class="contrib-tag ${contribTags.generation === t ? 'on' : ''}" onclick="contribTag('generation','${t}')">${t}</button>`).join('')}
        </div>
        <div class="contrib-note" style="margin:12px 0 6px">Register</div>
        <div class="contrib-tag-row">${['Warm/family','Respectful/formal','Playful/teasing'].map(t =>
          `<button class="contrib-tag ${contribTags.formality === t ? 'on' : ''}" onclick="contribTag('formality','${t}')">${t}</button>`).join('')}
        </div>
      </div>

      <div class="coach-fb-actions">
        <button class="btn btn-accent" style="padding:12px 30px" onclick="contribSubmit()">Add it to the review queue →</button>
      </div>
      <div class="contrib-note" style="text-align:center;margin-top:10px">Goes live only after 2–3 independent native speakers confirm it sounds natural.</div>

      ${contribMineHTML(mine)}
    </div>
  `;
}

function contribMineHTML(mine) {
  if (!mine.length) return '';
  return `
    <div style="margin-top:34px">
      <div class="coach-fb-section-label">Your contributions</div>
      ${mine.slice().reverse().map(c => `
        <div class="contrib-pending">
          <div class="contrib-pending-text" dir="auto">${escAttr(c.text)}
            <div class="contrib-pending-meta">${escAttr(c.prompt)} · ${[c.tags.region, c.tags.generation, c.tags.formality].filter(Boolean).map(escAttr).join(' · ') || 'untagged'}</div>
          </div>
          <span class="contrib-status">pending review · 0/2</span>
        </div>`).join('')}
    </div>`;
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

function contribSubmit() {
  const text = (document.getElementById('contrib-text')?.value || '').trim();
  if (!text) {
    const ta = document.getElementById('contrib-text');
    if (ta) { ta.focus(); ta.style.borderColor = 'var(--red)'; setTimeout(() => ta.style.borderColor = '', 1200); }
    return;
  }
  const mine = _loadContribs();
  mine.push({
    prompt: CONTRIB_PROMPTS[contribPromptIdx % CONTRIB_PROMPTS.length].en,
    text,
    tags: { ...contribTags },
    ts: Date.now(),
  });
  _saveContribs(mine);
  contribSubmitted = true;
  renderContribute();
}

function contribAnother() {
  contribSubmitted = false;
  contribPromptIdx++;
  contribTags = { region: null, generation: null, formality: null };
  renderContribute();
}
