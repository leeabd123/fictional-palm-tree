// ══════════════════════════════════════════════
// THEME — the design handoff ships two complete visual systems:
//   A · Warm "candlelit"  (default — the app's own language)
//   B · Neon "Ink-Navy Glass" / FUI
// The README says apply one consistently — so the theme is a single
// switch and each system applies everywhere while active. Neon swaps
// the tokens (canvas, glass, glow, Space Grotesk / IBM Plex Sans Arabic)
// and unlocks the System-B-only structures: the 3a daily gate, the 3b
// stats widget, circuit orbits (6c), the HUD telemetry tile (6d), the
// orb-as-mic coach (3c/3d/6e) and the word-origins boot state (6b).
// ══════════════════════════════════════════════

const THEME_KEY = 'tariga_theme_v1';

function neonOn() {
  try { return localStorage.getItem(THEME_KEY) === 'neon'; } catch (e) { return false; }
}

function themeApply() {
  document.body.classList.toggle('neon', neonOn());
}

function themeSet(t) {
  try { t === 'neon' ? localStorage.setItem(THEME_KEY, 'neon') : localStorage.removeItem(THEME_KEY); } catch (e) {}
  themeApply();
  if (typeof logEvent === 'function') logEvent('theme_set', { theme: t });
  if (typeof render === 'function') render();
}

// neon domain accents (README System B) — warm accents live in DM_CFG
const DM_NEON = {
  family: '#fbbf24', friends: '#2de3c3', community: '#4ade80',
  identity: '#a78bfa', culture: '#fb7185',
};

themeApply();
