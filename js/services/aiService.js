/* ==========================================================================
   GENESEON ACADEMY - AI STUDY ASSISTANT SERVICE
   ========================================================================== */

import { Auth } from '../auth.js';

export const AiService = {
  getStudentContext() {
    const user = Auth.getUser();
    if (!user) return { type: 'GENERAL', label: 'General Knowledge & Studies' };
    return {
      type: user.educationType || 'GENERAL',
      label: user.batchOrTarget || (user.educationType ? `${user.educationType} Preparation` : 'General Studies'),
      userName: user.name
    };
  },

  async generateResponse(prompt, onChunk = null) {
    const response = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'AI উত্তর দিতে পারেনি।');
    }
    if (typeof result.answer !== 'string' || !result.answer.trim()) {
      throw new Error('AI থেকে সঠিক উত্তর পাওয়া যায়নি।');
    }
    if (onChunk) onChunk(result.answer);
    return result.answer;
  }
};
