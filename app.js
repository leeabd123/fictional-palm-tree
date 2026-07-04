/* ══════════════════════════════════════════════
   DESIGN REFRESH — polish layer on top of base.css
   Loaded after base.css, so rules here take priority
   ══════════════════════════════════════════════ */

/* Slightly warmer, more refined surface tones */
:root {
  --shadow-soft: 0 1px 3px rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.2);
  --shadow-lift: 0 8px 24px rgba(0,0,0,.35);
  --transition-smooth: cubic-bezier(.4,0,.2,1);
}

body {
  -webkit-font-smoothing: antialiased;
  letter-spacing: .01em;
}

/* ── Sidebar polish ── */
.sidebar {
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
}

.sidebar-logo {
  transition: background .2s var(--transition-smooth);
}
.sidebar-logo:hover {
  background: var(--surface2);
}

.nav-btn {
  position: relative;
  font-weight: 450;
}
.nav-btn::before {
  content: '';
  position: absolute;
  left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 0;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
  transition: height .2s var(--transition-smooth);
}
.nav-btn.on::before {
  height: 60%;
}
.nav-btn.on {
  background: var(--accent-dim);
  color: var(--accent2);
  font-weight: 500;
}
.nav-btn:hover:not(.on) {
  background: var(--surface2);
  transform: translateX(2px);
}

/* ── Archived section (collapsible, tucked away but never deleted) ── */
.archive-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-top: 14px;
  background: transparent;
  border: 1px dashed var(--border2);
  border-radius: var(--radius-sm);
  color: var(--text3);
  font-family: var(--sans);
  font-size: 12px;
  cursor: pointer;
  transition: all .2s var(--transition-smooth);
}
.archive-toggle:hover {
  color: var(--text2);
  border-color: var(--text3);
}
.archive-chevron {
  width: 14px; height: 14px;
  transition: transform .25s var(--transition-smooth);
}
.archive-toggle.open .archive-chevron {
  transform: rotate(180deg);
}
.archive-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s var(--transition-smooth);
}
.archive-panel.open {
  max-height: 500px;
}
.archive-note {
  font-size: 10.5px;
  color: var(--text3);
  padding: 8px 12px 4px;
  line-height: 1.5;
  font-style: italic;
}
.nav-btn.archived {
  opacity: .8;
}
.nav-btn.archived:hover {
  opacity: 1;
}

/* ── Cards & content polish ── */
.card-face, .mode-card, .trans-card, .starred-item, .dq-question-card,
.speak-question-card, .speak-vocab-panel, .speak-model-answer,
.convo-bubble, .card-static {
  box-shadow: var(--shadow-soft);
  transition: box-shadow .2s var(--transition-smooth);
}

.btn {
  font-weight: 500;
  letter-spacing: .01em;
  transition: all .15s var(--transition-smooth);
}
.btn:hover {
  transform: translateY(-1px);
}
.btn:active {
  transform: translateY(0);
}

.btn-accent {
  box-shadow: 0 2px 12px rgba(201,169,110,.2);
}
.btn-accent:hover {
  box-shadow: 0 4px 18px rgba(201,169,110,.3);
}

/* Smoother stat strip */
.stats-strip {
  backdrop-filter: blur(8px);
}
.stat-n {
  font-variant-numeric: tabular-nums;
  transition: color .3s var(--transition-smooth);
}

/* Progress bar with subtle glow */
.prog-fill {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  box-shadow: 0 0 8px rgba(201,169,110,.4);
}

/* Softer, more readable Arabic text rendering */
.ar-text, .deep-ar-word, .convo-ar, .trans-phrase-ar, .starred-item-ar {
  text-rendering: optimizeLegibility;
}

/* Refined chip interactions */
.speak-chip, .deep-syn-chip, .convo-vc {
  transition: all .18s var(--transition-smooth);
}
.speak-chip:hover, .deep-syn-chip:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}

/* Mode intro screens — softer entrance */
.content-area > div:first-child {
  animation: fadeInUp .35s var(--transition-smooth);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Star button micro-interaction */
.star-btn.starred {
  animation: starPop .3s var(--transition-smooth);
}
@keyframes starPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Mobile menu button polish */
.menu-toggle {
  box-shadow: var(--shadow-lift);
}

/* Scrollbar refinement (webkit) */
.sidebar::-webkit-scrollbar,
.content-area::-webkit-scrollbar {
  width: 6px;
}
.sidebar::-webkit-scrollbar-thumb,
.content-area::-webkit-scrollbar-thumb {
  background: var(--border2);
  border-radius: 3px;
}
.sidebar::-webkit-scrollbar-track,
.content-area::-webkit-scrollbar-track {
  background: transparent;
}
