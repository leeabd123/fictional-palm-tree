// ══════════════════════════════════════════════════════════
// BRANCH DETAIL — the tariga-handoff's full-screen 3D branch, in THREE
// selectable views (all pure CSS 3D, no WebGL / no Three.js):
//   'parallax' — the Parallax.tsx bark tree: drag to rotate, camera fly-in
//   'orbit'    — the Orbit.tsx look: a climbing spine of glowing spheres
//                with golden progress segments, slow auto-orbit
//   'helix'    — moments spiral around the trunk, slow auto-orbit
// Node labels follow the app-wide language toggle (Arabic / English /
// transliteration, any mix — h2Lang in home2.js). Everything is wired to
// real data: the selected domain's moments, this browser's mastery, and
// the CTA opens the real guided session / call.
// ══════════════════════════════════════════════════════════

let branchDomainId = 'family';
let b3Rotation = { x: -5, y: -15 };
let b3Selected = null;      // node id
let b3PrevNode = null;      // sticky node for the panel's exit animation
let b3Nodes = [];
let b3Dragging = false;
let b3AutoRaf = null;

const B3_VIEW_KEY = 'tariga_branch3d_v1';
function b3GetView() {
  try { const v = localStorage.getItem(B3_VIEW_KEY); return ['parallax', 'orbit', 'helix'].includes(v) ? v : 'parallax'; } catch (e) { return 'parallax'; }
}
function b3SetView(v) {
  try { localStorage.setItem(B3_VIEW_KEY, v); } catch (e) {}
  b3Selected = null; b3PrevNode = null;
  b3Rotation = { x: -5, y: -15 };
  renderBranch();
}

const B3_TRUNK_TOP = -780;
const B3_TRUNK_BOTTOM = 400;
const B3_TRUNK_HEIGHT = B3_TRUNK_BOTTOM - B3_TRUNK_TOP;
const B3_TRUNK_W_BOTTOM = 140;
const B3_TRUNK_W_TOP = 20;

// ── node placements per view ──
// parallax: the mockup's 8 zigzag spots, extended procedurally
const B3_POS = [
  { x: -10, y: 350, z: 80 }, { x: -160, y: 150, z: 20 }, { x: 150, y: 0, z: -50 },
  { x: -130, y: -150, z: -110 }, { x: 140, y: -300, z: -70 }, { x: -150, y: -450, z: 50 },
  { x: 90, y: -600, z: 140 }, { x: -30, y: -720, z: 10 },
];
function b3Pos(i) {
  if (i < B3_POS.length) return B3_POS[i];
  const k = i - B3_POS.length;
  return { x: (k % 2 ? -140 : 120) + ((i * 37) % 60) - 30, y: -720 - 130 * (k + 1), z: ((i * 89) % 240) - 120 };
}
// orbit: the Orbit.tsx spine pattern (x/z pairs × 55, climbing y)
const B3_ORBIT_XZ = [[0, 0], [0.6, 0.4], [-0.4, -0.2], [0.5, -0.5], [-0.2, 0.4], [0.8, -0.1], [-0.5, 0.6], [0.3, -0.3]];
function b3PosOrbit(i, n) {
  const [ox, oz] = B3_ORBIT_XZ[i % B3_ORBIT_XZ.length];
  const step = n > 8 ? 120 : 145;
  return { x: ox * 55, y: 330 - i * step, z: oz * 55 };
}
// helix: spiral around the trunk
function b3PosHelix(i, n) {
  const ang = -0.6 + i * 0.85;
  const r = 165;
  const step = n > 8 ? 115 : 135;
  return { x: Math.cos(ang) * r, y: 330 - i * step, z: Math.sin(ang) * r };
}

function branchOpen(domainId) {
  branchDomainId = domainId || 'family';
  b3Rotation = { x: -5, y: -15 };
  b3Selected = null; b3PrevNode = null;
  setMode('branch');
}

