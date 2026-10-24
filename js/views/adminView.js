/* ==========================================================================
   GENESEON ACADEMY - ADMIN DASHBOARD & COMPLETE MANAGEMENT VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { formatBDT, icons, uid } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

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

export const AdminView = {
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
