/* ==========================================================================
   GENESEON ACADEMY - COURSE LEARNING & VIDEO PLAYER VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { icons, launchConfetti } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

let activeLessonId = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export const LearnView = {
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
