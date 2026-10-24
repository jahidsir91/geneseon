/* ==========================================================================
   GENESEON ACADEMY - TOAST NOTIFICATION SERVICE
   ========================================================================== */

import { icons } from './helpers.js';

export const Toast = {
  show(message, type = 'success', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = icons.check;
    if (type === 'error') iconSvg = icons.close;
    if (type === 'warning') iconSvg = icons.flame;
    if (type === 'info') iconSvg = icons.sparkles;

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg, duration) { this.show(msg, 'success', duration); },
  error(msg, duration) { this.show(msg, 'error', duration); },
  info(msg, duration) { this.show(msg, 'info', duration); },
  warning(msg, duration) { this.show(msg, 'warning', duration); }
};
