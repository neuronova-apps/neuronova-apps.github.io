const neuronovaProjects = [
  { id: 'quizbible', name: 'Quiz Bible', bankName: 'Quiz Bible - Banco maestro de preguntas', bankUrl: 'https://docs.google.com/spreadsheets/d/1DTr0mw4bfpTSMrHtQYNIUUV4-XjsedSTmqNlZZWmIvE/edit?usp=drivesdk' },
  { id: 'brailux', name: 'Brailux', bankName: null, bankUrl: null },
  { id: 'sudolux', name: 'Sudolux', bankName: null, bankUrl: null },
  { id: 'motiva', name: 'Motiva', bankName: 'Banco maestro de frases - App', bankUrl: 'https://docs.google.com/spreadsheets/d/1d8lQ7yTGI09NjGwDJSadJr81Y6eT13c2uNadFPT5Ls8/edit?usp=drivesdk' },
  { id: 'mimomento', name: 'Mi Momento', bankName: 'Banco Maestro de Devocionales - Mi Momento', bankUrl: 'https://docs.google.com/spreadsheets/d/1PFzCyZkDC4LvGH-ad5jRXZHj7uxdpSHqiog_QeDCqGc/edit?usp=drivesdk' },
  { id: 'englishfast', name: 'English Fast', bankName: 'English Fast - Banco Maestro v1', bankUrl: 'https://docs.google.com/spreadsheets/d/1G4u-mSHN1TNbqCRNqF3CZmHBnOCFctlKsOjHsFuvKrk/edit?usp=drivesdk' },
  { id: 'crucilux', name: 'Crucilux', bankName: 'Banco maestro de crucigrama v1.22 - Estructura final para Crucilux', bankUrl: 'https://docs.google.com/spreadsheets/d/1G-0H0pyRd5cank74Tuw12TTTsykjM0A1Hoo6xo5N2wU/edit?usp=drivesdk' }
];

const banksFolderUrl = 'https://drive.google.com/drive/folders/14qy2_kcHHFRFGon42cm12U725s8eSBmv';
const appsOverview = document.querySelector('#appsOverview');
const overallProgressValue = document.querySelector('#overallProgressValue');
const overallProgressBar = document.querySelector('#overallProgressBar');
const overallProgressTrack = document.querySelector('#overallProgressTrack');
const overallDetail = document.querySelector('#overallDetail');
const driveBankName = document.querySelector('#driveBankName');
const driveBankNote = document.querySelector('#driveBankNote');
const driveBankLink = document.querySelector('#driveBankLink');

function projectStats(projectId) {
  const state = readState(projectId);
  const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);
  let completed = 0;
  phases.forEach((phase, phaseIndex) => {
    phase.items.forEach((_, itemIndex) => {
      if (state[itemId(phaseIndex, itemIndex)]) completed += 1;
    });
  });
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

function renderOverview() {
  appsOverview.innerHTML = '';
  let ecosystemCompleted = 0;
  let ecosystemTotal = 0;

  neuronovaProjects.forEach(project => {
    const stats = projectStats(project.id);
    ecosystemCompleted += stats.completed;
    ecosystemTotal += stats.total;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `app-progress-card${projectSelect.value === project.id ? ' selected' : ''}`;
    button.setAttribute('aria-label', `Ver seguimiento de ${project.name}, ${stats.percent}% completado`);
    button.innerHTML = `
      <span class="app-progress-head"><strong>${project.name}</strong><b>${stats.percent}%</b></span>
      <span class="mini-progress"><i style="width:${stats.percent}%"></i></span>
      <small>${stats.completed} de ${stats.total} hitos</small>
    `;
    button.addEventListener('click', () => {
      projectSelect.value = project.id;
      projectSelect.dispatchEvent(new Event('change'));
      document.querySelector('.project-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    appsOverview.append(button);
  });

  const overallPercent = ecosystemTotal ? Math.round((ecosystemCompleted / ecosystemTotal) * 100) : 0;
  overallProgressValue.textContent = `${overallPercent}%`;
  overallProgressBar.style.width = `${overallPercent}%`;
  overallProgressTrack.setAttribute('aria-valuenow', String(overallPercent));
  overallDetail.textContent = `${ecosystemCompleted} de ${ecosystemTotal} hitos completados entre todas las aplicaciones.`;

  renderDriveLink();
}

function renderDriveLink() {
  const project = neuronovaProjects.find(item => item.id === projectSelect.value);
  if (!project) return;

  if (project.bankUrl) {
    driveBankName.textContent = project.bankName;
    driveBankNote.textContent = 'Acceso directo al banco maestro identificado para esta aplicación.';
    driveBankLink.href = project.bankUrl;
    driveBankLink.textContent = 'Abrir banco maestro';
    driveBankLink.removeAttribute('aria-disabled');
    driveBankLink.classList.remove('disabled');
  } else {
    driveBankName.textContent = 'Banco específico aún no vinculado';
    driveBankNote.textContent = 'No se encontró un banco maestro identificado con el nombre de esta aplicación. Se mantiene acceso a la carpeta general de bancos.';
    driveBankLink.href = banksFolderUrl;
    driveBankLink.textContent = 'Abrir carpeta bancos';
    driveBankLink.removeAttribute('aria-disabled');
    driveBankLink.classList.remove('disabled');
  }
}

projectSelect.addEventListener('change', () => {
  requestAnimationFrame(renderOverview);
});

document.addEventListener('change', event => {
  if (event.target.matches('.check-item input[type="checkbox"]')) {
    requestAnimationFrame(renderOverview);
  }
});

resetButton.addEventListener('click', () => {
  requestAnimationFrame(renderOverview);
});

renderOverview();
