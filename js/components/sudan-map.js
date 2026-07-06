// <sudan-map> — dotted-particle Earth globe → real Sudan map: accurate borders, state-group
// lines, the Nile system, Red Sea, scan sweep + HUD frame. Attributes: highlight="khartoum"
(function () {
  const TEAL = '79,216,196', GOLD = '201,169,110', ICE = '170,220,235', BLUE = '110,190,235';

  // ── coarse continent polygons (lon,lat) for the dotted globe land mask ──
  const LAND = [
    [[-17,15],[-10,25],[-6,35],[10,37],[20,33],[32,31],[34,27],[35,22],[43,12],[51,12],[45,2],[40,-5],[35,-20],[27,-33],[20,-35],[15,-28],[12,-18],[13,-5],[8,4],[-8,5],[-13,9],[-17,15]],
    [[-10,36],[-8,44],[-2,48],[-5,58],[5,62],[10,71],[25,71],[40,68],[60,70],[90,73],[110,73],[130,71],[140,68],[160,66],[179,66],[179,62],[160,60],[155,53],[140,45],[128,38],[122,30],[108,20],[105,10],[98,8],[92,22],[86,20],[80,8],[77,8],[70,22],[66,25],[57,25],[48,30],[35,28],[35,36],[27,36],[22,38],[10,38],[0,36],[-10,36]],
    [[-168,66],[-140,70],[-125,72],[-95,72],[-80,70],[-70,62],[-55,52],[-65,45],[-75,40],[-76,35],[-81,30],[-81,25],[-90,29],[-97,26],[-97,20],[-105,20],[-110,23],[-115,30],[-124,40],[-125,49],[-132,55],[-152,60],[-168,60],[-168,66]],
    [[-78,7],[-60,5],[-52,0],[-35,-8],[-40,-22],[-48,-28],[-58,-34],[-65,-40],[-68,-52],[-72,-52],[-72,-40],[-70,-20],[-77,-10],[-80,0],[-78,7]],
    [[114,-22],[122,-14],[132,-12],[142,-11],[146,-15],[153,-25],[150,-35],[140,-38],[130,-32],[115,-34],[114,-22]],
    [[-45,60],[-25,70],[-20,80],[-55,80],[-52,70],[-45,60]],
  ];

  // ── Sudan national outline (lon,lat) — detailed, post-2011 ──
  const SUDAN = [
    [24.98,22.0],[31.4,22.0],[33.9,22.0],[36.9,22.0],                       // Egypt (22°N)
    [37.1,21.4],[37.25,20.7],[37.15,19.9],[37.3,19.3],[37.9,18.7],[38.3,18.3],[38.6,18.02], // Red Sea coast
    [37.0,17.1],[36.9,16.4],[36.55,15.1],[36.0,14.3],[35.6,12.6],[34.7,11.8],[34.35,11.5],[34.1,11.3], // Eritrea/Ethiopia
    [33.9,10.8],[33.1,9.8],[32.4,10.7],[31.7,10.2],[30.8,9.9],[29.9,10.3],[28.8,9.4],[28.0,9.3],[27.2,9.6],[26.4,9.9], // South Sudan
    [25.8,10.4],[24.8,10.0],[24.3,10.7],[23.5,10.9],                        // CAR
    [22.9,11.4],[22.5,12.2],[22.0,12.7],[22.4,13.3],[22.1,13.8],[22.5,14.2],[22.0,14.7],[21.85,15.6], // Chad (wiggly)
    [23.98,19.5],[23.98,20.0],[24.98,20.0],                                  // Chad diagonal → Libya staircase
  ];

  // ── the Nile system ──
  const RIVERS = [
    { name: 'Nile', w: 1.5, pts: [[32.53,15.61],[33.0,16.2],[33.45,16.7],[33.98,17.7],[34.35,18.05],[34.1,18.6],[33.55,19.3],[33.1,19.6],[32.3,19.1],[31.8,18.45],[31.0,18.6],[30.48,19.17],[30.4,19.7],[30.55,20.4],[30.8,21.0],[31.1,21.5],[31.35,22.0]] },
    { name: 'Blue Nile', w: 1.2, pts: [[32.55,15.55],[33.1,15.0],[33.5,14.4],[33.62,13.55],[33.9,12.8],[34.35,11.8],[34.7,11.4]] },
    { name: 'White Nile', w: 1.2, pts: [[32.5,15.5],[32.45,14.9],[32.4,14.2],[32.66,13.16],[32.75,12.2],[32.8,11.0],[32.7,9.9]] },
    { name: 'Atbarah', w: 0.9, pts: [[33.98,17.7],[34.8,16.9],[35.4,16.2],[35.9,15.5],[36.3,14.9]] },
  ];

  // Red Sea water polygon (beyond the coast)
  const SEA = [[36.9,22.0],[39.6,22.6],[39.6,17.2],[38.6,18.02],[38.3,18.3],[37.9,18.7],[37.3,19.3],[37.15,19.9],[37.25,20.7],[37.1,21.4]];

  // ── region groups following real state lines ──
  // each region gets its own tint so the states read as distinct shapes
  const REGIONS = [
    { id:'northern', name:'Northern & River Nile', short:'Northern', ar:'الشمالية ونهر النيل', words:['حبوبة','دوب'], learners:412, col:'214,196,150',
      poly:[[24.98,22.0],[31.4,22.0],[33.9,22.0],[34.0,21.0],[34.6,20.2],[35.5,19.2],[36.3,18.3],[35.9,17.4],[35.9,16.1],[34.3,16.0],[33.5,16.4],[31.9,16.6],[30.0,16.2],[27.6,16.4],[27.4,19.8],[24.98,20.0]] },
    { id:'red_sea', name:'Red Sea · Port Sudan', short:'Red Sea', ar:'البحر الأحمر', words:['ضابط','بحري'], learners:389, col:'110,190,235',
      poly:[[33.9,22.0],[36.9,22.0],[37.1,21.4],[37.25,20.7],[37.15,19.9],[37.3,19.3],[37.9,18.7],[38.3,18.3],[38.6,18.02],[37.0,17.1],[36.3,18.3],[35.5,19.2],[34.6,20.2],[34.0,21.0]] },
    { id:'kassala', name:'Kassala & Al Qadarif', short:'Kassala', ar:'كسلا والقضارف', words:['شديد'], learners:274, col:'235,150,120',
      poly:[[36.3,18.3],[37.0,17.1],[36.9,16.4],[36.55,15.1],[36.0,14.3],[35.6,12.6],[34.4,13.2],[34.0,14.2],[33.9,15.3],[34.3,16.0],[35.9,16.1],[35.9,17.4]] },
    { id:'khartoum', name:'Khartoum & Omdurman', short:'', ar:'الخرطوم وأم درمان', words:['فاهماني','يعني','وبتاع'], learners:1204, col:'232,201,154',
      poly:[[31.9,16.6],[33.5,16.4],[34.3,16.0],[33.9,15.3],[33.0,14.9],[32.0,15.2],[31.7,15.9]] },
    { id:'gezira', name:'Gezira · Sennar · Blue Nile', short:'Gezira', ar:'الجزيرة وسنار والنيل الأزرق', words:['تكلة'], learners:356, col:'86,201,143',
      poly:[[32.0,15.2],[33.0,14.9],[33.9,15.3],[34.0,14.2],[34.4,13.2],[35.6,12.6],[34.7,11.8],[34.35,11.5],[34.1,11.3],[33.9,10.8],[33.1,9.8],[32.4,10.7],[31.7,10.2],[31.9,12.4],[31.8,15.2]] },
    { id:'kordofan', name:'Kordofan', short:'Kordofan', ar:'كردفان', words:['كوني كونيك'], learners:298, col:'167,139,250',
      poly:[[27.6,16.4],[30.0,16.2],[31.9,16.6],[31.7,15.9],[31.8,15.2],[31.9,12.4],[31.7,10.2],[30.8,9.9],[29.9,10.3],[28.8,9.4],[28.0,9.3],[27.2,9.6],[27.6,12.0],[27.3,14.0]] },
    { id:'darfur', name:'Darfur', short:'Darfur', ar:'دارفور', words:['زول'], learners:341, col:'79,216,196',
      poly:[[24.98,20.0],[27.4,19.8],[27.6,16.4],[27.3,14.0],[27.6,12.0],[27.2,9.6],[26.4,9.9],[25.8,10.4],[24.8,10.0],[24.3,10.7],[23.5,10.9],[22.9,11.4],[22.5,12.2],[22.0,12.7],[22.4,13.3],[22.1,13.8],[22.5,14.2],[22.0,14.7],[21.85,15.6],[23.98,19.5],[23.98,20.0]] },
  ];
  const CITIES = [
    { name:'Khartoum', lon:32.53, lat:15.6, big:true, side:'right' },
    { name:'Port Sudan', lon:37.22, lat:19.62, side:'left' },
    { name:'Dongola', lon:30.48, lat:19.17, side:'below' },
    { name:'Nyala', lon:24.88, lat:12.05, side:'right' },
  ];
  const LABELS = { northern:[28.2,20.6], red_sea:[35.55,21.1], kassala:[35.6,13.6], khartoum:null, gezira:[33.3,12.1], kordofan:[29.2,12.6], darfur:[24.3,14.2] };
  const NEIGHBORS = [
    { t:'EGYPT', lon:28.5, lat:22.6 }, { t:'LIBYA', lon:22.6, lat:21.3 },
    { t:'CHAD', lon:21.9, lat:17.6 }, { t:'SOUTH SUDAN', lon:29.5, lat:8.85 },
    { t:'ETHIOPIA', lon:37.6, lat:12.2 }, { t:'ERITREA', lon:38.6, lat:15.8 },
  ];

  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  const onLand = (lon, lat) => LAND.some(p => inPoly(lon, lat, p));

  // globe particle field
  const GPTS = [];
  (function () {
    const N = 5200, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = ga * i;
      const lat = Math.asin(y) * 180 / Math.PI;
      const lon = Math.atan2(Math.sin(th) * r, Math.cos(th) * r) * 180 / Math.PI;
      const land = onLand(lon, lat);
      if (land || i % 11 === 0) GPTS.push({ lat: lat * Math.PI / 180, lon: lon * Math.PI / 180, land, tw: Math.random() * Math.PI * 2 });
    }
  })();

  // map dot-matrix per region (rebuilt against the real outline once geo data loads)
  const DOTS = {};
  function buildDots(clipRing) {
    const step = 0.36;
    for (const rg of REGIONS) {
      const d = [];
      let minLon = 99, maxLon = -99, minLat = 99, maxLat = -99;
      for (const p of rg.poly) { minLon = Math.min(minLon, p[0]); maxLon = Math.max(maxLon, p[0]); minLat = Math.min(minLat, p[1]); maxLat = Math.max(maxLat, p[1]); }
      let row = 0;
      for (let lat = minLat + step / 2; lat < maxLat; lat += step, row++) {
        for (let lon = minLon + (row % 2 ? step / 2 : 0); lon < maxLon; lon += step) {
          if (inPoly(lon, lat, rg.poly) && (!clipRing || inPoly(lon, lat, clipRing))) d.push([lon, lat, Math.random()]);
        }
      }
      DOTS[rg.id] = d;
    }
  }
  buildDots(null);

  // real geography: outline + globe land points from geo-data.json (fallback = hand-drawn)
  let OUTLINE = SUDAN;
  try {
    fetch('geo-data.json').then(r => r.json()).then(d => {
      if (d && d.outline && d.outline.length > 10) { OUTLINE = d.outline; buildDots(OUTLINE); }
      if (d && d.landPts && d.landPts.length > 100) {
        GPTS.length = 0;
        for (const [lat, lon] of d.landPts) GPTS.push({ lat: lat * Math.PI / 180, lon: lon * Math.PI / 180, land: true, tw: Math.random() * Math.PI * 2 });
        const M = 800, ga2 = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < M; i++) {
          const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga2 * i;
          GPTS.push({ lat: Math.asin(y), lon: Math.atan2(Math.sin(th) * r, Math.cos(th) * r), land: false, tw: 0 });
        }
      }
    }).catch(() => {});
  } catch (e) {}

  const LON0 = 20.8, LON1 = 39.8, LAT0 = 8.2, LAT1 = 23.2;

  class SudanMap extends HTMLElement {
    connectedCallback() {
      if (this._init) { this._dead = false; if (this._raf) cancelAnimationFrame(this._raf); if (this._drawLoop) this._drawLoop(); return; }
      this._init = true;
      this.style.cssText += 'display:block;position:relative;width:100%;height:100%;';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:72%;';
      this.appendChild(c);
      const info = document.createElement('div');
      info.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:26%;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);overflow:hidden;font-family:"DM Sans",sans-serif;';
      this.appendChild(info);
      const replay = document.createElement('button');
      replay.textContent = '↻';
      replay.title = 'replay globe';
      replay.style.cssText = 'position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#a09e9a;font-size:14px;cursor:pointer;z-index:2;';
      replay.addEventListener('click', () => { this._start = performance.now(); this._selected = null; this._setInfo(null); });
      this.appendChild(replay);
      this._info = info;
      this._setInfo(null);
      this._start = performance.now();
      this._hover = null; this._selected = null;
      this._stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + 0.3, tw: Math.random() * Math.PI * 2 }));

      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        this._px = (e.clientX - r.left) / r.width - 0.5;
        this._py = (e.clientY - r.top) / r.height - 0.5;
        this._hover = this._hitTest(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        c.style.cursor = this._hover ? 'pointer' : 'default';
      });
      c.addEventListener('pointerleave', () => { this._hover = null; this._px = 0; this._py = 0; });
      c.addEventListener('click', (e) => {
        const r = c.getBoundingClientRect();
        const hit = this._hitTest(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        if (hit) { this._selected = hit; this._setInfo(hit); }
      });

      const ctx = c.getContext('2d');
      const GLOBE_END = 3.1, ZOOM = 0.9;
      const draw = () => {
        if (this._dead) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(c.clientWidth * dpr));
        const h = Math.max(1, Math.round(c.clientHeight * dpr));
        if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
        ctx.clearRect(0, 0, w, h);
        const t = (performance.now() - this._start) / 1000;
        this._drawSpace(ctx, w, h, t, dpr);
        if (t < GLOBE_END + ZOOM) {
          const zoom = t < GLOBE_END ? 0 : (t - GLOBE_END) / ZOOM;
          this._drawGlobe(ctx, w, h, t, dpr, zoom);
          if (zoom > 0) this._drawMap(ctx, w, h, (t - GLOBE_END) * 1.2, dpr, zoom);
        } else {
          this._drawMap(ctx, w, h, t - GLOBE_END, dpr, 1);
        }
        this._drawFrame(ctx, w, h, t, dpr);
        this._raf = requestAnimationFrame(draw);
      };
      this._drawLoop = draw;
      draw();
    }
    disconnectedCallback() { this._dead = true; if (this._raf) cancelAnimationFrame(this._raf); }

    _drawSpace(ctx, w, h, t, dpr) {
      const g = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, Math.max(w, h) * 0.62);
      g.addColorStop(0, 'rgba(28,58,66,0.32)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (const s of this._stars) {
        const a = 0.22 + 0.28 * Math.abs(Math.sin(t * 0.8 + s.tw));
        ctx.fillStyle = `rgba(${ICE},${a})`;
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * dpr, 0, Math.PI * 2); ctx.fill();
      }
    }

    // HUD frame: corner brackets + tick marks
    _drawFrame(ctx, w, h, t, dpr) {
      const m = 8 * dpr, L = 16 * dpr;
      ctx.strokeStyle = `rgba(${TEAL},0.35)`;
      ctx.lineWidth = 1.2 * dpr;
      const corners = [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]];
      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath(); ctx.moveTo(x + L * sx, y); ctx.lineTo(x, y); ctx.lineTo(x, y + L * sy); ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${TEAL},0.14)`;
      ctx.lineWidth = 1 * dpr;
      for (let i = 1; i < 12; i++) {
        const x = (w / 12) * i;
        ctx.beginPath(); ctx.moveTo(x, m); ctx.lineTo(x, m + 3 * dpr); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, h - m); ctx.lineTo(x, h - m - 3 * dpr); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${TEAL},0.4)`;
      ctx.font = `${7.5 * dpr}px 'DM Sans',sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('LAT 15.6°N · LON 32.5°E', m + 4 * dpr, h - m - 6 * dpr);
    }

    _mapXY(lon, lat, w, h) {
      const pad = 0.055 * Math.min(w, h);
      const s = Math.min((w - pad * 2) / (LON1 - LON0), (h - pad * 2) / (LAT1 - LAT0));
      const ox = (w - (LON1 - LON0) * s) / 2, oy = (h - (LAT1 - LAT0) * s) / 2;
      return [ox + (lon - LON0) * s, oy + (LAT1 - lat) * s];
    }
    _hitTest(px, py, cw, ch) {
      if ((performance.now() - this._start) / 1000 < 3.1) return null;
      const pad = 0.055 * Math.min(cw, ch);
      const s = Math.min((cw - pad * 2) / (LON1 - LON0), (ch - pad * 2) / (LAT1 - LAT0));
      const ox = (cw - (LON1 - LON0) * s) / 2, oy = (ch - (LAT1 - LAT0) * s) / 2;
      const lon = (px - ox) / s + LON0, lat = LAT1 - (py - oy) / s;
      if (!inPoly(lon, lat, OUTLINE)) return null;
      for (const rg of REGIONS) if (inPoly(lon, lat, rg.poly)) return rg.id;
      return null;
    }

    _drawGlobe(ctx, w, h, t, dpr, zoom) {
      const fadeIn = Math.min(1, t / 0.6);
      const alpha = fadeIn * (1 - zoom);
      if (alpha <= 0.01) return;
      const cx = w / 2, cy = h * 0.46;
      const R0 = Math.min(w, h) * 0.36;
      const R = R0 * (1 + zoom * zoom * 3.2);
      const tilt = 0.35;
      const rot = 1.047 - 0.22 + t * 0.10;

      ctx.strokeStyle = `rgba(${ICE},${0.28 * alpha})`;
      ctx.lineWidth = 1.1 * dpr;
      ctx.shadowBlur = 18 * dpr; ctx.shadowColor = `rgba(${TEAL},${0.55 * alpha})`;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
      const og = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.02);
      og.addColorStop(0, 'rgba(10,25,30,0)');
      og.addColorStop(0.9, `rgba(20,60,70,${0.30 * alpha})`);
      og.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = og;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = `rgba(${ICE},${0.10 * alpha})`;
      ctx.lineWidth = 0.8 * dpr;
      for (const k of [-0.4, 0.15, 0.6]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + R * k * Math.cos(tilt), R * Math.sqrt(1 - k * k), Math.max(1, R * Math.sqrt(1 - k * k) * Math.sin(tilt)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const proj = (lat, lon) => {
        const px = Math.cos(lat) * Math.cos(lon + rot);
        const pz = Math.cos(lat) * Math.sin(lon + rot);
        const py = Math.sin(lat);
        return { sx: cx + px * R, sy: cy - py * Math.cos(tilt) * R * 0.98, depth: pz };
      };
      for (const p of GPTS) {
        const q = proj(p.lat, p.lon);
        if (q.depth < -0.12) continue;
        const front = Math.max(0, q.depth);
        if (p.land) {
          const tw = 0.75 + 0.25 * Math.sin(t * 1.6 + p.tw);
          ctx.fillStyle = `rgba(${ICE},${(0.10 + 0.55 * front) * alpha * tw})`;
          ctx.beginPath(); ctx.arc(q.sx, q.sy, (0.8 + front * 0.8) * dpr, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${TEAL},${0.05 * alpha * (0.3 + front)})`;
          ctx.beginPath(); ctx.arc(q.sx, q.sy, 0.6 * dpr, 0, Math.PI * 2); ctx.fill();
        }
      }

      const mk = proj(15 * Math.PI / 180, 30 * Math.PI / 180);
      if (mk.depth > 0) {
        const pulse = (t * 1.2) % 1;
        ctx.fillStyle = `rgba(${GOLD},${alpha})`;
        ctx.shadowBlur = 16 * dpr; ctx.shadowColor = `rgba(${GOLD},${alpha})`;
        ctx.beginPath(); ctx.arc(mk.sx, mk.sy, 3.5 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${GOLD},${alpha * (1 - pulse)})`;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath(); ctx.arc(mk.sx, mk.sy, (6 + pulse * 24) * dpr, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = `rgba(${GOLD},${0.5 * alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath(); ctx.moveTo(mk.sx + 5 * dpr, mk.sy - 5 * dpr); ctx.lineTo(mk.sx + 26 * dpr, mk.sy - 26 * dpr); ctx.lineTo(mk.sx + 78 * dpr, mk.sy - 26 * dpr); ctx.stroke();
        ctx.fillStyle = `rgba(240,237,232,${alpha})`;
        ctx.font = `600 ${10.5 * dpr}px 'DM Sans',sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('SUDAN', mk.sx + 32 * dpr, mk.sy - 31 * dpr);
      }
    }

    _path(ctx, pts, w, h, close) {
      ctx.beginPath();
      pts.forEach((p, i) => {
        const [x, y] = this._mapXY(p[0], p[1], w, h);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      if (close) ctx.closePath();
    }

    // rounded label pill with dark backdrop for readability
    _pill(ctx, text, x, y, dpr, fg, a, size, weight) {
      ctx.font = `${weight || 600} ${size * dpr}px 'DM Sans',sans-serif`;
      const tw = ctx.measureText(text).width;
      const padX = 6 * dpr, ph = (size + 8) * dpr, r = ph / 2;
      const bx = x - tw / 2 - padX, by = y - ph / 2;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.arcTo(bx + tw + padX * 2, by, bx + tw + padX * 2, by + ph, r);
      ctx.arcTo(bx + tw + padX * 2, by + ph, bx, by + ph, r);
      ctx.arcTo(bx, by + ph, bx, by, r);
      ctx.arcTo(bx, by, bx + tw + padX * 2, by, r);
      ctx.closePath();
      ctx.fillStyle = `rgba(12,14,14,${0.72 * a})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${fg},${0.35 * a})`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();
      ctx.fillStyle = `rgba(${fg},${a})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y + 0.5 * dpr);
      ctx.textBaseline = 'alphabetic';
    }

    _drawMap(ctx, w, h, t, dpr, reveal) {
      const prog = Math.min(1, Math.max(0, t / 1.2));
      const fade = Math.min(1, Math.max(0, t / 0.7)) * reveal;
      if (fade <= 0) return;
      const hl = this.getAttribute('highlight');

      // ── 3D scene motion: gentle float + pointer parallax ──
      const px = this._px || 0, py = this._py || 0;
      const bobY = Math.sin(t * 0.7) * 3 * dpr;
      const parX = -px * 7 * dpr, parY = -py * 5 * dpr;
      ctx.save();
      ctx.translate(parX * 0.35, bobY * 0.5 + parY * 0.35); // background layer moves less

      // Red Sea water
      const seaPts = SEA.map(p => this._mapXY(p[0], p[1], w, h));
      const sg = ctx.createLinearGradient(seaPts[0][0], seaPts[0][1], seaPts[2][0], seaPts[2][1]);
      sg.addColorStop(0, `rgba(${BLUE},${0.10 * fade})`);
      sg.addColorStop(1, `rgba(${BLUE},${0.02 * fade})`);
      this._path(ctx, SEA, w, h, true);
      ctx.fillStyle = sg;
      ctx.fill();

      // neighbor labels — soft but readable
      ctx.font = `500 ${8.5 * dpr}px 'DM Sans',sans-serif`;
      ctx.textAlign = 'center';
      for (const nb of NEIGHBORS) {
        const [nx, ny] = this._mapXY(nb.lon, nb.lat, w, h);
        ctx.fillStyle = `rgba(150,150,146,${0.5 * fade})`;
        ctx.fillText(nb.t, nx, ny);
      }
      ctx.restore();

      // ── main map layer ──
      ctx.save();
      ctx.translate(parX, bobY + parY);

      // extruded slab beneath the country — 3D depth
      const depth = 7;
      for (let i = depth; i >= 1; i--) {
        ctx.save();
        ctx.translate(i * 1.1 * dpr, i * 1.7 * dpr);
        this._path(ctx, OUTLINE, w, h, true);
        const sh = 0.5 - i / (depth * 2.6);
        ctx.fillStyle = `rgba(14,40,42,${sh * fade})`;
        ctx.fill();
        ctx.restore();
      }
      // soft drop shadow further below
      ctx.save();
      ctx.translate(10 * dpr, 18 * dpr);
      this._path(ctx, OUTLINE, w, h, true);
      ctx.fillStyle = `rgba(0,0,0,${0.35 * fade})`;
      ctx.filter = `blur(${8 * dpr}px)`;
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();

      // country surface fill — subtle gradient so it reads as a solid plate
      this._path(ctx, OUTLINE, w, h, true);
      const [gx, gy] = this._mapXY(30, 17.5, w, h);
      const ig = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(w, h) * 0.62);
      ig.addColorStop(0, `rgba(32,64,66,${0.55 * fade})`);
      ig.addColorStop(0.7, `rgba(22,44,46,${0.45 * fade})`);
      ig.addColorStop(1, `rgba(16,32,34,${0.4 * fade})`);
      ctx.fillStyle = ig;
      ctx.fill();

      // each state gets its own tinted surface + colored dot-matrix so the
      // regions read as distinct shapes at a glance
      ctx.save();
      this._path(ctx, OUTLINE, w, h, true);
      ctx.clip();
      for (const rg of REGIONS) {
        const isHover = this._hover === rg.id || this._selected === rg.id;
        const isHl = hl === rg.id;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.0);
        this._path(ctx, rg.poly, w, h, true);
        const fillA = isHover ? 0.26 : isHl ? (0.14 + 0.05 * pulse) : 0.09;
        ctx.fillStyle = `rgba(${rg.col},${fillA * fade})`;
        ctx.fill();
      }
      for (const rg of REGIONS) {
        const dots = DOTS[rg.id];
        const isHover = this._hover === rg.id || this._selected === rg.id;
        const isHl = hl === rg.id;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.0);
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          if (d[2] > prog * 1.15) continue;
          const [x, y] = this._mapXY(d[0], d[1], w, h);
          let a, rad = 0.85;
          if (isHl) { a = (0.35 + 0.25 * pulse) * fade; rad = 1.1; }
          else if (isHover) { a = 0.55 * fade; rad = 1.05; }
          else { a = (0.14 + d[2] * 0.12) * fade; }
          ctx.fillStyle = `rgba(${rg.col},${a})`;
          ctx.beginPath(); ctx.arc(x, y, rad * dpr, 0, Math.PI * 2); ctx.fill();
        }
      }
      // internal state borders — bright enough to actually separate states
      ctx.lineJoin = 'round';
      for (const rg of REGIONS) {
        const isHover = this._hover === rg.id || this._selected === rg.id;
        const isHl = hl === rg.id;
        this._path(ctx, rg.poly, w, h, true);
        ctx.strokeStyle = (isHover || isHl) ? `rgba(${rg.col},${0.9 * fade})` : `rgba(235,230,220,${0.28 * fade})`;
        ctx.lineWidth = (isHover || isHl ? 1.8 : 1.0) * dpr;
        if (isHover || isHl) { ctx.shadowBlur = 12 * dpr; ctx.shadowColor = `rgba(${rg.col},0.8)`; }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // national outline draw-in
      const opts = OUTLINE.map(p => this._mapXY(p[0], p[1], w, h));
      let len = 0;
      for (let i = 0; i < opts.length; i++) {
        const a = opts[i], b = opts[(i + 1) % opts.length];
        len += Math.hypot(b[0] - a[0], b[1] - a[1]);
      }
      this._path(ctx, OUTLINE, w, h, true);
      ctx.setLineDash([len * prog, len]);
      ctx.strokeStyle = `rgba(${TEAL},${0.95 * fade})`;
      ctx.lineWidth = 1.8 * dpr;
      ctx.shadowBlur = 16 * dpr; ctx.shadowColor = `rgba(${TEAL},0.85)`;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // the Nile system — solid glow + traveling light pulses
      if (prog > 0.5) {
        const ra = Math.min(1, (prog - 0.5) / 0.4) * fade;
        for (const rv of RIVERS) {
          const pts = rv.pts.map(p => this._mapXY(p[0], p[1], w, h));
          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.strokeStyle = `rgba(${BLUE},${0.30 * ra})`;
          ctx.lineWidth = rv.w * dpr;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 6 * dpr; ctx.shadowColor = `rgba(${BLUE},0.6)`;
          ctx.stroke();
          ctx.shadowBlur = 0;
          // traveling pulse
          let total = 0;
          const segs = [];
          for (let i = 1; i < pts.length; i++) {
            const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
            segs.push(L); total += L;
          }
          let dist = ((t * 0.13 + rv.w) % 1) * total;
          for (let i = 1; i < pts.length; i++) {
            if (dist <= segs[i - 1]) {
              const k = dist / segs[i - 1];
              const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k;
              const y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k;
              ctx.fillStyle = `rgba(200,235,255,${0.9 * ra})`;
              ctx.shadowBlur = 10 * dpr; ctx.shadowColor = `rgba(${BLUE},0.95)`;
              ctx.beginPath(); ctx.arc(x, y, 1.7 * dpr, 0, Math.PI * 2); ctx.fill();
              ctx.shadowBlur = 0;
              break;
            }
            dist -= segs[i - 1];
          }
        }
      }
      ctx.restore();

      // ── label layer: moves slightly more (closest to viewer) ──
      ctx.save();
      ctx.translate(parX * 1.25, bobY + parY * 1.25);
      if (prog > 0.75) {
        const la = Math.min(1, (prog - 0.75) / 0.25) * fade;
        for (const rg of REGIONS) {
          const pos = LABELS[rg.id];
          if (!pos || !rg.short) continue;
          const [lx, ly] = this._mapXY(pos[0], pos[1], w, h);
          const isHl = hl === rg.id;
          this._pill(ctx, rg.short.toUpperCase(), lx, ly, dpr, rg.col, (isHl ? 0.95 : 0.85) * la, 8.5, 600);
        }
        for (const city of CITIES) {
          const [cx2, cy2] = this._mapXY(city.lon, city.lat, w, h);
          const pulse = (t * 1.1 + city.lon) % 1;
          ctx.fillStyle = `rgba(${GOLD},${0.95 * la})`;
          ctx.shadowBlur = 10 * dpr; ctx.shadowColor = `rgba(${GOLD},0.9)`;
          ctx.beginPath(); ctx.arc(cx2, cy2, (city.big ? 2.8 : 2.1) * dpr, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          if (city.big) {
            ctx.strokeStyle = `rgba(${GOLD},${0.8 * (1 - pulse) * la})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath(); ctx.arc(cx2, cy2, (4 + pulse * 13) * dpr, 0, Math.PI * 2); ctx.stroke();
          }
          // dark halo behind city name, placed to dodge the region pills
          ctx.font = `600 ${(city.big ? 9 : 8.5) * dpr}px 'DM Sans',sans-serif`;
          const cw2 = ctx.measureText(city.name).width;
          let tx, ty;
          if (city.side === 'left') { tx = cx2 - cw2 - 8 * dpr; ty = cy2 + 3 * dpr; }
          else if (city.side === 'below') { tx = cx2 - cw2 / 2; ty = cy2 + 13 * dpr; }
          else { tx = cx2 + 7 * dpr; ty = cy2 + 3 * dpr; }
          ctx.textAlign = 'left';
          ctx.fillStyle = `rgba(12,14,14,${0.72 * la})`;
          ctx.fillRect(tx - 3 * dpr, ty - 9 * dpr, cw2 + 6 * dpr, 12 * dpr);
          ctx.fillStyle = `rgba(236,214,170,${0.95 * la})`;
          ctx.fillText(city.name, tx, ty);
          ctx.textAlign = 'center';
        }
      }
      ctx.restore();
    }

    _setInfo(id) {
      const rg = REGIONS.find(r => r.id === id);
      if (!rg) {
        const legend = REGIONS.map(r =>
          `<span style="display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:#c9c4bc;white-space:nowrap;"><span style="width:8px;height:8px;border-radius:50%;background:rgba(${r.col},.9);box-shadow:0 0 6px rgba(${r.col},.7);"></span>${r.short || 'Khartoum'}</span>`).join('');
        this._info.innerHTML = `<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#4fd8c4;margin-bottom:6px;">Word origins — tap a region</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px 12px;">${legend}</div>`;
        return;
      }
      const rc = rg.col || '79,216,196';
      const chips = rg.words.map(wd =>
        `<span dir="rtl" style="font-family:'Noto Naskh Arabic',serif;font-size:13px;padding:3px 11px;border-radius:100px;background:rgba(${rc},0.1);border:1px solid rgba(${rc},0.4);color:rgba(${rc},1);">${wd}</span>`).join(' ');
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
