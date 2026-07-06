// Word origins — the designed map screen. The globe finds Sudan, then the
// dotted-particle map takes over; tap a region to see the phrases living there.
// Region counts are illustrative until community contributions carry real tags.

let mapC1Open = true;
let mapC2Open = true;

const MAP_REGION_BARS = [
  { name: 'Khartoum', pct: 88, n: 32, hot: true },
  { name: 'Red Sea', pct: 40, n: 14 },
  { name: 'Darfur', pct: 34, n: 12 },
  { name: 'Northern', pct: 30, n: 11 },
];

function renderMap() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="m2-head">
        <div class="d2-title" style="margin-bottom:0">Word origins</div>
        <div class="m2-head-ar">وين اللهجة عايشة؟</div>
      </div>
      <div class="d2-note" style="margin-bottom:16px">Where the dialect lives — watch the globe find Sudan, then tap a region.</div>

      <div class="m2-mapcard">
        <div class="m2-mapbox"><sudan-map highlight="khartoum"></sudan-map></div>
      </div>

      <div class="m2-grid">
        <div class="m2-cell gold">
          <button class="m2-cell-head" onclick="mapToggle(1)">
            <span class="m2-cell-label">Featured word</span>
            <span class="m2-cell-chev">${mapC1Open ? '▴' : '▾'}</span>
          </button>
          ${mapC1Open ? `
          <div class="m2-cell-body">
            <div class="m2-feat-ar">فاهماني</div>
            <div class="m2-feat-ph">fahimani</div>
            <div class="m2-feat-note">Most heard in <b>Khartoum &amp; Omdurman</b> — glowing gold on the map.</div>
          </div>` : ''}
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
              <div class="m2-bar"><i style="width:${r.pct}%; ${r.hot ? '' : 'background:rgba(79,216,196,.55); box-shadow:none;'}"></i></div>
              <span class="m2-bar-n" style="${r.hot ? '' : 'color:var(--text3)'}">${r.n}</span>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>
      <div class="m2-foot">Illustrative data — region tags grow from community contributions in Contribute mode.</div>
    </div>
  `;
}

function mapToggle(n) {
  if (n === 1) mapC1Open = !mapC1Open;
  else mapC2Open = !mapC2Open;
  renderMap();
}