// real moments → 3D lesson nodes (Arabic + translit from verified content)
function b3BuildNodes() {
  const view = b3GetView();
  const d = (typeof dmDomains === 'function' ? dmDomains() : []).find(x => x.id === branchDomainId);
  const items = d ? d.items : [];
  const prog = getGuidedProgress();
  const n = items.length;
  return items.map((it, i) => {
    const g = GUIDED_SCENARIOS.find(x => x.id === it.id);
    const cs = CALL_SEQUENCES.find(x => x.id === it.id);
    const ar = g ? (g.targets && g.targets[0] ? g.targets[0].ar : '—')
      : cs ? (cs.turns && cs.turns[0] ? cs.turns[0].ar : '—') : '—';
    const ph = g ? (g.targets && g.targets[0] ? g.targets[0].ph || '' : '')
      : cs ? (cs.turns && cs.turns[0] ? cs.turns[0].ph || '' : '') : '';
    const p = prog[it.id];
    const master = it.status === 'done'
      ? (p && p.total ? Math.round((p.hits / p.total) * 100) : 100)
      : it.status === 'next' ? (p && p.total ? Math.round((p.hits / p.total) * 100) : 15) : 0;
    const pos = view === 'orbit' ? b3PosOrbit(i, n) : view === 'helix' ? b3PosHelix(i, n) : b3Pos(i);
    return {
      id: it.id, kind: it.kind, arabic: ar, ph, english: it.title,
      status: it.status === 'done' ? 'completed' : it.status === 'next' ? 'current' : it.status === 'open' ? 'open' : 'locked',
      master, ...pos,
    };
  });
}

const B3_CHECK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const B3_LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

function b3Cross(style, faceBg, clip, shade) {
  return `
    <div style="${style};transform-style:preserve-3d">
      ${[0, 90].map(rx => `
      <div style="position:absolute;inset:0;background:${faceBg};${clip ? 'clip-path:' + clip + ';' : ''}border-radius:5px;transform:rotateX(${rx}deg)">
        ${shade ? `<div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(0,0,0,${shade[0]}), transparent, rgba(0,0,0,${shade[1]}))"></div>` : ''}
      </div>`).join('')}
    </div>`;
}

function b3PathLine(p1, p2, active, thick) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
  const h = thick || 10;
  const color = active ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #4a352a, #2a1f1a)';
  return `
    <div style="position:absolute;left:0;top:0;margin-top:${-h / 2}px;width:${length}px;height:${h}px;transform-origin:0 50%;transform:translate3d(${p1.x}px, ${p1.y}px, ${p1.z}px) rotateY(${yaw}rad) rotateZ(${pitch}rad);transform-style:preserve-3d">
      ${[0, 90].map(rx => `<div style="position:absolute;inset:0;background:${color};${active ? 'box-shadow:0 0 15px rgba(245,158,11,0.6);' : ''}border-radius:${h / 2}px;transform:rotateX(${rx}deg)"></div>`).join('')}
    </div>`;
}

function b3Branch(node) {
  const startY = node.y + 70;
  const dy = node.y - startY, dx = node.x, dz = node.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
  const heightRatio = Math.max(0, Math.min(1, (B3_TRUNK_BOTTOM - startY) / B3_TRUNK_HEIGHT));
  const thickness = 28 * (1 - heightRatio * 0.5);
  return b3Cross(
    `position:absolute;left:0;top:${startY}px;width:${length}px;height:${thickness}px;transform-origin:0 50%;transform:translateY(-50%) rotateY(${yaw}rad) rotateZ(${pitch}rad)`,
    'linear-gradient(180deg, #8a5a33 0%, #5c3a21 40%, #2a1f1a 100%)',
    'polygon(0 0, 100% 35%, 100% 65%, 0 100%)', [0.4, 0.6]);
}

