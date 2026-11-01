/* ==========================================================================
   GENESEON ACADEMY - STUDENT PERSONALIZED DASHBOARD VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { i18n } from '../i18n.js';
import { icons, formatBDT } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

function escapeGoalText(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

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
    const scoredAttempts = attempts.map(attempt => {
      const percentage = Number.isFinite(Number(attempt.percentage))
        ? Number(attempt.percentage)
        : Number(attempt.totalMarks) > 0
          ? Number(attempt.score) / Number(attempt.totalMarks) * 100
          : null;
      return percentage === null ? null : { ...attempt, percentage };
    }).filter(Boolean);
    const averageScore = scoredAttempts.length
      ? Math.round(scoredAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / scoredAttempts.length)
      : 0;
    const correctAnswers = attempts.reduce((sum, attempt) => sum + (Number(attempt.correct) || 0), 0);
    const wrongAnswers = attempts.reduce((sum, attempt) => sum + (Number(attempt.wrong) || 0), 0);
    const answeredQuestions = correctAnswers + wrongAnswers;
    const accuracy = answeredQuestions
      ? Math.round(correctAnswers / answeredQuestions * 100)
      : 0;

    // Use Bangladesh time even when the device timezone differs.
    const timeParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const localTime = Object.fromEntries(timeParts.map(part => [part.type, part.value]));
    const minutes = Number(localTime.hour) * 60 + Number(localTime.minute);
    const greeting = minutes >= 19 * 60 + 30 || minutes < 4 * 60
      ? 'শুভ রাত্রি'
      : minutes >= 17 * 60
        ? 'শুভ সন্ধ্যা'
        : minutes >= 14 * 60
          ? 'শুভ বিকাল'
          : minutes >= 12 * 60
            ? 'শুভ দুপুর'
            : 'শুভ সকাল';

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
                <div class="val">${attempts.length}</div>
                <div class="lbl">অংশগ্রহণকৃত পরীক্ষা</div>
              </div>
              <div class="stat-box">
                <div class="val" style="color: var(--primary);">${averageScore}%</div>
                <div class="lbl">গড় স্কোর</div>
              </div>
              <div class="stat-box">
                <div class="val" style="color: var(--success);">${accuracy}%</div>
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
            ${user.role === 'STUDENT' && !isAdminPreview
              ? '<div id="study-goals-container" class="tasks-card"><p class="text-muted">১২ দিনের অধ্যয়নের লক্ষ্য লোড হচ্ছে...</p></div>'
              : ''}

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
  },

  async loadStudyGoals() {
    const container = document.getElementById('study-goals-container');
    if (!container) return;
    try {
      const response = await fetch('/api/student/study-goals', { credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'অধ্যয়নের লক্ষ্য লোড করা যায়নি।');
      if (!result.goals) {
        container.innerHTML = `<h3>${escapeGoalText(result.category)} বিভাগের লক্ষ্য</h3><p class="text-muted">অ্যাডমিন এখনো ${escapeGoalText(result.category)} বিভাগের ১২ দিনের অধ্যয়নের লক্ষ্য সেট করেননি।</p>`;
        return;
      }

      const completedGoals = result.completedGoals || [];
      const category = escapeGoalText(result.category);
      const energy = Number(result.energyPercent) || 0;
      const dayIndex = Number(result.dayIndex) || 1;
      const dailyCompleted = completedGoals.filter(goal => goal.dayIndex === dayIndex).length;
      container.innerHTML = `
        <div class="study-goal-header">
          <div>
            <h3>${category} বিভাগের লক্ষ্য</h3>
            <span class="badge badge-ssc">দিন ${dayIndex} / ১২</span>
          </div>
          <button class="study-energy-button" type="button" style="--energy-level:${energy}%"
            aria-label="স্টাডি এনার্জি ${energy} শতাংশ" onclick="window.showStudyGoalEnergy(${energy})">⚡</button>
        </div>
        <div class="study-energy-info">
          <strong>১২ দিন study streak</strong>
          <span>${energy}% এনার্জি • ${result.completedCount || 0}/36 লক্ষ্য</span>
        </div>
        <div class="study-energy-track" role="progressbar" aria-valuenow="${energy}" aria-valuemin="0" aria-valuemax="100">
          <div class="study-energy-fill" style="width:${energy}%"></div>
        </div>
        ${result.cycleComplete ? `
          <p class="study-goal-cycle-complete">১২ দিনের সব লক্ষ্য সম্পন্ন হয়েছে!</p>
        ` : `
          <p class="text-muted study-goal-day-progress">${dailyCompleted}/3 লক্ষ্য সম্পন্ন</p>
          <ul class="tasks-list">
            ${result.goals[dayIndex - 1].map((goal, goalIndex) => {
              const isComplete = completedGoals.some(item =>
                item.dayIndex === dayIndex && item.goalIndex === goalIndex
              );
              return `
                <li class="task-item ${isComplete ? 'completed' : ''}">
                  <input type="checkbox" class="task-checkbox" ${isComplete ? 'checked disabled' : ''}
                    aria-label="লক্ষ্য সম্পন্ন করুন"
                    onchange="window.completeStudyGoal(${dayIndex}, ${goalIndex}, this.checked)">
                  <span class="task-text">${escapeGoalText(goal)}</span>
                </li>
              `;
            }).join('')}
          </ul>
        `}
      `;
      if (result.cycleComplete && !document.getElementById('study-goal-congrats-modal')) {
        window.Modal?.open({
          title: 'Congrats!',
          content: '<p id="study-goal-congrats-modal">Congrats. You did good job. Try next 12 days</p>',
          footer: '<button class="btn btn-primary" type="button" onclick="window.startNextStudyGoalCycle()">Try next 12 days</button>',
        });
      }
    } catch (error) {
      container.innerHTML = `<p class="text-danger">${escapeGoalText(error.message || 'অধ্যয়নের লক্ষ্য লোড করা যায়নি।')}</p>`;
    }
  },

  async completeStudyGoal(dayIndex, goalIndex, checked) {
    if (!checked) return;
    try {
      const response = await fetch('/api/student/study-goals/complete', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayIndex, goalIndex })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'লক্ষ্যটি সম্পন্ন করা যায়নি।');
      await this.loadStudyGoals();
    } catch (error) {
      Toast.error(error.message || 'লক্ষ্যটি সম্পন্ন করা যায়নি।');
      await this.loadStudyGoals();
    }
  },

  showStudyGoalEnergy(energy) {
    Toast.info(`তোমার ১২ দিনের স্টাডি এনার্জি এখন ${energy}%।`);
  },

  async startNextStudyGoalCycle() {
    try {
      const response = await fetch('/api/student/study-goals/next-cycle', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'পরের ১২ দিনের লক্ষ্য শুরু করা যায়নি।');
      window.Modal?.close();
      await this.loadStudyGoals();
    } catch (error) {
      Toast.error(error.message || 'পরের ১২ দিনের লক্ষ্য শুরু করা যায়নি।');
    }
  }
};

window.completeStudyGoal = (...args) => DashboardView.completeStudyGoal(...args);
window.showStudyGoalEnergy = (energy) => DashboardView.showStudyGoalEnergy(energy);
window.startNextStudyGoalCycle = () => DashboardView.startNextStudyGoalCycle();
