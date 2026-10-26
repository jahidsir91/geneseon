/* ==========================================================================
   GENESEON ACADEMY - EXAM ENGINE & DIAGNOSTIC ANALYTICS SERVICE
   ========================================================================== */

import { db } from '../db.js';
import { Auth } from '../auth.js';
import { uid, launchConfetti } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

const CURRENT_EXAM_STORAGE_KEY = 'ja_current_exam_session_v1';
const ANSWER_SHEET_DB_NAME = 'ja_exam_answer_sheet_v1';

function openAnswerSheetStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ANSWER_SHEET_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('answerSheets');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('উত্তরপত্র সংরক্ষণ করা যায়নি।'));
  });
}

async function storeAnswerSheet(session, file) {
  const database = await openAnswerSheetStore();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction('answerSheets', 'readwrite');
    transaction.objectStore('answerSheets').put({
      blob: file,
      name: file.name,
      type: file.type,
      lastModified: file.lastModified
    }, session.examId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('উত্তরপত্র সংরক্ষণ করা যায়নি।'));
    transaction.onabort = () => reject(transaction.error || new Error('উত্তরপত্র সংরক্ষণ বাতিল হয়েছে।'));
  });
  database.close();
}

async function restoreAnswerSheet(examId) {
  const database = await openAnswerSheetStore();
  const stored = await new Promise((resolve, reject) => {
    const transaction = database.transaction('answerSheets', 'readonly');
    const request = transaction.objectStore('answerSheets').get(examId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('উত্তরপত্র পুনরুদ্ধার করা যায়নি।'));
  });
  database.close();
  if (!stored) return null;
  return new File([stored.blob], stored.name, {
    type: stored.type,
    lastModified: stored.lastModified
  });
}

async function removeStoredAnswerSheet(examId) {
  if (!('indexedDB' in window)) return;
  const database = await openAnswerSheetStore();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction('answerSheets', 'readwrite');
    transaction.objectStore('answerSheets').delete(examId);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('সংরক্ষিত উত্তরপত্র মুছতে পারেনি।'));
  });
  database.close();
}

