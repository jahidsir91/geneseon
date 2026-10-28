/* ==========================================================================
   GENESEON ACADEMY - MASTER APPLICATION ROUTER & LAYOUT CONTROLLER
   ========================================================================== */

import { Auth } from './auth.js';
import { db } from './db.js';
import { ExamService } from './services/examService.js';
import { i18n } from './i18n.js';
import { icons } from './utils/helpers.js';
import { Toast } from './utils/toast.js';
import { Modal } from './utils/modal.js';
import { LandingView } from './views/landingView.js';
import { CoursesView } from './views/coursesView.js';
import { LearnView } from './views/learnView.js';
import { ExamView } from './views/examView.js';
import { QuestionBankView } from './views/questionBankView.js';
import { AiView } from './views/aiView.js';
import { StoreView } from './views/storeView.js';
import { DashboardView } from './views/dashboardView.js';
import { MyCoursesView, MyExamsView, ProfileView, NotificationsView } from './views/studentViews.js';
import { AdminView } from './views/adminView.js';
import { AuthView } from './views/authView.js';

// Expose key modules to window for inline HTML onclick attributes
window.Auth = Auth;
window.db = db;
window.i18n = i18n;
window.icons = icons;
window.Toast = Toast;
window.Modal = Modal;

export class App {
  constructor() {
    this.headerEl = document.getElementById('main-header');
    this.contentEl = document.getElementById('main-content');
    this.branding = { siteName: 'Geneseon Academy', logoUrl: null };
    this.deferredInstallPrompt = null;
    this.installPopupShown = false;
    this.isPwaInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    
    this.init();
  }

  async init() {
    this.setupAppInstallation();
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('authChanged', () => {
      this.renderHeader();
      this.handleRoute();
    });
    window.addEventListener('langChanged', () => {
      this.renderHeader();
      this.handleRoute();
    });
    window.addEventListener('cartUpdated', () => {
      this.renderHeader();
    });
    window.addEventListener('notificationsChanged', () => {
      this.renderHeader();
    });
    window.addEventListener('contentChanged', () => {
      void this.handleRoute();
    });

    const brandingPromise = this.loadBranding();
    const [, activeExam] = await Promise.all([
      Auth.ready,
      ExamService.restoreCurrentSession()
    ]);
    if (activeExam && !Auth.isAdmin()) {
      window.location.hash = `#/exam/${encodeURIComponent(activeExam.examId)}`;
    }
    void brandingPromise;
    this.renderHeader();
    this.handleRoute();
  }

