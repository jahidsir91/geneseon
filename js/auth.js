/* ==========================================================================
   GENESEON ACADEMY - SERVER-BACKED AUTHENTICATION & USER SESSION MANAGER
   ========================================================================== */

import { db } from './db.js';
import { Toast } from './utils/toast.js';

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি।');
  }
  if (!response.ok) {
    throw new Error(result.error || 'অনুরোধটি সম্পন্ন করা যায়নি।');
  }
  return result;
}

function cacheUser(user) {
  if (!user) return null;
  const cached = db.getUserById(user.id);
  if (cached) {
    db.updateUser(user.id, user);
  } else {
    db.addUser(user);
  }
  return user;
}

export const Auth = {
  currentUser: null,
  ready: null,

  init() {
    this.ready = request('/api/auth/me')
      .then(({ user }) => {
        this.currentUser = cacheUser(user);
        if (this.currentUser) {
          void this.loadContent();
          void this.loadNotifications();
        }
        return this.currentUser;
      })
      .catch(error => {
        console.error('Authentication session check failed:', error);
        this.currentUser = null;
        Toast.error('অ্যাকাউন্ট সার্ভারের সাথে সংযোগ করা যায়নি।');
        return null;
      });
    return this.ready;
  },

  async loadContent() {
    if (!this.currentUser) return;
    try {
      const content = await request('/api/content');
      db.mergeServerContent(content);
      window.dispatchEvent(new CustomEvent('contentChanged'));
    } catch (error) {
      console.error('Server content synchronization failed:', error);
      Toast.warning('সার্ভারের নতুন কোর্স ও পরীক্ষার তথ্য লোড করা যায়নি।');
    }
  },

  async loadNotifications() {
    if (!this.currentUser) return;
    try {
      const { notifications } = await request('/api/notifications');
      db.setServerNotifications(notifications || []);
    } catch (error) {
      console.error('Notification synchronization failed:', error);
      db.setServerNotifications([]);
      Toast.warning('নোটিফিকেশন লোড করা যায়নি।');
    }
  },

  async refreshContent() {
    return this.loadContent();
  },

  getUser() {
    return this.currentUser;
  },

  saveSession() {
    window.dispatchEvent(new CustomEvent('authChanged', {
      detail: { user: this.currentUser }
    }));
  },

  async login(emailOrMobile, password) {
    try {
      const { user } = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: emailOrMobile.trim(), password })
      });
      this.currentUser = cacheUser(user);
      void this.loadContent();
      void this.loadNotifications();
      this.saveSession();
      Toast.success(`স্বাগতম, ${user.name}!`);
      window.location.hash = user.role === 'ADMIN' ? '#/admin' : '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async requestPasswordReset(email) {
    return request('/api/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async completePasswordReset(token, password) {
    return request('/api/auth/password-reset/complete', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  },

  async switchAdminMode({ role, educationType, batchOrTarget, password }) {
    try {
      const { user } = await request('/api/auth/admin-mode', {
        method: 'POST',
        body: JSON.stringify({ role, educationType, batchOrTarget, password })
      });
      this.currentUser = cacheUser(user);
      this.saveSession();
      Toast.success(role === 'ADMIN'
        ? 'অ্যাডমিন মোড চালু হয়েছে।'
        : 'শিক্ষার্থী মোড চালু হয়েছে।');
      window.location.hash = role === 'ADMIN' ? '#/admin' : '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async register({ name, mobile, email, password, educationType, batchOrTarget }) {
    try {
      const { user } = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name, mobile, email, password, educationType, batchOrTarget
        })
      });
      this.currentUser = cacheUser(user);
      await this.loadContent();
      this.saveSession();
      Toast.success('রেজিস্ট্রেশন সফল হয়েছে! জেনেসিওন একাডেমি প্ল্যাটফর্মে স্বাগতম।');
      window.location.hash = '#/dashboard';
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST', body: '{}' });
    } catch (error) {
      console.error('Server logout failed:', error);
      Toast.error('সার্ভারে লগআউট সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
      return false;
    }
    this.currentUser = null;
    this.saveSession();
    Toast.info('সফলভাবে লগআউট হয়েছে।');
    window.location.hash = '#/login';
    return true;
  },

  async updateProfile(updates) {
    if (!this.currentUser) return false;
    try {
      const { user } = await request('/api/auth/profile', {
        method: 'POST',
        body: JSON.stringify(updates)
      });
      this.currentUser = cacheUser(user);
      this.saveSession();
      Toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      return true;
    } catch (error) {
      Toast.error(error.message);
      return false;
    }
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  isAdmin() {
    return this.currentUser?.role === 'ADMIN';
  },

  canAccessCategory(category) {
    return this.isAdmin() || (
      !!this.currentUser &&
      ['SSC', 'HSC', 'JOB'].includes(this.currentUser.educationType) &&
      this.currentUser.educationType === category
    );
  },

  canAccessCourse(course) {
    return this.isAdmin() || (
      !!course &&
      this.canAccessCategory(course.category) &&
      (this.currentUser?.enrolledCourses || []).includes(course.id)
    );
  }
};

Auth.init();
