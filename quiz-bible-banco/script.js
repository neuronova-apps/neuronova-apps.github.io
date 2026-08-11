const SOURCES={
  protestante:{label:'Protestante',files:Array.from({length:10},(_,i)=>`data/p${String(i+1).padStart(2,'0')}.csv.gz.b64`)},
  catolica:{label:'Católica',files:['data/c01.csv.gz.b64','data/c02plus.csv.gz.b64']}
};
const PAGE_SIZE=50;
let headers=[],data=[],filtered=[],page=1;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const errorText=e=>e instanceof Error?e.message:(typeof e==='string'?e:JSON.stringify(e) || String(e));

function parseCSV(text){
  const rows=[];let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c==='"'){if(q&&n==='"'){cell+='"';i++;}else q=!q;}
    else if(c===','&&!q){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  row.push(cell);if(row.some(v=>v!==''))rows.push(row);return rows;
}
function rowsToObjects(rows,setHeaders=false){
  if(!rows.length)return[];
  const localHeaders=rows[0].map(h=>h.trim());
  if(setHeaders||!headers.length)headers=localHeaders;
  return rows.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(localHeaders.map((h,i)=>[h,r[i]??''])));
}
function value(o,k){return o[k]??'';}
function setSource(state,msg){
  const ok=state==='ok',loading=state==='loading';
  $('sourceStatus').textContent=loading?'Cargando copia web del Banco Maestro…':ok?'Banco cargado desde Neuronova':'No se pudo cargar la copia web';
  $('sourceDetail').textContent=msg;
  document.querySelector('.dot').style.background=ok?'var(--green)':loading?'var(--cyan)':'var(--amber)';
}
function base64ToBytes(b64,url){
  const clean=b64.replace(/\s+/g,'');
  if(!clean)throw new Error(`${url}: archivo vacío`);
  let binary;
  try{binary=atob(clean);}catch(e){throw new Error(`${url}: base64 inválido (${errorText(e)})`);}
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  if(bytes.length<2||bytes[0]!==0x1f||bytes[1]!==0x8b){
    const sig=[...bytes.slice(0,4)].map(v=>v.toString(16).padStart(2,'0')).join(' ');
    throw new Error(`${url}: cabecera gzip inválida (${sig||'sin datos'})`);
  }
  return bytes;
}
async function ungzip(bytes,url){
  let nativeError='';
  if(typeof DecompressionStream!=='undefined'){
    try{
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      return await new Response(stream).text();
    }catch(e){nativeError=errorText(e);console.warn(`${url}: DecompressionStream falló`,e);}
  }
  if(window.pako&&typeof window.pako.ungzip==='function'){
    try{return window.pako.ungzip(bytes,{to:'string'});}catch(e){
      const pakoError=errorText(e);
      throw new Error(`${url}: gzip no se pudo descomprimir. Nativo: ${nativeError||'no disponible'}; pako: ${pakoError}`);
    }
  }
  throw new Error(`${url}: sin descompresor gzip compatible. Nativo: ${nativeError||'no disponible'}`);
}
async function inflateRepositoryFile(url){
  const res=await fetch(`${url}?v=20260811-3`,{cache:'no-store'});
  if(!res.ok)throw new Error(`${url}: HTTP ${res.status}`);
  const b64=await res.text();
  const bytes=base64ToBytes(b64,url);
  const text=await ungzip(bytes,url);
  if(!text.trim())throw new Error(`${url}: CSV descomprimido vacío`);
  return text;
}
async function loadRepository(){
  const src=SOURCES[$('tradition').value];
  setSource('loading',`Leyendo ${src.label} desde el repositorio…`);
  $('loadLive').disabled=true;
  let currentFile='';
  try{
    headers=[];
    const all=[];
    for(let i=0;i<src.files.length;i++){
      currentFile=src.files[i];
      setSource('loading',`Leyendo ${src.label}: archivo ${i+1} de ${src.files.length}…`);
      const text=await inflateRepositoryFile(currentFile);
      const rows=parseCSV(text);
      if(!rows.length||!rows[0].includes('ID'))throw new Error(`${currentFile}: no contiene un CSV válido`);
      const objects=rowsToObjects(rows,i===0);
      if(!objects.length)throw new Error(`${currentFile}: no contiene preguntas`);
      all.push(...objects);
    }
    loadData(all);
    const expected=$('tradition').value==='protestante'?1000:1100;
    if(data.length!==expected)throw new Error(`conteo final incorrecto: se esperaban ${expected} registros y se cargaron ${data.length}`);
    setSource('ok',`${src.label}: ${data.length.toLocaleString('es-PE')} preguntas cargadas desde la copia web del repositorio. Google Sheets permanece como fuente maestra privada.`);
  }catch(e){
    const msg=errorText(e);
    console.error('Quiz Bible load error',currentFile,e);
    setSource('error',`Error en ${currentFile||'la carga'}: ${msg}`);
    renderEmpty(`No se pudo cargar la copia local. ${currentFile?`Archivo: ${currentFile}. `:''}${msg}`);
  }finally{$('loadLive').disabled=false;}
}
function loadData(rows){data=rows;page=1;populateFilters();applyFilters();updateStats();}
function unique(k){return [...new Set(data.map(o=>value(o,k)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));}
function fillSelect(id,k){const s=$(id),current=s.value;s.innerHTML='<option value="">Todos</option>'+unique(k).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');if([...s.options].some(o=>o.value===current))s.value=current;}
function populateFilters(){fillSelect('testament','Testamento');fillSelect('book','Libro');fillSelect('level','Nivel');fillSelect('qa','Estado_QA');fillSelect('human','Revision_humana');}
function applyFilters(){
  const term=$('search').value.trim().toLowerCase();
  const rules=[['testament','Testamento'],['book','Libro'],['level','Nivel'],['qa','Estado_QA'],['human','Revision_humana']];
  filtered=data.filter(o=>{if(term&&!Object.values(o).join(' ').toLowerCase().includes(term))return false;return rules.every(([id,k])=>!$(id).value||value(o,k)===$(id).value);});
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));if(page>pages)page=pages;render();
}
function badge(v){const t=String(v||'—');let cls='';if(/si|verificado|publicable|revisado|apto/i.test(t))cls='ok';else if(/revisar|no|pendiente/i.test(t))cls='warn';return `<span class="badge ${cls}">${esc(t)}</span>`;}
function render(){
  const start=(page-1)*PAGE_SIZE,slice=filtered.slice(start,start+PAGE_SIZE);
  $('visibleCount').textContent=filtered.length.toLocaleString('es-PE');
  $('rows').innerHTML=slice.length?slice.map((o,i)=>`<tr><td><strong>${esc(value(o,'ID'))}</strong></td><td>${esc(value(o,'Referencia'))}</td><td>${esc(value(o,'Libro'))}</td><td>${badge(value(o,'Nivel'))}</td><td class="question-cell">${esc(value(o,'Pregunta'))}</td><td>${esc(value(o,'Respuesta_correcta'))}</td><td>${badge(value(o,'Estado_QA'))}</td><td>${badge(value(o,'Revision_humana'))}</td><td><button class="row-button" data-index="${start+i}">Ver detalle</button></td></tr>`).join(''):'<tr><td colspan="9" class="empty">No hay preguntas que coincidan con los filtros.</td></tr>';
  $('pageInfo').textContent=`Página ${page} de ${Math.max(1,Math.ceil(filtered.length/PAGE_SIZE))}`;
  $('prevPage').disabled=page<=1;$('nextPage').disabled=page>=Math.ceil(filtered.length/PAGE_SIZE);
  document.querySelectorAll('.row-button').forEach(b=>b.addEventListener('click',()=>openDetail(filtered[Number(b.dataset.index)])));
}
function renderEmpty(msg){data=[];filtered=[];$('rows').innerHTML=`<tr><td colspan="9" class="empty">${esc(msg)}</td></tr>`;$('visibleCount').textContent='0';updateStats();}
function updateStats(){
  const count=(k,v)=>data.filter(o=>value(o,k).toLowerCase()===v.toLowerCase()).length;
  $('statTotal').textContent=data.length.toLocaleString('es-PE');
  $('statReview').textContent=count('Estado_QA','Revisar').toLocaleString('es-PE');
  $('statHuman').textContent=count('Revision_humana','Si').toLocaleString('es-PE');
  $('statVerified').textContent=count('Estado_QA','Verificado').toLocaleString('es-PE');
  $('statPublishable').textContent=count('Estado_QA','Publicable').toLocaleString('es-PE');
  $('statActive').textContent=count('Activa_app','Si').toLocaleString('es-PE');
}
function openDetail(o){
  if(!o)return;
  $('detailTitle').textContent=`${value(o,'ID')} · ${value(o,'Referencia')}`;
  const priority=new Set(['Pregunta','Opcion_A','Opcion_B','Opcion_C','Opcion_D','Respuesta_correcta','Explicacion_breve']);
  $('detailBody').innerHTML=headers.filter(h=>value(o,h)!=='').map(h=>`<dl class="detail-item ${priority.has(h)?'wide':''}"><dt>${esc(h.replaceAll('_',' '))}</dt><dd>${esc(value(o,h))}</dd></dl>`).join('');
  $('detailDialog').showModal();
}
$('loadLive').addEventListener('click',loadRepository);
$('tradition').addEventListener('change',()=>{renderEmpty('Cargando la tradición seleccionada…');loadRepository();});
$('csvFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const text=await f.text();loadData(rowsToObjects(parseCSV(text),true));setSource('ok',`CSV local: ${f.name} · ${data.length.toLocaleString('es-PE')} registros.`);e.target.value='';});
['search','testament','book','level','qa','human'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',()=>{page=1;applyFilters();}));
$('clearFilters').addEventListener('click',()=>{$('search').value='';['testament','book','level','qa','human'].forEach(id=>$(id).value='');page=1;applyFilters();});
$('prevPage').addEventListener('click',()=>{if(page>1){page--;render();}});
$('nextPage').addEventListener('click',()=>{if(page*PAGE_SIZE<filtered.length){page++;render();}});
$('closeDialog').addEventListener('click',()=>$('detailDialog').close());
$('detailDialog').addEventListener('click',e=>{if(e.target===$('detailDialog'))$('detailDialog').close();});
window.addEventListener('DOMContentLoaded',loadRepository);