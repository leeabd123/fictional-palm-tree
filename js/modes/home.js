// Home — the design prototype's dashboard, wired to real app state.
// Greeting by time of day, streak, orb CTA into the coach, live progress
// ring, deck source switcher, and the path of modes.

const SRC_LABELS = {
  v1: ['Solja episode', '89 phrases from ونسا مع أس (Wansa ma3 Us)'],
  v2: ['Ala episode', 'phrases from the Ala Al-Shareef episode'],
  all: ['Both episodes', 'the full combined deck'],
  p2: ['Sudanese glossary', 'slang & essentials glossary'],
  extra: ['Deep vocab bank', 'deep cuts from both transcripts'],
};
const SRC_ORDER = ['v1', 'v2', 'all', 'p2', 'extra'];

function homeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { ar: 'صباح النور يا زول', ph: 'sabah an-noor ya zool', en: 'Good morning — your family’s dialect is waiting for you.' };
  if (h < 18) return { ar: 'يا هلا بيك تاني', ph: 'ya hala beek tani', en: 'Welcome back — your family’s dialect is waiting for you.' };
  return { ar: 'مساء النور يا زول', ph: 'masa an-noor ya zool', en: 'Good evening — your family’s dialect is waiting for you.' };
}

function renderHome() {
  const ca = document.getElementById('content-area');
  const g = homeGreeting();
  const streak = getStreak();
  const coached = Object.keys(JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}')).length;
  const attempts = totalAttemptCount();
  const starredN = starredItems.size;
  const totalScenarios = SPEAK_QA.length;
  const pct = Math.min(100, Math.round((coached / totalScenarios) * 100));
  const ringC = 2 * Math.PI * 52;
  const srcInfo = SRC_LABELS[src] || SRC_LABELS.v1;

  ca.innerHTML = `
    <div class="home-wrap">
      <div class="home-head">
        <div>
          <div class="home-logo">طريقة</div>
          <div class="home-logo-sub">SUDANESE ARABIC TRAINER</div>
        </div>
        ${streak ? `<div class="home-streak"><span class="home-streak-dot"></span>${streak}-day streak</div>` : ''}
      </div>
      <div class="home-tagline">طريقة كلامك · TARIGAT KALAMAK · THE WAY YOU SPEAK</div>

      <div class="home-greet-ar">${g.ar}</div>
      <div class="home-greet-ph">${g.ph}</div>
      <div class="home-greet-en">${g.en}</div>

      <button class="home-cta" onclick="setMode('speak')">
        <span class="home-cta-orbwrap"><tariga-orb mode="idle"></tariga-orb></span>
        <span class="home-cta-body">
          <span class="home-cta-title">Practice out loud</span>
          <span class="home-cta-sub">Your coach is always listening — يلا نتكلم (yalla nitkallam)</span>
        </span>
        <span class="home-cta-chev">›</span>
      </button>

      <div class="home-stats">
        <div class="home-ring-wrap">
          <svg viewBox="0 0 120 120" class="home-ring">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#homeRingGrad)" stroke-width="9"
              stroke-linecap="round" stroke-dasharray="${ringC}" stroke-dashoffset="${ringC * (1 - pct / 100)}"
              transform="rotate(-90 60 60)" class="home-ring-fill"/>
            <defs><linearGradient id="homeRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#4fd8c4"/><stop offset="100%" stop-color="#56c98f"/>
            </linearGradient></defs>
          </svg>
          <div class="home-ring-label"><b>${pct}%</b><span>COACHED</span></div>
        </div>
        <div class="home-stat-rows">
          <div class="home-stat-row"><span>Scenarios coached</span><b class="c-teal">${coached}</b></div>
          <div class="home-stat-row"><span>Practice attempts</span><b class="c-gold">${attempts}</b></div>
          <div class="home-stat-row"><span>Starred to review</span><b class="c-green">${starredN}</b></div>
        </div>
      </div>

      <button class="home-src" onclick="homeCycleSrc()">
        <span class="home-src-dot"></span>
        <span class="home-src-body">
          <span class="home-src-title">${srcInfo[0]}</span>
          <span class="home-src-sub">${srcInfo[1]}</span>
        </span>
        <span class="home-src-switch">switch ›</span>
      </button>

      <div class="home-path-label">YOUR PATH</div>
      <div class="home-grid">
        ${homeCard('flash', '🃏', 'Flashcards', '① Build vocab · ' + deck.length + ' in deck')}
        ${homeCard('speak', '🎙️', 'Your coach', '② Speak it · scenario ' + (coachIdx + 1), true)}
        ${homeCard('listen', '👂', 'Tune your ear', '③ Immerse · podcast lines')}
        ${homeCard('journey', '✦', 'Your journey', coached ? 'Then → now · ' + coached + ' scenario' + (coached === 1 ? '' : 's') : 'Then → now · starts with the coach')}
        ${homeCard('convo', '🎧', 'Conversation', 'the real podcast, scene by scene')}
        ${homeCard('contribute', '🫶', 'Contribute', '④ Preserve it · one prompt')}
      </div>

      <button class="home-map-card" onclick="setMode('map')">
        <span class="home-map-wrap"><sudan-map highlight="khartoum"></sudan-map></span>
        <span class="home-map-overlay">
          <span class="home-map-title">Word origins — map of Sudan</span>
          <span class="home-map-sub">Watch the globe find Sudan — tap to explore regions ›</span>
        </span>
      </button>
    </div>
  `;
}

function homeCard(mode, icon, title, sub, glow) {
  return `
    <button class="home-card ${glow ? 'home-card-glow' : ''}" onclick="setMode('${mode}')">
      <span class="home-card-icon">${icon}</span>
      <span class="home-card-title">${title}</span>
      <span class="home-card-sub">${sub}</span>
    </button>`;
}

function homeCycleSrc() {
  const next = SRC_ORDER[(SRC_ORDER.indexOf(src) + 1) % SRC_ORDER.length];
  setSrc(next);
  renderHome();
}
