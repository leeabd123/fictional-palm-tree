// ══════════════════════════════════════════════
// APP ENTRY POINT
// Loaded last — wires everything together and boots the app
// ══════════════════════════════════════════════

// ── Archive section toggle (new — keeps secondary modes accessible, not deleted) ──
let archiveOpen = false;

function toggleArchive(){
  archiveOpen = !archiveOpen;
  const panel = document.getElementById('archive-panel');
  const btn = document.getElementById('archive-toggle-btn');
  const chevron = document.getElementById('archive-chevron');
  if(panel) panel.classList.toggle('open', archiveOpen);
  if(btn) btn.classList.toggle('open', archiveOpen);
}

// If a user navigates directly to an archived mode (e.g. from a saved link
// or future deep-link), auto-expand the archive panel so the highlighted
// nav item is actually visible rather than hidden in a collapsed section.
const ARCHIVED_MODES = ['mc', 'deepquiz', 'flow', 'trans', 'vocab', 'ref'];

// Designed screens carry their own headers — hide the legacy top bar +
// stats strip there. Card/quiz modes keep them (the counter is the UI).
const SELF_HEADED_MODES = ['home', 'speak', 'journey', 'listen', 'contribute', 'map', 'flash', 'guided', 'call', 'warmup',
  'shadow', 'build', 'deep', 'starred', 'mc', 'deepquiz', 'flow', 'trans', 'vocab', 'convo'];

const _originalSetMode = setMode;
setMode = function(m){
  // retrigger the page-enter transition so mode switches feel like navigation
  const ca = document.getElementById('content-area');
  if(ca){ ca.classList.remove('page-enter'); void ca.offsetWidth; ca.classList.add('page-enter'); }
  document.body.classList.toggle('chromeless', SELF_HEADED_MODES.includes(m));
  _originalSetMode(m);
  if(ARCHIVED_MODES.includes(m) && !archiveOpen){
    toggleArchive();
  }
  syncTabBar(m);
};

// Bottom tab bar active state follows the mode
const TAB_FOR_MODE = {home:'home', map:'home', guided:'home', call:'home', warmup:'home', flash:'flash', deep:'flash', starred:'flash',
  speak:'speak', shadow:'speak', build:'speak', journey:'journey'};
function syncTabBar(m){
  const tab = TAB_FOR_MODE[m] || 'more';
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('on', b.dataset.tab===tab));
}

// ── Init ──
deck = getSrc();
updStats();
setMode('home');
maybeShowIntro();
