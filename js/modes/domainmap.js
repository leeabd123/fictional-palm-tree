// ══════════════════════════════════════════════
// THE DOMAIN MAP × JOURNEY — design handoff §1 (warm system), one merged
// screen with four treatments and a "view as" switcher:
//   road (1a المشوار) · tree (1b الشجرة) · orbits (1c المدارات) · list (1d وين واصل)
// Same real data everywhere: curriculum items + this browser's coached
// attempts. Views deep-link into each other exactly as the prototype does
// (road's then→now → tree, branch labels → road, tree pill → orbits,
// orbits core → tree, orbits legend → list). The then→now detail screen
// (4g) opens from any journey row.
// ══════════════════════════════════════════════

const DM_CFG = {
  family: { color: '#e8c99a', glyph: '◆' },
  friends: { color: '#4fd8c4', glyph: '●' },
  community: { color: '#56c98f', glyph: '▲' },
  identity: { color: '#a78bfa', glyph: '■' },
  culture: { color: '#e08a7a', glyph: '✦' },
};

let treeView = 'list';        // 'road' | 'tree' | 'orbits' | 'list'
let treeDetail = null;        // SPEAK_QA index → then→now detail (4g)
let dmOpen = null;            // open row in the list view

function dmHexA(h, a) {
  const n = parseInt(h.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

// ── real curriculum data in the design's item shape ──
function dmDomains() {
  const done = getGuidedProgress();
  return DOMAINS.map(dm => {
    const g = GUIDED_SCENARIOS.filter(x => x.domain === dm.id);
    const beg = g.filter(x => x.tier === 'Beginning')
      .map(x => ({ id: x.id, title: x.title, kind: (x.flagship || /condolence|wedding|eid/.test(x.id)) ? 'big' : 'guided' }));
    const calls = CALL_SEQUENCES.filter(x => x.domain === dm.id)
      .map(x => ({ id: x.id, title: x.title, kind: 'call' }));
    const comf = g.filter(x => x.tier !== 'Beginning')
      .map(x => ({ id: x.id, title: x.title, kind: 'comf' }));
    const unlocked = comfortUnlocked(dm.id);
    let nextSeen = false;
    const items = [...beg, ...calls, ...comf].map(it => {
      const locked = it.kind === 'comf' && !unlocked;
      let status = (!locked && done[it.id]) ? 'done' : locked ? 'locked' : 'open';
      if (status === 'open' && !nextSeen) { status = 'next'; nextSeen = true; }
      return { ...it, status };
    });
    const doneN = items.filter(x => x.status === 'done').length;
    return { ...dm, ...DM_CFG[dm.id], items, doneN, total: items.length, tier: domainTier(dm.id) };
  });
}

function dmOpenItem(kind, id, locked) {
  if (locked) return;
  if (kind === 'call') callOpen(id); else guidedOpen(id);
}

// ── coached journey rows (real attempts) ──
function dmJourneyRows() {
  let store = {};
  try { store = JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}'); } catch (e) {}
  return SPEAK_QA.map((q, i) => ({ q, i, attempts: store[q.qen] || [] }))
    .filter(e => e.attempts.length)
    .map(e => {
      const s1 = naturalScore(e.attempts[0].metrics);
      const s2 = naturalScore(e.attempts[e.attempts.length - 1].metrics);
      const multi = e.attempts.length > 1;
      return {
        i: e.i, q: e.q.qen, n: e.attempts.length, s1, s2, up: multi && s2 > s1,
        meta: e.attempts.length + ' attempt' + (multi ? 's' : '') + (multi ? ` · first ${s1} → now ${s2}` : ' · ' + fmtAttemptDate(e.attempts[e.attempts.length - 1].ts)),
        delta: multi ? ((s2 - s1 >= 0 ? '+' : '') + (s2 - s1) + ' natural') : s2 + ' natural',
      };
    });
}

function dmJourneyRowHTML(j, small) {
  const deltaStyle = j.up
    ? 'color:#7fdcaa;background:rgba(86,201,143,0.1);border:1px solid rgba(86,201,143,0.3)'
    : 'color:#e8c99a;background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.3)';
  return `
    <button onclick="treeDetail=${j.i};renderTree()" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:${small ? '10px 12px' : '11px 14px'};border-radius:14px;background:rgba(255,250,242,0.03);border:1px solid rgba(255,255,255,0.07);margin-bottom:8px;cursor:pointer;color:inherit;font-family:inherit">
      <span style="flex:1;min-width:0">
        <span style="display:block;font-size:12px;font-weight:600;color:#e8e4dd;line-height:1.4">${escAttr(j.q)}</span>
        <span style="display:block;font-size:10px;color:#7a756e;margin-top:2px">${escAttr(j.meta)}</span>
      </span>
      <span style="${deltaStyle};padding:4px 10px;border-radius:100px;font-size:10px;font-weight:600;white-space:nowrap;flex-shrink:0">${escAttr(j.delta)}</span>
    </button>`;
}

// ── shared header + view switcher ──
function dmHeaderHTML(doms, title, sub, titleColor, glowRGBA, pillHTML) {
  const totalDone = doms.reduce((a, d) => a + d.doneN, 0);
  const totalAll = doms.reduce((a, d) => a + d.total, 0);
  return `
    <div style="margin-bottom:14px"><button class="d2-back" onclick="setMode('home')" style="margin-bottom:0">← home</button></div>
    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">
      <div>
        <div style="font-family:var(--serif),'Noto Naskh Arabic',serif;font-size:34px;color:${titleColor};text-shadow:0 0 28px ${glowRGBA}">${title}</div>
        <div style="font-size:12.5px;color:#a09e9a;margin-top:3px">${sub}</div>
      </div>
      ${pillHTML(totalDone, totalAll)}
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px">
      <span style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#7a756e">view as</span>
      ${[['road', 'road'], ['tree', 'tree'], ['orbits', 'orbits'], ['list', 'list']].map(([v, label]) =>
        `<button onclick="treeView='${v}';renderTree()" style="font-size:10.5px;padding:4px 12px;border-radius:100px;border:1px solid ${treeView === v ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.14)'};background:${treeView === v ? 'rgba(201,169,110,0.12)' : 'transparent'};color:${treeView === v ? '#e8c99a' : '#c9c4bc'};cursor:pointer;font-family:inherit">${label}</button>`).join('')}
    </div>`;
}

// ══════════ 1a — THE ROAD ══════════
function dmRoadHTML(doms) {
  const OFFS = [0, -88, -126, -88, 0, 88, 126, 88];
  const cubic = (pts) => {
    if (pts.length < 2) return 'M -30 -30';
    let d = 'M ' + pts[0].x + ' ' + pts[0].y;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      d += ' C ' + a.x + ' ' + (a.y + 41) + ' ' + b.x + ' ' + (b.y - 41) + ' ' + b.x + ' ' + b.y;
    }
    return d;
  };
  let y = 0, paths = '', nodes = '', dividers = '';
  doms.forEach(d => {
    dividers += `
      <div style="position:absolute;left:0;right:0;top:${y}px;display:flex;align-items:center;gap:10px;z-index:3">
        <span style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${d.color};white-space:nowrap">${d.glyph} ${d.label} <span style="font-family:'Noto Naskh Arabic',serif">· ${d.ar}</span></span>
        <div style="flex:1;height:1px;background:linear-gradient(90deg, ${dmHexA(d.color, .4)}, transparent)"></div>
        <span style="font-size:10px;color:#a09e9a;white-space:nowrap">${d.doneN} of ${d.total} · ${d.tier}</span>
      </div>`;
    const pts = d.items.map((_, i) => ({ x: 195 + OFFS[i % 8], y: y + 70 + i * 82 }));
    paths += `<path d="${cubic(pts)}" stroke="rgba(255,255,255,0.1)" stroke-width="3" fill="none" stroke-dasharray="1 9" stroke-linecap="round"></path>`;
    if (d.doneN >= 2) paths += `<path d="${cubic(pts.slice(0, d.doneN))}" stroke="${d.color}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85" style="filter:drop-shadow(0 0 6px ${dmHexA(d.color, .55)})"></path>`;
    d.items.forEach((it, i) => {
      const p = pts[i], s = it.status;
      const size = s === 'next' ? 52 : it.kind === 'big' ? 54 : 44;
      let shadow = s === 'done' ? `0 12px 30px -10px ${dmHexA(d.color, .7)}, 0 0 22px -6px ${dmHexA(d.color, .5)}`
        : s === 'next' ? `0 0 0 9px ${dmHexA(d.color, .07)}, 0 0 30px -6px ${dmHexA(d.color, .5)}` : 'none';
      if (it.kind === 'call') shadow = (shadow === 'none' ? '' : shadow + ', ') + `0 0 0 4px #0f0d0b, 0 0 0 5.5px ${s === 'done' ? dmHexA(d.color, .5) : 'rgba(255,255,255,0.16)'}`;
      const sym = s === 'done' ? '✓' : s === 'next' ? '●' : s === 'locked' ? '–' : (it.kind === 'big' ? '✦' : '');
      const kindTxt = it.kind === 'call' ? 'phone call' : it.kind === 'big' ? 'big moment' : 'guided · ~2 min';
      const meta = kindTxt + (s === 'done' ? ' · done' : s === 'next' ? ' · up next' : s === 'locked' ? ' · unlocks at Comfortable' : '');
      const titleColor = (s === 'done' || s === 'next') ? '#f0ede8' : s === 'locked' ? '#5f5a53' : '#b8b3ab';
      const label = p.x <= 195
        ? `left:${p.x + 36}px;width:${Math.min(152, 390 - (p.x + 36) - 2)}px;text-align:left`
        : `left:${p.x - 38 - Math.min(152, p.x - 38)}px;width:${Math.min(152, p.x - 38)}px;text-align:right`;
      nodes += `
      <div onclick="dmOpenItem('${it.kind === 'call' ? 'call' : 'guided'}','${it.id}',${s === 'locked'})" title="${escAttr(it.title)}"
        style="position:absolute;left:${p.x - size / 2}px;top:${p.y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;cursor:${s === 'locked' ? 'default' : 'pointer'};
        background:${s === 'done' ? `linear-gradient(150deg, ${d.color}, ${dmHexA(d.color, .72)})` : s === 'next' ? dmHexA(d.color, .13) : s === 'locked' ? 'rgba(255,255,255,0.02)' : 'rgba(255,250,242,0.045)'};
        border:${(s === 'done' || s === 'next') ? '1.5px solid ' + d.color : s === 'locked' ? '1.5px dashed rgba(255,255,255,0.2)' : '1.5px solid rgba(255,255,255,0.24)'};
        box-shadow:${shadow};opacity:${s === 'locked' ? .42 : 1};color:${s === 'done' ? '#14110c' : d.color};font-weight:700;font-size:${s === 'done' ? 18 : s === 'next' ? 11 : 15}px;
        ${s === 'next' ? 'animation:glowPulse 2.4s ease-in-out infinite;' : ''}">${sym}</div>
      <div style="position:absolute;top:${p.y - 17}px;${label};z-index:3;pointer-events:none">
        <div style="font-size:11.5px;font-weight:600;line-height:1.35;color:${titleColor}">${escAttr(it.title)}</div>
        <div style="font-size:9.5px;color:#7a756e;margin-top:2px;letter-spacing:.05em">${meta}</div>
      </div>`;
    });
    y += 70 + d.items.length * 82 + 20;
  });
  const H = y + 30;
  const jr = dmJourneyRows();
  const best = jr.filter(j => j.up).map(j => j.s2 - j.s1).sort((a, b) => b - a)[0];
  return `
    ${dmHeaderHTML(doms, 'المشوار', 'Your mishwar — the whole road, one path', '#e8c99a', 'rgba(232,201,154,0.35)',
      (td, ta) => `<div style="font-size:11px;color:#e8c99a;background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.3);padding:6px 12px;border-radius:100px;white-space:nowrap;font-variant-numeric:tabular-nums">${td} of ${ta} walked</div>`)}
    ${jr.length ? `
    <button onclick="treeView='tree';renderTree()" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin-top:16px;padding:12px 16px;border-radius:16px;background:rgba(79,216,196,0.06);border:1px solid rgba(79,216,196,0.25);cursor:pointer;color:#f0ede8;font-family:inherit">
      <span style="flex:1">
        <span style="display:block;font-size:12.5px;font-weight:600">Then → now</span>
        <span style="display:block;font-size:10.5px;color:#a09e9a;margin-top:2px">${jr.length} coached moment${jr.length === 1 ? '' : 's'}${best ? ' · best <span style="color:#7fdcaa">+' + best + '</span>' : ''}</span>
      </span>
      <span style="color:#4fd8c4;font-size:16px">›</span>
    </button>` : ''}
    <div style="position:relative;max-width:390px;height:${H}px;margin:24px auto 0">
      <svg width="390" height="${H}" viewBox="0 0 390 ${H}" style="position:absolute;left:0;top:0">${paths}</svg>
      ${dividers}
      ${nodes}
      <div style="position:absolute;left:0;right:0;top:${H - 28}px;text-align:center;z-index:5"><button class="c2-linklike" onclick="treeView='orbits';renderTree()" style="font-size:11px;color:#7a756e">the road so far — see it as orbits →</button></div>
    </div>`;
}

// ══════════ 1b — THE TREE ══════════
function dmTreeHTML(doms) {
  const S = { x: 195, y: 422 };
  const CFG = [
    { c: { x: 128, y: 326 }, e: { x: 52, y: 154 } },
    { c: { x: 164, y: 276 }, e: { x: 122, y: 90 } },
    { c: { x: 195, y: 248 }, e: { x: 195, y: 66 } },
    { c: { x: 226, y: 276 }, e: { x: 268, y: 90 } },
    { c: { x: 262, y: 326 }, e: { x: 340, y: 154 } },
  ];
  const qp = (c, e, t) => ({
    x: (1 - t) * (1 - t) * S.x + 2 * (1 - t) * t * c.x + t * t * e.x,
    y: (1 - t) * (1 - t) * S.y + 2 * (1 - t) * t * c.y + t * t * e.y,
  });
  let paths = '', dots = '', labels = '';
  doms.forEach((d, i) => {
    const { c, e } = CFG[i];
    const n = d.items.length;
    paths += `<path d="M ${S.x} ${S.y} Q ${c.x} ${c.y} ${e.x} ${e.y}" stroke="${dmHexA(d.color, .2)}" stroke-width="3" fill="none" stroke-linecap="round"></path>`;
    let last = -1;
    d.items.forEach((it, j) => { if (it.status === 'done') last = j; });
    if (last >= 0) {
      const t = 0.14 + 0.86 * (n === 1 ? 1 : last / (n - 1));
      const c2 = { x: S.x + (c.x - S.x) * t, y: S.y + (c.y - S.y) * t };
      const e2 = qp(c, e, t);
      paths += `<path d="M ${S.x} ${S.y} Q ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${e2.x.toFixed(1)} ${e2.y.toFixed(1)}" stroke="${d.color}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9" style="filter:drop-shadow(0 0 5px ${dmHexA(d.color, .7)})"></path>`;
    }
    d.items.forEach((it, j) => {
      const t = 0.14 + 0.86 * (n === 1 ? 1 : j / (n - 1));
      const p = qp(c, e, t);
      const r = (i === 0 ? 6.5 : 8.5) + (it.status === 'done' ? 1.5 : 0) + (it.status === 'next' ? 1 : 0);
      dots += `<div title="${escAttr(it.title)}" onclick="dmOpenItem('${it.kind === 'call' ? 'call' : 'guided'}','${it.id}',${it.status === 'locked'})"
        style="position:absolute;left:${(p.x - r).toFixed(1)}px;top:${(p.y - r).toFixed(1)}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;z-index:2;cursor:${it.status === 'locked' ? 'default' : 'pointer'};
        background:${it.status === 'done' ? d.color : it.status === 'next' ? dmHexA(d.color, .15) : 'rgba(20,17,13,0.9)'};
        border:${it.status === 'done' ? 'none' : it.status === 'next' ? '1.5px solid ' + d.color : it.status === 'locked' ? '1px dashed rgba(255,255,255,0.25)' : '1.5px solid rgba(255,255,255,0.3)'};
        box-shadow:${it.status === 'done' ? '0 0 14px -2px ' + dmHexA(d.color, .85) : it.status === 'next' ? '0 0 0 5px ' + dmHexA(d.color, .09) + ', 0 0 16px -3px ' + dmHexA(d.color, .6) : 'none'};
        opacity:${it.status === 'locked' ? .45 : 1};${it.status === 'next' ? 'animation:glowPulse 2.4s ease-in-out infinite;' : ''}"></div>`;
    });
    const lx = Math.min(330, Math.max(60, e.x + (e.x - 195) * 0.12));
    labels += `
      <button onclick="treeView='road';renderTree()" style="position:absolute;left:${lx - 62}px;top:${Math.max(2, e.y - 58)}px;width:124px;text-align:center;z-index:3;background:none;border:none;cursor:pointer;font-family:inherit;padding:0">
        <div style="font-size:11.5px;font-weight:600;color:${d.color}">${d.glyph} ${d.label}</div>
        <div style="font-size:9.5px;color:#7a756e;margin-top:2px">${d.doneN} of ${d.total} · ${d.tier}</div>
      </button>`;
  });
  const totalDone = doms.reduce((a, d) => a + d.doneN, 0);
  const totalAll = doms.reduce((a, d) => a + d.total, 0);
  const jr = dmJourneyRows();
  return `
    ${dmHeaderHTML(doms, 'شجرتك', 'Your tree — it grows every time you speak', '#c9a96e', 'rgba(201,169,110,0.35)', () => '')}
    <div style="position:relative;max-width:390px;height:640px;margin:8px auto 0">
      <svg width="390" height="640" viewBox="0 0 390 640" style="position:absolute;left:0;top:0">
        <defs><linearGradient id="trunkGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#7d6544"></stop><stop offset="100%" stop-color="#c9a96e"></stop>
        </linearGradient></defs>
        <path d="M195 570 C168 592 146 588 122 608" stroke="rgba(201,169,110,0.35)" stroke-width="3.5" fill="none" stroke-linecap="round"></path>
        <path d="M195 570 C222 592 244 588 268 608" stroke="rgba(201,169,110,0.35)" stroke-width="3.5" fill="none" stroke-linecap="round"></path>
        <path d="M195 570 C194 588 197 598 195 612" stroke="rgba(201,169,110,0.45)" stroke-width="4.5" fill="none" stroke-linecap="round"></path>
        <path d="M195 570 C186 516 204 474 195 422" stroke="url(#trunkGrad)" stroke-width="9" fill="none" stroke-linecap="round"></path>
        ${paths}
      </svg>
      ${dots}
      ${labels}
      <button onclick="treeView='orbits';renderTree()" style="position:absolute;left:50%;top:602px;transform:translateX(-50%);white-space:nowrap;font-size:11px;color:#a09e9a;background:rgba(255,250,242,0.04);border:1px solid rgba(201,169,110,0.25);padding:7px 16px;border-radius:100px;z-index:3;cursor:pointer;font-family:inherit"><span style="color:#e8c99a;font-weight:700;font-variant-numeric:tabular-nums">${totalDone}</span> of ${totalAll} on the tree</button>
    </div>
    <div style="margin-top:26px">
      <button class="c2-linklike" onclick="treeView='list';renderTree()" style="display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#7a756e;margin-bottom:10px">الجذور · the roots →</button>
      ${jr.length ? jr.slice(0, 4).map(j => dmJourneyRowHTML(j)).join('') : '<div style="font-size:11px;color:#7a756e;font-style:italic">No coached moments yet — answer one with your coach and your roots start growing here.</div>'}
    </div>`;
}

// ══════════ 1c — THE ORBITS ══════════
function dmOrbitsHTML(doms) {
  const SIZES = [340, 288, 236, 184, 132];
  const SPINS = ['96s linear infinite', '74s linear infinite reverse', '110s linear infinite', '82s linear infinite reverse', '64s linear infinite'];
  let rings = '';
  doms.forEach((d, i) => {
    const D = SIZES[i];
    const pct = Math.max(2.5, Math.round(d.doneN / d.total * 100));
    const dots = d.items.map((it, j) => {
      const th = (-90 + j * 360 / d.items.length) * Math.PI / 180;
      const r = it.status === 'done' ? 5.5 : it.status === 'next' ? 5 : 3.5;
      const R = D / 2;
      const x = R + Math.cos(th) * (R - 1), y = R + Math.sin(th) * (R - 1);
      return `<div title="${escAttr(it.title)}" style="position:absolute;left:${(x - r).toFixed(1)}px;top:${(y - r).toFixed(1)}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;
        background:${it.status === 'done' ? d.color : it.status === 'next' ? dmHexA(d.color, .9) : 'rgba(255,255,255,0.16)'};
        box-shadow:${it.status === 'done' ? '0 0 12px 1px ' + dmHexA(d.color, .85) : it.status === 'next' ? '0 0 10px 1px ' + dmHexA(d.color, .7) : 'none'};
        opacity:${it.status === 'locked' ? .35 : 1}"></div>`;
    }).join('');
    rings += `
      <div style="position:absolute;left:50%;top:50%;width:${D}px;height:${D}px;margin:-${D / 2}px 0 0 -${D / 2}px;border-radius:50%;animation:orbitSpin ${SPINS[i]}">
        <svg viewBox="0 0 100 100" style="position:absolute;left:0;top:0;width:100%;height:100%;transform:rotate(-90deg);overflow:visible">
          <circle cx="50" cy="50" r="49.6" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"></circle>
          <circle cx="50" cy="50" r="49.6" fill="none" stroke="${d.color}" stroke-width="0.9" stroke-linecap="round" pathLength="100" stroke-dasharray="${pct} 100" opacity="0.9"></circle>
        </svg>
        ${dots}
      </div>`;
  });
  const totalDone = doms.reduce((a, d) => a + d.doneN, 0);
  const totalAll = doms.reduce((a, d) => a + d.total, 0);
  const jr = dmJourneyRows();
  return `
    ${dmHeaderHTML(doms, 'عالمك', 'Your world — five circles of your life, filling as you speak', '#c4b5fd', 'rgba(167,139,250,0.35)', () => '')}
    <div style="position:relative;height:340px;margin:10px auto 0;max-width:390px;perspective:800px">
      ${rings}
      <div style="position:absolute;left:50%;top:82%;width:210px;height:36px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%);animation:shadowPulse 5s ease-in-out infinite;pointer-events:none"></div>
      <button onclick="treeView='tree';renderTree()" title="view as tree" style="position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);width:112px;height:112px;border-radius:50%;background:radial-gradient(circle at 38% 30%, rgba(255,250,242,0.1), rgba(15,13,11,0.92) 60%);border:1px solid rgba(232,201,154,0.4);box-shadow:0 24px 50px -18px rgba(0,0,0,0.9), 0 0 44px -10px rgba(232,201,154,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:5;animation:floatyC 6s ease-in-out infinite;cursor:pointer;font-family:inherit">
        <span style="font-family:var(--serif),serif;font-size:34px;color:#e8c99a;line-height:1;font-variant-numeric:tabular-nums">${totalDone}</span>
        <span style="font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:#7a756e;margin-top:4px">of ${totalAll} moments</span>
      </button>
    </div>
    <div style="margin-top:8px;max-width:430px;margin-left:auto;margin-right:auto">
      ${doms.map((d, i) => `
      <button onclick="treeView='list';dmOpen='${d.id}';renderTree()" style="display:flex;align-items:center;gap:10px;width:100%;padding:9px 0;border:none;border-bottom:1px solid rgba(255,255,255,0.05);background:none;cursor:pointer;color:inherit;font-family:inherit;text-align:left">
        <span style="color:${d.color};font-size:12px;width:16px;text-align:center">${d.glyph}</span>
        <span style="font-size:12.5px;color:#e8e4dd;width:104px">${d.label} <span style="font-family:'Noto Naskh Arabic',serif">${d.ar}</span></span>
        <span style="flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,0.06);overflow:hidden"><span style="display:block;height:100%;width:${Math.round(d.doneN / d.total * 100)}%;min-width:${d.doneN ? '5px' : '0'};background:linear-gradient(90deg,${dmHexA(d.color, .6)},${d.color});border-radius:3px;box-shadow:0 0 10px -2px ${dmHexA(d.color, .7)};animation:barGrow 1.2s cubic-bezier(.3,.8,.3,1) both"></span></span>
        <span style="font-size:10.5px;color:#a09e9a;white-space:nowrap;width:54px;text-align:right">${d.doneN} of ${d.total}</span>
        <span style="font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:#7a756e;width:80px;text-align:right">${d.tier}</span>
      </button>`).join('')}
    </div>
    ${jr.length ? `
    <div style="margin-top:20px">
      <div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#7a756e;margin-bottom:10px">Then → now</div>
      ${jr.slice(0, 4).map(j => dmJourneyRowHTML(j)).join('')}
    </div>` : ''}`;
}

// ══════════ 1d — WHERE YOU STAND (default) ══════════
function dmListHTML(doms) {
  if (!dmOpen || !doms.some(d => d.id === dmOpen)) dmOpen = focusDomain();
  const jr = dmJourneyRows();
  const rows = doms.map(d => {
    const sel = d.id === dmOpen;
    return `
    <button onclick="dmOpen='${d.id}';renderTree()" style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:14px 16px;border-radius:18px;cursor:pointer;
      background:${sel ? dmHexA(d.color, .09) : 'rgba(255,250,242,0.03)'};border:1px solid ${sel ? dmHexA(d.color, .4) : 'rgba(255,255,255,0.08)'};
      color:#f0ede8;font-family:inherit;transition:all .3s cubic-bezier(.2,.8,.2,1);box-shadow:${sel ? '0 16px 40px -20px ' + dmHexA(d.color, .5) : 'none'}">
      <span style="width:40px;height:40px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;color:${d.color};background:${dmHexA(d.color, .1)};border:1px solid ${dmHexA(d.color, .3)}">${d.glyph}</span>
      <span style="flex:1;min-width:0">
        <span style="display:flex;align-items:baseline;gap:7px">
          <span style="font-size:14px;font-weight:600">${d.label}</span>
          <span style="font-family:'Noto Naskh Arabic',serif;font-size:13px;color:#7a756e">${d.ar}</span>
        </span>
        <span style="display:block;height:4px;border-radius:2px;background:rgba(255,255,255,0.07);overflow:hidden;margin-top:8px"><span style="display:block;height:100%;width:${Math.round(d.doneN / d.total * 100)}%;min-width:${d.doneN ? '5px' : '0'};background:${d.color};border-radius:2px;box-shadow:0 0 8px -1px ${dmHexA(d.color, .8)}"></span></span>
      </span>
      <span style="text-align:right;flex-shrink:0">
        <span style="display:block;font-size:15px;font-weight:700;color:${sel ? d.color : '#b8b3ab'};font-variant-numeric:tabular-nums">${d.doneN} / ${d.total}</span>
        <span style="display:block;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#7a756e;margin-top:3px">${d.tier}</span>
      </span>
      <span style="color:#7a756e;font-size:14px">${sel ? '▾' : '›'}</span>
    </button>`;
  }).join('');

  const sd = doms.find(d => d.id === dmOpen) || doms[0];
  const nextIt = sd.items.find(x => x.status === 'next');
  const panel = `
    <div style="margin-top:14px;padding:18px;border-radius:20px;background:rgba(255,250,242,0.035);border:1px solid ${dmHexA(sd.color, .3)};box-shadow:0 24px 50px -28px rgba(0,0,0,0.8);animation:materialize .35s both">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <span style="font-family:var(--serif),serif;font-size:21px;color:${sd.color}">${sd.label} <span style="font-family:'Noto Naskh Arabic',serif">· ${sd.ar}</span></span>
        <span style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:100px;background:${dmHexA(sd.color, .1)};border:1px solid ${dmHexA(sd.color, .35)};color:${sd.color};white-space:nowrap">${sd.tier}</span>
      </div>
      <div style="font-size:11px;color:#a09e9a;margin-top:5px;line-height:1.55">${escAttr(sd.desc)}</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:14px">
        ${sd.items.map(it => `
        <div title="${escAttr(it.title)}" onclick="dmOpenItem('${it.kind === 'call' ? 'call' : 'guided'}','${it.id}',${it.status === 'locked'})"
          style="width:27px;height:27px;border-radius:${it.kind === 'call' ? '50%' : '8px'};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:${it.status === 'locked' ? 'default' : 'pointer'};
          color:${it.status === 'done' ? '#14110c' : sd.color};
          background:${it.status === 'done' ? sd.color : it.status === 'next' ? dmHexA(sd.color, .15) : 'rgba(255,255,255,0.04)'};
          border:${it.status === 'done' ? '1px solid ' + sd.color : it.status === 'next' ? '1.5px solid ' + sd.color : it.status === 'locked' ? '1px dashed rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.2)'};
          box-shadow:${it.status === 'done' ? '0 0 12px -3px ' + dmHexA(sd.color, .8) : 'none'};opacity:${it.status === 'locked' ? .45 : 1};
          ${it.status === 'next' ? 'animation:glowPulse 2.4s ease-in-out infinite;' : ''}">${it.status === 'done' ? '✓' : ''}</div>`).join('')}
      </div>
      <div style="display:flex;gap:14px;margin-top:10px;font-size:9px;letter-spacing:.06em;color:#7a756e"><span>▪ square — guided</span><span>● circle — phone call</span><span>✓ done · dashed — locked</span></div>
      <button onclick="${nextIt ? `dmOpenItem('${nextIt.kind === 'call' ? 'call' : 'guided'}','${nextIt.id}',false)` : `setFocusDomain('${sd.id}');setMode('speak')`}"
        style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;margin-top:16px;padding:13px 16px;border-radius:14px;background:${dmHexA(sd.color, .1)};border:1px solid ${dmHexA(sd.color, .4)};cursor:pointer;color:#f0ede8;font-family:inherit">
        <span style="flex:1">
          <span style="display:block;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#a09e9a">Up next</span>
          <span style="display:block;font-size:13px;font-weight:600;margin-top:3px">${escAttr(nextIt ? nextIt.title : 'Free scenario with your coach')}</span>
          <span style="display:block;font-size:10.5px;color:#a09e9a;margin-top:2px">${nextIt ? (nextIt.kind === 'call' ? 'a real call, turn by turn · ~4 min' : 'guided · say it like family would · ~2 min') : 'AI coaching on your own words · ~5 min'}</span>
        </span>
        <span style="font-size:16px">›</span>
      </button>
    </div>`;

  return `
    ${dmHeaderHTML(doms, 'وين واصل؟', 'Where you stand — five parts of your life', '#7fdcaa', 'rgba(86,201,143,0.35)',
      (td, ta) => `<div style="font-size:11px;color:#7fdcaa;background:rgba(86,201,143,0.08);border:1px solid rgba(86,201,143,0.3);padding:6px 12px;border-radius:100px;white-space:nowrap;font-variant-numeric:tabular-nums">${td} / ${ta}</div>`)}
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:20px">${rows}</div>
    ${panel}
    ${typeof tutorPanelHTML === 'function' ? tutorPanelHTML() : ''}
    <div style="margin-top:22px">
      <div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#7a756e;margin-bottom:10px">Then → now — every coached moment</div>
      ${jr.length ? jr.map(j => dmJourneyRowHTML(j)).join('')
        : '<div style="font-size:11px;color:#7a756e;font-style:italic;line-height:1.5">No coached moments yet — answer a scenario with your coach and your then → now appears here.</div>'}
    </div>
    ${typeof homeExploreHTML === 'function' ? homeExploreHTML() : ''}`;
}

// ══════════ 4g — THEN → NOW DETAIL ══════════
function dmDetailHTML() {
  const i = treeDetail;
  const q = SPEAK_QA[i];
  let store = {};
  try { store = JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}'); } catch (e) {}
  const atts = (q && store[q.qen]) || [];
  if (!q || !atts.length) { treeDetail = null; return dmListHTML(dmDomains()); }
  const first = atts[0], last = atts[atts.length - 1];
  const s1 = naturalScore(first.metrics), s2 = naturalScore(last.metrics);
  const multi = atts.length > 1;
  const bars = atts.slice(-3).map((a, j, arr) => {
    const s = naturalScore(a.metrics);
    const isLast = j === arr.length - 1;
    return `<span style="display:block;width:30px;height:${Math.max(8, s)}%;border-radius:5px 5px 0 0;background:${isLast ? 'linear-gradient(180deg,#e8c99a,#c9a96e)' : j === arr.length - 2 ? 'rgba(201,169,110,0.35)' : 'rgba(255,255,255,0.08)'};${isLast ? 'box-shadow:0 0 20px rgba(201,169,110,0.6)' : ''}"></span>`;
  }).join('');

  // what changed — words dropped from the first attempt vs words added in the last
  const tok = (s) => String(s).replace(/[.,!?؟،—:؛"']/g, ' ').split(/\s+/).filter(w => w.length > 1);
  const w1 = new Set(tok(first.text)), w2 = new Set(tok(last.text));
  const added = [...w2].filter(w => !w1.has(w)).slice(0, 3);
  const dropped = [...w1].filter(w => !w2.has(w)).slice(0, 3);
  const changes = [];
  for (let k = 0; k < Math.max(added.length, dropped.length) && changes.length < 3; k++) {
    changes.push({ from: dropped[k] || null, to: added[k] || null });
  }

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0">
      <button class="d2-back" style="margin-bottom:0" onclick="treeDetail=null;renderTree()">← journey</button>
      <span style="font-size:10px;letter-spacing:.14em;color:#7a756e">${atts.length} ATTEMPT${atts.length === 1 ? '' : 'S'}</span>
    </div>
    <div style="font-family:var(--serif),serif;font-size:22px;color:#f0ede8;margin-top:12px;line-height:1.4">${escAttr(q.qen)}</div>

    <div style="text-align:center;padding:26px 0 10px">
      <div style="display:flex;align-items:baseline;justify-content:center;gap:18px">
        ${multi ? `<span style="font-family:var(--serif),serif;font-size:44px;color:#5f5a53;line-height:1">${s1}</span>
        <span style="font-size:22px;color:#c9a96e">→</span>` : ''}
        <span style="font-family:var(--serif),serif;font-size:84px;color:#e8c99a;line-height:1;text-shadow:0 0 40px rgba(232,201,154,0.5)">${s2}</span>
      </div>
      <div style="font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:#7a756e;margin-top:12px">Natural score${multi ? ` · ${s2 - s1 >= 0 ? '+' + (s2 - s1) : s2 - s1} in ${atts.length} attempts` : ' · first attempt'}</div>
      ${multi ? `<div style="display:flex;align-items:flex-end;justify-content:center;gap:10px;height:60px;margin-top:18px">${bars}</div>` : ''}
    </div>

    <div style="margin-top:18px;padding:20px 22px;border-radius:22px;background:rgba(255,250,242,0.035);border:1px solid rgba(255,255,255,0.08)">
      ${multi ? `
      <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#7a756e">Then · ${escAttr(fmtAttemptDate(first.ts))}</div>
      <div dir="auto" style="font-family:'Noto Naskh Arabic',serif;font-size:17px;color:#a09e9a;line-height:2;margin-top:8px">${escAttr(first.text)}</div>
      <div style="font-size:11px;color:#7a756e;margin-top:4px;font-style:italic">your first try — every version after this is growth</div>
      <div style="height:1px;background:rgba(232,201,154,0.25);margin:18px 0"></div>` : ''}
      <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#e8c99a">Now · ${escAttr(fmtAttemptDate(last.ts))}</div>
      <div dir="auto" style="font-family:'Noto Naskh Arabic',serif;font-size:19px;color:#f6f1e8;line-height:2;margin-top:8px">${escAttr(last.text)}</div>
      ${last.vocabUsed && last.vocabUsed.length ? `<div style="font-size:11px;font-style:italic;color:#a78bfa;margin-top:4px">used: ${last.vocabUsed.slice(0, 4).map(escAttr).join(' · ')}</div>` : ''}
    </div>

    ${changes.length ? `
    <div style="margin-top:22px">
      <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#7a756e;margin-bottom:4px">What changed</div>
      ${changes.map((ch, k) => `
      ${k > 0 ? '<div style="height:1px;background:rgba(255,255,255,0.06)"></div>' : ''}
      <div style="display:flex;align-items:center;gap:12px;padding:13px 0">
        <span dir="auto" style="font-size:12.5px;color:#a09e9a;flex:1">${ch.from ? escAttr(ch.from) : '<span style="color:#7a756e">added</span>'}</span>
        <span style="color:#c9a96e">→</span>
        <span dir="auto" style="font-family:'Noto Naskh Arabic',serif;font-size:14px;color:#e8c99a;flex:1;text-align:left">${ch.to ? escAttr(ch.to) : '<span style="color:#7a756e;font-family:var(--sans)">dropped</span>'}</span>
      </div>`).join('')}
    </div>` : ''}

    <button onclick="coachIdx=${i};coachPhase='prompt';coachText='';coachFeedback=null;coachError=null;treeDetail=null;setMode('speak')"
      style="display:block;width:100%;margin-top:20px;padding:14px;border-radius:100px;border:1px solid rgba(201,169,110,0.45);cursor:pointer;background:rgba(201,169,110,0.12);box-shadow:0 0 30px -10px rgba(201,169,110,0.6);color:#e8c99a;font-family:inherit;font-size:13.5px;font-weight:600">Answer it again — beat ${s2}</button>
    <div style="text-align:center;margin-top:12px"><button class="c2-linklike" onclick="journeyOpen(${i})">see the full coaching comparison →</button></div>`;
}

function renderTree() {
  const ca = document.getElementById('content-area');
  const doms = dmDomains();
  let body;
  if (treeDetail !== null) body = dmDetailHTML();
  else if (treeView === 'road') body = dmRoadHTML(doms);
  else if (treeView === 'tree') body = dmTreeHTML(doms);
  else if (treeView === 'orbits') body = dmOrbitsHTML(doms);
  else body = dmListHTML(doms);
  ca.innerHTML = `<div class="coach-wrap">${body}</div>`;
}