function b3Decorative(i) {
  const rand = (i * 137) % 100 / 100;
  const rand2 = (i * 251) % 100 / 100;
  const rand3 = (i * 389) % 100 / 100;
  const startY = B3_TRUNK_BOTTOM - (rand * B3_TRUNK_HEIGHT * 0.85) - 30;
  const length = 150 + rand2 * 200;
  const yaw = rand3 * Math.PI * 2;
  const pitch = -0.15 - rand * 0.7;
  const scale = 1 - (B3_TRUNK_BOTTOM - startY) / B3_TRUNK_HEIGHT;
  const thickness = 24 * scale;
  return b3Cross(
    `position:absolute;left:0;top:${startY}px;width:${length}px;height:${thickness}px;transform-origin:0 50%;transform:translateY(-50%) rotateY(${yaw}rad) rotateZ(${pitch}rad)`,
    'linear-gradient(180deg, #7a4a2a 0%, #4a3020 50%, #1a1311 100%)',
    'polygon(0 0, 100% 40%, 100% 60%, 0 100%)', [0.5, 0.8]);
}

let b3Particles = null;
function b3ParticlesHTML() {
  if (!b3Particles) {
    b3Particles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.floor(((i * 131) % 800)) - 400,
      y: Math.floor(((i * 271) % 1400)) - 700,
      z: Math.floor(((i * 419) % 600)) - 300,
      size: ((i * 73) % 30) / 10 + 1.5,
      delay: ((i * 97) % 50) / 10,
      duration: ((i * 61) % 80) / 10 + 6,
    }));
  }
  return b3Particles.map(p => `
    <div style="position:absolute;left:0;top:0;transform:translate3d(${p.x}px, ${p.y}px, ${p.z}px);transform-style:preserve-3d">
      <div class="b3-counter" data-base="" style="width:${p.size}px;height:${p.size}px;background:#fbbf24;border-radius:50%;box-shadow:0 0 10px #fbbf24;animation:h2FloatUp ${p.duration}s infinite linear ${p.delay}s;opacity:0;transform:rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)"></div>
    </div>`).join('');
}

// language-aware label stack under each node
function b3NodeLabelHTML(node) {
  const lang = (typeof h2Lang === 'function') ? h2Lang() : { ar: true, en: true, ph: false };
  const unlocked = node.status !== 'locked';
  const arLong = String(node.arabic).length > 14;
  const lines = [
    lang.ar ? `<div dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:${arLong ? 19 : 30}px;line-height:1.5;white-space:nowrap;max-width:320px;overflow:hidden;text-overflow:ellipsis;color:${unlocked ? '#f9f0e0' : '#8a756a'};${unlocked ? 'text-shadow:0 2px 4px rgba(0,0,0,1)' : ''}">${escAttr(node.arabic)}</div>` : '',
    lang.en ? `<div style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;line-height:1.35;white-space:nowrap;max-width:300px;overflow:hidden;text-overflow:ellipsis;color:${unlocked ? 'rgba(249,240,224,0.85)' : '#6a5a50'}">${escAttr(node.english)}</div>` : '',
    lang.ph && node.ph ? `<div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:12px;line-height:1.35;white-space:nowrap;max-width:300px;overflow:hidden;text-overflow:ellipsis;color:${unlocked ? 'rgba(212,175,55,0.9)' : '#5a4a40'}">${escAttr(node.ph)}</div>` : '',
  ].filter(Boolean).join('');
  return `<div style="margin-top:12px;display:flex;flex-direction:column;align-items:center;gap:1px;border-radius:12px;padding:5px 14px;width:max-content;max-width:340px;background-color:rgba(10,8,7,0.88);box-shadow:0 2px 10px rgba(0,0,0,0.6)">${lines}</div>`;
}

