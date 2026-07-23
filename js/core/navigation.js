// setMode, render routing, source switching
function setSrc(s){
  src=s;
  ['v1','v2','all','p2','extra'].forEach(x=>{
    const el=document.getElementById('src-'+x);
    if(el) el.className='src-btn'+(x===s?' on-'+s:'');
  });
  deck=getSrc();idx=0;flipped=false;mcAns=false;revShown=false;
  deepDeck=[];deepIdx=0;
  knowSet.clear();learnSet.clear();streak=[];usedVocabChips=new Set();
  updStats();render();
}

function setMode(m){
  mode=m;
  ['flash','deep','shadow','mc','build','flow','speak','ref','trans','vocab','deepquiz','convo','starred','listen','contribute','home','journey','map','guided','call','warmup','freeform','review','livecall','speed','about','admin','tree'].forEach(x=>{
    const el=document.getElementById('nav-'+x);
    if(el) el.className='nav-btn'+(x===m?' on':'');
  });
  const titles={flash:'Flashcards',deep:'Deep cards + synonyms',shadow:'Shadowing',mc:'Quiz',build:'Sentence builder',flow:'Flow translation',speak:'Speak & respond — your coach',ref:'Full reference',trans:'Transitions guide',vocab:'Vocab lists',deepquiz:'Deep quiz',convo:'Conversation mode',listen:'Tune your ear',contribute:'Contribute — preserve the dialect',home:'\u0637\u0631\u064a\u0642\u0629',journey:'Your journey',starred:'Starred items',map:'Word origins',guided:'Guided practice',call:'Phone call',warmup:'Easing back in',freeform:'Free-form',review:'Reviewer mode',livecall:'Live call',speed:'Speed round',about:'How Tariga works',admin:'Founder tools',tree:'The domain map',branch:'Branch detail'};
  document.getElementById('top-title').textContent=titles[m]||m;
  deck=getSrc();idx=0;flipped=false;mcAns=false;revShown=false;
  deepDeck=[];deepIdx=0;
  knowSet.clear();learnSet.clear();streak=[];usedVocabChips=new Set();shadowArHidden=true;buildArHidden=true;
  if(typeof flashView!=='undefined')flashView='browse';   // flashcards always open on browsing
  window._sayArRate=undefined;   // shadowing speed chips don't leak into other modes
  updStats();tipIdx++;
  // Show intro screen first time for each mode
  if(!introShown[m]){ renderIntro(m); return; }
  render();
}

function render(){
  if(mode==='ref'){renderRef();return;}
  if(mode==='shadow'){renderShadow();return;}
  if(mode==='mc'){renderMC();return;}
  if(mode==='build'){renderBuild();return;}
  if(mode==='flow'){renderFlow();return;}
  if(mode==='speak'){renderSpeak();return;}
  if(mode==='trans'){renderTrans();return;}
  if(mode==='vocab'){renderVocabList();return;}
  if(mode==='deepquiz'){renderDeepQuiz();return;}
  if(mode==='convo'){renderConvo();return;}
  if(mode==='listen'){renderListen();return;}
  if(mode==='contribute'){renderContribute();return;}
  if(mode==='home'){renderHome();return;}
  if(mode==='journey'){renderJourney();return;}
  if(mode==='deep'){renderDeepCards();return;}
  if(mode==='starred'){renderStarred();return;}
  if(mode==='map'){renderMap();return;}
  if(mode==='guided'){renderGuided();return;}
  if(mode==='call'){renderCall();return;}
  if(mode==='warmup'){renderWarmup();return;}
  if(mode==='freeform'){renderFreeform();return;}
  if(mode==='review'){renderReview();return;}
  if(mode==='livecall'){renderLivecall();return;}
  if(mode==='speed'){renderSpeed();return;}
  if(mode==='about'){renderAbout();return;}
  if(mode==='admin'){renderAdmin();return;}
  if(mode==='tree'){renderTree();return;}
  if(mode==='branch'){renderBranch();return;}
  renderFlash();
}


