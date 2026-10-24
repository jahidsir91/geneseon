/* ==========================================================================
   GENESEON ACADEMY - QUESTION BANK & PRACTICE TEST GENERATOR VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { ExamService } from '../services/examService.js';
import { icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

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

export const QuestionBankView = {
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
