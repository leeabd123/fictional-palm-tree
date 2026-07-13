// ══════════════════════════════════════════════
// PRODUCE — the shared "produce Arabic from English, then compare" engine.
// One engine, two skins (learning-design doc §4): Flashcards' practice
// panel and Guided mode both run on this, so matching behavior stays
// identical everywhere. A word counts if the learner typed the Arabic
// script OR its transliteration (Arabizi), case-insensitive.
// ══════════════════════════════════════════════

// shared monochrome icons — the design bans emoji in favor of the
// geometric glyph language; mic + speaker need real icons, not glyphs
const UI_MIC = '<svg viewBox="0 0 20 20" fill="currentColor" style="width:1.05em;height:1.05em;vertical-align:-0.12em" aria-label="microphone"><path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/></svg>';
const UI_SPK = '<svg viewBox="0 0 20 20" fill="currentColor" style="width:1.05em;height:1.05em;vertical-align:-0.12em" aria-label="listen"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"/></svg>';

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
