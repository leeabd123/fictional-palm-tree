// First-time intro screens per mode — re-skinned to the practice-modes
// handoff's "Start / onboarding" pattern (badge → kicker → serif title →
// lede → 3-step tiles → gold CTA → meta). Same behavior as before: shown
// once per mode per session, skippable, then the real activity renders.
let introShown = {flash:false,deep:false,shadow:false,mc:false,build:false,flow:false,speak:false,ref:true,trans:true,vocab:true,deepquiz:false,convo:false,starred:true,listen:false,contribute:false};

// per-mode kicker + 3 steps (from the reference's start data)
const INTRO_START = {
  flash:   { kicker: 'Build vocab · flashcards', steps: ['See the word', 'Recall it out loud', 'Rate yourself honestly'] },
  deep:    { kicker: 'Build vocab · deep', steps: ['Read the word in context', 'Explore its near-words', 'Lock in the nuance'] },
  shadow:  { kicker: 'Speak it · shadowing', steps: ['Hear the line', 'Echo the rhythm', 'Reveal & compare'] },
  build:   { kicker: 'Speak it · sentence builder', steps: ['Read the English', 'Build the Arabic', 'Check word by word'] },
  speak:   { kicker: 'Speak it · speak & respond', steps: ['Read the prompt', 'Answer like family', 'The coach compares'] },
  convo:   { kicker: 'Immerse · conversation', steps: ['Read the scene', 'Shadow each line', 'Take Solja’s turns'] },
  listen:  { kicker: 'Immerse · listening', steps: ['Play the line', 'Trust your ear', 'Pick what you heard'] },
  mc:      { kicker: 'Build vocab · quiz', steps: ['Read the word', 'Pick the meaning', 'Keep the streak'] },
  deepquiz:{ kicker: 'Build vocab · deep quiz', steps: ['Read the gap', 'Produce the word', 'Check yourself'] },
  flow:    { kicker: 'Speak it · flow', steps: ['Read the set', 'Translate in rhythm', 'Reveal & compare'] },
  contribute: { kicker: 'Preserve it · contribute', steps: ['Read the prompt', 'Add your family’s way', 'Native ears verify'] },
};

function renderIntro(m){
  _currentIntroMode=m;
  const intro=MODE_INTROS[m];
  if(!intro){introShown[m]=true;render();return;}
  const extra = INTRO_START[m] || { kicker: 'Practice', steps: ['Read', 'Say it out loud', 'Compare'] };
  const deckN = (typeof deck !== 'undefined' && deck.length) ? deck.length : '';
  const srcName = (typeof SRC_LABELS !== 'undefined' && SRC_LABELS[src]) ? SRC_LABELS[src][0] : '';
  const ca=document.getElementById('content-area');
  ca.innerHTML=`
    <div class="mode-anim">
      <div class="start-screen">
        <div class="start-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="start-kicker">${escAttr(extra.kicker)}</div>
        <div class="start-title">${intro.title}</div>
        <div class="start-lede">${intro.body}</div>
        <div class="start-steps">
          ${extra.steps.map((s, i) => `
          <div class="start-step">
            <span class="start-step-n">${i + 1}</span>
            <span class="start-step-t">${escAttr(s)}</span>
          </div>`).join('')}
        </div>
        <button class="start-cta" onclick="dismissIntro()">Start
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
        ${srcName && deckN ? `<div class="start-meta">Deck source · ${escAttr(srcName)} · ${deckN} items</div>` : ''}
        <div class="start-meta" style="max-width:420px;line-height:1.6"><b style="color:var(--gold)">Why it works:</b> ${intro.tip}</div>
        <button style="background:transparent;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;font-family:inherit;margin-top:16px;opacity:.7" onclick="skipAllIntros()">Skip all intros</button>
      </div>
    </div>
  `;
}
let _currentIntroMode='';
function dismissIntro(){introShown[_currentIntroMode]=true;render();}
function skipAllIntros(){Object.keys(introShown).forEach(k=>introShown[k]=true);render();}
// ══════════════════════════════════════
// SYNONYMS DATA (key words with alternatives)
// ══════════════════════════════════════
