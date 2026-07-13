// Home — domain-first, single recommended action (learning-design doc §2).
// One "Today's focus" card up top; everything else lives below the fold as
// the practice library, not competing for attention.

const SRC_LABELS = {
  v1: ['Solja episode', '89 phrases from ونسا مع أس (Wansa ma3 Us)'],
  v2: ['Ala episode', 'phrases from the Ala Al-Shareef episode'],
  all: ['Both episodes', 'the full combined deck'],
  p2: ['Sudanese glossary', 'slang & essentials glossary'],
  extra: ['Deep vocab bank', 'deep cuts from both transcripts'],
  starred: ['My starred', 'cards, words & sentences you starred yourself'],
};
const SRC_ORDER = ['v1', 'v2', 'all', 'p2', 'extra', 'starred'];

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

// ── The gate / dashboard split (handoff 3a·4d + 3b) ──
// The daily gate has ONE job: hit Start. It shows on the first open of
// each day; every visit after that lands straight on the home dashboard.
const GATE_KEY = 'tariga_gate_day_v1';
function _homeToday() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
function gateSeenToday() {
  try { return localStorage.getItem(GATE_KEY) === _homeToday(); } catch (e) { return true; }
}
function gateMarkSeen() {
  try { localStorage.setItem(GATE_KEY, _homeToday()); } catch (e) {}
}

function renderHome() {
  if (gateSeenToday()) { renderHomeDashboard(); return; }
  gateMarkSeen();
  renderHomeGate();
}

