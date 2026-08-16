(() => {
  const roadmapElement = document.querySelector('#roadmap');
  if (!roadmapElement) return;

  let enhancing = false;

  function enhancePhaseControls() {
    if (enhancing) return;
    enhancing = true;

    const phases = currentPhases();
    const state = readState(projectSelect.value);

    roadmapElement.querySelectorAll('.phase').forEach((details, phaseIndex) => {
      const summary = details.querySelector(':scope > summary');
      if (!summary || !phases[phaseIndex]) return;

      let control = summary.querySelector('.phase-select-all');
      if (!control) {
        control = document.createElement('label');
        control.className = 'phase-select-all';
        control.title = 'Marcar o desmarcar todos los hitos de esta fase';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('aria-label', `Marcar toda la fase ${phases[phaseIndex].title}`);

        const text = document.createElement('span');
        text.textContent = 'Marcar todos';

        control.append(checkbox, text);
        const status = summary.querySelector('.phase-status');
        summary.insertBefore(control, status || null);

        control.addEventListener('click', event => event.stopPropagation());
        checkbox.addEventListener('click', event => event.stopPropagation());
        checkbox.addEventListener('change', () => {
          const freshState = readState(projectSelect.value);
          phases[phaseIndex].items.forEach((_, itemIndex) => {
            freshState[itemId(phaseIndex, itemIndex)] = checkbox.checked;
          });
          writeState(projectSelect.value, freshState);
          render();
          document.dispatchEvent(new CustomEvent('tracker-updated'));
        });
      }

      const checkbox = control.querySelector('input');
      const ids = phases[phaseIndex].items.map((_, itemIndex) => itemId(phaseIndex, itemIndex));
      const completed = ids.filter(id => state[id]).length;
      checkbox.checked = completed === ids.length && ids.length > 0;
      checkbox.indeterminate = completed > 0 && completed < ids.length;
      control.querySelector('span').textContent = checkbox.checked ? 'Fase completa' : 'Marcar todos';
    });

    enhancing = false;
  }

  const observer = new MutationObserver(() => requestAnimationFrame(enhancePhaseControls));
  observer.observe(roadmapElement, { childList: true, subtree: true });

  document.addEventListener('tracker-updated', () => requestAnimationFrame(enhancePhaseControls));
  projectSelect.addEventListener('change', () => requestAnimationFrame(enhancePhaseControls));
  appModeButton?.addEventListener('click', () => requestAnimationFrame(enhancePhaseControls));
  webModeButton?.addEventListener('click', () => requestAnimationFrame(enhancePhaseControls));

  enhancePhaseControls();
})();
