const neuronovaProjects = [
  { id: 'neuronova', name: 'NeuroNova Apps', webOnly: true, bankName: null, bankUrl: null },
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
const overallAppValue = document.querySelector('#overallAppValue');
const overallWebValue = document.querySelector('#overallWebValue');
const overallProgressBar = document.querySelector('#overallProgressBar');
const overallProgressTrack = document.querySelector('#overallProgressTrack');
const overallDetail = document.querySelector('#overallDetail');
const driveBankName = document.querySelector('#driveBankName');
const driveBankNote = document.querySelector('#driveBankNote');
const driveBankLink = document.querySelector('#driveBankLink');

function combinedStats(project) {
  const web = getStats(project.id, 'web');
  if (project.webOnly) {
    return {
      app: { total: 0, completed: 0, percent: null },
      web,
      total: web.total,
      completed: web.completed,
      percent: web.percent
    };
  }

  const app = getStats(project.id, 'app');
  const total = app.total + web.total;
  const completed = app.completed + web.completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { app, web, total, completed, percent };
}

function enforceProjectMode() {
  const project = neuronovaProjects.find(item => item.id === projectSelect.value);
  const isWebOnly = Boolean(project?.webOnly);

  appModeButton.disabled = isWebOnly;
  appModeButton.setAttribute('aria-disabled', String(isWebOnly));
  appModeButton.title = isWebOnly ? 'El repo principal se controla únicamente como proyecto web.' : '';

  if (isWebOnly && trackerMode !== 'web') {
    setMode('web');
  }
}

function renderOverview() {
  appsOverview.innerHTML = '';
  let appCompleted = 0;
  let appTotal = 0;
  let webCompleted = 0;
  let webTotal = 0;

  neuronovaProjects.forEach(project => {
    const stats = combinedStats(project);

    if (!project.webOnly) {
      appCompleted += stats.app.completed;
      appTotal += stats.app.total;
    }
    webCompleted += stats.web.completed;
    webTotal += stats.web.total;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `app-progress-card${projectSelect.value === project.id ? ' selected' : ''}`;

    if (project.webOnly) {
      button.setAttribute('aria-label', `Ver seguimiento de ${project.name}. Proyecto únicamente web, ${stats.web.percent}% completado`);
      button.innerHTML = `
        <span class="app-progress-head"><strong>${project.name}</strong><b>${stats.web.percent}%</b></span>
        <span class="mini-progress"><i style="width:${stats.web.percent}%"></i></span>
        <span class="split-stats"><small>Web <b>${stats.web.percent}%</b></small><small>Solo web</small></span>
      `;
    } else {
      button.setAttribute('aria-label', `Ver seguimiento de ${project.name}. App ${stats.app.percent}%, web ${stats.web.percent}%, combinado ${stats.percent}%`);
      button.innerHTML = `
        <span class="app-progress-head"><strong>${project.name}</strong><b>${stats.percent}%</b></span>
        <span class="mini-progress"><i style="width:${stats.percent}%"></i></span>
        <span class="split-stats"><small>App <b>${stats.app.percent}%</b></small><small>Web <b>${stats.web.percent}%</b></small></span>
      `;
    }

    button.addEventListener('click', () => {
      projectSelect.value = project.id;
      projectSelect.dispatchEvent(new Event('change'));
      document.querySelector('.project-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    appsOverview.append(button);
  });

  const combinedCompleted = appCompleted + webCompleted;
  const combinedTotal = appTotal + webTotal;
  const overallPercent = combinedTotal ? Math.round((combinedCompleted / combinedTotal) * 100) : 0;
  const appPercent = appTotal ? Math.round((appCompleted / appTotal) * 100) : 0;
  const webPercent = webTotal ? Math.round((webCompleted / webTotal) * 100) : 0;

  overallProgressValue.textContent = `${overallPercent}%`;
  overallAppValue.textContent = `${appPercent}%`;
  overallWebValue.textContent = `${webPercent}%`;
  overallProgressBar.style.width = `${overallPercent}%`;
  overallProgressTrack.setAttribute('aria-valuenow', String(overallPercent));
  overallDetail.textContent = `${combinedCompleted} de ${combinedTotal} hitos completados. El repo principal aporta únicamente a la ruta web.`;

  enforceProjectMode();
  renderDriveLink();
}

function renderDriveLink() {
  const project = neuronovaProjects.find(item => item.id === projectSelect.value);
  if (!project) return;

  if (project.webOnly) {
    driveBankName.textContent = 'No aplica al repo principal';
    driveBankNote.textContent = 'NeuroNova Apps se registra aquí únicamente como web matriz, por lo que no requiere un banco maestro propio.';
    driveBankLink.href = banksFolderUrl;
    driveBankLink.textContent = 'Abrir carpeta general de bancos';
    return;
  }

  if (project.bankUrl) {
    driveBankName.textContent = project.bankName;
    driveBankNote.textContent = 'Acceso directo al banco maestro identificado para esta aplicación.';
    driveBankLink.href = project.bankUrl;
    driveBankLink.textContent = 'Abrir banco maestro';
  } else {
    driveBankName.textContent = 'Banco específico aún no vinculado';
    driveBankNote.textContent = 'No se encontró un banco maestro identificado con el nombre de esta aplicación. Se mantiene acceso a la carpeta general de bancos.';
    driveBankLink.href = banksFolderUrl;
    driveBankLink.textContent = 'Abrir carpeta bancos';
  }
}

projectSelect.addEventListener('change', () => {
  enforceProjectMode();
  requestAnimationFrame(renderOverview);
});

document.addEventListener('tracker-updated', () => requestAnimationFrame(renderOverview));

enforceProjectMode();
renderOverview();
