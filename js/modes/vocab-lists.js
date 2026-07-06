// Vocab lists — designed screen: pill tabs, two-column glass word grid.
let vocabListFilter='essential';

function renderVocabList(){
  const ca=document.getElementById('content-area');
  const lists=Object.keys(VOCAB_LISTS);
  const current=VOCAB_LISTS[vocabListFilter];
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title">Vocab lists</div>
      <div class="d2-note">${escAttr(current.desc)}</div>
      <div class="d2-tab-row">
        ${lists.map(k=>`<button class="d2-tab ${vocabListFilter===k?'on':''}" onclick="setVLFilter('${k}')">${escAttr(VOCAB_LISTS[k].label.split('—')[0].trim())}</button>`).join('')}
      </div>
      <div class="d2-grid2">
        ${current.items.map(item=>`<div class="d2-item">
          <div class="d2-item-ar">${escAttr(item.ar)}</div>
          <div class="d2-item-ph">${escAttr(item.ph)}</div>
          <div class="d2-item-en">${escAttr(item.en)}</div>
          ${item.note?`<div class="d2-item-note">${escAttr(item.note)}</div>`:''}
        </div>`).join('')}
      </div>
    </div>
  `;
}

function setVLFilter(f){vocabListFilter=f;renderVocabList();}
