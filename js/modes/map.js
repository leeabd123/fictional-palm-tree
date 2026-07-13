// Word origins — the designed map screen. The globe finds Sudan, then the
// dotted-particle map takes over; tap a region to see the phrases living there.
// Region counts are illustrative until community contributions carry real tags.

let mapC1Open = true;
let mapC2Open = true;

const MAP_REGION_BARS = [
  { name: 'Khartoum', pct: 88, n: 32, col: '232,201,154', hot: true },
  { name: 'Red Sea', pct: 40, n: 14, col: '110,190,235' },
  { name: 'Darfur', pct: 34, n: 12, col: '79,216,196' },
  { name: 'Northern', pct: 30, n: 11, col: '214,196,150' },
];

// ── System B (6b): the boot state — globe + targeting reticle + telemetry,
// then the map takes over. Runs once per session in neon. ──
let mapBooted = false;

function renderMapNeonBoot(ca) {
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="fui-hud" style="margin-top:6px">WORD ORIGINS <span class="sys">// SYS_BOOT</span></div>
      <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:24px;color:#fff;margin-top:8px">وين اللهجة عايشة؟</div>
      <div style="position:relative;height:300px;margin-top:16px;border-radius:20px;background:rgba(0,0,0,0.5);box-shadow:inset 0 8px 30px rgba(0,0,0,0.9);border:1px solid rgba(255,255,255,0.06);overflow:hidden">
        <tariga-globe style="position:absolute;inset:0"></tariga-globe>
        <div style="position:absolute;left:50%;top:50%;width:150px;height:150px;transform:translate(-50%,-50%);pointer-events:none">
          <span style="position:absolute;inset:0;border:1px solid rgba(34,211,238,0.7);border-radius:50%;animation:glowPulse 1.6s ease-in-out infinite;box-shadow:0 0 24px -6px rgba(34,211,238,0.8)"></span>
          <span style="position:absolute;left:50%;top:-8px;width:1px;height:16px;background:#22d3ee;transform:translateX(-50%)"></span>
          <span style="position:absolute;left:50%;bottom:-8px;width:1px;height:16px;background:#22d3ee;transform:translateX(-50%)"></span>
          <span style="position:absolute;top:50%;left:-8px;height:1px;width:16px;background:#22d3ee;transform:translateY(-50%)"></span>
          <span style="position:absolute;top:50%;right:-8px;height:1px;width:16px;background:#22d3ee;transform:translateY(-50%)"></span>
          <span style="position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:12px;font-family:ui-monospace,'SF Mono',monospace;font-size:10px;letter-spacing:.3em;color:#22d3ee;text-shadow:0 0 12px rgba(34,211,238,0.8)">SUDAN</span>
        </div>
      </div>
      <div style="margin-top:14px;padding:16px 18px;border-radius:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)" class="fui-mono">
        <div><span style="color:#34d399">[OK]</span> TARIGA GEO MODULE v2.1</div>
        <div><span style="color:#5b6272">[..]</span> SCANNING COORDINATES…</div>
        <div><span style="color:#5b6272">[..]</span> TARGET ACQUIRED: LAT 15.6°N · LON 32.5°E</div>
        <div>[▮▮▮▮▮▯▯] LOADING REGIONS 5/7<span class="fui-cursor">_</span></div>
      </div>
    </div>`;
  setTimeout(() => {
    mapBooted = true;
    if (mode === 'map') renderMap();
  }, 3200);
}

function renderMap() {
  const ca = document.getElementById('content-area');
  if (typeof neonOn === 'function' && neonOn() && !mapBooted) { renderMapNeonBoot(ca); return; }
  if (typeof neonOn === 'function' && neonOn()) { renderMapNeon(ca); return; }
  const live = typeof communityRegionCounts === 'function' ? communityRegionCounts() : {};
  const REGION_BAR_ID = { 'Khartoum': 'khartoum', 'Red Sea': 'red_sea', 'Darfur': 'darfur', 'Northern': 'northern' };
  const liveTotal = Object.values(live).reduce((a, b) => a + b, 0);
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="m2-head">
        <div class="d2-title" style="margin-bottom:0">Word origins</div>
        <div class="m2-head-ar">وين اللهجة عايشة؟</div>
      </div>
      <div class="d2-note" style="margin-bottom:16px">Where the dialect lives — watch the globe find Sudan, then tap a region.</div>

      ${(() => {
        // §28.4 — light up their own region when we know it
        const myRegion = (typeof getProfile === 'function') ? getProfile().region : null;
        const hl = (myRegion && REGION_TAG_MAP[myRegion]) || 'khartoum';
        return `
      <div class="m2-mapcard">
        <div class="m2-mapbox"><sudan-map highlight="${hl}"></sudan-map></div>
        ${myRegion ? `<div class="d2-item-note" style="text-align:center;margin-top:8px">glowing: <b style="color:var(--accent2)">${escAttr(myRegion)}</b> — where your family's from 🤍</div>` : ''}
      </div>`;
      })()}

      <div class="m2-grid">
        <div class="m2-cell gold">
          <button class="m2-cell-head" onclick="mapToggle(1)">
            <span class="m2-cell-label">Featured word</span>
            <span class="m2-cell-chev">${mapC1Open ? '▴' : '▾'}</span>
          </button>
          ${mapC1Open ? (() => {
            const liveOnes = (typeof _loadContribs === 'function' ? _loadContribs() : []).filter(c => c.status === 'live');
            const latest = liveOnes[liveOnes.length - 1];
            return latest ? `
          <div class="m2-cell-body">
            <div class="m2-feat-ar">${escAttr(latest.text)}</div>
            <div class="m2-feat-ph">community-verified ✓</div>
            <div class="m2-feat-note">The newest phrase to go live${latest.tags && latest.tags.region ? ' — from <b>' + escAttr(latest.tags.region) + '</b>' : ''}, straight from the review pipeline.</div>
          </div>` : `
          <div class="m2-cell-body">
            <div class="m2-feat-ar">فاهماني</div>
            <div class="m2-feat-ph">fahimani</div>
            <div class="m2-feat-note">Most heard in <b>Khartoum &amp; Omdurman</b> — glowing gold on the map.</div>
          </div>`;
          })() : ''}
        </div>
        <div class="m2-cell">
          <button class="m2-cell-head" onclick="mapToggle(2)">
            <span class="m2-cell-label">Phrases by region</span>
            <span class="m2-cell-chev">${mapC2Open ? '▴' : '▾'}</span>
          </button>
          ${mapC2Open ? `
          <div class="m2-cell-body">
            ${MAP_REGION_BARS.map((r, i) => `
            <div class="m2-bar-row">
              <span class="m2-bar-name">${r.name}</span>
              <div class="m2-bar"><i style="width:${Math.min(100, r.pct + (live[REGION_BAR_ID[r.name]] || 0) * 3)}%; background:rgba(${r.col},.85); box-shadow:0 0 8px rgba(${r.col},.6);"></i></div>
              <span class="m2-bar-n" style="color:rgba(${r.col},1)">${r.n + (live[REGION_BAR_ID[r.name]] || 0)}${live[REGION_BAR_ID[r.name]] ? ' <span style="color:var(--mint)">+' + live[REGION_BAR_ID[r.name]] + '</span>' : ''}</span>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>
      <div class="m2-foot">${liveTotal ? `<span style="color:var(--mint)">${liveTotal} community-verified phrase${liveTotal === 1 ? '' : 's'} live</span> — green counts come from real reviewed contributions; ` : ''}base numbers are illustrative until more regions report.</div>
    </div>
  `;
}

function mapToggle(n) {
  if (n === 1) mapC1Open = !mapC1Open;
  else mapC2Open = !mapC2Open;
  renderMap();
}

// ── System B (6a): word origins, map state — HUD header, gridded viewport,
// gradient-hairline cards, recessed groove bars with map-matched colors ──
function renderMapNeon(ca) {
  const live = typeof communityRegionCounts === 'function' ? communityRegionCounts() : {};
  const liveOnes = (typeof _loadContribs === 'function' ? _loadContribs() : []).filter(c => c.status === 'live');
  const latest = liveOnes[liveOnes.length - 1];
  const myRegion = (typeof getProfile === 'function') ? getProfile().region : null;
  const hl = (myRegion && REGION_TAG_MAP[myRegion]) || 'khartoum';
  const NBARS = [
    { name: 'Khartoum', id: 'khartoum', pct: 78, n: 32, col: '#fbbf24' },
    { name: 'Red Sea', id: 'red_sea', pct: 44, n: 14, col: '#22d3ee' },
    { name: 'Darfur', id: 'darfur', pct: 26, n: 12, col: '#a78bfa' },
  ];
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="fui-hud" style="margin-top:6px">WORD ORIGINS <span class="sys">// SYS_DATA_01</span></div>
      <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:24px;color:#fff;margin-top:8px">وين اللهجة عايشة؟</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:10px;letter-spacing:.14em;color:#fff;opacity:.85;margin-top:6px">TAP A REGION — SEE WHICH PHRASES LIVE THERE</div>

      <div style="position:relative;margin-top:14px;border-radius:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(34,211,238,0.25);overflow:hidden">
        <span style="position:absolute;inset:0;background-image:linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px);background-size:34px 34px;pointer-events:none;z-index:1"></span>
        <div class="m2-mapbox" style="position:relative"><sudan-map highlight="${hl}"></sudan-map></div>
      </div>
      ${myRegion ? `<div style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;letter-spacing:.14em;color:#22d3ee;text-align:center;margin-top:8px">HIGHLIGHTED: ${escAttr(myRegion.toUpperCase())} — WHERE YOUR FAMILY'S FROM</div>` : ''}

      <div class="fui-hairline" style="padding:18px;margin-top:14px">
        <div class="fui-hud" style="font-size:11px">FEATURED WORD</div>
        ${latest ? `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:26px;color:#fff;margin-top:10px">${escAttr(latest.text)}</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:#22d3ee;margin-top:4px;text-shadow:0 0 14px rgba(34,211,238,0.5)">community-verified ✓</div>
        <div style="font-size:11.5px;color:#8b93a3;line-height:1.6;margin-top:8px">The newest phrase to go live${latest.tags && latest.tags.region ? ' — from <b style="color:#fff">' + escAttr(latest.tags.region) + '</b>' : ''}, straight from the review pipeline.</div>` : `
        <div dir="rtl" style="font-family:'IBM Plex Sans Arabic',sans-serif;font-size:26px;color:#fff;margin-top:10px">فاهماني</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:#22d3ee;margin-top:4px;text-shadow:0 0 14px rgba(34,211,238,0.5)">fahimani</div>
        <div style="font-size:11.5px;color:#8b93a3;line-height:1.6;margin-top:8px">Most heard in <b style="color:#fff">Khartoum &amp; Omdurman</b> — lit amber on the map.</div>`}
      </div>

      <div class="fui-hairline" style="padding:18px;margin-top:12px">
        <div class="fui-hud" style="font-size:11px">PHRASES BY REGION</div>
        ${NBARS.map(r => {
          const extra = live[r.id] || 0;
          return `
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px">
          <span style="width:8px;height:8px;border-radius:50%;background:${r.col};box-shadow:0 0 10px ${r.col};flex-shrink:0"></span>
          <span style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:#c6ccd8;width:76px">${r.name}</span>
          <span class="fui-groove" style="flex:1"><span style="display:block;height:100%;width:${Math.min(100, r.pct + extra * 3)}%;border-radius:4px;background:linear-gradient(90deg,${r.col}88,${r.col});box-shadow:0 0 12px ${r.col}cc"></span></span>
          <span style="font-family:'Space Grotesk',sans-serif;font-size:11px;color:${r.col};width:44px;text-align:right">${r.n + extra}${extra ? ' <span style="color:#4ade80">+' + extra + '</span>' : ''}</span>
        </div>`;
        }).join('')}
        <div style="font-family:'Space Grotesk',sans-serif;font-size:8.5px;letter-spacing:.14em;color:#5b6272;margin-top:14px">GREEN COUNTS = REAL REVIEWED CONTRIBUTIONS · BASE NUMBERS ILLUSTRATIVE</div>
      </div>
    </div>`;
}
