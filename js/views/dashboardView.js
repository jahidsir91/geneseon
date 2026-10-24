/* ==========================================================================
   GENESEON ACADEMY - STUDENT PERSONALIZED DASHBOARD VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { i18n } from '../i18n.js';
import { icons, formatBDT } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const DashboardView = {
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
