import { Auth } from '../auth.js';
import { Toast } from '../utils/toast.js';
import { Modal } from '../utils/modal.js';
import { formatBDT } from '../utils/helpers.js';

export const PaymentService = {
  async processPayment({ items, couponCode = '', gateway, onComplete }) {
    const user = Auth.getUser();
    if (!user) {
      Toast.error('পেমেন্ট করার জন্য অনুগ্রহ করে লগইন করুন।');
      window.location.hash = '#/login';
      return;
    }
    if (gateway !== 'bKash') {
      Toast.error('এই পেমেন্ট পদ্ধতি এখনো চালু হয়নি।');
      return;
    }
    if (!items.length || items.some(item =>
      !['course', 'digital'].includes(item.type)
    )) {
      Toast.error('ম্যানুয়াল bKash পেমেন্টে শুধু কোর্স বা ডিজিটাল PDF কেনা যাবে।');
      return;
    }

    let paymentInfo;
    try {
      const response = await fetch('/api/payment-info', {
        credentials: 'same-origin'
      });
      paymentInfo = await response.json();
      if (!response.ok) {
        throw new Error(paymentInfo.error || 'পেমেন্ট তথ্য লোড করা যায়নি।');
      }
    } catch (error) {
      console.error('Could not load payment configuration:', error);
      Toast.error(error.message || 'পেমেন্ট তথ্য লোড করা যায়নি।');
      return;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
      0
    );
    const coupon = (couponCode || '').trim().toUpperCase();
    const couponRecord = coupon ? paymentInfo.coupons?.[coupon] : null;
    if (coupon && !couponRecord) {
      Toast.error('কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।');
      return;
    }
    let discount = 0;
    if (couponRecord?.discountPercent) {
      discount = Math.round(subtotal * couponRecord.discountPercent / 100);
      if (couponRecord.maxDiscount) discount = Math.min(discount, couponRecord.maxDiscount);
    } else if (couponRecord?.discountAmount) {
      discount = couponRecord.discountAmount;
    }
    const totalAmount = Math.max(0, subtotal - Math.min(subtotal, discount));
    if (totalAmount === 0) {
      try {
        const result = await this.submitOrder(items, coupon, null, null);
        const order = result.order;
        localStorage.removeItem('ja_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Toast.success(`ফ্রি কুপনের অর্ডার জমা হয়েছে (${order.id})। অ্যাডমিন অনুমোদন দিলে access চালু হবে।`);
        if (typeof onComplete === 'function') onComplete(order);
      } catch (error) {
        console.error('Could not redeem free course coupon:', error);
        Toast.error(error.message || 'কুপন ব্যবহার করা যায়নি।');
      }
      return;
    }

    if (!paymentInfo.bkashConfigured) {
      Toast.error('অ্যাডমিনের bKash পেমেন্ট নম্বর এখনো সেট করা হয়নি।');
      return;
    }

    this.openBkashModal(items, totalAmount, coupon, paymentInfo.bkashNumber, user, onComplete);
  },

  async submitOrder(items, couponCode, senderMobile, transactionId) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(({ id, type, quantity }) => ({ id, type, quantity })),
        couponCode,
        senderMobile,
        transactionId
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'পেমেন্ট অনুরোধ জমা করা যায়নি।');
    }
    return result;
  },

  openBkashModal(items, totalAmount, couponCode, bkashNumber, user, onComplete) {
    const content = `
      <div class="gateway-modal-box">
        <div class="bkash-header-bar">
          <h3 style="font-size: 1.35rem; font-weight: 800;">ম্যানুয়াল bKash পেমেন্ট</h3>
          <p style="font-size: 0.85rem; opacity: 0.9;">কোর্স অ্যাক্সেস অ্যাডমিন যাচাইয়ের পর চালু হবে</p>
        </div>
        <div style="padding: 1.5rem; text-align: center;">
          <div style="font-size: 1.75rem; font-weight: 800; color: #E2136E; margin-bottom: 1rem;">
            ${formatBDT(totalAmount)}
          </div>
          ${couponCode ? `<p>কুপন ${couponCode} প্রয়োগ করা হয়েছে।</p>` : ''}
          <p>এই নম্বরে Send Money করুন:</p>
          <p id="bkash-merchant-number" style="font-size: 1.25rem; font-weight: 800; margin: 0.5rem 0 1rem;"></p>
          <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
            <label class="form-label" for="bkash-sender-mobile">যে bKash নম্বর থেকে পাঠিয়েছেন *</label>
            <input type="tel" id="bkash-sender-mobile" class="form-input" placeholder="01XXXXXXXXX" required>
          </div>
          <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
            <label class="form-label" for="bkash-transaction-id">bKash TrxID *</label>
            <input type="text" id="bkash-transaction-id" class="form-input" maxlength="40" placeholder="যেমন: 8JH5K2ABCD" required>
          </div>
          <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 1rem;">
            এখানে কখনো bKash PIN বা OTP দেবেন না। পেমেন্ট যাচাই না হওয়া পর্যন্ত কোর্স লক থাকবে।
          </p>
          <button id="bkash-confirm-btn" class="btn btn-block" style="background: #E2136E; color: white; font-weight: 700; padding: 0.85rem;">
            পেমেন্ট জমা দিন
          </button>
        </div>
      </div>
    `;

    const modalInstance = Modal.open({
      title: 'bKash পেমেন্ট তথ্য',
      content,
      maxWidth: '440px'
    });
    document.getElementById('bkash-merchant-number').textContent = bkashNumber;
    document.getElementById('bkash-sender-mobile').value = user.mobile || '';

    document.getElementById('bkash-confirm-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('bkash-confirm-btn');
      const senderMobile = document.getElementById('bkash-sender-mobile').value.trim();
      const transactionId = document.getElementById('bkash-transaction-id').value.trim();
      if (!senderMobile || !/^[A-Za-z0-9-]{4,40}$/.test(transactionId)) {
        Toast.error('bKash নম্বর এবং সঠিক TrxID দিন।');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'জমা দেওয়া হচ্ছে...';
      try {
        const result = await this.submitOrder(
          items, couponCode, senderMobile, transactionId
        );
        const order = result.order;
        modalInstance.close();
        localStorage.removeItem('ja_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        Toast.success(`অর্ডার জমা হয়েছে (${order.id})। টাকা যাচাই হলে কোর্স বা PDF access চালু হবে।`);
        if (typeof onComplete === 'function') onComplete(order);
      } catch (error) {
        console.error('Could not submit manual bKash order:', error);
        Toast.error(error.message || 'অর্ডার জমা করা যায়নি।');
        btn.disabled = false;
        btn.innerText = 'পেমেন্ট জমা দিন';
      }
    });
  }
};
