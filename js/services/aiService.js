/* ==========================================================================
   GENESEON ACADEMY - AI STUDY ASSISTANT SERVICE
   ========================================================================== */

import { Auth } from '../auth.js';
import { db } from '../db.js';

const QUESTION_SEARCH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'by', 'for', 'from', 'how', 'in', 'is', 'of',
  'on', 'or', 'the', 'to', 'what', 'when', 'where', 'which', 'who', 'why',
  'একটি', 'এবং', 'কী', 'কি', 'কেন', 'কাকে', 'কোন', 'কোনটি', 'কিভাবে',
  'কীভাবে', 'কীসের', 'কত', 'কে', 'এর', 'ও', 'জানতে', 'চাই', 'বল',
  'বলো', 'দাও', 'দেখাও', 'আমাকে', 'আমার', 'হলো', 'হয়', 'হয়', 'হলে',
  'সম্পর্কে', 'ব্যাখ্যা', 'সমাধান', 'প্রশ্ন', 'প্রশ্নটার', 'প্রশ্নটি',
  'উত্তর', 'উত্তরটা'
]);

function questionSearchTokens(value) {
  return [...new Set(
    String(value || '')
      .normalize('NFKC')
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}]+/gu) || []
  )].filter(token =>
    !QUESTION_SEARCH_STOP_WORDS.has(token) &&
    (token.length > 1 || /^\d+$/.test(token))
  );
}

function getQuestionSearchText(question) {
  return [
    question.text,
    question.stimulus,
    question.subject,
    question.chapter,
    question.topic,
    question.board,
    question.year,
    question.options?.join(' '),
    question.explanation,
    question.answer,
    question.parts?.map(part => `${part.question || ''} ${part.answer || ''}`).join(' ')
  ].filter(Boolean).join(' ');
}

function findQuestionBankAnswers(prompt, category) {
  const query = prompt.trim().normalize('NFKC').toLocaleLowerCase();
  const tokens = questionSearchTokens(query);
  if (!tokens.length) return [];

  const matchesByQuestion = new Map();
  db.getQuestions()
    .filter(question => question.category === category)
    .map(question => {
      const searchableText = getQuestionSearchText(question);
      const normalizedText = searchableText.normalize('NFKC').toLocaleLowerCase();
      const normalizedQuestion = String(
        question.text || question.stimulus ||
        question.parts?.map(part => part.question).join(' ') || question.id
      ).normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      const matchedTokens = tokens.filter(token => normalizedText.includes(token));
      const coverage = matchedTokens.length / tokens.length;
      const exactMatch = normalizedText.includes(query);
      return {
        question,
        normalizedQuestion,
        score: exactMatch ? 1 : coverage,
        matchedCount: matchedTokens.length,
        queryTokenCount: tokens.length
      };
    })
    .filter(match =>
      match.score >= 0.65 &&
      (match.queryTokenCount === 1
        ? match.matchedCount === 1
        : match.matchedCount >= 2)
    )
    .forEach(match => {
      const existing = matchesByQuestion.get(match.normalizedQuestion);
      if (!existing || match.score > existing.score) {
        matchesByQuestion.set(match.normalizedQuestion, match);
      }
    });
  const matches = [...matchesByQuestion.values()]
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (!matches.length || (
    matches.length > 1 &&
    matches[0].score - matches[1].score > 0.25
  )) {
    return matches.slice(0, 1).map(match => match.question);
  }
  return matches.map(match => match.question);
}

function formatQuestionBankAnswer(question, index) {
  const type = question.questionType || 'MCQ';
  const heading = question.subject
    ? `${question.subject}${question.chapter ? ` • ${question.chapter}` : ''}`
    : question.chapter || question.category;
  const answer = type === 'CQ'
    ? (question.parts || [])
      .filter(part => part.answer)
      .map(part => `- **${part.label || ''} ${part.question || ''}**\n  ${part.answer}`)
      .join('\n') || 'প্রশ্নব্যাংকে এই CQ-এর নমুনা উত্তর যোগ করা হয়নি।'
    : type === 'WRITTEN'
      ? question.answer || question.explanation || 'প্রশ্নব্যাংকে এই প্রশ্নের উত্তর যোগ করা হয়নি।'
      : `**সঠিক উত্তর:** ${question.options?.[question.correctIndex] || 'উত্তর পাওয়া যায়নি।'}${
        Number.isInteger(question.correctIndex)
          ? ` (${['ক', 'খ', 'গ', 'ঘ'][question.correctIndex] || question.correctIndex + 1})`
          : ''
      }\n\n**ব্যাখ্যা:** ${question.explanation || 'এই প্রশ্নের ব্যাখ্যা প্রশ্নব্যাংকে যোগ করা হয়নি।'}`;

  const questionText = type === 'CQ'
    ? question.stimulus || (question.parts || []).map(part => part.question).join(' ')
    : question.text;
  return `### ${index + 1}. ${heading || 'প্রশ্নব্যাংকের প্রশ্ন'}\n**প্রশ্ন:** ${questionText || ''}\n\n${answer}`;
}

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

  /**
   * Answers from the question bank first, then uses Gemini for multilingual queries.
   */
  async generateResponse(prompt, onChunk = null) {
    const ctx = this.getStudentContext();
    if (ctx.type !== 'GENERAL') {
      await Auth.refreshContent();
      const questionBankMatches = findQuestionBankAnswers(prompt, ctx.type);
      if (questionBankMatches.length) {
        const reply = `### 📚 প্রশ্নব্যাংক থেকে উত্তর\n\n${questionBankMatches
        .map(formatQuestionBankAnswer)
          .join('\n\n---\n\n')}\n\n*উত্তরটি তোমার বিভাগের প্রশ্নব্যাংকের সংরক্ষিত তথ্য থেকে নেওয়া হয়েছে।*`;
        if (onChunk) onChunk(reply);
        return reply;
      }
    }

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
