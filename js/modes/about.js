// ══════════════════════════════════════════════
// HOW TARIGA WORKS — the §7 research-grounding page, in plain language.
// For curious learners and investors: every design choice here maps onto
// established second-language-acquisition research. Jargon stays out of
// the main flow; this page is where the receipts live.
// ══════════════════════════════════════════════

// §28 accessibility — opt-in larger type, persisted per browser
const A11Y_KEY = 'tariga_a11y_v1';
function a11yLargeOn() { try { return localStorage.getItem(A11Y_KEY) === 'large'; } catch (e) { return false; } }
function a11yApply() { document.body.classList.toggle('a11y-large', a11yLargeOn()); }
function a11yToggleLarge() {
  try { a11yLargeOn() ? localStorage.removeItem(A11Y_KEY) : localStorage.setItem(A11Y_KEY, 'large'); } catch (e) {}
  a11yApply();
}
a11yApply();

const ABOUT_POINTS = [
  {
    icon: '🗣️', title: 'You learn by speaking, not just understanding',
    body: 'You already understand more than you can say — that gap is the whole problem. Research shows producing language is what actually builds it (the Output Hypothesis). That\'s why every mode in Tariga pushes you to say something before showing you the answer.',
  },
  {
    icon: '🤝', title: 'Comparison, never judgment',
    body: 'A living dialect has no single "correct way" — your khalto in Omdurman and your uncle in Port Sudan say it differently, and both are right. The coach compares your words to how speakers naturally talk, then upgrades YOUR sentence instead of grading it. Research on corrective feedback backs this: modeling the natural form beats blunt correction.',
  },
  {
    icon: '👀', title: 'Noticing the gap is the mechanism',
    body: 'The side-by-side "you said / your answer, upgraded" view isn\'t decoration. Learners only acquire a form once they consciously notice the difference between what they produced and the target (the Noticing Hypothesis). The kept-chips and swaps make that gap impossible to miss — warmly.',
  },
  {
    icon: '🧩', title: 'Struggle first, reveal second',
    body: 'Everything hides the answer until you try — flashcards, shadowing, dictogloss, guided practice. Practice that feels harder in the moment (retrieval before reveal) produces far better long-term retention than being shown answers upfront. Psychologists call these desirable difficulties.',
  },
  {
    icon: '🏠', title: 'Real-life tasks, not grammar sequences',
    body: 'The curriculum is organized around moments that actually happen — your khalto insisting you eat, the Eid call across time zones, a condolence visit — not verb tables. That\'s Task-Based Language Teaching, and it\'s why the phrases stick: you\'ll need them this weekend, not on a test.',
  },
  {
    icon: '🪜', title: 'Support that fades as you grow',
    body: 'Guided practice holds your hand, Scenario mode loosens the grip, Free-form takes the scaffolding away, and the Live call is just you and habooba. Learning happens best just beyond your current ability with support (Vygotsky\'s zone of proximal development) — so the support fades exactly as fast as you don\'t need it.',
  },
  {
    icon: '🔁', title: 'Chunks, connectors, and speed',
    body: 'Fluent speakers don\'t build sentences word by word — they deploy ready-made chunks (إن شاء الله، كتّر خيرك) and connectors (يعني، صراحة) as single units, fast. The coach tracks both as their own dimensions, and timed speed rounds push practiced phrases toward automatic — because the real goal is not freezing mid-sentence at a family dinner.',
  },
  {
    icon: '🫶', title: 'The community is the curriculum',
    body: 'Every phrase traces back to a real speaker — podcast transcripts, native-corrected scenarios, community submissions verified by native ears before going live. Variation across regions and generations isn\'t noise to eliminate; it\'s the data. Nothing here was invented by an AI.',
  },
];

function renderAbout() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="d2-title">How Tariga works</div>
      <div class="d2-note" style="margin-bottom:18px">Every design choice maps onto real language-acquisition research — here it is without the jargon.</div>
      ${ABOUT_POINTS.map(pt => `
        <div class="d2-card" style="padding:20px;margin-bottom:10px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:22px">${pt.icon}</span>
            <div>
              <div style="font-size:14.5px;font-weight:600;color:var(--text)">${pt.title}</div>
              <div class="d2-when-body" style="margin-top:6px">${pt.body}</div>
            </div>
          </div>
        </div>`).join('')}
      <div class="c2-encourage" style="margin-top:16px">None of this matters without the part research can't give you — wanting to talk to your family. That part is yours. 🤍</div>
      <div class="d2-card" style="padding:16px;margin-top:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text)">✨ Look &amp; feel</div>
            <div class="d2-item-note" style="margin-top:3px">two complete design systems from the design handoff — warm "candlelit" (the app's own language) or neon "ink-navy glass"</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="${!neonOn() ? 'd2-pill-gold' : 'c2-ghost-pill'}" onclick="themeSet('warm')">Warm</button>
            <button class="${neonOn() ? 'd2-pill-teal' : 'c2-ghost-pill'}" onclick="themeSet('neon')">Neon</button>
          </div>
        </div>
      </div>
      <div class="d2-card" style="padding:16px;margin-top:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text)">Aa · Larger text</div>
            <div class="d2-item-note" style="margin-top:3px">bigger type everywhere — for elders and anyone who wants it. Animations also calm down automatically when your device asks for reduced motion.</div>
          </div>
          <button class="${a11yLargeOn() ? 'd2-pill-green' : 'c2-ghost-pill'}" onclick="a11yToggleLarge();renderAbout()">${a11yLargeOn() ? 'ON ✓' : 'OFF'}</button>
        </div>
      </div>
      <div style="text-align:center;margin-top:20px">
        <button class="c2-linklike" style="opacity:.55" onclick="setMode('admin')">founder tools →</button>
      </div>
    </div>
  `;
}
