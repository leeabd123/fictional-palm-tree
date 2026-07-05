// Daily practice activity + streak — powers the home screen streak pill.
// A day counts when the learner actually practices: rates a card, gets
// coached, answers a listening exercise, or contributes a phrase.

const ACTIVITY_KEY = 'tariga_activity_v1';

function _dayStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function recordActivity() {
  try {
    const days = new Set(JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'));
    days.add(_dayStr(new Date()));
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([...days].slice(-400)));
  } catch (e) {}
}

// Consecutive practice days ending today (or yesterday, so an unbroken
// streak doesn't read as 0 before today's first practice).
function getStreak() {
  let days;
  try { days = new Set(JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]')); } catch (e) { return 0; }
  if (!days.size) return 0;
  const d = new Date();
  if (!days.has(_dayStr(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(_dayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
