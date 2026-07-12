// ══════════════════════════════════════════════
// THE TUTOR AGENT (§29.5) — browser-local edition.
// Goes beyond the fixed tier-progression rules: reads this browser's real
// attempt history (many sessions, not one percentage), looks for the
// qualitative pattern a static rule can't see ("struggles with register
// specifically, not vocabulary broadly"), and queries the scenario catalog
// to recommend targeted next steps — including resurfacing something
// previously struggled with, or skipping ahead on clear mastery.
// Honest limit, per the doc's own dependency note: memory lives in THIS
// browser until user accounts (§28.1) exist. It never invents Arabic —
// it only picks from the verified catalog.
// ══════════════════════════════════════════════

let tutorResult = null;
let tutorBusy = false;

// compress this browser's history into something small enough to send
function tutorHistorySummary() {
  const all = _loadAttempts();
  const lines = [];
  Object.entries(all).forEach(([qen, atts]) => {
    if (!atts.length) return;
    const first = atts[0], last = atts[atts.length - 1];
    const avg = (k) => (atts.reduce((n, a) => n + (a.metrics[k] || 0), 0) / atts.length).toFixed(1);
    lines.push(`- "${qen.slice(0, 70)}": ${atts.length} attempt(s), natural ${naturalScore(first.metrics)}→${naturalScore(last.metrics)}, avg english-mixed ${avg('english')}, avg MSA-sounding ${avg('msa')}, avg transitions used ${avg('transitions')}, avg chunks used ${avg('chunks')}, missed-transition flags ${avg('missedTransitions')}`);
  });
  const done = getGuidedProgress();
  const g = GUIDED_SCENARIOS.filter(x => done[x.id]);
  if (g.length) lines.push(`Guided scenarios practiced: ${g.map(x => x.id).join(', ')}`);
  return lines.join('\n');
}

function tutorCatalog() {
  return GUIDED_SCENARIOS.map(g =>
    `${g.id} | ${g.domain} | ${g.tier} | ${g.title}${g.register_note ? ' | register: ' + g.register_note : ''}`).join('\n');
}

function tutorHasHistory() {
  return totalAttemptCount() >= 2 || Object.keys(getGuidedProgress()).length >= 2;
}

const TUTOR_SCHEMA = {
  type: 'object',
  properties: {
    observation: { type: 'string', description: 'the one qualitative pattern you noticed in their history, specific not generic, warm' },
    focus: { type: 'string', description: 'the single skill to work on next, in plain words' },
    recommendations: {
      type: 'array', minItems: 1, maxItems: 3,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'a scenario id copied EXACTLY from the catalog' },
          why: { type: 'string', description: 'one short sentence tying this pick to the observed pattern' },
        },
        required: ['id', 'why'], additionalProperties: false,
      },
    },
    encouragement: { type: 'string', description: 'one warm line — comparison never judgment' },
  },
  required: ['observation', 'focus', 'recommendations', 'encouragement'],
  additionalProperties: false,
};

async function tutorAsk() {
  if (tutorBusy) return;
  tutorBusy = true; tutorResult = null;
  renderJourney();
  try {
    const res = await coachEvaluate({
      system: `You are the Tariga tutor — a recommendation agent for a Sudanese Arabic heritage-speaker coach. You are given a learner's real practice history and the scenario catalog. Find the qualitative pattern a static rule would miss (e.g. "code-switches specifically in hospitality moments", "strong vocabulary but avoids asking questions back", "register slips with elders"). Then pick 1-3 catalog scenarios that target it — resurfacing a previously-struggled item and skipping ahead on clear mastery are both allowed; you are not bound to tier order. Rules: recommendation ids MUST be copied exactly from the catalog; never invent Arabic content; tone is comparison-never-judgment, warm, specific.`,
      messages: [{ role: 'user', content: `PRACTICE HISTORY (this browser):\n${tutorHistorySummary()}\n\nSCENARIO CATALOG (id | domain | tier | title):\n${tutorCatalog()}` }],
      output_schema: TUTOR_SCHEMA,
      max_tokens: 700,
    });
    // keep only recommendations that resolve to real catalog items
    res.recommendations = (res.recommendations || []).filter(r => GUIDED_SCENARIOS.some(g => g.id === r.id));
    tutorResult = res;
    if (typeof logEvent === 'function') logEvent('tutor_ask', { recs: res.recommendations.length });
  } catch (e) {
    tutorResult = { error: true };
  }
  tutorBusy = false;
  renderJourney();
}

function tutorPanelHTML() {
  if (!apiConfigured() || !tutorHasHistory()) return '';
  return `
    <div class="d2-card" style="padding:18px;margin-top:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <div style="font-size:14.5px;font-weight:600;color:var(--text)">🎓 Your tutor's read</div>
          <div class="d2-item-note" style="margin-top:3px">looks across your whole history for the pattern a progress bar can't see · memory lives in this browser for now</div>
        </div>
        <button class="c2-ghost-pill" onclick="tutorAsk()" ${tutorBusy ? 'disabled' : ''}>${tutorBusy ? 'reading your history…' : tutorResult ? 'read it again ↻' : 'ask the tutor →'}</button>
      </div>
      ${tutorResult && !tutorResult.error ? `
      <div style="border-top:1px solid rgba(255,255,255,.06);margin-top:14px;padding-top:12px">
        <div class="d2-when-body" style="margin-bottom:8px"><b style="color:var(--accent2)">Noticed:</b> ${escAttr(tutorResult.observation)}</div>
        <div class="d2-when-body" style="margin-bottom:12px"><b style="color:var(--teal)">Work on:</b> ${escAttr(tutorResult.focus)}</div>
        ${tutorResult.recommendations.map(rec => {
          const g = GUIDED_SCENARIOS.find(x => x.id === rec.id);
          return `
        <button class="journey-row" style="width:100%" onclick="guidedOpen('${g.id}')">
          <span class="journey-row-body">
            <span class="journey-row-q">${escAttr(g.title)}</span>
            <span class="journey-row-meta">${escAttr(rec.why)}</span>
          </span>
          <span class="home-cta-chev">›</span>
        </button>`;
        }).join('')}
        <div class="c2-encourage" style="margin-top:10px">${escAttr(tutorResult.encouragement)}</div>
      </div>` : tutorResult && tutorResult.error ? `
      <div class="d2-item-note" style="margin-top:10px;color:#e0b3a8">couldn't reach the tutor — your history is safe, try again in a moment</div>` : ''}
    </div>`;
}
