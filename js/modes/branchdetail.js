// ══════════════════════════════════════════════════════════
// BRANCH DETAIL — the tariga-handoff's full-screen CSS 3D tree,
// ported 1:1 from tariga-handoff/src/screens/Parallax.tsx (no WebGL,
// no Three.js — pure CSS 3D transforms). Reached by zooming a branch
// on the home tree and tapping "Explore this branch in 3D".
// Wired to REAL data: the selected domain's moments become the lesson
// nodes (Arabic from the verified targets, mastery from this browser's
// guided progress), and the CTA opens the real guided session / call.
// Header chrome (wordmark + XP pill) follows the Orbit.tsx reference.
// ══════════════════════════════════════════════════════════

let branchDomainId = 'family';
let b3Rotation = { x: -5, y: -15 };
let b3Selected = null;      // node id
let b3PrevNode = null;      // sticky node for the panel's exit animation
let b3Nodes = [];

const B3_TRUNK_TOP = -780;
const B3_TRUNK_BOTTOM = 400;
const B3_TRUNK_HEIGHT = B3_TRUNK_BOTTOM - B3_TRUNK_TOP;
const B3_TRUNK_W_BOTTOM = 140;
const B3_TRUNK_W_TOP = 20;

// the mockup's 8 node placements; extended procedurally past 8 so bigger
// real domains keep the same zigzag spine
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

function branchOpen(domainId) {
  branchDomainId = domainId || 'family';
  b3Rotation = { x: -5, y: -15 };
  b3Selected = null; b3PrevNode = null;
  setMode('branch');
}

// real moments → 3D lesson nodes
function b3BuildNodes() {
  const d = (typeof dmDomains === 'function' ? dmDomains() : []).find(x => x.id === branchDomainId);
  const items = d ? d.items : [];
  const prog = getGuidedProgress();
  return items.map((it, i) => {
    const g = GUIDED_SCENARIOS.find(x => x.id === it.id);
    const cs = CALL_SEQUENCES.find(x => x.id === it.id);
    const ar = g ? (g.targets && g.targets[0] ? g.targets[0].ar : '—')
      : cs ? (cs.turns && cs.turns[0] ? cs.turns[0].ar : '—') : '—';
    const p = prog[it.id];
    const master = it.status === 'done'
      ? (p && p.total ? Math.round((p.hits / p.total) * 100) : 100)
      : it.status === 'next' ? (p && p.total ? Math.round((p.hits / p.total) * 100) : 15) : 0;
    return {
      id: it.id, kind: it.kind, arabic: ar, english: it.title,
      // four visual states: completed (amber fill), current (amber ring —
      // the one "next" moment), open (available but quiet), locked
      status: it.status === 'done' ? 'completed' : it.status === 'next' ? 'current' : it.status === 'open' ? 'open' : 'locked',
      master, ...b3Pos(i),
    };
  });
}

const B3_CHECK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const B3_LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

// cross-section element used by branches and path lines (two faces at
// rotateX 0° / 90° — the mockup's 3D-volume illusion)
function b3Cross(style, faceBg, clip, shade) {
  return `
    <div style="${style};transform-style:preserve-3d">
      ${[0, 90].map(rx => `
      <div style="position:absolute;inset:0;background:${faceBg};${clip ? 'clip-path:' + clip + ';' : ''}border-radius:5px;transform:rotateX(${rx}deg)">
        ${shade ? `<div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(0,0,0,${shade[0]}), transparent, rgba(0,0,0,${shade[1]}))"></div>` : ''}
      </div>`).join('')}
    </div>`;
}

function b3PathLine(p1, p2, active) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
  const color = active ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #4a352a, #2a1f1a)';
  return `
    <div style="position:absolute;left:0;top:0;margin-top:-5px;width:${length}px;height:10px;transform-origin:0 50%;transform:translate3d(${p1.x}px, ${p1.y}px, ${p1.z}px) rotateY(${yaw}rad) rotateZ(${pitch}rad);transform-style:preserve-3d">
      ${[0, 90].map(rx => `<div style="position:absolute;inset:0;background:${color};${active ? 'box-shadow:0 0 15px rgba(245,158,11,0.6);' : ''}border-radius:5px;transform:rotateX(${rx}deg)"></div>`).join('')}
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
      <div class="b3-counter" style="width:${p.size}px;height:${p.size}px;background:#fbbf24;border-radius:50%;box-shadow:0 0 10px #fbbf24;animation:h2FloatUp ${p.duration}s infinite linear ${p.delay}s;opacity:0;transform:rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)"></div>
    </div>`).join('');
}

