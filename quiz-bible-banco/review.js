let currentReviewQuestion=null;
let pendingReviewAction='';
const reviewChecks=()=>[...document.querySelectorAll('[data-review-check]')];
const reviewConfig={endpoint:()=>localStorage.getItem('quizBibleReviewEndpoint')||'',secret:()=>sessionStorage.getItem('quizBibleReviewSecret')||''};
function setReviewStatus(text,kind=''){const el=document.getElementById('reviewSaveStatus');if(!el)return;el.textContent=text;el.className=`review-save-status ${kind}`.trim();}
function updateConnectionStatus(){const status=document.getElementById('reviewConnectionStatus');if(status)status.textContent=reviewConfig.endpoint()?'Endpoint configurado · listo para revisar':'Endpoint de revisión no configurado';}
function updateCriteriaProgress(){
  const checks=reviewChecks(),checked=checks.filter(c=>c.checked).length,total=checks.length;
  const approve=document.getElementById('approveQuestion');
  if(approve)approve.disabled=checked!==total;
  if(total===0)return;
  if(checked===total)setReviewStatus(`${checked}/${total} criterios cumplidos · Apta para aprobación`,'ok');
  else setReviewStatus(`${checked}/${total} criterios cumplidos · Requiere revisión o corrección`,checked?'warn':'');
}
function resetHumanReview(question){currentReviewQuestion=question;reviewChecks().forEach(c=>c.checked=false);document.getElementById('reviewObservation').value='';updateCriteriaProgress();}
function allCriteriaChecked(){return reviewChecks().length===6&&reviewChecks().every(c=>c.checked);}
function reviewer(){return document.getElementById('reviewerName').value.trim();}
function traditionKey(){return document.getElementById('tradition').value;}
function ensureBridge(){let frame=document.getElementById('reviewBridgeFrame');if(frame)return frame;frame=document.createElement('iframe');frame.id='reviewBridgeFrame';frame.name='reviewBridgeFrame';frame.hidden=true;document.body.appendChild(frame);return frame;}
function submitHumanReview(action){
  if(!currentReviewQuestion)return;
  const endpoint=reviewConfig.endpoint(),secret=reviewConfig.secret();
  if(!endpoint||!secret){document.getElementById('reviewConfigDialog').showModal();setReviewStatus('Configura la conexión','error');return;}
  const reviewerName=reviewer(),observation=document.getElementById('reviewObservation').value.trim();
  if(!reviewerName){setReviewStatus('Indica el nombre del revisor','error');return;}
  if(action==='approve'&&!allCriteriaChecked()){setReviewStatus('La aprobación requiere los 6/6 criterios cumplidos','error');updateCriteriaProgress();return;}
  if(action==='correction'&&!observation){setReviewStatus('Describe la corrección necesaria','error');return;}
  const criteria=Object.fromEntries(reviewChecks().map(c=>[c.dataset.reviewCheck,c.checked]));
  const payload={secret,action,tradition:traditionKey(),id:currentReviewQuestion.ID,book:currentReviewQuestion.Libro||'',reference:currentReviewQuestion.Referencia||'',reviewer:reviewerName,observation,criteria,clientTimestamp:new Date().toISOString()};
  ensureBridge();
  const form=document.createElement('form');form.method='POST';form.action=endpoint;form.target='reviewBridgeFrame';form.style.display='none';
  const input=document.createElement('input');input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);form.appendChild(input);document.body.appendChild(form);
  pendingReviewAction=action;setReviewStatus('Guardando…');form.submit();form.remove();
  window.setTimeout(()=>{if(document.getElementById('reviewSaveStatus').textContent==='Guardando…')setReviewStatus('Sin confirmación del endpoint. Verifica la configuración.','error');},12000);
}
window.addEventListener('message',e=>{
  const msg=e.data;if(!msg||msg.source!=='quizBibleReview')return;
  const result=msg.result||{};
  if(!result.ok){setReviewStatus(`No se pudo guardar: ${result.error||'error desconocido'}`,'error');return;}
  if(currentReviewQuestion&&result.id===currentReviewQuestion.ID){currentReviewQuestion.Revision_humana=result.revision_humana;currentReviewQuestion.Estado_QA=result.estado_qa;}
  setReviewStatus(pendingReviewAction==='approve'?'Aprobada y registrada':'Observada y registrada','ok');
  if(typeof updateStats==='function')updateStats();if(typeof applyFilters==='function')applyFilters();pendingReviewAction='';
});
window.addEventListener('DOMContentLoaded',()=>{
  updateConnectionStatus();ensureBridge();
  const savedReviewer=localStorage.getItem('quizBibleReviewer')||'';document.getElementById('reviewerName').value=savedReviewer;
  document.getElementById('reviewerName').addEventListener('change',e=>localStorage.setItem('quizBibleReviewer',e.target.value.trim()));
  reviewChecks().forEach(c=>c.addEventListener('change',updateCriteriaProgress));
  updateCriteriaProgress();
  document.getElementById('openReviewConfig').addEventListener('click',()=>{document.getElementById('reviewEndpoint').value=reviewConfig.endpoint();document.getElementById('reviewSecret').value='';document.getElementById('reviewConfigDialog').showModal();});
  document.getElementById('closeReviewConfig').addEventListener('click',()=>document.getElementById('reviewConfigDialog').close());
  document.getElementById('saveReviewConfig').addEventListener('click',()=>{const endpoint=document.getElementById('reviewEndpoint').value.trim(),secret=document.getElementById('reviewSecret').value;if(!endpoint||!secret)return;localStorage.setItem('quizBibleReviewEndpoint',endpoint);sessionStorage.setItem('quizBibleReviewSecret',secret);updateConnectionStatus();document.getElementById('reviewConfigDialog').close();});
  document.getElementById('approveQuestion').addEventListener('click',()=>submitHumanReview('approve'));document.getElementById('flagQuestion').addEventListener('click',()=>submitHumanReview('correction'));
});
const _originalOpenDetail=window.openDetail;
window.openDetail=function(o){currentReviewQuestion=o;if(typeof _originalOpenDetail==='function')_originalOpenDetail(o);resetHumanReview(o);};