  setupAppInstallation() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredInstallPrompt = event;
      this.renderHeader();
    });
    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.isPwaInstalled = true;
      this.renderHeader();
    });
    document.addEventListener('click', (event) => {
      const installButton = event.target.closest('.pwa-install-action');
      if (!installButton) return;
      Modal.close();
      if (!this.deferredInstallPrompt) {
        this.showAppInstallationInstructions();
        return;
      }

      const installPrompt = this.deferredInstallPrompt;
      this.deferredInstallPrompt = null;
      void installPrompt.prompt().then(() => installPrompt.userChoice).then((choice) => {
        if (choice.outcome === 'accepted') this.isPwaInstalled = true;
        this.renderHeader();
      }).catch((error) => {
        console.error('App installation prompt failed:', error);
        this.renderHeader();
      });
    });
  }

  maybeShowInstallPopup(path) {
    if (
      this.installPopupShown ||
      this.isPwaInstalled ||
      !['#/', ''].includes(path) ||
      document.getElementById('current-modal-backdrop')
    ) return;
    this.installPopupShown = true;
    window.setTimeout(() => {
      if (this.isPwaInstalled || !['#/', ''].includes(window.location.hash || '#/')) return;
      const language = i18n.getLang();
      Modal.open({
        title: language === 'bn' ? 'Geneseon Academy অ্যাপ ইনস্টল করুন' : 'Install the Geneseon Academy app',
        content: `<div class="pwa-install-prompt">
          <img src="/images/pwa-icon-192.png" alt="" width="72" height="72">
          <p>${language === 'bn'
            ? 'এক ট্যাপেই কোর্স, পরীক্ষা ও প্রশ্নব্যাংক ব্যবহার করতে অ্যাপটি আপনার ডিভাইসে ইনস্টল করুন।'
            : 'Install the app on your device for one-tap access to courses, exams, and the question bank.'}</p>
        </div>`,
        footer: `<button class="btn btn-secondary" type="button" onclick="window.Modal.close()">${language === 'bn' ? 'এখন নয়' : 'Not now'}</button>
          <button class="btn btn-primary pwa-install-action" type="button">${language === 'bn' ? 'ইনস্টল করুন' : 'Install app'}</button>`,
        maxWidth: '440px'
      });
    }, 500);
  }

  showAppInstallationInstructions() {
    const language = i18n.getLang();
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const title = language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install the app';
    const instructions = isIos
      ? language === 'bn'
        ? 'Safari-তে Share বাটনে চাপুন, তারপর “Add to Home Screen” নির্বাচন করুন।'
        : 'In Safari, tap Share, then choose “Add to Home Screen”.'
      : language === 'bn'
        ? 'ব্রাউজারের মেনু খুলে “Install app” অথবা “Add to Home screen” নির্বাচন করুন।'
        : 'Open your browser menu and choose “Install app” or “Add to Home screen”.';
    Modal.open({
      title,
      content: `<p>${instructions}</p>`
    });
  }

  async loadBranding() {
    try {
      const response = await fetch('/api/branding', { credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'ব্র্যান্ডিং লোড করা যায়নি।');
      this.branding = {
        siteName: result.siteName || 'Geneseon Academy',
        logoUrl: result.logoUrl || null
      };
      document.title = `${this.branding.siteName} - SSC, HSC & Job Preparation Platform`;
      this.renderHeader();
      return true;
    } catch (error) {
      console.error('Branding load failed:', error);
      return false;
    }
  }

  getCartCount() {
    try {
      const c = JSON.parse(localStorage.getItem('ja_cart') || '[]');
      return c.reduce((sum, i) => sum + (i.quantity || 1), 0);
    } catch (e) {
      return 0;
    }
  }

  renderHeader() {
    this.headerEl = this.headerEl || document.getElementById('main-header');
    if (!this.headerEl) return;
    const user = Auth.getUser();
    const currentHash = window.location.hash || '#/';
    const homeRoute = user
      ? (user.role === 'ADMIN' ? '#/admin' : '#/dashboard')
      : '#/';
    const cartCount = this.getCartCount();
    const notifs = user ? db.getNotifications(user.id).filter(n => !n.isRead) : [];

    // Hide main header on exam runner or admin to keep them distraction-free
    if (currentHash.startsWith('#/exam/') && !currentHash.includes('result') && currentHash !== '#/exam') {
      this.headerEl.style.display = 'none';
      return;
    }
    if (currentHash.startsWith('#/admin')) {
      this.headerEl.style.display = 'none';
      return;
    }
    this.headerEl.style.display = 'flex';

    this.headerEl.innerHTML = `
      <div class="container navbar-inner">
        <!-- Logo -->
        <a href="${homeRoute}" class="brand-logo">
          ${this.branding.logoUrl
            ? `<img class="brand-logo-image" src="${this.branding.logoUrl}" alt="">`
            : icons.logo}
          <span>${this.branding.siteName}</span>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links" id="site-navigation">
          <li><a href="${homeRoute}" class="nav-link ${currentHash === homeRoute ? 'active' : ''}">${i18n.t('home')}</a></li>
          <li><a href="#/courses" class="nav-link ${currentHash.startsWith('#/courses') || currentHash.startsWith('#/course') ? 'active' : ''}">${i18n.t('courses')}</a></li>
          <li><a href="#/store" class="nav-link ${currentHash.startsWith('#/store') ? 'active' : ''}">${i18n.t('store')}</a></li>
          <li><a href="#/exam" class="nav-link ${currentHash.startsWith('#/exam') ? 'active' : ''}">${i18n.t('exam')}</a></li>
          <li><a href="#/question-bank" class="nav-link ${currentHash.startsWith('#/question-bank') ? 'active' : ''}">${i18n.t('questionBank')}</a></li>
          <li><a href="#/ai" class="nav-link ${currentHash.startsWith('#/ai') ? 'active' : ''}" style="font-weight: 700;">${i18n.t('aiAssistant')}</a></li>
          ${!user ? `
            <li class="mobile-auth-link"><a href="#/login" class="nav-link">${i18n.t('login')}</a></li>
            <li class="mobile-auth-link"><a href="#/register" class="nav-link">${i18n.t('signUp')}</a></li>
          ` : ''}
        </ul>

        <!-- Right Side Header Actions -->
        <div class="header-actions">
          <button class="mobile-menu-toggle" type="button" aria-label="মেনু খুলুন" aria-expanded="false" aria-controls="site-navigation" onclick="const menu = document.getElementById('site-navigation'); const isOpen = menu.classList.toggle('open'); this.setAttribute('aria-expanded', String(isOpen)); this.setAttribute('aria-label', isOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');">
            <span></span><span></span><span></span>
          </button>

          <!-- Language Toggle Button -->
          <button class="btn btn-ghost btn-sm" onclick="i18n.toggleLang()" title="Switch Language" style="font-weight: 700; border: 1px solid var(--border-color); border-radius: var(--radius-full); padding: 0.35rem 0.65rem;">
            🌐 ${i18n.getLang() === 'bn' ? 'EN' : 'বাংলা'}
          </button>

          <!-- Cart Button -->
          <a href="#/cart" class="header-icon-btn" title="Cart">
            ${icons.shoppingCart}
            ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ''}
          </a>

          <!-- Notification Bell -->
          ${user ? `
            <a href="#/notifications" class="header-icon-btn" title="Notifications">
              ${icons.bell}
              ${notifs.length > 0 ? `<span class="badge-count">${notifs.length}</span>` : ''}
            </a>
          ` : ''}

          <!-- User Menu or Auth Buttons -->
          ${user ? `
            <div style="position: relative; display: inline-block;">
              <button class="btn btn-secondary btn-sm" onclick="document.getElementById('user-dropdown').classList.toggle('open')" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.75rem; border-radius: var(--radius-full);">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50'}" style="width: 26px; height: 26px; border-radius: 50%;">
                <span style="font-weight: 600; font-size: 0.85rem; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name.split(' ')[0]}</span>
              </button>

              <div id="user-dropdown" style="position: absolute; right: 0; top: 120%; width: 150px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: 0.5rem 0; display: none; z-index: 200;">
                <a href="javascript:void(0)" onclick="Auth.logout()" class="dropdown-item" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; font-size: 0.875rem; color: var(--danger);">${icons.logOut} লগআউট</a>
              </div>
            </div>
          ` : `
            <a href="#/login" class="btn btn-secondary btn-sm">${i18n.t('login')}</a>
            <a href="#/register" class="btn btn-primary btn-sm">${i18n.t('signUp')}</a>
          `}
        </div>
      </div>
    `;

    // Dropdown toggle close listener
    document.addEventListener('click', (e) => {
      const drop = document.getElementById('user-dropdown');
      if (drop && !e.target.closest('#user-dropdown') && !e.target.closest('.header-actions')) {
        drop.classList.remove('open');
        drop.style.display = 'none';
      } else if (drop && drop.classList.contains('open')) {
        drop.style.display = 'block';
      }
    });
  }

  async handleRoute() {
    try {
      this.contentEl = this.contentEl || document.getElementById('main-content');
      if (!this.contentEl) return;

      const rawHash = window.location.hash || '#/';
      const [path, queryString] = rawHash.split('?');
      const params = new URLSearchParams(queryString || '');
      const activeExam = ExamService.getCurrentSession();
      if (activeExam && !Auth.isAdmin() && path !== `#/exam/${encodeURIComponent(activeExam.examId)}`) {
        void ExamView.submitAutomatically('অন্য পেজে যাওয়ার চেষ্টা করায়');
        return;
      }

      const studentRoutes = [
        '#/dashboard', '#/my-courses', '#/my-exams', '#/profile',
        '#/notifications', '#/learn/', '#/exam', '#/question-bank',
        '#/ai', '#/checkout'
      ];
      const needsStudentSession = studentRoutes.some(route =>
        route.endsWith('/') ? path.startsWith(route) : path === route || path.startsWith(`${route}/`)
      );
      if (path.startsWith('#/admin') && !Auth.isAdmin()) {
        window.location.hash = Auth.isLoggedIn() ? '#/dashboard' : '#/login';
        return;
      }
      if (needsStudentSession && !Auth.isLoggedIn()) {
        window.location.hash = '#/login';
        return;
      }
      if ((path === '#/' || path === '') && Auth.isLoggedIn()) {
        window.location.hash = Auth.isAdmin() ? '#/admin' : '#/dashboard';
        return;
      }
      const student = Auth.getUser();
      const categoryRoutes = [
        path.startsWith('#/course/') ? { item: db.getCourseById(path.replace('#/course/', '')) } : null,
        path.startsWith('#/learn/course/') ? { item: db.getCourseById(path.replace('#/learn/course/', '')) } : null,
        path.startsWith('#/exam/') && !path.startsWith('#/exam/result/')
          ? { item: db.getExamById(path.replace('#/exam/', '')) } : null,
        path.startsWith('#/exam/result/')
          ? { item: db.getAttemptById(path.replace('#/exam/result/', '')) } : null
      ].filter(Boolean);
      if (student && !Auth.isAdmin() && categoryRoutes.some(({ item }) =>
        item && item.category !== student.educationType
      )) {
        Toast.error('এই কন্টেন্টটি আপনার অ্যাকাউন্টের জন্য উপলভ্য নয়।');
        window.location.hash = '#/dashboard';
        return;
      }
      if ((path === '#/login' || path === '#/register') && Auth.isLoggedIn()) {
        window.location.hash = Auth.isAdmin() ? '#/admin' : '#/dashboard';
        return;
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      this.renderHeader();

      // Route matching
      if (path === '#/' || path === '') {
        this.contentEl.innerHTML = LandingView.render();
      } else if (path === '#/courses') {
        const cat = params.get('category') || 'ALL';
        this.contentEl.innerHTML = CoursesView.renderCatalog(cat);
      } else if (path.startsWith('#/course/')) {
        const id = path.replace('#/course/', '');
        this.contentEl.innerHTML = CoursesView.renderDetail(id);
      } else if (path.startsWith('#/learn/course/')) {
        const id = path.replace('#/learn/course/', '');
        this.contentEl.innerHTML = LearnView.render(id);
      } else if (path === '#/exam') {
        const cat = params.get('category') || 'ALL';
        this.contentEl.innerHTML = ExamView.renderList(cat);
      } else if (path.startsWith('#/exam/result/')) {
        const attemptId = path.replace('#/exam/result/', '');
        this.contentEl.innerHTML = await ExamView.renderResult(attemptId);
      } else if (path.startsWith('#/exam/')) {
        const examId = path.replace('#/exam/', '');
        this.contentEl.innerHTML = ExamView.renderRunner(examId);
      } else if (path === '#/question-bank') {
        this.contentEl.innerHTML = QuestionBankView.renderList();
      } else if (path === '#/question-bank/practice') {
        this.contentEl.innerHTML = QuestionBankView.renderPracticeGenerator();
      } else if (path === '#/ai') {
        const prompt = params.get('prompt') || null;
        this.contentEl.innerHTML = AiView.render(prompt);
      } else if (path === '#/store') {
        const cat = params.get('category') || 'ALL';
        this.contentEl.innerHTML = StoreView.renderStore(cat);
      } else if (path.startsWith('#/store/product/')) {
        const id = path.replace('#/store/product/', '');
        this.contentEl.innerHTML = StoreView.renderProductDetail(id);
      } else if (path === '#/cart') {
        this.contentEl.innerHTML = StoreView.renderCart();
      } else if (path === '#/checkout') {
        this.contentEl.innerHTML = StoreView.renderCheckout();
      } else if (path === '#/dashboard') {
        this.contentEl.innerHTML = DashboardView.render();
      } else if (path === '#/my-courses') {
        this.contentEl.innerHTML = MyCoursesView.render();
      } else if (path === '#/my-exams') {
        this.contentEl.innerHTML = MyExamsView.render();
      } else if (path === '#/profile') {
        this.contentEl.innerHTML = ProfileView.render();
      } else if (path === '#/notifications') {
        this.contentEl.innerHTML = NotificationsView.render();
        void NotificationsView.markSeen();
      } else if (path === '#/login') {
        this.contentEl.innerHTML = AuthView.renderLogin();
      } else if (path === '#/register') {
        this.contentEl.innerHTML = AuthView.renderRegister();
      } else if (path === '#/reset-password') {
        this.contentEl.innerHTML = AuthView.renderResetPassword(params.get('token'));
      } else if (path.startsWith('#/admin')) {
        const sub = path.replace('#/admin/', '').replace('#/admin', '') || 'dashboard';
        await AdminView.loadFromServer();
        this.contentEl.innerHTML = AdminView.render(sub);
      } else {
        this.contentEl.innerHTML = `<div class="container text-center" style="padding: 4rem;"><h2>পেজটি পাওয়া যায়নি (404)</h2><a href="#/" class="btn btn-primary" style="margin-top: 1rem;">হোম পেজে যান</a></div>`;
      }
      this.maybeShowInstallPopup(path);
    } catch (err) {
      console.error('Routing error:', err);
      if (this.contentEl) {
        this.contentEl.innerHTML = `
          <div class="container text-center" style="padding: 3rem;">
            <h2 style="color: var(--danger); margin-bottom: 1rem;">পেজ লোড করতে সমস্যা হয়েছে</h2>
            <p class="text-muted" style="margin-bottom: 1.5rem;">${err.message || 'Unknown error'}</p>
            <a href="#/" class="btn btn-primary" onclick="window.location.reload()">রিলোড করুন</a>
          </div>
        `;
      }
    }
  }
}

// Safe bootstrap function
function bootstrap() {
  try {
    window.appInstance = new App();
  } catch (err) {
    console.error('Fatal initialization error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
