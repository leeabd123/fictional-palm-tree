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

const _originalSetMode = setMode;
setMode = function(m){
  _originalSetMode(m);
  if(ARCHIVED_MODES.includes(m) && !archiveOpen){
    toggleArchive();
  }
};

// ── Init ──
deck = getSrc();
updStats();
render();