function b3PanelHTML(node) {
  if (!node) return '';
  const locked = node.status === 'locked';
  return `
    <div style="background:rgba(26,19,17,0.95);backdrop-filter:blur(24px);border:1px solid #3d2b1f;padding:24px;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.8);display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden;pointer-events:auto">
      <div style="position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="min-width:0">
          <h2 dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:${String(node.arabic).length > 16 ? 21 : 30}px;color:#fbbf24;margin:0 0 4px;line-height:1.5">${escAttr(node.arabic)}</h2>
          <p style="font-family:'Instrument Serif',serif;font-size:${String(node.english).length > 26 ? 17 : 24}px;color:rgba(249,240,224,0.7);letter-spacing:0.02em;font-style:italic;margin:0;line-height:1.3">${escAttr(node.english)}</p>
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

function renderBranch() {
  document.body.classList.add('h2-page');
  b3Nodes = b3BuildNodes();
  const ca = document.getElementById('content-area');
  const xp = (totalAttemptCount() * 25 + Object.keys(getGuidedProgress()).length * 40).toLocaleString('en-US');
  const d = DOMAINS.find(x => x.id === branchDomainId);

  const nodesHTML = b3Nodes.map(node => {
    const isSel = b3Selected === node.id;
    const unlocked = node.status !== 'locked';
    const arLong = String(node.arabic).length > 14;
    return `
    <div style="position:absolute;left:0;top:0;transform:translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)" class="b3-counter">
      <button onclick="event.stopPropagation();b3Select('${escAttr(node.id)}')" data-node="${escAttr(node.id)}"
        class="b3-nodebtn" style="position:absolute;transform:translate(-50%,-50%) scale(${isSel ? 1.25 : 1});display:flex;flex-direction:column;align-items:center;pointer-events:auto;transition:transform .5s;min-width:240px;background:none;border:none;cursor:pointer;color:inherit">
        <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;transition:all .5s;${
          node.status === 'completed' ? 'background:#f59e0b;color:#451a03' :
          node.status === 'current' ? 'background:#2a1f1a;border:2px solid #f59e0b;color:#f59e0b' :
          node.status === 'open' ? 'background:#1a1311;border:2px solid #4a352a;color:#8a756a' :
          'background:#0a0807;border:2px solid #3d2b1f;color:#4a352a'}">
          ${node.status === 'completed' ? `<div style="position:absolute;inset:0;border-radius:50%;box-shadow:0 0 20px rgba(245,158,11,0.6)"></div>${B3_CHECK}` :
            node.status === 'locked' ? B3_LOCK :
            `${node.status === 'current' ? '<div style="position:absolute;inset:0;border-radius:50%;box-shadow:0 0 15px rgba(245,158,11,0.3)"></div>' : ''}<span style="font-weight:700;font-size:20px">${b3Nodes.indexOf(node) + 1}</span>`}
        </div>
        <div style="margin-top:12px;display:flex;flex-direction:column;align-items:center;transform:translateZ(1px)">
          <div dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:${arLong ? 20 : 36}px;transition:color .5s;border-radius:12px;padding:4px 16px;white-space:nowrap;direction:rtl;unicode-bidi:isolate;width:max-content;max-width:340px;overflow:hidden;text-overflow:ellipsis;background-color:rgba(10,8,7,0.82);backdrop-filter:blur(2px);box-shadow:0 2px 10px rgba(0,0,0,0.6);color:${unlocked ? '#f9f0e0' : '#8a756a'};${unlocked ? 'text-shadow:0 2px 4px rgba(0,0,0,1)' : ''}">${escAttr(node.arabic)}</div>
        </div>
      </button>
    </div>`;
  }).join('');

  ca.innerHTML = `
  <div class="h2-branch" id="b3-stage">
    <div style="position:absolute;inset:0;background:radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%);pointer-events:none"></div>

    <!-- 3D scene -->
    <div style="position:absolute;inset:0;pointer-events:none;perspective:1000px">
      <div id="b3-scale" style="position:absolute;left:50%;top:50%;transform:scale(${b3Nodes.length > 8 ? 0.45 : 0.6});transition:transform 1s cubic-bezier(0.2,0.8,0.2,1);transform-style:preserve-3d">
        <div id="b3-rot" style="transform:rotateX(${b3Rotation.x}deg) rotateY(${b3Rotation.y}deg);transform-style:preserve-3d">
          <div id="b3-focus" style="transform:translate3d(0px, 175px, 0px);transition:transform 1s cubic-bezier(0.2,0.8,0.2,1);transform-style:preserve-3d">
            <div style="position:absolute;left:0;top:${B3_TRUNK_BOTTOM}px;width:300px;height:300px;transform:translate(-50%,-50%) rotateX(90deg);background:radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 30%, transparent 70%)"></div>

            ${Array.from({ length: 6 }).map((_, i) => `
            <div style="position:absolute;left:${-B3_TRUNK_W_BOTTOM / 2}px;top:${B3_TRUNK_TOP}px;width:${B3_TRUNK_W_BOTTOM}px;height:${B3_TRUNK_HEIGHT}px;background:linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%);clip-path:polygon(calc(50% - ${B3_TRUNK_W_TOP / 2}px) 0, calc(50% + ${B3_TRUNK_W_TOP / 2}px) 0, 100% 100%, 0 100%);transform-origin:50% 100%;transform:rotateY(${i * 30}deg)">
              <div style="position:absolute;inset:0;background:linear-gradient(to top, #0a0807, transparent, rgba(120,53,15,0.3));opacity:0.8"></div>
            </div>`).join('')}

            ${Array.from({ length: 14 }).map((_, i) => b3Decorative(i)).join('')}
            ${b3Nodes.map(n => b3Branch(n)).join('')}
            ${b3Nodes.map((n, i) => i === b3Nodes.length - 1 ? '' : b3PathLine(n, b3Nodes[i + 1], b3Nodes[i + 1].status === 'completed' || b3Nodes[i + 1].status === 'current')).join('')}
            ${b3ParticlesHTML()}
            ${nodesHTML}
          </div>
        </div>
      </div>
    </div>

    <!-- header chrome (Orbit reference): wordmark top-left, XP top-right -->
    <div style="position:absolute;top:0;left:0;padding:24px;z-index:10;display:flex;flex-direction:column;pointer-events:none">
      <button onclick="setMode('home')" style="pointer-events:auto;align-self:flex-start;margin-bottom:10px;padding:8px 16px;border-radius:999px;background:rgba(26,18,11,0.8);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,0.3);color:#ffcc80;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer">← Home</button>
      <span style="font-family:'Instrument Serif',serif;font-size:48px;color:#ffcc80;line-height:1;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5))">طريقة</span>
      <span style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(212,175,55,0.8);margin:6px 0 0 4px">Tariga Learning${d ? ' · ' + escAttr(d.label) : ''}</span>
    </div>
    <div style="position:absolute;top:24px;right:24px;z-index:10">
      <button style="display:flex;align-items:center;gap:10px;background:rgba(26,18,11,0.8);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,0.3);border-radius:999px;padding:10px 20px;cursor:pointer;box-shadow:0 20px 50px rgba(0,0,0,0.5)"
        onmouseover="this.style.background='rgba(42,29,23,0.8)'" onmouseout="this.style.background='rgba(26,18,11,0.8)'">
        <span style="width:10px;height:10px;border-radius:50%;background:#ffcc80;animation:h2Pulse 2s ease-in-out infinite"></span>
        <span style="font-size:14px;font-weight:700;color:#ffcc80;letter-spacing:0.06em">${xp} XP</span>
      </button>
    </div>

    <!-- hint -->
    <div style="position:absolute;top:32px;left:50%;transform:translateX(-50%);pointer-events:none;opacity:0.8;z-index:10">
      <div style="padding:10px 20px;border-radius:999px;border:1px solid rgba(245,158,11,0.2);background:rgba(26,19,17,0.6);backdrop-filter:blur(12px);color:rgba(254,243,199,0.9);font-size:14px;letter-spacing:0.02em;box-shadow:0 8px 24px rgba(0,0,0,0.4)">
        Drag to rotate • Click a node to zoom
      </div>
    </div>

    <!-- detail panel -->
    <div id="b3-panel" style="position:absolute;bottom:48px;left:50%;width:340px;max-width:calc(100vw - 32px);z-index:10;pointer-events:none;transition:all .5s;transform:translateX(-50%) translateY(48px);opacity:0">
      ${b3PanelHTML(b3PrevNode)}
    </div>
  </div>`;

  b3BindDrag();
  b3Apply();
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
  // big real domains grow taller than the mockup's 8-node spine — pull the
  // resting camera back a touch so the whole branch stays in frame
  const restScale = b3Nodes.length > 8 ? 0.45 : 0.6;
  const focus = sel ? { x: -sel.x, y: -sel.y, z: -sel.z, scale: 1.4 } : { x: 0, y: 175, z: 0, scale: restScale };
  const scaleEl = document.getElementById('b3-scale');
  const focusEl = document.getElementById('b3-focus');
  const rotEl = document.getElementById('b3-rot');
  const panel = document.getElementById('b3-panel');
  if (scaleEl) scaleEl.style.transform = `scale(${focus.scale})`;
  if (focusEl) focusEl.style.transform = `translate3d(${focus.x}px, ${focus.y}px, ${focus.z}px)`;
  if (rotEl) rotEl.style.transform = `rotateX(${b3Rotation.x}deg) rotateY(${b3Rotation.y}deg)`;
  document.querySelectorAll('.b3-counter').forEach(el => {
    const base = el.style.transform.replace(/ ?rotateY\([^)]*\) rotateX\([^)]*\)$/, '');
    el.style.transform = `${base} rotateY(${-b3Rotation.y}deg) rotateX(${-b3Rotation.x}deg)`;
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

function b3BindDrag() {
  const stage = document.getElementById('b3-stage');
  if (!stage) return;
  let dragging = false, dragged = false, start = { x: 0, y: 0 }, startRot = { x: 0, y: 0 };
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    dragging = true; dragged = false;
    start = { x: e.clientX, y: e.clientY };
    startRot = { ...b3Rotation };
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true;
    b3Rotation = {
      x: Math.max(-25, Math.min(25, startRot.x - dy * 0.3)),
      y: Math.max(-45, Math.min(45, startRot.y + dx * 0.3)),
    };
    b3Apply();
  });
  const up = (e) => {
    if (!dragging) return;
    dragging = false;
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    if (!dragged && !e.target.closest('button')) { b3Selected = null; b3Apply(); }
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointerleave', up);
}
