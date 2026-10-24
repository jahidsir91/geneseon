/* ==========================================================================
   GENESEON ACADEMY - AUTHENTICATION VIEWS (REGISTRATION & LOGIN FLOW)
   ========================================================================== */

import { Auth } from '../auth.js';
import { icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';

let selectedRegCategory = 'SSC';

export const AuthView = {
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