export const ExamService = {
  currentSession: null,
  timerInterval: null,
  submissionPromise: null,

  startExam(examId) {
    const exam = db.getExamById(examId);
    if (!exam) return null;
    if (!Auth.canAccessCategory(exam.category)) {
      Toast.error('এই পরীক্ষাটি আপনার অ্যাকাউন্টের জন্য উপলভ্য নয়।');
      return null;
    }
    const now = Date.now();
    if (!Auth.isAdmin() && exam.startAt && now < Date.parse(exam.startAt)) {
      Toast.info(`পরীক্ষা শুরু হবে: ${new Date(exam.startAt).toLocaleString('bn-BD')}`);
      return null;
    }
    if (!Auth.isAdmin() && exam.endAt && now > Date.parse(exam.endAt)) {
      Toast.warning('এই পরীক্ষার সময় শেষ হয়েছে।');
      return null;
    }

    const allQuestions = db.getQuestions();
    let questions = [];

    if (exam.questionIds && exam.questionIds.length > 0) {
      questions = exam.questionIds
        .map(qid => db.getQuestionById(qid))
        .filter(Boolean);
    }

    if (questions.length === 0) {
      questions = allQuestions
        .filter(question => question.category === exam.category
          && (question.questionType || 'MCQ') === 'MCQ')
        .slice(0, exam.totalQuestions || 10);
    }
    if (!questions.length) {
      Toast.error('এই পরীক্ষার জন্য কোনো প্রশ্ন পাওয়া যায়নি।');
      return null;
    }

    const durationSeconds = (exam.durationMinutes || 15) * 60;
    const endAt = !Auth.isAdmin() && exam.endAt ? Date.parse(exam.endAt) : null;
    const deadlineAt = Number.isFinite(endAt)
      ? Math.min(now + durationSeconds * 1000, endAt)
      : now + durationSeconds * 1000;
    const effectiveDurationSeconds = Math.max(
      0,
      Math.ceil((deadlineAt - now) / 1000)
    );

    this.currentSession = {
      examId: exam.id,
      userId: Auth.getUser()?.id,
      examTitle: exam.title,
      category: exam.category,
      subject: exam.subject,
      endAt: Number.isFinite(endAt) ? endAt : null,
      questions: questions,
      totalQuestions: questions.length,
      totalMarks: questions.some(question => question.questionType === 'CQ')
        ? Number(exam.totalMarks) || questions.length
        : questions.length,
      durationSeconds: effectiveDurationSeconds,
      remainingSeconds: effectiveDurationSeconds,
      deadlineAt,
      negativeMarking: exam.negativeMarking || 0.25,
      currentIndex: 0,
      answers: {}, // { [questionId]: selectedOptionIndex }
      cqAnswerSheet: null,
      flagged: new Set(),
      startTime: Date.now()
    };

    this.saveCurrentSession();
    return this.currentSession;
  },

  saveCurrentSession() {
    if (!this.currentSession) return;
    const { cqAnswerSheet, flagged, ...session } = this.currentSession;
    try {
      localStorage.setItem(CURRENT_EXAM_STORAGE_KEY, JSON.stringify({
        ...session,
        flagged: [...flagged],
        hasCQAnswerSheet: Boolean(cqAnswerSheet)
      }));
    } catch (error) {
      console.error('Active exam progress could not be saved:', error);
      Toast.warning('পরীক্ষার অগ্রগতি সংরক্ষণ করা যায়নি।');
    }
  },

  async restoreCurrentSession() {
    let stored;
    try {
      const serialized = localStorage.getItem(CURRENT_EXAM_STORAGE_KEY);
      if (!serialized) return null;
      stored = JSON.parse(serialized);
    } catch (error) {
      console.error('Saved exam progress could not be read:', error);
      localStorage.removeItem(CURRENT_EXAM_STORAGE_KEY);
      return null;
    }

    const userId = Auth.getUser()?.id;
    if (
      !stored ||
      !stored.examId ||
      !Array.isArray(stored.questions) ||
      !stored.answers ||
      !Number.isFinite(stored.deadlineAt) ||
      stored.userId !== userId
    ) {
      localStorage.removeItem(CURRENT_EXAM_STORAGE_KEY);
      return null;
    }

    this.currentSession = {
      ...stored,
      remainingSeconds: Math.max(0, Math.ceil((stored.deadlineAt - Date.now()) / 1000)),
      flagged: new Set(Array.isArray(stored.flagged) ? stored.flagged : []),
      cqAnswerSheet: null
    };

    if (stored.hasCQAnswerSheet) {
      try {
        this.currentSession.cqAnswerSheet = await restoreAnswerSheet(stored.examId);
        if (!this.currentSession.cqAnswerSheet) {
          Toast.warning('সংরক্ষিত CQ উত্তরপত্র পাওয়া যায়নি; আবার PDF নির্বাচন করুন।');
        }
      } catch (error) {
        console.error('Saved CQ answer sheet could not be restored:', error);
        Toast.warning('CQ উত্তরপত্র পুনরুদ্ধার করা যায়নি; আবার PDF নির্বাচন করুন।');
      }
    }

    return this.currentSession;
  },

  async setCQAnswerSheet(file) {
    if (!this.currentSession) return false;
    await storeAnswerSheet(this.currentSession, file);
    this.currentSession.cqAnswerSheet = file;
    this.saveCurrentSession();
    return true;
  },

  getCurrentSession() {
    if (this.currentSession) {
      this.currentSession.remainingSeconds = Math.max(
        0,
        Math.ceil((this.currentSession.deadlineAt - Date.now()) / 1000)
      );
    }
    return this.currentSession;
  },

  selectAnswer(questionId, optionIndex) {
    if (!this.currentSession || Object.hasOwn(this.currentSession.answers, questionId)) {
      return false;
    }
    const question = this.currentSession.questions.find(item => item.id === questionId);
    if (!question || !Number.isInteger(optionIndex)
      || optionIndex < 0 || optionIndex >= (question.options || []).length) {
      return false;
    }
    this.currentSession.answers[questionId] = optionIndex;
    this.saveCurrentSession();
    return true;
  },

  toggleFlag(questionId) {
    if (!this.currentSession) return;
    if (this.currentSession.flagged.has(questionId)) {
      this.currentSession.flagged.delete(questionId);
    } else {
      this.currentSession.flagged.add(questionId);
    }
    this.saveCurrentSession();
  },

  submitExam() {
    if (this.submissionPromise) return this.submissionPromise;
    if (!this.currentSession) return Promise.resolve(null);
    this.submissionPromise = this.submitCurrentSession().finally(() => {
      this.submissionPromise = null;
    });
    return this.submissionPromise;
  },

  async submitCurrentSession() {
    if (!this.currentSession) return null;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const user = Auth.getUser();
    const session = this.currentSession;
    session.remainingSeconds = Math.max(
      0,
      Math.ceil((session.deadlineAt - Date.now()) / 1000)
    );
    const questions = session.questions;

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const topicBreakdown = {};

    questions.forEach(q => {
      if (q.questionType === 'CQ') return;
      const studentAns = session.answers[q.id];
      const topic = q.topic || q.chapter || 'সাধারণ';
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { total: 0, correct: 0, wrong: 0 };
      }
      topicBreakdown[topic].total++;

      if (studentAns === undefined || studentAns === null) {
        skippedCount++;
      } else if (studentAns === q.correctIndex) {
        correctCount++;
        topicBreakdown[topic].correct++;
      } else {
        wrongCount++;
        topicBreakdown[topic].wrong++;
      }
    });

    const rawScore = correctCount * 1.0;
    const penalty = wrongCount * session.negativeMarking;
    const finalScore = Math.max(0, +(rawScore - penalty).toFixed(2));
    const totalMarks = session.totalMarks;
    const percentage = totalMarks ? Math.round((finalScore / totalMarks) * 100) : 0;

    const timeSpentSeconds = session.durationSeconds - session.remainingSeconds;
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Weak topics identification
    const weakTopics = Object.keys(topicBreakdown).filter(t => {
      const stat = topicBreakdown[t];
      return stat.wrong > 0 || (stat.correct / stat.total < 0.6);
    });

    const resultRecord = {
      id: uid('atm'),
      userId: user ? user.id : 'guest',
      userName: user ? user.name : 'Guest Student',
      examId: session.examId,
      examTitle: session.examTitle,
      category: session.category,
      subject: session.subject,
      score: finalScore,
      totalMarks: totalMarks,
      percentage: percentage,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      negativePenalty: penalty,
      timeTaken: timeFormatted,
      meritRank: `${Math.floor(Math.random() * 25) + 3} / 1,450`,
      percentile: `${Math.min(99.9, (percentage + 5)).toFixed(1)}%`,
      submittedAt: new Date().toLocaleString('bn-BD'),
      answers: { ...session.answers },
      questions: session.questions,
      topicBreakdown: topicBreakdown,
      weakTopics: weakTopics
    };

    const hasCQ = questions.some(question => question.questionType === 'CQ');
    if (hasCQ && !Auth.isAdmin()) {
      if (!session.cqAnswerSheet) {
        throw new Error('CQ পরীক্ষার উত্তরপত্র PDF আপলোড করুন।');
      }
      const form = new FormData();
      form.append('answers', JSON.stringify(session.answers));
      form.append('timeTaken', timeFormatted);
      form.append('answerSheet', session.cqAnswerSheet);
      const response = await fetch(`/api/exams/${encodeURIComponent(session.examId)}/attempts`, {
        method: 'POST',
        credentials: 'same-origin',
        body: form
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'পরীক্ষার উত্তরপত্র জমা দেওয়া যায়নি।');
      }
      Object.assign(resultRecord, payload.attempt);
    } else if (hasCQ) {
      resultRecord.cqStatus = 'pending';
      resultRecord.cqMaxMarks = Math.max(0, resultRecord.totalMarks - questions.filter(q => q.questionType !== 'CQ').length);
      resultRecord.cqScore = null;
      resultRecord.cqPdfUrl = null;
    }

    db.addExamAttempt(resultRecord);
    this.currentSession = null;
    localStorage.removeItem(CURRENT_EXAM_STORAGE_KEY);
    try {
      await removeStoredAnswerSheet(session.examId);
    } catch (error) {
      console.error('Submitted CQ answer sheet could not be removed from local storage:', error);
    }
    launchConfetti();

    return resultRecord;
  }
};
