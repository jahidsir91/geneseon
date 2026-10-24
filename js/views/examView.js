/* ==========================================================================
   GENESEON ACADEMY - EXAM RUNNER & DIAGNOSTIC RESULTS VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { ExamService } from '../services/examService.js';
import { i18n } from '../i18n.js';
import { icons, formatBDT } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

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

export const ExamView = {
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