// the Orbit view's glowing sphere (vs the parallax/helix status circle)
function b3SphereHTML(node, idx, isSel) {
  const lit = node.status === 'completed' || node.status === 'current';
  const cur = node.status === 'current';
  const size = cur ? 40 : 28;
  const core = lit
    ? 'radial-gradient(circle at 35% 35%, #ffe9c4, #ffcc80 45%, #b3731d 85%, #6b4310)'
    : node.status === 'open'
      ? 'radial-gradient(circle at 35% 35%, #6a4a33, #3e2723 70%, #241611)'
      : 'radial-gradient(circle at 35% 35%, #4a352a, #2a1b12 70%, #170e08)';
  const glow = cur ? '0 0 26px rgba(255,170,51,0.75), 0 0 60px rgba(255,170,51,0.3)'
    : node.status === 'completed' ? '0 0 18px rgba(255,170,51,0.45)' : 'inset -3px -3px 8px rgba(0,0,0,0.6)';
  return `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size + 24}px;height:${size + 24}px">
      ${lit ? `<div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle, rgba(255,170,51,${cur ? 0.28 : 0.16}), transparent 70%)"></div>` : ''}
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${core};box-shadow:${glow};${cur ? 'animation:h2Breathe 2.4s ease-in-out infinite;' : ''}display:flex;align-items:center;justify-content:center;color:#1a0d00;font-weight:800;font-size:13px">
        ${node.status === 'locked' ? '<span style="color:#4a352a;display:flex">' + B3_LOCK.replace('width="20" height="20"', 'width="13" height="13"') + '</span>' : ''}
      </div>
    </div>`;
}

// the Parallax/Helix status circle (amber fill / ring / quiet / locked)
function b3CircleHTML(node, idx) {
  return `
    <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;transition:all .5s;${
      node.status === 'completed' ? 'background:#f59e0b;color:#451a03' :
      node.status === 'current' ? 'background:#2a1f1a;border:2px solid #f59e0b;color:#f59e0b' :
      node.status === 'open' ? 'background:#1a1311;border:2px solid #4a352a;color:#8a756a' :
      'background:#0a0807;border:2px solid #3d2b1f;color:#4a352a'}">
      ${node.status === 'completed' ? `<div style="position:absolute;inset:0;border-radius:50%;box-shadow:0 0 20px rgba(245,158,11,0.6)"></div>${B3_CHECK}` :
        node.status === 'locked' ? B3_LOCK :
        `${node.status === 'current' ? '<div style="position:absolute;inset:0;border-radius:50%;box-shadow:0 0 15px rgba(245,158,11,0.3)"></div>' : ''}<span style="font-weight:700;font-size:20px">${idx + 1}</span>`}
    </div>`;
}

function b3PanelHTML(node) {
  if (!node) return '';
  const lang = (typeof h2Lang === 'function') ? h2Lang() : { ar: true, en: true, ph: false };
  const locked = node.status === 'locked';
  const showEn = lang.en || (!lang.ar && !lang.ph);
  return `
    <div style="background:rgba(26,19,17,0.95);backdrop-filter:blur(24px);border:1px solid #3d2b1f;padding:24px;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.8);display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden;pointer-events:auto">
      <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="min-width:0">
          ${lang.ar ? `<h2 dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:${String(node.arabic).length > 16 ? 21 : 30}px;color:#fbbf24;margin:0 0 4px;line-height:1.5">${escAttr(node.arabic)}</h2>` : ''}
          ${showEn ? `<p style="font-family:'Instrument Serif',serif;font-size:${String(node.english).length > 26 ? 17 : 24}px;color:rgba(249,240,224,0.7);letter-spacing:0.02em;font-style:italic;margin:0;line-height:1.3">${escAttr(node.english)}</p>` : ''}
          ${lang.ph && node.ph ? `<p style="font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(212,175,55,0.9);margin:4px 0 0;line-height:1.4">${escAttr(node.ph)}</p>` : ''}
        </div>
        ${locked
          ? `<div style="width:56px;height:56px;flex-shrink:0;border-radius:50%;border:1px solid #3d2b1f;background:#0a0807;display:flex;align-items:center;justify-content:center;color:#4a352a;box-shadow:inset 0 2px 6px rgba(0,0,0,0.5)">${B3_LOCK}</div>`
          : `<div style="width:56px;height:56px;flex-shrink:0;border-radius:50%;border:1px solid rgba(245,158,11,0.3);background:#2a1f1a;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 2px 6px rgba(0,0,0,0.5)"><span style="font-weight:700;color:#f59e0b;font-size:17px;line-height:1">${node.master}%</span></div>`}
      </div>
      <div style="height:10px;width:100%;background:#0a0807;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,0.6)">
        <div style="height:100%;background:linear-gradient(90deg, #8b5a2b, #d4af37, #ffcc80);border-radius:999px;transition:width 1s ease-out;position:relative;overflow:hidden;width:${node.master}%">
          <div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transform:translateX(-100%);animation:h2Shimmer 2s infinite"></div>
        </div>
      </div>
      <button ${locked ? 'disabled' : `onclick="dmOpenItem('${node.kind}','${escAttr(node.id)}',false)"`}
        style="width:100%;padding:16px;border-radius:12px;font-weight:700;letter-spacing:0.02em;font-size:15px;border:none;transition:all .2s;${locked
          ? 'background:#2a1f1a;color:#8a756a;cursor:not-allowed'
          : 'background:#d97706;color:#f9f0e0;cursor:pointer;box-shadow:0 0 20px rgba(217,119,6,0.3)'}"
        ${locked ? '' : `onmouseover="this.style.background='#f59e0b'" onmouseout="this.style.background='#d97706'"`}>
        ${locked ? 'Locked' : node.status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
      </button>
    </div>`;
}

function b3RestScale() {
  const view = b3GetView();
  if (view === 'parallax') return b3Nodes.length > 8 ? 0.45 : 0.6;
  return b3Nodes.length > 8 ? 0.5 : 0.62;
}

function renderBranch() {
  document.body.classList.add('h2-page');
  const view = b3GetView();
  b3Nodes = b3BuildNodes();
  const ca = document.getElementById('content-area');
  const xp = (totalAttemptCount() * 25 + Object.keys(getGuidedProgress()).length * 40).toLocaleString('en-US');
  const d = DOMAINS.find(x => x.id === branchDomainId);
  const stageBg = view === 'orbit' ? '#120a05' : '#14100E';

  const nodesHTML = b3Nodes.map((node, idx) => {
    const isSel = b3Selected === node.id;
    return `
    <div data-base="translate3d(${node.x}px, ${node.y}px, ${node.z}px)" style="position:absolute;left:0;top:0;transform:translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)" class="b3-counter">
      <button onclick="event.stopPropagation();b3Select('${escAttr(node.id)}')" data-node="${escAttr(node.id)}"
        class="b3-nodebtn" style="position:absolute;transform:translate(-50%,-50%) scale(${isSel ? 1.25 : 1});display:flex;flex-direction:column;align-items:center;pointer-events:auto;transition:transform .5s;min-width:240px;background:none;border:none;cursor:pointer;color:inherit">
        ${view === 'orbit' ? b3SphereHTML(node, idx, isSel) : b3CircleHTML(node, idx)}
        <div style="transform:translateZ(1px)">${b3NodeLabelHTML(node)}</div>
      </button>
    </div>`;
  }).join('');

  // per-view scenery
  let scenery = '';
  if (view === 'parallax') {
    scenery = `
      ${Array.from({ length: 6 }).map((_, i) => `
      <div style="position:absolute;left:${-B3_TRUNK_W_BOTTOM / 2}px;top:${B3_TRUNK_TOP}px;width:${B3_TRUNK_W_BOTTOM}px;height:${B3_TRUNK_HEIGHT}px;background:linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%);clip-path:polygon(calc(50% - ${B3_TRUNK_W_TOP / 2}px) 0, calc(50% + ${B3_TRUNK_W_TOP / 2}px) 0, 100% 100%, 0 100%);transform-origin:50% 100%;transform:rotateY(${i * 30}deg)">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, #0a0807, transparent, rgba(120,53,15,0.3));opacity:0.8"></div>
      </div>`).join('')}
      ${Array.from({ length: 14 }).map((_, i) => b3Decorative(i)).join('')}
      ${b3Nodes.map(n => b3Branch(n)).join('')}
      ${b3Nodes.map((n, i) => i === b3Nodes.length - 1 ? '' : b3PathLine(n, b3Nodes[i + 1], b3Nodes[i + 1].status === 'completed' || b3Nodes[i + 1].status === 'current')).join('')}`;
  } else if (view === 'orbit') {
    // the Orbit.tsx spine: thick segments between nodes, golden along real
    // progress, short decorative stubs, no trunk
    const stub = (n, i) => {
      const side = i % 2 ? -1 : 1;
      const end = { x: n.x + side * (120 + (i * 43) % 60), y: n.y - 60 - (i * 29) % 50, z: n.z + side * ((i * 61) % 90 - 45) };
      return b3PathLine(n, end, false, 7);
    };
    scenery = `
      ${b3Nodes.map((n, i) => i === b3Nodes.length - 1 ? '' : b3PathLine(n, b3Nodes[i + 1],
        n.status === 'completed' && (b3Nodes[i + 1].status === 'completed' || b3Nodes[i + 1].status === 'current'), 14)).join('')}
      ${b3Nodes.filter((_, i) => i % 2 === 1).map((n, i) => stub(n, i)).join('')}`;
  } else {
    // helix: trunk + spiral path
    scenery = `
      ${Array.from({ length: 6 }).map((_, i) => `
      <div style="position:absolute;left:${-B3_TRUNK_W_BOTTOM / 2}px;top:${B3_TRUNK_TOP}px;width:${B3_TRUNK_W_BOTTOM}px;height:${B3_TRUNK_HEIGHT}px;background:linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%);clip-path:polygon(calc(50% - ${B3_TRUNK_W_TOP / 2}px) 0, calc(50% + ${B3_TRUNK_W_TOP / 2}px) 0, 100% 100%, 0 100%);transform-origin:50% 100%;transform:rotateY(${i * 30}deg)">
        <div style="position:absolute;inset:0;background:linear-gradient(to top, #0a0807, transparent, rgba(120,53,15,0.3));opacity:0.8"></div>
      </div>`).join('')}
      ${Array.from({ length: 8 }).map((_, i) => b3Decorative(i)).join('')}
      ${b3Nodes.map((n, i) => i === b3Nodes.length - 1 ? '' : b3PathLine(n, b3Nodes[i + 1], b3Nodes[i + 1].status === 'completed' || b3Nodes[i + 1].status === 'current', 9)).join('')}`;
  }

  const viewPill = (v, label) => `
    <button onclick="b3SetView('${v}')" style="padding:8px 16px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(12px);transition:all .2s;font-family:'DM Sans',sans-serif;
      ${view === v ? 'background:rgba(212,175,55,0.18);border:1px solid rgba(212,175,55,0.5);color:#ffcc80'
                   : 'background:rgba(26,18,11,0.7);border:1px solid rgba(212,175,55,0.15);color:rgba(255,204,128,0.55)'}">${label}</button>`;

  ca.innerHTML = `
  <div class="h2-branch tariga-theme-dark" id="b3-stage" style="background:${stageBg}">
    <div style="position:absolute;inset:0;background:radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%);pointer-events:none"></div>

    <div style="position:absolute;inset:0;pointer-events:none;perspective:1000px">
      <div id="b3-scale" style="position:absolute;left:50%;top:50%;transform:scale(${b3RestScale()});transition:transform 1s cubic-bezier(0.2,0.8,0.2,1);transform-style:preserve-3d">
        <div id="b3-rot" style="transform:rotateX(${b3Rotation.x}deg) rotateY(${b3Rotation.y}deg);transform-style:preserve-3d">
          <div id="b3-focus" style="transform:translate3d(0px, 175px, 0px);transition:transform 1s cubic-bezier(0.2,0.8,0.2,1);transform-style:preserve-3d">
            <div style="position:absolute;left:0;top:${B3_TRUNK_BOTTOM}px;width:300px;height:300px;transform:translate(-50%,-50%) rotateX(90deg);background:radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 30%, transparent 70%)"></div>
            ${scenery}
            ${b3ParticlesHTML()}
            ${nodesHTML}
          </div>
        </div>
      </div>
    </div>

    <div style="position:absolute;top:0;left:0;padding:24px;z-index:10;display:flex;flex-direction:column;pointer-events:none">
      <button onclick="setMode('home')" style="pointer-events:auto;align-self:flex-start;margin-bottom:10px;padding:8px 16px;border-radius:999px;background:rgba(26,18,11,0.8);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,0.3);color:#ffcc80;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer">← Home</button>
      <span style="font-family:'Instrument Serif',serif;font-size:48px;color:#ffcc80;line-height:1;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5))">طريقة</span>
      <span style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(212,175,55,0.8);margin:6px 0 0 4px">Tariga Learning${d ? ' · ' + escAttr(d.label) : ''}</span>
    </div>
    <div style="position:absolute;top:24px;right:24px;z-index:10;display:flex;flex-direction:column;align-items:flex-end;gap:10px">
      <button style="display:flex;align-items:center;gap:10px;background:rgba(26,18,11,0.8);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,0.3);border-radius:999px;padding:10px 20px;cursor:pointer;box-shadow:0 20px 50px rgba(0,0,0,0.5)"
        onmouseover="this.style.background='rgba(42,29,23,0.8)'" onmouseout="this.style.background='rgba(26,18,11,0.8)'">
        <span style="width:10px;height:10px;border-radius:50%;background:#ffcc80;animation:h2Pulse 2s ease-in-out infinite"></span>
        <span style="font-size:14px;font-weight:700;color:#ffcc80;letter-spacing:0.06em">${xp} XP</span>
      </button>
      ${typeof h2LangChipsHTML === 'function' ? h2LangChipsHTML() : ''}
    </div>

    <div style="position:absolute;top:32px;left:50%;transform:translateX(-50%);pointer-events:none;opacity:0.8;z-index:10">
      <div style="padding:10px 20px;border-radius:999px;border:1px solid rgba(245,158,11,0.2);background:rgba(26,19,17,0.6);backdrop-filter:blur(12px);color:rgba(254,243,199,0.9);font-size:14px;letter-spacing:0.02em;box-shadow:0 8px 24px rgba(0,0,0,0.4)">
        Drag to rotate • Click a node to zoom
      </div>
    </div>

    <!-- the three 3D views -->
    <div style="position:absolute;bottom:24px;left:24px;z-index:10;display:flex;gap:8px">
      ${viewPill('parallax', 'Tree')}${viewPill('orbit', 'Orbit')}${viewPill('helix', 'Helix')}
    </div>

    <div id="b3-panel" style="position:absolute;bottom:48px;left:50%;width:340px;max-width:calc(100vw - 32px);z-index:10;pointer-events:none;transition:all .5s;transform:translateX(-50%) translateY(48px);opacity:0">
      ${b3PanelHTML(b3PrevNode)}
    </div>
  </div>`;

  b3BindDrag();
  b3Apply();
  b3StartAuto();
}

