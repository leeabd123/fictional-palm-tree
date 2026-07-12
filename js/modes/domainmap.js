// ══════════════════════════════════════════════
// THE DOMAIN MAP (§22-23) — the exploration screen, reached deliberately.
// Home stays a decision-maker (one recommended action); this is the
// overview: a skill-tree with a central radial progress cluster (one
// concentric ring per domain) and branching node trees — one node per
// scenario, visually unlocking with progress, so the progressive-unlock
// mechanic (§13) has a visual home. Strong 2D SVG first; WebGL later.
// ══════════════════════════════════════════════

const TREE_COLORS = {
  family: '#c9a96e', friends: '#4fd8c4', community: '#56c98f',
  identity: '#a78bfa', culture: '#e08a7a',
};

// big cultural moments get their own node icon (§23)
function treeNodeIcon(item) {
  if (item.turns) return '📞';
  if (/condolence|wedding|eid/.test(item.id)) return '🫶';
  return null;
}

function treeItems(domainId) {
  const g = GUIDED_SCENARIOS.filter(x => x.domain === domainId);
  const beg = g.filter(x => x.tier === 'Beginning');
  const comf = g.filter(x => x.tier !== 'Beginning');
  const calls = CALL_SEQUENCES.filter(x => x.domain === domainId);
  return [...beg, ...calls, ...comf];
}

function treeOpen(kind, id, locked) {
  if (locked) { setMode('guided'); return; }
  if (kind === 'call') callOpen(id); else guidedOpen(id);
}

