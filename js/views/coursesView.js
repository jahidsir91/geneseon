/* ==========================================================================
   GENESEON ACADEMY - COURSES CATALOG & COURSE DETAIL VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { i18n } from '../i18n.js';
import { formatBDT, icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const CoursesView = {
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
