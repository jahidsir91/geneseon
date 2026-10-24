/* ==========================================================================
   GENESEON ACADEMY - AI STUDY ASSISTANT VIEW (CHATGPT-STYLE)
   ========================================================================== */

import { Auth } from '../auth.js';
import { AiService } from '../services/aiService.js';
import { icons } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

let messages = [];

export const AiView = {
  render(initialPrompt = null) {
    const ctx = AiService.getStudentContext();

    if (messages.length === 0) {
      messages.push({
        sender: 'ai',
        text: `👋 **স্বাগতম!** আমি তোমার **জেনেসিওন একাডেমি এআই স্টাডি অ্যাসিস্ট্যান্ট**।

বর্তমানে আমি তোমার **${ctx.label}** সিলেবাস অনুযায়ী যেকোনো প্রশ্নের সমাধান, কঠিন টপিকের সহজ ব্যাখ্যা, পড়ার রুটিন কিংবা কুইজ তৈরিতে সাহায্য করতে প্রস্তুত।

নিচের যেকোনো কুইক অপশন বেছে নাও অথবা সরাসরি তোমার প্রশ্নটি লিখে পাঠাও!`
      });
    }

    // Auto-trigger if initialPrompt was passed via URL query
    if (initialPrompt && !messages.some(m => m.text === initialPrompt)) {
      setTimeout(() => {
        window.sendAiMessage(initialPrompt);
      }, 200);
    }

    return `
      <div class="ai-chat-layout">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-title-wrap">
            <div class="ai-sparkle-avatar">
              ${icons.sparkles}
            </div>
            <div>
              <h2 style="font-size: 1.15rem; margin-bottom: 0.15rem;">জেনেসিওন একাডেমি এআই স্টাডি অ্যাসিস্ট্যান্ট</h2>
              <span class="badge badge-${ctx.type.toLowerCase()}">${ctx.label}</span>
            </div>
          </div>

          <button class="btn btn-ghost btn-sm" onclick="window.clearAiChat()">
            ${icons.trash} চ্যাট মুছুন
          </button>
        </div>

        <!-- Chat Messages Container -->
        <div class="ai-chat-messages" id="ai-chat-box">
          ${messages.map(m => `
            <div class="chat-msg ${m.sender}">
              <div class="chat-avatar">
                ${m.sender === 'user' ? icons.user : icons.sparkles}
              </div>
              <div class="chat-bubble">
                ${formatAiText(m.text)}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Action Pills -->
        <div class="ai-quick-pills">
          <button class="quick-pill" onclick="window.sendAiMessage('নিউটনের ৩য় গতিসূত্র বাস্তব উদাহরণসহ বাংলায় বুঝিয়ে দাও')">💡 বিষয় বুঝিয়ে দাও</button>
          <button class="quick-pill" onclick="window.sendAiMessage('একটি গাড়ি ২ m/s² সুষম ত্বরণে ১০ সেকেন্ডে কত দূরত্ব যাবে সমাধান করো')">🔍 অঙ্ক সমাধান</button>
          <button class="quick-pill" onclick="window.sendAiMessage('আমার জন্য গুরুত্বপূর্ণ ৫টি স্পেশাল প্র্যাকটিস MCQ দাও')">🎯 স্পেশাল MCQ</button>
          <button class="quick-pill" onclick="window.sendAiMessage('আমার পরীক্ষার জন্য ৭ দিনের একটি কার্যকরী পড়ার রুটিন দাও')">📅 পড়ার রুটিন</button>
          <button class="quick-pill" onclick="window.sendAiMessage('বাংলাদেশের সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদগুলো বুঝিয়ে দাও')">🏛️ সংবিধান অনুচ্ছেদ</button>
        </div>

        <!-- Chat Input Form -->
        <form class="ai-input-form" onsubmit="window.handleAiSubmit(event)">
          <input type="text" id="ai-user-input" class="ai-input-field" placeholder="বাংলা, English বা Banglish-এ পড়াশোনার প্রশ্ন লিখুন..." autocomplete="off">
          <button type="submit" class="btn btn-primary" style="border-radius: var(--radius-lg); padding: 0.6rem 1.25rem;">
            ${icons.send}
          </button>
        </form>
      </div>
    `;
  }
};

function formatAiText(text) {
  if (!text) return '';
  const safeText = text.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  let html = safeText
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; margin: 0.5rem 0; color: var(--primary);">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 style="font-size: 1rem; margin: 0.35rem 0;">$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^&gt; (.*$)/gim, '<blockquote style="border-left: 3px solid var(--primary); padding-left: 0.75rem; margin: 0.5rem 0; color: var(--text-muted);">$1</blockquote>')
    .replace(/\n/gim, '<br>');
  return html;
}

window.handleAiSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('ai-user-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  window.sendAiMessage(text);
};

window.sendAiMessage = async (text) => {
  messages.push({ sender: 'user', text: text });
  
  const chatBox = document.getElementById('ai-chat-box');
  if (chatBox) {
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'chat-msg user';
    userMsgEl.innerHTML = `
      <div class="chat-avatar">${icons.user}</div>
      <div class="chat-bubble">${formatAiText(text)}</div>
    `;
    chatBox.appendChild(userMsgEl);

    // AI typing bubble
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-msg ai';
    aiMsgEl.innerHTML = `
      <div class="chat-avatar">${icons.sparkles}</div>
      <div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>
    `;
    chatBox.appendChild(aiMsgEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const reply = await AiService.generateResponse(text, (answer) => {
        const bubble = aiMsgEl.querySelector('.chat-bubble');
        if (bubble) bubble.innerHTML = formatAiText(answer);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
      messages.push({ sender: 'ai', text: reply });
    } catch (error) {
      const errorMessage = `উত্তর তৈরি করা যায়নি: ${error.message}`;
      const bubble = aiMsgEl.querySelector('.chat-bubble');
      if (bubble) bubble.textContent = errorMessage;
      messages.push({ sender: 'ai', text: errorMessage });
      Toast.error(error.message);
    }
  }
};

window.clearAiChat = () => {
  messages = [];
  Toast.info('চ্যাট হিস্ট্রি মুছে ফেলা হয়েছে');
  const content = document.getElementById('main-content');
  if (content) content.innerHTML = AiView.render();
};
