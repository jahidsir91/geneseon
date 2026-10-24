/* ==========================================================================
   GENESEON ACADEMY - STANDALONE UNIVERSAL BUNDLE (FILE & HTTP COMPATIBLE)
   ========================================================================== */
(function() {
'use strict';


/* --- [js/utils/helpers.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - HELPER UTILITIES & SVG ICONS
   ========================================================================== */
const icons = window.icons = {
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  graduation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-.61-.22-1.18-.59-1.61L12 11.77l-.91 1.12c-.37.43-.59 1-.59 1.61z"/><path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 3-5 4-8z"/><path d="M17.66 11c-.48-2.67-2.16-4.9-3.66-6.5C12 7 10 9 10 12a6 6 0 0 0 12 0c0-.34-.03-.67-.08-1h-4.26z"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a14.8 14.8 0 0 1-3.1 3.9"/><path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.7 10.7 0 0 0 4.2-.9"/></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  shoppingCart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  logOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  helpCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
};

/**
 * Format currency in Bangladeshi Taka (৳)
 */
window.formatBDT = function formatBDT(amount) {
  if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
  return `৳${amount.toLocaleString('en-IN')}`;
}

/**
 * Generate unique ID
 */
window.uid = function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Trigger confetti celebration
 */
window.launchConfetti = function launchConfetti() {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}


/* --- [js/utils/toast.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - TOAST NOTIFICATION SERVICE
   ========================================================================== */
const Toast = window.Toast = {
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


/* --- [js/utils/modal.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - MODAL DIALOG SERVICE
   ========================================================================== */
const Modal = window.Modal = {
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


/* --- [js/i18n.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - INTERNATIONALIZATION (i18n) - BANGLA & ENGLISH
   ========================================================================== */

const translations = {
  bn: {
    // Navigation
    home: 'হোম',
    courses: 'কোর্সসমূহ',
    store: 'বই ও স্টোর',
    exam: 'পরীক্ষা',
    questionBank: 'প্রশ্নব্যাংক',
    aiAssistant: 'এআই সহকারী',
    login: 'লগইন',
    signUp: 'রেজিস্ট্রেশন',
    dashboard: 'ড্যাশবোর্ড',
    myCourses: 'আমার কোর্স',
    myExams: 'আমার পরীক্ষা',
    profile: 'প্রোফাইল',
    notifications: 'নোটিফিকেশন',
    adminPanel: 'অ্যাডমিন প্যানেল',
    logout: 'লগআউট',
    
    // Categories
    ssc: 'এসএসসি (SSC)',
    hsc: 'এইচএসসি (HSC)',
    job: 'চাকরি প্রস্তুতি (Job Prep)',
    sscDesc: 'ক্লাস ৯-১০ ও এসএসসি ২০২৬/২০২৭ ব্যাচ স্পেশাল প্রস্তুতি',
    hscDesc: 'এইচএসসি ২০২৫/২০২৬ ও বিশ্ববিদ্যালয় ভর্তি সহায়ক কোর্স',
    jobDesc: 'বিসিএস (BCS), প্রাথমিক শিক্ষক নিয়োগ ও ব্যাংক জব প্রস্তুতি',

    // Hero
    heroTitle: 'বাংলাদেশের সেরা স্মার্ট প্রস্তুতি প্ল্যাটফর্ম',
    heroSubtitle: 'এসএসসি, এইচএসসি ও চাকরি প্রস্তুতি — কোর্স, লাইভ এক্সাম, প্রশ্নব্যাংক ও এআই টিউটর এক প্ল্যাটফর্মে।',
    exploreCourses: 'কোর্স এক্সপ্লোর করুন',
    startLearning: 'শুরু করুন এখনই',
    
    // Quick Stats
    activeStudents: '১,২০,০০০+ শিক্ষার্থী',
    totalCoursesCount: '৫০+ প্রিমিয়াম কোর্স',
    totalQuestionsCount: '৭৫,০০০+ প্রশ্নব্যাংক',
    successRate: '৯৮% পাসের হার',

    // Dashboard
    goodMorning: 'শুভ সকাল',
    goodAfternoon: 'শুভ দুপুর',
    goodEvening: 'শুভ সন্ধ্যা',
    continueLearning: 'শেখা চালিয়ে যান',
    studyStreak: 'পড়াশোনার ধারাবাহিকতা',
    todaysTasks: 'আজকের পড়ার রুটিন',
    recommendedForYou: 'আপনার জন্য প্রস্তাবিত',
    testsTaken: 'অংশগ্রহণকৃত পরীক্ষা',
    avgScore: 'গড় স্কোর',
    accuracy: 'সঠিকতার হার',

    // Store & Cart
    addToCart: 'কার্টে যোগ করুন',
    buyNow: 'এখনই কিনুন',
    cart: 'শপিং কার্ট',
    checkout: 'অর্ডার সম্পন্ন করুন',
    proceedToCheckout: 'পেমেন্ট করুন',
    couponCode: 'কুপন কোড',
    applyCoupon: 'কুপন ব্যবহার করুন',
    totalAmount: 'সর্বমোট টাকা',
    
    // Exam
    startExam: 'পরীক্ষা শুরু করুন',
    submitExam: 'পরীক্ষা জমা দিন',
    timeRemaining: 'বাকি সময়',
    nextQuestion: 'পরবর্তী প্রশ্ন',
    prevQuestion: 'পূর্ববর্তী প্রশ্ন',
    markForReview: 'পরে পর্যালোচনার জন্য রাখুন',
    examResult: 'পরীক্ষার ফলাফল ও ডায়াগনস্টিক',
    yourScore: 'আপনার প্রাপ্ত নম্বর',
    meritRank: 'মেধা তালিকা স্থান',
    accuracyRate: 'নির্ভুলতা',
    explanation: 'সঠিক উত্তরের ব্যাখ্যা',

    // AI
    askAi: 'পড়াশোনা বিষয়ক যেকোনো প্রশ্ন করুন...',
    explainTopic: 'বিষয়টি বুঝিয়ে দাও',
    solveQuestion: 'প্রশ্নটি সমাধান করো',
    generateMCQ: 'এমসিকিউ তৈরি করো',
    makeStudyPlan: 'পড়ার রুটিন দাও',
    analyzeResult: 'আমার ফলাফল অ্যানালাইসিস করো',
    giveQuiz: 'কুইজ পরীক্ষা নাও'
  },
  en: {
    // Navigation
    home: 'Home',
    courses: 'Courses',
    store: 'Store',
    exam: 'Exams',
    questionBank: 'Question Bank',
    aiAssistant: 'AI Assistant',
    login: 'Login',
    signUp: 'Sign Up',
    dashboard: 'Dashboard',
    myCourses: 'My Courses',
    myExams: 'My Exams',
    profile: 'Profile',
    notifications: 'Notifications',
    adminPanel: 'Admin Panel',
    logout: 'Logout',

    // Categories
    ssc: 'SSC Student',
    hsc: 'HSC Student',
    job: 'Job Seeker',
    sscDesc: 'Class 9-10 & SSC 2026/2027 batch dedicated preparation',
    hscDesc: 'HSC 2025/2026 & University admission preparation',
    jobDesc: 'BCS Preliminary, Primary Teacher & Bank Job preparation',

    // Hero
    heroTitle: 'Your Complete Preparation Platform',
    heroSubtitle: 'SSC, HSC & Job Preparation — Courses, Exams, Question Bank and AI Assistance in one place.',
    exploreCourses: 'Explore Courses',
    startLearning: 'Start Learning',

    // Quick Stats
    activeStudents: '120,000+ Students',
    totalCoursesCount: '50+ Premium Courses',
    totalQuestionsCount: '75,000+ Questions',
    successRate: '98% Success Rate',

    // Dashboard
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    continueLearning: 'Continue Learning',
    studyStreak: 'Study Streak',
    todaysTasks: "Today's Study Tasks",
    recommendedForYou: 'Recommended For You',
    testsTaken: 'Exams Taken',
    avgScore: 'Average Score',
    accuracy: 'Accuracy',

    // Store & Cart
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    cart: 'Cart',
    checkout: 'Checkout',
    proceedToCheckout: 'Proceed to Checkout',
    couponCode: 'Coupon Code',
    applyCoupon: 'Apply',
    totalAmount: 'Total Amount',

    // Exam
    startExam: 'Start Exam',
    submitExam: 'Submit Exam',
    timeRemaining: 'Time Left',
    nextQuestion: 'Next',
    prevQuestion: 'Previous',
    markForReview: 'Mark for Review',
    examResult: 'Exam Result & Analysis',
    yourScore: 'Your Score',
    meritRank: 'Merit Rank',
    accuracyRate: 'Accuracy',
    explanation: 'Answer Explanation',

    // AI
    askAi: 'Ask anything about your studies...',
    explainTopic: 'Explain Topic',
    solveQuestion: 'Solve Question',
    generateMCQ: 'Create MCQ',
    makeStudyPlan: 'Make Study Plan',
    analyzeResult: 'Analyze My Result',
    giveQuiz: 'Give Me a Quiz'
  }
};

let currentLang = localStorage.getItem('ja_lang') || 'bn';
const i18n = window.i18n = {
  getLang() {
    return currentLang;
  },
  setLang(lang) {
    if (lang === 'bn' || lang === 'en') {
      currentLang = lang;
      localStorage.setItem('ja_lang', lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
    }
  },
  toggleLang() {
    this.setLang(currentLang === 'bn' ? 'en' : 'bn');
  },
  t(key) {
    return translations[currentLang]?.[key] || translations['bn']?.[key] || key;
  }
};


/* --- [js/db.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - RELATIONAL IN-MEMORY + LOCALSTORAGE DATABASE
   ========================================================================== */

const STORAGE_KEY = 'ja_academy_db_v1';

// Initial Mock Seed Data
const initialDB = {
  users: [
    {
      id: 'usr_admin',
      name: 'Super Admin',
      email: 'admin@jaacademy.com',
      mobile: '01711000001',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      educationType: null,
      batchOrTarget: 'Admin Portal',
      status: 'active',
      joinedAt: '2025-01-01'
    },
    {
      id: 'usr_ssc',
      name: 'তানভীর আহমেদ (Tanvir)',
      email: 'tanvir.ssc@jaacademy.com',
      mobile: '01811223344',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      educationType: 'SSC',
      batchOrTarget: 'SSC 2026 Batch',
      status: 'active',
      streak: 12,
      joinedAt: '2025-06-15',
      enrolledCourses: ['crs_ssc_phy_math'],
      completedLessons: ['les_ssc_01', 'les_ssc_02'],
      unlockedProducts: ['prod_ssc_pdf']
    },
    {
      id: 'usr_hsc',
      name: 'নুসরাত জাহান (Nusrat)',
      email: 'nusrat.hsc@jaacademy.com',
      mobile: '01911334455',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      educationType: 'HSC',
      batchOrTarget: 'HSC 2025 Science Batch',
      status: 'active',
      streak: 8,
      joinedAt: '2025-07-20',
      enrolledCourses: ['crs_hsc_science'],
      completedLessons: ['les_hsc_01'],
      unlockedProducts: []
    },
    {
      id: 'usr_job',
      name: 'আব্দুল হান্নান (Hannan)',
      email: 'hannan.bcs@jaacademy.com',
      mobile: '01711445566',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      educationType: 'JOB',
      batchOrTarget: '47th BCS & Primary Teacher',
      status: 'active',
      streak: 21,
      joinedAt: '2025-04-10',
      enrolledCourses: ['crs_bcs_preli'],
      completedLessons: ['les_bcs_01', 'les_bcs_02', 'les_bcs_03'],
      unlockedProducts: ['prod_bcs_pdf']
    }
  ],

  courses: [
    {
      id: 'crs_ssc_phy_math',
      slug: 'ssc-physics-higher-math-2026',
      category: 'SSC',
      title: 'SSC 2026 পদার্থবিজ্ঞান ও উচ্চতর গণিত পূর্ণাঙ্গ প্রস্তুতি',
      titleEn: 'SSC 2026 Physics & Higher Math Complete Masterclass',
      instructor: {
        name: 'ইঞ্জি. মো. রফিকুল ইসলাম (BUET)',
        role: 'সিনিয়র মেন্টর ও লেখক',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 1500,
      originalPrice: 3000,
      discount: 50,
      rating: 4.9,
      studentsCount: 2450,
      totalClasses: 48,
      duration: '75+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'এসএসসি ২০২৬ পরীক্ষার্থীদের জন্য পদার্থবিজ্ঞান ও উচ্চতর গণিতের বেসিক টু অ্যাডভান্সড পূর্ণাঙ্গ কোর্স। রয়েছে অধ্যায়ভিত্তিক লাইভ ক্লাস, রেকর্ডেড লেকচার, মডেল টেস্ট এবং সার্বক্ষণিক এআই ডাউট সলভ সুবিধা।',
      whatYouWillLearn: [
        'পদার্থবিজ্ঞান ১ম ও ২য় পত্রের সকল গাণিতিক সমস্যার শর্টকাট টেকনিক',
        'উচ্চতর গণিতের জ্যামিতি, ত্রিকোণমিতি ও স্থানাঙ্ক জ্যামিতির নিখুঁত দখল',
        'বিগত ১০ বছরের বোর্ড প্রশ্ন ও শীর্ষ স্কুলের টেস্ট পেপার সমাধান',
        'CQ ও MCQ দ্রুত নির্ভুল সমাধানের বিশেষ মেথড'
      ],
      chapters: [
        {
          id: 'chap_ssc_01',
          title: 'অধ্যায় ০১: ভৌত রাশি ও পরিমাপ (Physical Quantities)',
          lessons: [
            { id: 'les_ssc_01', title: 'ক্লাস ০১: ভার্নিয়ার স্কেল ও স্লাইড ক্যালিপার্স', duration: '45 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'ভার্নিয়ার ধ্রুবক VC = s/n সূত্রটির পুঙ্খানুপুঙ্খ ব্যাখ্যা ও টেস্ট পেপারের গুরুত্বপূর্ণ অঙ্ক।' },
            { id: 'les_ssc_02', title: 'ক্লাস ০২: স্ক্রু গজ ও ত্রুটির হিসাব', duration: '50 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', pdfUrl: '#', notes: 'পিচ এবং লঘিষ্ঠ গণন সংক্রান্ত বোর্ডের সকল জটিল প্রশ্ন সমাধান।' }
          ]
        },
        {
          id: 'chap_ssc_02',
          title: 'অধ্যায় ০২: গতি ও বল (Motion & Dynamics)',
          lessons: [
            { id: 'les_ssc_03', title: 'ক্লাস ০১: গতির সমীকরণ ও গ্রাফ এনালাইসিস', duration: '55 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', pdfUrl: '#', notes: 's-t এবং v-t গ্রাফ থেকে ত্বরণ ও অতিক্রান্ত দূরত্ব নির্ণয়ের সহজ উপায়।' },
            { id: 'les_ssc_04', title: 'ক্লাস ০২: নিউটনের গতিসূত্র ও ভরবেগের সংরক্ষণশীলতা', duration: '60 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', pdfUrl: '#', notes: 'বন্দুক ও গুলির পশ্চাৎবেগ এবং সংঘর্ষের গাণিতিক সমস্যা সমাধান।' }
          ]
        }
      ]
    },
    {
      id: 'crs_hsc_science',
      slug: 'hsc-2025-science-physics-chemistry-math',
      category: 'HSC',
      title: 'HSC 2025 সায়েন্স কমপ্লিট বান্ডেল (Physics + Chemistry + Math)',
      titleEn: 'HSC 2025 Complete Science Bundle',
      instructor: {
        name: 'ড. আশরাফুল হক ও টিম (DU, BUET)',
        role: 'এডুকেশন ডিরেক্টর',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 2400,
      originalPrice: 5000,
      discount: 52,
      rating: 4.95,
      studentsCount: 3890,
      totalClasses: 90,
      duration: '140+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'এইচএসসি ২০২৫ ও ইঞ্জিনিয়ারিং/ভার্সিটি ভর্তি পরীক্ষার মজবুত ভিত্তি তৈরির জন্য সেরা কোর্স।',
      whatYouWillLearn: [
        'পদার্থবিজ্ঞান ও উচ্চতর গণিতের ক্যালকুলাস ও ভেক্টর গভীর প্রস্তুতি',
        'জৈব রসায়নের ১০০% বিক্রিয়া মনে রাখার ম্যাজিক চার্ট',
        'প্রতি সপ্তাহে অল বাংলাদেশ লাইভ মডেল টেস্ট'
      ],
      chapters: [
        {
          id: 'chap_hsc_01',
          title: 'অধ্যায় ০১: ভেক্টর ও গতিবিদ্যা (Vectors)',
          lessons: [
            { id: 'les_hsc_01', title: 'লেকচার ০১: ভেক্টর ডট ও ক্রস গুণনের প্রয়োগ', duration: '52 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'নদী-নৌকার সর্বনিম্ন সময়ে ও সর্বনিম্ন দূরত্বে পারাপারের সেরা টেকনিক।' }
          ]
        }
      ]
    },
    {
      id: 'crs_bcs_preli',
      slug: '47th-bcs-preliminary-special-batch',
      category: 'JOB',
      title: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ প্রস্তুতি কোর্স (All 10 Subjects)',
      titleEn: '47th BCS Preliminary Comprehensive Master Course',
      instructor: {
        name: 'নাজমুল হাসান (৩৭তম বিসিএস প্রশাসন ক্যাডার)',
        role: 'বিসিএস মেন্টর ও লেখক',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 2999,
      originalPrice: 6000,
      discount: 50,
      rating: 4.98,
      studentsCount: 5200,
      totalClasses: 120,
      duration: '200+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'বিসিএস প্রিলির ২০০ নম্বরের সুনির্দিষ্ট সিলেবাসভিত্তিক প্রস্তুতি। প্রতিটি টপিকের লেকচার শিট ও সাম্প্রতিক তথ্যাবলী অন্তর্ভুক্ত।',
      whatYouWillLearn: [
        'বাংলা সাহিত্য ও ব্যাকরণের গুরুত্বপূর্ণ ৭০ মার্কসের স্পেশাল প্রস্তুতি',
        'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলীর ১০০% সাম্প্রতিক তথ্যের আপডেট',
        'গাণিতিক যুক্তি ও মানসিক দক্ষতার ৫০ নম্বরে ফুল মার্কস নিশ্চিত করার হ্যাকস'
      ],
      chapters: [
        {
          id: 'chap_bcs_01',
          title: 'অধ্যায় ০১: বাংলা ভাষা ও সাহিত্য (Bangla Literature & Grammar)',
          lessons: [
            { id: 'les_bcs_01', title: 'ক্লাস ০১: প্রাচীন ও মধ্যযুগ (চর্যাপদ ও মঙ্গলকাব্য)', duration: '65 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'চর্যাপদের আবিষ্কার, পদকর্তা ও মধ্যযুগের শ্রীকৃষ্ণকীর্তন কাব্যের পুঙ্খানুপুঙ্খ তথ্য।' },
            { id: 'les_bcs_02', title: 'ক্লাস ০২: আধুনিক যুগ ও পঞ্চপাণ্ডব', duration: '60 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', pdfUrl: '#', notes: 'মাইকেল মধুসূদন দত্ত থেকে শুরু করে রবীন্দ্রনাথ ও নজরুলের সাহিত্যকর্ম।' }
          ]
        },
        {
          id: 'chap_bcs_02',
          title: 'অধ্যায় ০২: গাণিতিক যুক্তি ও শর্টকাট (Math)',
          lessons: [
            { id: 'les_bcs_03', title: 'ক্লাস ০১: শতকরা, লাভ-ক্ষতি ও সুদকষা', duration: '58 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', pdfUrl: '#', notes: '১০ সেকেন্ডে জটিল লাভ-ক্ষতির অংক সমাধান পদ্ধতি।' }
          ]
        }
      ]
    },
    {
      id: 'crs_primary_job',
      slug: 'primary-assistant-teacher-fast-track',
      category: 'JOB',
      title: 'প্রাথমিক সহকারী শিক্ষক নিয়োগ চূড়ান্ত প্রস্তুতি ব্যাচ',
      titleEn: 'Primary Assistant Teacher Fast-Track Batch',
      instructor: {
        name: 'ফারহানা ইসলাম ও প্যানেল',
        role: 'সিনিয়র ফ্যাকাল্টি',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      price: 1200,
      originalPrice: 2500,
      discount: 52,
      rating: 4.85,
      studentsCount: 1980,
      totalClasses: 45,
      duration: '60+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: '৮০ নম্বরের লিখিত পরীক্ষায় ৭৫+ তোলার জন্য স্পেশাল রিভিশন ও প্র্যাকটিস কোর্স।'
    }
  ],

  exams: [
    {
      id: 'ex_ssc_01',
      title: 'SSC 2026 পদার্থবিজ্ঞান বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট - ০১',
      category: 'SSC',
      subject: 'Physics',
      totalQuestions: 15,
      durationMinutes: 15,
      totalMarks: 15,
      negativeMarking: 0.25,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-03-30',
      questionIds: ['q_ssc_01', 'q_ssc_02', 'q_ssc_03', 'q_ssc_04', 'q_ssc_05']
    },
    {
      id: 'ex_hsc_01',
      title: 'HSC 2025 উচ্চতর গণিত ভেক্টর ও ক্যালকুলাস মেগা টেস্ট',
      category: 'HSC',
      subject: 'Higher Math',
      totalQuestions: 15,
      durationMinutes: 15,
      totalMarks: 15,
      negativeMarking: 0.25,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-05-30',
      questionIds: ['q_hsc_01', 'q_hsc_02', 'q_hsc_03', 'q_hsc_04']
    },
    {
      id: 'ex_job_01',
      title: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট - ০১ (All Subject)',
      category: 'JOB',
      subject: 'BCS Preliminary',
      totalQuestions: 20,
      durationMinutes: 20,
      totalMarks: 20,
      negativeMarking: 0.5,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-12-30',
      questionIds: ['q_job_01', 'q_job_02', 'q_job_03', 'q_job_04', 'q_job_05']
    }
  ],

  questions: [
    // SSC Questions
    {
      id: 'q_ssc_01',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'ভৌত রাশি ও পরিমাপ',
      topic: 'স্লাইড ক্যালিপার্স',
      year: '2024',
      board: 'Dhaka Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'একটি ভার্নিয়ার স্কেলের মূল স্কেলের ক্ষুদ্রতম এক ভাগের মান 1 mm এবং ভার্নিয়ারের 20 ভাগ মূল স্কেলের 19 ভাগের সমান হলে ভার্নিয়ার ধ্রুবক (VC) কত?',
      options: [
        '0.05 mm',
        '0.01 mm',
        '0.02 mm',
        '0.5 mm'
      ],
      correctIndex: 0,
      explanation: 'ভার্নিয়ার ধ্রুবক VC = s / n = 1 mm / 20 = 0.05 mm। তাই সঠিক উত্তর (ক) 0.05 mm।'
    },
    {
      id: 'q_ssc_02',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'গতি (Motion)',
      topic: 'পরন্ত বস্তুর সূত্র',
      year: '2023',
      board: 'Rajshahi Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'একটি বস্তুকে 49 m/s বেগে খাড়া উপরের দিকে নিক্ষেপ করা হলে এটি কত উচ্চতায় উঠবে? (g = 9.8 m/s²)',
      options: [
        '120 m',
        '122.5 m',
        '245 m',
        '98 m'
      ],
      correctIndex: 1,
      explanation: 'সর্বোচ্চ উচ্চতা H = u² / (2g) = (49 × 49) / (2 × 9.8) = 2401 / 19.6 = 122.5 মিটার।'
    },
    {
      id: 'q_ssc_03',
      category: 'SSC',
      subject: 'Higher Math',
      chapter: 'ত্রিকোণমিতি',
      topic: 'রেডিয়ান পরিমাপ',
      year: '2024',
      board: 'Chittagong Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'বৃত্তের চাপ s এবং ব্যাসার্ধ r হলে এবং কেন্দ্রস্থ কোণ θ (রেডিয়ানে) হলে কোনটি সঠিক?',
      options: [
        's = rθ',
        'r = sθ',
        'θ = sr',
        's = r / θ'
      ],
      correctIndex: 0,
      explanation: 'আমরা জানি, বৃত্তচাপ s = rθ (যেখানে θ কোণটি রেডিয়ানে প্রকাশিত)।'
    },
    {
      id: 'q_ssc_04',
      category: 'SSC',
      subject: 'Chemistry',
      chapter: 'পদার্থের গঠন',
      topic: 'আইসোটোপ',
      year: '2023',
      board: 'Comilla Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'যেসব পরমাণুর প্রোটন সংখ্যা সমান কিন্তু ভর সংখ্যা ভিন্ন, তাদেরকে কী বলা হয়?',
      options: [
        'আইসোবার',
        'আইসোটোন',
        'আইসোটোপ',
        'আইসোমার'
      ],
      correctIndex: 2,
      explanation: 'প্রোটন সংখ্যা সমান হলে তাদেরকে আইসোটোপ বলে। মনে রাখার সহজ উপায়: আইসোটোপ-এর শেষে "প" মানে প্রোটন সমান।'
    },
    {
      id: 'q_ssc_05',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'বল (Force)',
      topic: 'ভরবেগ ও ত্বরণ',
      year: '2024',
      board: 'Dinajpur Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: '5 kg ভরের একটি স্থির বস্তুর উপর 20 N বল 3 সেকেন্ড ধরে প্রয়োগ করলে বস্তুটির শেষ বেগ কত হবে?',
      options: [
        '12 m/s',
        '15 m/s',
        '4 m/s',
        '60 m/s'
      ],
      correctIndex: 0,
      explanation: 'ত্বরণ a = F / m = 20 / 5 = 4 m/s²। শেষ বেগ v = u + at = 0 + (4 × 3) = 12 m/s।'
    },

    // HSC Questions
    {
      id: 'q_hsc_01',
      category: 'HSC',
      subject: 'Physics',
      chapter: 'ভেক্টর',
      topic: 'ডট গুণন ও লম্ব ভেক্টর',
      year: '2024',
      board: 'Dhaka Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'A = 2i + 3j - k এবং B = 3i - 2j + m k ভেক্টর দুটি পরস্পর লম্ব হলে m এর মান কত?',
      options: [
        '0',
        '6',
        '-6',
        '12'
      ],
      correctIndex: 0,
      explanation: 'দুটি ভেক্টর পরস্পর লম্ব হওয়ার শর্ত হলো A·B = 0। সুতরাং: (2)(3) + (3)(-2) + (-1)(m) = 0 => 6 - 6 - m = 0 => m = 0।'
    },
    {
      id: 'q_hsc_02',
      category: 'HSC',
      subject: 'Chemistry',
      chapter: 'জৈব রসায়ন',
      topic: 'অ্যালকোহল ও অ্যালকিন',
      year: '2023',
      board: 'Rajshahi Board',
      difficulty: 'Hard',
      questionType: 'MCQ',
      text: 'গাঢ় H₂SO₄ এর উপস্থিতিতে ১৬৫°-১৭০°C তাপমাত্রায় ইথানলকে উত্তপ্ত করলে প্রধান উৎপাদ কোনটি?',
      options: [
        'ডাইইথাইল ইথার',
        'ইথিন (CH₂=CH₂)',
        'ইথেন',
        'ইথান্যাল'
      ],
      correctIndex: 1,
      explanation: '১৬৫°-১৭০°C তাপমাত্রায় অতিরিক্ত গাঢ় সালফিউরিক এসিড ইথানল থেকে এক অণু পানি অপসারণ করে ইথিন (অ্যালকিন) তৈরি করে।'
    },
    {
      id: 'q_hsc_03',
      category: 'HSC',
      subject: 'Higher Math',
      chapter: 'ক্যালকুলাস',
      topic: 'অন্তরীকরণ',
      year: '2024',
      board: 'Jessore Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'd/dx (ln sin x) এর মান কত?',
      options: [
        'cot x',
        'tan x',
        'sec x',
        '-cot x'
      ],
      correctIndex: 0,
      explanation: 'd/dx(ln sin x) = (1/sin x) × d/dx(sin x) = (1/sin x) × cos x = cot x।'
    },
    {
      id: 'q_hsc_04',
      category: 'HSC',
      subject: 'Physics',
      chapter: 'কাজ, শক্তি ও ক্ষমতা',
      topic: 'সংরক্ষণশীল বল',
      year: '2023',
      board: 'Sylhet Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'নিচের কোনটি অসংরক্ষণশীল (Non-conservative) বলের উদাহরণ?',
      options: [
        'মহাকর্ষ বল',
        'ঘর্ষণ বল (Friction)',
        'স্থির তড়িৎ বল',
        'স্প্রিং বল'
      ],
      correctIndex: 1,
      explanation: 'ঘর্ষণ বল একটি অসংরক্ষণশীল বল, কারণ ঘর্ষণের বিরুদ্ধে কৃতকাজ পুনরুদ্ধার করা যায় না এবং তা তাপে রূপান্তরিত হয়।'
    },

    // Job / BCS Questions
    {
      id: 'q_job_01',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'বাংলা ভাষা ও সাহিত্য',
      topic: 'চর্যাপদ',
      year: '45th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'চর্যাপদের সবচেয়ে বেশি পদ কে রচনা করেছেন?',
      options: [
        'লুইপা',
        'কাহ্নপা',
        'ভুসুকুপা',
        'শবরপা'
      ],
      correctIndex: 1,
      explanation: 'চর্যাপদের সর্বাধিক ১৩টি পদ রচনা করেছেন কাহ্নপা (কাহ্নপাদ)। ২য় সর্বোচ্চ ৮টি পদ রচনা করেছেন ভুসুকুপা এবং চর্যাপদের আদি কবি লুইপা।'
    },
    {
      id: 'q_job_02',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'বাংলাদেশ বিষয়াবলী',
      topic: 'মুক্তিযুদ্ধ ও সংবিধান',
      year: '46th BCS',
      board: 'BPSC',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'বাংলাদেশের সংবিধান কত তারিখে গৃহীত হয়?',
      options: [
        '৪ নভেম্বর ১৯৭২',
        '১৬ ডিসেম্বর ১৯৭২',
        '২৬ মার্চ ১৯৭১',
        '১০ জানুয়ারি ১৯৭২'
      ],
      correctIndex: 0,
      explanation: 'গণপরিষদে বাংলাদেশের সংবিধান গৃহীত হয় ৪ নভেম্বর ১৯৭২ এবং এটি কার্যকর হয় ১৬ ডিসেম্বর ১৯৭২ থেকে। ৪ নভেম্বর জাতীয় সংবিধান দিবস।'
    },
    {
      id: 'q_job_03',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'আন্তর্জাতিক বিষয়াবলী',
      topic: 'জাতিসংঘ ও চুক্তি',
      year: '44th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'জাতিসংঘের বর্তমান সদস্য সংখ্যা কতটি?',
      options: [
        '১৯১ টি',
        '১৯২ টি',
        '১৯৩ টি',
        '১৯৫ টি'
      ],
      correctIndex: 2,
      explanation: 'জাতিসংঘের বর্তমান পূর্ণ সদস্য রাষ্ট্র ১৯৩টি। সর্বশেষ সদস্য রাষ্ট্র হলো দক্ষিণ সুদান (২০১১ সালে যোগদান করে)।'
    },
    {
      id: 'q_job_04',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'গাণিতিক যুক্তি',
      topic: 'শতকরা ও লাভ-ক্ষতি',
      year: '45th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'একটি দ্রব্যের ক্রয়মূল্য ও বিক্রয়মূল্যের অনুপাত ৫:৬ হলে শতকরা লাভের হার কত?',
      options: [
        '১০%',
        '১৫%',
        '২০%',
        '২৫%'
      ],
      correctIndex: 2,
      explanation: 'ক্রয়মূল্য ৫ টাকা হলে বিক্রয়মূল্য ৬ টাকা। লাভ = ৬ - ৫ = ১ টাকা। সুতরাং শতকরা লাভ = (১ / ৫) × ১০০% = ২০%।'
    },
    {
      id: 'q_job_05',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'ইংরেজি সাহিত্য',
      topic: 'Shakespeare',
      year: '46th BCS',
      board: 'BPSC',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: '"To be, or not to be, that is the question" — is a famous soliloquy from which play?',
      options: [
        'Macbeth',
        'Othello',
        'Hamlet',
        'King Lear'
      ],
      correctIndex: 2,
      explanation: 'This famous philosophical quote is from William Shakespeare\'s tragedy play "Hamlet" (spoken by Prince Hamlet in Act 3, Scene 1).'
    }
  ],

  products: [
    {
      id: 'prod_bcs_book',
      slug: 'bcs-46th-preliminary-question-bank-book',
      type: 'physical',
      category: 'Books',
      educationTypes: ['JOB'],
      name: 'জেনেসিওন একাডেমি বিসিএস প্রিলিমিনারি প্রশ্নব্যাংক ও পুঙ্খানুপুঙ্খ ব্যাখ্যা (১০ম-৪৬তম বিসিএস)',
      price: 480,
      originalPrice: 650,
      discount: 26,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      stock: 350,
      description: '১০ম থেকে ৪৬তম বিসিএস প্রিলিমিনারি পরীক্ষার প্রতিটি প্রশ্নের নির্ভুল ও সাম্প্রতিক রেফারেন্স সহ ব্যাখ্যা সংবলিত হার্ডকভার বই। সাথে থাকছে হোম ডেলিভারি সুবিধা।',
      included: [
        'হার্ডকভার প্রিমিয়াম প্রিন্টেড বই (৭২০ পৃষ্ঠা)',
        'অধ্যায়ভিত্তিক সাজানো বিগত বছরের প্রশ্নোত্তর',
        'ফ্রি স্পেশাল অনলাইন মডেল টেস্ট অ্যাক্সেস'
      ]
    },
    {
      id: 'prod_ssc_pdf',
      slug: 'ssc-higher-math-shortcut-formula-sheet',
      type: 'digital',
      category: 'PDF',
      educationTypes: ['SSC'],
      name: 'SSC উচ্চতর গণিত ১০০+ শর্টকাট সূত্র ও কনসেপ্ট চিটশিট (HD PDF)',
      price: 99,
      originalPrice: 250,
      discount: 60,
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'পরীক্ষার আগের রাতের জন্য এসএসসি উচ্চতর গণিতের সকল প্রয়োজনীয় সূত্রের কালারফুল এইচডি ডিজিটাল গাইড। পেমেন্ট করলেই সরাসরি ডাউনলোড করুন।'
    },
    {
      id: 'prod_hsc_notes',
      slug: 'hsc-chemistry-organic-reaction-map-pdf',
      type: 'digital',
      category: 'Notes',
      educationTypes: ['HSC'],
      name: 'HSC জৈব রসায়ন পূর্ণাঙ্গ বিক্রিয়া ফ্লোচার্ট ও রোডম্যাপ (HD Printable PDF)',
      price: 149,
      originalPrice: 350,
      discount: 57,
      rating: 4.96,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'জৈব রসায়নের রূপান্তর ও বিক্রিয়া মনে রাখার একমাত্র অল-ইন-ওয়ান ডিজিটাল চার্ট।'
    },
    {
      id: 'prod_model_tests',
      slug: 'ssc-hsc-job-model-test-paper-bundle',
      type: 'physical',
      category: 'Model Tests',
      educationTypes: ['SSC', 'HSC', 'JOB'],
      name: 'জেনেসিওন একাডেমি ২০টি পূর্ণাঙ্গ মডেল টেস্ট ও ওএমআর শিট বান্ডেল (হোম ডেলিভারি)',
      price: 320,
      originalPrice: 500,
      discount: 36,
      rating: 4.75,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      stock: 120,
      description: 'আসল পরীক্ষার মতো ওএমআর শিটে প্র্যাকটিস করার জন্য ২০ সেট মুদ্রিত মডেল টেস্ট পেপার।'
    }
  ],

  orders: [
    {
      id: 'ord_1001',
      userId: 'usr_ssc',
      userName: 'তানভীর আহমেদ',
      items: [{ id: 'crs_ssc_phy_math', name: 'SSC 2026 পদার্থবিজ্ঞান ও উচ্চতর গণিত', price: 1500, type: 'course' }],
      totalAmount: 1500,
      paymentGateway: 'bKash',
      transactionId: 'TRX98762514',
      status: 'completed',
      date: '2025-09-12'
    },
    {
      id: 'ord_1002',
      userId: 'usr_job',
      userName: 'আব্দুল হান্নান',
      items: [{ id: 'crs_bcs_preli', name: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ কোর্স', price: 2999, type: 'course' }],
      totalAmount: 2999,
      paymentGateway: 'Nagad',
      transactionId: 'NGD55443322',
      status: 'completed',
      date: '2025-09-15'
    }
  ],

  examAttempts: [
    {
      id: 'atm_1',
      userId: 'usr_ssc',
      examId: 'ex_ssc_01',
      examTitle: 'SSC 2026 পদার্থবিজ্ঞান বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট - ০১',
      score: 4.75,
      totalMarks: 5,
      percentage: 95,
      correct: 5,
      wrong: 0,
      skipped: 0,
      timeTaken: '08:45',
      meritRank: '14 / 1,420',
      percentile: '99.0%',
      submittedAt: '2025-10-02 18:30',
      answers: { 'q_ssc_01': 0, 'q_ssc_02': 1, 'q_ssc_03': 0, 'q_ssc_04': 2, 'q_ssc_05': 0 }
    }
  ],

  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_ssc',
      title: 'নতুন লাইভ ক্লাস আপলোড হয়েছে!',
      message: 'পদার্থবিজ্ঞান অধ্যায় ২ এর লেকচার ভিডিও আপলোড করা হয়েছে। এখনই দেখে নাও!',
      type: 'course',
      isRead: false,
      date: '১০ মিনিট আগে'
    },
    {
      id: 'notif_2',
      userId: 'all',
      title: '🎉 অল বাংলাদেশ মেগা স্কলারশিপ এক্সাম',
      message: 'আগামী শুক্রবার রাত ৮টায় অনুষ্ঠিত হতে যাচ্ছে জেনেসিওন একাডেমি স্কলারশিপ পরীক্ষা। অংশগ্রহণ করুন বিনামূল্যে!',
      type: 'exam',
      isRead: false,
      date: '২ ঘণ্টা আগে'
    },
    {
      id: 'notif_3',
      userId: 'usr_job',
      title: '৪৭তম বিসিএস প্রিলির লেকচার শিট আপডেট',
      message: 'আন্তর্জাতিক বিষয়াবলীর নতুন সাম্প্রতিক তথ্যাবলীর শিট যুক্ত হয়েছে।',
      type: 'resource',
      isRead: true,
      date: '১ দিন আগে'
    }
  ],

};

// Database Engine with LocalStorage Sync
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        let dataNeedsSave = false;
        const seededProducts = new Map(
          initialDB.products.map(product => [product.id, product])
        );
        data.products = (data.products || []).map(product => {
          const updatedName = product.name
            ?.replace(/JA\s*Academy/gi, 'Geneseon Academy')
            .replace(/জেএ\s*একাডেমি/g, 'জেনেসিওন একাডেমি');
          if (updatedName !== product.name) dataNeedsSave = true;
          return {
            ...product,
            name: updatedName,
            educationTypes: product.educationTypes ||
              seededProducts.get(product.id)?.educationTypes || []
          };
        });
        const legacyCoupon = (data.coupons || []).find(coupon => coupon.code === 'JA50');
        if (legacyCoupon && !data.coupons.some(coupon => coupon.code === 'GENESEON50')) {
          data.coupons.push({ ...legacyCoupon, code: 'GENESEON50' });
          dataNeedsSave = true;
        }
        if (dataNeedsSave) this.save(data);
        return data;
      }
    } catch (e) {
      console.error('Error loading DB from localStorage:', e);
    }
    this.save(initialDB);
    return JSON.parse(JSON.stringify(initialDB));
  }

  save(data = null) {
    if (data) this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving DB to localStorage:', e);
    }
  }

  reset() {
    this.save(initialDB);
    return this.data;
  }

  // Users & Auth
  getUsers() { return this.data.users || []; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmailOrMobile(identifier) {
    return this.data.users.find(u => u.email === identifier || u.mobile === identifier);
  }
  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }
  mergeServerContent(resources) {
    ['courses', 'exams', 'questions'].forEach(collection => {
      const serverItems = resources[collection] || [];
      const merged = new Map((this.data[collection] || []).map(item => [item.id, item]));
      serverItems.forEach(item => merged.set(item.id, item));
      this.data[collection] = Array.from(merged.values());
    });
    if (Array.isArray(resources.products)) {
      this.data.products = resources.products;
    }
    this.save();
  }

  // Courses
  getCourses() { return this.data.courses || []; }
  getCourseById(id) { return this.data.courses.find(c => c.id === id || c.slug === id); }
  addCourse(course) {
    this.data.courses.unshift(course);
    this.save();
    return course;
  }
  updateCourse(id, updates) {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.courses[idx] = { ...this.data.courses[idx], ...updates };
      this.save();
      return this.data.courses[idx];
    }
    return null;
  }
  deleteCourse(id) {
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    this.save();
  }

  // Exams
  getExams() { return this.data.exams || []; }
  getExamById(id) { return this.data.exams.find(e => e.id === id); }
  addExam(exam) {
    this.data.exams.unshift(exam);
    this.save();
    return exam;
  }
  deleteExam(id) {
    this.data.exams = this.data.exams.filter(e => e.id !== id);
    this.save();
  }

  // Questions
  getQuestions() { return this.data.questions || []; }
  getQuestionById(id) { return this.data.questions.find(q => q.id === id); }
  addQuestion(q) {
    this.data.questions.unshift(q);
    this.save();
    return q;
  }
  updateQuestion(id, updates) {
    const idx = this.data.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
      this.save();
      return this.data.questions[idx];
    }
    return null;
  }
  deleteQuestion(id) {
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    this.save();
  }

  // Products & Store
  getProducts() { return this.data.products || []; }
  getProductById(id) { return this.data.products.find(p => p.id === id || p.slug === id); }
  saveProduct(product) {
    const index = this.data.products.findIndex(item => item.id === product.id);
    if (index === -1) this.data.products.unshift(product);
    else this.data.products[index] = product;
    this.save();
    return product;
  }
  addProduct(prod) {
    this.data.products.unshift(prod);
    this.save();
    return prod;
  }
  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
  }

  // Orders
  getOrders() { return this.data.orders || []; }
  addOrder(order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  // Attempts
  getExamAttempts(userId) {
    if (!userId) return this.data.examAttempts || [];
    return (this.data.examAttempts || []).filter(a => a.userId === userId);
  }
  getAttemptById(id) {
    return (this.data.examAttempts || []).find(a => a.id === id);
  }
  addExamAttempt(attempt) {
    if (!this.data.examAttempts) this.data.examAttempts = [];
    this.data.examAttempts.unshift(attempt);
    this.save();
    return attempt;
  }

  // Notifications
  getNotifications(userId) {
    return (this.data.notifications || []).filter(n => n.userId === 'all' || n.userId === userId);
  }
  markNotificationRead(id) {
    const n = (this.data.notifications || []).find(notif => notif.id === id);
    if (n) {
      n.isRead = true;
      this.save();
    }
  }

}
const db = window.db = new Database();


/* --- [js/auth.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - SERVER-BACKED AUTHENTICATION & USER SESSION MANAGER
   ========================================================================== */


async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি।');
  }
  if (!response.ok) {
    throw new Error(result.error || 'অনুরোধটি সম্পন্ন করা যায়নি।');
  }
  return result;
}

function cacheUser(user) {
  if (!user) return null;
  const cached = db.getUserById(user.id);
  if (cached) {
    db.updateUser(user.id, user);
  } else {
    db.addUser(user);
  }
  return user;
}
const Auth = window.Auth = {
  currentUser: null,
  ready: null,

  init() {
    this.ready = request('/api/auth/me')
      .then(({ user }) => {
        this.currentUser = cacheUser(user);
        return this.loadContent().then(() => this.currentUser);
      })
      .catch(error => {
        console.error('Authentication session check failed:', error);
        this.currentUser = null;
        Toast.error('অ্যাকাউন্ট সার্ভারের সাথে সংযোগ করা যায়নি।');
        return null;
      });
    return this.ready;
  },

  async loadContent() {
    if (!this.currentUser) return;
    try {
      const content = await request('/api/content');
      db.mergeServerContent(content);
    } catch (error) {
      console.error('Server content synchronization failed:', error);
      Toast.warning('সার্ভারের নতুন কোর্স ও পরীক্ষার তথ্য লোড করা যায়নি।');
    }
  },

  async refreshContent() {
    return this.loadContent();
  },

  getUser() {
    return this.currentUser;
  },

  saveSession() {
    window.dispatchEvent(new CustomEvent('authChanged', {
      detail: { user: this.currentUser }
    }));
  },

  async login(emailOrMobile, password) {
    try {
      const { user } = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: emailOrMobile.trim(), password })
      });
      this.currentUser = cacheUser(user);
      await this.loadContent();
      this.saveSession();
      Toast.success(`স্বাগতম, ${user.name}!`);
      window.location.hash = user.role === 'ADMIN' ? '#/admin' : '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async requestPasswordReset(email) {
    return request('/api/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async completePasswordReset(token, password) {
    return request('/api/auth/password-reset/complete', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  },

  async switchAdminMode({ role, educationType, batchOrTarget, password }) {
    try {
      const { user } = await request('/api/auth/admin-mode', {
        method: 'POST',
        body: JSON.stringify({ role, educationType, batchOrTarget, password })
      });
      this.currentUser = cacheUser(user);
      this.saveSession();
      Toast.success(role === 'ADMIN'
        ? 'অ্যাডমিন মোড চালু হয়েছে।'
        : 'শিক্ষার্থী মোড চালু হয়েছে।');
      window.location.hash = role === 'ADMIN' ? '#/admin' : '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async register({ name, mobile, email, password, educationType, batchOrTarget }) {
    try {
      const { user } = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name, mobile, email, password, educationType, batchOrTarget
        })
      });
      this.currentUser = cacheUser(user);
      await this.loadContent();
      this.saveSession();
      Toast.success('রেজিস্ট্রেশন সফল হয়েছে! জেনেসিওন একাডেমি প্ল্যাটফর্মে স্বাগতম।');
      window.location.hash = '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST', body: '{}' });
    } catch (error) {
      console.error('Server logout failed:', error);
      Toast.error('সার্ভারে লগআউট সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
      return false;
    }
    this.currentUser = null;
    this.saveSession();
    Toast.info('সফলভাবে লগআউট হয়েছে।');
    window.location.hash = '#/login';
    return true;
  },

  async updateProfile(updates) {
    if (!this.currentUser) return false;
    try {
      const { user } = await request('/api/auth/profile', {
        method: 'POST',
        body: JSON.stringify(updates)
      });
      this.currentUser = cacheUser(user);
      this.saveSession();
      Toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  isAdmin() {
    return this.currentUser?.role === 'ADMIN';
  },

  canAccessCategory(category) {
    return this.isAdmin() || (
      !!this.currentUser &&
      ['SSC', 'HSC', 'JOB'].includes(this.currentUser.educationType) &&
      this.currentUser.educationType === category
    );
  },

  canAccessCourse(course) {
    return this.isAdmin() || (
      !!course &&
      this.canAccessCategory(course.category) &&
      (this.currentUser?.enrolledCourses || []).includes(course.id)
    );
  }
};

Auth.init();


/* --- [js/services/aiService.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - AI STUDY ASSISTANT SERVICE
   ========================================================================== */


const QUESTION_SEARCH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'by', 'for', 'from', 'how', 'in', 'is', 'of',
  'on', 'or', 'the', 'to', 'what', 'when', 'where', 'which', 'who', 'why',
  'একটি', 'এবং', 'কী', 'কি', 'কেন', 'কাকে', 'কোন', 'কোনটি', 'কিভাবে',
  'কীভাবে', 'কীসের', 'কত', 'কে', 'এর', 'ও', 'জানতে', 'চাই', 'বল',
  'বলো', 'দাও', 'দেখাও', 'আমাকে', 'আমার', 'হলো', 'হয়', 'হয়', 'হলে',
  'সম্পর্কে', 'ব্যাখ্যা', 'সমাধান', 'প্রশ্ন', 'প্রশ্নটার', 'প্রশ্নটি',
  'উত্তর', 'উত্তরটা'
]);

