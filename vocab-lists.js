// Full reference mode
function renderRef(){
  const ca=document.getElementById('content-area');
  const all=[...V1,...V2,...P2,...EXTRA];
  const cats=['All',...new Set(all.map(x=>x.cat))].sort();
  let filtered=all;
  if(refFilt==='All'){}
  else if(refFilt==='Video 1')filtered=all.filter(x=>x.src==='v1');
  else if(refFilt==='Video 2')filtered=all.filter(x=>x.src==='v2');
  else if(refFilt==='Glossary')filtered=all.filter(x=>x.src==='p2');
  else filtered=all.filter(x=>x.cat===refFilt);

  const byCat={};
  filtered.forEach(it=>{if(!byCat[it.cat])byCat[it.cat]=[];byCat[it.cat].push(it);});

  const filterOpts=[...cats,'Video 1','Video 2','Glossary'];
  let html=`<div class="ref-filters">${filterOpts.map(c=>`<button class="ref-filter ${refFilt===c?'on':''}" onclick="setFilt('${c}')">${c}</button>`).join('')}</div>`;

  Object.keys(byCat).sort().forEach(cat=>{
    html+=`<div class="ref-cat-head">${cat}</div>`;
    byCat[cat].forEach(it=>{
      const sc=it.src==='v1'?'tag-v1':it.src==='v2'?'tag-v2':'tag-p2';
      const sl=it.src==='v1'?'V1':it.src==='v2'?'V2':'P2';
      html+=`<div class="ref-item">
        <div class="ref-header">
          <span class="tag ${sc}" style="font-size:10px">${sl}</span>
          <span class="ref-ar">${it.a}</span>
          <span class="ref-ph">${it.p}</span>
        </div>
        <div class="ref-en">${it.e}</div>
        <div class="ref-ctx">${it.ctx}</div>
        <div class="ex-block" style="font-size:12px;margin-top:8px">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>
      </div>`;
    });
  });

  ca.innerHTML=html;
  document.getElementById('top-counter').textContent=`${filtered.length} items`;
}

function setFilt(f){refFilt=f;renderRef();}

// ── Result ──
