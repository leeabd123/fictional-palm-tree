// Vocab lists — curated themed word lists
let vlKey='essential';

function renderVocabList(){
  const ca=document.getElementById('content-area');
  const keys=Object.keys(VOCAB_LISTS);
  const list=VOCAB_LISTS[vlKey]||VOCAB_LISTS[keys[0]];

  ca.innerHTML=`
    <div class="vocab-list-tabs">
      ${keys.map(k=>`<button class="vl-tab ${k===vlKey?'on':''}" onclick="setVocabList('${k}')">${VOCAB_LISTS[k].label.split('—')[0].trim()}</button>`).join('')}
    </div>
    <div class="vl-section-head">${list.label}</div>
    <div class="vl-list-meta">${list.desc}</div>
    <div class="vl-grid">
      ${list.items.map(it=>`
        <div class="vl-item">
          <div class="vl-ar">${it.ar}</div>
          <div class="vl-ph">${it.ph}</div>
          <div class="vl-en">${it.en}</div>
          ${it.note?`<div class="vl-note">${it.note}</div>`:''}
        </div>`).join('')}
    </div>
  `;
}

function setVocabList(k){
  vlKey=k;
  renderVocabList();
}