function questionSearchTokens(value) {
  return [...new Set(
    String(value || '')
      .normalize('NFKC')
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}]+/gu) || []
  )].filter(token =>
    !QUESTION_SEARCH_STOP_WORDS.has(token) &&
    (token.length > 1 || /^\d+$/.test(token))
  );
}

function getQuestionSearchText(question) {
  return [
    question.text,
    question.stimulus,
    question.subject,
    question.chapter,
    question.topic,
    question.board,
    question.year,
    question.options?.join(' '),
    question.explanation,
    question.answer,
    question.parts?.map(part => `${part.question || ''} ${part.answer || ''}`).join(' ')
  ].filter(Boolean).join(' ');
}

function findQuestionBankAnswers(prompt, category) {
  const query = prompt.trim().normalize('NFKC').toLocaleLowerCase();
  const tokens = questionSearchTokens(query);
  if (!tokens.length) return [];

  const matchesByQuestion = new Map();
  db.getQuestions()
    .filter(question => question.category === category)
    .map(question => {
      const searchableText = getQuestionSearchText(question);
      const normalizedText = searchableText.normalize('NFKC').toLocaleLowerCase();
      const normalizedQuestion = String(
        question.text || question.stimulus ||
        question.parts?.map(part => part.question).join(' ') || question.id
      ).normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      const matchedTokens = tokens.filter(token => normalizedText.includes(token));
      const coverage = matchedTokens.length / tokens.length;
      const exactMatch = normalizedText.includes(query);
      return {
        question,
        normalizedQuestion,
        score: exactMatch ? 1 : coverage,
        matchedCount: matchedTokens.length,
        queryTokenCount: tokens.length
      };
    })
    .filter(match =>
      match.score >= 0.65 &&
      (match.queryTokenCount === 1
        ? match.matchedCount === 1
        : match.matchedCount >= 2)
    )
    .forEach(match => {
      const existing = matchesByQuestion.get(match.normalizedQuestion);
      if (!existing || match.score > existing.score) {
        matchesByQuestion.set(match.normalizedQuestion, match);
      }
    });
  const matches = [...matchesByQuestion.values()]
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (!matches.length || (
    matches.length > 1 &&
    matches[0].score - matches[1].score > 0.25
  )) {
    return matches.slice(0, 1).map(match => match.question);
  }
  return matches.map(match => match.question);
}

function formatQuestionBankAnswer(question, index) {
  const type = question.questionType || 'MCQ';
  const heading = question.subject
    ? `${question.subject}${question.chapter ? ` • ${question.chapter}` : ''}`
    : question.chapter || question.category;
  const answer = type === 'CQ'
    ? (question.parts || [])
      .filter(part => part.answer)
      .map(part => `- **${part.label || ''} ${part.question || ''}**\n  ${part.answer}`)
      .join('\n') || 'প্রশ্নব্যাংকে এই CQ-এর নমুনা উত্তর যোগ করা হয়নি।'
    : type === 'WRITTEN'
      ? question.answer || question.explanation || 'প্রশ্নব্যাংকে এই প্রশ্নের উত্তর যোগ করা হয়নি।'
      : `**সঠিক উত্তর:** ${question.options?.[question.correctIndex] || 'উত্তর পাওয়া যায়নি।'}${
        Number.isInteger(question.correctIndex)
          ? ` (${['ক', 'খ', 'গ', 'ঘ'][question.correctIndex] || question.correctIndex + 1})`
          : ''
      }\n\n**ব্যাখ্যা:** ${question.explanation || 'এই প্রশ্নের ব্যাখ্যা প্রশ্নব্যাংকে যোগ করা হয়নি।'}`;

  const questionText = type === 'CQ'
    ? question.stimulus || (question.parts || []).map(part => part.question).join(' ')
    : question.text;
  return `### ${index + 1}. ${heading || 'প্রশ্নব্যাংকের প্রশ্ন'}\n**প্রশ্ন:** ${questionText || ''}\n\n${answer}`;
}
const AiService = window.AiService = {
  getStudentContext() {
    const user = Auth.getUser();
    if (!user) return { type: 'GENERAL', label: 'General Knowledge & Studies' };
    return {
      type: user.educationType || 'GENERAL',
      label: user.batchOrTarget || (user.educationType ? `${user.educationType} Preparation` : 'General Studies'),
      userName: user.name
    };
  },

  /**
   * Answers from the question bank first, then uses Gemini for multilingual queries.
   */
  async generateResponse(prompt, onChunk = null) {
    const ctx = this.getStudentContext();
    if (ctx.type !== 'GENERAL') {
      await Auth.refreshContent();
      const questionBankMatches = findQuestionBankAnswers(prompt, ctx.type);
      if (questionBankMatches.length) {
        const reply = `### 📚 প্রশ্নব্যাংক থেকে উত্তর\n\n${questionBankMatches
        .map(formatQuestionBankAnswer)
          .join('\n\n---\n\n')}\n\n*উত্তরটি তোমার বিভাগের প্রশ্নব্যাংকের সংরক্ষিত তথ্য থেকে নেওয়া হয়েছে।*`;
        if (onChunk) onChunk(reply);
        return reply;
      }
    }

    const response = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'AI উত্তর দিতে পারেনি।');
    }
    if (typeof result.answer !== 'string' || !result.answer.trim()) {
      throw new Error('AI থেকে সঠিক উত্তর পাওয়া যায়নি।');
    }
    if (onChunk) onChunk(result.answer);
    return result.answer;
  }
};


/* --- [js/services/paymentService.js] --- */
const PaymentService = window.PaymentService = {
  async processPayment({ items, couponCode = '', gateway, onComplete }) {
    const user = Auth.getUser();
    if (!user) {
      Toast.error('পেমেন্ট করার জন্য অনুগ্রহ করে লগইন করুন।');
      window.location.hash = '#/login';
      return;
    }
    if (gateway !== 'bKash') {
      Toast.error('এই পেমেন্ট পদ্ধতি এখনো চালু হয়নি।');
      return;
    }
    if (!items.length || items.some(item =>
      !['course', 'digital'].includes(item.type)
    )) {
      Toast.error('ম্যানুয়াল bKash পেমেন্টে শুধু কোর্স বা ডিজিটাল PDF কেনা যাবে।');
      return;
    }

    let paymentInfo;
    try {
      const response = await fetch('/api/payment-info', {
        credentials: 'same-origin'
      });
      paymentInfo = await response.json();
      if (!response.ok) {
        throw new Error(paymentInfo.error || 'পেমেন্ট তথ্য লোড করা যায়নি।');
      }
    } catch (error) {
      console.error('Could not load payment configuration:', error);
      Toast.error(error.message || 'পেমেন্ট তথ্য লোড করা যায়নি।');
      return;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
      0
    );
    const coupon = (couponCode || '').trim().toUpperCase();
    const couponRecord = coupon ? paymentInfo.coupons?.[coupon] : null;
    if (coupon && !couponRecord) {
      Toast.error('কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।');
      return;
    }
    let discount = 0;
    if (couponRecord?.discountPercent) {
      discount = Math.round(subtotal * couponRecord.discountPercent / 100);
      if (couponRecord.maxDiscount) discount = Math.min(discount, couponRecord.maxDiscount);
    } else if (couponRecord?.discountAmount) {
      discount = couponRecord.discountAmount;
    }
    const totalAmount = Math.max(0, subtotal - Math.min(subtotal, discount));
    if (totalAmount === 0) {
      try {
        const result = await this.submitOrder(items, coupon, null, null);
        const order = result.order;
        localStorage.removeItem('ja_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Toast.success(`ফ্রি কুপনের অর্ডার জমা হয়েছে (${order.id})। অ্যাডমিন অনুমোদন দিলে access চালু হবে।`);
        if (typeof onComplete === 'function') onComplete(order);
      } catch (error) {
        console.error('Could not redeem free course coupon:', error);
        Toast.error(error.message || 'কুপন ব্যবহার করা যায়নি।');
      }
      return;
    }

    if (!paymentInfo.bkashConfigured) {
      Toast.error('অ্যাডমিনের bKash পেমেন্ট নম্বর এখনো সেট করা হয়নি।');
      return;
    }

    this.openBkashModal(items, totalAmount, coupon, paymentInfo.bkashNumber, user, onComplete);
  },

  async submitOrder(items, couponCode, senderMobile, transactionId) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(({ id, type, quantity }) => ({ id, type, quantity })),
        couponCode,
        senderMobile,
        transactionId
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'পেমেন্ট অনুরোধ জমা করা যায়নি।');
    }
    return result;
  },

  openBkashModal(items, totalAmount, couponCode, bkashNumber, user, onComplete) {
    const content = `
      <div class="gateway-modal-box">
        <div class="bkash-header-bar">
          <h3 style="font-size: 1.35rem; font-weight: 800;">ম্যানুয়াল bKash পেমেন্ট</h3>
          <p style="font-size: 0.85rem; opacity: 0.9;">কোর্স অ্যাক্সেস অ্যাডমিন যাচাইয়ের পর চালু হবে</p>
        </div>
        <div style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: 800; color: #E2136E; margin-bottom: 1rem;">
            ${formatBDT(totalAmount)}
          </div>
          ${couponCode ? `<p>কুপন ${couponCode} প্রয়োগ করা হয়েছে।</p>` : ''}
          <p>এই নম্বরে Send Money করুন:</p>
          <p id="bkash-merchant-number" style="font-size: 1.25rem; font-weight: 800; margin: 0.5rem 0 1rem;"></p>
          <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
            <label class="form-label" for="bkash-sender-mobile">যে bKash নম্বর থেকে পাঠিয়েছেন *</label>
            <input type="tel" id="bkash-sender-mobile" class="form-input" placeholder="01XXXXXXXXX" required>
          </div>
          <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
            <label class="form-label" for="bkash-transaction-id">bKash TrxID *</label>
            <input type="text" id="bkash-transaction-id" class="form-input" maxlength="40" placeholder="যেমন: 8JH5K2ABCD" required>
          </div>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 1rem;">
            এখানে কখনো bKash PIN বা OTP দেবেন না। পেমেন্ট যাচাই না হওয়া পর্যন্ত কোর্স লক থাকবে।
          </p>
          <button id="bkash-confirm-btn" class="btn btn-block" style="background: #E2136E; color: white; font-weight: 700; padding: 0.85rem;">
            পেমেন্ট জমা দিন
          </button>
        </div>
      </div>
    `;

    const modalInstance = Modal.open({
      title: 'bKash পেমেন্ট তথ্য',
      content,
      maxWidth: '440px'
    });
    document.getElementById('bkash-merchant-number').textContent = bkashNumber;
    document.getElementById('bkash-sender-mobile').value = user.mobile || '';

    document.getElementById('bkash-confirm-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('bkash-confirm-btn');
      const senderMobile = document.getElementById('bkash-sender-mobile').value.trim();
      const transactionId = document.getElementById('bkash-transaction-id').value.trim();
      if (!senderMobile || !/^[A-Za-z0-9-]{4,40}$/.test(transactionId)) {
        Toast.error('bKash নম্বর এবং সঠিক TrxID দিন।');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'জমা দেওয়া হচ্ছে...';
      try {
        const result = await this.submitOrder(
          items, couponCode, senderMobile, transactionId
        );
        const order = result.order;
        modalInstance.close();
        localStorage.removeItem('ja_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Toast.success(`অর্ডার জমা হয়েছে (${order.id})। টাকা যাচাই হলে কোর্স বা PDF access চালু হবে।`);
        if (typeof onComplete === 'function') onComplete(order);
      } catch (error) {
        console.error('Could not submit manual bKash order:', error);
        Toast.error(error.message || 'অর্ডার জমা করা যায়নি।');
        btn.disabled = false;
        btn.innerText = 'পেমেন্ট জমা দিন';
      }
    });
  }
};


/* --- [js/services/examService.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - EXAM ENGINE & DIAGNOSTIC ANALYTICS SERVICE
   ========================================================================== */
const ExamService = window.ExamService = {
  currentSession: null,
  timerInterval: null,

  startExam(examId) {
    const exam = db.getExamById(examId);
    if (!exam) return null;
    if (!Auth.canAccessCategory(exam.category)) {
      Toast.error('এই পরীক্ষাটি আপনার অ্যাকাউন্টের জন্য উপলভ্য নয়।');
      return null;
    }
    const now = Date.now();
    if (!Auth.isAdmin() && exam.startAt && now < Date.parse(exam.startAt)) {
      Toast.info(`পরীক্ষা শুরু হবে: ${new Date(exam.startAt).toLocaleString('bn-BD')}`);
      return null;
    }
    if (!Auth.isAdmin() && exam.endAt && now > Date.parse(exam.endAt)) {
      Toast.warning('এই পরীক্ষার সময় শেষ হয়েছে।');
      return null;
    }

    const allQuestions = db.getQuestions();
    let questions = [];

    if (exam.questionIds && exam.questionIds.length > 0) {
      questions = exam.questionIds
        .map(qid => db.getQuestionById(qid))
        .filter(Boolean);
    }

    if (questions.length === 0) {
      questions = allQuestions
        .filter(question => question.category === exam.category
          && (question.questionType || 'MCQ') === 'MCQ')
        .slice(0, exam.totalQuestions || 10);
    }
    if (!questions.length) {
      Toast.error('এই পরীক্ষার জন্য কোনো প্রশ্ন পাওয়া যায়নি।');
      return null;
    }

    const durationSeconds = (exam.durationMinutes || 15) * 60;
    const endAt = !Auth.isAdmin() && exam.endAt ? Date.parse(exam.endAt) : null;
    const deadlineAt = Number.isFinite(endAt)
      ? Math.min(now + durationSeconds * 1000, endAt)
      : now + durationSeconds * 1000;
    const effectiveDurationSeconds = Math.max(
      0,
      Math.ceil((deadlineAt - now) / 1000)
    );

    this.currentSession = {
      examId: exam.id,
      userId: Auth.getUser()?.id,
      examTitle: exam.title,
      category: exam.category,
      subject: exam.subject,
      endAt: Number.isFinite(endAt) ? endAt : null,
      questions: questions,
      totalQuestions: questions.length,
      totalMarks: questions.some(question => question.questionType === 'CQ')
        ? Number(exam.totalMarks) || questions.length
        : questions.length,
      durationSeconds: effectiveDurationSeconds,
      remainingSeconds: effectiveDurationSeconds,
      deadlineAt,
      negativeMarking: exam.negativeMarking || 0.25,
      currentIndex: 0,
      answers: {}, // { [questionId]: selectedOptionIndex }
      cqAnswerSheet: null,
      flagged: new Set(),
      startTime: Date.now()
    };

    return this.currentSession;
  },

  getCurrentSession() {
    return this.currentSession;
  },

  selectAnswer(questionId, optionIndex) {
    if (!this.currentSession || Object.hasOwn(this.currentSession.answers, questionId)) {
      return false;
    }
    const question = this.currentSession.questions.find(item => item.id === questionId);
    if (!question || !Number.isInteger(optionIndex)
      || optionIndex < 0 || optionIndex >= (question.options || []).length) {
      return false;
    }
    this.currentSession.answers[questionId] = optionIndex;
    return true;
  },

  toggleFlag(questionId) {
    if (!this.currentSession) return;
    if (this.currentSession.flagged.has(questionId)) {
      this.currentSession.flagged.delete(questionId);
    } else {
      this.currentSession.flagged.add(questionId);
    }
  },

  async submitExam() {
    if (!this.currentSession) return null;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const user = Auth.getUser();
    const session = this.currentSession;
    const questions = session.questions;

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const topicBreakdown = {};

    questions.forEach(q => {
      if (q.questionType === 'CQ') return;
      const studentAns = session.answers[q.id];
      const topic = q.topic || q.chapter || 'সাধারণ';
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { total: 0, correct: 0, wrong: 0 };
      }
      topicBreakdown[topic].total++;

      if (studentAns === undefined || studentAns === null) {
        skippedCount++;
      } else if (studentAns === q.correctIndex) {
        correctCount++;
        topicBreakdown[topic].correct++;
      } else {
        wrongCount++;
        topicBreakdown[topic].wrong++;
      }
    });

    const rawScore = correctCount * 1.0;
    const penalty = wrongCount * session.negativeMarking;
    const finalScore = Math.max(0, +(rawScore - penalty).toFixed(2));
    const totalMarks = session.totalMarks;
    const percentage = totalMarks ? Math.round((finalScore / totalMarks) * 100) : 0;

    const timeSpentSeconds = session.durationSeconds - session.remainingSeconds;
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Weak topics identification
    const weakTopics = Object.keys(topicBreakdown).filter(t => {
      const stat = topicBreakdown[t];
      return stat.wrong > 0 || (stat.correct / stat.total < 0.6);
    });

    const resultRecord = {
      id: uid('atm'),
      userId: user ? user.id : 'guest',
      userName: user ? user.name : 'Guest Student',
      examId: session.examId,
      examTitle: session.examTitle,
      category: session.category,
      subject: session.subject,
      score: finalScore,
      totalMarks: totalMarks,
      percentage: percentage,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      negativePenalty: penalty,
      timeTaken: timeFormatted,
      meritRank: `${Math.floor(Math.random() * 25) + 3} / 1,450`,
      percentile: `${Math.min(99.9, (percentage + 5)).toFixed(1)}%`,
      submittedAt: new Date().toLocaleString('bn-BD'),
      answers: { ...session.answers },
      questions: session.questions,
      topicBreakdown: topicBreakdown,
      weakTopics: weakTopics
    };

    const hasCQ = questions.some(question => question.questionType === 'CQ');
    if (hasCQ && !Auth.isAdmin()) {
      if (!session.cqAnswerSheet) {
        throw new Error('CQ পরীক্ষার উত্তরপত্র PDF আপলোড করুন।');
      }
      const form = new FormData();
      form.append('answers', JSON.stringify(session.answers));
      form.append('timeTaken', timeFormatted);
      form.append('answerSheet', session.cqAnswerSheet);
      const response = await fetch(`/api/exams/${encodeURIComponent(session.examId)}/attempts`, {
        method: 'POST',
        credentials: 'same-origin',
        body: form
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'পরীক্ষার উত্তরপত্র জমা দেওয়া যায়নি।');
      }
      Object.assign(resultRecord, payload.attempt);
    } else if (hasCQ) {
      resultRecord.cqStatus = 'pending';
      resultRecord.cqMaxMarks = Math.max(0, resultRecord.totalMarks - questions.filter(q => q.questionType !== 'CQ').length);
      resultRecord.cqScore = null;
      resultRecord.cqPdfUrl = null;
    }

    db.addExamAttempt(resultRecord);
    this.currentSession = null;
    launchConfetti();

    return resultRecord;
  }
};


/* --- [js/views/landingView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - LANDING PAGE VIEW
   ========================================================================== */
