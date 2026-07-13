// Journey — the design's "Then → now" tab: every coached scenario in one
// place, each opening its full before/after comparison in the coach.
// Plus per-domain comfort (learning-design doc §3): tracked separately per
// domain, not one global level.

const COMFORT_LABEL = { none: 'Beginning', little: 'Beginning', good: 'Comfortable' };

// §3: the profile is a shape across five domains, not one number
function journeyRadarHTML() {
  const gDone = getGuidedProgress();
  const cx = 110, cy = 100, R = 72;
  const pts = DOMAINS.map((dm, i) => {
    const items = [...GUIDED_SCENARIOS, ...CALL_SEQUENCES].filter(x => x.domain === dm.id);
    const done = items.filter(x => gDone[x.id]).length;
    const v = items.length ? Math.max(0.08, done / items.length) : 0.08;
    const ang = -Math.PI / 2 + (i * 2 * Math.PI / DOMAINS.length);
    return {
      dm, v,
      x: cx + Math.cos(ang) * R * v, y: cy + Math.sin(ang) * R * v,
      lx: cx + Math.cos(ang) * (R + 18), ly: cy + Math.sin(ang) * (R + 18),
      ox: cx + Math.cos(ang) * R, oy: cy + Math.sin(ang) * R,
    };
  });
  const ring = (f) => DOMAINS.map((_, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI / DOMAINS.length);
    return (cx + Math.cos(ang) * R * f).toFixed(1) + ',' + (cy + Math.sin(ang) * R * f).toFixed(1);
  }).join(' ');
  return `
    <div class="d2-card" style="padding:14px;text-align:center">
      <svg viewBox="0 0 220 205" style="max-width:280px;width:100%">
        ${[0.33, 0.66, 1].map(f => `<polygon points="${ring(f)}" fill="none" stroke="rgba(255,255,255,.07)"/>`).join('')}
        ${pts.map(pt => `<line x1="${cx}" y1="${cy}" x2="${pt.ox.toFixed(1)}" y2="${pt.oy.toFixed(1)}" stroke="rgba(255,255,255,.06)"/>`).join('')}
        <polygon points="${pts.map(pt => pt.x.toFixed(1) + ',' + pt.y.toFixed(1)).join(' ')}"
          fill="rgba(79,216,196,.16)" stroke="#4fd8c4" stroke-width="1.5" stroke-linejoin="round"/>
        ${pts.map(pt => `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="2.6" fill="#4fd8c4"/>`).join('')}
        ${pts.map(pt => `<text x="${pt.lx.toFixed(1)}" y="${pt.ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"
          font-size="9.5" fill="#a09e9a" font-family="DM Sans,sans-serif">${pt.dm.icon} ${pt.dm.label}</text>`).join('')}
      </svg>
      <div class="d2-item-note">your shape across the five domains — no single number could say this</div>
    </div>`;
}

function journeyDomainsHTML() {
  const gDone = getGuidedProgress();
  const profile = getProfile();
  return `
    <div class="j2-sec-label" style="margin-top:26px">Your domains — comfort is per-domain, not one level</div>
    ${journeyRadarHTML()}
    <div style="text-align:center;margin:10px 0 4px"><button class="c2-linklike" onclick="setMode('tree')">see this as the domain map — every scenario, one tree →</button></div>
    ${DOMAINS.map(dm => {
      const items = [...GUIDED_SCENARIOS, ...CALL_SEQUENCES].filter(x => x.domain === dm.id);
      const done = items.filter(x => gDone[x.id]).length;
      const tier = dm.live ? (dm.id === 'family' ? (COMFORT_LABEL[profile.comfort] || 'Beginning') : 'Beginning') : null;
      const pct = items.length ? Math.round((done / items.length) * 100) : 0;
      return `
      <div class="d2-item" style="margin-bottom:8px;display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">${dm.icon}</span>
        <span style="flex:1">
          <span style="display:block;font-size:13.5px;color:var(--text)">${dm.label}
            ${tier ? `<span class="d2-badge" style="margin-left:6px">${tier}</span>` : ''}</span>
          <span style="display:block;font-size:11px;color:var(--text3);margin-top:2px">
            ${dm.live ? `${done} of ${items.length} practiced` : 'coming soon — ' + escAttr(dm.desc)}</span>
          ${dm.live ? `<span class="m2-bar" style="display:block;margin-top:6px"><i style="width:${pct}%"></i></span>` : ''}
        </span>
      </div>`;
    }).join('')}`;
}

// The journey merged into the Domain Map screen (design handoff §1 —
// "domain map × journey, one screen"). This keeps the mode + tab alive.
function renderJourney() {
  treeView = 'list';
  renderTree();
}

function journeyOpen(i) {
  coachIdx = i;
  coachPhase = 'journey';
  coachText = ''; coachFeedback = null; coachError = null;
  setMode('speak');
}