function renderTree() {
  const ca = document.getElementById('content-area');
  const done = getGuidedProgress();
  const C = 550;                      // svg center
  const rad = (deg) => deg * Math.PI / 180;

  // ── center cluster: one concentric ring per domain ──
  let rings = '';
  let totalDone = 0, totalItems = 0;
  DOMAINS.forEach((dm, i) => {
    const items = treeItems(dm.id);
    const n = items.filter(x => done[x.id]).length;
    totalDone += n; totalItems += items.length;
    const r = 38 + i * 12;
    const circ = 2 * Math.PI * r;
    const frac = items.length ? n / items.length : 0;
    rings += `
      <circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="7"/>
      <circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${TREE_COLORS[dm.id]}" stroke-width="7"
        stroke-linecap="round" stroke-dasharray="${(circ * Math.max(0.015, frac)).toFixed(1)} ${circ.toFixed(1)}"
        transform="rotate(-90 ${C} ${C})" opacity=".9"/>`;
  });

  // ── branches: one arm of nodes per domain, curling gently as it grows ──
  let branches = '';
  DOMAINS.forEach((dm, di) => {
    const items = treeItems(dm.id);
    const base = -90 + di * 72;
    const color = TREE_COLORS[dm.id];
    const unlockedComf = comfortUnlocked(dm.id);
    let px = C + Math.cos(rad(base)) * 128;
    let py = C + Math.sin(rad(base)) * 128;
    let prevX = C + Math.cos(rad(base)) * (38 + di * 12);
    let prevY = C + Math.sin(rad(base)) * (38 + di * 12);
    let nextSeen = false;

    items.forEach((item, i) => {
      if (i > 0) {
        const ang = base + Math.max(0, i - 4) * 10 + (i % 2 ? 7 : -7);
        px += Math.cos(rad(ang)) * 52;
        py += Math.sin(rad(ang)) * 52;
      }
      const isDone = !!done[item.id];
      const isComf = !item.turns && item.tier !== 'Beginning';
      const locked = isComf && !unlockedComf;
      const isNext = !isDone && !locked && !nextSeen && (nextSeen = true);
      const icon = treeNodeIcon(item);
      const kind = item.turns ? 'call' : 'guided';

      branches += `<line x1="${prevX.toFixed(1)}" y1="${prevY.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"
        stroke="${isDone ? color : 'rgba(255,255,255,.1)'}" stroke-width="1.5" ${isDone ? '' : 'stroke-dasharray="3 4"'}/>`;
      branches += `
      <g class="tree-node ${isNext ? 'tree-next' : ''}" style="cursor:${locked ? 'default' : 'pointer'}" opacity="${locked ? 0.32 : 1}"
        onclick="treeOpen('${kind}','${item.id}',${locked})">
        <title>${escAttr(item.title)}${locked ? ' — unlocks at Comfortable tier' : ''}</title>
        ${icon
          ? `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="15" fill="${isDone ? 'rgba(255,250,242,.08)' : 'rgba(255,255,255,.03)'}" stroke="${isDone ? color : 'rgba(255,255,255,.22)'}" stroke-width="1.5"/>
             <text x="${px.toFixed(1)}" y="${(py + 1).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="13">${icon}</text>`
          : `<rect x="${(px - 9).toFixed(1)}" y="${(py - 9).toFixed(1)}" width="18" height="18" rx="3"
               transform="rotate(45 ${px.toFixed(1)} ${py.toFixed(1)})"
               fill="${isDone ? color : 'rgba(255,255,255,.03)'}" stroke="${isDone ? color : locked ? 'rgba(255,255,255,.25)' : color}"
               stroke-width="1.5" ${isDone ? `filter="url(#treeGlow)"` : ''} opacity="${isDone ? .95 : 1}"/>
             ${isDone ? `<text x="${px.toFixed(1)}" y="${(py + 1).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#12100d" font-weight="700">✓</text>` : ''}
             ${locked ? `<text x="${px.toFixed(1)}" y="${(py + 1).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="9">🔒</text>` : ''}`}
      </g>`;
      prevX = px; prevY = py;
    });

    // domain label past the last node
    const lang = base + Math.max(0, items.length - 5) * 10;
    const lx = px + Math.cos(rad(lang)) * 46;
    const ly = py + Math.sin(rad(lang)) * 46;
    const doneN = items.filter(x => done[x.id]).length;
    branches += `
      <text x="${lx.toFixed(1)}" y="${(ly - 7).toFixed(1)}" text-anchor="middle" font-size="15" fill="${color}" font-family="DM Sans,sans-serif" font-weight="600">${dm.icon} ${dm.label}</text>
      <text x="${lx.toFixed(1)}" y="${(ly + 11).toFixed(1)}" text-anchor="middle" font-size="11" fill="#a09e9a" font-family="DM Sans,sans-serif">${doneN} of ${items.length} · ${domainTier(dm.id)}</text>`;
  });

  ca.innerHTML = `
    <div class="coach-wrap" style="max-width:860px">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="d2-title">The domain map</div>
      <div class="d2-note" style="margin-bottom:6px">Your whole journey at a glance — each branch is a life domain, each node a real moment. Tap any open node to practice it.</div>
      <div class="tree-scroll">
        <svg viewBox="0 0 1100 1100" class="tree-svg">
          <defs>
            <filter id="treeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          ${branches}
          ${rings}
          <text x="${C}" y="${C - 8}" text-anchor="middle" font-size="30" fill="#e8c99a" font-family="Instrument Serif,serif">${totalDone}</text>
          <text x="${C}" y="${C + 14}" text-anchor="middle" font-size="10.5" fill="#a09e9a" font-family="DM Sans,sans-serif" letter-spacing="1.5">OF ${totalItems} MOMENTS</text>
        </svg>
      </div>
      <div class="d2-tab-row" style="justify-content:center;margin-top:8px">
        <span class="d2-badge">◆ done — filled gold</span>
        <span class="d2-badge">◇ open — tap to practice</span>
        <span class="d2-badge">🔒 unlocks at Comfortable</span>
        <span class="d2-badge">📞 call · 🫶 big moment</span>
      </div>
      <div class="d2-note" style="text-align:center;margin-top:10px">the center rings are the five domains filling as you go — <button class="c2-linklike" onclick="setMode('journey')">the numbers behind this live in your journey →</button></div>
      ${typeof homeExploreHTML === 'function' ? homeExploreHTML() : ''}
    </div>
  `;
}