function b3Select(id) {
  b3Selected = id;
  b3PrevNode = b3Nodes.find(n => n.id === id) || b3PrevNode;
  const panel = document.getElementById('b3-panel');
  if (panel) panel.innerHTML = b3PanelHTML(b3PrevNode);
  b3Apply();
}

function b3Apply() {
  const sel = b3Nodes.find(n => n.id === b3Selected);
  const focus = sel ? { x: -sel.x, y: -sel.y, z: -sel.z, scale: 1.4 } : { x: 0, y: 175, z: 0, scale: b3RestScale() };
  const scaleEl = document.getElementById('b3-scale');
  const focusEl = document.getElementById('b3-focus');
  const rotEl = document.getElementById('b3-rot');
  const panel = document.getElementById('b3-panel');
  if (scaleEl) scaleEl.style.transform = `scale(${focus.scale})`;
  if (focusEl) focusEl.style.transform = `translate3d(${focus.x}px, ${focus.y}px, ${focus.z}px)`;
  if (rotEl) rotEl.style.transform = `rotateX(${b3Rotation.x}deg) rotateY(${b3Rotation.y}deg)`;
  // counter-rotate to face the camera, then lift along the view axis so
  // label pills sit IN FRONT of branch segments (selected node pops out
  // furthest — "come out from under the branch")
  const counterTf = ` rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)`;
  const view = b3GetView();
  document.querySelectorAll('.b3-counter').forEach(el => {
    const btn = el.querySelector('.b3-nodebtn');
    const lift = btn ? ((view === 'orbit' ? 40 : 14) + (btn.dataset.node === b3Selected ? 100 : 0)) : 0;
    el.style.transform = (el.dataset.base || '') + counterTf + (lift ? ` translateZ(${lift}px)` : '');
  });
  document.querySelectorAll('.b3-nodebtn').forEach(btn => {
    btn.style.transform = `translate(-50%,-50%) scale(${btn.dataset.node === b3Selected ? 1.25 : 1})`;
  });
  if (panel) {
    panel.style.opacity = b3Selected !== null ? '1' : '0';
    panel.style.transform = `translateX(-50%) translateY(${b3Selected !== null ? 0 : 48}px)`;
    panel.style.pointerEvents = b3Selected !== null ? 'auto' : 'none';
  }
}