// §22 — the gate is a DECISION-MAKER, not an overview: one clear
// recommended next step and a single deliberate door to exploration.
function renderHomeGate() {
  const ca = document.getElementById('content-area');
  const g = homeGreeting();
  const profile = getProfile();
  const streak = getStreak();
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];
  const focus = nextFocus(focusDomain());

  // System B — the 3a daily gate: single-viewport first-open screen
  if (typeof neonOn === 'function' && neonOn()) {
    ca.innerHTML = `
    <div class="home-wrap" style="display:flex;flex-direction:column;min-height:calc(100vh - 120px);position:relative;z-index:1">
      <div style="position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:480px;height:380px;border-radius:50%;background:radial-gradient(circle, rgba(139,92,246,0.14), transparent 65%);filter:blur(46px);pointer-events:none"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;position:relative">
        <div>
          <div style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:22px;color:#eef2f8">طريقة</div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;letter-spacing:.28em;color:#5b6272;margin-top:2px">SUDANESE ARABIC TRAINER</div>
        </div>
        ${streak ? `<div style="display:flex;align-items:center;gap:7px;font-family:'Space Grotesk',sans-serif;font-size:11px;color:#00ff87;border:1px solid rgba(0,255,135,0.3);padding:6px 13px;border-radius:100px;text-shadow:0 0 14px rgba(0,255,135,0.5)"><span style="width:7px;height:7px;border-radius:50%;background:#00ff87;box-shadow:0 0 10px #00ff87"></span>${streak}-day streak</div>` : ''}
      </div>

      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center;position:relative;padding:40px 0">
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:clamp(38px,11vw,50px);font-weight:600;color:#fff;line-height:1.5">${g.ar}</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:13px;color:#a78bfa;margin-top:10px;text-shadow:0 0 16px rgba(167,139,250,0.5)">${g.ph}</div>
        <div style="font-size:12.5px;color:#8b93a3;margin-top:8px">${profile.name ? escAttr(profile.name) + ' — ' : ''}${g.en}</div>
      </div>

      ${typeof warmupAvailable === 'function' && warmupAvailable() ? `
      <button onclick="warmupStart()" style="width:100%;text-align:left;margin-bottom:12px;padding:14px 18px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(45,212,191,0.35);backdrop-filter:blur(16px);cursor:pointer;color:#eef2f8;font-family:inherit">
        <span style="display:block;font-family:'Space Grotesk',sans-serif;font-size:10px;letter-spacing:.2em;color:#2dd4bf">WELCOME BACK — EASE IN FIRST</span>
        <span style="display:block;font-size:14px;font-weight:600;margin-top:5px">A ${warmupBuildSteps().length}-phrase warm-up from your own history ›</span>
      </button>` : ''}

      <div style="padding:20px;border-radius:24px;background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.09);backdrop-filter:blur(20px);position:relative">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:10px;letter-spacing:.22em;color:#818cf8">TODAY'S FOCUS · ${escAttr(dm.label.toUpperCase())}</div>
        <div style="font-size:24px;font-weight:700;color:#fff;margin-top:8px;line-height:1.3">${escAttr(focus.title)}</div>
        <div style="font-size:12px;color:#8b93a3;margin-top:5px">${escAttr(focus.sub)}</div>
        <div style="height:1px;background:rgba(255,255,255,0.07);margin:16px 0"></div>
        <button onclick="homeStart()" style="display:flex;align-items:center;gap:14px;width:100%;padding:13px 18px;border:none;border-radius:16px;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);box-shadow:0 0 44px -10px rgba(168,85,247,0.7);cursor:pointer;color:#fff;font-family:'Space Grotesk',sans-serif">
          <span style="flex:1;text-align:left">
            <span style="display:block;font-size:15px;font-weight:700">Start</span>
            <span style="display:block;font-size:11px;opacity:.85;margin-top:2px">يلا نتكلم — let's talk</span>
          </span>
          <span style="width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0;display:block"><tariga-orb mode="idle" style="width:100%;height:100%;display:block"></tariga-orb></span>
        </button>
      </div>
      <div style="text-align:center;margin-top:14px">
        <button class="c2-linklike" onclick="setMode('tree')" style="color:#5b6272">Explore the domain map instead →</button>
      </div>
    </div>`;
    return;
  }

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

      <div style="text-align:center;margin-top:16px">
        <button class="c2-linklike" onclick="setMode('tree')">Explore the domain map instead →</button>
      </div>

      <div class="d2-item-note" style="text-align:center;margin:18px 0 8px">tip: press &amp; hold any Arabic word, anywhere in the app, to look it up and star it</div>
      <div style="text-align:center;margin:4px 0 14px">
        <button class="c2-linklike" onclick="setMode('about')">how Tariga works — the research behind it →</button>
      </div>
    </div>
  `;
}

// ── The home dashboard (handoff 3b, in both systems) — what home is for
// the rest of the day once the gate has done its one job. ──
function renderHomeDashboard() {
  const ca = document.getElementById('content-area');
  const g = homeGreeting();
  const profile = getProfile();
  const streak = getStreak();
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];
  const focus = nextFocus(focusDomain());
  const gDone = Object.keys(getGuidedProgress()).length;
  const coached = Object.keys(JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}')).length;
  const attempts = totalAttemptCount();
  const starredN = (typeof starredDeckCount === 'function') ? starredDeckCount() : starredItems.size;
  const pct = Math.min(100, Math.round((coached / SPEAK_QA.length) * 100));

  if (typeof neonOn === 'function' && neonOn()) {
    // 3b — cosmic header, greeting, unified stats widget, 2×2 path grid
    ca.innerHTML = `
    <div class="home-wrap" style="position:relative;z-index:1">
      <div style="position:absolute;top:-140px;left:50%;transform:translateX(-50%);width:520px;height:400px;border-radius:50%;background:radial-gradient(circle, rgba(139,92,246,0.14), transparent 62%);filter:blur(46px);pointer-events:none"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;position:relative">
        <div style="font-family:'Space Grotesk',sans-serif;font-size:9px;letter-spacing:.28em;color:#5b6272">طريقة · SUDANESE ARABIC TRAINER</div>
        ${streak ? `<div style="display:flex;align-items:center;gap:7px;font-family:'Space Grotesk',sans-serif;font-size:11px;color:#00ff87;border:1px solid rgba(0,255,135,0.3);padding:5px 12px;border-radius:100px"><span style="width:6px;height:6px;border-radius:50%;background:#00ff87;box-shadow:0 0 10px #00ff87"></span>${streak}-day streak</div>` : ''}
      </div>
      <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:40px;font-weight:600;color:#fff;margin-top:22px;line-height:1.4">${g.ar}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:12px;color:#a78bfa;margin-top:6px">${g.ph}${profile.name ? ' · ' + escAttr(profile.name) : ''}</div>
      ${typeof warmupAvailable === 'function' && warmupAvailable() ? `
      <button onclick="warmupStart()" style="width:100%;text-align:left;margin-top:16px;padding:13px 16px;border-radius:18px;background:rgba(255,255,255,0.04);border:1px solid rgba(45,212,191,0.35);cursor:pointer;color:#eef2f8;font-family:'Space Grotesk',sans-serif">
        <span style="display:block;font-size:9.5px;letter-spacing:.2em;color:#2dd4bf">WELCOME BACK — EASE IN FIRST</span>
        <span style="display:block;font-size:13.5px;font-weight:600;margin-top:4px">A ${warmupBuildSteps().length}-phrase warm-up from your own history ›</span>
      </button>` : ''}
      ${homeExploreHTML()}
      <div style="text-align:center;margin:16px 0">
        <button class="c2-linklike" onclick="setMode('tree')" style="color:#5b6272">the domain map — your whole journey →</button>
      </div>
    </div>`;
    return;
  }

  // warm dashboard — the 3b structure in System A language
  const ringC = 2 * Math.PI * 52;
  const pathCard = (m, icon, title, sub, active) => `
    <button onclick="setMode('${m}')" style="text-align:left;padding:16px;border-radius:20px;cursor:pointer;font-family:inherit;
      background:${active ? 'rgba(201,169,110,0.08)' : 'rgba(255,250,242,0.03)'};
      border:1px solid ${active ? 'rgba(201,169,110,0.45)' : 'rgba(255,255,255,0.07)'};
      ${active ? 'box-shadow:0 0 40px -14px rgba(201,169,110,0.6);' : ''}color:${active ? 'var(--text)' : 'var(--text2)'}">
      <span style="display:block;font-size:17px">${icon}</span>
      <span style="display:block;font-size:14px;font-weight:600;margin-top:8px;color:${active ? 'var(--text)' : 'var(--text2)'}">${title}</span>
      <span style="display:block;font-size:10.5px;margin-top:3px;color:${active ? 'var(--accent2)' : 'var(--text3)'}">${sub}</span>
    </button>`;
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

      <div class="home-greet-ar" style="font-size:clamp(26px,7vw,34px) !important">${g.ar}</div>
      <div class="home-greet-ph">${g.ph}${profile.name ? ' · ' + escAttr(profile.name) : ''}</div>

      ${typeof warmupAvailable === 'function' && warmupAvailable() ? `
      <button class="home-focus" style="width:100%;text-align:left;cursor:pointer;border-color:rgba(79,216,196,.3)" onclick="warmupStart()">
        <div class="home-focus-label" style="color:var(--teal)">Welcome back — ease in first</div>
        <div class="home-focus-title" style="font-size:18px">A ${warmupBuildSteps().length}-phrase warm-up from your own history</div>
        <div class="home-focus-sub">review before new material ›</div>
      </button>` : ''}

      <div class="home-focus" style="padding:16px 18px">
        <div class="home-focus-label">Today's focus · ${dm.label}</div>
        <div class="home-focus-title" style="font-size:18px">${escAttr(focus.title)}</div>
        <button class="home-cta" style="margin:12px 0 0;padding:10px 14px" onclick="homeStart()">
          <span class="home-cta-body"><span class="home-cta-title" style="font-size:14px">Start</span></span>
          <span class="home-cta-chev">›</span>
        </button>
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

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
        ${pathCard('flash', '🃏', 'Flashcards', deck.length + ' in deck', false)}
        ${pathCard('speak', '🎙️', 'Your coach', 'scenario ' + Math.min(coached + 1, SPEAK_QA.length) + ' waiting →', true)}
        ${pathCard('listen', '👂', 'Tune your ear', 'podcast lines', false)}
        ${pathCard('journey', '✦', 'Your journey', 'then → now', false)}
      </div>

      <div class="home-path-label" style="margin-top:22px">FULL PRACTICE LIBRARY</div>
      <div class="home-grid">
        ${homeCard('guided', '🤲', 'Guided', GUIDED_SCENARIOS.length + ' scenarios · 5 domains', true)}
        ${homeCard('freeform', comfortUnlocked(focusDomain()) ? '✨' : '🔒', 'Free-form', comfortUnlocked(focusDomain()) ? 'no scaffolding — just you' : 'unlocks at Comfortable tier')}
        ${homeCard('livecall', comfortUnlocked('family') ? '📞' : '🔒', 'Live call', comfortUnlocked('family') ? 'habooba answers for real' : 'unlocks with Family comfort')}
        ${homeCard('tree', '🗺️', 'Domain map', 'your whole journey, one tree')}
        ${homeCard('convo', '🎧', 'Conversation', 'the real podcast')}
        ${homeCard('contribute', '🫶', 'Contribute', 'preserve it · one prompt')}
      </div>

      <button class="home-src" onclick="homeCycleSrc()">
        <span class="home-src-dot"></span>
        <span class="home-src-body">
          <span class="home-src-title">${srcInfo[0]}</span>
          <span class="home-src-sub">${srcInfo[1]}</span>
        </span>
        <span class="home-src-switch">switch ›</span>
      </button>

      <div style="text-align:center;margin:14px 0">
        <button class="c2-linklike" onclick="setMode('about')">how Tariga works — the research behind it →</button>
      </div>
    </div>
  `;
}

