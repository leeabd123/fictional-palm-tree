// Journey — the design's "Then → now" tab: every coached scenario in one
// place, each opening its full before/after comparison in the coach.
// Plus per-domain comfort (learning-design doc §3): tracked separately per
// domain, not one global level.

const COMFORT_LABEL = { none: 'Beginning', little: 'Beginning', good: 'Comfortable' };

function journeyDomainsHTML() {
  const gDone = getGuidedProgress();
  const profile = getProfile();
  return `
    <div class="j2-sec-label" style="margin-top:26px">Your domains — comfort is per-domain, not one level</div>
    ${DOMAINS.map(dm => {
      const items = dm.id === 'family'
        ? [...GUIDED_SCENARIOS, ...CALL_SEQUENCES].filter(x => x.domain === dm.id)
        : [];
      const done = items.filter(x => gDone[x.id]).length;
      const tier = dm.id === 'family'
        ? (COMFORT_LABEL[profile.comfort] || 'Beginning')
        : null;
      const pct = items.length ? Math.round((done / items.length) * 100) : 0;
      return `
      <div class="d2-item" style="margin-bottom:8px;display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">${dm.icon}</span>
        <span style="flex:1">
          <span style="display:block;font-size:13.5px;color:var(--text)">${dm.label}
            ${tier ? `<span class="d2-badge" style="margin-left:6px">${tier}</span>` : ''}</span>
          <span style="display:block;font-size:11px;color:var(--text3);margin-top:2px">
            ${dm.live ? `${done} of ${items.length} practiced` : 'coming soon — ' + escAttr(dm.desc)}</span>
          ${dm.live ? `<span class="m2-bar" style="display:block;margin-top:6px"><i style="width:${pct}%"></i></span>` : ''}
        </span>
      </div>`;
    }).join('')}`;
}

function renderJourney() {
  const ca = document.getElementById('content-area');
  let store = {};
  try { store = JSON.parse(localStorage.getItem('tariga_attempts_v1') || '{}'); } catch (e) {}
  const entries = SPEAK_QA.map((q, i) => ({ q, i, attempts: store[q.qen] || [] }))
    .filter(e => e.attempts.length);

  if (!entries.length) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <div class="starred-empty">
          <div class="starred-empty-icon">✦</div>
          <div class="starred-empty-title">Your journey starts with the coach</div>
          <div class="starred-empty-body">Answer a scenario in <b>Your coach</b> and it appears here.<br>Answer it again another day and this page becomes your before-and-after.</div>
          <div class="coach-fb-actions" style="margin-top:22px">
            <button class="btn btn-accent" onclick="setMode('speak')">Practice out loud →</button>
          </div>
        </div>
        ${journeyDomainsHTML()}
      </div>`;
    return;
  }

  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="coach-journey-head">
        <div class="coach-journey-title">Then <span class="coach-journey-vs">→</span> now</div>
        <div class="coach-journey-sub">${entries.length} scenario${entries.length === 1 ? '' : 's'} coached · tap one to see your growth</div>
      </div>
      ${entries.map(e => {
        const first = e.attempts[0], last = e.attempts[e.attempts.length - 1];
        const s1 = naturalScore(first.metrics), s2 = naturalScore(last.metrics);
        const delta = s2 - s1;
        return `
        <button class="journey-row" onclick="journeyOpen(${e.i})">
          <span class="journey-row-body">
            <span class="journey-row-q">${escAttr(e.q.qen)}</span>
            <span class="journey-row-meta">${e.attempts.length} attempt${e.attempts.length === 1 ? '' : 's'} · last ${fmtAttemptDate(last.ts)}</span>
          </span>
          <span class="journey-row-score ${delta > 0 ? 'up' : ''}">${e.attempts.length > 1 ? (delta > 0 ? '+' + delta : delta === 0 ? '·' : delta) + ' natural' : s2 + ' natural'}</span>
          <span class="home-cta-chev">›</span>
        </button>`;
      }).join('')}
      ${journeyDomainsHTML()}
    </div>
  `;
}

function journeyOpen(i) {
  coachIdx = i;
  coachPhase = 'journey';
  coachText = ''; coachFeedback = null; coachError = null;
  setMode('speak');
}
