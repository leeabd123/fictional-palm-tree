// Journey — the design's "Then → now" tab: every coached scenario in one
// place, each opening its full before/after comparison in the coach.

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
    </div>
  `;
}

function journeyOpen(i) {
  coachIdx = i;
  coachPhase = 'journey';
  coachText = ''; coachFeedback = null; coachError = null;
  setMode('speak');
}
