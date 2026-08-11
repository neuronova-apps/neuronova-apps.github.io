let currentReviewQuestion=null;
const reviewChecks=()=>[...document.querySelectorAll('[data-review-check]')];
const reviewConfig={
  endpoint:()=>localStorage.getItem('quizBibleReviewEndpoint')||'',
  secret:()=>sessionStorage.getItem('quizBibleReviewSecret')||''
};
function setReviewStatus(text,kind=''){
  const el=document.getElementById('reviewSaveStatus');
  if(!el)return;
  el.textContent=text;
  el.className=`review-save-status ${kind}`.trim();
}
function updateConnectionStatus(){
  const status=document.getElementById('reviewConnectionStatus');
  if(!status)return;
  status.textContent=reviewConfig.endpoint()?'Endpoint configurado · listo para autenticación':'Endpoint de revisión no configurado';
}
function resetHumanReview(question){
  currentReviewQuestion=question;
  reviewChecks().forEach(c=>c.checked=false);
  document.getElementById('reviewObservation').value='';
  setReviewStatus('Sin guardar');
}
function allCriteriaChecked(){return reviewChecks().every(c=>c.checked);}
function reviewer(){return document.getElementById('reviewerName').value.trim();}
function traditionKey(){return document.getElementById('tradition').value;}
async function submitHumanReview(action){
  if(!currentReviewQuestion)return;
  const endpoint=reviewConfig.endpoint(),secret=reviewConfig.secret();
  if(!endpoint||!secret){document.getElementById('reviewConfigDialog').showModal();setReviewStatus('Configura la conexión','error');return;}
  const reviewerName=reviewer();
  const observation=document.getElementById('reviewObservation').value.trim();
  if(!reviewerName){setReviewStatus('Indica el nombre del revisor','error');return;}
  if(action==='approve'&&!allCriteriaChecked()){setReviewStatus('Marca los 6 criterios antes de aprobar','error');return;}
  if(action==='correction'&&!observation){setReviewStatus('Describe la corrección necesaria','error');return;}
  const criteria=Object.fromEntries(reviewChecks().map(c=>[c.dataset.reviewCheck,c.checked]));
  const payload={
    secret,
    action,
    tradition:traditionKey(),
    id:currentReviewQuestion.ID,
    book:currentReviewQuestion.Libro||'',
    reference:currentReviewQuestion.Referencia||'',
    reviewer:reviewerName,
    observation,
    criteria,
    clientTimestamp:new Date().toISOString()
  };
  setReviewStatus('Guardando…');
  try{
    const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});
    const text=await res.text();
    let result={};
    try{result=JSON.parse(text);}catch{throw new Error(`Respuesta no válida del endpoint: ${text.slice(0,140)}`);}
    if(!result.ok)throw new Error(result.error||'El endpoint rechazó la revisión');
    currentReviewQuestion.Revision_humana=result.revision_humana;
    currentReviewQuestion.Estado_QA=result.estado_qa;
    setReviewStatus(action==='approve'?'Aprobada y registrada':'Observada y registrada','ok');
    if(typeof updateStats==='function')updateStats();
    if(typeof applyFilters==='function')applyFilters();
  }catch(e){setReviewStatus(`No se pudo guardar: ${e.message||e}`,'error');}
}
window.addEventListener('DOMContentLoaded',()=>{
  updateConnectionStatus();
  const savedReviewer=localStorage.getItem('quizBibleReviewer')||'';
  document.getElementById('reviewerName').value=savedReviewer;
  document.getElementById('reviewerName').addEventListener('change',e=>localStorage.setItem('quizBibleReviewer',e.target.value.trim()));
  document.getElementById('openReviewConfig').addEventListener('click',()=>{
    document.getElementById('reviewEndpoint').value=reviewConfig.endpoint();
    document.getElementById('reviewSecret').value='';
    document.getElementById('reviewConfigDialog').showModal();
  });
  document.getElementById('closeReviewConfig').addEventListener('click',()=>document.getElementById('reviewConfigDialog').close());
  document.getElementById('saveReviewConfig').addEventListener('click',()=>{
    const endpoint=document.getElementById('reviewEndpoint').value.trim();
    const secret=document.getElementById('reviewSecret').value;
    if(!endpoint||!secret)return;
    localStorage.setItem('quizBibleReviewEndpoint',endpoint);
    sessionStorage.setItem('quizBibleReviewSecret',secret);
    updateConnectionStatus();
    document.getElementById('reviewConfigDialog').close();
  });
  document.getElementById('approveQuestion').addEventListener('click',()=>submitHumanReview('approve'));
  document.getElementById('flagQuestion').addEventListener('click',()=>submitHumanReview('correction'));
});

// Integra el panel con el detalle existente sin modificar el lector principal.
const _originalOpenDetail=window.openDetail;
window.openDetail=function(o){
  currentReviewQuestion=o;
  if(typeof _originalOpenDetail==='function')_originalOpenDetail(o);
  resetHumanReview(o);
};