// the exploration half of the §22 split — rendered by the Domain Map screen
function homeExploreHTML() {
  const gDone = Object.keys(getGuidedProgress()).length;
  const coached = Object.keys(JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}')).length;
  const attempts = totalAttemptCount();
  const starredN = (typeof starredDeckCount === 'function') ? starredDeckCount() : starredItems.size;
  const totalScenarios = SPEAK_QA.length;
  const pct = Math.min(100, Math.round((coached / totalScenarios) * 100));
  const ringC = 2 * Math.PI * 52;
  const srcInfo = SRC_LABELS[src] || SRC_LABELS.v1;

  // System B — the 3b unified stats widget + 2×2 path grid
  if (typeof neonOn === 'function' && neonOn()) {
    const ring326 = 326;
    const pathCard = (m, icon, title, sub, active) => `
      <button onclick="setMode('${m}')" style="text-align:left;padding:16px;border-radius:20px;cursor:pointer;font-family:'Space Grotesk',sans-serif;
        background:${active ? 'rgba(255,255,255,0.05)' : 'rgba(11,15,25,0.6)'};
        border:1px solid ${active ? 'rgba(34,211,238,0.5)' : 'transparent'};
        ${active ? 'box-shadow:0 0 44px -12px rgba(34,211,238,0.7);' : ''}color:${active ? '#fff' : '#8b93a3'}">
        <span style="display:block;font-size:17px">${icon}</span>
        <span style="display:block;font-size:14px;font-weight:600;margin-top:8px;color:${active ? '#fff' : '#c6ccd8'}">${title}</span>
        <span style="display:block;font-size:10.5px;margin-top:3px;color:${active ? '#22d3ee' : '#5b6272'}">${sub}</span>
      </button>`;
    return `
      <div style="margin-top:26px;padding:18px;border-radius:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(20px);display:flex;gap:18px;align-items:center">
        <div style="position:relative;width:112px;height:112px;flex-shrink:0">
          <svg viewBox="0 0 120 120" style="width:112px;height:112px">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#2dd4bf" stroke-width="8" stroke-linecap="round"
              stroke-dasharray="${ring326}" stroke-dashoffset="${ring326 * (1 - pct / 100)}"
              transform="rotate(-90 60 60)" style="filter:drop-shadow(0 0 8px rgba(45,212,191,.8));animation:ringDraw 1.6s cubic-bezier(.3,.8,.3,1) both"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif">
            <span style="font-size:22px;font-weight:700;color:#fff">${pct}%</span>
            <span style="font-size:8.5px;letter-spacing:.2em;color:#5b6272">COACHED</span>
          </div>
        </div>
        <div style="flex:1;font-family:'Space Grotesk',sans-serif">
          ${[['Guided practiced', gDone, '#34d399'], ['Coach attempts', attempts, '#fbbf24'], ['Starred to review', starredN, '#22d3ee']].map(([label, n, col]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="font-size:11px;letter-spacing:.08em;color:#8b93a3">${label}</span>
            <span style="font-size:19px;font-weight:700;color:${col};text-shadow:0 0 16px ${col}66">${n}</span>
          </div>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
        ${pathCard('flash', '🃏', 'Flashcards', deck.length + ' in deck', false)}
        ${pathCard('speak', '◉', 'Your coach', 'scenario ' + (Math.min(coached + 1, totalScenarios)) + ' waiting →', true)}
        ${pathCard('listen', '≣', 'Tune your ear', 'podcast lines', false)}
        ${pathCard('journey', '✦', 'Your journey', 'then → now', false)}
      </div>

      <div class="home-path-label" style="margin-top:22px">FULL PRACTICE LIBRARY</div>
      <div class="home-grid">
        ${homeCard('guided', '🤲', 'Guided', GUIDED_SCENARIOS.length + ' scenarios · 5 domains', true)}
        ${homeCard('freeform', comfortUnlocked(focusDomain()) ? '✨' : '🔒', 'Free-form', comfortUnlocked(focusDomain()) ? 'no scaffolding — just you' : 'unlocks at Comfortable tier')}
        ${homeCard('livecall', comfortUnlocked('family') ? '📞' : '🔒', 'Live call', comfortUnlocked('family') ? 'habooba answers for real' : 'unlocks with Family comfort')}
        ${homeCard('convo', '🎧', 'Conversation', 'the real podcast')}
        ${homeCard('contribute', '🫶', 'Contribute', 'preserve it · one prompt')}
        ${homeCard('deep', '📚', 'Deep cards', 'synonyms & context')}
      </div>

      <button class="home-src" onclick="homeCycleSrc()">
        <span class="home-src-dot"></span>
        <span class="home-src-body">
          <span class="home-src-title">${srcInfo[0]}</span>
          <span class="home-src-sub">${srcInfo[1]}</span>
        </span>
        <span class="home-src-switch">switch ›</span>
      </button>

      <button class="home-map-card" onclick="setMode('map')">
        <span class="home-map-wrap"><sudan-map highlight="khartoum"></sudan-map></span>
        <span class="home-map-overlay">
          <span class="home-map-title">Word origins — map of Sudan</span>
          <span class="home-map-sub">tap to explore regions ›</span>
        </span>
      </button>`;
  }

  return `
      <div class="home-path-label" style="margin-top:26px">EXPLORE OTHER DOMAINS</div>
      <div class="home-domains">
        ${DOMAINS.map(d2 => `
          <button class="d2-tab ${d2.id === focusDomain() ? 'on' : ''}" ${d2.live ? `onclick="setFocusDomain('${d2.id}');renderTree()"` : 'disabled'}
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
        ${homeCard('freeform', comfortUnlocked(focusDomain()) ? '✨' : '🔒', 'Free-form', comfortUnlocked(focusDomain()) ? 'no scaffolding — just you' : 'unlocks at Comfortable tier')}
        ${homeCard('livecall', comfortUnlocked('family') ? '📞' : '🔒', 'Live call', comfortUnlocked('family') ? 'habooba answers for real' : 'unlocks with Family comfort')}
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
      </button>`;
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
  let i = SRC_ORDER.indexOf(src);
  let next = SRC_ORDER[(i + 1) % SRC_ORDER.length];
  // skip the starred deck while it's empty
  if (next === 'starred' && (typeof starredDeckCount !== 'function' || !starredDeckCount())) {
    next = SRC_ORDER[(i + 2) % SRC_ORDER.length];
  }
  setSrc(next);
  renderHome();
}
