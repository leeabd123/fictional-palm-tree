// Vocab lists — original implementation, restored from the author's prototype
let vocabListFilter='essential';

function renderVocabList(){
  const ca=document.getElementById('content-area');
  const lists=Object.keys(VOCAB_LISTS);
  const current=VOCAB_LISTS[vocabListFilter];
  ca.innerHTML=`
    <div class="vocab-list-tabs">
      ${lists.map(k=>`<button class="vl-tab ${vocabListFilter===k?'on':''}" onclick="setVLFilter('${k}')">${VOCAB_LISTS[k].label.split('—')[0].trim()}</button>`).join('')}
    </div>
    <div class="vl-list-meta">${current.desc}</div>
    <div class="vl-grid">
      ${current.items.map(item=>`<div class="vl-item">
        <div class="vl-ar">${item.ar}</div>
        <div class="vl-ph">${item.ph}</div>
        <div class="vl-en">${item.en}</div>
        ${item.note?`<div class="vl-note">${item.note}</div>`:''}
      </div>`).join('')}
    </div>
  `;
}

function setVLFilter(f){vocabListFilter=f;renderVocabList();}
