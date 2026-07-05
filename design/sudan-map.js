// <sudan-map> — animated word-origins map: wireframe globe intro → glowing Sudan state outlines
// Attributes: highlight="khartoum" (region id to pulse gold — where the featured word lives)
(function () {
  const TEAL = '79,216,196', GOLD = '201,169,110';

  // stylized region polygons on a 0-100 grid (illustrative, not survey-accurate)
  const REGIONS = [
    { id: 'northern', name: 'Northern', ar: 'الشمالية', words: ['حبوبة', 'دوب'], learners: 412, poly: [[8,4],[60,2],[62,18],[40,26],[20,26],[8,22]] },
    { id: 'red_sea', name: 'Red Sea · Port Sudan', ar: 'البحر الأحمر', words: ['ضابط', 'بحري'], learners: 389, poly: [[60,2],[90,14],[86,34],[70,30],[62,18]] },
    { id: 'kassala', name: 'Kassala & the East', ar: 'كسلا والشرق', words: ['شديد'], learners: 274, poly: [[62,18],[70,30],[86,34],[78,58],[60,52],[54,34]] },
    { id: 'khartoum', name: 'Khartoum & Omdurman', ar: 'الخرطوم وأم درمان', words: ['فاهماني', 'يعني', 'وبتاع'], learners: 1204, poly: [[46,30],[58,28],[60,40],[50,44]] },
    { id: 'gezira', name: 'Gezira & Sennar', ar: 'الجزيرة وسنار', words: ['تكلة'], learners: 356, poly: [[50,44],[60,40],[60,52],[78,58],[62,78],[50,64]] },
    { id: 'kordofan', name: 'Kordofan', ar: 'كردفان', words: ['كوني كونيك'], learners: 298, poly: [[28,32],[46,30],[50,44],[50,64],[34,66]] },
    { id: 'darfur', name: 'Darfur', ar: 'دارفور', words: ['زول'], learners: 341, poly: [[6,26],[20,26],[28,32],[34,66],[26,80],[6,60]] },
  ];
  const CITIES = [
    { name: 'Omdurman', x: 51, y: 35 },
    { name: 'Port Sudan', x: 82, y: 16 },
  ];

  function centroid(poly) {
    let x = 0, y = 0;
    for (const p of poly) { x += p[0]; y += p[1]; }
    return [x / poly.length, y / poly.length];
  }
  function inPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  class SudanMap extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.cssText += 'display:block;position:relative;width:100%;height:100%;';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:72%;cursor:pointer;';
      this.appendChild(c);
      const info = document.createElement('div');
      info.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:27%;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);overflow:hidden;font-family:"DM Sans",sans-serif;';
      this.appendChild(info);
      this._info = info;
      this._setInfo(null);
      this._start = performance.now();
      this._hover = null; this._selected = null;

      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        this._hover = this._hitTest((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        c.style.cursor = this._hover ? 'pointer' : 'default';
      });
      c.addEventListener('pointerleave', () => { this._hover = null; });
      c.addEventListener('click', (e) => {
        const r = c.getBoundingClientRect();
        const hit = this._hitTest((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        if (hit) { this._selected = hit; this._setInfo(hit); }
      });

      const ctx = c.getContext('2d');
      const draw = () => {
        if (this._dead) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(c.clientWidth * dpr));
        const h = Math.max(1, Math.round(c.clientHeight * dpr));
        if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
        ctx.clearRect(0, 0, w, h);
        const t = (performance.now() - this._start) / 1000;

        if (t < 2.0) this._drawGlobe(ctx, w, h, t, dpr);
        else this._drawMap(ctx, w, h, t - 2.0, dpr);

        this._raf = requestAnimationFrame(draw);
      };
      draw();
    }
    disconnectedCallback() { this._dead = true; if (this._raf) cancelAnimationFrame(this._raf); }

    _mapXY(px, py, w, h) {
      const pad = 0.08 * Math.min(w, h);
      const s = Math.min((w - pad * 2) / 100, (h - pad * 2) / 88);
      const ox = (w - 100 * s) / 2, oy = (h - 88 * s) / 2;
      return [ox + px * s, oy + (py - 2) * s];
    }
    _hitTest(nx, ny) {
      const c = this.querySelector('canvas');
      const w = c.width / (Math.min(window.devicePixelRatio || 1, 2));
      // invert using css-space coords: rebuild scale in css px
      const cw = c.clientWidth, ch = c.clientHeight;
      const pad = 0.08 * Math.min(cw, ch);
      const s = Math.min((cw - pad * 2) / 100, (ch - pad * 2) / 88);
      const ox = (cw - 100 * s) / 2, oy = (ch - 88 * s) / 2;
      const px = (nx * cw - ox) / s, py = (ny * ch - oy) / s + 2;
      for (const rg of REGIONS) if (inPoly([px, py], rg.poly)) return rg.id;
      return null;
    }

    _drawGlobe(ctx, w, h, t, dpr) {
      const cx = w / 2, cy = h / 2;
      const fadeIn = Math.min(1, t / 0.5);
      const zoom = t > 1.4 ? (t - 1.4) / 0.6 : 0; // 0..1 zoom-out phase
      const R = Math.min(w, h) * (0.3 + zoom * 0.9);
      const alpha = fadeIn * (1 - zoom);
      if (alpha <= 0) return;
      const rot = t * 0.5;
      ctx.strokeStyle = `rgba(${TEAL},${0.55 * alpha})`;
      ctx.lineWidth = 1.2 * dpr;
      ctx.shadowBlur = 12 * dpr; ctx.shadowColor = `rgba(${TEAL},${0.7 * alpha})`;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      // latitude ellipses
      for (const k of [-0.5, 0, 0.5]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + R * k * 0.8, R * Math.sqrt(1 - k * k), R * Math.sqrt(1 - k * k) * 0.24, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // longitude ellipses (rotating)
      for (let i = 0; i < 3; i++) {
        const ph = rot + (i * Math.PI) / 3;
        const rx = Math.abs(Math.cos(ph)) * R;
        ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(2, rx), R, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // Sudan marker + pulse rings
      const mx = cx + R * 0.22, my = cy - R * 0.06;
      const pulse = (t * 1.4) % 1;
      ctx.fillStyle = `rgba(${GOLD},${alpha})`;
      ctx.shadowBlur = 14 * dpr; ctx.shadowColor = `rgba(${GOLD},${alpha})`;
      ctx.beginPath(); ctx.arc(mx, my, 4 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${GOLD},${alpha * (1 - pulse)})`;
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath(); ctx.arc(mx, my, (6 + pulse * 22) * dpr, 0, Math.PI * 2); ctx.stroke();
      // label
      ctx.fillStyle = `rgba(240,237,232,${alpha * 0.9})`;
      ctx.font = `${10 * dpr}px 'DM Sans',sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('SUDAN', mx + 10 * dpr, my + 3 * dpr);
    }

    _drawMap(ctx, w, h, t, dpr) {
      const prog = Math.min(1, t / 1.1); // stroke draw-in
      const fade = Math.min(1, t / 0.6);
      const hl = this.getAttribute('highlight');
      ctx.lineJoin = 'round';
      for (const rg of REGIONS) {
        const pts = rg.poly.map(p => this._mapXY(p[0], p[1], w, h));
        // fills
        const isHover = this._hover === rg.id || this._selected === rg.id;
        const isHl = hl === rg.id;
        if (isHover || isHl) {
          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.closePath();
          if (isHl) {
            const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
            ctx.fillStyle = `rgba(${GOLD},${(0.07 + 0.07 * pulse) * fade})`;
          } else {
            ctx.fillStyle = `rgba(${TEAL},${0.09 * fade})`;
          }
          ctx.fill();
        }
        // stroke with draw-in
        let len = 0;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          len += Math.hypot(b[0] - a[0], b[1] - a[1]);
        }
        ctx.beginPath();
        pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.closePath();
        ctx.setLineDash([len * prog, len]);
        ctx.strokeStyle = isHl ? `rgba(${GOLD},${0.85 * fade})` : `rgba(${TEAL},${(isHover ? 0.95 : 0.55) * fade})`;
        ctx.lineWidth = (isHover || isHl ? 1.8 : 1.2) * dpr;
        ctx.shadowBlur = (isHover || isHl ? 14 : 8) * dpr;
        ctx.shadowColor = isHl ? `rgba(${GOLD},0.8)` : `rgba(${TEAL},0.7)`;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        // label
        if (prog > 0.8) {
          const [lx, ly] = this._mapXY(...centroid(rg.poly), w, h);
          ctx.fillStyle = `rgba(240,237,232,${0.75 * fade})`;
          ctx.font = `500 ${9 * dpr}px 'DM Sans',sans-serif`;
          ctx.textAlign = 'center';
          const short = rg.name.split(' ')[0].replace('·', '');
          ctx.fillText(short, lx, ly);
        }
      }
      // city dots
      if (prog > 0.9) {
        for (const city of CITIES) {
          const [cx2, cy2] = this._mapXY(city.x, city.y, w, h);
          const pulse = (t * 1.1 + city.x) % 1;
          ctx.fillStyle = `rgba(${GOLD},0.95)`;
          ctx.shadowBlur = 10 * dpr; ctx.shadowColor = `rgba(${GOLD},0.9)`;
          ctx.beginPath(); ctx.arc(cx2, cy2, 2.6 * dpr, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${GOLD},${0.8 * (1 - pulse)})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.arc(cx2, cy2, (4 + pulse * 14) * dpr, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = 'rgba(232,201,154,0.85)';
          ctx.font = `${8.5 * dpr}px 'DM Sans',sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText(city.name, cx2 + 7 * dpr, cy2 + 3 * dpr);
        }
      }
    }

    _setInfo(id) {
      const rg = REGIONS.find(r => r.id === id);
      if (!rg) {
        this._info.innerHTML = `<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#4fd8c4;margin-bottom:6px;">Word origins</div>
          <div style="font-size:12.5px;color:#a09e9a;line-height:1.6;">Tap a region to see the phrases that live there. The gold region is where this week's featured word is most heard.</div>`;
        return;
      }
      const chips = rg.words.map(wd =>
        `<span dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:13px;padding:3px 11px;border-radius:100px;background:rgba(${TEAL},0.08);border:1px solid rgba(${TEAL},0.3);color:#8ee6d6;">${wd}</span>`).join(' ');
      this._info.innerHTML = `
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;">
          <span style="font-size:13.5px;font-weight:600;color:#f0ede8;">${rg.name}</span>
          <span dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:14px;color:#e8c99a;">${rg.ar}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;">${chips}</div>
        <div style="font-size:10.5px;color:#7a756e;margin-top:8px;font-variant-numeric:tabular-nums;">${rg.learners.toLocaleString()} learners practicing phrases tagged here</div>`;
    }
  }
  if (!customElements.get('sudan-map')) customElements.define('sudan-map', SudanMap);
})();
