// ══════════════════════════════════════════════════════════
// HOME 2 — the tariga-handoff redesign, ported 1:1 from
// tariga-handoff/src/screens/{IntroScreen,HomePage}.tsx into the
// no-build architecture. Wired to REAL data everywhere it exists:
// nextFocus() for the continue card, live stats, dmDomains() for the
// tree, guidedOpen()/callOpen() for sessions. The mockup's helpers
// (bezier, tapered branch path, ember particles, 3D tilt) are copied
// verbatim — only React state became module state.
// ══════════════════════════════════════════════════════════

const H2_THEME_KEY = 'tariga_theme2_v1';
function h2Theme() {
  try { return localStorage.getItem(H2_THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
}
function h2ThemeToggle() {
  try { localStorage.setItem(H2_THEME_KEY, h2Theme() === 'dark' ? 'light' : 'dark'); } catch (e) {}
  renderHomeDashboard();
}

// tree interaction state (the mockup's useState)
let h2Domain = null;   // selected domain id, null = full tree
let h2Node = null;     // selected moment id within the domain

// ── label language toggle: any mix of Arabic / English / transliteration ──
const H2_LANG_KEY = 'tariga_lang_v1';
function h2Lang() {
  try {
    const v = JSON.parse(localStorage.getItem(H2_LANG_KEY) || 'null');
    if (v && (v.ar || v.en || v.ph)) return v;
  } catch (e) {}
  return { ar: true, en: true, ph: false };
}
function h2LangToggle(k) {
  const v = h2Lang();
  v[k] = !v[k];
  if (!v.ar && !v.en && !v.ph) v[k] = true;   // never let all three go dark
  try { localStorage.setItem(H2_LANG_KEY, JSON.stringify(v)); } catch (e) {}
  if (typeof mode !== 'undefined' && mode === 'branch' && typeof renderBranch === 'function') renderBranch();
  else h2TreeUpdate();
}
function h2LangChipsHTML() {
  const v = h2Lang();
  const chip = (k, label, title) => `
    <button onclick="event.stopPropagation();h2LangToggle('${k}')" title="${title}"
      style="padding:5px 11px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.06em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;
      ${v[k] ? 'background:var(--gold-ghost-bg);border:1px solid var(--gold-border);color:var(--gold)'
             : 'background:transparent;border:1px solid var(--surface-border);color:var(--text-muted)'}">${label}</button>`;
  return `<div style="display:flex;gap:6px;align-items:center">
    ${chip('ar', 'ع', 'Arabic script')}${chip('en', 'EN', 'English')}${chip('ph', 'a·b', 'transliteration')}
  </div>`;
}

// ── helper math, verbatim from HomePage.tsx ──
function h2Bezier(t, p0, p1, p2, p3) {
  const cX = 3 * (p1.x - p0.x), bX = 3 * (p2.x - p1.x) - cX, aX = p3.x - p0.x - cX - bX;
  const cY = 3 * (p1.y - p0.y), bY = 3 * (p2.y - p1.y) - cY, aY = p3.y - p0.y - cY - bY;
  return {
    x: aX * t * t * t + bX * t * t + cX * t + p0.x,
    y: aY * t * t * t + bY * t * t + cY * t + p0.y,
  };
}
function h2Polyline(p0, p1, p2, p3, tMax, steps = 30) {
  if (tMax <= 0) return '';
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const pt = h2Bezier((i / steps) * tMax, p0, p1, p2, p3);
    pts.push(pt.x + ',' + pt.y);
  }
  return pts.join(' ');
}
function h2TaperedPath(curve, startWidth, endWidth) {
  const normal = (pA, pB) => {
    const dx = pB.x - pA.x, dy = pB.y - pA.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { nx: -dy / len, ny: dx / len };
  };
  const n = [normal(curve[0], curve[1]), normal(curve[0], curve[2]), normal(curve[1], curve[3]), normal(curve[2], curve[3])];
  const w = [startWidth / 2, startWidth / 2 * 0.7 + endWidth / 2 * 0.3, startWidth / 2 * 0.3 + endWidth / 2 * 0.7, endWidth / 2];
  const off = (p, nn, ww, dir) => ({ x: p.x + nn.nx * ww * dir, y: p.y + nn.ny * ww * dir });
  const top = curve.map((p, i) => off(p, n[i], w[i], 1));
  const bot = curve.map((p, i) => off(p, n[i], w[i], -1));
  return `M ${top[0].x} ${top[0].y} C ${top[1].x} ${top[1].y}, ${top[2].x} ${top[2].y}, ${top[3].x} ${top[3].y} ` +
    `L ${bot[3].x} ${bot[3].y} C ${bot[2].x} ${bot[2].y}, ${bot[1].x} ${bot[1].y}, ${bot[0].x} ${bot[0].y} Z`;
}

// branch geometry, zoom targets and label anchors — verbatim BRANCH_DEFS
const H2_BRANCH = {
  family: { curve: [{ x: 450, y: 450 }, { x: 600, y: 400 }, { x: 750, y: 300 }, { x: 820, y: 150 }], nodes: [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], zoom: { cx: 635, cy: 300, scale: 1.9 }, labelPos: { x: 840, y: 140 }, labelSide: 'right' },
  friends: { curve: [{ x: 450, y: 450 }, { x: 300, y: 400 }, { x: 150, y: 300 }, { x: 80, y: 150 }], nodes: [0.25, 0.5, 0.75, 0.95], zoom: { cx: 265, cy: 300, scale: 1.9 }, labelPos: { x: 60, y: 140 }, labelSide: 'left' },
  community: { curve: [{ x: 450, y: 450 }, { x: 520, y: 350 }, { x: 600, y: 250 }, { x: 650, y: 100 }], nodes: [0.35, 0.65, 0.95], zoom: { cx: 550, cy: 275, scale: 2.0 }, labelPos: { x: 670, y: 90 }, labelSide: 'right' },
  identity: { curve: [{ x: 450, y: 450 }, { x: 380, y: 350 }, { x: 300, y: 250 }, { x: 250, y: 100 }], nodes: [0.5, 0.9], zoom: { cx: 350, cy: 275, scale: 2.0 }, labelPos: { x: 230, y: 90 }, labelSide: 'left' },
  culture: { curve: [{ x: 450, y: 450 }, { x: 430, y: 350 }, { x: 470, y: 200 }, { x: 450, y: 80 }], nodes: [0.4, 0.8], zoom: { cx: 450, cy: 265, scale: 2.0 }, labelPos: { x: 470, y: 60 }, labelSide: 'right' },
};
const H2_VARS = { family: 'var(--gold)', friends: 'var(--teal)', community: 'var(--green)', identity: 'var(--purple)', culture: 'var(--coral)' };
const H2_GLYPH = { family: '◆', friends: '●', community: '▲', identity: '■', culture: '✦' };

// Arabic + transliteration for a moment, from the verified content
function h2MomentAr(id) {
  const g = GUIDED_SCENARIOS.find(x => x.id === id);
  if (g && g.targets && g.targets[0]) return { ar: g.targets[0].ar, ph: g.targets[0].ph || '' };
  const cs = CALL_SEQUENCES.find(x => x.id === id);
  if (cs && cs.turns && cs.turns[0]) return { ar: cs.turns[0].ar, ph: cs.turns[0].ph || '' };
  return { ar: '', ph: '' };
}

// the REAL tree: shipped curriculum + this browser's progress via dmDomains()
function h2TreeData() {
  const KIND_META = { guided: 'guided · 2 min', call: 'phone call', big: 'big moment', comf: 'comfortable tier' };
  const out = {};
  dmDomains().forEach(d => {
    const def = H2_BRANCH[d.id];
    if (!def) return;
    const n = d.items.length;
    // the mockup's t-values when counts line up; even spread otherwise
    const ts = (n === def.nodes.length) ? def.nodes
      : d.items.map((_, i) => n === 1 ? 0.55 : 0.15 + (0.8 * i) / (n - 1));
    out[d.id] = {
      color: H2_VARS[d.id],
      title: H2_GLYPH[d.id] + ' ' + d.label,
      meta: d.doneN + ' of ' + d.total + ' · ' + d.tier,
      def, ts,
      moments: d.items.map(it => ({
        id: it.id, title: it.title, kind: it.kind, ...h2MomentAr(it.id),
        state: it.status === 'done' ? 'done' : it.status === 'next' ? 'next' : 'locked',
        canOpen: it.status !== 'locked',
        meta: KIND_META[it.kind] || 'guided',
      })),
    };
  });
  return out;
}

// small bark twigs off each branch so the flat tree reads as a real canopy
// (and flows visually into the 3D branch view) — deterministic, decorative
function h2TwigsHTML(def) {
  const c = def.curve;
  return [0.3, 0.55, 0.78].map((t, k) => {
    const p = h2Bezier(t, c[0], c[1], c[2], c[3]);
    const p2 = h2Bezier(Math.min(1, t + 0.02), c[0], c[1], c[2], c[3]);
    let tx = p2.x - p.x, ty = p2.y - p.y;
    const len = Math.sqrt(tx * tx + ty * ty) || 1; tx /= len; ty /= len;
    const side = k % 2 ? 1 : -1;
    const ang = Math.atan2(ty, tx) + side * 0.95;
    const L = 30 + ((Math.abs(def.labelPos.x * 7 + k * 53)) % 22);
    const pt = (f, lift) => ({ x: p.x + Math.cos(ang) * L * f, y: p.y + Math.sin(ang) * L * f - lift });
    return `<path d="${h2TaperedPath([p, pt(0.4, 3), pt(0.75, 8), pt(1, 14)], 5.5, 1.2)}" fill="url(#h2TrunkGrad)" stroke="#1E100A" stroke-width="0.5" opacity="0.85"/>`;
  }).join('');
}

function h2TreeCount() {
  const data = h2TreeData();
  return Object.values(data).reduce((a, d) => a + d.moments.length, 0);
}

// ── ambient background (fixed glows + fractal noise, verbatim) ──
function h2AmbientHTML() {
  return `
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden">
      <div style="position:absolute;top:-20%;left:0%;width:80%;height:80%;border-radius:50%;background:radial-gradient(circle, var(--ambient-gold), transparent 60%);filter:blur(100px);opacity:0.8"></div>
      <div style="position:absolute;top:20%;right:-10%;width:60%;height:70%;border-radius:50%;background:radial-gradient(circle, rgba(201,169,110,0.06), transparent 60%);filter:blur(90px)"></div>
      <div style="position:absolute;bottom:-10%;left:-10%;width:70%;height:60%;border-radius:50%;background:radial-gradient(circle, rgba(224,138,122,0.05), transparent 60%);filter:blur(120px)"></div>
      <div style="position:absolute;inset:0;opacity:0.03;mix-blend-mode:overlay;background-repeat:repeat;background-image:url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)"></div>
    </div>`;
}

// ── 3D tilt (the mockup's use3DTilt, as a post-render binder) ──
function h2BindTilt() {
  document.querySelectorAll('.h2-card, .h2-tile').forEach(el => {
    if (el._h2Tilt) return;
    el._h2Tilt = true;
    const sheen = el.querySelector('.h2-sheen');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) - r.width / 2;
      const dy = (e.clientY - r.top) - r.height / 2;
      const tx = (dy / (r.height / 2)) * -6;
      const ty = (dx / (r.width / 2)) * 6;
      el.style.transition = 'transform 0.1s ease-out';
      el.style.transform = `perspective(1000px) rotateX(${tx}deg) rotateY(${ty}deg)`;
      if (sheen) { sheen.style.opacity = '1'; sheen.style.transform = `translate(${ty * 1.5}px, ${tx * -1.5}px)`; }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s ease-out, box-shadow 0.3s';
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      if (sheen) { sheen.style.opacity = '0.3'; sheen.style.transform = 'translate(0px, 0px)'; }
    });
  });
}

