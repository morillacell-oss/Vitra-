(() => {
  const closeOverlay = () => document.querySelector('.vitraCompleteOverlay')?.remove();

  function completeProject() {
    if (document.querySelector('.vitraCompleteOverlay')) return;
    const name = document.querySelector('.wizardProjectName strong')?.textContent?.trim() || 'Seu projeto';
    const overlay = document.createElement('div');
    overlay.className = 'vitraCompleteOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Projeto finalizado');
    overlay.innerHTML = `
      <section class="vitraCompleteCard">
        <div class="vitraCompleteMark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>
        </div>
        <span class="vitraCompleteEyebrow">PROJETO FINALIZADO</span>
        <h2>${name.replace(/[<>&"']/g, '')} está pronto.</h2>
        <p>O projeto foi marcado como pronto e salvo neste navegador. Agora você pode voltar ao painel, revisar novamente ou seguir para o motor de publicação quando ele estiver conectado.</p>
        <div class="vitraCompleteMeta"><span>STATUS • PRONTO</span><span>SALVO LOCALMENTE</span><span>VITRA STUDIO</span></div>
        <div class="vitraCompleteActions">
          <button class="vitraCompleteSecondary" data-vitra-edit>Continuar editando</button>
          <button class="vitraCompletePrimary" data-vitra-dashboard>Voltar ao painel</button>
        </div>
      </section>`;
    document.body.appendChild(overlay);
    overlay.querySelector('[data-vitra-edit]')?.addEventListener('click', closeOverlay);
    overlay.querySelector('[data-vitra-dashboard]')?.addEventListener('click', () => {
      closeOverlay();
      const brand = document.querySelector('.wizardBrand');
      if (brand instanceof HTMLElement) brand.click();
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeOverlay();
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest('.nextStep.finish');
    if (!button) return;
    window.setTimeout(completeProject, 90);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOverlay();
  });
})();
