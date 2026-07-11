// Home — domain-first, single recommended action (learning-design doc §2).
// One "Today's focus" card up top; everything else lives below the fold as
// the practice library, not competing for attention.

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

function homeStart() {
  const focus = nextFocus(focusDomain());
  if (focus.kind === 'guided') guidedOpen(focus.id);
  else if (focus.kind === 'call') callOpen(focus.id);
  else setMode('speak');
}

function renderHome() {
  const ca = document.getElementById('content-area');
  const g = homeGreeting();
  const profile = getProfile();
  const streak = getStreak();
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];
  const focus = nextFocus(focusDomain());
  const gDone = Object.keys(getGuidedProgress()).length;
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

      <div class="home-greet-ar">${g.ar}${profile.name ? '' : ''}</div>
      <div class="home-greet-ph">${g.ph}</div>
      <div class="home-greet-en">${profile.name ? escAttr(profile.name) + ' — ' : ''}${g.en}</div>

      ${typeof warmupAvailable === 'function' && warmupAvailable() ? `
      <button class="home-focus" style="width:100%;text-align:left;cursor:pointer;border-color:rgba(79,216,196,.3)" onclick="warmupStart()">
        <div class="home-focus-label" style="color:var(--teal)">Welcome back — ease in first</div>
        <div class="home-focus-title" style="font-size:18px">A ${warmupBuildSteps().length}-phrase warm-up from your own history</div>
        <div class="home-focus-sub">review before new material — the forgetting curve is real ›</div>
      </button>` : ''}

      <div class="home-focus">
        <div class="home-focus-label">Today's focus · ${dm.label}</div>
        <div class="home-focus-title">${escAttr(focus.title)}</div>
        <div class="home-focus-sub">${escAttr(focus.sub)}</div>
        <button class="home-cta" style="margin:14px 0 0" onclick="homeStart()">
          <span class="home-cta-orbwrap"><tariga-orb mode="idle"></tariga-orb></span>
          <span class="home-cta-body">
            <span class="home-cta-title">Start</span>
            <span class="home-cta-sub">يلا نتكلم (yalla nitkallam) — let's talk</span>
          </span>
          <span class="home-cta-chev">›</span>
        </button>
      </div>

      <div class="home-path-label" style="margin-top:22px">EXPLORE OTHER DOMAINS</div>
      <div class="home-domains">
        ${DOMAINS.map(d2 => `
          <button class="d2-tab ${d2.id === focusDomain() ? 'on' : ''}" ${d2.live ? `onclick="setFocusDomain('${d2.id}');renderHome()"` : 'disabled'}
            title="${escAttr(d2.desc)}" style="${d2.live ? '' : 'opacity:.45;cursor:default'}">
            ${d2.icon} ${d2.label}${d2.live ? '' : ' · soon'}
          </button>`).join('')}
      </div>

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
          <div class="home-stat-row"><span>Guided practiced</span><b class="c-teal">${gDone}</b></div>
          <div class="home-stat-row"><span>Coach attempts</span><b class="c-gold">${attempts}</b></div>
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

      <div class="home-path-label">PRACTICE LIBRARY</div>
      <div class="home-grid">
        ${homeCard('guided', '🤲', 'Guided', GUIDED_SCENARIOS.length + ' scenarios · 5 domains', true)}
        ${homeCard('speak', '🎙️', 'Your coach', 'Free scenarios · AI coaching')}
        ${homeCard('flash', '🃏', 'Flashcards', deck.length + ' in deck')}
        ${homeCard('listen', '👂', 'Tune your ear', 'podcast lines')}
        ${homeCard('journey', '✦', 'Your journey', 'then → now')}
        ${homeCard('convo', '🎧', 'Conversation', 'the real podcast')}
        ${homeCard('contribute', '🫶', 'Contribute', 'preserve it · one prompt')}
        ${homeCard('deep', '📚', 'Deep cards', 'synonyms & context')}
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
    <button class="home-card ${glow ? 'home-card-glow' : ''}" onclick="${mode === 'guided' ? 'setMode(\'guided\')' : `setMode('${mode}')`}">
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
