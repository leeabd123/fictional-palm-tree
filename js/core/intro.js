// ══════════════════════════════════════════════
// FIRST-RUN INTRO — the §8 spec: orb, السلام عليكم, the learner says it
// back, hears the Sudanese response, first win under 45 seconds, then a
// light comfort self-report that seeds the domain/tier starting point.
// Every Arabic line here matches the native-corrected scenario content.
// ══════════════════════════════════════════════

let introStage = 1;
let introInput = '';

function introNeeded() {
  try { return !localStorage.getItem('tariga_intro_v1'); } catch (e) { return false; }
}

function introFinish(skip) {
  if (!skip) {
    const name = (document.getElementById('intro-name')?.value || '').trim();
    const p = getProfile();
    if (name) p.name = name;
    p.comfort = window._introComfort || p.comfort || null;
    // §28.4 — regional background connects them to the map and, later,
    // to contributing ("since your family's from Omdurman…")
    p.region = window._introRegion || p.region || null;
    saveProfile(p);
  }
  try { localStorage.setItem('tariga_intro_v1', '1'); } catch (e) {}
  document.getElementById('intro-overlay')?.remove();
}

function introSetComfort(v, btn) {
  window._introComfort = v;
  document.querySelectorAll('#intro-comfort .d2-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

function introSetRegion(v, btn) {
  window._introRegion = window._introRegion === v ? null : v;
  document.querySelectorAll('#intro-region .d2-tab').forEach(b => b.classList.remove('on'));
  if (window._introRegion) btn.classList.add('on');
}

function introNext() {
  const inp = document.getElementById('intro-input');
  if (introStage === 1 && inp) introInput = inp.value.trim();
  introStage++;
  renderIntroOverlay();
}

function introMic() {
  prodMic('intro-mic', (t) => {
    const inp = document.getElementById('intro-input');
    introInput = (introInput ? introInput + ' ' : '') + t;
    if (inp) inp.value = introInput;
  });
}

function renderIntroOverlay() {
  let el = document.getElementById('intro-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'intro-overlay';
    el.className = 'intro-overlay';
    document.body.appendChild(el);
  }
  if (introStage === 1) {
    el.innerHTML = `
      <div class="intro-col">
        <span class="intro-orb"><tariga-orb mode="listening"></tariga-orb></span>
        <div class="intro-ar">السلام عليكم</div>
        <div class="intro-ph">as-salamu alaykum</div>
        <div class="intro-en">Peace be upon you</div>
        <div class="intro-try">Try saying it back — out loud or typed. Arabizi counts.</div>
        <div class="c2-textbox intro-box">
          <textarea id="intro-input" dir="auto" rows="1" placeholder="السلام عليكم … or salam alaykum"></textarea>
          <div class="c2-textbox-row">
            ${typeof coachMicSupported === 'function' && coachMicSupported() ? `<button class="c2-mic-small" id="intro-mic" onclick="introMic()">${UI_MIC}</button>` : ''}
            <span style="flex:1"></span>
            <button class="c2-compare" onclick="introNext()">Say it →</button>
          </div>
        </div>
        <button class="c2-linklike intro-skip" onclick="introFinish(true)">skip intro</button>
      </div>`;
  } else if (introStage === 2) {
    el.innerHTML = `
      <div class="intro-col">
        <span class="intro-orb intro-glow"><tariga-orb mode="idle"></tariga-orb></span>
        <div class="intro-nice">Nice. In Sudan, you'd usually hear back:</div>
        <div class="intro-ar">وعليكم السلام ورحمة الله</div>
        <div class="intro-ph">wa 3alaykum as-salam wa rahmatu llah</div>
        <div class="intro-en">And peace be upon you, and God's mercy</div>
        <button class="c2-linklike" onclick="sayAr('${encodeURIComponent('وعليكم السلام ورحمة الله')}')">${UI_SPK} hear it</button>
        <div class="intro-try">Say it back. Twice is even better — that's your first exchange done.</div>
        <div class="d2-pill-row"><button class="c2-compare" onclick="introNext()">Continue →</button></div>
      </div>`;
  } else {
    el.innerHTML = `
      <div class="intro-col">
        <span class="intro-orb"><tariga-orb mode="idle"></tariga-orb></span>
        <div class="intro-nice">One last thing — so the path starts where you are.</div>
        <input id="intro-name" class="f2-p-input intro-name" placeholder="Your name (optional)">
        <div class="intro-try">How comfortable do you feel talking to family in Sudanese Arabic?</div>
        <div class="d2-tab-row" id="intro-comfort" style="justify-content:center">
          <button class="d2-tab" onclick="introSetComfort('none', this)">Not at all</button>
          <button class="d2-tab" onclick="introSetComfort('little', this)">A little</button>
          <button class="d2-tab" onclick="introSetComfort('good', this)">Pretty good</button>
        </div>
        <div class="intro-try" style="margin-top:14px">Where's your family from? (optional — it lights up your region on the map)</div>
        <div class="d2-tab-row" id="intro-region" style="justify-content:center">
          ${['Khartoum', 'Omdurman', 'Port Sudan', 'North', 'West'].map(rg =>
            `<button class="d2-tab" onclick="introSetRegion('${rg}', this)">${rg}</button>`).join('')}
        </div>
        <div class="d2-pill-row"><button class="c2-compare" onclick="introFinish(false)">Start learning →</button></div>
      </div>`;
  }
}

function maybeShowIntro() {
  if (!introNeeded()) return;
  introStage = 1;
  renderIntroOverlay();
}