// ── falling ember particles (JourneyParticles, verbatim logic) ──
function h2StartParticles(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = canvas.clientWidth, height = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particles = [];
  for (let i = 0; i < 50; i++) {
    const z = Math.random();
    particles.push({
      x: Math.random() * width, y: Math.random() * height, z,
      size: z * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.6 * (z + 0.5),
      vy: (Math.random() * 0.6 + 0.2) * (z + 0.5),
      opacity: z * 0.7 + 0.1,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: (Math.random() * 0.02 + 0.01) * (z + 0.5),
      color: Math.random() > 0.2 ? '201, 169, 110' : '224, 138, 122',
    });
  }
  const render = (time) => {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(time * 0.001 * p.swaySpeed + p.swayOffset) * 0.5;
      if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }
      if (p.x > width + 10) p.x = -10;
      if (p.x < -10) p.x = width + 10;
      ctx.beginPath();
      const blur = (1 - p.z) * 3;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      if (blur > 0.5) { ctx.shadowBlur = blur * 3; ctx.shadowColor = `rgba(${p.color}, ${p.opacity})`; }
      else { ctx.shadowBlur = p.size * 2; ctx.shadowColor = 'rgba(232, 201, 154, 0.8)'; }
      ctx.fill();
    });
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

// ══════════════════════════════════════════════════════════
// Screen 1 — the intro/daily gate (IntroScreen.tsx)
// ══════════════════════════════════════════════════════════
function renderHome2Gate() {
  document.body.classList.add('h2-page');
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
  <div class="h2-root tariga-theme-dark" style="display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;inset:0;pointer-events:none;z-index:0;display:flex;align-items:center;justify-content:center;overflow:hidden">
      <div style="position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle, rgba(201,169,110,0.08), transparent 60%);filter:blur(60px)"></div>
    </div>

    <div style="position:relative;z-index:10;width:100%;max-width:500px;padding:0 24px 48px;display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="position:relative;width:128px;height:128px;margin-bottom:48px;display:flex;justify-content:center;align-items:center">
        <div style="position:absolute;inset:0;border-radius:50%;background:var(--gold);filter:blur(30px);opacity:0.3;animation:h2Breathe 4s ease-in-out infinite"></div>
        <div style="width:96px;height:96px;border-radius:50%;position:relative;z-index:10;overflow:hidden;animation:h2Breathe 4s ease-in-out infinite">
          <tariga-orb2 mode="idle"></tariga-orb2>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:32px">
        <h1 class="font-serif-ar" dir="rtl" style="font-size:52px;line-height:1.25;color:var(--gold);margin:0;font-weight:400;text-shadow:0 0 30px rgba(201,169,110,0.3)">السلام عليكم</h1>
        <div class="font-serif-ar" style="font-style:italic;font-size:28px;color:var(--purple)">as-salamu alaykum</div>
        <div style="font-size:16px;color:var(--text-muted);font-weight:500;margin-top:8px">Peace be upon you</div>
      </div>

      <div style="font-size:15px;color:var(--text-secondary);margin-bottom:24px;font-weight:500">
        Try saying it back — out loud or typed. Arabizi counts.
      </div>

      <div style="width:100%;display:flex;align-items:center;gap:12px;padding:8px;border-radius:28px;background:var(--surface);border:1px solid var(--surface-border);backdrop-filter:blur(16px);box-shadow:0 10px 30px rgba(0,0,0,0.3)">
        <button id="h2-gate-mic" onclick="h2GateMic()" title="say it out loud" style="width:46px;height:46px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;border:none;cursor:pointer;background:linear-gradient(135deg, #a78bfa, #ec4899)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
        <input id="h2-gate-input" type="text" dir="auto" placeholder="السلام عليكم … or salam alaykum"
          style="flex:1;background:transparent;border:none;outline:none;font-size:16px;color:var(--text-primary);padding:0 4px;font-family:inherit;min-width:0"
          onkeydown="if(event.key==='Enter')h2GateSay()">
        <button onclick="h2GateSay()" style="flex-shrink:0;padding:0 20px;height:46px;border-radius:999px;font-weight:600;font-size:15px;display:flex;align-items:center;gap:8px;cursor:pointer;background:var(--gold-ghost-bg);color:var(--gold-light);border:1px solid var(--gold-border);transition:transform .15s">
          Say it <span>→</span>
        </button>
      </div>
      <div id="h2-gate-note" style="min-height:22px;margin-top:10px;font-size:13px;color:var(--green)"></div>

      <button onclick="renderHomeDashboard()" style="margin-top:38px;font-size:14px;color:var(--text-muted);background:none;border:none;cursor:pointer;opacity:0.6;font-weight:500;letter-spacing:0.02em;transition:all .2s"
        onmouseover="this.style.opacity=1;this.style.color='var(--text-primary)'" onmouseout="this.style.opacity=0.6;this.style.color='var(--text-muted)'">
        Skip intro
      </button>
    </div>
  </div>`;
}

function h2GateMic() {
  if (typeof prodMic !== 'function') return;
  prodMic('h2-gate-mic', (t) => {
    const inp = document.getElementById('h2-gate-input');
    if (inp) inp.value = (inp.value ? inp.value.trimEnd() + ' ' : '') + t;
  });
}

function h2GateSay() {
  const inp = document.getElementById('h2-gate-input');
  const v = (inp ? inp.value : '').trim();
  if (!v) { if (inp) inp.focus(); return; }
  const m = (typeof prodMatch === 'function') ? prodMatch(v, 'السلام عليكم', 'as-salamu alaykum') : { hits: [1] };
  const note = document.getElementById('h2-gate-note');
  if (note) note.textContent = m.hits.length ? '✓ يا سلام — that’s it' : 'close — listen once more, or come on in anyway';
  if (typeof recordActivity === 'function' && m.hits.length) recordActivity();
  setTimeout(renderHomeDashboard, m.hits.length ? 700 : 1100);
}

// ══════════════════════════════════════════════════════════
// Screen 2 — the home dashboard (HomePage.tsx)
// ══════════════════════════════════════════════════════════
function renderHomeDashboard2() {
  document.body.classList.add('h2-page');
  const ca = document.getElementById('content-area');
  const theme = h2Theme();
  h2Domain = null; h2Node = null;

  // ── real data ──
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];
  const focus = nextFocus(focusDomain());
  const coached = Object.keys(JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}')).length;
  const gDone = Object.keys(getGuidedProgress()).length;
  const starredN = (typeof starredDeckCount === 'function') ? starredDeckCount() : 0;
  const pct = SPEAK_QA.length ? Math.min(100, Math.round((coached / SPEAK_QA.length) * 100)) : 0;
  const R = 56, C = Math.round(R * 2 * Math.PI);
  const ringOffset = Math.round(C - (pct / 100) * C);
  const treeCount = h2TreeCount();

  const tile = (m, title, sub, colorVar, iconSVG, active) => {
    if (typeof modeHidden === 'function' && modeHidden(m)) return '';
    return `
    <button class="h2-tile ${active ? 'active' : ''}" onclick="setMode('${m}')">
      <div class="h2-sheen" style="border-radius:20px"></div>
      <div style="position:absolute;inset:0;pointer-events:none;border-radius:20px;background:radial-gradient(circle at top left, ${active ? 'var(--gold-ghost-bg)' : `color-mix(in srgb, ${colorVar} 8%, transparent)`}, transparent 70%)"></div>
      <div style="position:relative;z-index:10;display:flex;flex-direction:column;height:100%">
        <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;color:${colorVar};background-color:color-mix(in srgb, ${colorVar} 12%, transparent)">${iconSVG}</div>
        <div style="margin-top:auto">
          <div style="font-size:18px;font-weight:600;color:var(--text-primary);line-height:1.2;margin-bottom:6px;${active ? 'text-shadow:0 0 12px rgba(255,255,255,0.2)' : ''}">${title}</div>
          <div style="font-size:14px;color:var(--text-secondary)">${sub}</div>
        </div>
      </div>
    </button>`;
  };

  const ICON_FLASH = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16"/><path d="M8 6v12" opacity="0.3"/></svg>';
  const ICON_ORB = '<svg width="24" height="24" viewBox="0 0 20 20"><defs><radialGradient id="h2OrbGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stop-color="var(--teal)" stop-opacity="0.8"/><stop offset="100%" stop-color="var(--purple)" stop-opacity="0.6"/></radialGradient></defs><circle cx="10" cy="10" r="7" fill="url(#h2OrbGrad)"/><circle cx="10" cy="10" r="7" stroke="var(--teal)" stroke-width="0.5" fill="none" opacity="0.5"/></svg>';
  const ICON_EAR = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 11v2"/><path d="M8 8v8"/><path d="M12 4v16"/><path d="M16 9v6"/><path d="M20 11v2"/></svg>';
  const ICON_STAR = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" opacity="0.2"/><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>';

  ca.innerHTML = `
  <div class="h2-root tariga-theme-${theme}">
    ${h2AmbientHTML()}

    <div class="h2-wrap">
      <!-- 2.1 Top nav -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0 24px;border-bottom:1px solid var(--surface-border)">
        <div style="display:flex;align-items:baseline;gap:12px">
          <span class="font-serif-ar" style="font-size:32px;color:var(--gold);filter:drop-shadow(0 0 8px var(--gold-border))">طريقة</span>
          <span style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:var(--text-muted);font-weight:700">Tariga</span>
        </div>
        <div style="display:flex;align-items:center;gap:32px">
          <div class="h2-navlinks" style="display:flex;align-items:center;gap:24px">
            <button class="h2-navlink on">Dashboard</button>
            <button class="h2-navlink" onclick="setMode('tree')">Curriculum</button>
            <button class="h2-navlink" onclick="setMode('flash')">Library</button>
          </div>
          <button class="h2-toggle" onclick="h2ThemeToggle()" aria-label="Toggle theme">
            <span class="h2-toggle-knob" style="transform:translateX(${theme === 'dark' ? '0' : '24px'});color:${theme === 'dark' ? '#0f0d0b' : '#f7f2e8'}">
              ${theme === 'dark'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'}
            </span>
          </button>
        </div>
      </div>

      <!-- 2.2 Greeting -->
      <div style="display:flex;flex-direction:column;gap:16px;margin:40px 0 24px;align-items:flex-start">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:12px;background:var(--surface);border:1px solid var(--surface-border);backdrop-filter:blur(12px)">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--gold)"></span>
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:var(--text-muted)">Freq: ${escAttr(dm.label)} &amp; Home</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;max-width:800px">
          <h1 class="font-serif-ar h2-greet-ar" dir="rtl" style="font-size:80px;line-height:1.1;color:var(--text-primary);margin:0;font-weight:400;text-align:left;width:100%;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))">يا هلا بيك تاني</h1>
          <span class="font-serif-ar h2-greet-sub" style="font-style:italic;font-size:34px;color:var(--purple);margin-top:4px">ya hala beek tani — Welcome back</span>
        </div>
      </div>

      <!-- 2.3 Hero row -->
      <div class="h2-hero">
        <div class="h2-hero-left">
          <div class="h2-card active" style="height:100%">
            <div class="h2-sheen"></div>
            <div style="position:absolute;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 50% 0%, rgba(201,169,110,0.1), transparent 70%)"></div>
            <div style="position:relative;z-index:10;flex:1;display:flex;align-items:center;padding:32px;gap:32px">
              <div style="flex-shrink:0;width:80px;height:80px;border-radius:50%;overflow:hidden;position:relative;border:1px solid rgba(201,169,110,0.15);box-shadow:0 0 30px rgba(201,169,110,0.25)">
                <tariga-orb2 mode="idle"></tariga-orb2>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.16em;color:var(--teal);margin-bottom:12px;font-weight:700">Continue where you left off</div>
                <div style="font-size:26px;color:var(--text-primary);font-weight:600;line-height:1.3;margin-bottom:8px">${escAttr(focus.title)}</div>
                <div style="font-size:15px;color:var(--text-muted)">${escAttr(focus.sub)}</div>
              </div>
              <button onclick="homeStart()" title="Start"
                style="width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;background:var(--gold-ghost-bg);border:1px solid var(--gold-border);color:var(--gold-light);transition:transform .15s"
                onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-left:5px"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="h2-hero-right">
          <div class="h2-card" style="height:100%">
            <div class="h2-sheen"></div>
            <div style="position:relative;z-index:10;flex:1;display:flex;align-items:center;justify-content:center;gap:32px;padding:32px">
              <div style="position:relative;flex-shrink:0;width:120px;height:120px">
                <svg width="120" height="120" style="transform:rotate(-90deg);filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2))">
                  <circle cx="60" cy="60" r="${R}" stroke="var(--ring-bg)" stroke-width="8" fill="none"/>
                  <circle cx="60" cy="60" r="${R}" stroke="var(--teal)" stroke-width="8" fill="none"
                    stroke-dasharray="${C}" stroke-dashoffset="${ringOffset}" stroke-linecap="round"
                    style="--h2-ring-c:${C};filter:drop-shadow(0 0 6px var(--teal));animation:h2RingIn 1.5s ease-in-out"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <div class="font-serif-ar" style="font-size:24px;font-weight:700;color:var(--text-primary);line-height:1;margin-bottom:4px">${pct}%</div>
                  <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:var(--teal);font-weight:700">Coached</div>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:16px;flex:1">
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:14px;color:var(--text-secondary);font-weight:500">Guided practiced</span>
                  <span style="font-size:18px;font-weight:700;color:var(--green);text-shadow:var(--glow-green)">${gDone}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:14px;color:var(--text-secondary);font-weight:500">Starred to review</span>
                  <span style="font-size:18px;font-weight:700;color:var(--gold-light);text-shadow:var(--glow-gold)">${starredN}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span style="font-size:14px;color:var(--text-secondary);font-weight:500">Coached scenarios</span>
                  <span style="font-size:18px;font-weight:700;color:var(--teal);text-shadow:var(--glow-teal)">${coached}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2.4 Module tiles -->
      <div class="h2-tiles">
        ${tile('flash', 'Flashcards', deck.length + ' in deck', 'var(--teal)', ICON_FLASH, false)}
        ${tile('speak', 'Your coach', 'scenario ' + Math.min(coached + 1, SPEAK_QA.length || 1) + ' waiting →', 'var(--gold)', ICON_ORB, true)}
        ${tile('listen', 'Tune your ear', 'the real podcast', 'var(--purple)', ICON_EAR, false)}
        ${tile('journey', 'Your journey', 'Then → now', 'var(--green)', ICON_STAR, false)}
      </div>

      <!-- 2.5 Journey tree -->
      <div style="margin-top:80px;position:relative;display:flex;flex-direction:column;align-items:center;padding-bottom:48px;width:100%">
        <div style="position:absolute;top:-100px;bottom:-100px;left:50%;transform:translateX(-50%);width:100vw;max-width:1400px;overflow:hidden;pointer-events:none;border-radius:40px">
          <canvas id="h2-embers" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.6;z-index:0;mix-blend-mode:screen"></canvas>
        </div>

        <div id="h2-tree-heading" class="h2-fade" style="text-align:center;margin-bottom:40px;position:relative;z-index:10">
          <div class="font-serif-ar" style="font-style:italic;font-size:40px;color:var(--gold);margin-bottom:8px">شجرتك — The Tree</div>
          <div style="font-size:16px;color:var(--text-muted)">${treeCount} moments across 5 domains</div>
        </div>

        <div id="h2-tree-card" style="position:relative;width:100%;max-width:1000px;height:600px;margin:0 auto;border-radius:24px;overflow:hidden;background:var(--surface);border:1px solid var(--surface-border);backdrop-filter:blur(1px);box-shadow:0 25px 50px -12px rgba(0,0,0,0.5)">
          ${h2TreeInnerHTML()}
        </div>
      </div>
    </div>
  </div>`;

  const embers = document.getElementById('h2-embers');
  if (embers) h2StartParticles(embers);
  h2BindTilt();
  h2ClampLabels();
}

// the tree card's inner content — re-rendered on zoom/select
function h2TreeInnerHTML() {
  const data = h2TreeData();
  const zoom = h2Domain ? H2_BRANCH[h2Domain].zoom : { cx: 450, cy: 330, scale: 1 };
  const isZoomed = h2Domain !== null;

  const svgBranches = Object.entries(data).map(([id, d]) => {
    const def = d.def;
    const c = def.curve;
    const pathD = `M ${c[0].x} ${c[0].y} C ${c[1].x} ${c[1].y}, ${c[2].x} ${c[2].y}, ${c[3].x} ${c[3].y}`;
    let tMax = 0;
    d.moments.forEach((m, i) => { if (m.state === 'done' || m.state === 'next') tMax = d.ts[i]; });
    const isOther = h2Domain && h2Domain !== id;
    return `
      <g style="transition:opacity .5s;opacity:${isOther ? 0.2 : 1}">
        <path d="${pathD}" stroke="transparent" stroke-width="40" fill="none" ${!h2Domain ? `style="cursor:pointer" onclick="h2SelectDomain('${id}')"` : ''}></path>
        ${h2TwigsHTML(def)}
        <path d="${h2TaperedPath(c, 15, 3)}" fill="url(#h2TrunkGrad)" stroke="#1E100A" stroke-width="0.75" opacity="0.92"></path>
        ${tMax > 0 ? `<polyline points="${h2Polyline(c[0], c[1], c[2], c[3], tMax)}" stroke="${d.color}" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#h2PathGlow)"></polyline>` : ''}
        ${d.moments.map((m, i) => {
          const pt = h2Bezier(d.ts[i], c[0], c[1], c[2], c[3]);
          if (m.state === 'done') return `<g><circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="${d.color}" filter="url(#h2NodeGlow)"/><circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="${d.color}"/></g>`;
          if (m.state === 'next') return `<g><circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="${d.color}" filter="url(#h2NodeGlow)"/><circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="none" stroke="${d.color}" stroke-width="1.5"><animate attributeName="r" values="2.5;7;2.5" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/></circle></g>`;
          return `<circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="var(--bg)" stroke="var(--tree-dim)" stroke-width="1.5"/>`;
        }).join('')}
      </g>`;
  }).join('');

  const overlay = Object.entries(data).map(([id, d]) => {
    const def = d.def;
    const isSelected = h2Domain === id;
    const isOther = h2Domain && h2Domain !== id;
    return `
      <div style="position:absolute;inset:0;transition:opacity .5s;${isOther ? 'opacity:0;pointer-events:none' : 'opacity:1'}">
        <div class="h2-fade h2-domlabel" onclick="h2SelectDomain('${id}')"
          style="position:absolute;left:${def.labelPos.x}px;top:${def.labelPos.y}px;display:flex;flex-direction:column;${def.labelSide === 'left' ? 'align-items:flex-end;text-align:right' : 'align-items:flex-start;text-align:left'};transform:${def.labelSide === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)'};${h2Domain ? 'opacity:0;scale:0.9;pointer-events:none' : 'opacity:1;pointer-events:auto;cursor:pointer'}">
          <div style="font-size:16px;font-weight:600;color:${d.color}">${escAttr(d.title)}</div>
          <div style="font-size:12px;color:var(--text-muted);white-space:nowrap">${escAttr(d.meta)}</div>
        </div>
        ${d.moments.map((m, i) => {
          const pt = h2Bezier(d.ts[i], def.curve[0], def.curve[1], def.curve[2], def.curve[3]);
          const isNodeSel = h2Node === m.id && isSelected;
          const lang = h2Lang();
          const dim = m.state === 'locked';
          const line = 'max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          const labelLines = `
            ${lang.ar && m.ar ? `<div dir="rtl" style="${line}font-family:'Noto Naskh Arabic',serif;font-size:9.5px;line-height:1.5;color:${dim ? 'var(--text-muted)' : 'var(--text-primary)'}">${escAttr(m.ar)}</div>` : ''}
            ${lang.en ? `<div style="${line}font-size:7.5px;font-weight:700;letter-spacing:0.02em;line-height:1.4;color:${dim ? 'var(--text-muted)' : 'var(--text-primary)'}">${escAttr(m.title)}</div>` : ''}
            ${lang.ph && m.ph ? `<div style="${line}font-size:6.5px;font-style:italic;line-height:1.4;color:${dim ? 'var(--text-muted)' : 'var(--purple)'}">${escAttr(m.ph)}</div>` : ''}`;
          // flip the label to the inner side near the card edges so nothing clips
          const zoomSide = pt.x > 560 ? 'left' : pt.x < 260 ? 'right' : def.labelSide;
          return `
          <div style="position:absolute;left:${pt.x}px;top:${pt.y}px;transform:translate(-50%,-50%)">
            <div onclick="event.stopPropagation();${isSelected ? `h2SelectNode('${escAttr(m.id)}')` : `h2SelectDomain('${id}')`}"
              style="width:34px;height:34px;border-radius:50%;margin:-5px;pointer-events:auto;cursor:pointer"></div>
            <div class="h2-fade" style="position:absolute;top:50%;transform:translateY(-50%);${zoomSide === 'left' ? 'right:14px;text-align:right' : 'left:14px;text-align:left'};opacity:${isSelected ? 1 : 0};pointer-events:none;white-space:nowrap">
              <div style="display:inline-block;padding:2px 5px;border-radius:5px;background:color-mix(in srgb, var(--bg) 84%, transparent);border:0.5px solid var(--surface-border)">${labelLines}</div>
            </div>
            <div class="h2-fade" style="position:absolute;z-index:50;display:flex;flex-direction:column;gap:4px;padding:10px;border-radius:8px;width:150px;top:10px;left:50%;transform:translateX(-50%);transform-origin:top;background:var(--bg);border:1px solid color-mix(in srgb, ${d.color} 50%, transparent);box-shadow:0 12px 32px -4px rgba(0,0,0,0.8), 0 0 16px color-mix(in srgb, ${d.color} 19%, transparent);${isNodeSel ? 'opacity:1;pointer-events:auto' : 'opacity:0;scale:0.9;pointer-events:none'}">
              ${lang.ar && m.ar ? `<div dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:9px;color:var(--text-primary);line-height:1.5">${escAttr(m.ar)}</div>` : ''}
              ${(lang.en || !(lang.ar && m.ar)) ? `<div style="font-size:8px;font-weight:600;color:var(--text-primary);line-height:1.4">${escAttr(m.title)}</div>` : ''}
              ${lang.ph && m.ph ? `<div style="font-size:6.5px;font-style:italic;color:var(--purple);line-height:1.4">${escAttr(m.ph)}</div>` : ''}
              <div style="font-size:5.5px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-top:2px;color:${d.color}">${escAttr(m.meta)}</div>
              ${m.state === 'next' ? `<button onclick="event.stopPropagation();dmOpenItem('${m.kind}','${escAttr(m.id)}',false)" style="margin-top:6px;width:100%;padding:6px 0;border-radius:4px;font-size:5.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:var(--bg);border:none;cursor:pointer;background-color:${d.color}">Start Session</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }).join('');

  return `
    <div class="h2-tree-layer" style="transform:translate(${450 - zoom.cx}px, ${330 - zoom.cy}px) scale(${zoom.scale});transform-origin:${zoom.cx}px ${zoom.cy}px">
      <svg viewBox="0 0 900 660" style="width:100%;height:100%;position:absolute;inset:0;overflow:visible">
        <defs>
          <linearGradient id="h2TrunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#2D1A13"/><stop offset="15%" stop-color="#4A2F1D"/>
            <stop offset="50%" stop-color="#B37033"/><stop offset="85%" stop-color="#4A2F1D"/>
            <stop offset="100%" stop-color="#1E100A"/>
          </linearGradient>
          <filter id="h2NodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="h2PathGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="h2BranchShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
          </filter>
        </defs>
        <ellipse cx="450" cy="650" rx="70" ry="14" fill="var(--tree-dim)" opacity="0.6" filter="url(#h2NodeGlow)"/>
        <path d="${h2TaperedPath([{ x: 450, y: 655 }, { x: 450, y: 583 }, { x: 450, y: 517 }, { x: 450, y: 452 }], 46, 17)}"
          fill="url(#h2TrunkGrad)" stroke="#1E100A" stroke-width="1" filter="url(#h2BranchShadow)"/>
        ${svgBranches}
      </svg>
      <div style="position:absolute;inset:0;pointer-events:none">${overlay}</div>
    </div>

    <div style="position:absolute;top:20px;right:20px;z-index:50">${h2LangChipsHTML()}</div>

    <div class="h2-fade" style="position:absolute;top:24px;left:24px;z-index:50;${isZoomed ? '' : 'opacity:0;transform:translateY(-16px);pointer-events:none'}">
      <button onclick="h2TreeReset()" style="padding:10px 20px;border-radius:999px;backdrop-filter:blur(12px);color:var(--gold);font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;display:flex;align-items:center;gap:12px;cursor:pointer;background:var(--bg);border:1px solid var(--gold-border);box-shadow:0 8px 24px rgba(0,0,0,0.4)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Full Tree
      </button>
    </div>
    <div class="h2-fade" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:50;${isZoomed ? '' : 'opacity:0;pointer-events:none'}">
      <button onclick="branchOpen(h2Domain)" style="padding:11px 22px;border-radius:999px;backdrop-filter:blur(12px);color:var(--gold-light);font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;background:var(--gold-ghost-bg);border:1px solid var(--gold-border);box-shadow:0 8px 24px rgba(0,0,0,0.4)">
        Explore this branch in 3D →
      </button>
    </div>`;
}

// domain labels must never bleed past the card edge (handoff responsive
// note: "clamp its position inward by 8px")
function h2ClampLabels() {
  const card = document.getElementById('h2-tree-card');
  if (!card) return;
  const cr = card.getBoundingClientRect();
  card.querySelectorAll('.h2-domlabel').forEach(el => {
    el.style.marginLeft = '';
    const r = el.getBoundingClientRect();
    if (r.left < cr.left + 8) el.style.marginLeft = (cr.left + 8 - r.left) + 'px';
    else if (r.right > cr.right - 8) el.style.marginLeft = (cr.right - 8 - r.right) + 'px';
  });
}

function h2TreeUpdate() {
  const card = document.getElementById('h2-tree-card');
  if (card) card.innerHTML = h2TreeInnerHTML();
  h2ClampLabels();
  const heading = document.getElementById('h2-tree-heading');
  if (heading) {
    heading.style.opacity = h2Domain ? '0' : '1';
    heading.style.transform = h2Domain ? 'translateY(-16px)' : 'translateY(0)';
    heading.style.pointerEvents = h2Domain ? 'none' : 'auto';
  }
}
function h2SelectDomain(id) { h2Domain = id; h2Node = null; h2TreeUpdate(); }
function h2SelectNode(id) { h2Node = id; h2TreeUpdate(); }
function h2TreeReset() { h2Domain = null; h2Node = null; h2TreeUpdate(); }
