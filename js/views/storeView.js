/* ==========================================================================
   GENESEON ACADEMY - STORE, PRODUCT DETAIL, CART & BANGLADESH CHECKOUT VIEW
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { PaymentService } from '../services/paymentService.js';
import { formatBDT, icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('ja_cart') || '[]');
  } catch (e) {
    return [];
  }
}

function getAccessibleCart() {
  const cart = getCart();
  const user = Auth.getUser();
  if (!user || Auth.isAdmin()) return cart;

  const accessible = cart.filter(item => {
    if (item.type === 'course') {
      const course = db.getCourseById(item.id);
      return course && Auth.canAccessCategory(course.category);
    }
    const product = db.getProductById(item.id);
    return product?.educationTypes?.includes(user.educationType);
  });
  if (accessible.length !== cart.length) saveCart(accessible);
  return accessible;
}

function saveCart(cart) {
  localStorage.setItem('ja_cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

let activeCoupon = null;

function getCouponDiscount(subtotal) {
  if (!activeCoupon) return 0;
  let discount = 0;
  if (activeCoupon.discountPercent) {
    discount = Math.round(subtotal * activeCoupon.discountPercent / 100);
    if (activeCoupon.maxDiscount) discount = Math.min(activeCoupon.maxDiscount, discount);
  } else if (activeCoupon.discountAmount) {
    discount = activeCoupon.discountAmount;
  }
  return Math.min(subtotal, discount);
}

export const StoreView = {
  renderStore(activeCategory = 'ALL') {
    const user = Auth.getUser();
    let products = db.getProducts();
    if (user && !Auth.isAdmin()) {
      products = products.filter(p => p.educationTypes?.includes(user.educationType));
    }
    if (activeCategory !== 'ALL') {
      products = products.filter(p => p.category === activeCategory);
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <div class="section-header text-center">
          <h1 style="font-size: 2.2rem; margin-bottom: 0.5rem;">জেনেসিওন একাডেমি স্টোর ও প্রকাশনা</h1>
          <p class="text-muted">বিসিএস ও বোর্ড প্রস্তুতির সেরা বই, লেকচার নোটস ও ওএমআর শিট বান্ডেল</p>
        </div>

        <div class="filter-chips justify-center" style="margin-bottom: 2.5rem;">
          <button class="chip-btn ${activeCategory === 'ALL' ? 'active' : ''}" onclick="window.location.hash='#/store'">সকল পণ্য (${db.getProducts().length})</button>
          <button class="chip-btn ${activeCategory === 'Books' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Books'">প্রিন্টেড বই (Books)</button>
          <button class="chip-btn ${activeCategory === 'PDF' ? 'active' : ''}" onclick="window.location.hash='#/store?category=PDF'">ডিজিটাল শিট (PDF)</button>
          <button class="chip-btn ${activeCategory === 'Notes' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Notes'">হ্যান্ডনোটস (Notes)</button>
          <button class="chip-btn ${activeCategory === 'Model Tests' ? 'active' : ''}" onclick="window.location.hash='#/store?category=Model Tests'">মডেল টেস্ট বান্ডেল</button>
        </div>

        <div class="store-products-grid">
          ${products.map(p => `
            <div class="product-card">
              <div class="product-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <span class="product-type-badge badge ${p.type === 'digital' ? 'badge-success' : 'badge-warning'}">
                  ${p.type === 'digital' ? '⚡ Instant PDF' : '📦 Home Delivery'}
                </span>
              </div>
              <div class="product-body">
                <span class="badge badge-ssc" style="width: fit-content; margin-bottom: 0.5rem; font-size: 0.7rem;">${p.category}</span>
                <h3 class="product-title" title="${p.name}">${p.name}</h3>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <span style="color: #F59E0B; font-size: 0.85rem;">★ ${p.rating}</span>
                  <span class="text-muted" style="font-size: 0.8rem;">(১০০+ রিভিউ)</span>
                </div>

                <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--divider); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-size: 1.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                      ${formatBDT(p.price)}
                    </div>
                    <div style="font-size: 0.75rem; text-decoration: line-through; color: var(--text-subtle);">
                      ${formatBDT(p.originalPrice)}
                    </div>
                  </div>

                  <a href="#/store/product/${p.id}" class="btn btn-primary btn-sm">
                    বিস্তারিত
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderProductDetail(productId) {
    const p = db.getProductById(productId);
    const user = Auth.getUser();
    if (!p || (user && !Auth.isAdmin() && !p.educationTypes?.includes(user.educationType))) {
      return `<div class="container text-center" style="padding: 4rem;"><h2>পণ্যটি পাওয়া যায়নি</h2><a href="#/store" class="btn btn-primary">সকল পণ্য</a></div>`;
    }

    const isUnlocked = user && user.unlockedProducts && user.unlockedProducts.includes(p.id);

    return `
      <div class="container" style="padding-top: 2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; margin-bottom: 3.5rem;">
          <div style="border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-surface); max-height: 460px;">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>

          <div>
            <span class="badge ${p.type === 'digital' ? 'badge-success' : 'badge-warning'}" style="margin-bottom: 0.75rem;">
              ${p.type === 'digital' ? '⚡ ডিজিটাল ডাউনলোড (Instant PDF)' : '📦 প্রিন্টেড কপি (সারা দেশে হোম ডেলিভারি)'}
            </span>
            <h1 style="font-size: 1.85rem; line-height: 1.35; margin-bottom: 1rem;">${p.name}</h1>

            <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem;">
              <span style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary);">
                ${formatBDT(p.price)}
              </span>
              <span style="font-size: 1.15rem; text-decoration: line-through; color: var(--text-subtle);">
                ${formatBDT(p.originalPrice)}
              </span>
              <span class="badge badge-danger">${p.discount}% ছাড়</span>
            </div>

            <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
              ${p.description}
            </p>

            ${p.included ? `
              <div style="background: var(--bg-card-subtle); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.75rem;">
                <strong style="display: block; margin-bottom: 0.5rem;">প্যাকেজে যা যা থাকছে:</strong>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
                  ${p.included.map(inc => `<li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--success);">${icons.check}</span> ${inc}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${isUnlocked && p.type === 'digital' ? `
                <a href="${p.fileUrl || '#'}" target="_blank" class="btn btn-success btn-lg">
                  ${icons.download} ডিজিটাল ফাইল ডাউনলোড করুন (Unlocked)
                </a>
              ` : `
                <button class="btn btn-glowing btn-lg" onclick="window.addToCartAndCheckout('${p.id}', '${p.type}')">
                  ${icons.shoppingCart} এখনই কিনুন (${formatBDT(p.price)})
                </button>
                <button class="btn btn-outline btn-lg" onclick="window.addToCartOnly('${p.id}', '${p.type}')">
                  কার্টে যোগ করুন
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderCart() {
    const cart = getAccessibleCart();
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    const discount = getCouponDiscount(subtotal);

    const total = Math.max(0, subtotal - discount);

    if (cart.length === 0) {
      return `
        <div class="container text-center" style="padding: 4rem 1rem;">
          <div class="empty-state">
            <div class="empty-state-icon">${icons.shoppingCart}</div>
            <h2 class="empty-state-title">আপনার কার্ট খালি</h2>
            <p class="empty-state-text">আপনার কার্টে বর্তমানে কোনো কোর্স বা বই যুক্ত নেই।</p>
            <a href="#/courses" class="btn btn-primary" style="margin-top: 1rem;">কোর্সসমূহ দেখুন</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding-top: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem;">শপিং কার্ট (${cart.length})</h1>

        <div class="cart-layout">
          <!-- Cart Items -->
          <div class="cart-items-table">
            ${cart.map((item, idx) => `
              <div class="cart-item-row">
                <img src="${item.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100'}" class="cart-item-thumb">
                
                <div style="flex: 1; min-width: 0;">
                  <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">${item.name}</h4>
                  <span class="text-muted" style="font-size: 0.8rem;">${item.type === 'course' ? '🎓 অনলাইন কোর্স' : item.type === 'digital' ? '⚡ ডিজিটাল শিট' : '📦 হার্ডকভার বই'}</span>
                </div>

                <div class="qty-control">
                  <button class="qty-btn" onclick="window.updateCartQty(${idx}, -1)">-</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.updateCartQty(${idx}, 1)">+</button>
                </div>

                <div style="font-weight: 800; font-family: var(--font-heading); min-width: 80px; text-align: right;">
                  ${formatBDT(item.price * item.quantity)}
                </div>

                <button class="btn btn-ghost btn-sm" onclick="window.removeFromCart(${idx})" style="color: var(--danger);">
                  ${icons.trash}
                </button>
              </div>
            `).join('')}
          </div>

          <!-- Summary Card -->
          <div class="cart-summary-card">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">অর্ডারের বিবরণ</h3>

            <div class="summary-line">
              <span>সাবটোটাল</span>
              <span>${formatBDT(subtotal)}</span>
            </div>

            ${discount > 0 ? `
              <div class="summary-line" style="color: var(--success);">
                <span>কুপন ডিসকাউন্ট (${activeCoupon.code})</span>
                <span>-${formatBDT(discount)}</span>
              </div>
            ` : ''}

            <div class="summary-line total">
              <span>সর্বমোট প্রদেয়</span>
              <span>${formatBDT(total)}</span>
            </div>

            <!-- Coupon Input -->
            <div style="display: flex; gap: 0.5rem; margin: 1.25rem 0;">
              <input type="text" id="coupon-input" class="form-input" placeholder="কুপন কোড (যেমন GENESEON50)" value="${activeCoupon ? activeCoupon.code : ''}">
              <button class="btn btn-secondary" onclick="window.applyCartCoupon()">প্রয়োগ</button>
            </div>

            <a href="#/checkout" class="btn btn-glowing btn-lg btn-block">
              ${icons.check} চেকআউটে এগিয়ে যান
            </a>
          </div>
        </div>
      </div>
    `;
  },

  renderCheckout() {
    const cart = getAccessibleCart();
    if (cart.length === 0) {
      window.location.hash = '#/cart';
      return '';
    }

    let subtotal = 0;
    cart.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    const discount = getCouponDiscount(subtotal);
    const total = Math.max(0, subtotal - discount);
    const supportedCheckout = cart.length > 0 && cart.every(item =>
      ['course', 'digital'].includes(item.type)
    );

    return `
      <div class="container" style="padding-top: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1.5rem;">চেকআউট ও নিরাপদ পেমেন্ট</h1>

        <div class="checkout-layout">
          <!-- Left: Information Form -->
          <div class="card" style="padding: 1.75rem;">
            <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">ম্যানুয়াল bKash পেমেন্ট</h3>
            <p class="text-muted">পরের ধাপে অ্যাকাডেমির bKash নম্বর দেখানো হবে। Send Money করার পর নিজের পাঠানো নম্বর ও TrxID জমা দিন। PIN/OTP কখনো দেবেন না।</p>
            
            <div class="payment-gateways-grid">
              <div class="payment-method-card selected" id="method-bkash">
                <div class="gateway-icon bkash-bg">bKash</div>
                <div>
                  <strong>bKash</strong>
                  <div class="text-muted" style="font-size: 0.75rem;">Send Money করে TrxID জমা দিন</div>
                </div>
              </div>
              <p class="text-muted" style="font-size: 0.85rem;">পেমেন্ট যাচাই হলে কোর্স বা ডিজিটাল PDF অ্যাকাউন্টে যোগ হবে। কুপনে মোট মূল্য শূন্য হলে সঙ্গে সঙ্গে চালু হবে।</p>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
              <input type="text" id="coupon-input" class="form-input" placeholder="কুপন কোড লিখুন" value="${activeCoupon ? activeCoupon.code : ''}">
              <button type="button" class="btn btn-secondary" onclick="window.applyCartCoupon()">প্রয়োগ</button>
            </div>
          </div>

          <!-- Right: Summary & Pay Button -->
          <div class="cart-summary-card">
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">অর্ডার সামারি</h3>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
              ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                  <span>${item.name} × ${item.quantity}</span>
                  <strong>${formatBDT(item.price * item.quantity)}</strong>
                </div>
              `).join('')}
            </div>

            <div class="summary-line">
              <span>সাবটোটাল</span>
              <span>${formatBDT(subtotal)}</span>
            </div>

            ${discount > 0 ? `
              <div class="summary-line" style="color: var(--success);">
                <span>কুপন ছাড় (${activeCoupon.code})</span>
                <span>-${formatBDT(discount)}</span>
              </div>
            ` : ''}

            <div class="summary-line total">
              <span>সর্বমোট প্রদেয়</span>
              <span>${formatBDT(total)}</span>
            </div>

            ${supportedCheckout ? '' : '<p class="text-danger">Manual bKash checkout-এ শুধু কোর্স এবং ডিজিটাল PDF কেনা যাবে। কার্ট থেকে অন্য পণ্য সরান।</p>'}
            <button id="pay-now-btn" class="btn btn-glowing btn-lg btn-block" style="margin-top: 1.5rem;" ${supportedCheckout ? '' : 'disabled'} onclick="window.executeCheckoutPayment()">
              ${total === 0 ? 'কুপন ব্যবহার করে নিন' : `bKash পেমেন্ট জমা দিন (${formatBDT(total)})`}
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.addToCartOnly = (id, type) => {
  let item = null;
  if (type === 'course') {
    const c = db.getCourseById(id);
    if (c && (!Auth.getUser() || Auth.canAccessCategory(c.category))) {
      item = { id: c.id, name: c.title, price: c.price, type: 'course', image: c.thumbnail, quantity: 1 };
    }
  } else {
    const p = db.getProductById(id);
    const user = Auth.getUser();
    if (p && (!user || Auth.isAdmin() || p.educationTypes?.includes(user.educationType))) {
      item = { id: p.id, name: p.name, price: p.price, type: p.type, image: p.image, quantity: 1 };
    }
  }

  if (item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing && item.type !== 'digital') existing.quantity++;
    else if (existing) {
      Toast.info('এই PDF ইতিমধ্যে কার্টে আছে।');
      return;
    }
    else cart.push(item);
    saveCart(cart);
    Toast.success('কার্টে যোগ করা হয়েছে!');
  }
};

window.addToCartAndCheckout = (id, type) => {
  window.addToCartOnly(id, type);
  window.location.hash = '#/checkout';
};

window.updateCartQty = (idx, delta) => {
  const cart = getCart();
  if (cart[idx]) {
    if (cart[idx].type === 'digital' && delta > 0) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveCart(cart);
    const content = document.getElementById('main-content');
    if (content) content.innerHTML = StoreView.renderCart();
  }
};

window.removeFromCart = (idx) => {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  Toast.info('আইটেমটি কার্ট থেকে সরানো হয়েছে');
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = StoreView.renderCart();
};

window.applyCartCoupon = async () => {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  try {
    const response = await fetch('/api/payment-info', {
      credentials: 'same-origin'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'কুপন যাচাই করা যায়নি।');
    }
    const coupon = result.coupons?.[code];
    if (!coupon) {
      activeCoupon = null;
      Toast.error('কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।');
    } else {
      activeCoupon = { code, ...coupon };
      Toast.success(`কুপন '${code}' সফলভাবে প্রয়োগ করা হয়েছে!`);
    }
  } catch (error) {
    activeCoupon = null;
    console.error('Could not validate coupon:', error);
    Toast.error(error.message || 'কুপন যাচাই করা যায়নি।');
  }
  const content = document.getElementById('main-content');
  if (content) {
    content.innerHTML = window.location.hash.startsWith('#/checkout')
      ? StoreView.renderCheckout()
      : StoreView.renderCart();
  }
};

window.executeCheckoutPayment = () => {
  const cart = getCart();

  PaymentService.processPayment({
    items: cart,
    couponCode: activeCoupon?.code || '',
    gateway: 'bKash',
    onComplete: (order) => {
      window.location.hash = '#/dashboard';
    }
  });
};