const LandingView = window.LandingView = {
  render() {
    const courses = db.getCourses().slice(0, 3);
    const exams = db.getExams().slice(0, 3);

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container text-center">
          <h1 class="hero-title">
            ${i18n.t('heroTitle')}<br>
            <span class="gradient-text">${i18n.getLang() === 'bn' ? 'কোর্স, পরীক্ষা ও এআই এক সাথে' : 'Courses, Exams & AI Assistant'}</span>
          </h1>

          <p class="hero-subtitle">
            ${i18n.t('heroSubtitle')}
          </p>

          <div class="hero-cta-group">
            <a href="#/courses" class="btn btn-glowing btn-lg">
              ${icons.play}
              ${i18n.t('exploreCourses')}
            </a>
            <a href="#/register" class="btn btn-secondary btn-lg">
              ${icons.graduation}
              ${i18n.t('startLearning')}
            </a>
          </div>

          <!-- Hero Stats Bar -->
          <div class="hero-stats-row">
            <div class="stat-item">
              <div class="stat-number">১,২০,০০০+</div>
              <div class="stat-label">${i18n.t('activeStudents')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">৫০+</div>
              <div class="stat-label">${i18n.t('totalCoursesCount')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">৭৫,০০০+</div>
              <div class="stat-label">${i18n.t('totalQuestionsCount')}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">৯৮.৫%</div>
              <div class="stat-label">${i18n.t('successRate')}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Preparation Category Section -->
      <section class="container" style="padding-top: 3.5rem;">
        <div class="section-header">
          <div class="section-tag">${i18n.getLang() === 'bn' ? 'টার্গেট ক্যাটাগরি' : 'Target Category'}</div>
          <h2 class="section-title">${i18n.getLang() === 'bn' ? 'তুমি কিসের জন্য প্রস্তুতি নিচ্ছ?' : 'What are you preparing for?'}</h2>
          <p class="section-desc">${i18n.getLang() === 'bn' ? 'তোমার লক্ষ্য বেছে নাও এবং সম্পূর্ণ গোছানো প্রস্তুতি শুরু করো।' : 'Choose your goal and start an organized study journey.'}</p>
        </div>

        <div class="category-cards-grid">
          <!-- SSC Card -->
          <div class="category-card ssc-card" onclick="window.location.hash='#/courses?category=SSC'">
            <div class="cat-icon-wrap">🎓</div>
            <span class="badge badge-ssc" style="margin-bottom: 0.75rem;">SSC Preparation</span>
            <h3>${i18n.t('ssc')}</h3>
            <p>${i18n.t('sscDesc')}</p>
            <button class="btn btn-outline btn-sm" style="border-color: var(--ssc-color); color: var(--ssc-color);">
              ${i18n.t('exploreCourses')} ${icons.chevronRight}
            </button>
          </div>

          <!-- HSC Card -->
          <div class="category-card hsc-card" onclick="window.location.hash='#/courses?category=HSC'">
            <div class="cat-icon-wrap">🔬</div>
            <span class="badge badge-hsc" style="margin-bottom: 0.75rem;">HSC & Admission</span>
            <h3>${i18n.t('hsc')}</h3>
            <p>${i18n.t('hscDesc')}</p>
            <button class="btn btn-outline btn-sm" style="border-color: var(--hsc-color); color: var(--hsc-color);">
              ${i18n.t('exploreCourses')} ${icons.chevronRight}
            </button>
          </div>

          <!-- Job Card -->
          <div class="category-card job-card" onclick="window.location.hash='#/courses?category=JOB'">
            <div class="cat-icon-wrap">🏛️</div>
            <span class="badge badge-job" style="margin-bottom: 0.75rem;">Govt Job & BCS</span>
            <h3>${i18n.t('job')}</h3>
            <p>${i18n.t('jobDesc')}</p>
            <button class="btn btn-outline btn-sm" style="border-color: var(--job-color); color: var(--job-color);">
              ${i18n.t('exploreCourses')} ${icons.chevronRight}
            </button>
          </div>
        </div>
      </section>

      <!-- Popular Courses Section -->
      <section class="container">
        <div class="section-header">
          <div class="section-tag">${i18n.getLang() === 'bn' ? 'জনপ্রিয় কোর্সসমূহ' : 'Popular Courses'}</div>
          <h2 class="section-title">${i18n.getLang() === 'bn' ? 'সেরা শিক্ষকদের সাথে লাইভ ও রেকর্ডেড ক্লাস' : 'Learn with Top Educators'}</h2>
        </div>

        <div class="courses-grid">
          ${courses.map(c => `
            <div class="course-card">
              <div class="course-thumb-wrap">
                <img src="${c.thumbnail}" alt="${c.title}" loading="lazy">
                <span class="course-category-badge badge badge-${c.category.toLowerCase()}">${c.category}</span>
              </div>
              <div class="course-body">
                <div class="course-instructor">
                  <img src="${c.instructor.avatar}" alt="${c.instructor.name}">
                  <span>${c.instructor.name}</span>
                </div>
                <h3 class="course-title" title="${c.title}">${c.title}</h3>
                <div class="course-meta">
                  <span>${icons.video} ${c.totalClasses} ক্লাস</span>
                  <span>${icons.clock} ${c.duration}</span>
                  <span>${icons.star} ${c.rating}</span>
                </div>
                <div class="course-footer">
                  <div class="course-price-wrap">
                    <span class="current-price">${formatBDT(c.price)}</span>
                    <span class="original-price">${formatBDT(c.originalPrice)}</span>
                  </div>
                  <a href="#/course/${c.id}" class="btn btn-primary btn-sm">
                    ${i18n.getLang() === 'bn' ? 'বিস্তারিত দেখুন' : 'View Course'}
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Upcoming Exams Section -->
      <section class="container">
        <div class="section-header">
          <div class="section-tag">${i18n.getLang() === 'bn' ? 'লাইভ ও মডেল টেস্ট' : 'Upcoming Exams'}</div>
          <h2 class="section-title">${i18n.getLang() === 'bn' ? 'নিজেকে যাচাই করো দেশসেরা শিক্ষার্থীদের সাথে' : 'Test Your Skills Live'}</h2>
        </div>

        <div class="exams-grid">
          ${exams.map(e => `
            <div class="exam-card">
              <div class="exam-card-header">
                <span class="badge badge-${e.category.toLowerCase()}">${e.category}</span>
                <span class="badge badge-live">LIVE</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; line-height: 1.35;">${e.title}</h3>
              <div class="exam-meta-grid">
                <div class="exam-meta-box">
                  <div class="num">${e.totalQuestions} টি</div>
                  <div class="lbl">প্রশ্ন</div>
                </div>
                <div class="exam-meta-box">
                  <div class="num">${e.durationMinutes} মি.</div>
                  <div class="lbl">সময়</div>
                </div>
                <div class="exam-meta-box">
                  <div class="num">${e.totalMarks} মার্কস</div>
                  <div class="lbl">পূর্ণমান</div>
                </div>
              </div>
              <a href="#/exam/${e.id}" class="btn btn-primary btn-block">
                ${icons.play} ${i18n.t('startExam')}
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- AI Assistant Banner Showcase -->
      <section class="container">
        <div class="ai-showcase-banner">
          <div class="ai-showcase-content">
            <span class="badge badge-ssc" style="background: rgba(255,255,255,0.2); color: white; border: none; margin-bottom: 0.75rem;">
              ${icons.sparkles} Smart 24/7 AI Tutor
            </span>
            <h2>জেনেসিওন একাডেমি এআই স্টাডি অ্যাসিস্ট্যান্ট</h2>
            <p>
              পড়ার মাঝে যেকোনো আটকে যাওয়া কঠিন টপিক বুঝিয়ে নেওয়া, যেকোনো প্রশ্নের সমাধান বের করা কিংবা মুহূর্তেই স্পেশাল পড়ার রুটিন তৈরি করুন এক ক্লিকে।
            </p>
            <a href="#/ai" class="btn btn-secondary btn-lg" style="color: var(--primary); font-weight: 700;">
              ${icons.sparkles} এআই সহকারী ব্যবহার করুন
            </a>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="container">
        <div class="section-header">
          <div class="section-tag">কেন জেনেসিওন একাডেমি প্ল্যাটফর্ম?</div>
          <h2 class="section-title">যে কারণে জেনেসিওন একাডেমি লাখো শিক্ষার্থীর ১ম পছন্দ</h2>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🎯</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">টপ-ক্লাস শিক্ষক মণ্ডলী</h4>
              <p class="text-muted" style="font-size: 0.875rem;">বুয়েট, ঢাকা বিশ্ববিদ্যালয় ও বিসিএস ক্যাডারদের প্রত্যক্ষ তত্ত্বাবধানে তৈরি ক্লাস।</p>
            </div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📝</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট</h4>
              <p class="text-muted" style="font-size: 0.875rem;">নেগেটিভ মার্কিং সহ রিয়েলটাইম এক্সাম ইন্টারফেস এবং অল-বাংলাদেশ মেধা তালিকা।</p>
            </div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📚</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">বিশাল প্রশ্নব্যাংক ও ব্যাখ্যা</h4>
              <p class="text-muted" style="font-size: 0.875rem;">বিগত ১০ বছরের সকল বোর্ড ও বিসিএস প্রিলির নির্ভুল সমাধান ও শর্টকাট।</p>
            </div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">⚡</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">এআই স্টাডি টিউটর</h4>
              <p class="text-muted" style="font-size: 0.875rem;">রাত দিন ২৪ ঘণ্টা যেকোনো পড়াশোনার প্রশ্নের তাৎক্ষণিক সঠিক সমাধান।</p>
            </div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📊</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">দুর্বল টপিক ডায়াগনস্টিক</h4>
              <p class="text-muted" style="font-size: 0.875rem;">কোন বিষয়ে তোমার দুর্বলতা তা স্বয়ংক্রিয়ভাবে চিহ্নিত করে স্পেশাল প্র্যাকটিস।</p>
            </div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💳</div>
            <div>
              <h4 style="margin-bottom: 0.35rem;">সহজ বিকাশ/নগদ পেমেন্ট</h4>
              <p class="text-muted" style="font-size: 0.875rem;">বিকাশ ও নগদ দিয়ে মুহূর্তেই কোর্স এনরোল ও ডিজিটাল শিট ডাউনলোড।</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Student Reviews & Success Stories -->
      <section class="container">
        <div class="section-header">
          <div class="section-tag">সাফল্যের গল্প</div>
          <h2 class="section-title">শিক্ষার্থীরা জেনেসিওন একাডেমি সম্পর্কে কী বলছে</h2>
        </div>

        <div class="reviews-grid">
          <div class="review-card">
            <div style="color: #F59E0B; margin-bottom: 0.5rem;">★★★★★</div>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              "জেনেসিওন একাডেমির পদার্থবিজ্ঞান কোর্স ও মডেল টেস্টগুলো আমার এসএসসি প্রস্তুতিকে সম্পূর্ণ বদলে দিয়েছিল। বোর্ড পরীক্ষায় গোল্ডেন এ+ পেয়েছি!"
            </p>
            <div class="reviewer-info">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="Student">
              <div>
                <h5 style="font-size: 0.95rem;">সাকিব আল হাসান</h5>
                <span class="text-muted" style="font-size: 0.8rem;">এসএসসি ২০২৪ (GPA 5.00) - নটর ডেম কলেজ</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div style="color: #F59E0B; margin-bottom: 0.5rem;">★★★★★</div>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              "৪৭তম বিসিএস প্রিলির জন্য জেনেসিওন একাডেমির প্রশ্নব্যাংক ও এআই টিউটর অবিশ্বাস্য কার্যকরী। দুর্বল বিষয়গুলো সহজেই চিহ্নিত করা যায়।"
            </p>
            <div class="reviewer-info">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Student">
              <div>
                <h5 style="font-size: 0.95rem;">ফারজানা আক্তার</h5>
                <span class="text-muted" style="font-size: 0.8rem;">বিসিএস পরীক্ষার্থী</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div style="color: #F59E0B; margin-bottom: 0.5rem;">★★★★★</div>
            <p style="font-size: 0.95rem; line-height: 1.6;">
              "উচ্চতর গণিতের ক্যালকুলাস আগে খুব কঠিন লাগত। জেনেসিওন একাডেমির ভিডিও লেকচার আর লেকচার শিট দেখে এখন অঙ্ক করতে অনেক ভালো লাগে।"
            </p>
            <div class="reviewer-info">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Student">
              <div>
                <h5 style="font-size: 0.95rem;">মেহজাবিন চৌধুরী</h5>
                <span class="text-muted" style="font-size: 0.8rem;">এইচএসসি ২০২৫ ব্যাচ - ভিকারুননিসা</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="container">
        <div class="section-header">
          <div class="section-tag">সাধারণ জিজ্ঞাসা</div>
          <h2 class="section-title">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
        </div>

        <div class="faq-list">
          <div class="faq-item open">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>কোর্স কীভাবে কিনব এবং পেমেন্ট পদ্ধতি কী?</span>
            </div>
            <div class="faq-answer">
              কোর্স বেছে নিয়ে 'এখনই কিনুন' ক্লিক করুন। পেমেন্টের পর কোর্সটি ড্যাশবোর্ডে পাবেন।
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>রেকর্ডেড ক্লাস কতদিন দেখা যাবে?</span>
            </div>
            <div class="faq-answer">
              আপনার ব্যাচের পরীক্ষা পর্যন্ত ক্লাস ও লেকচার শিট দেখতে পারবেন।
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question" onclick="this.parentElement.classList.toggle('open')">
              <span>এআই স্টাডি অ্যাসিস্ট্যান্ট কি সব প্রশ্নের সমাধান দিতে পারে?</span>
            </div>
            <div class="faq-answer">
              এটি বিভিন্ন বিষয়ের ধারণা বুঝতে ও প্রশ্ন সমাধানে সাহায্য করে।
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="container" style="margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%); border-radius: var(--radius-xl); padding: 3.5rem 2rem; text-align: center; color: white; box-shadow: var(--shadow-xl);">
          <h2 style="color: white; font-size: 2.2rem; margin-bottom: 1rem;">আজই শুরু হোক তোমার সেরা প্রস্তুতি</h2>
          <p style="color: #E0E7FF; font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem;">
            লক্ষ্য যখন বড়, প্রস্তুতিও হোক নিখুঁত। জেনেসিওন একাডেমির সাথে যুক্ত হয়ে নিজের পড়াশোনাকে এক ধাপ এগিয়ে নাও।
          </p>
          <a href="#/register" class="btn btn-lg" style="background: white; color: var(--primary); font-weight: 700; padding: 0.9rem 2.2rem;">
            ${icons.graduation} বিনামূল্যে রেজিস্ট্রেশন করুন
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="main-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <div class="brand-logo" style="margin-bottom: 1rem;">
                ${icons.logo}
                <span>Geneseon Academy</span>
              </div>
              <p class="text-muted" style="font-size: 0.9rem; line-height: 1.6; max-width: 320px;">
                বাংলাদেশের শিক্ষার্থীদের জন্য আধুনিকতম এডুকেশন প্ল্যাটফর্ম। এসএসসি, এইচএসসি এবং চাকরি প্রস্তুতিতে বিশ্বমানের প্রযুক্তির ছোঁয়া।
              </p>
            </div>

            <div class="footer-col">
              <h4>ক্যাটাগরি</h4>
              <ul>
                <li><a href="#/courses?category=SSC">এসএসসি কোর্স (SSC)</a></li>
                <li><a href="#/courses?category=HSC">এইচএসসি কোর্স (HSC)</a></li>
                <li><a href="#/courses?category=JOB">বিসিএস ও চাকরি প্রস্তুতি</a></li>
                <li><a href="#/exam">অনলাইন মডেল টেস্ট</a></li>
                <li><a href="#/question-bank">ডিজিটাল প্রশ্নব্যাংক</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>ফিচারসমূহ</h4>
              <ul>
                <li><a href="#/ai">এআই স্টাডি অ্যাসিস্ট্যান্ট</a></li>
                <li><a href="#/question-bank/practice">কাস্টম প্র্যাকটিস টেস্ট</a></li>
                <li><a href="#/store">বই ও লেকচার নোটস</a></li>
                <li><a href="#/dashboard">শিক্ষার্থী ড্যাশবোর্ড</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>যোগাযোগ ও নীতি</h4>
              <ul>
                <li><a href="#/">আমাদের সম্পর্কে</a></li>
                <li><a href="#/">শর্তাবলী ও নিয়মাবলী</a></li>
                <li><a href="#/">গোপনীয়তা নীতি (Privacy)</a></li>
                <li><a href="#/">রিফান্ড পলিসি</a></li>
                <li><a href="#/">হেল্পলাইন: ০৯৬১১-২২৩৩৪৪</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>© 2026 Geneseon Academy. সর্বস্বত্ব সংরক্ষিত।</div>
            <div>Built for Bangladeshi Students with ❤️</div>
          </div>
        </div>
      </footer>
    `;
  }
};


/* --- [js/views/coursesView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - COURSES CATALOG & COURSE DETAIL VIEW
   ========================================================================== */
const CoursesView = window.CoursesView = {
  renderCatalog(activeCategory = 'ALL') {
    const user = Auth.getUser();
    if (user && !Auth.isAdmin()) activeCategory = user.educationType;
    let courses = db.getCourses();
    if (activeCategory && activeCategory !== 'ALL') {
      courses = courses.filter(c => c.category === activeCategory);
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center" style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">অনলাইন কোর্সসমূহ</h1>
          <p class="text-muted">এসএসসি, এইচএসসি ও চাকরি প্রস্তুতির জন্য বাছাইকৃত সেরা কোর্স</p>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips justify-center" style="margin-bottom: 2.5rem;">
          ${user && !Auth.isAdmin()
            ? `<span class="chip-btn active">${activeCategory} কোর্স (${courses.length})</span>`
            : `
              <button class="chip-btn ${activeCategory === 'ALL' ? 'active' : ''}" onclick="window.location.hash='#/courses'">সকল কোর্স (${db.getCourses().length})</button>
              <button class="chip-btn ${activeCategory === 'SSC' ? 'active' : ''}" onclick="window.location.hash='#/courses?category=SSC'">এসএসসি (SSC)</button>
              <button class="chip-btn ${activeCategory === 'HSC' ? 'active' : ''}" onclick="window.location.hash='#/courses?category=HSC'">এইচএসসি (HSC)</button>
              <button class="chip-btn ${activeCategory === 'JOB' ? 'active' : ''}" onclick="window.location.hash='#/courses?category=JOB'">চাকরি প্রস্তুতি (Job)</button>
            `}
        </div>

        ${courses.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${icons.book}</div>
            <h3 class="empty-state-title">কোনো কোর্স পাওয়া যায়নি</h3>
            <p class="empty-state-text">এই ক্যাটাগরিতে বর্তমানে কোনো কোর্স নেই।</p>
          </div>
        ` : `
          <div class="courses-grid">
            ${courses.map(c => `
              <div class="course-card">
                <div class="course-thumb-wrap">
                  <img src="${c.thumbnail}" alt="${c.title}" loading="lazy">
                  <span class="course-category-badge badge badge-${c.category.toLowerCase()}">${c.category}</span>
                </div>
                <div class="course-body">
                  <div class="course-instructor">
                    <img src="${c.instructor.avatar}" alt="${c.instructor.name}">
                    <span>${c.instructor.name}</span>
                  </div>
                  <h3 class="course-title" title="${c.title}">${c.title}</h3>
                  <div class="course-meta">
                    <span>${icons.video} ${c.totalClasses} ক্লাস</span>
                    <span>${icons.clock} ${c.duration}</span>
                    <span>${icons.star} ${c.rating}</span>
                  </div>
                  <div class="course-footer">
                    <div class="course-price-wrap">
                      <span class="current-price">${formatBDT(c.price)}</span>
                      <span class="original-price">${formatBDT(c.originalPrice)}</span>
                    </div>
                    <a href="#/course/${c.id}" class="btn btn-primary btn-sm">
                      বিস্তারিত দেখুন
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  renderDetail(courseId) {
    const course = db.getCourseById(courseId);
    if (!course || (Auth.getUser() && !Auth.canAccessCategory(course.category))) {
      return `
        <div class="container text-center" style="padding: 4rem 1rem;">
          <h2>${course ? 'এই কোর্সটি আপনার অ্যাকাউন্টের জন্য উপলভ্য নয়' : 'কোর্সটি পাওয়া যায়নি'}</h2>
          <a href="#/courses" class="btn btn-primary" style="margin-top: 1rem;">আমার কোর্সগুলো দেখুন</a>
        </div>
      `;
    }

    const isEnrolled = Auth.canAccessCourse(course);

    return `
      <div class="container" style="padding-top: 2rem;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start;" class="course-detail-layout">
          <!-- Left Column -->
          <div>
            <div style="margin-bottom: 1.5rem;">
              <span class="badge badge-${course.category.toLowerCase()}" style="margin-bottom: 0.75rem;">${course.category} Preparation</span>
              <h1 style="font-size: 2rem; line-height: 1.3; margin-bottom: 1rem;">${course.title}</h1>
              
              <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; color: var(--text-muted); font-size: 0.9rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <img src="${course.instructor.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
                  <span style="font-weight: 600; color: var(--text-main);">${course.instructor.name}</span>
                </div>
                <span>${icons.star} <strong>${course.rating}</strong> (${course.studentsCount} শিক্ষার্থী)</span>
                <span>${icons.clock} ${course.duration}</span>
                <span>🌐 ${course.language}</span>
              </div>
            </div>

            <!-- Video Preview / Thumbnail -->
            <div style="border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 2rem; border: 1px solid var(--border-color); background: black; aspect-ratio: 16/9; max-height: 420px;">
              ${isEnrolled && course.previewVideo
                ? course.previewVideo.startsWith('/api/media/')
                  ? `<video controls controlsList="nodownload" style="width:100%;height:100%;"><source src="${course.previewVideo}" type="${course.previewVideoType || 'video/mp4'}"></video>`
                  : `<iframe src="${course.previewVideo}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`
                : `<div style="display:grid;place-items:center;height:100%;color:white;text-align:center;padding:1rem;">🔒 অ্যাডমিন অনুমোদনের পর কোর্সের ক্লাস দেখতে পারবেন</div>`}
            </div>

            <!-- Description -->
            <div class="card" style="margin-bottom: 1.75rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">কোর্স বিবরণী</h3>
              <p style="color: var(--text-muted); line-height: 1.7;">${course.description}</p>
            </div>

            <!-- What you will learn -->
            ${course.whatYouWillLearn ? `
              <div class="card" style="margin-bottom: 1.75rem;">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">এই কোর্সে যা যা শিখবে</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  ${course.whatYouWillLearn.map(item => `
                    <div style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.925rem;">
                      <span style="color: var(--success); flex-shrink: 0; margin-top: 2px;">${icons.check}</span>
                      <span>${item}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Course Curriculum Tree -->
            <div class="card" style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">কোর্স কারিকুলাম ও সিলেবাস</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${(course.chapters || []).map(chap => `
                  <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                    <div style="padding: 0.85rem 1.25rem; background: var(--bg-card-subtle); font-weight: 700; display: flex; justify-content: space-between;">
                      <span>${chap.title}</span>
                      <span class="text-muted" style="font-size: 0.85rem;">${chap.lessons.length} লেকচার</span>
                    </div>
                    <div>
                      ${chap.lessons.map(les => `
                        <div style="padding: 0.75rem 1.25rem; border-top: 1px solid var(--divider); display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem;">
                          <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="color: var(--primary);">${icons.play}</span>
                            <span>${les.title}</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 0.75rem;">
                            ${les.isPreview ? '<span class="badge badge-ssc">ফ্রি প্রিভিউ</span>' : '<span style="color: var(--text-subtle);">' + icons.lock + '</span>'}
                            <span class="text-muted" style="font-size: 0.8rem;">${les.duration}</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Sticky Pricing Card -->
          <div style="position: sticky; top: 90px;">
            <div class="card" style="padding: 1.75rem; box-shadow: var(--shadow-lg);">
              <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1.25rem;">
                <span style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary);">
                  ${formatBDT(course.price)}
                </span>
                <span style="font-size: 1.1rem; text-decoration: line-through; color: var(--text-subtle);">
                  ${formatBDT(course.originalPrice)}
                </span>
                <span class="badge badge-danger">${course.discount}% OFF</span>
              </div>

              ${isEnrolled ? `
                <a href="#/learn/course/${course.id}" class="btn btn-success btn-lg btn-block" style="margin-bottom: 1rem;">
                  ${icons.play} পড়া চালিয়ে যান (Continue Learning)
                </a>
              ` : `
                <button class="btn btn-glowing btn-lg btn-block" onclick="window.addToCartAndCheckout('${course.id}', 'course')" style="margin-bottom: 1rem;">
                  ${icons.graduation} এখনই কোর্সটি কিনুন
                </button>
                <button class="btn btn-outline btn-block" onclick="window.addToCartOnly('${course.id}', 'course')">
                  ${icons.shoppingCart} কার্টে যোগ করুন
                </button>
              `}

              <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--divider); display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  ${icons.video} <span>${course.totalClasses} টি লাইভ ও রেকর্ডেড ক্লাস</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  ${icons.fileText} <span>প্রতিটি ক্লাসের এইচডি লেকচার শিট (PDF)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  ${icons.sparkles} <span>২৪/৭ এআই ডাউট সলভ অ্যাসিস্ট্যান্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};


/* --- [js/views/learnView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - COURSE LEARNING & VIDEO PLAYER VIEW
   ========================================================================== */




let activeLessonId = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
const LearnView = window.LearnView = {
  render(courseId) {
    const course = db.getCourseById(courseId);
    if (!course || !Auth.canAccessCategory(course.category)) {
      return `<div class="container text-center" style="padding: 4rem;"><h2>কোর্সটি পাওয়া যায়নি</h2><a href="#/courses" class="btn btn-primary">সকল কোর্স</a></div>`;
    }

    const user = Auth.getUser();
    if (!Auth.canAccessCourse(course)) {
      return `
        <div class="container text-center" style="padding: 4rem 1rem;">
          <h2>🔒 কোর্সটি এখনো লক করা আছে</h2>
          <p class="text-muted" style="margin: 1rem 0;">অর্ডার করার পর অ্যাডমিন অনুমোদন দিলে কোর্সটি আপনার My Courses-এ যোগ হবে। অনুমোদনের আগে ক্লাস দেখা যাবে না।</p>
          <a href="#/course/${course.id}" class="btn btn-primary">কোর্স অর্ডার করুন</a>
          <a href="#/my-courses" class="btn btn-secondary" style="margin-left: 0.5rem;">My Courses</a>
        </div>
      `;
    }
    const completedLessons = new Set(user.completedLessons || []);

    // Flatten all lessons
    const allLessons = [];
    (course.chapters || []).forEach(ch => {
      ch.lessons.forEach(l => allLessons.push({ ...l, chapterTitle: ch.title }));
    });

    if (!activeLessonId && allLessons.length > 0) {
      activeLessonId = allLessons[0].id;
    }

    const currentLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0] || {};
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    const progressPercent = Math.round((completedLessons.size / Math.max(1, allLessons.length)) * 100);
    const lessonPdfs = [
      { url: currentLesson.pdfUrl, title: currentLesson.pdfTitle || 'লেকচার PDF' },
      { url: currentLesson.notesPdfUrl, title: currentLesson.notesPdfTitle || 'Notes PDF' }
    ].filter(resource => resource.url && resource.url !== '#');

    return `
      <div class="learn-layout">
        <!-- Sidebar Curriculum Tree -->
        <aside class="learn-sidebar">
          <div class="learn-sidebar-header">
            <h2 title="${course.title}">${course.title}</h2>
            <div class="curriculum-progress-wrap">
              <div class="meta">
                <span>কোর্স অগ্রগতি</span>
                <strong>${progressPercent}% সমাপ্ত</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <div class="curriculum-list">
            ${(course.chapters || []).map((ch, chIdx) => `
              <div class="chapter-group">
                <div class="chapter-header">
                  <span>${ch.title}</span>
                  <span class="text-muted" style="font-size: 0.8rem;">${ch.lessons.length} ক্লাস</span>
                </div>
                <ul class="chapter-lessons">
                  ${ch.lessons.map(les => {
                    const isDone = completedLessons.has(les.id);
                    const isCur = les.id === currentLesson.id;
                    return `
                      <li class="lesson-item ${isCur ? 'active' : ''}" onclick="window.selectLesson('${course.id}', '${les.id}')">
                        <div class="lesson-status-icon ${isDone ? 'completed' : isCur ? 'current' : ''}">
                          ${isDone ? icons.check : isCur ? icons.play : (chIdx + 1)}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                          <div style="font-weight: ${isCur ? '700' : '500'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${les.title}
                          </div>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">${les.duration}</div>
                        </div>
                      </li>
                    `;
                  }).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- Main Video & Content Area -->
        <main class="learn-main">
          <!-- Video Player -->
          <div class="video-container">
            ${currentLesson.videoUrl ? `
              <video id="course-video-player" controls style="width: 100%; height: 100%;" poster="${escapeHtml(course.thumbnail)}">
                <source src="${escapeHtml(currentLesson.videoUrl)}" type="${escapeHtml(currentLesson.contentType || 'video/mp4')}">
                Your browser does not support the video tag.
              </video>
            ` : '<div class="text-center text-muted" style="padding: 4rem 1rem;">এই লেকচারে ভিডিও যোগ করা নেই। নিচে PDF ও Notes দেখুন।</div>'}
          </div>

          <!-- Player Controls Bar -->
          <div class="player-controls-bar">
            <div>
              <span class="badge badge-ssc" style="margin-bottom: 0.25rem;">${escapeHtml(currentLesson.chapterTitle || 'Chapter')}</span>
              <h3 style="font-size: 1.15rem;">${escapeHtml(currentLesson.title || 'Lesson Title')}</h3>
            </div>

            <div class="player-nav-btns">
              <button class="btn btn-secondary btn-sm" ${currentIndex <= 0 ? 'disabled' : ''} onclick="window.navLesson('${course.id}', ${currentIndex - 1})">
                ${icons.chevronRight} পূর্ববর্তী ক্লাস
              </button>

              <button class="btn ${completedLessons.has(currentLesson.id) ? 'btn-success' : 'btn-outline'} btn-sm" onclick="window.toggleCompleteLesson('${course.id}', '${currentLesson.id}')">
                ${icons.checkCircle} ${completedLessons.has(currentLesson.id) ? '✓ সম্পন্ন হয়েছে' : 'সম্পন্ন চিহ্নিত করুন'}
              </button>

              <button class="btn btn-primary btn-sm" ${currentIndex >= allLessons.length - 1 ? 'disabled' : ''} onclick="window.navLesson('${course.id}', ${currentIndex + 1})">
                পরবর্তী ক্লাস ${icons.chevronRight}
              </button>
            </div>
          </div>

          <!-- Tabs under Video -->
          <div class="learn-tabs-wrapper">
            <div class="tabs-nav">
              <button class="tab-btn active" onclick="window.switchLearnTab('tab-notes')">লেকচার নোটস ও বিবরণ</button>
              <button class="tab-btn" onclick="window.switchLearnTab('tab-resources')">PDF ও রিসোর্স (${lessonPdfs.length})</button>
              <button class="tab-btn" onclick="window.switchLearnTab('tab-discussion')">প্রশ্নোত্তর ও আলোচনা (১২)</button>
              <button class="tab-btn" onclick="window.switchLearnTab('tab-ai-help')">⚡ এআই টিউটর সহায়তা</button>
            </div>

            <!-- Tab: Notes -->
            <div id="tab-notes" class="tab-pane active">
              <div class="card">
                <h4 style="margin-bottom: 0.75rem;">লেকচার সারসংক্ষেপ</h4>
                <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem; white-space: pre-wrap;">
                  ${currentLesson.notes ? escapeHtml(currentLesson.notes) : 'এই লেকচারের জন্য Notes যোগ করা হয়নি।'}
                </p>
                <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md);">
                  <strong style="color: var(--primary);">💡 গুরুত্বপূর্ণ টিপস:</strong>
                  <p style="font-size: 0.9rem; margin-top: 0.25rem;">লেকচারটি মনোযোগ দিয়ে দেখার পর জেনেসিওন একাডেমি প্রশ্নব্যাংকে গিয়ে এই টপিকের অন্তত ১০টি MCQ প্র্যাকটিস করুন।</p>
                </div>
              </div>
            </div>

            <!-- Tab: Resources -->
            <div id="tab-resources" class="tab-pane">
              ${lessonPdfs.length ? lessonPdfs.map(resource => `
                  <div class="resource-card">
                    <div class="resource-info">
                      <div class="resource-icon">📄</div>
                      <div>
                        <h5 style="font-size: 0.95rem;">${escapeHtml(resource.title)}</h5>
                        <span class="text-muted" style="font-size: 0.8rem;">এই Lecture-এর PDF রিসোর্স</span>
                      </div>
                    </div>
                    <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                      ${icons.download} PDF খুলুন
                    </a>
                  </div>
                `).join('') : '<p class="text-muted">এই Lecture-এর জন্য PDF যোগ করা হয়নি।</p>'}
            </div>

            <!-- Tab: Discussion -->
            <div id="tab-discussion" class="tab-pane">
              <div class="discussion-input-wrap">
                <input type="text" id="discussion-comment-input" class="form-input" placeholder="এই লেকচার সম্পর্কে যেকোনো প্রশ্ন করুন...">
                <button class="btn btn-primary" onclick="window.postComment()">পোস্ট করুন</button>
              </div>

              <div id="discussion-comments-list">
                <div class="comment-item">
                  <div class="comment-author">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80">
                    <div>
                      <strong style="font-size: 0.9rem;">ইঞ্জি. মো. রফিকুল ইসলাম (শিক্ষক)</strong>
                      <span class="text-muted" style="font-size: 0.75rem; margin-left: 0.5rem;">১ ঘণ্টা আগে</span>
                    </div>
                  </div>
                  <p class="comment-text">স্ক্রু গজ সংক্রান্ত কোনো সূত্র বুঝতে অসুবিধা হলে কমেন্টে জানাও অথবা এআই সহকারীকে জিজ্ঞেস করতে পারো।</p>
                </div>

                <div class="comment-item">
                  <div class="comment-author">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&auto=format&fit=crop&q=80">
                    <div>
                      <strong style="font-size: 0.9rem;">সাকিব আল হাসান</strong>
                      <span class="text-muted" style="font-size: 0.75rem; margin-left: 0.5rem;">৩ ঘণ্টা আগে</span>
                    </div>
                  </div>
                  <p class="comment-text">স্যার, পিচ এবং লঘিষ্ঠ গণনের সম্পর্কটা এই ক্লাসে খুব সুন্দরভাবে ক্লিয়ার হয়েছে। ধন্যবাদ!</p>
                </div>
              </div>
            </div>

            <!-- Tab: AI Help -->
            <div id="tab-ai-help" class="tab-pane">
              <div class="card" style="border: 2px solid var(--primary-glow);">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                  <div style="background: var(--primary); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    ${icons.sparkles}
                  </div>
                  <div>
                    <h4 style="font-size: 1.05rem;">এই লেকচারের এআই টিউটর</h4>
                    <p class="text-muted" style="font-size: 0.8rem;">বর্তমান লেকচার: <strong>${currentLesson.title}</strong></p>
                  </div>
                </div>

                <div class="ai-quick-pills" style="margin-bottom: 1rem;">
                  <button class="quick-pill" onclick="window.askLessonAi('এই লেকচারের মূল সূত্রগুলো পয়েন্ট আকারে বুঝিয়ে দাও')">📌 সূত্রের তালিকা</button>
                  <button class="quick-pill" onclick="window.askLessonAi('এই ক্লাসের উপর ভিত্তি করে ৩টি MCQ কুইজ দাও')">🎯 কুইজ প্রশ্ন</button>
                  <button class="quick-pill" onclick="window.askLessonAi('বোর্ড পরীক্ষায় এই অধ্যায়ের কোন প্রশ্ন বেশি আসে?')">📝 বোর্ড প্রশ্ন এনালাইসিস</button>
                </div>

                <div id="lesson-ai-response" style="background: var(--bg-card-subtle); padding: 1.25rem; border-radius: var(--radius-md); font-size: 0.925rem; line-height: 1.6; display: none;"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }
};

// Global handlers for Learn View
window.selectLesson = (courseId, lessonId) => {
  activeLessonId = lessonId;
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = LearnView.render(courseId);
};

window.navLesson = (courseId, newIndex) => {
  const course = db.getCourseById(courseId);
  const allLessons = [];
  (course.chapters || []).forEach(ch => ch.lessons.forEach(l => allLessons.push(l)));
  if (allLessons[newIndex]) {
    activeLessonId = allLessons[newIndex].id;
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = LearnView.render(courseId);
  }
};

window.toggleCompleteLesson = (courseId, lessonId) => {
  const user = Auth.getUser();
  if (!user) return;
  const set = new Set(user.completedLessons || []);
  if (set.has(lessonId)) {
    set.delete(lessonId);
    Toast.info('ক্লাসটি অসম্পূর্ণ হিসেবে চিহ্নিত করা হয়েছে');
  } else {
    set.add(lessonId);
    launchConfetti();
    Toast.success('সাবাশ! ক্লাসটি সফলভাবে সম্পন্ন হয়েছে 🎉');
  }
  Auth.updateProfile({ completedLessons: Array.from(set) });
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = LearnView.render(courseId);
};

window.switchLearnTab = (tabId, evt = null) => {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  const target = evt?.target || (typeof event !== 'undefined' ? event.target : null);
  if (target) target.classList.add('active');
};

window.postComment = () => {
  const input = document.getElementById('discussion-comment-input');
  if (!input || !input.value.trim()) return;
  const list = document.getElementById('discussion-comments-list');
  const user = Auth.getUser() || { name: 'Student', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50' };

  const div = document.createElement('div');
  div.className = 'comment-item';
  div.innerHTML = `
    <div class="comment-author">
      <img src="${user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50'}">
      <div>
        <strong style="font-size: 0.9rem;">${user.name}</strong>
        <span class="text-muted" style="font-size: 0.75rem; margin-left: 0.5rem;">মাত্র এইমাত্র</span>
      </div>
    </div>
    <p class="comment-text">${input.value.trim()}</p>
  `;
  list?.prepend(div);
  input.value = '';
  Toast.success('আপনার প্রশ্নটি সফলভাবে পোস্ট হয়েছে!');
};

window.askLessonAi = (prompt) => {
  const resBox = document.getElementById('lesson-ai-response');
  if (!resBox) return;
  resBox.style.display = 'block';
  resBox.innerHTML = '⚡ এআই টিউটর উত্তর তৈরি করছে...';

  setTimeout(() => {
    resBox.innerHTML = `
      <div style="color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">🤖 জেনেসিওন একাডেমি এআই টিউটর উত্তর:</div>
      <p><strong>${prompt}</strong></p>
      <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0.5rem 0;">
      <p>১. <strong>ভার্নিয়ার ধ্রুবক (VC):</strong> $VC = \\frac{s}{n}$ (যেখানে $s$ মূল স্কেলের ১ ভাগের দৈর্ঘ্য এবং $n$ ভার্নিয়ারের ভাগ সংখ্যা)।</p>
      <p>২. <strong>স্ক্রু গজের লঘিষ্ঠ গণন (LC):</strong> $LC = \\frac{\\text{Pitch}}{\\text{বৃত্তাকার স্কেলের ভাগ সংখ্যা}}$।</p>
      <p>৩. <strong>বোর্ড পরীক্ষার টিপস:</strong> ঢাকা বোর্ড ও রাজশাহী বোর্ডে স্ক্রু গজের যান্ত্রিক ত্রুটির (+/-) অংক প্রতি বছর CQ এর 'গ' নম্বরে আসে।</p>
    `;
  }, 600);
};


/* --- [js/views/examView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - EXAM RUNNER & DIAGNOSTIC RESULTS VIEW
   ========================================================================== */







let timerInterval = null;
let scheduleInterval = null;
let guardedSessionId = null;
let visibilityChangeHandler = null;
let beforeUnloadHandler = null;
let examKeyHandler = null;
let examContextMenuHandler = null;

function getScheduleState(exam, now = Date.now()) {
  const startAt = exam.startAt ? Date.parse(exam.startAt) : null;
  const endAt = exam.endAt ? Date.parse(exam.endAt) : null;
  const upcoming = Number.isFinite(startAt) && now < startAt;
  const expired = Number.isFinite(endAt) && now >= endAt;
  return {
    upcoming,
    expired,
    live: !upcoming && !expired,
    countdown: upcoming ? Math.max(0, Math.ceil((startAt - now) / 1000)) : 0
  };
}

function formatCountdown(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  const format = value => String(value).padStart(2, '0').replace(/\d/g, digit =>
    String.fromCharCode('০'.charCodeAt(0) + Number(digit))
  );
  return `${format(hours)}:${format(minutes)}:${format(remainder)}`;
}

function updateScheduleDisplay(exams) {
  const now = Date.now();
  exams.forEach(exam => {
    const state = getScheduleState(exam, now);
    const badge = [...document.querySelectorAll('[data-exam-status]')]
      .find(element => element.dataset.examStatus === exam.id);
    const button = [...document.querySelectorAll('[data-exam-action]')]
      .find(element => element.dataset.examAction === exam.id);
    if (badge) {
      badge.className = `badge ${state.live ? 'badge-live' : state.expired ? 'badge-danger' : 'badge-warning'}`;
      badge.textContent = state.live ? 'LIVE' : state.expired ? 'সময় শেষ' : 'শুরু হতে বাকি';
    }
    if (button) {
      button.setAttribute('aria-disabled', String(state.upcoming || state.expired));
      const label = button.querySelector('[data-exam-label]');
      if (label) label.textContent = state.upcoming
        ? `শুরু হতে বাকি ${formatCountdown(state.countdown)}`
        : state.expired ? 'সময় শেষ' : 'পরীক্ষা শুরু করুন';
    }
  });
}

function clearExamGuards() {
  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
  }
  if (beforeUnloadHandler) window.removeEventListener('beforeunload', beforeUnloadHandler);
  if (examKeyHandler) document.removeEventListener('keydown', examKeyHandler, true);
  if (examContextMenuHandler) {
    document.removeEventListener('contextmenu', examContextMenuHandler, true);
  }
  visibilityChangeHandler = null;
  beforeUnloadHandler = null;
  examKeyHandler = null;
  examContextMenuHandler = null;
  guardedSessionId = null;
}

function guardExamSession(session) {
  if (guardedSessionId === session.examId) return;
  clearExamGuards();
  guardedSessionId = session.examId;

  visibilityChangeHandler = () => {
    if (document.visibilityState === 'hidden') {
      session.visibilityLossCount = (session.visibilityLossCount || 0) + 1;
    } else if (session.visibilityLossCount > 2) {
      Toast.warning('পরীক্ষার সময় দুইবারের বেশি অন্য ট্যাব/অ্যাপে গিয়েছেন। পরীক্ষার কার্যক্রম নজরদারিতে আছে।');
    }
  };
  beforeUnloadHandler = event => {
    event.preventDefault();
    event.returnValue = '';
  };
  examKeyHandler = event => {
    const key = event.key.toLowerCase();
    if (
      key === 'printscreen' ||
      ((event.ctrlKey || event.metaKey) && key === 'p') ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 's')
    ) {
      event.preventDefault();
      Toast.warning('পরীক্ষার সময় browser-এর screenshot/print shortcut ব্যবহার করা যাবে না।');
    }
  };
  examContextMenuHandler = event => event.preventDefault();

  document.addEventListener('visibilitychange', visibilityChangeHandler);
  window.addEventListener('beforeunload', beforeUnloadHandler);
  document.addEventListener('keydown', examKeyHandler, true);
  document.addEventListener('contextmenu', examContextMenuHandler, true);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
const ExamView = window.ExamView = {
  renderList(activeTab = 'ALL') {
    if (scheduleInterval) clearInterval(scheduleInterval);
    const user = Auth.getUser();
    if (user && !Auth.isAdmin()) activeTab = user.educationType;
    let exams = db.getExams();
    if (activeTab && activeTab !== 'ALL') {
      exams = exams.filter(e => e.category === activeTab);
    }

    const markup = `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">অনলাইন পরীক্ষা ও মডেল টেস্ট</h1>
          <p class="text-muted">বোর্ড স্ট্যান্ডার্ড প্রশ্ন ও নেগেটিভ মার্কিং সহ রিয়েলটাইম এক্সাম</p>
        </div>

        <div class="filter-chips justify-center" style="margin-bottom: 2.5rem;">
          ${user && !Auth.isAdmin()
            ? `<span class="chip-btn active">${activeTab} মডেল টেস্ট (${exams.length})</span>`
            : `
              <button class="chip-btn ${activeTab === 'ALL' ? 'active' : ''}" onclick="window.location.hash='#/exam'">সকল পরীক্ষা</button>
              <button class="chip-btn ${activeTab === 'SSC' ? 'active' : ''}" onclick="window.location.hash='#/exam?category=SSC'">এসএসসি (SSC)</button>
              <button class="chip-btn ${activeTab === 'HSC' ? 'active' : ''}" onclick="window.location.hash='#/exam?category=HSC'">এইচএসসি (HSC)</button>
              <button class="chip-btn ${activeTab === 'JOB' ? 'active' : ''}" onclick="window.location.hash='#/exam?category=JOB'">বিসিএস ও চাকরি</button>
            `}
        </div>

        <div class="exams-grid">
          ${exams.map(e => {
            const schedule = getScheduleState(e);
            return `
            <div class="exam-card">
              <div class="exam-card-header">
                <span class="badge badge-${e.category.toLowerCase()}">${e.category}</span>
                <span class="badge ${schedule.live ? 'badge-live' : schedule.expired ? 'badge-danger' : 'badge-warning'}" data-exam-status="${escapeHtml(e.id)}">${schedule.live ? 'LIVE' : schedule.expired ? 'সময় শেষ' : 'শুরু হতে বাকি'}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; line-height: 1.4;">${e.title}</h3>
              <div class="exam-meta-grid">
                <div class="exam-meta-box">
                  <div class="num">${e.totalQuestions} টি</div>
                  <div class="lbl">মোট প্রশ্ন</div>
                </div>
                <div class="exam-meta-box">
                  <div class="num">${e.durationMinutes} মি.</div>
                  <div class="lbl">সময়সীমা</div>
                </div>
                <div class="exam-meta-box">
                  <div class="num">${e.totalMarks}</div>
                  <div class="lbl">পূর্ণমান</div>
                </div>
              </div>
              <div style="font-size: 0.8rem; color: var(--danger); font-weight: 500;">
                ⚠️ ভুল উত্তরের জন্য -${e.negativeMarking} নম্বর কাটা যাবে
              </div>
              <a href="#/exam/${escapeHtml(e.id)}" class="btn btn-primary btn-lg btn-block exam-start-button" data-exam-action="${escapeHtml(e.id)}" aria-disabled="${schedule.upcoming || schedule.expired}" onclick="return window.openScheduledExam('${escapeHtml(e.id)}', event)">
                ${icons.play}<span data-exam-label>${schedule.upcoming ? `শুরু হতে বাকি ${formatCountdown(schedule.countdown)}` : schedule.expired ? 'সময় শেষ' : 'পরীক্ষা শুরু করুন'}</span>
              </a>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
    if (exams.some(exam => exam.startAt || exam.endAt)) {
      scheduleInterval = setInterval(() => updateScheduleDisplay(exams), 1000);
    }
    return markup;
  },

  renderRunner(examId) {
    if (scheduleInterval) clearInterval(scheduleInterval);
    const activeSession = ExamService.getCurrentSession();
    const session = activeSession?.examId === examId && activeSession.userId === Auth.getUser()?.id
      ? activeSession
      : ExamService.startExam(examId);
    if (!session) {
      return `<div class="container text-center" style="padding: 4rem;"><h2>পরীক্ষাটি পাওয়া যায়নি</h2><a href="#/exam" class="btn btn-primary">সকল পরীক্ষা</a></div>`;
    }
    if (!Auth.isAdmin()) guardExamSession(session);

    // Start timer interval if not active
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!session) {
        clearInterval(timerInterval);
        return;
      }
      session.remainingSeconds = Math.max(
        0,
        Math.ceil((session.deadlineAt - Date.now()) / 1000)
      );
      const timerEl = document.getElementById('exam-live-timer');
      if (timerEl) {
        const mins = Math.floor(session.remainingSeconds / 60);
        const secs = session.remainingSeconds % 60;
        timerEl.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (session.remainingSeconds <= 120) {
          timerEl.parentElement?.classList.add('urgent');
        }
      }

      if (session.remainingSeconds <= 0) {
        clearInterval(timerInterval);
        Toast.warning('সময় শেষ! পরীক্ষা স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...');
        ExamService.submitExam()
          .then(result => {
            clearExamGuards();
            window.location.hash = `#/exam/result/${result.id}`;
          })
          .catch(error => Toast.error(error.message));
      }
    }, 1000);

    const hasCQ = session.questions.some(question => question.questionType === 'CQ');

    return `
      <div class="exam-runner-body">
        <!-- Top Distraction-Free Header -->
        <header class="exam-top-bar">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="badge badge-${session.category.toLowerCase()}">${session.category}</span>
            <strong style="font-size: 1.05rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px;">
              ${session.examTitle}
            </strong>
          </div>

          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div class="exam-timer-badge">
              ${icons.clock}
              <span id="exam-live-timer">--:--</span>
            </div>

            <button class="btn btn-danger btn-sm" onclick="window.confirmSubmitExam()">
              ${icons.checkCircle} পরীক্ষা জমা দিন
            </button>
          </div>
        </header>

        ${hasCQ ? `
          <section class="exam-cq-upload-banner">
            <div>
              <strong>CQ উত্তরপত্র (PDF) *</strong>
              <p class="text-muted">সব CQ প্রশ্নের উত্তর এক PDF-এ জমা দিন; সর্বোচ্চ ২০ MB।</p>
              <span id="cq-answer-sheet-name">${session.cqAnswerSheet
                ? escapeHtml(session.cqAnswerSheet.name)
                : 'এখনো কোনো PDF নির্বাচন করা হয়নি'}</span>
            </div>
            <label class="btn btn-secondary btn-sm" for="cq-answer-sheet">
              PDF নির্বাচন
              <input id="cq-answer-sheet" type="file" accept="application/pdf,.pdf" hidden onchange="window.selectCQAnswerSheet(event)">
            </label>
          </section>
        ` : ''}

        <!-- All questions stay in one scrollable exam page -->
        <div class="exam-main-container">
          <section class="exam-question-list" aria-label="পরীক্ষার সব প্রশ্ন">
            ${session.questions.map((question, questionIndex) => {
              const selectedOption = session.answers[question.id];
              const isFlagged = session.flagged.has(question.id);
              const isCQQuestion = question.questionType === 'CQ';
              return `
                <article class="question-card-runner" id="exam-question-${questionIndex}" data-question-card="${escapeHtml(question.id)}" data-answered="${selectedOption !== undefined}">
                  <div class="question-runner-header">
                    <span class="question-runner-number">প্রশ্ন ${questionIndex + 1} / ${session.questions.length}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      ${isCQQuestion ? '<span class="badge badge-info" style="font-size: 0.75rem;">CQ • PDF উত্তরপত্রে মূল্যায়ন</span>' : `<span class="badge badge-warning" style="font-size: 0.75rem;">নেগেটিভ মার্ক: -${session.negativeMarking}</span>`}
                      <button class="btn btn-ghost btn-sm" data-flag-question="${escapeHtml(question.id)}" onclick="window.toggleExamFlag('${escapeHtml(question.id)}')" style="color: ${isFlagged ? 'var(--accent)' : 'var(--text-muted)'}">
                        ★ ${isFlagged ? 'রিভিউ থেকে সরান' : 'রিভিউ রাখুন'}
                      </button>
                    </div>
                  </div>

                  ${isCQQuestion ? `
                    <h2 class="question-runner-text">উদ্দীপক: ${escapeHtml(question.stimulus || '')}</h2>
                    ${question.stimulusImageUrl ? `<img src="${escapeHtml(question.stimulusImageUrl)}" alt="উদ্দীপকের ছবি" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1.25rem; border-radius: var(--radius-md);">` : ''}
                    <ol class="exam-cq-parts">
                      ${(question.parts || []).map((part, index) => `
                        <li><strong>${escapeHtml(part.label || ['ক', 'খ', 'গ', 'ঘ'][index])})</strong> ${escapeHtml(part.question || '')}</li>
                      `).join('')}
                    </ol>
                  ` : `
                    <h2 class="question-runner-text">${escapeHtml(question.text)}</h2>
                    ${question.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="প্রশ্নের ছবি" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1.25rem; border-radius: var(--radius-md);">` : ''}
                    <div class="options-runner-list">
                      ${(question.options || []).map((option, optionIndex) => {
                        const isSelected = selectedOption === optionIndex;
                        const prefixes = ['ক', 'খ', 'গ', 'ঘ'];
                        return `
                          <div class="option-runner-item ${isSelected ? 'selected locked' : ''}" role="button" aria-pressed="${isSelected}" aria-disabled="${selectedOption !== undefined}" onclick="window.selectExamOption('${escapeHtml(question.id)}', ${optionIndex})">
                            <div class="option-prefix">${prefixes[optionIndex] || (optionIndex + 1)}</div>
                            <div class="option-label">${escapeHtml(option)}</div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                    <span class="text-muted answer-lock-hint">${selectedOption !== undefined ? 'উত্তরটি লক করা হয়েছে' : 'একবার অপশন নির্বাচন করলে পরিবর্তন করা যাবে না'}</span>
                  `}
                </article>
              `;
            }).join('')}
          </section>

          <!-- Question Palette -->
          <div class="palette-card">
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem;">প্রশ্নে যান</h4>
            <div class="palette-grid">
              ${session.questions.map((ques, idx) => {
                const ans = session.answers[ques.id] !== undefined;
                const flg = session.flagged.has(ques.id);
                return `
                  <button class="palette-btn ${ans ? 'answered' : ''} ${flg ? 'flagged' : ''}" data-palette-question="${idx}" onclick="window.gotoExamQuestion(${idx})">
                    ${idx + 1}
                  </button>
                `;
              }).join('')}
            </div>

            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-dot" style="background: var(--success);"></span>
                <span>উত্তর দেওয়া হয়েছে (<span data-answer-count>${Object.keys(session.answers).length}</span>)</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: var(--accent);"></span>
                <span>পর্যালোচনার জন্য চিহ্নিত (${session.flagged.size})</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: var(--border-color);"></span>
                <span>MCQ উত্তর দেওয়া হয়নি (<span data-unanswered-count>${session.questions.filter(question => question.questionType !== 'CQ').length - Object.keys(session.answers).length}</span>)</span>
              </div>
              ${hasCQ ? `<div class="legend-item"><span class="legend-dot" style="background: ${session.cqAnswerSheet ? 'var(--success)' : 'var(--danger)'};"></span><span>CQ PDF: ${session.cqAnswerSheet ? 'নির্বাচিত' : 'বাকি'}</span></div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async renderResult(attemptId) {
    let attempt = db.getAttemptById(attemptId);
    if (!attempt || attempt.cqStatus) {
      try {
        const response = await fetch(`/api/exam-attempts/${encodeURIComponent(attemptId)}`, {
          credentials: 'same-origin'
        });
        const payload = await response.json();
        if (response.ok && payload.attempt) {
          attempt = payload.attempt;
          const existingIndex = (db.data.examAttempts || []).findIndex(item => item.id === attemptId);
          if (existingIndex >= 0) db.data.examAttempts[existingIndex] = attempt;
          else db.data.examAttempts.unshift(attempt);
          db.save();
        } else if (!attempt) {
          return `<div class="container text-center" style="padding: 4rem;"><h2>${escapeHtml(payload.error || 'ফলাফল পাওয়া যায়নি')}</h2><a href="#/exam" class="btn btn-primary">সকল পরীক্ষা</a></div>`;
        }
      } catch (error) {
        if (!attempt) {
          return `<div class="container text-center" style="padding: 4rem;"><h2>ফলাফল লোড করা যায়নি</h2><p class="text-muted">${escapeHtml(error.message)}</p><a href="#/exam" class="btn btn-primary">সকল পরীক্ষা</a></div>`;
        }
      }
    }
    const user = Auth.getUser();
    if (!attempt || (!Auth.isAdmin() && (attempt.userId !== user?.id || !Auth.canAccessCategory(attempt.category)))) {
      return `<div class="container text-center" style="padding: 4rem;"><h2>ফলাফল পাওয়া যায়নি</h2><a href="#/exam" class="btn btn-primary">সকল পরীক্ষা</a></div>`;
    }

    const prefixes = ['ক', 'খ', 'গ', 'ঘ'];

    return `
      <div class="container" style="padding-top: 2rem;">
        <!-- Hero Score Card -->
        <div class="result-hero-banner">
          <span class="badge ${attempt.cqStatus === 'pending' ? 'badge-warning' : 'badge-success'}" style="font-size: 0.85rem; margin-bottom: 1rem;">${attempt.cqStatus === 'pending' ? 'MCQ ফলাফল • CQ যাচাই চলছে' : 'পরীক্ষা সম্পন্ন 🎉'}</span>
          <h1 style="font-size: 1.85rem; margin-bottom: 1.5rem;">${attempt.examTitle}</h1>

          <div class="result-score-circle">
            <span class="big-score">${attempt.score}</span>
                    <span class="out-of">মোট ${attempt.totalMarks} এ</span>
          </div>

          <p style="font-size: 1.1rem; font-weight: 600; color: var(--primary); margin-bottom: 1rem;">
            ${attempt.cqStatus === 'pending' ? 'CQ মূল্যায়নের আগে MCQ-এর অস্থায়ী নম্বর' : 'শতকরা নম্বর'}: ${attempt.percentage}% ${attempt.meritRank ? `• মেধা তালিকা: ${attempt.meritRank} (শীর্ষ ${attempt.percentile})` : ''}
          </p>

          <div class="result-stats-row">
            <div class="result-stat-card">
              <div class="val" style="color: var(--success);">${attempt.correct}</div>
              <div class="lbl">সঠিক উত্তর</div>
            </div>
            <div class="result-stat-card">
              <div class="val" style="color: var(--danger);">${attempt.wrong}</div>
              <div class="lbl">ভুল উত্তর</div>
            </div>
            <div class="result-stat-card">
              <div class="val" style="color: var(--text-muted);">${attempt.skipped}</div>
              <div class="lbl">উত্তর দেওয়া হয়নি</div>
            </div>
            <div class="result-stat-card">
              <div class="val" style="color: #DC2626;">-${attempt.negativePenalty || 0}</div>
              <div class="lbl">নেগেটিভ মার্ক</div>
            </div>
            <div class="result-stat-card">
              <div class="val">${attempt.timeTaken || '10:00'}</div>
              <div class="lbl">ব্যবহৃত সময়</div>
            </div>
            <div class="result-stat-card">
              <div class="val" style="color: var(--primary);">${attempt.percentage}%</div>
              <div class="lbl">নির্ভুলতা</div>
            </div>
          </div>
        </div>

        ${attempt.cqStatus ? `
          <section class="card exam-cq-result-card">
            <h2>CQ উত্তরপত্র</h2>
            ${attempt.cqPdfUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(attempt.cqPdfUrl)}" target="_blank" rel="noopener">জমা দেওয়া PDF দেখুন</a>` : ''}
            <p>${attempt.cqStatus === 'pending'
              ? `Admin-এর মূল্যায়নের অপেক্ষায় • CQ পূর্ণমান ${attempt.cqMaxMarks}`
              : `CQ নম্বর: ${attempt.cqScore} / ${attempt.cqMaxMarks}`}</p>
            ${attempt.cqFeedback ? `<p><strong>Admin feedback:</strong> ${escapeHtml(attempt.cqFeedback)}</p>` : ''}
          </section>
        ` : ''}

        <!-- Performance Diagnostic & Weak Topics Alert -->
        ${(attempt.weakTopics && attempt.weakTopics.length > 0) ? `
          <div class="card" style="border: 2px solid #FCD34D; background: #FFFBEB; margin-bottom: 2rem; padding: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.5rem;">⚠️</span>
              <h3 style="color: #B45309; font-size: 1.2rem;">দুর্বল টপিক ডায়াগনস্টিক রিপোর্ট</h3>
            </div>
            <p style="color: #92400E; font-size: 0.95rem; margin-bottom: 1rem;">
              এই পরীক্ষায় নিচের টপিকগুলোতে তোমার ভুলের সংখ্যা বেশি। পূর্ণাঙ্গ প্রস্তুতির জন্য এই টপিকগুলো পুনরায় ঝালিয়ে নাও:
            </p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              ${attempt.weakTopics.map(t => `<span class="badge" style="background: white; border: 1px solid #FCD34D; color: #B45309; font-size: 0.85rem; padding: 0.4rem 0.85rem;">📌 ${t}</span>`).join('')}
            </div>
            <a href="#/question-bank/practice?topic=${encodeURIComponent(attempt.weakTopics[0])}" class="btn btn-sm" style="background: #D97706; color: white; font-weight: 700;">
              ⚡ এই দুর্বল টপিকের উপর প্র্যাকটিস টেস্ট দিন
            </a>
          </div>
        ` : ''}

        <!-- Detailed Answer Review -->
        <div class="section-header" style="text-align: left; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.4rem;">উত্তরপত্রের পুঙ্খানুপুঙ্খ রিভিউ ও ব্যাখ্যা</h2>
          <p class="text-muted">প্রতিটি প্রশ্নের সঠিক সমাধান ও সংশ্লিষ্ট নিয়ম জেনে নাও</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 3rem;">
          ${(attempt.questions || []).map((q, qIdx) => {
            if (q.questionType === 'CQ') {
              return `
                <div class="review-question-card">
                  <strong>প্রশ্ন ${qIdx + 1} • CQ</strong>
                  <h3>উদ্দীপক: ${escapeHtml(q.stimulus || '')}</h3>
                  ${q.stimulusImageUrl ? `<img src="${escapeHtml(q.stimulusImageUrl)}" alt="উদ্দীপকের ছবি" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1rem; border-radius: var(--radius-md);">` : ''}
                  <ol class="exam-cq-parts">${(q.parts || []).map((part, index) => `
                    <li><strong>${escapeHtml(part.label || prefixes[index])})</strong> ${escapeHtml(part.question || '')}</li>
                  `).join('')}</ol>
                  <p class="text-muted">${attempt.cqStatus === 'pending' ? 'PDF উত্তরপত্র জমা হয়েছে; Admin যাচাই করবেন।' : `CQ নম্বর: ${attempt.cqScore} / ${attempt.cqMaxMarks}`}</p>
                </div>
              `;
            }
            const studentAns = attempt.answers ? attempt.answers[q.id] : undefined;
            const isCorrect = studentAns === q.correctIndex;
            const isSkipped = studentAns === undefined || studentAns === null;
            const mcqMarksEach = attempt.mcqMarksEach || 1;
            const negativeMarkingPerQuestion = attempt.negativeMarkingPerQuestion
              ?? (attempt.negativePenalty ? 0.25 : 0);

            return `
              <div class="review-question-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                  <span style="font-weight: 800; color: var(--primary);">প্রশ্ন ${qIdx + 1}</span>
                  <span class="badge ${isCorrect ? 'badge-success' : isSkipped ? 'badge-warning' : 'badge-danger'}">
                    ${isCorrect ? `✓ সঠিক (+${mcqMarksEach})` : isSkipped ? 'উত্তর দেয়নি (০.০)' : `✗ ভুল (-${negativeMarkingPerQuestion})`}
                  </span>
                </div>

                <h3 style="font-size: 1.15rem; font-weight: 600; margin-bottom: 1.25rem; line-height: 1.4;">${escapeHtml(q.text)}</h3>
                ${q.imageUrl ? `<img src="${escapeHtml(q.imageUrl)}" alt="প্রশ্নের ছবি" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1rem; border-radius: var(--radius-md);">` : ''}

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                  ${(q.options || []).map((opt, optIdx) => {
                    const isStudentChoice = studentAns === optIdx;
                    const isRightOption = q.correctIndex === optIdx;
                    let optClass = '';
                    if (isRightOption) optClass = 'correct';
                    else if (isStudentChoice && !isRightOption) optClass = 'wrong';

                    return `
                      <div class="review-option ${optClass}">
                        <span><strong>${prefixes[optIdx]})</strong> ${escapeHtml(opt)}</span>
                        <span>${isRightOption ? '✓ সঠিক উত্তর' : isStudentChoice ? '✗ তোমার উত্তর' : ''}</span>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="explanation-box">
                  <h5>💡 সঠিক উত্তরের ব্যাখ্যা ও সমাধান:</h5>
                  <p>${q.explanation || 'এই প্রশ্নের জন্য কোনো অতিরিক্ত ব্যাখ্যা নেই।'}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};

window.selectCQAnswerSheet = (event) => {
  const session = ExamService.getCurrentSession();
  const file = event.target.files?.[0];
  if (!session || !file) return;
  if (!file.name.toLowerCase().endsWith('.pdf') || file.size > 20 * 1024 * 1024) {
    event.target.value = '';
    Toast.error('২০ MB-এর মধ্যে একটি PDF উত্তরপত্র নির্বাচন করুন।');
    return;
  }
  session.cqAnswerSheet = file;
  const name = document.getElementById('cq-answer-sheet-name');
  if (name) name.textContent = file.name;
};

// Global Exam Handlers
window.openScheduledExam = (examId, event) => {
  const exam = db.getExamById(examId);
  if (!exam) return true;
  const schedule = getScheduleState(exam);
  if (schedule.upcoming) {
    event.preventDefault();
    Toast.info(`পরীক্ষা শুরু হতে বাকি ${formatCountdown(schedule.countdown)}`);
    return false;
  }
  if (schedule.expired) {
    event.preventDefault();
    Toast.warning('এই পরীক্ষার সময় শেষ হয়েছে।');
    return false;
  }
  return true;
};

window.selectExamOption = (qid, idx) => {
  const selected = ExamService.selectAnswer(qid, idx);
  if (!selected) {
    Toast.info('একবার নির্বাচন করা উত্তর আর পরিবর্তন করা যাবে না।');
    return;
  }
  const session = ExamService.getCurrentSession();
  if (!session) return;
  const card = [...document.querySelectorAll('[data-question-card]')]
    .find(element => element.dataset.questionCard === qid);
  if (card) {
    card.dataset.answered = 'true';
    card.querySelectorAll('.option-runner-item').forEach((option, optionIndex) => {
      const isSelected = optionIndex === idx;
      option.classList.toggle('selected', isSelected);
      option.classList.add('locked');
      option.setAttribute('aria-pressed', String(isSelected));
      option.setAttribute('aria-disabled', 'true');
    });
    const hint = card.querySelector('.answer-lock-hint');
    if (hint) hint.textContent = 'উত্তরটি লক করা হয়েছে';
  }
  const paletteButton = document.querySelector(`[data-palette-question="${session.questions.findIndex(question => question.id === qid)}"]`);
  paletteButton?.classList.add('answered');
  const answerCount = document.querySelector('[data-answer-count]');
  if (answerCount) answerCount.textContent = String(Object.keys(session.answers).length);
  const unansweredCount = document.querySelector('[data-unanswered-count]');
  if (unansweredCount) {
    const mcqCount = session.questions.filter(question => question.questionType !== 'CQ').length;
    unansweredCount.textContent = String(mcqCount - Object.keys(session.answers).length);
  }
};

window.toggleExamFlag = (qid) => {
  ExamService.toggleFlag(qid);
  const session = ExamService.getCurrentSession();
  if (!session) return;
  const questionIndex = session.questions.findIndex(question => question.id === qid);
  const isFlagged = session.flagged.has(qid);
  const flagButton = [...document.querySelectorAll('[data-flag-question]')]
    .find(element => element.dataset.flagQuestion === qid);
  if (flagButton) {
    flagButton.textContent = isFlagged ? '★ রিভিউ থেকে সরান' : '★ রিভিউ রাখুন';
    flagButton.style.color = isFlagged ? 'var(--accent)' : 'var(--text-muted)';
  }
  const paletteButton = document.querySelector(`[data-palette-question="${questionIndex}"]`);
  paletteButton?.classList.toggle('flagged', isFlagged);
  const flaggedCount = document.querySelector('.palette-legend .legend-item:nth-child(2) span:last-child');
  if (flaggedCount) flaggedCount.textContent = `পর্যালোচনার জন্য চিহ্নিত (${session.flagged.size})`;
};

window.gotoExamQuestion = (idx) => {
  const session = ExamService.getCurrentSession();
  if (session && session.questions[idx]) {
    session.currentIndex = idx;
    document.getElementById(`exam-question-${idx}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

window.confirmSubmitExam = () => {
  const session = ExamService.getCurrentSession();
  if (!session) return;
  const hasCQ = session.questions.some(question => question.questionType === 'CQ');
  if (hasCQ && !session.cqAnswerSheet && !Auth.isAdmin()) {
    Toast.error('পরীক্ষা জমা দেওয়ার আগে CQ উত্তরপত্র PDF আপলোড করুন।');
    return;
  }
  const answeredCount = Object.keys(session.answers).length;
  const total = session.questions.length;

  const modalInstance = Modal.open({
    title: 'পরীক্ষা জমা নিশ্চিতকরণ',
    content: `
      <div style="text-align: center; padding: 1rem 0;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
          তুমি মোট <strong>${total}</strong> টি প্রশ্নের মধ্যে <strong>${answeredCount}</strong> টির উত্তর দিয়েছ।
        </p>
        <p class="text-muted" style="font-size: 0.9rem;">
          তুমি কি নিশ্চিতভাবে পরীক্ষাটি এখনই জমা দিতে চাও?
        </p>
      </div>
    `,
    footer: `
      <button class="btn btn-secondary" onclick="document.getElementById('modal-close-btn').click()">আরও সময় নিন</button>
      <button class="btn btn-primary" id="final-exam-submit-btn">হ্যাঁ, জমা দিন</button>
    `
  });

  document.getElementById('final-exam-submit-btn')?.addEventListener('click', async () => {
    modalInstance.close();
    if (timerInterval) clearInterval(timerInterval);
    try {
      const result = await ExamService.submitExam();
      clearExamGuards();
      Toast.success('পরীক্ষা সফলভাবে জমা হয়েছে!');
      window.location.hash = `#/exam/result/${result.id}`;
    } catch (error) {
      Toast.error(error.message);
    }
  });
};


/* --- [js/views/questionBankView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - QUESTION BANK & PRACTICE TEST GENERATOR VIEW
   ========================================================================== */






let revealedAnswers = new Set();

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function renderQuestionCard(question, index, prefixes) {
  const isRevealed = revealedAnswers.has(question.id);
  return `
    <div class="question-item-card" id="qcard-${escapeHtml(question.id)}">
      <div class="question-item-meta">
        <div class="question-tags-row">
          <span class="badge badge-${escapeHtml(question.category.toLowerCase())}">${escapeHtml(question.category)}</span>
          ${question.board || question.year ? `<span class="badge" style="background: var(--bg-card-subtle); color: var(--text-muted);">${escapeHtml(question.board || '')}${question.board && question.year ? ' • ' : ''}${escapeHtml(question.year || '')}</span>` : ''}
        </div>
      </div>

      <h3 style="font-size: 1.15rem; font-weight: 600; line-height: 1.5; margin-bottom: 1rem;">
        <span style="color: var(--primary); font-weight: 800;">${index + 1}.</span> ${escapeHtml(question.text)}
      </h3>
      ${question.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="প্রশ্নের ছবি" loading="lazy" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1rem; border-radius: var(--radius-md);">` : ''}

      <div class="qb-options-grid">
        ${(question.options || []).map((option, optionIndex) => {
          const isRight = optionIndex === question.correctIndex;
          const cls = isRevealed && isRight ? 'revealed-correct' : '';
          return `
            <div class="qb-option-box ${cls}" onclick="window.testQBAnswer('${escapeHtml(question.id)}', ${optionIndex})">
              <span class="option-prefix" style="width: 26px; height: 26px; font-size: 0.8rem;">${prefixes[optionIndex]}</span>
              <span>${escapeHtml(option)}</span>
            </div>
          `;
        }).join('')}
      </div>

      ${isRevealed ? `
        <div class="explanation-box" style="margin-bottom: 1rem;">
          <h5>💡 সঠিক উত্তর: ${prefixes[question.correctIndex]}) ${escapeHtml((question.options || [])[question.correctIndex])}</h5>
          <p style="margin-top: 0.25rem;">${escapeHtml(question.explanation)}</p>
        </div>
      ` : ''}

      <div class="qb-action-bar">
        <button class="btn btn-secondary btn-sm" onclick="window.toggleQBExplanation('${escapeHtml(question.id)}')">
          ${isRevealed ? 'ব্যাখ্যা লুকান' : '🔍 উত্তর ও ব্যাখ্যা দেখুন'}
        </button>

        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-ghost btn-sm" onclick="window.askAiAboutQuestion('${escapeHtml(question.id)}')">
            ${icons.sparkles} এআই সমাধান
          </button>
          <button class="btn btn-ghost btn-sm" onclick="window.reportQuestion('${escapeHtml(question.id)}')">
            🚩 রিপোর্ট
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCQCard(question, index) {
  const isRevealed = revealedAnswers.has(question.id);
  const parts = Array.isArray(question.parts) ? question.parts : [];
  const hasAnswers = parts.some(part => part.answer);
  return `
    <article class="question-item-card cq-question-card" id="qcard-${escapeHtml(question.id)}">
      <div class="question-item-meta">
        <div class="question-tags-row">
          <span class="badge badge-${escapeHtml(String(question.category || '').toLowerCase())}">${escapeHtml(question.category)}</span>
          ${question.board || question.year ? `<span class="badge" style="background: var(--bg-card-subtle); color: var(--text-muted);">${escapeHtml(question.board || '')}${question.board && question.year ? ' • ' : ''}${escapeHtml(question.year || '')}</span>` : ''}
        </div>
      </div>
      <h3 class="cq-stimulus"><span>${index + 1}. উদ্দীপক:</span> ${escapeHtml(question.stimulus || '')}</h3>
      ${question.stimulusImageUrl ? `<img src="${escapeHtml(question.stimulusImageUrl)}" alt="উদ্দীপকের ছবি" loading="lazy" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1rem; border-radius: var(--radius-md);">` : ''}
      <ol class="cq-parts">
        ${parts.map((part, partIndex) => `
          <li>
            <strong>${escapeHtml(part.label || ['ক', 'খ', 'গ', 'ঘ'][partIndex])})</strong>
            <span>${escapeHtml(part.question || '')}</span>
            ${isRevealed && part.answer ? `<div class="cq-answer"><strong>উত্তর:</strong> ${escapeHtml(part.answer)}</div>` : ''}
          </li>
        `).join('')}
      </ol>
      <div class="qb-action-bar">
        ${hasAnswers ? `
          <button class="btn btn-secondary btn-sm" onclick="window.toggleQBExplanation('${escapeHtml(question.id)}')">
            ${isRevealed ? 'উত্তর লুকান' : 'উত্তর দেখুন'}
          </button>
        ` : '<span class="text-muted">উত্তর এখনো যোগ করা হয়নি</span>'}
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-ghost btn-sm" onclick="window.askAiAboutQuestion('${escapeHtml(question.id)}')">
            ${icons.sparkles} এআই সমাধান
          </button>
          <button class="btn btn-ghost btn-sm" onclick="window.reportQuestion('${escapeHtml(question.id)}')">
            🚩 রিপোর্ট
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderWrittenCard(question, index) {
  const isRevealed = revealedAnswers.has(question.id);
  return `
    <article class="question-item-card written-question-card" id="qcard-${escapeHtml(question.id)}">
      <div class="question-item-meta">
        <div class="question-tags-row">
          <span class="badge badge-${escapeHtml(String(question.category || '').toLowerCase())}">${escapeHtml(question.category)}</span>
          ${question.board || question.year ? `<span class="badge" style="background: var(--bg-card-subtle); color: var(--text-muted);">${escapeHtml(question.board || '')}${question.board && question.year ? ' • ' : ''}${escapeHtml(question.year || '')}</span>` : ''}
        </div>
      </div>
      <h3 style="font-size: 1.15rem; font-weight: 600; line-height: 1.5; margin-bottom: 1rem;">
        <span style="color: var(--primary); font-weight: 800;">${index + 1}.</span> ${escapeHtml(question.text)}
      </h3>
      ${question.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="প্রশ্নের ছবি" loading="lazy" style="display: block; max-width: 100%; max-height: 420px; object-fit: contain; margin: 0 0 1rem; border-radius: var(--radius-md);">` : ''}
      ${isRevealed ? `<div class="explanation-box" style="margin-bottom: 1rem;"><h5>💡 নমুনা উত্তর</h5><p>${escapeHtml(question.answer || 'উত্তর এখনো যোগ করা হয়নি।')}</p></div>` : ''}
      <div class="qb-action-bar">
        <button class="btn btn-secondary btn-sm" onclick="window.toggleQBExplanation('${escapeHtml(question.id)}')">
          ${isRevealed ? 'উত্তর লুকান' : 'নমুনা উত্তর দেখুন'}
        </button>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-ghost btn-sm" onclick="window.askAiAboutQuestion('${escapeHtml(question.id)}')">
            ${icons.sparkles} এআই সমাধান
          </button>
          <button class="btn btn-ghost btn-sm" onclick="window.reportQuestion('${escapeHtml(question.id)}')">
            🚩 রিপোর্ট
          </button>
        </div>
      </div>
    </article>
  `;
}

function refreshQuestionCard(questionId) {
  const question = db.getQuestionById(questionId);
  const currentCard = document.getElementById(`qcard-${questionId}`);
  if (!question || !currentCard) return;

  const questionCards = [...currentCard.parentElement.querySelectorAll(':scope > .question-item-card')];
  const index = questionCards.indexOf(currentCard);
  const type = question.questionType || 'MCQ';
  const markup = type === 'CQ'
    ? renderCQCard(question, index)
    : type === 'WRITTEN'
      ? renderWrittenCard(question, index)
      : renderQuestionCard(question, index, ['ক', 'খ', 'গ', 'ঘ']);
  currentCard.insertAdjacentHTML('beforebegin', markup);
  currentCard.remove();
}
const QuestionBankView = window.QuestionBankView = {
  renderList() {
    const user = Auth.getUser();
    const categories = user && !Auth.isAdmin()
      ? [user.educationType]
      : ['SSC', 'HSC', 'JOB'];
    const allQuestions = db.getQuestions().filter(question =>
      categories.includes(question.category)
    );
    const prefixes = ['ক', 'খ', 'গ', 'ঘ'];
    const categoryLabels = {
      SSC: 'SSC',
      HSC: 'HSC',
      JOB: 'JOB'
    };
    const questionHierarchy = categories.map(category => {
      const categoryQuestions = allQuestions.filter(question => question.category === category);
      const subjects = [...new Set(categoryQuestions.map(question => question.subject).filter(Boolean))].sort();
      return {
        category,
        questions: categoryQuestions,
        subjects: subjects.map(subject => {
          const subjectQuestions = categoryQuestions.filter(question => question.subject === subject);
          const chapters = [...new Set(subjectQuestions.map(question => question.chapter).filter(Boolean))].sort();
          const chapterGroups = chapters.length
            ? chapters.map(chapter => ({
                chapter,
                questions: subjectQuestions.filter(question => question.chapter === chapter)
              }))
            : [{ chapter: 'অন্যান্য অধ্যায়', questions: subjectQuestions }];
          return { subject, chapters: chapterGroups };
        })
      };
    });

    return `
      <!-- Header -->
      <section class="qb-header-section">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-size: 2.2rem; margin-bottom: 0.35rem;">ডিজিটাল প্রশ্নব্যাংক</h1>
              <p class="text-muted">বিগত ১০ বছরের সকল বোর্ড ও বিসিএস পরীক্ষার নির্ভুল প্রশ্ন ও ব্যাখ্যা</p>
            </div>
            <a href="#/question-bank/practice" class="btn btn-glowing btn-lg">
              ${icons.sparkles} কাস্টম প্র্যাকটিস টেস্ট বানান
            </a>
          </div>
        </div>
      </section>

      <div class="container">
        <div class="qb-hierarchy">
          ${questionHierarchy.map(group => `
            <details class="qb-category-group">
              <summary>
                <span>${categoryLabels[group.category] || escapeHtml(group.category)}</span>
                <span class="qb-hierarchy-count">${group.questions.length}টি প্রশ্ন</span>
              </summary>
              ${group.subjects.length ? group.subjects.map(subjectGroup => `
                <details class="qb-subject-group">
                  <summary>
                    <span>${escapeHtml(subjectGroup.subject)}</span>
                    <span class="qb-hierarchy-count">${subjectGroup.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0)}টি প্রশ্ন</span>
                  </summary>
                  ${subjectGroup.chapters.map(chapterGroup => `
                    <details class="qb-chapter-group">
                      <summary>
                        <span>${escapeHtml(chapterGroup.chapter)}</span>
                        <span class="qb-hierarchy-count">${chapterGroup.questions.length}টি প্রশ্ন</span>
                      </summary>
                      ${['MCQ', 'CQ', 'WRITTEN'].map(type => {
                        const typedQuestions = chapterGroup.questions.filter(question =>
                          (question.questionType || 'MCQ') === type
                        );
                        const typeLabel = type === 'WRITTEN' ? 'Written' : type;
                        return `
                          <details class="qb-type-group">
                            <summary>
                              <span>${typeLabel}</span>
                              <span class="qb-hierarchy-count">${typedQuestions.length}টি প্রশ্ন</span>
                            </summary>
                            <div class="qb-chapter-questions">
                              ${typedQuestions.map((question, index) =>
                                type === 'CQ'
                                  ? renderCQCard(question, index)
                                  : type === 'WRITTEN'
                                    ? renderWrittenCard(question, index)
                                    : renderQuestionCard(question, index, prefixes)
                              ).join('')}
                              ${typedQuestions.length ? '' : '<p class="text-muted qb-empty-type">এই ধরনের কোনো প্রশ্ন নেই।</p>'}
                            </div>
                          </details>
                        `;
                      }).join('')}
                    </details>
                  `).join('')}
                </details>
              `).join('') : `
                <p class="text-muted qb-empty-category">এই ক্যাটাগরিতে এখনো কোনো প্রশ্ন নেই।</p>
              `}
            </details>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderPracticeGenerator() {
    const user = Auth.getUser();
    const category = user && !Auth.isAdmin() ? user.educationType : null;
    const initialCategory = category || 'SSC';
    const categoryQuestions = db.getQuestions().filter(q =>
      q.category === initialCategory && (!q.questionType || q.questionType === 'MCQ')
    );
    const subjects = [...new Set(categoryQuestions.map(q => q.subject).filter(Boolean))];
    const initialSubject = subjects[0] || '';
    const chapters = [...new Set(categoryQuestions
      .filter(q => q.subject === initialSubject)
      .map(q => q.chapter)
      .filter(Boolean))];
    return `
      <div class="container" style="padding-top: 2.5rem;">
        <div class="section-header text-center">
          <span class="badge badge-ssc" style="margin-bottom: 0.5rem;">AI Powered Test Generator</span>
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">কাস্টম প্র্যাকটিস টেস্ট জেনারেটর</h1>
          <p class="text-muted">নিজের পছন্দমতো বিষয়, অধ্যায় ও প্রশ্ন সংখ্যা বেছে নিয়ে সাথে সাথে পরীক্ষা দিন</p>
        </div>

        <div class="generator-box">
          <form id="practice-gen-form" onsubmit="window.generateCustomTest(event)">
            <div class="form-group">
              <label class="form-label">টার্গেট ক্যাটাগরি</label>
              ${category
                ? `<div class="form-input" aria-readonly="true">${category}</div>`
                : `<select id="gen-category" class="form-select" onchange="window.updatePracticeFilters()">${['SSC', 'HSC', 'JOB'].map(value => `<option value="${value}" ${value === initialCategory ? 'selected' : ''}>${value}</option>`).join('')}</select>`}
            </div>

            <div class="form-group">
              <label class="form-label">বিষয় নির্বাচন করুন</label>
              <select id="gen-subject" class="form-select" onchange="window.updatePracticeFilters()">
                ${subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">অধ্যায় নির্বাচন করুন</label>
              <select id="gen-chapter" class="form-select">
                <option value="ALL">সকল অধ্যায়</option>
                ${chapters.map(chapter => `<option value="${escapeHtml(chapter)}">${escapeHtml(chapter)}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">প্রশ্ন সংখ্যা: <strong id="gen-count-display" style="color: var(--primary);">10 টি</strong></label>
              <input type="range" id="gen-count" min="5" max="30" step="5" value="10" class="form-input" oninput="document.getElementById('gen-count-display').innerText = this.value + ' টি'">
            </div>

            <div class="form-group">
              <label class="form-label">কঠিনতার মাত্রা (Difficulty)</label>
              <select id="gen-difficulty" class="form-select">
                <option value="ALL">সকল মাত্রা (সহজ + মাঝারি + কঠিন)</option>
                <option value="Easy">সহজ (Basic Standard)</option>
                <option value="Medium">মাঝারি (Board Standard)</option>
                <option value="Hard">কঠিন (Top College / BCS Advanced)</option>
              </select>
            </div>

            <button type="submit" class="btn btn-glowing btn-lg btn-block" style="margin-top: 1.5rem;">
              ${icons.sparkles} টেস্ট তৈরি করুন ও শুরু করুন
            </button>
          </form>
        </div>
      </div>
    `;
  }
};

window.updatePracticeFilters = () => {
  const categorySelect = document.getElementById('gen-category');
  const subjectSelect = document.getElementById('gen-subject');
  const chapterSelect = document.getElementById('gen-chapter');
  if (!subjectSelect || !chapterSelect) return;

  const user = Auth.getUser();
  const category = user && !Auth.isAdmin()
    ? user.educationType
    : categorySelect?.value;
  const questions = db.getQuestions().filter(question =>
    question.category === category && (!question.questionType || question.questionType === 'MCQ')
  );
  const previousSubject = subjectSelect.value;
  const subjects = [...new Set(questions.map(question => question.subject).filter(Boolean))];
  subjectSelect.innerHTML = subjects.map(subject =>
    `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`
  ).join('');
  if (subjects.includes(previousSubject)) subjectSelect.value = previousSubject;

  const previousChapter = chapterSelect.value;
  const chapters = [...new Set(questions
    .filter(question => question.subject === subjectSelect.value)
    .map(question => question.chapter)
    .filter(Boolean))];
  chapterSelect.innerHTML = `<option value="ALL">সকল অধ্যায়</option>${chapters.map(chapter =>
    `<option value="${escapeHtml(chapter)}">${escapeHtml(chapter)}</option>`
  ).join('')}`;
  if (chapters.includes(previousChapter)) chapterSelect.value = previousChapter;
};

window.testQBAnswer = (qid, optIdx) => {
  const q = db.getQuestionById(qid);
  if (!q) return;
  revealedAnswers.add(qid);
  if (optIdx === q.correctIndex) {
    Toast.success('সাবাশ! সঠিক উত্তর 🎉');
  } else {
    Toast.error('ভুল উত্তর! সঠিক ব্যাখ্যাটি নিচে দেখে নাও।');
  }
  refreshQuestionCard(qid);
};

window.toggleQBExplanation = (qid) => {
  const question = db.getQuestionById(qid);
  if (!question) return;
  if (revealedAnswers.has(qid)) {
    revealedAnswers.delete(qid);
  } else {
    revealedAnswers.add(qid);
  }
  refreshQuestionCard(qid);
};

window.askAiAboutQuestion = async (qid) => {
  if (!db.getQuestionById(qid)) return;
  Modal.open({
    title: 'Gemini AI সমাধান',
    content: '<div id="gemini-question-solution" role="status">Gemini AI থেকে সমাধান তৈরি হচ্ছে...</div>'
  });
  try {
    const response = await fetch('/api/ai/question-solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: qid })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'AI সমাধান তৈরি করা যায়নি।');
    }
    const solution = document.getElementById('gemini-question-solution');
    if (solution) {
      solution.textContent = result.solution;
      solution.style.whiteSpace = 'pre-wrap';
      solution.style.lineHeight = '1.8';
    }
  } catch (error) {
    const solution = document.getElementById('gemini-question-solution');
    if (solution) {
      solution.textContent = `সমাধান তৈরি করা যায়নি: ${error.message}`;
      solution.style.color = 'var(--danger)';
    }
  }
};

window.reportQuestion = (qid) => {
  const question = db.getQuestionById(qid);
  if (!question) return;
  Modal.open({
    title: 'প্রশ্ন সম্পর্কে মতামত বা রিপোর্ট',
    content: `
      <p class="text-muted" style="margin-bottom: 1rem;">প্রশ্ন আইকন: ${qid}</p>
      <div class="form-group">
        <label class="form-label">রিপোর্টের কারণ</label>
        <select class="form-select">
          <option>উত্তরে ভুল রয়েছে</option>
          <option>বানান বা টাইপো সমস্যা</option>
          <option>অপশন স্পষ্ট নয়</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">বিস্তারিত মন্তব্য</label>
        <textarea class="form-textarea" placeholder="আপনার পর্যবেক্ষণ লিখুন..."></textarea>
      </div>
    `,
    footer: `
      <button class="btn btn-primary" onclick="Toast.success('রিপোর্ট গ্রহণ করা হয়েছে। ধন্যবাদ!'); document.getElementById('modal-close-btn').click();">
        জমা দিন
      </button>
    `
  });
};

window.generateCustomTest = (e) => {
  e.preventDefault();
  const user = Auth.getUser();
  const cat = user && !Auth.isAdmin()
    ? user.educationType
    : document.getElementById('gen-category')?.value;
  if (!cat || !Auth.canAccessCategory(cat)) {
    Toast.error('প্র্যাকটিস টেস্ট তৈরির আগে সাইন ইন করুন।');
    return;
  }
  const count = parseInt(document.getElementById('gen-count').value, 10) || 10;
  const subject = document.getElementById('gen-subject').value;
  const chapter = document.getElementById('gen-chapter').value;
  const matchingQuestions = db.getQuestions().filter(question =>
    question.category === cat
    && question.subject === subject
    && (chapter === 'ALL' || question.chapter === chapter)
    && (!question.questionType || question.questionType === 'MCQ')
  );
  if (!matchingQuestions.length) {
    Toast.error('এই বিষয় ও অধ্যায়ে কোনো প্রশ্ন নেই।');
    return;
  }
  const selectedQuestions = matchingQuestions.slice(0, count);

  // Create customized instant exam
  const customExam = {
    id: `custom_test_${Date.now()}`,
    title: `কাস্টম প্র্যাকটিস টেস্ট (${cat} - ${subject}${chapter === 'ALL' ? '' : ` - ${chapter}`} - ${selectedQuestions.length} টি প্রশ্ন)`,
    category: cat,
    subject,
    chapter: chapter === 'ALL' ? null : chapter,
    questionIds: selectedQuestions.map(question => question.id),
    totalQuestions: selectedQuestions.length,
    durationMinutes: Math.max(5, Math.round(selectedQuestions.length * 1.0)),
    totalMarks: selectedQuestions.length,
    negativeMarking: 0.25,
    accessType: 'free',
    isLive: true
  };
  db.addExam(customExam);

  Toast.success('কাস্টম টেস্ট সফলভাবে তৈরি হয়েছে! পরীক্ষা শুরু হচ্ছে...');
  window.location.hash = `#/exam/${customExam.id}`;
};


/* --- [js/views/aiView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - AI STUDY ASSISTANT VIEW (CHATGPT-STYLE)
   ========================================================================== */




let messages = [];
const AiView = window.AiView = {
  render(initialPrompt = null) {
    const ctx = AiService.getStudentContext();

    if (messages.length === 0) {
      messages.push({
        sender: 'ai',
        text: `👋 **স্বাগতম!** আমি তোমার **জেনেসিওন একাডেমি এআই স্টাডি অ্যাসিস্ট্যান্ট**।

বর্তমানে আমি তোমার **${ctx.label}** সিলেবাস অনুযায়ী যেকোনো প্রশ্নের সমাধান, কঠিন টপিকের সহজ ব্যাখ্যা, পড়ার রুটিন কিংবা কুইজ তৈরিতে সাহায্য করতে প্রস্তুত।

নিচের যেকোনো কুইক অপশন বেছে নাও অথবা সরাসরি তোমার প্রশ্নটি লিখে পাঠাও!`
      });
    }

    // Auto-trigger if initialPrompt was passed via URL query
    if (initialPrompt && !messages.some(m => m.text === initialPrompt)) {
      setTimeout(() => {
        window.sendAiMessage(initialPrompt);
      }, 200);
    }

    return `
      <div class="ai-chat-layout">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-title-wrap">
            <div class="ai-sparkle-avatar">
              ${icons.sparkles}
            </div>
            <div>
              <h2 style="font-size: 1.15rem; margin-bottom: 0.15rem;">জেনেসিওন একাডেমি এআই স্টাডি অ্যাসিস্ট্যান্ট</h2>
              <span class="badge badge-${ctx.type.toLowerCase()}">${ctx.label}</span>
            </div>
          </div>

          <button class="btn btn-ghost btn-sm" onclick="window.clearAiChat()">
            ${icons.trash} চ্যাট মুছুন
          </button>
        </div>

        <!-- Chat Messages Container -->
        <div class="ai-chat-messages" id="ai-chat-box">
          ${messages.map(m => `
            <div class="chat-msg ${m.sender}">
              <div class="chat-avatar">
                ${m.sender === 'user' ? icons.user : icons.sparkles}
              </div>
              <div class="chat-bubble">
                ${formatAiText(m.text)}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Action Pills -->
        <div class="ai-quick-pills">
          <button class="quick-pill" onclick="window.sendAiMessage('নিউটনের ৩য় গতিসূত্র বাস্তব উদাহরণসহ বাংলায় বুঝিয়ে দাও')">💡 বিষয় বুঝিয়ে দাও</button>
          <button class="quick-pill" onclick="window.sendAiMessage('একটি গাড়ি ২ m/s² সুষম ত্বরণে ১০ সেকেন্ডে কত দূরত্ব যাবে সমাধান করো')">🔍 অঙ্ক সমাধান</button>
          <button class="quick-pill" onclick="window.sendAiMessage('আমার জন্য গুরুত্বপূর্ণ ৫টি স্পেশাল প্র্যাকটিস MCQ দাও')">🎯 স্পেশাল MCQ</button>
          <button class="quick-pill" onclick="window.sendAiMessage('আমার পরীক্ষার জন্য ৭ দিনের একটি কার্যকরী পড়ার রুটিন দাও')">📅 পড়ার রুটিন</button>
          <button class="quick-pill" onclick="window.sendAiMessage('বাংলাদেশের সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদগুলো বুঝিয়ে দাও')">🏛️ সংবিধান অনুচ্ছেদ</button>
        </div>

        <!-- Chat Input Form -->
        <form class="ai-input-form" onsubmit="window.handleAiSubmit(event)">
          <input type="text" id="ai-user-input" class="ai-input-field" placeholder="বাংলা, English বা Banglish-এ পড়াশোনার প্রশ্ন লিখুন..." autocomplete="off">
          <button type="submit" class="btn btn-primary" style="border-radius: var(--radius-lg); padding: 0.6rem 1.25rem;">
            ${icons.send}
          </button>
        </form>
      </div>
    `;
  }
};

function formatAiText(text) {
  if (!text) return '';
  const safeText = text.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  let html = safeText
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; margin: 0.5rem 0; color: var(--primary);">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 style="font-size: 1rem; margin: 0.35rem 0;">$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^&gt; (.*$)/gim, '<blockquote style="border-left: 3px solid var(--primary); padding-left: 0.75rem; margin: 0.5rem 0; color: var(--text-muted);">$1</blockquote>')
    .replace(/\n/gim, '<br>');
  return html;
}

window.handleAiSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('ai-user-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  window.sendAiMessage(text);
};

window.sendAiMessage = async (text) => {
  messages.push({ sender: 'user', text: text });
  
  const chatBox = document.getElementById('ai-chat-box');
  if (chatBox) {
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'chat-msg user';
    userMsgEl.innerHTML = `
      <div class="chat-avatar">${icons.user}</div>
      <div class="chat-bubble">${formatAiText(text)}</div>
    `;
    chatBox.appendChild(userMsgEl);

    // AI typing bubble
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-msg ai';
    aiMsgEl.innerHTML = `
      <div class="chat-avatar">${icons.sparkles}</div>
      <div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>
    `;
    chatBox.appendChild(aiMsgEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const reply = await AiService.generateResponse(text, (answer) => {
        const bubble = aiMsgEl.querySelector('.chat-bubble');
        if (bubble) bubble.innerHTML = formatAiText(answer);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
      messages.push({ sender: 'ai', text: reply });
    } catch (error) {
      const errorMessage = `উত্তর তৈরি করা যায়নি: ${error.message}`;
      const bubble = aiMsgEl.querySelector('.chat-bubble');
      if (bubble) bubble.textContent = errorMessage;
      messages.push({ sender: 'ai', text: errorMessage });
      Toast.error(error.message);
    }
  }
};

window.clearAiChat = () => {
  messages = [];
  Toast.info('চ্যাট হিস্ট্রি মুছে ফেলা হয়েছে');
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = AiView.render();
};


/* --- [js/views/storeView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - STORE, PRODUCT DETAIL, CART & BANGLADESH CHECKOUT VIEW
   ========================================================================== */





function getCart() {
  try {
    return JSON.parse(localStorage.getItem('ja_cart') || '[]');
  } catch (e) {
    return [];
  }
}

function getAccessibleCart() {
  const cart = getCart();
  const user = Auth.getUser();
  if (!user || Auth.isAdmin()) return cart;

  const accessible = cart.filter(item => {
    if (item.type === 'course') {
      const course = db.getCourseById(item.id);
      return course && Auth.canAccessCategory(course.category);
    }
    const product = db.getProductById(item.id);
    return product?.educationTypes?.includes(user.educationType);
  });
  if (accessible.length !== cart.length) saveCart(accessible);
  return accessible;
}

function saveCart(cart) {
  localStorage.setItem('ja_cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

let activeCoupon = null;

function getCouponDiscount(subtotal) {
  if (!activeCoupon) return 0;
  let discount = 0;
  if (activeCoupon.discountPercent) {
    discount = Math.round(subtotal * activeCoupon.discountPercent / 100);
    if (activeCoupon.maxDiscount) discount = Math.min(activeCoupon.maxDiscount, discount);
  } else if (activeCoupon.discountAmount) {
    discount = activeCoupon.discountAmount;
  }
  return Math.min(subtotal, discount);
}
const StoreView = window.StoreView = {
  renderStore(activeCategory = 'ALL') {
    const user = Auth.getUser();
    let products = db.getProducts();
    if (user && !Auth.isAdmin()) {
      products = products.filter(p => p.educationTypes?.includes(user.educationType));
    }
    if (activeCategory !== 'ALL') {
      products = products.filter(p => p.category === activeCategory);
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">জেনেসিওন একাডেমি স্টোর ও প্রকাশনা</h1>
          <p class="text-muted">বিসিএস ও বোর্ড প্রস্তুতির সেরা বই, লেকচার নোটস ও ওএমআর শিট বান্ডেল</p>
        </div>

        <div class="filter-chips justify-center" style="margin-bottom: 2.5rem;">
          <button class="chip-btn ${activeCategory === 'ALL' ? 'active' : ''}" onclick="window.location.hash='#/store'">সকল পণ্য (${db.getProducts().length})</button>
          <button class="chip-btn ${activeCategory === 'Books' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Books'">প্রিন্টেড বই (Books)</button>
          <button class="chip-btn ${activeCategory === 'PDF' ? 'active' : ''}" onclick="window.location.hash='#/store?category=PDF'">ডিজিটাল শিট (PDF)</button>
          <button class="chip-btn ${activeCategory === 'Notes' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Notes'">হ্যান্ডনোটস (Notes)</button>
          <button class="chip-btn ${activeCategory === 'Model Tests' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Model Tests'">মডেল টেস্ট বান্ডেল</button>
        </div>

        <div class="store-products-grid">
          ${products.map(p => `
            <div class="product-card">
              <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <span class="product-type-badge badge ${p.type === 'digital' ? 'badge-success' : 'badge-warning'}">
                  ${p.type === 'digital' ? '⚡ Instant PDF' : '📦 Home Delivery'}
                </span>
              </div>
              <div class="product-body">
                <span class="badge badge-ssc" style="width: fit-content; margin-bottom: 0.5rem; font-size: 0.7rem;">${p.category}</span>
                <h3 class="product-title" title="${p.name}">${p.name}</h3>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <span style="color: #F59E0B; font-size: 0.85rem;">★ ${p.rating}</span>
                  <span class="text-muted" style="font-size: 0.8rem;">(১০০+ রিভিউ)</span>
                </div>

                <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--divider); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-size: 1.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                      ${formatBDT(p.price)}
                    </div>
                    <div style="font-size: 0.75rem; text-decoration: line-through; color: var(--text-subtle);">
                      ${formatBDT(p.originalPrice)}
                    </div>
                  </div>

                  <a href="#/store/product/${p.id}" class="btn btn-primary btn-sm">
                    বিস্তারিত
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderProductDetail(productId) {
    const p = db.getProductById(productId);
    const user = Auth.getUser();
    if (!p || (user && !Auth.isAdmin() && !p.educationTypes?.includes(user.educationType))) {
      return `<div class="container text-center" style="padding: 4rem;"><h2>পণ্যটি পাওয়া যায়নি</h2><a href="#/store" class="btn btn-primary">সকল পণ্য</a></div>`;
    }

    const isUnlocked = user && user.unlockedProducts && user.unlockedProducts.includes(p.id);

    return `
      <div class="container" style="padding-top: 2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; margin-bottom: 3.5rem;">
          <div style="border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-surface); max-height: 460px;">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>

          <div>
            <span class="badge ${p.type === 'digital' ? 'badge-success' : 'badge-warning'}" style="margin-bottom: 0.75rem;">
              ${p.type === 'digital' ? '⚡ ডিজিটাল ডাউনলোড (Instant PDF)' : '📦 প্রিন্টেড কপি (সারা দেশে হোম ডেলিভারি)'}
            </span>
            <h1 style="font-size: 1.85rem; line-height: 1.35; margin-bottom: 1rem;">${p.name}</h1>

            <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem;">
              <span style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary);">
                ${formatBDT(p.price)}
              </span>
              <span style="font-size: 1.15rem; text-decoration: line-through; color: var(--text-subtle);">
                ${formatBDT(p.originalPrice)}
              </span>
              <span class="badge badge-danger">${p.discount}% ছাড়</span>
            </div>

            <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
              ${p.description}
            </p>

            ${p.included ? `
              <div style="background: var(--bg-card-subtle); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.75rem;">
                <strong style="display: block; margin-bottom: 0.5rem;">প্যাকেজে যা যা থাকছে:</strong>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
                  ${p.included.map(inc => `<li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--success);">${icons.check}</span> ${inc}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${isUnlocked && p.type === 'digital' ? `
                <a href="${p.fileUrl || '#'}" target="_blank" class="btn btn-success btn-lg">
                  ${icons.download} ডিজিটাল ফাইল ডাউনলোড করুন (Unlocked)
                </a>
              ` : `
                <button class="btn btn-glowing btn-lg" onclick="window.addToCartAndCheckout('${p.id}', '${p.type}')">
                  ${icons.shoppingCart} এখনই কিনুন (${formatBDT(p.price)})
                </button>
                <button class="btn btn-outline btn-lg" onclick="window.addToCartOnly('${p.id}', '${p.type}')">
                  কার্টে যোগ করুন
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderCart() {
    const cart = getAccessibleCart();
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    const discount = getCouponDiscount(subtotal);

    const total = Math.max(0, subtotal - discount);

    if (cart.length === 0) {
      return `
        <div class="container text-center" style="padding: 4rem 1rem;">
          <div class="empty-state">
            <div class="empty-state-icon">${icons.shoppingCart}</div>
            <h2 class="empty-state-title">আপনার কার্ট খালি</h2>
            <p class="empty-state-text">আপনার কার্টে বর্তমানে কোনো কোর্স বা বই যুক্ত নেই।</p>
            <a href="#/courses" class="btn btn-primary" style="margin-top: 1rem;">কোর্সসমূহ দেখুন</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem;">শপিং কার্ট (${cart.length})</h1>

        <div class="cart-layout">
          <!-- Cart Items -->
          <div class="cart-items-table">
            ${cart.map((item, idx) => `
              <div class="cart-item-row">
                <img src="${item.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100'}" class="cart-item-thumb">
                
                <div style="flex: 1; min-width: 0;">
                  <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${item.name}</h4>
                  <span class="text-muted" style="font-size: 0.8rem;">${item.type === 'course' ? '🎓 অনলাইন কোর্স' : item.type === 'digital' ? '⚡ ডিজিটাল শিট' : '📦 হার্ডকভার বই'}</span>
                </div>

                <div class="qty-control">
                  <button class="qty-btn" onclick="window.updateCartQty(${idx}, -1)">-</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.updateCartQty(${idx}, 1)">+</button>
                </div>

                <div style="font-weight: 800; font-family: var(--font-heading); min-width: 80px; text-align: right;">
                  ${formatBDT(item.price * item.quantity)}
                </div>

                <button class="btn btn-ghost btn-sm" onclick="window.removeFromCart(${idx})" style="color: var(--danger);">
                  ${icons.trash}
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Summary Card -->
          <div class="cart-summary-card">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">অর্ডারের বিবরণ</h3>

            <div class="summary-line">
              <span>সাবটোটাল</span>
              <span>${formatBDT(subtotal)}</span>
            </div>

            ${discount > 0 ? `
              <div class="summary-line" style="color: var(--success);">
                <span>কুপন ডিসকাউন্ট (${activeCoupon.code})</span>
                <span>-${formatBDT(discount)}</span>
              </div>
            ` : ''}

            <div class="summary-line total">
              <span>সর্বমোট প্রদেয়</span>
              <span>${formatBDT(total)}</span>
            </div>

            <!-- Coupon Input -->
            <div style="display: flex; gap: 0.5rem; margin: 1.25rem 0;">
              <input type="text" id="coupon-input" class="form-input" placeholder="কুপন কোড (যেমন GENESEON50)" value="${activeCoupon ? activeCoupon.code : ''}">
              <button class="btn btn-secondary" onclick="window.applyCartCoupon()">প্রয়োগ</button>
            </div>

            <a href="#/checkout" class="btn btn-glowing btn-lg btn-block">
              ${icons.check} চেকআউটে এগিয়ে যান
            </a>
          </div>
        </div>
      </div>
    `;
  },

  renderCheckout() {
    const cart = getAccessibleCart();
    if (cart.length === 0) {
      window.location.hash = '#/cart';
      return '';
    }

    let subtotal = 0;
    cart.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    const discount = getCouponDiscount(subtotal);
    const total = Math.max(0, subtotal - discount);
    const supportedCheckout = cart.length > 0 && cart.every(item =>
      ['course', 'digital'].includes(item.type)
    );

    return `
      <div class="container" style="padding-top: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem;">চেকআউট ও নিরাপদ পেমেন্ট</h1>

        <div class="checkout-layout">
          <!-- Left: Information Form -->
          <div class="card" style="padding: 1.75rem;">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">ম্যানুয়াল bKash পেমেন্ট</h3>
            <p class="text-muted">পরের ধাপে অ্যাকাডেমির bKash নম্বর দেখানো হবে। Send Money করার পর নিজের পাঠানো নম্বর ও TrxID জমা দিন। PIN/OTP কখনো দেবেন না।</p>
            
            <div class="payment-gateways-grid">
              <div class="payment-method-card selected" id="method-bkash">
                <div class="gateway-icon bkash-bg">bKash</div>
                <div>
                  <strong>bKash</strong>
                  <div class="text-muted" style="font-size: 0.75rem;">Send Money করে TrxID জমা দিন</div>
                </div>
              </div>
              <p class="text-muted" style="font-size: 0.85rem;">পেমেন্ট যাচাই হলে কোর্স বা ডিজিটাল PDF অ্যাকাউন্টে যোগ হবে। কুপনে মোট মূল্য শূন্য হলে সঙ্গে সঙ্গে চালু হবে।</p>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
              <input type="text" id="coupon-input" class="form-input" placeholder="কুপন কোড লিখুন" value="${activeCoupon ? activeCoupon.code : ''}">
              <button type="button" class="btn btn-secondary" onclick="window.applyCartCoupon()">প্রয়োগ</button>
            </div>
          </div>

          <!-- Right: Summary & Pay Button -->
          <div class="cart-summary-card">
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">অর্ডার সামারি</h3>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
              ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                  <span>${item.name} × ${item.quantity}</span>
                  <strong>${formatBDT(item.price * item.quantity)}</strong>
                </div>
              `).join('')}
            </div>

            <div class="summary-line">
              <span>সাবটোটাল</span>
              <span>${formatBDT(subtotal)}</span>
            </div>

            ${discount > 0 ? `
              <div class="summary-line" style="color: var(--success);">
                <span>কুপন ছাড় (${activeCoupon.code})</span>
                <span>-${formatBDT(discount)}</span>
              </div>
            ` : ''}

            <div class="summary-line total">
              <span>সর্বমোট প্রদেয়</span>
              <span>${formatBDT(total)}</span>
            </div>

            ${supportedCheckout ? '' : '<p class="text-danger">Manual bKash checkout-এ শুধু কোর্স এবং ডিজিটাল PDF কেনা যাবে। কার্ট থেকে অন্য পণ্য সরান।</p>'}
            <button id="pay-now-btn" class="btn btn-glowing btn-lg btn-block" style="margin-top: 1.5rem;" ${supportedCheckout ? '' : 'disabled'} onclick="window.executeCheckoutPayment()">
              ${total === 0 ? 'কুপন ব্যবহার করে নিন' : `bKash পেমেন্ট জমা দিন (${formatBDT(total)})`}
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.addToCartOnly = (id, type) => {
  let item = null;
  if (type === 'course') {
    const c = db.getCourseById(id);
    if (c && (!Auth.getUser() || Auth.canAccessCategory(c.category))) {
      item = { id: c.id, name: c.title, price: c.price, type: 'course', image: c.thumbnail, quantity: 1 };
    }
  } else {
    const p = db.getProductById(id);
    const user = Auth.getUser();
    if (p && (!user || Auth.isAdmin() || p.educationTypes?.includes(user.educationType))) {
      item = { id: p.id, name: p.name, price: p.price, type: p.type, image: p.image, quantity: 1 };
    }
  }

  if (item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing && item.type !== 'digital') existing.quantity++;
    else if (existing) {
      Toast.info('এই PDF ইতিমধ্যে কার্টে আছে।');
      return;
    }
    else cart.push(item);
    saveCart(cart);
    Toast.success('কার্টে যোগ করা হয়েছে!');
  }
};

window.addToCartAndCheckout = (id, type) => {
  window.addToCartOnly(id, type);
  window.location.hash = '#/checkout';
};

window.updateCartQty = (idx, delta) => {
  const cart = getCart();
  if (cart[idx]) {
    if (cart[idx].type === 'digital' && delta > 0) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveCart(cart);
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = StoreView.renderCart();
  }
};

window.removeFromCart = (idx) => {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  Toast.info('আইটেমটি কার্ট থেকে সরানো হয়েছে');
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = StoreView.renderCart();
};

window.applyCartCoupon = async () => {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  try {
    const response = await fetch('/api/payment-info', {
      credentials: 'same-origin'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'কুপন যাচাই করা যায়নি।');
    }
    const coupon = result.coupons?.[code];
    if (!coupon) {
      activeCoupon = null;
      Toast.error('কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।');
    } else {
      activeCoupon = { code, ...coupon };
      Toast.success(`কুপন '${code}' সফলভাবে প্রয়োগ করা হয়েছে!`);
    }
  } catch (error) {
    activeCoupon = null;
    console.error('Could not validate coupon:', error);
    Toast.error(error.message || 'কুপন যাচাই করা যায়নি।');
  }
  const content = document.getElementById('main-content');
  if (content) {
    content.innerHTML = window.location.hash.startsWith('#/checkout')
      ? StoreView.renderCheckout()
      : StoreView.renderCart();
  }
};

window.executeCheckoutPayment = () => {
  const cart = getCart();

  PaymentService.processPayment({
    items: cart,
    couponCode: activeCoupon?.code || '',
    gateway: 'bKash',
    onComplete: (order) => {
      window.location.hash = '#/dashboard';
    }
  });
};


/* --- [js/views/dashboardView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - STUDENT PERSONALIZED DASHBOARD VIEW
   ========================================================================== */
const DashboardView = window.DashboardView = {
  render() {
    const user = Auth.getUser();
    if (!user) return '';
    const isAdminPreview = Auth.isAdmin() && !user.educationType;
    const category = user.educationType || 'SSC';
    const courses = db.getCourses().filter(c => c.category === category);
    const activeCourse = courses[0];
    const exams = db.getExams().filter(e => e.category === category);
    const attempts = db.getExamAttempts(user.id);

    // Calculate greeting based on current hour
    const hour = new Date().getHours();
    let greeting = i18n.t('goodMorning');
    if (hour >= 12 && hour < 17) greeting = i18n.t('goodAfternoon');
    else if (hour >= 17) greeting = i18n.t('goodEvening');

    // Dynamic tasks list based on user category
    let defaultTasks = [
      { id: 't1', text: 'পদার্থবিজ্ঞান অধ্যায় ১: ভার্নিয়ার ধ্রুবক লেকচার দেখা', done: true },
      { id: 't2', text: 'জেনেসিওন একাডেমি প্রশ্নব্যাংক থেকে ২০টি বোর্ড MCQ সমাধান', done: false },
      { id: 't3', text: 'আজকের সাপ্তাহিক লাইভ মডেল টেস্টে অংশগ্রহণ', done: false },
      { id: 't4', text: 'দুর্বল টপিক ডায়াগনস্টিক রিপোর্ট রিভিউ করা', done: false }
    ];

    if (category === 'JOB') {
      defaultTasks = [
        { id: 't1', text: 'বাংলা সাহিত্য: প্রাচীন ও মধ্যযুগের চর্যাপদ রিভিশন', done: true },
        { id: 't2', text: '৪৬তম বিসিএস বাংলাদেশ বিষয়াবলী প্রশ্ন এনালাইসিস', done: false },
        { id: 't3', text: 'গাণিতিক যুক্তির শতকরা ও লাভ-ক্ষতির শর্টকাট প্র্যাকটিস', done: false },
        { id: 't4', text: 'ডেইলি আন্তর্জাতিক সাম্প্রতিক সমাচার কুইজ', done: false }
      ];
    } else if (category === 'HSC') {
      defaultTasks = [
        { id: 't1', text: 'উচ্চতর গণিত: ভেক্টর ডট ও ক্রস গুণনের প্রয়োগ', done: true },
        { id: 't2', text: 'রসায়ন ২য় পত্র: জৈব যৌগের রূপান্তর চার্ট মুখস্থ', done: false },
        { id: 't3', text: 'এইচএসসি মেগা মডেল টেস্ট ০১ দেওয়া', done: false }
      ];
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <!-- Header Banner -->
        <div class="dashboard-header">
          <div class="dashboard-welcome">
            <h1>${greeting}, ${user.name}!</h1>
            <p>
              ${isAdminPreview ? 'শিক্ষার্থী ভিউ:' : 'তোমার বর্তমান লক্ষ্য:'}
              <span class="badge badge-${category.toLowerCase()}">${isAdminPreview ? `${category} Preview` : user.batchOrTarget || (category + ' Batch')}</span>
            </p>
          </div>

          <div class="dashboard-quick-stats">
            <div class="streak-card">
              <div class="streak-icon">🔥</div>
              <div>
                <div class="streak-number">${user.streak || 12} দিন</div>
                <div class="streak-label">স্টাডি স্ট্রিক</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Bar -->
        <div class="quick-actions-bar">
          <a href="#/my-courses" class="quick-action-btn">
            <div class="quick-action-icon">${icons.video}</div>
            <span style="font-size: 0.85rem; font-weight: 600;">আমার কোর্স</span>
          </a>
          <a href="#/exam" class="quick-action-btn">
            <div class="quick-action-icon">${icons.award}</div>
            <span style="font-size: 0.85rem; font-weight: 600;">মডেল টেস্ট</span>
          </a>
          <a href="#/question-bank" class="quick-action-btn">
            <div class="quick-action-icon">${icons.book}</div>
            <span style="font-size: 0.85rem; font-weight: 600;">প্রশ্নব্যাংক</span>
          </a>
          <a href="#/ai" class="quick-action-btn">
            <div class="quick-action-icon">${icons.sparkles}</div>
            <span style="font-size: 0.85rem; font-weight: 600;">এআই টিউটর</span>
          </a>
          <a href="#/store" class="quick-action-btn">
            <div class="quick-action-icon">${icons.shoppingCart}</div>
            <span style="font-size: 0.85rem; font-weight: 600;">বই ও নোটস</span>
          </a>
          ${user.role === 'STUDENT' && user.adminEligible ? `
            <button type="button" class="quick-action-btn" onclick="window.openAdminModeModal()">
              <div class="quick-action-icon">${icons.user}</div>
              <span style="font-size: 0.85rem; font-weight: 600;">Admin mode-এ ফিরুন</span>
            </button>
          ` : ''}
        </div>

        <div class="dashboard-grid">
          <!-- Left Column -->
          <div>
            <!-- Continue Learning Banner -->
            ${activeCourse ? `
              <div class="continue-learning-card">
                <img src="${activeCourse.thumbnail}" class="course-thumb-mini">
                <div class="continue-info">
                  <div class="tag">চালু কোর্স • ${activeCourse.category}</div>
                  <h3>${activeCourse.title}</h3>
                  <div class="lesson-name">বর্তমান ক্লাস: অধ্যায় ০১ - ভৌত রাশি ও পরিমাপ</div>
                  <div class="progress-bar" style="margin-bottom: 0.85rem;">
                    <div class="progress-fill" style="width: 45%;"></div>
                  </div>
                  <a href="#/learn/course/${activeCourse.id}" class="btn btn-primary btn-sm">
                    ${icons.play} পড়া চালিয়ে যান (Resume)
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Performance Stats Grid -->
            <div class="stats-cards-grid">
              <div class="stat-box">
                <div class="val">${attempts.length || 6}</div>
                <div class="lbl">অংশগ্রহণকৃত পরীক্ষা</div>
              </div>
              <div class="stat-box">
                <div class="val" style="color: var(--primary);">88.5%</div>
                <div class="lbl">গড় স্কোর</div>
              </div>
              <div class="stat-box">
                <div class="val" style="color: var(--success);">94.2%</div>
                <div class="lbl">নির্ভুলতা (Accuracy)</div>
              </div>
            </div>

            <!-- Recommended Content for target -->
            <div class="recommended-section">
              <h2>${i18n.t('recommendedForYou')} (${category})</h2>
              <div class="courses-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 1.5rem;">
                ${courses.slice(0, 2).map(c => `
                  <div class="course-card">
                    <div class="course-thumb-wrap">
                      <img src="${c.thumbnail}" alt="${c.title}" loading="lazy">
                      <span class="course-category-badge badge badge-${c.category.toLowerCase()}">${c.category}</span>
                    </div>
                    <div class="course-body">
                      <h4 class="course-title" style="font-size: 1rem;">${c.title}</h4>
                      <div class="course-footer">
                        <span class="current-price" style="font-size: 1.1rem;">${formatBDT(c.price)}</span>
                        <a href="#/course/${c.id}" class="btn btn-primary btn-sm">দেখুন</a>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Today's Study Tasks Checklist -->
            <div class="tasks-card">
              <div class="tasks-header">
                <h3 style="font-size: 1.1rem;">${i18n.t('todaysTasks')}</h3>
                <span class="badge badge-ssc">আজকের লক্ষ্য</span>
              </div>
              <ul class="tasks-list">
                ${defaultTasks.map(t => `
                  <li class="task-item ${t.done ? 'completed' : ''}" onclick="this.classList.toggle('completed')">
                    <input type="checkbox" class="task-checkbox" ${t.done ? 'checked' : ''}>
                    <span class="task-text">${t.text}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Upcoming Live Exams Widget -->
            <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">আসন্ন লাইভ পরীক্ষা</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${exams.map(e => `
                  <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <h5 style="font-size: 0.9rem; margin-bottom: 0.2rem;">${e.title}</h5>
                      <span class="text-muted" style="font-size: 0.75rem;">সময়: ${e.durationMinutes} মি. • ${e.totalMarks} নম্বর</span>
                    </div>
                    <a href="#/exam/${e.id}" class="btn btn-outline btn-sm">অংশগ্রহণ</a>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AI Study Tip -->
            <div class="card" style="background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%); color: white;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.25rem;">⚡</span>
                <strong style="font-size: 0.95rem;">এআই স্টাডি টিপস</strong>
              </div>
              <p style="font-size: 0.85rem; color: #C7D2FE; line-height: 1.5;">
                যে কোনো সূত্রের ডেরিভেশন মুখস্থ করার চেয়ে ৩টি আলাদা প্র্যাকটিস ম্যাথ সমাধান করলে পড়া মস্তিষ্কে দীর্ঘস্থায়ী হয়।
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};


/* --- [js/views/studentViews.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - MY COURSES, MY EXAMS, PROFILE & NOTIFICATIONS VIEWS
   ========================================================================== */
const MyCoursesView = window.MyCoursesView = {
  render() {
    const user = Auth.getUser();
    if (!user) return '';
    const enrolledIds = new Set(user.enrolledCourses || []);
    const enrolled = db.getCourses().filter(c => enrolledIds.has(c.id) && Auth.canAccessCourse(c));

    return `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">আমার এনরোলকৃত কোর্সসমূহ</h1>
          <p class="text-muted">আপনার কেনা কোর্সগুলো থেকে ক্লাস চালিয়ে যান</p>
        </div>

        ${enrolled.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${icons.video}</div>
            <h3 class="empty-state-title">আপনি এখনো কোনো কোর্সে ভর্তি হননি</h3>
            <p class="empty-state-text">সেরা প্রস্তুতি নিতে এখনই আমাদের স্পেশাল কোর্সগুলোতে যোগ দিন।</p>
            <a href="#/courses" class="btn btn-primary" style="margin-top: 1rem;">কোর্সসমূহ দেখুন</a>
          </div>
        ` : `
          <div class="courses-grid">
            ${enrolled.map(c => `
              <div class="course-card">
                <div class="course-thumb-wrap">
                  <img src="${c.thumbnail}" alt="${c.title}">
                  <span class="course-category-badge badge badge-${c.category.toLowerCase()}">${c.category}</span>
                </div>
                <div class="course-body">
                  <h3 class="course-title" title="${c.title}">${c.title}</h3>
                  <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.35rem;">
                      <span>কোর্স অগ্রগতি</span>
                      <strong>45% সম্পন্ন</strong>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 45%;"></div>
                    </div>
                  </div>
                  <a href="#/learn/course/${c.id}" class="btn btn-primary btn-block">
                    ${icons.play} ক্লাস শুরু করুন
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
};
const MyExamsView = window.MyExamsView = {
  render() {
    const user = Auth.getUser();
    if (!user) return '';
    const attempts = db.getExamAttempts(user.id)
      .filter(attempt => Auth.isAdmin() || Auth.canAccessCategory(attempt.category));

    return `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">আমার পরীক্ষা ও ফলাফল</h1>
          <p class="text-muted">বিগত পরীক্ষার স্কোরকার্ড ও পারফরম্যান্স এনালাইসিস</p>
        </div>

        ${attempts.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${icons.award}</div>
            <h3 class="empty-state-title">কোনো পরীক্ষার রেকর্ড পাওয়া যায়নি</h3>
            <p class="empty-state-text">নিজেকে যাচাই করতে এখনই লাইভ মডেল টেস্টে অংশগ্রহণ করুন।</p>
            <a href="#/exam" class="btn btn-primary" style="margin-top: 1rem;">পরীক্ষা দিন</a>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 860px; margin: 0 auto 3rem;">
            ${attempts.map(a => `
              <div class="card" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.5rem;">
                <div>
                  <span class="badge badge-${(a.category || 'SSC').toLowerCase()}" style="margin-bottom: 0.35rem;">${a.category || 'SSC'}</span>
                  <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${a.examTitle}</h3>
                  <div class="text-muted" style="font-size: 0.825rem;">তারিখ: ${a.submittedAt}</div>
                </div>

                <div style="display: flex; align-items: center; gap: 2rem;">
                  <div style="text-align: center;">
                    <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary); font-family: var(--font-heading);">${a.score} / ${a.totalMarks}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">প্রাপ্ত নম্বর (${a.percentage}%)</div>
                  </div>

                  <a href="#/exam/result/${a.id}" class="btn btn-outline btn-sm">
                    ${icons.barChart} বিস্তারিত রেজাল্ট
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
};
const ProfileView = window.ProfileView = {
  render() {
    const user = Auth.getUser();
    if (!user) return '';

    return `
      <div class="container container-sm" style="padding-top: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem;">প্রোফাইল ও একাডেমিক তথ্য</h1>

        <div class="card" style="padding: 2rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--divider);">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--primary-light);">
            <div>
              <h2 style="font-size: 1.4rem; margin-bottom: 0.25rem;">${user.name}</h2>
              <p class="text-muted" style="font-size: 0.9rem;">${user.email} • ${user.mobile}</p>
              <span class="badge badge-${(user.educationType || 'SSC').toLowerCase()}" style="margin-top: 0.5rem;">${user.batchOrTarget || user.educationType}</span>
            </div>
          </div>

          <form id="profile-edit-form" onsubmit="window.handleSaveProfile(event)">
            <div class="form-group">
              <label class="form-label">পূর্ণ নাম</label>
              <input type="text" id="prof-name" class="form-input" value="${user.name}" required>
            </div>

            <div class="form-group">
              <label class="form-label">মোবাইল নম্বর</label>
              <input type="tel" id="prof-mobile" class="form-input" value="${user.mobile}" required>
            </div>

            <div class="form-group">
              <label class="form-label">টার্গেট প্রস্তুতি ক্যাটাগরি</label>
              <div class="form-input" aria-readonly="true">${user.educationType}</div>
            </div>

            <div class="form-group">
              <label class="form-label">ব্যাচ বা টার্গেট স্পেসিফিকেশন</label>
              <input type="text" id="prof-batch" class="form-input" value="${user.batchOrTarget || ''}" placeholder="যেমন: SSC 2026 Batch / 47th BCS Aspirant">
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
              <button type="button" class="btn btn-secondary" onclick="i18n.toggleLang(); Toast.info('ভাষা পরিবর্তন করা হয়েছে');">
                🌐 ভাষা পরিবর্তন (বাংলা / English)
              </button>

              <button type="submit" class="btn btn-primary">
                ${icons.check} তথ্য সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
        ${user.role === 'STUDENT' && user.adminEligible ? `
          <div class="card" style="padding: 1.5rem;">
            <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem;">অ্যাডমিন অ্যাকাউন্ট</h2>
            <p class="text-muted" style="margin-bottom: 1rem;">এই account আগে থেকে নির্ধারিত admin account। পাসওয়ার্ড নিশ্চিত করে admin mode-এ ফিরতে পারবেন।</p>
            <button type="button" class="btn btn-primary" onclick="window.openAdminModeModal()">Admin mode-এ ফিরুন</button>
          </div>
        ` : ''}
      </div>
    `;
  }
};
const NotificationsView = window.NotificationsView = {
  render() {
    const user = Auth.getUser() || db.getUserById('usr_ssc');
    const notifs = db.getNotifications(user.id);

    return `
      <div class="container container-sm" style="padding-top: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem;">নোটিফিকেশন সেন্টার</h1>
          <button class="btn btn-ghost btn-sm" onclick="window.markAllNotifsRead()">সবগুলো পড়া হয়েছে চিহ্নিত করুন</button>
        </div>

        ${notifs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">🎉</div>
            <h3 class="empty-state-title">আপনি সব আপডেট জেনে নিয়েছেন!</h3>
            <p class="empty-state-text">বর্তমানে নতুন কোনো নোটিফিকেশন নেই।</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${notifs.map(n => `
              <div class="card" style="padding: 1.25rem; display: flex; align-items: flex-start; gap: 1rem; border-left: 4px solid ${n.isRead ? 'var(--border-color)' : 'var(--primary)'}; background: ${n.isRead ? 'var(--bg-surface)' : 'var(--primary-light)'};">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${n.type === 'course' ? icons.video : n.type === 'exam' ? icons.award : icons.bell}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <h4 style="font-size: 1rem;">${n.title}</h4>
                    <span class="text-muted" style="font-size: 0.75rem;">${n.date}</span>
                  </div>
                  <p style="color: var(--text-muted); font-size: 0.9rem;">${n.message}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
};

window.handleSaveProfile = (e) => {
  e.preventDefault();
  const updates = {
    name: document.getElementById('prof-name').value,
    mobile: document.getElementById('prof-mobile').value,
    batchOrTarget: document.getElementById('prof-batch').value
  };
  Auth.updateProfile(updates);
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = ProfileView.render();
};

window.openAdminModeModal = () => {
  const user = Auth.getUser();
  if (!user || user.role !== 'STUDENT' || !user.adminEligible) return;
  Modal.open({
    title: 'Admin mode চালু করুন',
    content: `
      <form onsubmit="window.submitAdminMode(event)">
        <div class="form-group">
          <label class="form-label" for="admin-mode-password">এই অ্যাকাউন্টের পাসওয়ার্ড *</label>
          <div class="password-input-wrapper">
            <input class="form-input has-password-toggle" type="password" id="admin-mode-password" autocomplete="current-password" required>
            <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('admin-mode-password', this)">${icons.eye}</button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Admin mode চালু করুন</button>
      </form>
    `
  });
};

window.submitAdminMode = async (event) => {
  event.preventDefault();
  const password = document.getElementById('admin-mode-password').value;
  Modal.close();
  await Auth.switchAdminMode({ role: 'ADMIN', password });
};

window.markAllNotifsRead = () => {
  const user = Auth.getUser();
  if (user) {
    db.getNotifications(user.id).forEach(n => db.markNotificationRead(n.id));
    Toast.success('সকল নোটিফিকেশন পড়া হয়েছে চিহ্নিত করা হয়েছে');
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = NotificationsView.render();
  }
};


/* --- [js/views/adminView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - ADMIN DASHBOARD & COMPLETE MANAGEMENT VIEW
   ========================================================================== */





let activeAdminTab = 'dashboard';
let activeStudentCategory = 'ALL';
let pdfQuestionDrafts = [];
const JOB_EXAM_OPTIONS = ['BCS', 'Bank Preliminary', 'Primary'];
const ADMIN_QUESTION_DETAILS_SELECTOR = [
  '.admin-question-category',
  '.admin-question-job-exam',
  '.admin-question-subject',
  '.admin-question-chapter',
  '.admin-question-type'
].map(selector => `details${selector}`).join(', ');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function getAdminQuestionPath(root, trigger) {
  const questionItem = trigger?.closest('article.admin-question-item');
  if (!questionItem || !root.contains(questionItem)) return [];
  const path = [];
  let current = questionItem.closest(ADMIN_QUESTION_DETAILS_SELECTOR);
  while (current) {
    path.unshift({
      className: [...current.classList].find(className => className.startsWith('admin-question-')),
      label: current.querySelector(':scope > summary')?.firstElementChild?.textContent.trim() || ''
    });
    current = current.parentElement?.closest(ADMIN_QUESTION_DETAILS_SELECTOR);
  }
  return path;
}

function restoreAdminQuestionPath(root, path) {
  let parent = root;
  for (const { className, label } of path) {
    const matchingDetails = [...parent.children].find(child =>
      child.tagName === 'DETAILS'
      && child.classList.contains(className)
      && child.querySelector(':scope > summary')?.firstElementChild?.textContent.trim() === label
    );
    if (!matchingDetails) break;
    matchingDetails.open = true;
    parent = matchingDetails;
  }
}

function getQuestionHierarchyFields(question) {
  const hasExamNameField = Object.prototype.hasOwnProperty.call(question, 'examName');
  const isLegacyJobQuestion = question.category === 'JOB' && !hasExamNameField;
  return {
    examName: question.category === 'JOB'
      ? (isLegacyJobQuestion
        ? (question.subject || 'অন্যান্য পরীক্ষা')
        : (question.examName || 'পরীক্ষার নাম উল্লেখ নেই'))
      : '',
    subject: isLegacyJobQuestion
      ? (question.chapter || 'অন্যান্য বিষয়')
      : (question.subject || 'অন্যান্য বিষয়'),
    chapter: isLegacyJobQuestion
      ? (question.topic || 'অন্যান্য অধ্যায়')
      : (question.chapter || 'অন্যান্য অধ্যায়')
  };
}

function buildQuestionSubjectGroups(questions) {
  const subjects = new Map();
  questions.forEach(question => {
    const fields = getQuestionHierarchyFields(question);
    if (!subjects.has(fields.subject)) subjects.set(fields.subject, new Map());
    const chapters = subjects.get(fields.subject);
    if (!chapters.has(fields.chapter)) chapters.set(fields.chapter, []);
    chapters.get(fields.chapter).push(question);
  });
  return [...subjects.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([subject, chapters]) => ({
    subject,
    chapters: [...chapters.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([chapter, groupedQuestions]) => ({
      chapter,
      questions: groupedQuestions
    }))
  }));
}

function buildJobExamGroups(questions) {
  const exams = new Map();
  questions.forEach(question => {
    const { examName } = getQuestionHierarchyFields(question);
    if (!exams.has(examName)) exams.set(examName, []);
    exams.get(examName).push(question);
  });
  return [...exams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([examName, examQuestions]) => ({
    examName,
    questions: examQuestions,
    subjects: buildQuestionSubjectGroups(examQuestions)
  }));
}

function renderAdminQuestionTypeGroups(questions, category) {
  const types = category === 'JOB'
    ? [
        { value: 'MCQ', label: 'MCQ' },
        { value: 'WRITTEN', label: 'Written', matches: ['CQ', 'WRITTEN'] }
      ]
    : [
        { value: 'MCQ', label: 'MCQ' },
        { value: 'CQ', label: 'CQ' },
        { value: 'WRITTEN', label: 'Written' }
      ];
  return types.map(({ value, label, matches = [value] }) => {
    const typedQuestions = questions.filter(question =>
      matches.includes(question.questionType || 'MCQ')
    );
    if (!typedQuestions.length) return '';
    return `
      <details class="admin-question-type">
        <summary>
          <span>${label}</span>
          <span class="admin-question-count">${typedQuestions.length}টি প্রশ্ন</span>
        </summary>
        <div class="admin-question-list">
          ${typedQuestions.map((question, index) => `
            <article class="admin-question-item">
              <div class="admin-question-text">
                ${question.questionType === 'CQ' ? `
                  <strong>${index + 1}. উদ্দীপক: ${escapeHtml(question.stimulus || '')}</strong>
                  ${question.stimulusImageUrl ? `<img src="${escapeHtml(question.stimulusImageUrl)}" alt="উদ্দীপকের ছবি" loading="lazy" style="display: block; max-width: 100%; max-height: 240px; object-fit: contain; margin: 0.5rem 0; border-radius: var(--radius-md);">` : ''}
                  <ol class="admin-cq-parts">
                    ${(question.parts || []).map(part => `<li><strong>${escapeHtml(part.label)})</strong> ${escapeHtml(part.question || '')}</li>`).join('')}
                  </ol>
                ` : `
                  <strong>${index + 1}. ${escapeHtml(question.text)}</strong>
                  ${question.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="প্রশ্নের ছবি" loading="lazy" style="display: block; max-width: 100%; max-height: 240px; object-fit: contain; margin: 0.5rem 0; border-radius: var(--radius-md);">` : ''}
                  ${question.questionType === 'WRITTEN' && question.answer ? `<p>উত্তর: ${escapeHtml(question.answer)}</p>` : ''}
                `}
                <div class="admin-question-meta">
                  ${question.board || question.year ? `${escapeHtml(question.board || '')}${question.board && question.year ? ' • ' : ''}${escapeHtml(question.year || '')} · ` : ''}
                  ${question.questionType === 'MCQ' || !question.questionType ? `সঠিক উত্তর: ${escapeHtml((question.options || [])[question.correctIndex] || '—')} · ` : ''}
                  ${escapeHtml(question.difficulty || '—')}
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-success btn-sm" aria-label="প্রশ্ন সম্পাদনা করুন" onclick="window.openEditQuestionModal('${escapeHtml(question.id)}')">${icons.edit}</button>
                <button class="btn btn-danger btn-sm" aria-label="প্রশ্ন মুছুন" onclick="window.deleteQuestionAdmin('${escapeHtml(question.id)}', this)">${icons.trash}</button>
              </div>
            </article>
          `).join('')}
        </div>
      </details>
    `;
  }).join('');
}

function renderCourseEditorLesson(lesson = {}) {
  const pdfUrl = lesson.pdfUrl === '#' ? '' : (lesson.pdfUrl || '');
  const notesPdfUrl = lesson.notesPdfUrl === '#' ? '' : (lesson.notesPdfUrl || '');
  return `
    <div class="course-editor-lesson" data-lesson-id="${escapeHtml(lesson.id || '')}" data-video-url="${escapeHtml(lesson.videoUrl || '')}" data-video-type="${escapeHtml(lesson.contentType || '')}" data-pdf-url="${escapeHtml(pdfUrl)}" data-pdf-title="${escapeHtml(lesson.pdfTitle || '')}" data-notes-pdf-url="${escapeHtml(notesPdfUrl)}" data-notes-pdf-title="${escapeHtml(lesson.notesPdfTitle || '')}" style="padding: 1rem; margin-top: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
      <div class="form-group">
        <label class="form-label">লেকচারের নাম *</label>
        <input class="form-input course-lesson-title" required maxlength="160" value="${escapeHtml(lesson.title || '')}" placeholder="যেমন: লেকচার ০১ - মৌলিক ধারণা">
      </div>
      <div class="form-group">
        <label class="form-label">ভিডিও (MP4/WebM/MOV, সর্বোচ্চ ৫ GB)</label>
        <input type="file" class="form-input course-lesson-video" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov">
        ${lesson.videoUrl ? `<small class="text-muted">বর্তমান ভিডিও: <a href="${escapeHtml(lesson.videoUrl)}" target="_blank" rel="noopener">দেখুন</a> (নতুন ফাইল দিলে প্রতিস্থাপিত হবে)</small>` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">লেকচার PDF (সর্বোচ্চ ১০০ MB)</label>
        <input type="file" class="form-input course-lesson-pdf" accept="application/pdf,.pdf">
        ${pdfUrl ? `<small class="text-muted">বর্তমান PDF: <a href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener">দেখুন</a> (নতুন ফাইল দিলে প্রতিস্থাপিত হবে)</small>` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">Notes PDF (ঐচ্ছিক, সর্বোচ্চ ১০০ MB)</label>
        <input type="file" class="form-input course-lesson-notes-pdf" accept="application/pdf,.pdf">
        ${notesPdfUrl ? `<small class="text-muted">বর্তমান Notes PDF: <a href="${escapeHtml(notesPdfUrl)}" target="_blank" rel="noopener">দেখুন</a> (নতুন ফাইল দিলে প্রতিস্থাপিত হবে)</small>` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">লেকচার নোটস</label>
        <textarea class="form-textarea course-lesson-notes" rows="3" maxlength="10000" placeholder="এই লেকচারের নোটস এখানে লিখুন">${escapeHtml(lesson.notes || '')}</textarea>
      </div>
      <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.course-editor-lesson').remove()">লেকচার মুছুন</button>
    </div>
  `;
}

function renderCourseEditorChapter(chapter = {}, index = 0) {
  const lessons = Array.isArray(chapter.lessons) && chapter.lessons.length
    ? chapter.lessons
    : [{}];
  return `
    <section class="course-editor-chapter" data-chapter-id="${escapeHtml(chapter.id || '')}" style="padding: 1rem; margin-top: 1rem; border: 1px solid var(--primary-light); border-radius: var(--radius-lg);">
      <div class="form-group">
        <label class="form-label">Chapter ${index + 1}-এর নাম *</label>
        <input class="form-input course-chapter-title" required maxlength="160" value="${escapeHtml(chapter.title || '')}" placeholder="যেমন: অধ্যায় ০১ - ভৌত রাশি ও পরিমাপ">
      </div>
      <div class="course-editor-lessons">
        ${lessons.map(renderCourseEditorLesson).join('')}
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.addCourseEditorLesson(this)">+ লেকচার যোগ করুন</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.course-editor-chapter').remove()">Chapter মুছুন</button>
      </div>
    </section>
  `;
}

function openCourseEditor(course = null) {
  const chapters = course?.chapters?.length
    ? course.chapters
    : [{ title: '', lessons: [{}] }];
  Modal.open({
    title: course ? 'কোর্স ও অধ্যায় সম্পাদনা করুন' : 'নতুন অনলাইন কোর্স তৈরি করুন',
    maxWidth: '760px',
    content: `
      <form id="create-course-form" onsubmit="window.saveNewCourse(event)">
        <input type="hidden" id="course-edit-id" value="${escapeHtml(course?.id || '')}">
        <div class="form-group">
          <label class="form-label">কোর্সের শিরোনাম *</label>
          <input type="text" id="new-crs-title" class="form-input" required maxlength="160" value="${escapeHtml(course?.title || '')}" placeholder="যেমন: SSC 2026 রসায়ন ক্র্যাশ কোর্স">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">টার্গেট ক্যাটাগরি *</label>
            <select id="new-crs-cat" class="form-select" required>
              <option value="SSC" ${course?.category === 'SSC' ? 'selected' : ''}>এসএসসি (SSC)</option>
              <option value="HSC" ${course?.category === 'HSC' ? 'selected' : ''}>এইচএসসি (HSC)</option>
              <option value="JOB" ${course?.category === 'JOB' ? 'selected' : ''}>বিসিএস ও চাকরি (JOB)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">মূল্য (৳) *</label>
            <input type="number" id="new-crs-price" class="form-input" required min="0" value="${escapeHtml(course?.price ?? 1500)}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">ইনস্ট্রাক্টর নাম *</label>
          <input type="text" id="new-crs-inst" class="form-input" required value="${escapeHtml(course?.instructor?.name || 'ইঞ্জি. মো. রফিকুল ইসলাম (BUET)')}">
        </div>
        <div class="form-group">
          <label class="form-label">কোর্স বিবরণী</label>
          <textarea id="new-crs-desc" class="form-textarea" maxlength="5000" placeholder="কোর্সের বিস্তারিত তথ্য...">${escapeHtml(course?.description || '')}</textarea>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem;">
          <div>
            <h4>Chapter ও Lecture কনটেন্ট</h4>
            <small class="text-muted">প্রতি Lecture-এ ভিডিও, PDF, লিখিত Notes এবং Notes PDF যোগ করুন।</small>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.addCourseEditorChapter()">+ Chapter যোগ করুন</button>
        </div>
        <div id="course-editor-chapters">
          ${chapters.map(renderCourseEditorChapter).join('')}
        </div>
        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.25rem;">${course ? 'পরিবর্তনগুলো সংরক্ষণ করুন' : 'কোর্সটি প্রকাশ করুন'}</button>
      </form>
    `
  });
}
const AdminView = window.AdminView = {
  serverStudents: [],
  examAttempts: [],
  paymentOrders: [],
  brandingLogoUrl: null,

  async loadFromServer() {
    const response = await fetch('/api/admin/state', { credentials: 'same-origin' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'অ্যাডমিন ডেটা লোড করা যায়নি।');
    this.serverStudents = result.users || result.students || [];
    this.examAttempts = result.examAttempts || [];
    this.paymentOrders = result.paymentOrders || [];
    this.brandingLogoUrl = result.branding?.logoUrl || null;
    db.mergeServerContent(result);
  },

  async saveResource(collection, resource) {
    const response = await fetch(`/api/admin/resources/${collection}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resource)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'তথ্য সংরক্ষণ করা যায়নি।');
    if (collection === 'products') db.saveProduct(result.resource);
    else db.mergeServerContent({ [collection]: [result.resource] });
  },

  async deleteResource(collection, id) {
    const response = await fetch(`/api/admin/resources/${collection}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'তথ্য মুছতে পারেনি।');
    return result.deleted;
  },

  async resetStudentPassword(userId, password) {
    const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/password`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'পাসওয়ার্ড রিসেট করা যায়নি।');
  },

  async gradeCQAttempt(attemptId, cqScore, feedback) {
    const response = await fetch(`/api/admin/exam-attempts/${encodeURIComponent(attemptId)}/grade`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cqScore, feedback })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'CQ নম্বর সংরক্ষণ করা যায়নি।');
    this.examAttempts = this.examAttempts.map(attempt =>
      attempt.id === attemptId ? result.attempt : attempt
    );
    return result.attempt;
  },

  async reviewPaymentOrder(orderId, status) {
    const response = await fetch(
      `/api/admin/orders/${encodeURIComponent(orderId)}/review`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'অর্ডার যাচাই করা যায়নি।');
    this.paymentOrders = this.paymentOrders.map(order =>
      order.id === orderId ? result.order : order
    );
    return result.order;
  },

  async uploadFile(file, category, purpose) {
    const maxSize = purpose === 'video'
      ? 5 * 1024 * 1024 * 1024
      : purpose === 'question-image'
        ? 5 * 1024 * 1024
        : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(
        purpose === 'video'
          ? 'ভিডিও ফাইল সর্বোচ্চ ৫ GB হতে পারে।'
          : purpose === 'question-image'
            ? 'প্রশ্নের ছবি সর্বোচ্চ ৫ MB হতে পারে।'
          : 'PDF ফাইল সর্বোচ্চ ১০০ MB হতে পারে।'
      );
    }
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        purpose,
        fileName: file.name,
        size: file.size
      })
    });
    const upload = await response.json();
    if (!response.ok) throw new Error(upload.error || 'ফাইল আপলোড শুরু করা যায়নি।');

    const storageResponse = await fetch(upload.upload.signedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': upload.asset.contentType,
        'x-upsert': 'false'
      },
      body: file
    });
    if (!storageResponse.ok) {
      const error = await storageResponse.json().catch(() => ({}));
      throw new Error(error.message || 'Supabase Storage-এ ফাইল আপলোড করা যায়নি।');
    }

    const completeResponse = await fetch('/api/admin/upload/complete', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: upload.uploadId })
    });
    const result = await completeResponse.json();
    if (!completeResponse.ok) throw new Error(result.error || 'ফাইল আপলোড সম্পন্ন করা যায়নি।');
    return result;
  },

  render(subTab = 'dashboard') {
    activeAdminTab = subTab;
    const users = this.serverStudents;
    const students = users.filter(user => user.role === 'STUDENT');
    const courses = db.getCourses();
    const exams = db.getExams();
    const questions = db.getQuestions();
    const orders = [
      ...this.paymentOrders.filter(order => order.status !== 'pending'),
      ...db.getOrders()
    ];
    const products = db.getProducts();

    let totalRevenue = 0;
    orders.forEach(o => {
      if (o.status === 'approved' || o.status === 'completed') {
        totalRevenue += (o.totalAmount || 0);
      }
    });

    return `
      <div class="admin-layout">
        <!-- Admin Dark Sidebar -->
        <aside class="admin-sidebar" id="admin-sidebar">
          <div class="admin-brand">
            ${icons.logo}
            <span>Geneseon Academy ADMIN</span>
            <span class="admin-badge">PORTAL</span>
          </div>

          <ul class="admin-nav-list">
            <li class="admin-nav-section-title">মেন্যু ও বিশ্লেষণ</li>
            <a href="#/admin" class="admin-nav-item ${activeAdminTab === 'dashboard' ? 'active' : ''}">
              ${icons.barChart} <span>ওভারভিউ ড্যাশবোর্ড</span>
            </a>

            <li class="admin-nav-section-title">একাডেমিক কন্টেন্ট</li>
            <a href="#/admin/courses" class="admin-nav-item ${activeAdminTab === 'courses' ? 'active' : ''}">
              ${icons.video} <span>কোর্স ব্যবস্থাপনা (${courses.length})</span>
            </a>
            <a href="#/admin/questions" class="admin-nav-item ${activeAdminTab === 'questions' ? 'active' : ''}">
              ${icons.book} <span>ডিজিটাল প্রশ্নব্যাংক (${questions.length})</span>
            </a>
            <a href="#/admin/exams" class="admin-nav-item ${activeAdminTab === 'exams' ? 'active' : ''}">
              ${icons.award} <span>মডেল টেস্ট ও এক্সাম (${exams.length})</span>
            </a>
            <a href="#/admin/cq-submissions" class="admin-nav-item ${activeAdminTab === 'cq-submissions' ? 'active' : ''}">
              ${icons.book} <span>CQ উত্তরপত্র (${this.examAttempts.filter(attempt => attempt.cqStatus === 'pending').length})</span>
            </a>

            <li class="admin-nav-section-title">ই-কমার্স ও অর্থায়ন</li>
            <a href="#/admin/store" class="admin-nav-item ${activeAdminTab === 'store' ? 'active' : ''}">
              ${icons.shoppingCart} <span>স্টোর পণ্য (${products.length})</span>
            </a>
            <a href="#/admin/store-requests" class="admin-nav-item ${activeAdminTab === 'store-requests' ? 'active' : ''}">
              ${icons.shoppingCart} <span>অর্ডার রিকোয়েস্ট (${this.paymentOrders.filter(order => order.status === 'pending').length})</span>
            </a>

            <li class="admin-nav-section-title">ইউজার ম্যানেজমেন্ট</li>
            <a href="#/admin/students" class="admin-nav-item ${activeAdminTab === 'students' ? 'active' : ''}">
              ${icons.user} <span>ইউজার ম্যানেজমেন্ট (${students.length})</span>
            </a>
            <a href="#/admin/settings" class="admin-nav-item ${activeAdminTab === 'settings' ? 'active' : ''}">
              ${icons.settings} <span>সাইট ব্র্যান্ডিং</span>
            </a>

            <li class="admin-nav-section-title">অন্যান্য</li>
            <a href="#/dashboard" class="admin-nav-item" style="color: #60A5FA;">
              ${icons.graduation} <span>শিক্ষার্থী ভিউতে যান</span>
            </a>
          </ul>
        </aside>

        <!-- Admin Main Content -->
        <main class="admin-main">
          <!-- Top Bar -->
          <header class="admin-top-bar">
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 700;">Geneseon Academy Admin Control Center</h2>
              <span class="text-muted" style="font-size: 0.825rem;">লাইভ ডাটাবেজ সিঙ্ক সক্রিয় • সংস্করণ ১.০</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.resetDatabase()">
                🔄 ডেমো ডাটা রিসেট
              </button>
              <button class="btn btn-danger btn-sm" onclick="Auth.logout()">
                ${icons.logOut} লগআউট
              </button>
            </div>
          </header>

          <div class="admin-content-body">
            ${this.renderSubTabContent(activeAdminTab, {
              users, students, courses, exams, questions, orders, products,
              paymentOrders: this.paymentOrders, totalRevenue
            })}
          </div>
        </main>
      </div>
    `;
  },

  renderExamQuestionOptions() {
    const questions = db.getQuestions();
    const categories = [...new Set([
      'SSC',
      'HSC',
      'JOB',
      ...questions.map(question => question.category)
    ])];
    if (!questions.length) {
      return '<p class="text-muted">মডেল টেস্টের জন্য কোনো প্রশ্ন নেই। আগে MCQ বা CQ যোগ করুন।</p>';
    }
    const renderSubjectGroups = subjectGroups => subjectGroups.map(subjectGroup => {
      const subjectQuestions = subjectGroup.chapters.flatMap(chapter => chapter.questions);
      return `
        <details class="exam-question-subject-group">
          <summary>${escapeHtml(subjectGroup.subject)} <span class="exam-question-count">${subjectQuestions.length}টি</span></summary>
          ${subjectGroup.chapters.map(group => `
            <details class="exam-question-chapter-group">
              <summary>${escapeHtml(group.chapter)} <span class="exam-question-count">${group.questions.length}টি</span></summary>
              ${['MCQ', 'CQ'].map(type => {
                const typedQuestions = group.questions.filter(question =>
                  (question.questionType || 'MCQ') === type
                );
                if (!typedQuestions.length) return '';
                return `
                  <details class="exam-question-type-group">
                    <summary>${type} <span class="exam-question-count">${typedQuestions.length}টি</span></summary>
                    ${typedQuestions.map(question => `
                      <label class="exam-question-choice">
                        <input type="checkbox" name="exam-question" value="${escapeHtml(question.id)}" data-category="${escapeHtml(question.category)}">
                        <span>${escapeHtml(type === 'CQ'
                          ? `উদ্দীপক: ${question.stimulus || (question.parts || []).map(part => part.question).join(' ')}`
                          : question.text)}</span>
                      </label>
                    `).join('')}
                  </details>
                `;
              }).join('')}
            </details>
          `).join('')}
        </details>
      `;
    }).join('');
    return categories.map(category => {
      const categoryQuestions = questions.filter(question => question.category === category);
      return `
        <details class="exam-question-category-group">
          <summary>${escapeHtml(category)} <span class="exam-question-count">${categoryQuestions.length}টি প্রশ্ন</span></summary>
          ${categoryQuestions.length
            ? category === 'JOB'
              ? buildJobExamGroups(categoryQuestions).map(examGroup => `
                  <details class="exam-question-subject-group">
                    <summary>${escapeHtml(examGroup.examName)} <span class="exam-question-count">${examGroup.questions.length}টি</span></summary>
                    ${renderSubjectGroups(examGroup.subjects)}
                  </details>
                `).join('')
              : renderSubjectGroups(buildQuestionSubjectGroups(categoryQuestions))
            : '<p class="text-muted">এই ক্যাটাগরিতে কোনো প্রশ্ন নেই।</p>'}
        </details>
      `;
    }).join('');
  },

  renderSubTabContent(tab, data) {
    if (tab === 'courses') return this.renderCoursesTab(data.courses);
    if (tab === 'questions') return this.renderQuestionsTab(data.questions);
    if (tab === 'exams') return this.renderExamsTab(data.exams);
    if (tab === 'cq-submissions') return this.renderCQSubmissionsTab();
    if (tab === 'store') return this.renderStoreTab(data.products, data.orders);
    if (tab === 'store-requests') return this.renderPaymentRequestsTab(data.paymentOrders);
    if (tab === 'students') return this.renderStudentsTab(data.users);
    if (tab === 'settings') return this.renderBrandingSettings();
    return this.renderDashboardOverview(data);
  },

  renderBrandingSettings() {
    return `
      <section class="card" style="max-width: 720px; padding: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem;">সাইট ব্র্যান্ডিং</h3>
        <p class="text-muted" style="margin-bottom: 1.25rem;">সাইটের নাম: <strong>Geneseon Academy</strong></p>
        <form onsubmit="window.uploadBrandLogo(event)">
          <div class="form-group">
            <label class="form-label" for="brand-logo-file">কম্পিউটার থেকে লোগো নির্বাচন করুন</label>
            <input class="form-input" type="file" id="brand-logo-file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" required>
            <small class="text-muted">PNG, JPEG বা WebP; সর্বোচ্চ ৫ MB।</small>
          </div>
          ${this.brandingLogoUrl ? `
            <div style="margin-bottom: 1rem;">
              <p class="form-label">বর্তমান লোগো</p>
              <img src="${this.brandingLogoUrl}" alt="বর্তমান সাইট লোগো" style="max-width: 180px; max-height: 100px; object-fit: contain;">
            </div>
          ` : ''}
          <button type="submit" class="btn btn-primary">লোগো আপলোড করুন</button>
        </form>
      </section>
    `;
  },

  renderDashboardOverview({ students, courses, exams, orders, totalRevenue }) {
    setTimeout(() => {
      renderRevenueChart();
    }, 100);

    return `
      <!-- Stat Cards -->
      <div class="admin-stats-grid">
        <div class="admin-stat-box">
          <div class="admin-stat-icon-wrap" style="background: var(--primary-light); color: var(--primary);">${icons.user}</div>
          <div>
            <div class="val">${students.length}</div>
            <div class="lbl">মোট নিবন্ধিত শিক্ষার্থী</div>
          </div>
        </div>

        <div class="admin-stat-box">
          <div class="admin-stat-icon-wrap" style="background: var(--success-light); color: var(--success);">${icons.video}</div>
          <div>
            <div class="val">${courses.length}</div>
            <div class="lbl">সক্রিয় অনলাইন কোর্স</div>
          </div>
        </div>

        <div class="admin-stat-box">
          <div class="admin-stat-icon-wrap" style="background: #FEF3C7; color: #B45309;">${icons.shoppingCart}</div>
          <div>
            <div class="val">${orders.length + 18}</div>
            <div class="lbl">মোট সফল অর্ডার</div>
          </div>
        </div>

        <div class="admin-stat-box">
          <div class="admin-stat-icon-wrap" style="background: #ECFDF5; color: #059669;">৳</div>
          <div>
            <div class="val">${formatBDT(totalRevenue + 45000)}</div>
            <div class="lbl">সর্বমোট আয় (Revenue)</div>
          </div>
        </div>

        <div class="admin-stat-box">
          <div class="admin-stat-icon-wrap" style="background: #FEE2E2; color: #DC2626;">${icons.award}</div>
          <div>
            <div class="val">${exams.length}</div>
            <div class="lbl">লাইভ মডেল টেস্ট</div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">মাসিক বিক্রয় ও আয় বৃদ্ধি ট্রেন্ড (২০২৫-২৬)</h3>
          <div style="height: 260px; position: relative;">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">ক্যাটাগরি ভিত্তিক শিক্ষার্থী অনুপাত</h3>
          <div style="height: 260px; position: relative;">
            <canvas id="categoryPieChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="admin-table-card">
        <div class="admin-table-header">
          <h3 style="font-size: 1.2rem;">সাম্প্রতিক কোর্স ও বই অর্ডার</h3>
          <span class="badge badge-success">রিয়েলটাইম bKash/Nagad আপডেট</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>অর্ডার আইডি</th>
                <th>শিক্ষার্থীর নাম</th>
                <th>পাঠানো নম্বর</th>
                <th>আইটেম বিবরণ</th>
                <th>পরিমাণ</th>
                <th>গেটওয়ে</th>
                <th>লেনদেন আইডি (TrxID)</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>#${escapeHtml(o.id)}</strong></td>
                  <td>${escapeHtml(o.userName)}</td>
                  <td>${escapeHtml(o.senderMobile || o.userMobile || '-')}</td>
                  <td>${(o.items || []).map(i => escapeHtml(i.name)).join(', ')}</td>
                  <td><strong>${formatBDT(o.totalAmount)}</strong></td>
                  <td><span class="badge ${o.paymentGateway?.includes('bKash') ? 'badge-danger' : 'badge-warning'}">${escapeHtml(o.paymentGateway || '-')}</span></td>
                  <td><code>${escapeHtml(o.transactionId || '-')}</code></td>
                  <td><span class="badge ${o.status === 'approved' || o.status === 'completed' ? 'badge-success' : o.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">${
                    o.status === 'approved' || o.status === 'completed'
                      ? '✓ অনুমোদিত'
                      : o.status === 'rejected'
                        ? 'বাতিল'
                        : 'যাচাই অপেক্ষমাণ'
                  }</span></td>
                  <td>${o.status === 'pending' && o.paymentGateway === 'bKash (Manual)' ? `
                    <button class="btn btn-primary btn-sm" onclick="window.reviewManualOrder('${escapeHtml(o.id)}', 'approved')">টাকা পেয়েছি</button>
                    <button class="btn btn-danger btn-sm" onclick="window.reviewManualOrder('${escapeHtml(o.id)}', 'rejected')">বাতিল</button>
                  ` : '-'}</td>
                </tr>
              `).join('')}
              ${orders.length ? '' : '<tr><td colspan="9">এখনো কোনো অর্ডার জমা হয়নি।</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderCoursesTab(courses) {
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">অনলাইন কোর্স বিল্ডার ও তালিকা</h3>
            <p class="text-muted" style="font-size: 0.85rem;">কোর্স তৈরি করুন, লেকচার আপলোড করুন ও প্রাইসিং পরিবর্তন করুন</p>
          </div>
          <button class="btn btn-primary" onclick="window.openCreateCourseModal()">
            ${icons.plus} নতুন কোর্স তৈরি করুন
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>কোর্স থাম্বনেইল ও শিরোনাম</th>
                <th>ক্যাটাগরি</th>
                <th>প্রাইস</th>
                <th>ক্লাস সংখ্যা</th>
                <th>শিক্ষার্থী</th>
                <th>রেটিং</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${courses.map(c => `
                <tr>
                  <td style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${c.thumbnail}" style="width: 50px; height: 35px; border-radius: 4px; object-fit: cover;">
                    <div>
                      <strong style="font-size: 0.95rem;">${c.title}</strong>
                      <div class="text-muted" style="font-size: 0.75rem;">ইনস্ট্রাক্টর: ${c.instructor.name}</div>
                    </div>
                  </td>
                  <td><span class="badge badge-${c.category.toLowerCase()}">${c.category}</span></td>
                  <td><strong>${formatBDT(c.price)}</strong> <span style="font-size: 0.75rem; text-decoration: line-through; color: var(--text-subtle);">${formatBDT(c.originalPrice)}</span></td>
                  <td>${c.totalClasses} টি</td>
                  <td>${c.studentsCount} জন</td>
                  <td>★ ${c.rating}</td>
                  <td><span class="badge badge-success">প্রকাশিত</span></td>
                  <td>
                    <div style="display: flex; gap: 0.35rem;">
                      <a href="#/course/${c.id}" class="btn btn-secondary btn-sm">ভিউ</a>
                      <button class="btn btn-primary btn-sm" onclick="window.openEditCourseModal('${c.id}')">সম্পাদনা</button>
                      <button class="btn btn-danger btn-sm" onclick="window.deleteCourseAdmin('${c.id}')">${icons.trash}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderQuestionsTab(questions) {
    const categories = [...new Set(['SSC', 'HSC', 'JOB', ...questions.map(question => question.category)])];
    const hierarchy = categories.map(category => {
      const categoryQuestions = questions.filter(question => question.category === category);
      return {
        category,
        questions: categoryQuestions,
        exams: category === 'JOB' ? buildJobExamGroups(categoryQuestions) : [],
        subjects: category === 'JOB' ? [] : buildQuestionSubjectGroups(categoryQuestions)
      };
    });

    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">প্রশ্নব্যাংক ম্যানেজমেন্ট</h3>
            <p class="text-muted" style="font-size: 0.85rem;">MCQ তৈরি করুন, PDF থেকে আনুন, যাচাই করে প্রকাশ করুন</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" onclick="window.openPdfQuestionImportModal()">
              📄 PDF থেকে প্রশ্ন আনুন
            </button>
            <button class="btn btn-primary" onclick="window.openCreateQuestionModal()">
              ${icons.plus} নতুন প্রশ্ন যোগ করুন
            </button>
          </div>
        </div>

        <div class="admin-question-hierarchy">
          ${hierarchy.map(group => `
            <details class="admin-question-category">
              <summary>
                <span>${escapeHtml(group.category)}</span>
                <span class="admin-question-count">${group.questions.length}টি প্রশ্ন</span>
              </summary>
              ${group.questions.length && group.category === 'JOB' ? group.exams.map(examGroup => `
                <details class="admin-question-job-exam">
                  <summary>
                    <span>${escapeHtml(examGroup.examName)}</span>
                    <span class="admin-question-count">${examGroup.questions.length}টি প্রশ্ন</span>
                  </summary>
                  ${examGroup.subjects.map(subjectGroup => `
                    <details class="admin-question-subject">
                      <summary>
                        <span>${escapeHtml(subjectGroup.subject)}</span>
                        <span class="admin-question-count">${subjectGroup.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0)}টি প্রশ্ন</span>
                      </summary>
                      ${subjectGroup.chapters.map(chapterGroup => `
                        <details class="admin-question-chapter">
                          <summary>
                            <span>অধ্যায়: ${escapeHtml(chapterGroup.chapter)}</span>
                            <span class="admin-question-count">${chapterGroup.questions.length}টি প্রশ্ন</span>
                          </summary>
                          ${renderAdminQuestionTypeGroups(chapterGroup.questions, group.category)}
                        </details>
                      `).join('')}
                    </details>
                  `).join('')}
                </details>
              `).join('') : group.questions.length ? group.subjects.map(subjectGroup => `
                <details class="admin-question-subject">
                  <summary>
                    <span>${escapeHtml(subjectGroup.subject)}</span>
                    <span class="admin-question-count">${subjectGroup.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0)}টি প্রশ্ন</span>
                  </summary>
                  ${subjectGroup.chapters.map(chapterGroup => `
                    <details class="admin-question-chapter">
                      <summary>
                        <span>${escapeHtml(chapterGroup.chapter)}</span>
                        <span class="admin-question-count">${chapterGroup.questions.length}টি প্রশ্ন</span>
                      </summary>
                      ${renderAdminQuestionTypeGroups(chapterGroup.questions, group.category)}
                    </details>
                  `).join('')}
                </details>
              `).join('') : `
                <p class="text-muted admin-question-empty">এই ক্যাটাগরিতে এখনো কোনো প্রশ্ন নেই।</p>
              `}
            </details>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderExamsTab(exams) {
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">অনলাইন পরীক্ষা ও মডেল টেস্ট ম্যানেজার</h3>
            <p class="text-muted" style="font-size: 0.85rem;">নতুন লাইভ এক্সাম সিডিউল করুন ও নেগেটিভ মার্কিং সেট করুন</p>
          </div>
          <button class="btn btn-primary" onclick="window.openCreateExamModal()">
            ${icons.plus} নতুন পরীক্ষা তৈরি করুন
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>পরীক্ষার শিরোনাম</th>
                <th>ক্যাটাগরি</th>
                <th>বিষয়</th>
                <th>প্রশ্ন সংখ্যা</th>
                <th>সময়সীমা</th>
                <th>পূর্ণমান</th>
                <th>নেগেটিভ মার্ক</th>
                <th>পরীক্ষার সময়</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${exams.map(e => `
                <tr>
                  <td><strong>${e.title}</strong></td>
                  <td><span class="badge badge-${e.category.toLowerCase()}">${e.category}</span></td>
                  <td>${e.subject}</td>
                  <td>${e.totalQuestions} টি</td>
                  <td>${e.durationMinutes} মিনিট</td>
                  <td>${e.totalMarks} মার্কস</td>
                  <td>-${e.negativeMarking}</td>
                  <td>${e.startAt ? new Date(e.startAt).toLocaleString('bn-BD') : 'এখনই'}</td>
                  <td>
                    <div style="display: flex; gap: 0.35rem;">
                      <a href="#/exam/${e.id}" class="btn btn-secondary btn-sm">টেস্ট দিন</a>
                      <button class="btn btn-danger btn-sm" onclick="window.deleteExamAdmin('${e.id}')">${icons.trash}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderCQSubmissionsTab() {
    const attempts = this.examAttempts;
    return `
      <section class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">CQ উত্তরপত্র মূল্যায়ন</h3>
            <p class="text-muted" style="font-size: 0.85rem;">শিক্ষার্থীর PDF দেখুন, CQ নম্বর ও feedback দিয়ে সংরক্ষণ করুন।</p>
          </div>
        </div>
        ${attempts.length ? attempts.map(attempt => `
          <article class="cq-submission-card">
            <div class="cq-submission-heading">
              <div>
                <h4>${escapeHtml(attempt.examTitle)}</h4>
                <p>${escapeHtml(attempt.userName)} • ${escapeHtml(attempt.category)} • জমা: ${escapeHtml(attempt.submittedAt)}</p>
              </div>
              <span class="badge ${attempt.cqStatus === 'pending' ? 'badge-warning' : 'badge-success'}">
                ${attempt.cqStatus === 'pending' ? 'মূল্যায়ন বাকি' : 'মূল্যায়িত'}
              </span>
            </div>
            <div class="cq-submission-summary">
              <span>MCQ: ${attempt.mcqScore} / ${attempt.totalMarks - attempt.cqMaxMarks}</span>
              <span>CQ পূর্ণমান: ${attempt.cqMaxMarks}</span>
              ${attempt.cqScore !== null ? `<span>বর্তমান CQ নম্বর: ${attempt.cqScore}</span>` : ''}
            </div>
            <a class="btn btn-secondary btn-sm" href="${escapeHtml(attempt.cqPdfUrl)}" target="_blank" rel="noopener">PDF উত্তরপত্র খুলুন</a>
            <form class="cq-grading-form" onsubmit="window.gradeCQAttempt(event, '${escapeHtml(attempt.id)}')">
              <div class="form-group">
                <label class="form-label">CQ নম্বর (সর্বোচ্চ ${attempt.cqMaxMarks}) *</label>
                <input class="form-input" name="cqScore" type="number" min="0" max="${attempt.cqMaxMarks}" step="0.01" value="${attempt.cqScore ?? ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Feedback (ঐচ্ছিক)</label>
                <textarea class="form-input" name="feedback" rows="3" maxlength="4000">${escapeHtml(attempt.cqFeedback || '')}</textarea>
              </div>
              <button type="submit" class="btn btn-primary">${attempt.cqStatus === 'pending' ? 'নম্বর ও feedback সংরক্ষণ' : 'মূল্যায়ন আপডেট'}</button>
            </form>
          </article>
        `).join('') : '<p class="text-muted">এখনো কোনো CQ উত্তরপত্র জমা পড়েনি।</p>'}
      </section>
    `;
  },

  renderStoreTab(products) {
    return `
      <div class="admin-table-card" style="margin-bottom: 2rem;">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">স্টোর পণ্য ও বই সম্ভার</h3>
            <p class="text-muted" style="font-size: 0.85rem;">প্রিন্টেড বই এবং ডিজিটাল পিডিএফ আপলোড</p>
          </div>
          <button class="btn btn-primary" onclick="window.openStoreProductEditor()">
            ${icons.plus} নতুন পণ্য যোগ করুন
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>পণ্যের নাম</th>
                <th>টাইপ</th>
                <th>ক্যাটাগরি</th>
                <th>মূল্য</th>
                <th>স্টক</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${p.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                    <strong>${p.name}</strong>
                  </td>
                  <td><span class="badge ${p.type === 'digital' ? 'badge-success' : 'badge-warning'}">${p.type}</span></td>
                  <td>${p.category}</td>
                  <td><strong>${formatBDT(p.price)}</strong></td>
                  <td>${p.type === 'digital' ? 'আনলিমিটেড' : (p.stock + ' কপি')}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.openStoreProductEditor('${escapeHtml(p.id)}')">${icons.edit} সম্পাদনা</button>
                  </td>
                </tr>
              `).join('')}
              ${products.length ? '' : '<tr><td colspan="6">এখনো কোনো স্টোর পণ্য নেই।</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderPaymentRequestsTab(orders) {
    const paymentRequests = orders.filter(order =>
      ['bKash (Manual)', 'Coupon (Free)'].includes(order.paymentGateway)
    );
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">TrxID পেমেন্ট রিকোয়েস্ট</h3>
            <p class="text-muted">bKash TrxID যাচাই করুন অথবা ফ্রি কুপনের অর্ডার অনুমোদন করুন। Confirm হলে course বা PDF access দেওয়া হবে।</p>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>
              <th>Order</th><th>শিক্ষার্থী</th><th>পাঠানো নম্বর</th>
              <th>কোর্স / PDF</th><th>পরিমাণ</th><th>কুপন</th>
              <th>TrxID</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th>
            </tr></thead>
            <tbody>
              ${paymentRequests.map(order => `
                <tr>
                  <td>${escapeHtml(order.id)}</td>
                  <td>${escapeHtml(order.userName)}<br><small>${escapeHtml(order.userMobile || '')}</small></td>
                  <td>${escapeHtml(order.senderMobile || '-')}</td>
                  <td>${(order.items || []).map(item => escapeHtml(item.name)).join(', ')}</td>
                  <td><strong>${formatBDT(order.totalAmount)}</strong></td>
                  <td>${escapeHtml(order.couponCode || '-')} ${order.discount ? `(-${formatBDT(order.discount)})` : ''}</td>
                  <td><code>${escapeHtml(order.transactionId || '-')}</code></td>
                  <td><span class="badge ${order.status === 'pending' ? 'badge-warning' : order.status === 'approved' ? 'badge-success' : 'badge-danger'}">${
                    order.status === 'pending' ? 'যাচাই অপেক্ষমাণ'
                      : order.status === 'approved' ? 'অনুমোদিত' : 'বাতিল'
                  }</span></td>
                  <td>${order.status === 'pending' ? `
                    <button class="btn btn-primary btn-sm" onclick="window.reviewManualOrder('${escapeHtml(order.id)}', 'approved')">${order.paymentGateway === 'Coupon (Free)' ? 'অ্যাক্সেস অনুমোদন' : 'Confirm'}</button>
                    <button class="btn btn-danger btn-sm" onclick="window.reviewManualOrder('${escapeHtml(order.id)}', 'rejected')">Reject</button>
                  ` : '-'}</td>
                </tr>
              `).join('')}
              ${paymentRequests.length ? '' : '<tr><td colspan="9">কোনো pending order request নেই।</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderStudentsTab(users) {
    const filteredUsers = activeStudentCategory === 'ALL'
      ? users
      : users.filter(user =>
          user.role === 'STUDENT' && user.educationType === activeStudentCategory
        );
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size: 1.25rem;">ইউজার ও অ্যাডমিন ম্যানেজমেন্ট</h3>
            <p class="text-muted" style="font-size: 0.85rem;">অ্যাকাউন্টের ভূমিকা, শিক্ষার্থী বিভাগ ও লগইন তথ্য পরিচালনা</p>
          </div>
        </div>

        <div class="admin-user-category-filters" role="group" aria-label="শিক্ষার্থী ক্যাটাগরি ফিল্টার">
          ${[
            ['ALL', 'সকল ইউজার'],
            ['SSC', 'SSC'],
            ['HSC', 'HSC'],
            ['JOB', 'JOB']
          ].map(([category, label]) => `
            <button
              type="button"
              class="chip-btn ${activeStudentCategory === category ? 'active' : ''}"
              aria-pressed="${activeStudentCategory === category}"
              onclick="window.filterAdminUsers('${category}')"
            >${label}</button>
          `).join('')}
          <span class="text-muted">${filteredUsers.length} জন</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>শিক্ষার্থীর নাম</th>
                <th>ভূমিকা / ক্যাটাগরি</th>
                <th>ইমেইল ও মোবাইল</th>
                <th>ব্যাচ / টার্গেট</th>
                <th>শেষ লগইন</th>
                <th>এনরোল কোর্স</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.map(u => `
                <tr>
                  <td style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${escapeHtml(u.avatar)}" style="width: 36px; height: 36px; border-radius: 50%;">
                    <strong>${escapeHtml(u.name)}</strong>
                  </td>
                  <td><span class="badge ${u.role === 'ADMIN' ? 'badge-danger' : `badge-${(u.educationType || 'SSC').toLowerCase()}`}">${u.role === 'ADMIN' ? 'ADMIN' : `STUDENT • ${escapeHtml(u.educationType || '-')}`}</span></td>
                  <td>${escapeHtml(u.email)}<br><span class="text-muted" style="font-size: 0.75rem;">${escapeHtml(u.mobile)}</span></td>
                  <td>${escapeHtml(u.batchOrTarget || '-')}</td>
                  <td>${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('bn-BD') : 'এখনও লগইন করেননি'}</td>
                  <td>${u.role === 'STUDENT' ? `${(u.enrolledCourses || []).length} টি কোর্স` : '-'}</td>
                  <td><span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}">${escapeHtml(u.status)}</span></td>
                  <td>
                    ${u.id === Auth.getUser()?.id && u.role === 'ADMIN' && u.adminEligible
                      ? '<button class="btn btn-secondary btn-sm" onclick="window.openOwnStudentModeModal()">সাধারণ ইউজার মোড</button>'
                      : ''}
                    ${u.role === 'STUDENT' ? `
                      <button class="btn btn-secondary btn-sm" onclick="window.openStudentPasswordResetModal('${escapeHtml(u.id)}')">পাসওয়ার্ড রিসেট</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('') || `
                <tr><td colspan="8" class="text-muted" style="text-align: center; padding: 2rem;">এই ক্যাটাগরিতে কোনো ইউজার পাওয়া যায়নি।</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

function renderRevenueChart() {
  const revCtx = document.getElementById('revenueChart');
  if (revCtx && window.Chart) {
    new Chart(revCtx, {
      type: 'line',
      data: {
        labels: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো'],
        datasets: [{
          label: 'মাসিক বিক্রয় (৳)',
          data: [12000, 19000, 28000, 35000, 48000, 62000, 85000, 110000, 145000, 185000],
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  const pieCtx = document.getElementById('categoryPieChart');
  if (pieCtx && window.Chart) {
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['এসএসসি (SSC)', 'এইচএসসি (HSC)', 'বিসিএস ও চাকরি'],
        datasets: [{
          data: [45, 30, 25],
          backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// Global Admin Modals & CRUD Handlers
window.openStoreProductEditor = (productId = '') => {
  const product = productId ? db.getProductById(productId) : null;
  if (productId && !product) {
    Toast.error('স্টোর পণ্যটি পাওয়া যায়নি।');
    return;
  }
  const selectedTypes = product?.educationTypes || [];
  Modal.open({
    title: product ? 'স্টোর পণ্য সম্পাদনা' : 'নতুন স্টোর পণ্য',
    maxWidth: '680px',
    content: `
      <form id="store-product-editor" onsubmit="window.saveStoreProduct(event, '${escapeHtml(product?.id || '')}')">
        <div class="form-group">
          <label class="form-label" for="store-product-name">পণ্যের নাম *</label>
          <input id="store-product-name" class="form-input" maxlength="200" required value="${escapeHtml(product?.name || '')}">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label" for="store-product-type">পণ্যের ধরন *</label>
            <select id="store-product-type" class="form-select" required>
              <option value="digital" ${product?.type === 'digital' ? 'selected' : ''}>Digital PDF</option>
              <option value="physical" ${product?.type === 'physical' ? 'selected' : ''}>Physical product</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="store-product-category">স্টোর ক্যাটাগরি *</label>
            <select id="store-product-category" class="form-select" required>
              ${['PDF', 'Notes', 'Books', 'Model Tests'].map(category =>
                `<option value="${category}" ${product?.category === category ? 'selected' : ''}>${category}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label" for="store-product-price">মূল্য (৳) *</label>
            <input id="store-product-price" type="number" class="form-input" min="0.01" step="0.01" required value="${escapeHtml(product?.price ?? '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="store-product-original-price">আগের মূল্য (৳)</label>
            <input id="store-product-original-price" type="number" class="form-input" min="0" step="0.01" value="${escapeHtml(product?.originalPrice ?? '')}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">কোন শিক্ষার্থী দেখবে? *</label>
          <div style="display:flex;gap:1rem;">
            ${['SSC', 'HSC', 'JOB'].map(category => `
              <label><input type="checkbox" name="store-product-education-type" value="${category}" ${selectedTypes.includes(category) ? 'checked' : ''}> ${category}</label>
            `).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="store-product-image">ছবির URL</label>
          <input id="store-product-image" type="url" class="form-input" maxlength="2000" value="${escapeHtml(product?.image || '')}">
        </div>
        <div class="form-group">
          <label class="form-label" for="store-product-file-url">PDF download URL (Digital PDF-এর জন্য বাধ্যতামূলক)</label>
          <input id="store-product-file-url" type="url" class="form-input" maxlength="2000" value="${escapeHtml(product?.fileUrl || '')}">
        </div>
        <div class="form-group">
          <label class="form-label" for="store-product-description">বিবরণ</label>
          <textarea id="store-product-description" class="form-textarea" maxlength="5000">${escapeHtml(product?.description || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="store-product-stock">স্টক (Physical product)</label>
          <input id="store-product-stock" type="number" class="form-input" min="0" step="1" value="${escapeHtml(product?.stock ?? '')}">
        </div>
        <button type="submit" class="btn btn-primary btn-block">${product ? 'পরিবর্তন সংরক্ষণ' : 'পণ্য তৈরি'}</button>
      </form>
    `
  });
};

window.saveStoreProduct = async (event, productId) => {
  event.preventDefault();
  const existing = productId ? db.getProductById(productId) : null;
  const educationTypes = [
    ...document.querySelectorAll('input[name="store-product-education-type"]:checked')
  ].map(input => input.value);
  const type = document.getElementById('store-product-type').value;
  const price = Number(document.getElementById('store-product-price').value);
  const originalPriceValue = document.getElementById('store-product-original-price').value;
  const stockValue = document.getElementById('store-product-stock').value;
  const product = {
    ...existing,
    id: existing?.id || uid('prod'),
    name: document.getElementById('store-product-name').value.trim(),
    type,
    category: document.getElementById('store-product-category').value,
    educationTypes,
    price,
    originalPrice: originalPriceValue ? Number(originalPriceValue) : price,
    image: document.getElementById('store-product-image').value.trim(),
    fileUrl: document.getElementById('store-product-file-url').value.trim(),
    description: document.getElementById('store-product-description').value.trim(),
    stock: stockValue ? Number(stockValue) : undefined
  };
  if (!educationTypes.length) {
    Toast.error('কমপক্ষে একটি শিক্ষার্থী বিভাগ নির্বাচন করুন।');
    return;
  }
  if (!Number.isFinite(price) || price <= 0) {
    Toast.error('সঠিক পণ্যমূল্য দিন।');
    return;
  }
  if (type === 'digital' && !product.fileUrl) {
    Toast.error('Digital PDF-এর download URL দিন।');
    return;
  }
  const submitButton = event.submitter;
  if (submitButton) submitButton.disabled = true;
  try {
    await AdminView.saveResource('products', product);
    Modal.close();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('store');
    Toast.success(existing ? 'স্টোর পণ্যের পরিবর্তন সংরক্ষিত হয়েছে।' : 'স্টোর পণ্য যোগ হয়েছে।');
  } catch (error) {
    Toast.error(error.message);
    if (submitButton) submitButton.disabled = false;
  }
};

window.openCreateCourseModal = () => openCourseEditor();
window.openEditCourseModal = (id) => {
  const course = db.getCourseById(id);
  if (!course) {
    Toast.error('কোর্সটি পাওয়া যায়নি।');
    return;
  }
  openCourseEditor(course);
};
window.addCourseEditorChapter = () => {
  const chapters = document.getElementById('course-editor-chapters');
  if (chapters) {
    chapters.insertAdjacentHTML(
      'beforeend',
      renderCourseEditorChapter({}, chapters.querySelectorAll('.course-editor-chapter').length)
    );
  }
};
window.addCourseEditorLesson = (button) => {
  const lessons = button.closest('.course-editor-chapter')?.querySelector('.course-editor-lessons');
  if (lessons) lessons.insertAdjacentHTML('beforeend', renderCourseEditorLesson());
};

window.saveNewCourse = async (e) => {
  e.preventDefault();
  const title = document.getElementById('new-crs-title').value.trim();
  const cat = document.getElementById('new-crs-cat').value;
  const price = parseInt(document.getElementById('new-crs-price').value, 10);
  const inst = document.getElementById('new-crs-inst').value.trim();
  const desc = document.getElementById('new-crs-desc').value.trim();
  const courseId = document.getElementById('course-edit-id').value;
  const existingCourse = courseId ? db.getCourseById(courseId) : null;
  const chapters = [...document.querySelectorAll('#course-editor-chapters .course-editor-chapter')];
  if (!chapters.length) {
    Toast.error('কমপক্ষে একটি Chapter যোগ করুন।');
    return;
  }
  const chapterDrafts = chapters.map(chapterElement => ({
    element: chapterElement,
    title: chapterElement.querySelector('.course-chapter-title').value.trim(),
    lessons: [...chapterElement.querySelectorAll('.course-editor-lesson')].map(lessonElement => ({
      element: lessonElement,
      title: lessonElement.querySelector('.course-lesson-title').value.trim(),
      videoFile: lessonElement.querySelector('.course-lesson-video').files[0] || null,
      pdfFile: lessonElement.querySelector('.course-lesson-pdf').files[0] || null,
      notesPdfFile: lessonElement.querySelector('.course-lesson-notes-pdf').files[0] || null,
      notes: lessonElement.querySelector('.course-lesson-notes').value.trim()
    }))
  }));
  if (chapterDrafts.some(chapter => !chapter.title || !chapter.lessons.length)) {
    Toast.error('প্রতিটি Chapter-এর নাম এবং অন্তত একটি Lecture থাকতে হবে।');
    return;
  }
  if (chapterDrafts.some(chapter => chapter.lessons.some(lesson =>
    !lesson.title ||
    (!lesson.videoFile && !lesson.pdfFile && !lesson.notesPdfFile && !lesson.notes &&
      !lesson.element.dataset.videoUrl && !lesson.element.dataset.pdfUrl &&
      !lesson.element.dataset.notesPdfUrl)
  ))) {
    Toast.error('প্রতিটি Lecture-এ অন্তত Video, PDF অথবা Notes যোগ করুন।');
    return;
  }

  const submitButton = e.submitter;
  if (submitButton) submitButton.disabled = true;
  try {
    const updatedChapters = await Promise.all(chapterDrafts.map(async chapterDraft => {
      const chapterId = chapterDraft.element.dataset.chapterId;
      const priorChapter = existingCourse?.chapters?.find(chapter =>
        chapter.id === chapterId
      );
      const lessons = await Promise.all(chapterDraft.lessons.map(async lessonDraft => {
        const { element, videoFile, pdfFile, notesPdfFile } = lessonDraft;
        const priorLesson = existingCourse?.chapters
          ?.flatMap(chapter => chapter.lessons || [])
          .find(lesson => lesson.id === element.dataset.lessonId);
        const [videoResult, pdfResult, notesPdfResult] = await Promise.all([
          videoFile ? AdminView.uploadFile(videoFile, cat, 'video') : null,
          pdfFile ? AdminView.uploadFile(pdfFile, cat, 'course-pdf') : null,
          notesPdfFile ? AdminView.uploadFile(notesPdfFile, cat, 'course-pdf') : null
        ]);
        const videoAsset = videoResult?.asset;
        const pdfAsset = pdfResult?.asset;
        const notesPdfAsset = notesPdfResult?.asset;
        return {
          id: priorLesson?.id || uid('les'),
          title: lessonDraft.title,
          duration: videoAsset ? 'ভিডিও' : (priorLesson?.duration || 'রিসোর্স'),
          type: 'video',
          videoUrl: videoAsset?.url || element.dataset.videoUrl || '',
          contentType: videoAsset?.contentType || element.dataset.videoType || '',
          pdfUrl: pdfAsset?.url || element.dataset.pdfUrl || '',
          pdfTitle: pdfAsset?.name || element.dataset.pdfTitle || '',
          notesPdfUrl: notesPdfAsset?.url || element.dataset.notesPdfUrl || '',
          notesPdfTitle: notesPdfAsset?.name || element.dataset.notesPdfTitle || '',
          notes: lessonDraft.notes,
          isPreview: priorLesson?.isPreview || false
        };
      }));
      return {
        id: priorChapter?.id || uid('chap'),
        title: chapterDraft.title,
        lessons
      };
    }));
    const previewLesson = updatedChapters.flatMap(chapter => chapter.lessons)
      .find(lesson => lesson.videoUrl);
    const newCourse = {
      ...(existingCourse || {}),
      id: existingCourse?.id || uid('crs'),
      slug: existingCourse?.slug || title.toLowerCase().replace(/\s+/g, '-'),
      category: cat,
      title,
      instructor: {
        ...(existingCourse?.instructor || {}),
        name: inst,
        avatar: existingCourse?.instructor?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      },
      thumbnail: existingCourse?.thumbnail ||
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
      previewVideo: previewLesson?.videoUrl || existingCourse?.previewVideo || '',
      previewVideoType: previewLesson?.contentType || existingCourse?.previewVideoType || '',
      price,
      originalPrice: existingCourse?.originalPrice || price * 2,
      discount: existingCourse?.discount ?? 50,
      rating: existingCourse?.rating || 5.0,
      studentsCount: existingCourse?.studentsCount || 0,
      totalClasses: updatedChapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0),
      duration: existingCourse?.duration || '50+ Hours',
      language: existingCourse?.language || 'Bangla',
      isPublished: true,
      description: desc || 'জেনেসিওন একাডেমির সেরা এক্সক্লুসিভ অনলাইন কোর্স।',
      chapters: updatedChapters
    };

    await AdminView.saveResource('courses', newCourse);
    Toast.success(existingCourse
      ? 'কোর্স, Chapter ও Lecture কনটেন্ট আপডেট হয়েছে।'
      : 'নতুন কোর্স, Chapter ও Lecture কনটেন্ট প্রকাশিত হয়েছে।');
    Modal.close();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('courses');
  } catch (error) {
    Toast.error(error.message);
    if (submitButton) submitButton.disabled = false;
  }
};

window.deleteCourseAdmin = async (id) => {
  if (confirm('আপনি কি নিশ্চিতভাবে এই কোর্সটি মুছে ফেলতে চান?')) {
    try {
      await AdminView.deleteResource('courses', id);
    } catch (error) {
      Toast.error(error.message);
      return;
    }
    db.deleteCourse(id);
    Toast.info('কোর্স মুছে ফেলা হয়েছে');
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('courses');
  }
};

window.openCreateExamModal = () => {
  Modal.open({
    title: 'মডেল টেস্ট তৈরি ও সিডিউল',
    maxWidth: '700px',
    content: `
      <form id="create-exam-form" onsubmit="window.saveNewExam(event)">
        <div class="form-group">
          <label class="form-label">পরীক্ষার নাম *</label>
          <input id="new-exam-title" class="form-input" required>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">সময় (মিনিট) *</label>
            <input id="new-exam-duration" type="number" min="1" max="600" class="form-input" required value="60">
          </div>
          <div class="form-group">
            <label class="form-label">পূর্ণমান *</label>
            <input id="new-exam-marks" type="number" min="1" max="1000" class="form-input" required value="50">
          </div>
          <div class="form-group">
            <label class="form-label">CQ-এর মোট নম্বর (CQ থাকলে)</label>
            <input id="new-exam-cq-marks" type="number" min="1" max="1000" class="form-input" value="20">
          </div>
          <div class="form-group">
            <label class="form-label">নেগেটিভ মার্কিং / ভুল উত্তরে</label>
            <input id="new-exam-negative" type="number" min="0" max="10" step="0.01" class="form-input" value="0.25">
          </div>
          <div class="form-group">
            <label class="form-label">পরীক্ষা শুরু (ঐচ্ছিক)</label>
            <input id="new-exam-start" type="datetime-local" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">পরীক্ষা শেষ (ঐচ্ছিক)</label>
            <input id="new-exam-end" type="datetime-local" class="form-input">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">প্রশ্নব্যাংক থেকে প্রশ্ন নির্বাচন করুন *</label>
          <div id="new-exam-questions" class="exam-question-picker">
            ${AdminView.renderExamQuestionOptions()}
          </div>
          <small class="text-muted">প্রথমে SSC, HSC বা Job খুলুন, তারপর Subject → Chapter → MCQ/CQ থেকে প্রশ্ন বেছে নিন। একটি পরীক্ষায় একই ক্যাটাগরির প্রশ্ন নির্বাচন করুন। CQ থাকলে শিক্ষার্থী PDF জমা দেবে; CQ নম্বর আলাদা করে দিন, বাকি নম্বর MCQ-তে সমানভাবে ভাগ হবে। শুধু CQ হলে CQ নম্বরই পূর্ণমান হতে হবে।</small>
        </div>
        <button type="submit" class="btn btn-primary btn-block">মডেল টেস্ট সংরক্ষণ করুন</button>
      </form>
    `
  });
};

window.saveNewExam = async (event) => {
  event.preventDefault();
  const selectedQuestions = [...document.querySelectorAll('#new-exam-questions input[name="exam-question"]:checked')]
    .map(input => db.getQuestionById(input.value))
    .filter(Boolean);
  const categories = [...new Set(selectedQuestions.map(question => question.category))];
  if (categories.length > 1) {
    Toast.error('একটি পরীক্ষায় SSC, HSC অথবা Job—একটি ক্যাটাগরির প্রশ্নই নির্বাচন করুন।');
    return;
  }
  const category = categories[0];
  const questionIds = selectedQuestions.map(question => question.id);
  if (!questionIds.length) {
    Toast.error('ক্যাটাগরি, বিষয় ও অধ্যায় থেকে অন্তত একটি প্রশ্ন বেছে নিন।');
    return;
  }
  const mcqCount = selectedQuestions.filter(question =>
    (question.questionType || 'MCQ') !== 'CQ'
  ).length;
  const hasCQ = selectedQuestions.some(question => question.questionType === 'CQ');
  const totalMarks = Number(document.getElementById('new-exam-marks').value);
  const cqTotalMarks = hasCQ
    ? Number(document.getElementById('new-exam-cq-marks').value)
    : 0;
  if (hasCQ && (
    cqTotalMarks <= 0
    || cqTotalMarks > totalMarks
    || (mcqCount && cqTotalMarks >= totalMarks)
    || (!mcqCount && cqTotalMarks !== totalMarks)
  )) {
    Toast.error('CQ নম্বর সঠিকভাবে দিন। MCQ থাকলে CQ নম্বর পূর্ণমানের কম, শুধু CQ হলে পূর্ণমানের সমান হতে হবে।');
    return;
  }
  const dateValue = id => {
    const value = document.getElementById(id).value;
    return value ? new Date(value).toISOString() : null;
  };
  const startAt = dateValue('new-exam-start');
  const endAt = dateValue('new-exam-end');
  if (startAt && endAt && Date.parse(endAt) <= Date.parse(startAt)) {
    Toast.error('পরীক্ষা শেষ হওয়ার সময় শুরুর সময়ের পরে হতে হবে।');
    return;
  }
  const exam = {
    id: uid('exam'),
    title: document.getElementById('new-exam-title').value.trim(),
    category,
    subject: [...new Set(selectedQuestions.map(question => question.subject))].join(', '),
    chapters: [...new Set(selectedQuestions.map(question => question.chapter).filter(Boolean))],
    questionIds,
    totalQuestions: questionIds.length,
    durationMinutes: Number(document.getElementById('new-exam-duration').value),
    totalMarks,
    cqTotalMarks,
    negativeMarking: Number(document.getElementById('new-exam-negative').value) || 0,
    startAt,
    endAt,
    accessType: 'free',
    isLive: true
  };
  try {
    await AdminView.saveResource('exams', exam);
    Toast.success('মডেল টেস্ট ও সময়সূচি সংরক্ষণ হয়েছে।');
    Modal.close();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('exams');
  } catch (error) {
    Toast.error(error.message);
  }
};

window.deleteExamAdmin = async (id) => {
  if (!confirm('এই পরীক্ষাটি মুছে ফেলতে চান?')) return;
  try {
    await AdminView.deleteResource('exams', id);
    db.data.exams = db.getExams().filter(exam => exam.id !== id);
    db.save();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('exams');
    Toast.info('পরীক্ষাটি মুছে ফেলা হয়েছে।');
  } catch (error) {
    Toast.error(error.message);
  }
};

window.gradeCQAttempt = async (event, attemptId) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) submit.disabled = true;
  try {
    await AdminView.gradeCQAttempt(
      attemptId,
      Number(form.elements.cqScore.value),
      form.elements.feedback.value
    );
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('cq-submissions');
    Toast.success('CQ নম্বর ও feedback সংরক্ষণ হয়েছে।');
  } catch (error) {
    Toast.error(error.message);
    if (submit) submit.disabled = false;
  }
};

window.filterAdminUsers = (category) => {
  if (!['ALL', 'SSC', 'HSC', 'JOB'].includes(category)) return;
  activeStudentCategory = category;
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = AdminView.render('students');
};

window.openCreateQuestionModal = (question = null) => {
  const hierarchyFields = question ? getQuestionHierarchyFields(question) : {};
  const questionType = question?.questionType || 'MCQ';
  const currentImageUrl = question?.questionType === 'CQ'
    ? question.stimulusImageUrl
    : question?.imageUrl;
  Modal.open({
    title: question ? 'প্রশ্ন সম্পাদনা করুন' : 'প্রশ্নব্যাংকে নতুন প্রশ্ন যোগ করুন',
    maxWidth: '650px',
    content: `
      <form id="create-q-form" onsubmit="window.saveNewQuestion(event)">
        <div class="form-group">
          <label class="form-label" for="new-q-type">প্রশ্নের ধরন</label>
          <select id="new-q-type" class="form-select" onchange="window.updateNewQuestionTypeFields()">
            <option value="MCQ" ${questionType === 'MCQ' ? 'selected' : ''}>MCQ (প্রশ্ন ও অপশন)</option>
            <option value="CQ" ${questionType === 'CQ' ? 'selected' : ''}>CQ (উদ্দীপক ও প্রশ্ন)</option>
            <option value="WRITTEN" ${questionType === 'WRITTEN' ? 'selected' : ''}>Written (প্রশ্ন ও উত্তর)</option>
          </select>
        </div>
        <input type="hidden" id="edit-q-id" value="${escapeHtml(question?.id || '')}">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">ক্যাটাগরি</label>
            <select id="new-q-cat" class="form-select" onchange="window.updateNewQuestionCategoryFields()">
              <option value="SSC" ${question?.category === 'SSC' ? 'selected' : ''}>SSC</option>
              <option value="HSC" ${question?.category === 'HSC' ? 'selected' : ''}>HSC</option>
              <option value="JOB" ${question?.category === 'JOB' ? 'selected' : ''}>JOB</option>
            </select>
          </div>
          <div id="new-q-exam-group" class="form-group" hidden>
            <label class="form-label" for="new-q-exam">চাকরির পরীক্ষার নাম (ঐচ্ছিক)</label>
            <input type="text" id="new-q-exam" class="form-input" maxlength="120" list="job-exam-options" placeholder="যেমন: BCS" value="${escapeHtml(hierarchyFields.examName || '')}">
            <datalist id="job-exam-options">
              ${JOB_EXAM_OPTIONS.map(examName => `<option value="${escapeHtml(examName)}"></option>`).join('')}
            </datalist>
          </div>
          <div class="form-group">
            <label class="form-label">বিষয়</label>
            <input type="text" id="new-q-sub" class="form-input" required value="${escapeHtml(hierarchyFields.subject || question?.subject || 'Physics')}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">অধ্যায় *</label>
          <input type="text" id="new-q-chapter" class="form-input" required maxlength="120" placeholder="যেমন: ভৌত রাশি ও পরিমাপ" value="${escapeHtml(hierarchyFields.chapter || question?.chapter || '')}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">বোর্ড (ঐচ্ছিক)</label>
            <input type="text" id="new-q-board" class="form-input" maxlength="80" placeholder="যেমন: ঢাকা বোর্ড" value="${escapeHtml(question?.board || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">সাল (ঐচ্ছিক)</label>
            <input type="number" id="new-q-year" class="form-input" min="1900" max="2100" placeholder="যেমন: 2025" value="${escapeHtml(question?.year || '')}">
          </div>
        </div>
        <div id="new-q-mcq-fields">
          <div id="new-q-mcq-question" class="form-group">
            <label class="form-label">MCQ প্রশ্ন বাক্য *</label>
            <input type="text" id="new-q-text" class="form-input" required placeholder="যেমন: চর্যাপদের আবিষ্কারক কে?" value="${escapeHtml(question?.text || '')}">
          </div>
          <div id="new-q-mcq-image-group" class="form-group">
            <label class="form-label" for="new-q-image">প্রশ্নের ছবি (ঐচ্ছিক, সর্বোচ্চ ৫ MB)</label>
            <input type="file" id="new-q-image" class="form-input" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp">
            <small class="text-muted">প্রশ্নের ছবিটি অপশনের আগে দেখানো হবে। PNG, JPG বা WebP।</small>
            ${currentImageUrl && question?.questionType !== 'CQ' ? `<small class="text-muted">বর্তমান ছবি সংরক্ষিত আছে; নতুন ছবি নির্বাচন করলে প্রতিস্থাপিত হবে।</small>` : ''}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="text" id="new-q-opt0" class="form-input" required placeholder="অপশন ক" value="${escapeHtml(question?.options?.[0] || '')}">
            <input type="text" id="new-q-opt1" class="form-input" required placeholder="অপশন খ" value="${escapeHtml(question?.options?.[1] || '')}">
            <input type="text" id="new-q-opt2" class="form-input" required placeholder="অপশন গ" value="${escapeHtml(question?.options?.[2] || '')}">
            <input type="text" id="new-q-opt3" class="form-input" required placeholder="অপশন ঘ" value="${escapeHtml(question?.options?.[3] || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">সঠিক অপশন</label>
            <select id="new-q-correct" class="form-select">
              <option value="0" ${question?.correctIndex === 0 ? 'selected' : ''}>অপশন ক</option>
              <option value="1" ${question?.correctIndex === 1 ? 'selected' : ''}>অপশন খ</option>
              <option value="2" ${question?.correctIndex === 2 ? 'selected' : ''}>অপশন গ</option>
              <option value="3" ${question?.correctIndex === 3 ? 'selected' : ''}>অপশন ঘ</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">ব্যাখ্যা ও সমাধান</label>
            <textarea id="new-q-exp" class="form-textarea" placeholder="ব্যাখ্যা লিখুন...">${escapeHtml(question?.explanation || '')}</textarea>
          </div>
        </div>
        <div id="new-q-cq-fields" hidden>
          <div class="form-group">
            <label class="form-label" for="new-q-stimulus">উদ্দীপক *</label>
            <textarea id="new-q-stimulus" class="form-textarea" placeholder="উদ্দীপক লিখুন">${escapeHtml(question?.stimulus || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-q-stimulus-image">উদ্দীপকের ছবি (ঐচ্ছিক, সর্বোচ্চ ৫ MB)</label>
            <input type="file" id="new-q-stimulus-image" class="form-input" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp">
            <small class="text-muted">উদ্দীপকের লেখার নিচে ছবিটি দেখানো হবে। PNG, JPG বা WebP।</small>
            ${currentImageUrl && question?.questionType === 'CQ' ? `<small class="text-muted">বর্তমান ছবি সংরক্ষিত আছে; নতুন ছবি নির্বাচন করলে প্রতিস্থাপিত হবে।</small>` : ''}
          </div>
          ${['ক', 'খ', 'গ', 'ঘ'].map((label, index) => `
            <fieldset class="admin-cq-part">
              <legend>${label})</legend>
              <div class="form-group">
                <label class="form-label" for="new-q-part-${index}">প্রশ্ন *</label>
                <textarea id="new-q-part-${index}" class="form-textarea" placeholder="${label})-এর প্রশ্ন">${escapeHtml(question?.parts?.[index]?.question || '')}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="new-q-answer-${index}">উত্তর (ঐচ্ছিক)</label>
                <textarea id="new-q-answer-${index}" class="form-textarea" placeholder="উত্তর/সমাধান">${escapeHtml(question?.parts?.[index]?.answer || '')}</textarea>
              </div>
            </fieldset>
          `).join('')}
        </div>
        <div id="new-q-written-fields" hidden>
          <div class="form-group">
            <label class="form-label" for="new-q-written-question">Written প্রশ্ন *</label>
            <textarea id="new-q-written-question" class="form-textarea" placeholder="লিখিত প্রশ্ন লিখুন">${escapeHtml(question?.text || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-q-written-image">প্রশ্নের ছবি (ঐচ্ছিক, সর্বোচ্চ ৫ MB)</label>
            <input type="file" id="new-q-written-image" class="form-input" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp">
            <small class="text-muted">Written প্রশ্নের সঙ্গে PNG, JPG বা WebP ছবি যোগ করতে পারবেন।</small>
            ${currentImageUrl && question?.questionType === 'WRITTEN' ? `<small class="text-muted">বর্তমান ছবি সংরক্ষিত আছে; নতুন ছবি নির্বাচন করলে প্রতিস্থাপিত হবে।</small>` : ''}
          </div>
          <div class="form-group">
            <label class="form-label" for="new-q-written-answer">উত্তর / নমুনা সমাধান (ঐচ্ছিক)</label>
            <textarea id="new-q-written-answer" class="form-textarea" placeholder="উত্তর বা নমুনা সমাধান লিখুন">${escapeHtml(question?.answer || '')}</textarea>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${question ? 'পরিবর্তনগুলো সংরক্ষণ করুন' : 'সংরক্ষণ করুন'}</button>
      </form>
    `
  });
  window.updateNewQuestionCategoryFields();
  window.updateNewQuestionTypeFields();
};

window.openEditQuestionModal = (id) => {
  const question = db.getQuestionById(id);
  if (!question) {
    Toast.error('প্রশ্নটি পাওয়া যায়নি।');
    return;
  }
  window.openCreateQuestionModal(question);
};

window.updateNewQuestionCategoryFields = () => {
  const isJob = document.getElementById('new-q-cat')?.value === 'JOB';
  const examGroup = document.getElementById('new-q-exam-group');
  if (!examGroup) return;
  examGroup.hidden = !isJob;
};

window.updateNewQuestionTypeFields = () => {
  const type = document.getElementById('new-q-type')?.value;
  const isCQ = type === 'CQ';
  const isWritten = type === 'WRITTEN';
  const mcqFields = document.getElementById('new-q-mcq-fields');
  const cqFields = document.getElementById('new-q-cq-fields');
  const writtenFields = document.getElementById('new-q-written-fields');
  const questionText = document.getElementById('new-q-text');
  const stimulus = document.getElementById('new-q-stimulus');
  const writtenQuestion = document.getElementById('new-q-written-question');
  if (!mcqFields || !cqFields || !writtenFields || !questionText || !stimulus || !writtenQuestion) return;

  mcqFields.hidden = isCQ || isWritten;
  cqFields.hidden = !isCQ;
  writtenFields.hidden = !isWritten;
  questionText.required = !isCQ && !isWritten;
  stimulus.required = isCQ;
  writtenQuestion.required = isWritten;
  document.querySelectorAll('[id^="new-q-opt"]').forEach(field => {
    if (field instanceof HTMLInputElement) field.required = !isCQ && !isWritten && field.id !== 'new-q-correct';
  });
  ['0', '1', '2', '3'].forEach(index => {
    document.getElementById(`new-q-part-${index}`).required = isCQ;
  });
};

window.saveNewQuestion = async (e) => {
  e.preventDefault();
  const editId = document.getElementById('edit-q-id').value;
  const existingQuestion = editId ? db.getQuestionById(editId) : null;
  if (editId && !existingQuestion) {
    Toast.error('সম্পাদনার জন্য প্রশ্নটি পাওয়া যায়নি।');
    return;
  }
  const questionType = document.getElementById('new-q-type').value;
  const category = document.getElementById('new-q-cat').value;
  const q = {
    ...(existingQuestion || {}),
    id: existingQuestion?.id || uid('q'),
    category,
    ...(category === 'JOB' ? { examName: document.getElementById('new-q-exam').value.trim() } : {}),
    subject: document.getElementById('new-q-sub').value.trim(),
    chapter: document.getElementById('new-q-chapter').value.trim(),
    topic: document.getElementById('new-q-chapter').value.trim(),
    year: document.getElementById('new-q-year').value.trim(),
    board: document.getElementById('new-q-board').value.trim(),
    difficulty: existingQuestion?.difficulty || 'Medium',
    questionType
  };
  if (category !== 'JOB') delete q.examName;
  ['text', 'options', 'correctIndex', 'explanation', 'stimulus', 'parts', 'answer', 'imageUrl', 'stimulusImageUrl']
    .forEach(field => delete q[field]);
  if (existingQuestion?.questionType === questionType || (!existingQuestion?.questionType && questionType === 'MCQ')) {
    if (questionType === 'CQ' && existingQuestion.stimulusImageUrl) {
      q.stimulusImageUrl = existingQuestion.stimulusImageUrl;
    } else if (questionType !== 'CQ' && existingQuestion?.imageUrl) {
      q.imageUrl = existingQuestion.imageUrl;
    }
  }
  if (questionType === 'CQ') {
    q.stimulus = document.getElementById('new-q-stimulus').value.trim();
    q.parts = ['ক', 'খ', 'গ', 'ঘ'].map((label, index) => ({
      label,
      question: document.getElementById(`new-q-part-${index}`).value.trim(),
      answer: document.getElementById(`new-q-answer-${index}`).value.trim()
    }));
  } else if (questionType === 'WRITTEN') {
    q.text = document.getElementById('new-q-written-question').value.trim();
    q.answer = document.getElementById('new-q-written-answer').value.trim();
  } else {
    q.text = document.getElementById('new-q-text').value.trim();
    q.options = [
      document.getElementById('new-q-opt0').value.trim(),
      document.getElementById('new-q-opt1').value.trim(),
      document.getElementById('new-q-opt2').value.trim(),
      document.getElementById('new-q-opt3').value.trim()
    ];
    q.correctIndex = parseInt(document.getElementById('new-q-correct').value, 10);
    q.explanation = document.getElementById('new-q-exp').value || 'সঠিক ব্যাখ্যা।';
  }
  const submitButton = e.submitter;
  if (submitButton) submitButton.disabled = true;
  try {
    const imageInput = document.getElementById(
      questionType === 'CQ'
        ? 'new-q-stimulus-image'
        : questionType === 'WRITTEN'
          ? 'new-q-written-image'
          : 'new-q-image'
    );
    const imageFile = imageInput?.files[0];
    if (imageFile) {
      const { asset } = await AdminView.uploadFile(imageFile, category, 'question-image');
      if (questionType === 'CQ') q.stimulusImageUrl = asset.url;
      else q.imageUrl = asset.url;
    }
    await AdminView.saveResource('questions', q);
    Toast.success(existingQuestion ? 'প্রশ্নের পরিবর্তন সংরক্ষণ হয়েছে!' : 'প্রশ্নটি প্রশ্নব্যাংকে যোগ করা হয়েছে!');
    Modal.close();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('questions');
  } catch (error) {
    Toast.error(error.message);
    if (submitButton) submitButton.disabled = false;
  }
};

window.deleteQuestionAdmin = async (id, trigger) => {
  const content = document.getElementById('main-content');
  const hierarchy = content?.querySelector('.admin-question-hierarchy');
  const questionPath = hierarchy ? getAdminQuestionPath(hierarchy, trigger) : [];
  if (confirm('প্রশ্নটি মুছে ফেলতে চান?')) {
    try {
      await AdminView.deleteResource('questions', id);
    } catch (error) {
      Toast.error(error.message);
      return;
    }
    db.deleteQuestion(id);
    Toast.info('প্রশ্ন মুছে ফেলা হয়েছে');
    if (content) {
      const scrollPosition = window.scrollY;
      content.innerHTML = AdminView.render('questions');
      const refreshedHierarchy = content.querySelector('.admin-question-hierarchy');
      if (refreshedHierarchy) restoreAdminQuestionPath(refreshedHierarchy, questionPath);
      window.scrollTo(0, scrollPosition);
    }
  }
};

window.openPdfQuestionImportModal = () => {
  Modal.open({
    title: 'PDF থেকে MCQ বের করে যাচাই করুন',
    maxWidth: '600px',
    content: `
      <form id="pdf-question-upload-form" onsubmit="window.uploadQuestionsPdf(event)">
        <div class="form-group">
          <label class="form-label">ক্যাটাগরি *</label>
          <select id="pdf-q-category" class="form-select" required onchange="window.updatePdfQuestionCategoryFields()">
            <option value="SSC">SSC</option><option value="HSC">HSC</option><option value="JOB">JOB</option>
          </select>
        </div>
        <div id="pdf-q-exam-group" class="form-group" hidden>
          <label class="form-label" for="pdf-q-exam">চাকরির পরীক্ষার নাম (ঐচ্ছিক)</label>
          <input type="text" id="pdf-q-exam" class="form-input" maxlength="120" list="job-exam-options" placeholder="যেমন: BCS">
          <datalist id="job-exam-options">
            ${JOB_EXAM_OPTIONS.map(examName => `<option value="${escapeHtml(examName)}"></option>`).join('')}
          </datalist>
        </div>
        <div class="form-group">
          <label class="form-label">বিষয় *</label>
          <input id="pdf-q-subject" class="form-input" required value="Physics">
        </div>
        <div class="form-group">
          <label class="form-label">অধ্যায় *</label>
          <input id="pdf-q-chapter" class="form-input" required maxlength="120" placeholder="যেমন: ভৌত রাশি ও পরিমাপ">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">বোর্ড (ঐচ্ছিক)</label>
            <input id="pdf-q-board" class="form-input" maxlength="80" placeholder="যেমন: ঢাকা বোর্ড">
          </div>
          <div class="form-group">
            <label class="form-label">সাল (ঐচ্ছিক)</label>
            <input id="pdf-q-year" type="number" class="form-input" min="1900" max="2100" placeholder="যেমন: 2025">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">প্রশ্নপত্র PDF (সর্বোচ্চ ১০০ MB)</label>
          <input id="pdf-q-file" type="file" class="form-input" accept="application/pdf,.pdf" required>
        </div>
        <p class="text-muted">Gemini key configured থাকলে PDF-এর প্রতিটি পৃষ্ঠার ছবি Google Gemini-তে OCR-এর জন্য পাঠানো হবে। Key না থাকলে সার্চযোগ্য লেখা বা স্থানীয় Tesseract OCR ব্যবহার হবে। OCR ভুল করতে পারে—প্রকাশের আগে মূল PDF-এর সঙ্গে মিলিয়ে নিন।</p>
        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1rem;">PDF আপলোড ও প্রশ্ন শনাক্ত</button>
      </form>
    `
  });
  window.updatePdfQuestionCategoryFields();
};

window.updatePdfQuestionCategoryFields = () => {
  const isJob = document.getElementById('pdf-q-category')?.value === 'JOB';
  const examGroup = document.getElementById('pdf-q-exam-group');
  if (!examGroup) return;
  examGroup.hidden = !isJob;
};

window.uploadQuestionsPdf = async (event) => {
  event.preventDefault();
  const file = document.getElementById('pdf-q-file').files[0];
  const category = document.getElementById('pdf-q-category').value;
  const examName = category === 'JOB' ? document.getElementById('pdf-q-exam').value.trim() : '';
  const subject = document.getElementById('pdf-q-subject').value.trim();
  const chapter = document.getElementById('pdf-q-chapter').value.trim();
  const board = document.getElementById('pdf-q-board').value.trim();
  const year = document.getElementById('pdf-q-year').value.trim();
  const submitButton = event.submitter;
  const originalButtonText = submitButton?.textContent;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'PDF OCR চলছে—কয়েক মিনিট অপেক্ষা করুন';
  }
  try {
    const result = await AdminView.uploadFile(file, category, 'questions-pdf');
    if (!result.questions.length) {
      Toast.warning(result.message || 'PDF থেকে সম্পূর্ণ MCQ পাওয়া যায়নি।');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
      return;
    }
    pdfQuestionDrafts = result.questions.map(question => ({
      ...question,
      id: uid('q'),
      category,
      ...(category === 'JOB' ? { examName } : {}),
      subject,
      chapter,
      topic: chapter,
      year,
      board,
      difficulty: 'Medium',
      questionType: 'MCQ',
      explanation: question.explanation || ''
    }));
    const explanationCount = pdfQuestionDrafts.filter(question =>
      question.explanation.trim()
    ).length;
    Modal.open({
      title: `${pdfQuestionDrafts.length}টি প্রশ্ন যাচাই ও সম্পাদনা করুন`,
      maxWidth: '850px',
      content: `
        <p class="text-muted" style="margin-bottom:1rem;">
        ${result.usedOcr ? 'OCR দিয়ে PDF-এর লেখা শনাক্ত হয়েছে।' : 'PDF-এর লেখা থেকে প্রশ্ন শনাক্ত হয়েছে।'}
        ${result.usedOcr && explanationCount === 0 ? 'কোনো ব্যাখ্যা পাওয়া যায়নি—মূল PDF-এ ব্যাখ্যা থাকলে প্রতিটি পৃষ্ঠা ও বিন্যাস যাচাই করুন।' : `${explanationCount}টি প্রশ্নে ব্যাখ্যা পাওয়া গেছে।`}
        OCR ভুল পড়তে পারে—মূল PDF-এর সঙ্গে প্রতিটি প্রশ্ন, অপশন, উত্তর ও ব্যাখ্যা মিলিয়ে তারপর প্রকাশ করুন।
        </p>
        ${pdfQuestionDrafts.map((question, index) => `
          <section class="pdf-question-review" data-index="${index}" style="border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:1rem;margin-bottom:1rem;">
            <h4 style="margin-bottom:.5rem;">প্রশ্ন ${index + 1}</h4>
            <textarea class="form-textarea pdf-q-text" required>${escapeHtml(question.text)}</textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:.65rem 0;">
              ${question.options.map((option, optionIndex) => `
                <input class="form-input pdf-q-option" data-option="${optionIndex}" required value="${escapeHtml(option)}" aria-label="অপশন ${optionIndex + 1}">
              `).join('')}
            </div>
            <label class="form-label">সঠিক উত্তর *</label>
            <select class="form-select pdf-q-correct" required>
              <option value="">সঠিক উত্তর নির্বাচন করুন</option>
              ${question.options.map((_, optionIndex) => `<option value="${optionIndex}" ${question.correctIndex === optionIndex ? 'selected' : ''}>অপশন ${optionIndex + 1}</option>`).join('')}
            </select>
            <textarea class="form-textarea pdf-q-explanation" style="margin-top:.65rem" placeholder="ব্যাখ্যা (ঐচ্ছিক)">${escapeHtml(question.explanation || '')}</textarea>
          </section>
        `).join('')}
        <button class="btn btn-primary btn-block" onclick="window.publishPdfQuestions()">যাচাই করা প্রশ্নগুলো প্রশ্নব্যাংকে প্রকাশ করুন</button>
      `
    });
  } catch (error) {
    Toast.error(error.message);
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
};

window.publishPdfQuestions = async () => {
  try {
    const sections = [...document.querySelectorAll('.pdf-question-review')];
    const questions = sections.map((section, index) => {
      const correctIndex = section.querySelector('.pdf-q-correct').value;
      if (correctIndex === '') throw new Error(`প্রশ্ন ${index + 1}-এর সঠিক উত্তর নির্বাচন করুন।`);
      return {
        ...pdfQuestionDrafts[index],
        text: section.querySelector('.pdf-q-text').value.trim(),
        options: [...section.querySelectorAll('.pdf-q-option')].map(input => input.value.trim()),
        correctIndex: Number(correctIndex),
        explanation: section.querySelector('.pdf-q-explanation').value.trim()
      };
    });
    for (const question of questions) {
      await AdminView.saveResource('questions', question);
    }
    Toast.success(`${questions.length}টি যাচাই করা প্রশ্ন প্রকাশ হয়েছে।`);
    pdfQuestionDrafts = [];
    Modal.close();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('questions');
  } catch (error) {
    Toast.error(error.message);
  }
};

window.resetDatabase = () => {
  if (confirm('আপনি কি সকল ডাটাবেজ প্রাথমিক টেস্ট ডাটাতে রিসেট করতে চান?')) {
    db.reset();
    Toast.success('ডাটাবেজ সফলভাবে রিসেট হয়েছে!');
    window.location.reload();
  }
};

window.uploadBrandLogo = async (event) => {
  event.preventDefault();
  const input = document.getElementById('brand-logo-file');
  const file = input.files?.[0];
  if (!file) {
    Toast.error('একটি লোগো ফাইল নির্বাচন করুন।');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    Toast.error('লোগো ফাইলটি ৫ MB-এর মধ্যে হতে হবে।');
    return;
  }

  const submitButton = event.submitter;
  if (submitButton) submitButton.disabled = true;
  try {
    await AdminView.uploadFile(file, 'GLOBAL', 'brand-logo');
    const brandingLoaded = await window.appInstance.loadBranding();
    if (!brandingLoaded) throw new Error('লোগো আপলোড হয়েছে, কিন্তু সাইটে তা রিফ্রেশ করা যায়নি।');
    await AdminView.loadFromServer();
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('settings');
    Toast.success('Geneseon Academy-এর লোগো আপডেট হয়েছে।');
  } catch (error) {
    Toast.error(error.message);
    if (submitButton) submitButton.disabled = false;
  }
};

window.reviewManualOrder = async (orderId, status) => {
  if (!Auth.isAdmin()) return;
  const action = status === 'approved' ? 'পেমেন্ট পেয়েছেন' : 'অর্ডারটি বাতিল করবেন';
  if (!confirm(`আপনি কি ${action} বলে নিশ্চিত?`)) return;
  try {
    await AdminView.reviewPaymentOrder(orderId, status);
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('store-requests');
    Toast.success(status === 'approved'
      ? 'পেমেন্ট অনুমোদিত হয়েছে; শিক্ষার্থীর কোর্স বা PDF অ্যাক্সেস চালু হয়েছে।'
      : 'অর্ডারটি বাতিল করা হয়েছে।');
  } catch (error) {
    Toast.error(error.message);
  }
};

window.openStudentPasswordResetModal = (userId) => {
  if (Auth.getUser()?.role !== 'ADMIN') return;
  const student = AdminView.serverStudents.find(user => user.id === userId);
  if (!student || student.role !== 'STUDENT') return;
  Modal.open({
    title: 'শিক্ষার্থীর পাসওয়ার্ড রিসেট',
    content: `
      <form id="student-password-reset-form" onsubmit="window.submitStudentPasswordReset(event, '${escapeHtml(userId)}')">
        <p class="text-muted">${escapeHtml(student.name)}-কে নতুন অস্থায়ী পাসওয়ার্ড দিন। রিসেটের পর ওই শিক্ষার্থীর পুরোনো লগইন সেশনগুলো বন্ধ হবে।</p>
        <div class="form-group">
          <label class="form-label" for="student-new-password">নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
          <div class="password-input-wrapper">
            <input class="form-input has-password-toggle" type="password" id="student-new-password" minlength="6" maxlength="1024" autocomplete="new-password" required>
            <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('student-new-password', this)">${icons.eye}</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="student-confirm-password">পাসওয়ার্ড নিশ্চিত করুন</label>
          <div class="password-input-wrapper">
            <input class="form-input has-password-toggle" type="password" id="student-confirm-password" minlength="6" maxlength="1024" autocomplete="new-password" required>
            <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('student-confirm-password', this)">${icons.eye}</button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">পাসওয়ার্ড রিসেট করুন</button>
      </form>
    `
  });
};

window.submitStudentPasswordReset = async (event, userId) => {
  event.preventDefault();
  const password = document.getElementById('student-new-password').value;
  const confirmation = document.getElementById('student-confirm-password').value;
  if (password !== confirmation) {
    Toast.error('দুই পাসওয়ার্ডের মিল পাওয়া যায়নি।');
    return;
  }
  try {
    await AdminView.resetStudentPassword(userId, password);
    await AdminView.loadFromServer();
    Modal.close();
    Toast.success('পাসওয়ার্ড রিসেট হয়েছে। শিক্ষার্থী এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।');
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = AdminView.render('students');
  } catch (error) {
    Toast.error(error.message);
  }
};

window.openOwnStudentModeModal = () => {
  const user = Auth.getUser();
  if (!user || user.role !== 'ADMIN' || !user.adminEligible) return;
  Modal.open({
    title: 'সাধারণ ইউজার মোডে যান',
    content: `
      <form id="demote-admin-form" onsubmit="window.submitOwnStudentMode(event)">
        <p class="text-muted">শুধু আপনার নিজের অ্যাকাউন্টটি student mode-এ যাবে। পরে আপনার password দিয়ে Profile পেজ থেকে admin mode-এ ফিরতে পারবেন।</p>
        <div class="form-group">
          <label class="form-label" for="role-student-category">শিক্ষার্থী বিভাগ *</label>
          <select class="form-select" id="role-student-category" required>
            <option value="SSC">SSC</option>
            <option value="HSC">HSC</option>
            <option value="JOB">JOB</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="role-student-batch">ব্যাচ / লক্ষ্য *</label>
          <input class="form-input" id="role-student-batch" maxlength="120" required placeholder="যেমন: SSC 2026">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Student mode চালু করুন</button>
      </form>
    `
  });
};

window.submitOwnStudentMode = async (event) => {
  event.preventDefault();
  const educationType = document.getElementById('role-student-category').value;
  const batchOrTarget = document.getElementById('role-student-batch').value.trim();
  if (!batchOrTarget) {
    Toast.error('ব্যাচ বা লক্ষ্য লিখুন।');
    return;
  }
  Modal.close();
  await Auth.switchAdminMode({ role: 'STUDENT', educationType, batchOrTarget });
};


/* --- [js/views/authView.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - AUTHENTICATION VIEWS (REGISTRATION & LOGIN FLOW)
   ========================================================================== */




let selectedRegCategory = 'SSC';
const AuthView = window.AuthView = {
  renderRegister() {
    return `
      <div class="container container-sm" style="padding-top: 2.5rem; padding-bottom: 4rem;">
        <div class="text-center" style="margin-bottom: 2rem;">
          <div class="brand-logo justify-center" style="margin-bottom: 0.5rem;">
            ${icons.logo}
            <span>Geneseon Academy</span>
          </div>
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">নতুন শিক্ষার্থী একাউন্ট তৈরি করুন</h1>
          <p class="text-muted">কয়েক সেকেন্ডেই ফ্রিতে একাউন্ট খুলুন এবং পড়াশোনা শুরু করুন</p>
        </div>

        <div class="card" style="padding: 2rem; box-shadow: var(--shadow-xl);">
          <!-- Step 1: What are you preparing for? -->
          <div style="margin-bottom: 2rem;">
            <label class="form-label" style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.85rem; display: block; text-align: center;">
              ১. তুমি কিসের জন্য প্রস্তুতি নিচ্ছ? (Select One)
            </label>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;" class="reg-category-grid">
              <!-- SSC Card -->
              <div class="category-card ssc-card ${selectedRegCategory === 'SSC' ? 'selected-reg' : ''}" onclick="window.selectRegCategory('SSC')" style="padding: 1.25rem 0.75rem; border: 2px solid ${selectedRegCategory === 'SSC' ? 'var(--ssc-color)' : 'var(--border-color)'}; background: ${selectedRegCategory === 'SSC' ? 'var(--ssc-bg)' : 'var(--bg-surface)'};">
                <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🎓</div>
                <h4 style="font-size: 1.05rem; margin-bottom: 0.2rem;">এসএসসি (SSC)</h4>
                <span class="text-muted" style="font-size: 0.75rem;">SSC Student</span>
              </div>

              <!-- HSC Card -->
              <div class="category-card hsc-card ${selectedRegCategory === 'HSC' ? 'selected-reg' : ''}" onclick="window.selectRegCategory('HSC')" style="padding: 1.25rem 0.75rem; border: 2px solid ${selectedRegCategory === 'HSC' ? 'var(--hsc-color)' : 'var(--border-color)'}; background: ${selectedRegCategory === 'HSC' ? 'var(--hsc-bg)' : 'var(--bg-surface)'};">
                <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🔬</div>
                <h4 style="font-size: 1.05rem; margin-bottom: 0.2rem;">এইচএসসি (HSC)</h4>
                <span class="text-muted" style="font-size: 0.75rem;">HSC Student</span>
              </div>

              <!-- Job Card -->
              <div class="category-card job-card ${selectedRegCategory === 'JOB' ? 'selected-reg' : ''}" onclick="window.selectRegCategory('JOB')" style="padding: 1.25rem 0.75rem; border: 2px solid ${selectedRegCategory === 'JOB' ? 'var(--job-color)' : 'var(--border-color)'}; background: ${selectedRegCategory === 'JOB' ? 'var(--job-bg)' : 'var(--bg-surface)'};">
                <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🏛️</div>
                <h4 style="font-size: 1.05rem; margin-bottom: 0.2rem;">চাকরি প্রস্তুতি</h4>
                <span class="text-muted" style="font-size: 0.75rem;">Job Seeker / BCS</span>
              </div>
            </div>
          </div>

          <!-- Step 2: Simple Registration Form -->
          <form id="registration-form" onsubmit="window.handleRegisterSubmit(event)">
            <div class="form-group">
              <label class="form-label">পূর্ণ নাম (Full Name) *</label>
              <div class="input-icon-wrapper">
                <span class="input-icon">${icons.user}</span>
                <input type="text" id="reg-name" class="form-input" placeholder="যেমন: তানভীর আহমেদ" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">মোবাইল নম্বর *</label>
                <input type="tel" id="reg-mobile" class="form-input" placeholder="01XXXXXXXXX" required>
              </div>
              <div class="form-group">
                <label class="form-label">ইমেইল অ্যাড্রেস *</label>
                <input type="email" id="reg-email" class="form-input" placeholder="example@mail.com" required>
              </div>
            </div>

            <!-- Dynamic Additional Field -->
            <div class="form-group">
              <label class="form-label" id="reg-extra-label">
                ${selectedRegCategory === 'SSC' ? 'এসএসসি ব্যাচ / সন (যেমন: SSC 2026 Batch) *' : selectedRegCategory === 'HSC' ? 'এইচএসসি ব্যাচ / বিভাগ (যেমন: HSC 2025 Science) *' : 'টার্গেট পরীক্ষা / জব ক্যাটাগরি (যেমন: 47th BCS & Bank Job) *'}
              </label>
              <input type="text" id="reg-extra" class="form-input" placeholder="${selectedRegCategory === 'SSC' ? 'SSC 2026 Batch' : selectedRegCategory === 'HSC' ? 'HSC 2025 Science' : '47th BCS / Primary Teacher'}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">পাসওয়ার্ড *</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">${icons.lock}</span>
                  <input type="password" id="reg-pass" class="form-input has-password-toggle" placeholder="কমপক্ষে ৬ অক্ষর" minlength="6" autocomplete="new-password" required>
                  <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('reg-pass', this)">${icons.eye}</button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">পাসওয়ার্ড নিশ্চিত করুন *</label>
                <div class="input-icon-wrapper">
                  <span class="input-icon">${icons.lock}</span>
                  <input type="password" id="reg-cpass" class="form-input has-password-toggle" placeholder="পাসওয়ার্ড আবার লিখুন" minlength="6" autocomplete="new-password" required>
                  <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('reg-cpass', this)">${icons.eye}</button>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top: 1.5rem;">
              একাউন্ট খুলুন ও প্রস্তুতি শুরু করুন
            </button>
          </form>

          <div class="text-center" style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
            ইতোমধ্যে একাউন্ট আছে? <a href="#/login" style="color: var(--primary); font-weight: 700;">এখানে লগইন করুন</a>
          </div>
        </div>
      </div>
    `;
  },

  renderLogin() {
    return `
      <div class="container container-sm" style="padding-top: 2.5rem; padding-bottom: 4rem;">
        <div class="text-center" style="margin-bottom: 2rem;">
          <div class="brand-logo justify-center" style="margin-bottom: 0.5rem;">
            ${icons.logo}
            <span>Geneseon Academy</span>
          </div>
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Geneseon Academy-তে লগইন করুন</h1>
          <p class="text-muted">আপনার ইমেইল বা মোবাইল দিয়ে ড্যাশবোর্ডে প্রবেশ করুন</p>
        </div>

        <div class="card" style="padding: 2rem; box-shadow: var(--shadow-xl); margin-bottom: 2rem;">
          <form id="login-form" onsubmit="window.handleLoginSubmit(event)">
            <div class="form-group">
              <label class="form-label">ইমেইল অথবা মোবাইল নম্বর</label>
              <div class="input-icon-wrapper">
                <span class="input-icon">${icons.user}</span>
                <input type="text" id="login-identifier" class="form-input" placeholder="01XXXXXXXXX অথবা email@mail.com" autocomplete="username" required>
              </div>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label class="form-label">পাসওয়ার্ড</label>
              </div>
              <div class="input-icon-wrapper">
                <span class="input-icon">${icons.lock}</span>
                <input type="password" id="login-password" class="form-input has-password-toggle" placeholder="আপনার পাসওয়ার্ড" autocomplete="current-password" required>
                <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('login-password', this)">${icons.eye}</button>
              </div>
              <div style="text-align: right; margin-top: 0.35rem;">
                <button type="button" class="btn btn-ghost btn-sm" style="padding-right: 0;" onclick="window.showPasswordRecoveryInfo()">পাসওয়ার্ড ভুলে গেছেন?</button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top: 1.5rem;">
              লগইন করুন
            </button>
          </form>

          <div class="text-center" style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
            নতুন শিক্ষার্থী? <a href="#/register" style="color: var(--primary); font-weight: 700;">নতুন একাউন্ট খুলুন</a>
          </div>
        </div>

      </div>
    `;
  },

  renderResetPassword(token) {
    const safeToken = String(token || '').replace(/[^A-Za-z0-9_-]/g, '');
    return `
      <div class="container container-sm" style="padding-top: 2.5rem; padding-bottom: 4rem;">
        <div class="text-center" style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">নতুন পাসওয়ার্ড সেট করুন</h1>
          <p class="text-muted">নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।</p>
        </div>
        <div class="card" style="padding: 2rem; box-shadow: var(--shadow-xl);">
          <form id="password-reset-form" onsubmit="window.handlePasswordResetSubmit(event, '${safeToken}')">
            <div class="form-group">
              <label class="form-label" for="reset-new-password">নতুন পাসওয়ার্ড</label>
              <div class="password-input-wrapper">
                <input class="form-input has-password-toggle" type="password" id="reset-new-password" minlength="6" maxlength="1024" autocomplete="new-password" required>
                <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('reset-new-password', this)">${icons.eye}</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="reset-confirm-password">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
              <div class="password-input-wrapper">
                <input class="form-input has-password-toggle" type="password" id="reset-confirm-password" minlength="6" maxlength="1024" autocomplete="new-password" required>
                <button type="button" class="password-toggle" aria-label="পাসওয়ার্ড দেখান" aria-pressed="false" onclick="window.togglePasswordVisibility('reset-confirm-password', this)">${icons.eye}</button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">পাসওয়ার্ড পরিবর্তন করুন</button>
          </form>
        </div>
      </div>
    `;
  }
};

// Global Registration & Login Handlers
window.togglePasswordVisibility = (inputId, button) => {
  const input = document.getElementById(inputId);
  if (!input || !button) return;
  const showPassword = input.type === 'password';
  input.type = showPassword ? 'text' : 'password';
  button.innerHTML = showPassword ? icons.eyeOff : icons.eye;
  button.setAttribute('aria-label', showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান');
  button.setAttribute('aria-pressed', String(showPassword));
};

window.showPasswordRecoveryInfo = () => {
  Modal.open({
    title: 'পাসওয়ার্ড রিসেট লিংক',
    content: `
      <form id="password-reset-request-form" onsubmit="window.handlePasswordResetRequest(event)">
        <p class="text-muted" style="margin-bottom: 1rem;">আপনার অ্যাকাউন্টের ইমেইল দিন। রিসেট লিংক থাকলে ইমেইলে পাঠানো হবে; লিংকটি ৩০ মিনিটে মেয়াদোত্তীর্ণ হবে। ইমেইল সেবা কনফিগার না থাকলে অ্যাডমিনকে পাসওয়ার্ড রিসেট করতে বলুন।</p>
        <div class="form-group">
          <label class="form-label" for="reset-request-email">অ্যাকাউন্টের ইমেইল</label>
          <input class="form-input" type="email" id="reset-request-email" autocomplete="email" maxlength="254" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">রিসেট লিংক পাঠান</button>
      </form>
    `
  });
};

window.handlePasswordResetRequest = async (event) => {
  event.preventDefault();
  const email = document.getElementById('reset-request-email').value.trim();
  const submit = event.submitter;
  if (submit) submit.disabled = true;
  try {
    const result = await Auth.requestPasswordReset(email);
    Modal.close();
    Toast.info(result.message);
  } catch (error) {
    Toast.error(error.message);
  } finally {
    if (submit?.isConnected) submit.disabled = false;
  }
};

window.handlePasswordResetSubmit = async (event, token) => {
  event.preventDefault();
  const password = document.getElementById('reset-new-password').value;
  const confirmation = document.getElementById('reset-confirm-password').value;
  if (password !== confirmation) {
    Toast.error('দুই পাসওয়ার্ডের মিল পাওয়া যায়নি।');
    return;
  }
  const submit = event.submitter;
  if (submit) submit.disabled = true;
  try {
    const result = await Auth.completePasswordReset(token, password);
    Toast.success(result.message);
    window.location.hash = '#/login';
  } catch (error) {
    Toast.error(error.message);
  } finally {
    if (submit?.isConnected) submit.disabled = false;
  }
};

window.selectRegCategory = (cat) => {
  selectedRegCategory = cat;
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = AuthView.renderRegister();
};

window.handleRegisterSubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const mobile = document.getElementById('reg-mobile').value;
  const email = document.getElementById('reg-email').value;
  const batch = document.getElementById('reg-extra').value;
  const pass = document.getElementById('reg-pass').value;
  const cpass = document.getElementById('reg-cpass').value;

  if (pass !== cpass) {
    Toast.error('দুই পাসওয়ার্ডের মিল পাওয়া যায়নি!');
    return;
  }

  await Auth.register({
    name: name,
    mobile: mobile,
    email: email,
    password: pass,
    educationType: selectedRegCategory,
    batchOrTarget: batch
  });
};

window.handleLoginSubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById('login-identifier').value;
  const pass = document.getElementById('login-password').value;
  await Auth.login(id, pass);
};


/* --- [js/app.js] --- */
/* ==========================================================================
   GENESEON ACADEMY - MASTER APPLICATION ROUTER & LAYOUT CONTROLLER
   ========================================================================== */

















// Expose key modules to window for inline HTML onclick attributes
window.Auth = Auth;
window.db = db;
window.i18n = i18n;
window.icons = icons;
window.Toast = Toast;
window.Modal = Modal;
class App {
  constructor() {
    this.headerEl = document.getElementById('main-header');
    this.contentEl = document.getElementById('main-content');
    this.branding = { siteName: 'Geneseon Academy', logoUrl: null };
    
    this.init();
  }

  async init() {
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

    await Auth.ready;
    await this.loadBranding();
    this.renderHeader();
    this.handleRoute();
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
        <ul class="nav-links">
          <li><a href="${homeRoute}" class="nav-link ${currentHash === homeRoute ? 'active' : ''}">${i18n.t('home')}</a></li>
          <li><a href="#/courses" class="nav-link ${currentHash.startsWith('#/courses') || currentHash.startsWith('#/course') ? 'active' : ''}">${i18n.t('courses')}</a></li>
          <li><a href="#/store" class="nav-link ${currentHash.startsWith('#/store') ? 'active' : ''}">${i18n.t('store')}</a></li>
          <li><a href="#/exam" class="nav-link ${currentHash.startsWith('#/exam') ? 'active' : ''}">${i18n.t('exam')}</a></li>
          <li><a href="#/question-bank" class="nav-link ${currentHash.startsWith('#/question-bank') ? 'active' : ''}">${i18n.t('questionBank')}</a></li>
          <li><a href="#/ai" class="nav-link ${currentHash.startsWith('#/ai') ? 'active' : ''}" style="font-weight: 700;">${i18n.t('aiAssistant')}</a></li>
        </ul>

        <!-- Right Side Header Actions -->
        <div class="header-actions">
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
      if (
        activeExam &&
        activeExam.userId === Auth.getUser()?.id &&
        !Auth.isAdmin() &&
        path !== `#/exam/${activeExam.examId}`
      ) {
        Toast.warning('পরীক্ষা জমা না দেওয়া পর্যন্ত অন্য পেজে যাওয়া যাবে না।');
        window.location.hash = `#/exam/${encodeURIComponent(activeExam.examId)}`;
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


})();
