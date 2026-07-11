// ══════════════════════════════════════════════
// PRODUCE — the shared "produce Arabic from English, then compare" engine.
// One engine, two skins (learning-design doc §4): Flashcards' practice
// panel and Guided mode both run on this, so matching behavior stays
// identical everywhere. A word counts if the learner typed the Arabic
// script OR its transliteration (Arabizi), case-insensitive.
// ══════════════════════════════════════════════

function prodClean(w) {
  return String(w || '').toLowerCase().replace(/[.,!?،؟—"'…]/g, '');
}

// input vs an Arabic target + its phonetic line → {words, hits, hitAt(i)}
function prodMatch(input, targetAr, targetPh) {
  const words = String(targetAr).split(/\s+/).map(prodClean).filter(w => w.length > 1);
  const phWords = String(targetPh || '').split(/\s+/).map(prodClean);
  const norm = prodClean(input);
  const hitAt = (i) => norm.includes(words[i]) || (!!phWords[i] && phWords[i].length > 1 && norm.includes(phWords[i]));
  const hits = words.filter((_, i) => hitAt(i));
  return { words, hits, hitAt };
}

// the word-match chip row (green = said it, dim = missed)
function prodChipsHTML(m) {
  return `
    <span class="f2-p-score">${m.hits.length} of ${m.words.length} words</span>
    ${m.words.map((w, i) => `<span class="f2-p-chip ${m.hitAt(i) ? 'hit' : ''}" dir="auto">${escAttr(w)}</span>`).join('')}`;
}

// side-by-side "You said | The target" compare grid
function prodCompareGridHTML(input, targetAr, targetPh, targetLabel) {
  return `
    <div class="f2-p-compare">
      <div>
        <div class="f2-p-col-label">You said</div>
        <div class="f2-p-you" dir="auto">${escAttr(input) || '<i>—</i>'}</div>
      </div>
      <div class="f2-p-target-col">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span class="f2-p-col-label teal" style="margin-bottom:0">${targetLabel || 'The card'}</span>
          ${typeof speakerSVG === 'function' ? speakerSVG('#4fd8c4', encodeURIComponent(targetAr)) : ''}
        </div>
        <div class="f2-p-target">${escAttr(targetAr)}</div>
        ${targetPh ? `<div class="f2-p-target-ph">${escAttr(targetPh)}</div>` : ''}
      </div>
    </div>`;
}

// one-shot browser STT into a callback (shared mic behavior)
let prodRecognizer = null;
function prodMic(btnId, onText) {
  if (!coachMicSupported()) return;
  const btn = document.getElementById(btnId);
  if (prodRecognizer) { try { prodRecognizer.stop(); } catch (e) {} return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  prodRecognizer = new SR();
  prodRecognizer.lang = 'ar-SA';
  prodRecognizer.onresult = (ev) => onText(ev.results[0][0].transcript.trim());
  prodRecognizer.onend = () => { prodRecognizer = null; btn?.classList.remove('listening'); };
  prodRecognizer.onerror = () => { prodRecognizer = null; btn?.classList.remove('listening'); };
  prodRecognizer.start();
  btn?.classList.add('listening');
}