// slow auto-orbit for the Orbit and Helix views (pauses on drag/selection).
// Applies every other frame — same speed, half the style-recalc load.
function b3StartAuto() {
  if (b3AutoRaf) cancelAnimationFrame(b3AutoRaf);
  let frame = 0;
  const tick = () => {
    const stage = document.getElementById('b3-stage');
    if (!stage || !stage.isConnected) { b3AutoRaf = null; return; }
    if (b3GetView() !== 'parallax' && !b3Dragging && b3Selected === null && (frame++ % 2 === 0)) {
      b3Rotation.y += 0.2;
      b3Apply();
    }
    b3AutoRaf = requestAnimationFrame(tick);
  };
  b3AutoRaf = requestAnimationFrame(tick);
}

function b3BindDrag() {
  const stage = document.getElementById('b3-stage');
  if (!stage) return;
  let dragged = false, start = { x: 0, y: 0 }, startRot = { x: 0, y: 0 };
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    b3Dragging = true; dragged = false;
    start = { x: e.clientX, y: e.clientY };
    startRot = { ...b3Rotation };
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  stage.addEventListener('pointermove', (e) => {
    if (!b3Dragging) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true;
    const freeYaw = b3GetView() !== 'parallax';   // orbit/helix spin all the way round
    b3Rotation = {
      x: Math.max(-25, Math.min(25, startRot.x - dy * 0.3)),
      y: freeYaw ? startRot.y + dx * 0.3 : Math.max(-45, Math.min(45, startRot.y + dx * 0.3)),
    };
    b3Apply();
  });
  const up = (e) => {
    if (!b3Dragging) return;
    b3Dragging = false;
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    if (!dragged && !e.target.closest('button')) { b3Selected = null; b3Apply(); }
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointerleave', up);
}
