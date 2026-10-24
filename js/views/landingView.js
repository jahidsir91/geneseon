/* ==========================================================================
   GENESEON ACADEMY - LANDING PAGE VIEW
   ========================================================================== */

import { db } from '../db.js';
import { i18n } from '../i18n.js';
import { formatBDT, icons } from '../utils/helpers.js';

export const LandingView = {
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
