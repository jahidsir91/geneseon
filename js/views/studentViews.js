/* ==========================================================================
   GENESEON ACADEMY - MY COURSES, MY EXAMS, PROFILE & NOTIFICATIONS VIEWS
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { i18n } from '../i18n.js';
import { formatBDT, icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

export const MyCoursesView = {
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

export const MyExamsView = {
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

export const ProfileView = {
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

export const NotificationsView = {
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
