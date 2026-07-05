// <tariga-globe> — glowing wireframe/particle globe, canvas 2D, slow rotation
(function () {
  class TarigaGlobe extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.width = '100%';
      this.style.height = '100%';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      this.appendChild(c);
      const ctx = c.getContext('2d');

      // fibonacci sphere points
      const N = 420;
      const pts = [];
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = ga * i;
        pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, bright: Math.random() < 0.06 });
      }
      // a few connection arcs between bright nodes
      const bright = pts.filter(p => p.bright);
      const arcs = [];
      for (let i = 0; i < 6 && bright.length > 1; i++) {
        const a = bright[Math.floor(Math.random() * bright.length)];
        const b = bright[Math.floor(Math.random() * bright.length)];
        if (a !== b) arcs.push({ a, b, phase: Math.random() * Math.PI * 2 });
      }

      const tilt = 0.42;
      const draw = () => {
        if (this._dead) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(this.clientWidth * dpr));
        const h = Math.max(1, Math.round(this.clientHeight * dpr));
        if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
        ctx.clearRect(0, 0, w, h);
        const t = performance.now() / 1000;
        const rot = t * 0.12;
        const R = Math.min(w, h) * 0.42;
        const cx = w / 2, cy = h / 2;

        const proj = (p) => {
          // rotate around Y then tilt around X
          const x1 = p.x * Math.cos(rot) + p.z * Math.sin(rot);
          const z1 = -p.x * Math.sin(rot) + p.z * Math.cos(rot);
          const y1 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt);
          const z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
          return { sx: cx + x1 * R, sy: cy + y1 * R, z: z2 };
        };

        for (const p of pts) {
          const q = proj(p);
          const front = q.z > -0.15;
          const a = front ? 0.16 + 0.5 * Math.max(0, q.z) : 0.05;
          const size = (p.bright ? 2.1 : 1.15) * dpr * (0.7 + 0.5 * Math.max(0, q.z));
          if (p.bright && front) {
            const pulse = 0.6 + 0.4 * Math.sin(t * 2 + p.x * 9);
            ctx.shadowBlur = 9 * dpr * pulse;
            ctx.shadowColor = 'rgba(79,216,196,0.9)';
            ctx.fillStyle = `rgba(140,240,222,${(0.55 + 0.4 * pulse) * Math.max(0.2, q.z)})`;
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(79,216,196,${a})`;
          }
          ctx.beginPath();
          ctx.arc(q.sx, q.sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // arcs (great-circle-ish via mid-point lift)
        for (const arc of arcs) {
          const A = proj(arc.a), B = proj(arc.b);
          if (A.z < 0 && B.z < 0) continue;
          const mx3 = { x: (arc.a.x + arc.b.x) / 2, y: (arc.a.y + arc.b.y) / 2, z: (arc.a.z + arc.b.z) / 2 };
          const len = Math.hypot(mx3.x, mx3.y, mx3.z) || 1;
          const lift = 1.25;
          const M = proj({ x: mx3.x / len * lift, y: mx3.y / len * lift, z: mx3.z / len * lift });
          const flow = (Math.sin(t * 1.2 + arc.phase) + 1) / 2;
          ctx.strokeStyle = `rgba(79,216,196,${0.10 + 0.18 * flow})`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(A.sx, A.sy);
          ctx.quadraticCurveTo(M.sx, M.sy, B.sx, B.sy);
          ctx.stroke();
        }

        // faint limb (outer circle)
        ctx.strokeStyle = 'rgba(79,216,196,0.10)';
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        this._raf = requestAnimationFrame(draw);
      };
      draw();
    }
    disconnectedCallback() { this._dead = true; if (this._raf) cancelAnimationFrame(this._raf); }
  }
  if (!customElements.get('tariga-globe')) customElements.define('tariga-globe', TarigaGlobe);
})();
