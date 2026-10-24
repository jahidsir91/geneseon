/* ==========================================================================
   GENESEON ACADEMY - MODAL DIALOG SERVICE
   ========================================================================== */

import { icons } from './helpers.js';

export const Modal = {
  open({ title, content, footer = '', onClose = null, maxWidth = '540px' }) {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="current-modal-backdrop">
        <div class="modal-content" style="max-width: ${maxWidth};">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" id="modal-close-btn">${icons.close}</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>
    `;

    const backdrop = document.getElementById('current-modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');

    const handleClose = () => {
      backdrop.classList.remove('active');
      setTimeout(() => {
        modalRoot.innerHTML = '';
        if (typeof onClose === 'function') onClose();
      }, 200);
    };

    closeBtn?.addEventListener('click', handleClose);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });

    return { close: handleClose };
  },

  close() {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
  }
};
