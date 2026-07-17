'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ArrowLeft, ArrowRight, BookOpen, FileText,
  HelpCircle, Check, X, Award, MousePointerClick, Star,
  Shuffle, RotateCcw, Play, Layers, Type, Gamepad2
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './viewer.css';

type Badge = { id: string; title: string; icon: string; color: string; badge_type: string; quiz_item_id: string | null; image_url: string | null };

type QuizOption = { id: string; text: string; is_correct: boolean; order_index: number };
type QuizQuestion = { id: string; question: string; order_index: number; options: QuizOption[] };
type ChapterItem = { id: string; type: 'lesson' | 'quiz'; title: string; content: string; order_index: number; questions?: QuizQuestion[]; quiz_type?: 'classic' | 'connect' | 'truefalse' | 'memory' | 'scrambled' };
type Chapter = { id: string; title: string; description: string; order_index: number; items: ChapterItem[] };

const ConfettiEffect = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string; size: number; delay: number; duration: number; dx: number; shape: 'circle' | 'square' | 'triangle' }>>([]);

  useEffect(() => {
    const colors = ['#29b6f6', '#4ade80', '#fbbf24', '#f43f5e', '#a855f7', '#ec4899'];
    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
    const newParticles = Array.from({ length: 140 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 9 + 6,
      delay: Math.random() * 1.6,
      duration: Math.random() * 2 + 2.6,
      dx: (Math.random() - 0.5) * 240,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-canvas-overlay">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--dx' as any]: `${p.dx}px`,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
            borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
          }}
        />
      ))}
    </div>
  );
};

const CourseViewerPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<{ chapterId: string; itemId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [courseBadges, setCourseBadges] = useState<Badge[]>([]);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [classicCurrentQIdx, setClassicCurrentQIdx] = useState(0);

  // Quiz minigames state
  const [gameMode, setGameMode] = useState<'classic' | 'connect' | 'truefalse' | 'memory' | 'scrambled'>('classic');

  // Connect pairs state
  const [connectQuestions, setConnectQuestions] = useState<Array<{ id: string; text: string }>>([]);
  const [connectAnswers, setConnectAnswers] = useState<Array<{ id: string; text: string; qId: string }>>([]);
  const [selectedConnectQ, setSelectedConnectQ] = useState<string | null>(null);
  const [selectedConnectA, setSelectedConnectA] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [failedPairs, setFailedPairs] = useState<Set<string>>(new Set());
  const [connectGameActive, setConnectGameActive] = useState(false);

  // True/False run state
  const [tfStatements, setTfStatements] = useState<Array<{ qId: string; question: string; optionText: string; isCorrect: boolean }>>([]);
  const [tfCurrentIdx, setTfCurrentIdx] = useState(0);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});
  const [tfGameActive, setTfGameActive] = useState(false);

  // Memory game state
  type MemoryCard = { id: string; qId: string; type: 'question' | 'answer'; text: string; isFlipped: boolean; isMatched: boolean };
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedMemoryCards, setSelectedMemoryCards] = useState<number[]>([]);
  const [memoryGameActive, setMemoryGameActive] = useState(false);

  // Scrambled letters state
  const [scrambledCurrentQIdx, setScrambledCurrentQIdx] = useState(0);
  const [scrambledSelectedChars, setScrambledSelectedChars] = useState<Array<{ char: string; poolIndex: number }>>([]);
  const [scrambledPool, setScrambledPool] = useState<string[]>([]);
  const [scrambledAnswers, setScrambledAnswers] = useState<Record<string, string>>({});
  const [scrambledGameActive, setScrambledGameActive] = useState(false);

  // Completed items tracker state
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(new Set());

  // Custom enrollment and finalization states
  const [hasPastProgress, setHasPastProgress] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  // Star rating / feedback
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [existingRating, setExistingRating] = useState(0);

  const loadProgress = async () => {
    if (!user || !courseId) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`);
      if (res.ok) {
        const { completedItemIds } = await res.json();
        setCompletedItemIds(new Set(completedItemIds));
      }
    } catch (err: any) {
      console.error('Error loading progress:', err?.message || err);
    }
  };

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error('Eroare la încărcarea cursului.');
      const course = await res.json();

      setCourseTitle(course.title);
      setCourseDesc(course.description || '');
      setChapters(course.chapters || []);

      // Auto-expand first chapter & select first item
      if (course.chapters && course.chapters.length > 0) {
        setExpanded(new Set([course.chapters[0].id]));
        if (course.chapters[0].items && course.chapters[0].items.length > 0) {
          setSelectedItem({ chapterId: course.chapters[0].id, itemId: course.chapters[0].items[0].id });
        }
      }
    } catch (err: any) {
      console.error('Error loading course:', err?.message || err);
    }
    setLoading(false);
  };

  // Check enrollment and load progress
  useEffect(() => {
    if (user && courseId) {
      checkEnrollment();
      loadProgress();
    }
  }, [user, courseId]);
  // Automatically mark progress when user views a lesson (only if enrolled)
  useEffect(() => {
    if (selectedItem && user && isEnrolled) {
      const current = allItems.find(i => i.id === selectedItem.itemId);
      if (current && current.type === 'lesson') {
        markProgress(current.id, selectedItem.chapterId);
      }
    }
  }, [selectedItem, user, isEnrolled, chapters]);

  // Reset expanded chapters when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setExpanded(new Set());
    }
  }, [sidebarCollapsed]);

  // Reset minigames state when selected item changes
  useEffect(() => {
    const current = selectedItem ? allItems.find(i => i.id === selectedItem.itemId) : null;
    const initialMode = (current && current.type === 'quiz' ? current.quiz_type : 'classic') || 'classic';
    setGameMode(initialMode);

    setClassicCurrentQIdx(0);

    setSelectedConnectQ(null);
    setSelectedConnectA(null);
    setMatchedPairs(new Set());
    setFailedPairs(new Set());
    setConnectGameActive(false);

    setTfStatements([]);
    setTfCurrentIdx(0);
    setTfAnswers({});
    setTfGameActive(false);

    setMemoryCards([]);
    setSelectedMemoryCards([]);
    setMemoryGameActive(false);

    setScrambledCurrentQIdx(0);
    setScrambledSelectedChars([]);
    setScrambledPool([]);
    setScrambledAnswers({});
    setScrambledGameActive(false);
  }, [selectedItem]);

  // Auto-initialize game data when selectedItem or gameMode changes
  useEffect(() => {
    const current = selectedItem ? allItems.find(i => i.id === selectedItem.itemId) : null;
    if (current && current.type === 'quiz') {
      if (gameMode === 'connect') {
        const questions = current.questions?.map(q => ({ id: q.id, text: q.question })) || [];
        const answers = current.questions?.map(q => {
          const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
          return { id: correctOpt.id, text: correctOpt.text, qId: q.id };
        }) || [];
        setConnectQuestions([...questions].sort(() => Math.random() - 0.5));
        setConnectAnswers([...answers].sort(() => Math.random() - 0.5));
      } else if (gameMode === 'truefalse') {
        const statements = current.questions?.map(q => {
          const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
          const isTrueCorrect = correctOpt ? (correctOpt.text.toLowerCase().trim() === 'adevărat') : true;
          return { qId: q.id, question: q.question, optionText: correctOpt.text, isCorrect: isTrueCorrect };
        }) || [];
        setTfStatements([...statements].sort(() => Math.random() - 0.5));
      } else if (gameMode === 'memory') {
        const cards: MemoryCard[] = [];
        current.questions?.forEach(q => {
          const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
          cards.push({
            id: q.id + '-q',
            qId: q.id,
            type: 'question',
            text: q.question,
            isFlipped: false,
            isMatched: false
          });
          cards.push({
            id: correctOpt.id + '-a',
            qId: q.id,
            type: 'answer',
            text: correctOpt.text,
            isFlipped: false,
            isMatched: false
          });
        });
        setMemoryCards([...cards].sort(() => Math.random() - 0.5));
      }
    }
  }, [selectedItem, gameMode, chapters]);

  const checkEnrollment = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`);
      if (res.ok) {
        const data = await res.json();
        setIsEnrolled(data.isEnrolled);
        setHasPastProgress(data.hasPastProgress);
      }
    } catch (err: any) {
      console.error('Error checking enrollment:', err?.message || err);
    }
  };

  const handleEnroll = async () => {
    if (!user) return;
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
      if (res.ok) setIsEnrolled(true);
    } catch (err: any) {
      console.error('Enrollment error:', err?.message || err);
    }
    setEnrolling(false);
  };

  const handleEnrollFromScratch = async () => {
    if (!user) return;
    setEnrolling(true);
    try {
      await fetch(`/api/courses/${courseId}/progress`, { method: 'DELETE' });
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
      if (res.ok) {
        setIsEnrolled(true);
        setCompletedItemIds(new Set());
        setHasPastProgress(false);
        setShowResumeModal(false);
      }
    } catch (err: any) {
      console.error('Error starting from scratch:', err?.message || err);
    }
    setEnrolling(false);
  };

  const handleEnrollAndContinue = async () => {
    if (!user) return;
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
      if (res.ok) {
        setIsEnrolled(true);
        setShowResumeModal(false);
        await loadProgress();
      }
    } catch (err: any) {
      console.error('Error resuming course:', err?.message || err);
    }
    setEnrolling(false);
  };

  const handleFinalizeAndUnenroll = async () => {
    if (!user) return;
    try {
      if (feedbackRating > 0) {
        await fetch(`/api/courses/${courseId}/rating`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: feedbackRating })
        });
      }

      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'DELETE' });
      if (res.ok) {
        setIsEnrolled(false);
        setShowCompletionModal(false);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Error finalizing course:', err?.message || err);
    }
  };

  // Submit rating without finalizing
  const submitRating = async () => {
    if (!user || feedbackRating === 0) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: feedbackRating })
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
        setExistingRating(feedbackRating);
      }
    } catch (err: any) {
      console.error('Error submitting rating:', err?.message || err);
    }
  };

  // Load existing rating
  useEffect(() => {
    const loadExistingRating = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/courses/${courseId}/rating`);
        if (res.ok) {
          const data = await res.json();
          if (data.rating !== null) {
            setExistingRating(data.rating);
            setFeedbackRating(data.rating);
            setFeedbackSubmitted(true);
          }
        }
      } catch (err: any) {
        console.error('Error loading rating:', err?.message || err);
      }
    };
    loadExistingRating();
  }, [user, courseId]);

  // Keyboard support for True/False
  useEffect(() => {
    if (gameMode !== 'truefalse' || !tfGameActive || submitted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleTfSelection(true); // Left or A/a for True
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleTfSelection(false); // Right or D/d for False
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, tfGameActive, tfCurrentIdx, tfStatements, submitted]);

  const handleUnenroll = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'DELETE' });
      if (res.ok) {
        setIsEnrolled(false);
        setShowUnenrollModal(false);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Error unenrolling from course:', err?.message || err);
    }
  };

  // Load badges for this course
  useEffect(() => {
    if (courseId) loadBadges();
  }, [courseId]);

  const loadBadges = async () => {
    try {
      const res = await fetch('/api/badges');
      if (res.ok) {
        const { badges } = await res.json();
        const courseBadges = badges.filter((b: any) => b.course_id === courseId);
        setCourseBadges(courseBadges);
      }
    } catch (err: any) {
      console.error('Error loading badges:', err?.message || err);
    }
  };

  // Get all items flat for navigation
  const allItems = chapters.flatMap(ch => ch.items.map(i => ({ ...i, chapterId: ch.id })));
  const currentIdx = selectedItem ? allItems.findIndex(i => i.id === selectedItem.itemId) : -1;

  const goToItem = async (idx: number) => {
    if (idx >= 0 && idx < allItems.length) {
      const item = allItems[idx];
      setSelectedItem({ chapterId: item.chapterId, itemId: item.id });
      setExpanded(prev => new Set(prev).add(item.chapterId));
      setAnswers({});
      setSubmitted(false);
    }
  };

  const markProgress = async (itemId: string, chapterId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, itemId })
      });
      if (res.ok) {
        setCompletedItemIds(prev => {
          const next = new Set(prev);
          next.add(itemId);
          return next;
        });
      }
    } catch (err: any) {
      console.error('Error saving progress', err?.message || err);
    }
  };

  // Trigger Course Complete badge the moment progress hits 100%
  useEffect(() => {
    const checkCourseComplete = async () => {
      if (!user || allItems.length === 0) return;
      if (completedItemIds.size === allItems.length) {
        const courseBadge = courseBadges.find(b => b.badge_type === 'course_complete');
        if (courseBadge) {
          const res = await fetch('/api/badges/award', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ badgeId: courseBadge.id })
          });
          if (res.ok) {
            setEarnedBadge(courseBadge);
          }
        }
      }
    };
    checkCourseComplete();
  }, [completedItemIds.size, allItems.length, courseBadges, user]);

  const getCurrentItem = () => {
    if (!selectedItem) return null;
    const ch = chapters.find(c => c.id === selectedItem.chapterId);
    if (!ch) return null;
    return ch.items.find(i => i.id === selectedItem.itemId) || null;
  };

  const currentItem = getCurrentItem();

  const currentChapter = chapters.find(ch => ch.id === selectedItem?.chapterId);
  const isCurrentChapterCompleted = currentChapter 
    ? currentChapter.items.length > 0 && currentChapter.items.every(item => completedItemIds.has(item.id))
    : false;

  const handleQuizSubmit = async () => {
    setSubmitted(true);
    if (!user || !currentItem) return;

    const { correct, total } = getScoreFromItem(currentItem);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Save quiz attempt
    try {
      const res = await fetch(`/api/courses/${courseId}/quiz-attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: currentItem.id, score: correct, total, percentage })
      });

      // Check for quiz progress and badge if passed (>= 50%)
      if (percentage >= 50 && selectedItem && res.ok) {
        await markProgress(currentItem.id, selectedItem.chapterId);

        const quizBadge = courseBadges.find(b => b.badge_type === 'quiz_complete' && b.quiz_item_id === currentItem.id);
        if (quizBadge) {
          const awardRes = await fetch('/api/badges/award', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ badgeId: quizBadge.id })
          });
          if (awardRes.ok) {
            setEarnedBadge(quizBadge);
          }
        }
      }
    } catch (err: any) {
      console.error('Error saving quiz attempt:', err?.message || err);
    }
  };

  const getScoreFromItem = (item: ChapterItem) => {
    if (!item?.questions) return { correct: 0, total: 0 };
    let correct = 0;
    item.questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(o => o.is_correct);
      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) correct++;
    });
    return { correct, total: item.questions.length };
  };

  const handleMinigameSubmit = async (finalAnswers: Record<string, string>) => {
    setSubmitted(true);
    if (!user || !currentItem) return;

    let correct = 0;
    const total = currentItem.questions?.length || 0;
    if (currentItem.questions) {
      currentItem.questions.forEach(q => {
        const selectedOptionId = finalAnswers[q.id];
        const correctOption = q.options.find(o => o.is_correct);
        if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) correct++;
      });
    }

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    try {
      const res = await fetch(`/api/courses/${courseId}/quiz-attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: currentItem.id, score: correct, total, percentage })
      });

      if (percentage >= 50 && selectedItem && res.ok) {
        await markProgress(currentItem.id, selectedItem.chapterId);
        const quizBadge = courseBadges.find(b => b.badge_type === 'quiz_complete' && b.quiz_item_id === currentItem.id);
        if (quizBadge) {
          const awardRes = await fetch('/api/badges/award', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ badgeId: quizBadge.id })
          });
          if (awardRes.ok) {
            setEarnedBadge(quizBadge);
          }
        }
      }
    } catch (err: any) {
      console.error('Error saving quiz attempt from minigame:', err);
    }
  };

  const initConnectGame = () => {
    if (!currentItem || !currentItem.questions) return;
    const questions = currentItem.questions.map(q => ({
      id: q.id,
      text: q.question
    }));
    
    const answers = currentItem.questions.map(q => {
      const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
      return {
        id: correctOpt.id,
        text: correctOpt.text,
        qId: q.id
      };
    });

    setConnectQuestions([...questions].sort(() => Math.random() - 0.5));
    setConnectAnswers([...answers].sort(() => Math.random() - 0.5));
    setSelectedConnectQ(null);
    setSelectedConnectA(null);
    setMatchedPairs(new Set());
    setFailedPairs(new Set());
    setConnectGameActive(false);
    setSubmitted(false);
  };

  const handleConnectCardClick = (id: string, type: 'q' | 'a') => {
    if (!connectGameActive) return;
    if (type === 'q') {
      if (matchedPairs.has(id)) return;
      setSelectedConnectQ(id === selectedConnectQ ? null : id);
    } else {
      const ans = connectAnswers.find(a => a.id === id);
      if (!ans || matchedPairs.has(ans.qId)) return;
      setSelectedConnectA(id === selectedConnectA ? null : id);
    }
  };

  useEffect(() => {
    if (selectedConnectQ && selectedConnectA) {
      const ans = connectAnswers.find(a => a.id === selectedConnectA);
      if (ans && ans.qId === selectedConnectQ) {
        const newMatched = new Set(matchedPairs);
        newMatched.add(selectedConnectQ);
        setMatchedPairs(newMatched);
        
        setSelectedConnectQ(null);
        setSelectedConnectA(null);

        if (currentItem && currentItem.questions && newMatched.size === currentItem.questions.length) {
          const newAnswers: Record<string, string> = {};
          currentItem.questions.forEach(q => {
            const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
            newAnswers[q.id] = correctOpt.id;
          });
          setAnswers(newAnswers);
          handleMinigameSubmit(newAnswers);
        }
      } else {
        const failedQ = selectedConnectQ;
        const newFailed = new Set(failedPairs);
        newFailed.add(failedQ);
        setFailedPairs(newFailed);

        setTimeout(() => {
          setFailedPairs(prev => {
            const next = new Set(prev);
            next.delete(failedQ);
            return next;
          });
          setSelectedConnectQ(null);
          setSelectedConnectA(null);
        }, 800);
      }
    }
  }, [selectedConnectQ, selectedConnectA]);

  const initTfGame = () => {
    if (!currentItem || !currentItem.questions) return;
    const statements = currentItem.questions.map(q => {
      const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
      const isCorrect = Math.random() > 0.5;
      
      let optionText = correctOpt.text;
      if (!isCorrect && q.options.length > 1) {
        const incorrectOpts = q.options.filter(o => !o.is_correct);
        if (incorrectOpts.length > 0) {
          optionText = incorrectOpts[Math.floor(Math.random() * incorrectOpts.length)].text;
        } else {
          optionText = correctOpt.text;
        }
      }

      const finalIsCorrect = optionText === correctOpt.text;

      return {
        qId: q.id,
        question: q.question,
        optionText,
        isCorrect: finalIsCorrect
      };
    });

    setTfStatements([...statements].sort(() => Math.random() - 0.5));
    setTfCurrentIdx(0);
    setTfAnswers({});
    setTfGameActive(false);
    setSubmitted(false);
  };

  const handleTfSelection = (judgment: boolean) => {
    if (!currentItem || !currentItem.questions || tfCurrentIdx >= tfStatements.length) return;
    const currentStmt = tfStatements[tfCurrentIdx];
    const isCorrectChoice = judgment === currentStmt.isCorrect;
    
    const updatedTfAnswers = {
      ...tfAnswers,
      [currentStmt.qId]: isCorrectChoice
    };
    setTfAnswers(updatedTfAnswers);

    if (tfCurrentIdx + 1 < tfStatements.length) {
      setTfCurrentIdx(tfCurrentIdx + 1);
    } else {
      const finalAnswers: Record<string, string> = {};
      currentItem.questions.forEach(q => {
        const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
        const incorrectOpt = q.options.find(o => !o.is_correct) || q.options[0];
        const wasJudgmentCorrect = updatedTfAnswers[q.id];
        
        finalAnswers[q.id] = wasJudgmentCorrect ? correctOpt.id : incorrectOpt.id;
      });
      setAnswers(finalAnswers);
      handleMinigameSubmit(finalAnswers);
    }
  };

  const initMemoryGame = () => {
    if (!currentItem || !currentItem.questions) return;
    const cards: MemoryCard[] = [];
    currentItem.questions.forEach(q => {
      const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
      cards.push({
        id: q.id + '-q',
        qId: q.id,
        type: 'question',
        text: q.question,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: correctOpt.id + '-a',
        qId: q.id,
        type: 'answer',
        text: correctOpt.text,
        isFlipped: false,
        isMatched: false
      });
    });

    setMemoryCards([...cards].sort(() => Math.random() - 0.5));
    setSelectedMemoryCards([]);
    setMemoryGameActive(false);
    setSubmitted(false);
  };

  const handleMemoryCardClick = (idx: number) => {
    if (!memoryGameActive) return;
    if (selectedMemoryCards.length >= 2 || memoryCards[idx].isFlipped || memoryCards[idx].isMatched) return;

    const nextCards = [...memoryCards];
    nextCards[idx].isFlipped = true;
    setMemoryCards(nextCards);

    const nextSelected = [...selectedMemoryCards, idx];
    setSelectedMemoryCards(nextSelected);

    if (nextSelected.length === 2) {
      const firstIdx = nextSelected[0];
      const secondIdx = nextSelected[1];
      const card1 = nextCards[firstIdx];
      const card2 = nextCards[secondIdx];

      if (card1.qId === card2.qId && card1.type !== card2.type) {
        setTimeout(() => {
          setMemoryCards(prev => {
            const current = [...prev];
            current[firstIdx].isMatched = true;
            current[secondIdx].isMatched = true;
            return current;
          });
          setSelectedMemoryCards([]);

          const allMatched = nextCards.every(c => c.isMatched || c.id === card1.id || c.id === card2.id);
          if (allMatched && currentItem && currentItem.questions) {
            const finalAnswers: Record<string, string> = {};
            currentItem.questions.forEach(q => {
              const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
              finalAnswers[q.id] = correctOpt.id;
            });
            setAnswers(finalAnswers);
            handleMinigameSubmit(finalAnswers);
          }
        }, 600);
      } else {
        setTimeout(() => {
          setMemoryCards(prev => {
            const current = [...prev];
            current[firstIdx].isFlipped = false;
            current[secondIdx].isFlipped = false;
            return current;
          });
          setSelectedMemoryCards([]);
        }, 1200);
      }
    }
  };

  const initScrambledGame = () => {
    if (!currentItem || !currentItem.questions || currentItem.questions.length === 0) return;
    setScrambledCurrentQIdx(0);
    setScrambledAnswers({});
    setScrambledSelectedChars([]);
    setScrambledGameActive(false);
    setSubmitted(false);
  };

  const startScrambledGame = () => {
    setScrambledGameActive(true);
    initScrambledPoolForIndex(0);
  };

  const initScrambledPoolForIndex = (qIdx: number) => {
    if (!currentItem || !currentItem.questions || qIdx >= currentItem.questions.length) return;
    const q = currentItem.questions[qIdx];
    const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
    const correctText = correctOpt.text.toUpperCase();
    
    const cleanChars = correctText.replace(/[^A-ZĂÂÎȘȚ]/gi, '').split('');
    const extraLetters = 'ABCDEFGHIJKLMNOPRSTUVZĂÂÎȘȚ';
    const extras: string[] = [];
    for (let i = 0; i < Math.max(3, 10 - cleanChars.length); i++) {
      extras.push(extraLetters[Math.floor(Math.random() * extraLetters.length)]);
    }

    const pool = [...cleanChars, ...extras].sort(() => Math.random() - 0.5);
    setScrambledPool(pool);
    setScrambledSelectedChars([]);
  };

  const handleScrambledPoolTileClick = (char: string, poolIndex: number) => {
    setScrambledSelectedChars(prev => [...prev, { char, poolIndex }]);
  };

  const handleScrambledSlotTileClick = (indexToRemove: number) => {
    setScrambledSelectedChars(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetScrambledSelection = () => {
    setScrambledSelectedChars([]);
  };

  const checkScrambledAnswer = () => {
    if (!currentItem || !currentItem.questions) return;
    const q = currentItem.questions[scrambledCurrentQIdx];
    const correctOpt = q.options.find(o => o.is_correct) || q.options[0];
    const correctTextClean = correctOpt.text.replace(/[^A-ZĂÂÎȘȚ]/gi, '').toUpperCase();
    const userTextClean = scrambledSelectedChars.map(c => c.char).join('').toUpperCase();

    const isCorrect = userTextClean === correctTextClean;
    const newScrambledAnswers = {
      ...scrambledAnswers,
      [q.id]: isCorrect ? correctOpt.id : 'wrong'
    };
    setScrambledAnswers(newScrambledAnswers);

    if (scrambledCurrentQIdx + 1 < currentItem.questions.length) {
      setScrambledCurrentQIdx(scrambledCurrentQIdx + 1);
      initScrambledPoolForIndex(scrambledCurrentQIdx + 1);
    } else {
      setAnswers(newScrambledAnswers);
      handleMinigameSubmit(newScrambledAnswers);
    }
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  if (loading) {
    return (
      <div className="course-viewer-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span style={{ color: '#64748b' }}>Se încarcă cursul...</span>
      </div>
    );
  }

  // Enrollment gate
  if (!isEnrolled) {
    const currentMascotUrl = showResumeModal ? '/images/resume-mascot.png' : '/images/courses-icon.png';

    return (
      <div className="course-viewer-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
        <div className="resume-modal-card glass-premium" style={{ width: '90%', maxWidth: 500 }}>
          <div className="resume-modal-watermark-wrapper">
            <img src={currentMascotUrl} alt="" className="resume-modal-watermark" />
          </div>

          {showResumeModal ? (
            <>
              <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 850, marginBottom: 14, textAlign: 'center' }}>
                Ai progres anterior la acest curs
              </h3>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 32, maxWidth: 400 }}>
                Am găsit lecții parcurse și teste susținute în trecut pentru <strong>{courseTitle}</strong>. Cum dorești să continui?
              </p>

              <div className="resume-modal-buttons" style={{ maxWidth: 280 }}>
                <button
                  onClick={handleEnrollAndContinue}
                  disabled={enrolling}
                  className="resume-btn-primary"
                >
                  Continui de unde am rămas
                </button>
                <button
                  onClick={handleEnrollFromScratch}
                  disabled={enrolling}
                  className="resume-btn-secondary"
                >
                  O iau de la început (șterge progresul vechi)
                </button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="resume-btn-text"
                >
                  Renunță
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>
                {courseTitle}
              </h3>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 32, maxWidth: 400 }}>
                {courseDesc || 'Înscrie-te la acest curs pentru a accesa conținutul.'}
              </p>

              <div className="resume-modal-buttons" style={{ maxWidth: 280 }}>
                <button
                  onClick={() => hasPastProgress ? setShowResumeModal(true) : handleEnroll()}
                  disabled={enrolling}
                  className="resume-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  <Award size={18} />
                  {enrolling ? 'Se înscrie...' : 'Înscrie-te la Curs'}
                </button>
                <button
                  onClick={() => router.push('/courses')}
                  className="resume-btn-text"
                  style={{ marginTop: 8 }}
                >
                  ← Înapoi la Cursuri
                </button>
              </div>
            </>
          )}

          <img src={currentMascotUrl} alt="Mascotă" className="resume-modal-mascot" />
        </div>
      </div>
    );
  }

  return (
    <div className="course-viewer-container" style={{ padding: 0, maxWidth: 'none' }}>
      <div className="viewer-shell-wrapper">
        <div className="viewer-shell">
        {/* Sidebar */}
        <div className={`viewer-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="viewer-course-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="sidebar-fade-text" style={{ flex: 1, minWidth: 0 }}>
              <h2>{courseTitle}</h2>
              <p>{chapters.length} cap. • {allItems.length} el.</p>
            </div>
            <button
              className="sidebar-collapse-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Extinde meniu" : "Restrânge meniu"}
            >
              {sidebarCollapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
          </div>

          <div className="viewer-chapters">
            {chapters.map((ch, chIdx) => {
              const isOpen = expanded.has(ch.id);
              return (
                <div key={ch.id} className="viewer-chapter-block">
                  <div 
                    className="viewer-chapter-header" 
                    onClick={sidebarCollapsed ? undefined : () => {
                      const next = new Set(expanded);
                      isOpen ? next.delete(ch.id) : next.add(ch.id);
                      setExpanded(next);
                    }}
                    style={{ cursor: sidebarCollapsed ? 'default' : 'pointer' }}
                  >
                    <div 
                      className={`v-ch-num ${ch.items.length > 0 && ch.items.every(item => completedItemIds.has(item.id)) ? 'completed' : 'uncompleted'}`}
                      onClick={sidebarCollapsed ? (e) => {
                        e.stopPropagation();
                        setSidebarCollapsed(false);
                        setExpanded(new Set([ch.id]));
                      } : undefined}
                    >
                      {chIdx + 1}
                    </div>
                    <span className="v-ch-title sidebar-fade-text">{ch.title}</span>
                    <ChevronDown size={16} className={`v-ch-toggle sidebar-fade-text ${isOpen ? 'open' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isOpen && !sidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="viewer-items-list">
                          {ch.items.map(item => (
                            <button
                              key={item.id}
                              className={`viewer-nav-item ${selectedItem?.itemId === item.id ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedItem({ chapterId: ch.id, itemId: item.id });
                                setAnswers({});
                                setSubmitted(false);
                              }}
                            >
                              <div className={`v-item-icon ${item.type}`}>
                                {item.type === 'lesson' ? (
                                  <FileText size={14} />
                                ) : item.quiz_type === 'connect' ? (
                                  <Shuffle size={14} />
                                ) : item.quiz_type === 'truefalse' ? (
                                  <Play size={14} />
                                ) : item.quiz_type === 'memory' ? (
                                  <Layers size={14} />
                                ) : item.quiz_type === 'scrambled' ? (
                                  <Type size={14} />
                                ) : (
                                  <HelpCircle size={14} />
                                )}
                              </div>
                              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.title}
                              </span>
                              {completedItemIds.has(item.id) && (
                                <Check size={14} style={{ color: '#4ade80', marginLeft: 'auto', flexShrink: 0 }} />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="viewer-content">
          <div className="viewer-top-bar">
            <button className="viewer-back-btn" onClick={() => router.push('/courses')}>
              <ArrowLeft size={18} />
            </button>
            <span className="viewer-top-title" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentItem?.title || courseTitle}
            </span>

            <button
              onClick={() => setShowUnenrollModal(true)}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: '#ef4444', fontWeight: 700, fontSize: '13px', padding: '8px 16px',
                borderRadius: '12px', cursor: 'pointer', transition: '0.2s', marginRight: '8px',
                flexShrink: 0
              }}
              className="unenroll-nav-btn"
            >
              Dezabonează-te
            </button>

            {allItems.length > 0 && allItems.every(item => completedItemIds.has(item.id)) && (
              <button
                onClick={() => setShowCompletionModal(true)}
                style={{
                  padding: '8px 16px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#0a0f1c', border: 'none', borderRadius: '12px', fontWeight: '800',
                  fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)', flexShrink: 0
                }}
              >
                <Award size={14} />
                Finalizează Curs
              </button>
            )}
          </div>

          <div className="viewer-body">
            {!currentItem ? (
              <div className="viewer-empty">
                <MousePointerClick size={48} />
                <h3>Selectează o lecție</h3>
                <p>Alege un element din sidebar pentru a începe.</p>
              </div>
            ) : currentItem.type === 'lesson' ? (
              /* === LESSON VIEW === */
              <div className="lesson-display">
                <h1>{currentItem.title}</h1>
                <div className="lesson-content-body markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="code-block-wrapper">
                            <div className="code-block-header">
                              <span className="code-lang">{match[1]}</span>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, borderRadius: '0 0 16px 16px', background: '#0a0f1c', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {currentItem.content || 'Această lecție nu are conținut încă.'}
                  </ReactMarkdown>
                </div>

                <div className="viewer-nav-buttons">
                  {currentIdx > 0 && (
                    <button className="nav-prev-btn" onClick={() => goToItem(currentIdx - 1)}>
                      <ArrowLeft size={16} /> Anteriorul
                    </button>
                  )}
                  <div />
                  {currentIdx < allItems.length - 1 && (
                    <button className="nav-next-btn" onClick={() => goToItem(currentIdx + 1)}>
                      Următorul <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* === QUIZ VIEW === */
              <div className="quiz-display" style={{ position: 'relative' }}>
                {submitted && (() => {
                  const current = currentItem;
                  if (!current) return false;
                  let correct = 0;
                  let total = 0;
                  if (gameMode === 'classic') {
                    const score = getScoreFromItem(current);
                    correct = score.correct;
                    total = score.total;
                  } else if (gameMode === 'connect') {
                    correct = matchedPairs.size;
                    total = current.questions?.length || 0;
                  } else if (gameMode === 'truefalse') {
                    correct = Object.values(tfAnswers).filter(Boolean).length;
                    total = tfStatements.length;
                  } else if (gameMode === 'memory') {
                    correct = memoryCards.filter(c => c.isMatched).length / 2;
                    total = current.questions?.length || 0;
                  } else if (gameMode === 'scrambled') {
                    correct = Object.values(scrambledAnswers).filter(val => val !== 'wrong').length;
                    total = current.questions?.length || 0;
                  }
                  const passed = total > 0 ? (correct >= Math.ceil(total / 2)) : false;
                  return passed ? <ConfettiEffect /> : null;
                })()}

                <h1>{currentItem.title}</h1>
                <p className="quiz-description" style={{ marginBottom: 24 }}>
                  {gameMode === 'classic' && 'Răspunde la toate întrebările și apasă "Verifică Răspunsurile" la final.'}
                  {gameMode === 'connect' && 'Asociază corect elementele din stânga cu răspunsurile din dreapta.'}
                  {gameMode === 'truefalse' && 'Decide rapid dacă enunțurile propuse sunt Adevărate sau False.'}
                  {gameMode === 'memory' && 'Găsește perechile potrivite (întrebare-răspuns) întorcând cardurile de memorie.'}
                  {gameMode === 'scrambled' && 'Asamblează literele corecte pentru a forma răspunsul potrivit.'}
                </p>

                {gameMode === 'classic' && (() => {
                  const questions = currentItem.questions || [];
                  const q = questions[classicCurrentQIdx];

                  if (!q) return null;

                  const isAnswered = submitted;
                  const selectedOptId = answers[q.id];
                  const correctOpt = q.options.find(o => o.is_correct);
                  const isCorrect = isAnswered && selectedOptId === correctOpt?.id;

                  return (
                    <>
                      {/* Interactive Header hud */}
                      <div className="quiz-header-premium">
                        <div className="quiz-progress-hud">
                          <div className="quiz-hud-meta">
                            <span>Întrebare evaluare</span>
                            <span>{classicCurrentQIdx + 1} / {questions.length}</span>
                          </div>
                          <div className="quiz-progress-bar-bg">
                            <div
                              className="quiz-progress-bar-fill"
                              style={{ width: `${((classicCurrentQIdx + 1) / questions.length) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="quiz-hud-hearts">
                          <Star className="quiz-hud-heart" size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>
                            {Object.keys(answers).length} Selectate
                          </span>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={classicCurrentQIdx}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.25 }}
                          className={`quiz-q-card ${isAnswered ? (isCorrect ? 'answered-correct' : 'answered-wrong') : ''}`}
                        >
                          <div className="quiz-q-number">Întrebarea {classicCurrentQIdx + 1}</div>
                          <div className="quiz-q-text">{q.question}</div>

                          <div className="quiz-options-grid">
                            {q.options.map((o, oIdx) => {
                              let cls = 'quiz-option-btn';
                              if (submitted) {
                                cls += ' disabled';
                                if (o.is_correct) cls += ' correct';
                                else if (selectedOptId === o.id && !o.is_correct) cls += ' wrong';
                              } else if (selectedOptId === o.id) {
                                cls += ' selected';
                              }

                              return (
                                <motion.button
                                  whileHover={{ scale: submitted ? 1 : 1.01 }}
                                  whileTap={{ scale: submitted ? 1 : 0.99 }}
                                  key={o.id}
                                  className={cls}
                                  onClick={() => {
                                    if (!submitted) setAnswers(prev => ({ ...prev, [q.id]: o.id }));
                                  }}
                                >
                                  <span className="option-letter">{letters[oIdx]}</span>
                                  <span>{o.text}</span>
                                  {submitted && o.is_correct && <Check size={18} style={{ marginLeft: 'auto', color: '#4ade80' }} />}
                                  {submitted && selectedOptId === o.id && !o.is_correct && <X size={18} style={{ marginLeft: 'auto', color: '#f87171' }} />}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="scrambled-actions" style={{ justifyContent: 'space-between', marginTop: 24, width: '100%' }}>
                        <button
                          className="scrambled-btn reset"
                          disabled={classicCurrentQIdx === 0}
                          onClick={() => setClassicCurrentQIdx(prev => prev - 1)}
                        >
                          Anteriorul
                        </button>

                        {classicCurrentQIdx < questions.length - 1 ? (
                          <button
                            className="scrambled-btn check"
                            onClick={() => setClassicCurrentQIdx(prev => prev + 1)}
                          >
                            Următorul
                          </button>
                        ) : (
                          !submitted && (
                            <button
                              className="quiz-submit-btn"
                              style={{ margin: 0, width: 'auto' }}
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(answers).length < questions.length}
                            >
                              <Award size={20} />
                              Verifică Răspunsurile
                            </button>
                          )
                        )}
                      </div>

                      {submitted && (
                        <>
                          {(() => {
                            const { correct, total } = getScoreFromItem(currentItem);
                            const passed = correct >= Math.ceil(total / 2);
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`quiz-result-banner ${passed ? 'pass' : 'fail'}`}
                                style={{ marginTop: 24 }}
                              >
                                {passed ? '🎉 Felicitări!' : '😔 Mai încearcă!'} — {correct}/{total} corecte
                                <div className="quiz-result-score">{Math.round((correct / total) * 100)}% scor</div>
                              </motion.div>
                            );
                          })()}
                          {earnedBadge && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="badge-earned-banner"
                            >
                              {earnedBadge.image_url ? (
                                <img
                                  src={earnedBadge.image_url}
                                  alt={earnedBadge.title}
                                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                />
                              ) : (
                                <span style={{ fontSize: 40 }}>{earnedBadge.icon}</span>
                              )}
                              <div>
                                <div style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>Insignă Obținută!</div>
                                <div style={{ color: earnedBadge.color, fontWeight: 700 }}>{earnedBadge.title}</div>
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </>
                  );
                })()}

                {gameMode === 'connect' && (
                  <div className="game-card">
                    {!connectGameActive && !submitted ? (
                      <div className="game-intro">
                        <div className="game-icon-wrapper">
                          <Shuffle size={36} />
                        </div>
                        <h2>Conectează Perechile</h2>
                        <p>
                          Trage sau selectează elementele din coloana stângă (întrebări) și asociază-le corect cu variantele de răspuns potrivite din coloana dreaptă.
                        </p>
                        <button className="start-game-btn" onClick={() => setConnectGameActive(true)}>
                          Start Joc
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="connect-columns">
                          <div className="connect-column">
                            <div className="connect-column-title">Întrebări / Concepte</div>
                            {connectQuestions.map(q => {
                              const isMatched = matchedPairs.has(q.id);
                              const isSelected = selectedConnectQ === q.id;
                              const isError = failedPairs.has(q.id);
                              return (
                                <motion.button
                                  whileHover={{ scale: isMatched ? 1 : 1.02 }}
                                  whileTap={{ scale: isMatched ? 1 : 0.98 }}
                                  key={q.id}
                                  className={`connect-item-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isError ? 'error' : ''}`}
                                  onClick={() => handleConnectCardClick(q.id, 'q')}
                                >
                                  {q.text}
                                  {isMatched && <Check size={16} style={{ marginLeft: 'auto', color: '#4ade80' }} />}
                                </motion.button>
                              );
                            })}
                          </div>
                          <div className="connect-column">
                            <div className="connect-column-title">Răspunsuri Corecte</div>
                            {connectAnswers.map(ans => {
                              const isMatched = matchedPairs.has(ans.qId);
                              const isSelected = selectedConnectA === ans.id;
                              return (
                                <motion.button
                                  whileHover={{ scale: isMatched ? 1 : 1.02 }}
                                  whileTap={{ scale: isMatched ? 1 : 0.98 }}
                                  key={ans.id}
                                  className={`connect-item-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                                  onClick={() => handleConnectCardClick(ans.id, 'a')}
                                >
                                  {ans.text}
                                  {isMatched && <Check size={16} style={{ marginLeft: 'auto', color: '#4ade80' }} />}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {submitted && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="quiz-result-banner pass"
                            style={{ marginTop: 24 }}
                          >
                            🎉 Excelent! Ai conectat cu succes toate perechile!
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {gameMode === 'truefalse' && (
                  <div className="game-card">
                    {!tfGameActive && !submitted ? (
                      <div className="game-intro">
                        <div className="game-icon-wrapper">
                          <Play size={36} />
                        </div>
                        <h2>Adevărat sau Fals</h2>
                        <p>
                          O serie de afirmații îți vor fi prezentate succesiv. Decide dacă enunțul propus este Corect (Adevărat) sau Greșit (Fals).
                        </p>
                        <button className="start-game-btn" onClick={() => setTfGameActive(true)}>
                          Start Joc
                        </button>
                      </div>
                    ) : (
                      <div className="tf-card" style={{ width: '100%' }}>
                        {!submitted ? (
                          <>
                            <div className="tf-progress" style={{ width: '100%' }}>
                              <span>Întrebarea {tfCurrentIdx + 1} din {tfStatements.length}</span>
                              <span>Progres: {Math.round((tfCurrentIdx / tfStatements.length) * 100)}%</span>
                            </div>

                            <AnimatePresence mode="wait">
                              <motion.div
                                key={tfCurrentIdx}
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="tf-statement-box"
                              >
                                <div className="tf-question-label">Afirmație</div>
                                <div className="tf-question-title" style={{ fontSize: '22px', margin: '20px 0' }}>
                                  {tfStatements[tfCurrentIdx]?.question}
                                </div>
                              </motion.div>
                            </AnimatePresence>

                            <div className="tf-actions">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="tf-btn true"
                                onClick={() => handleTfSelection(true)}
                              >
                                <Check size={18} /> Adevărat (A / ←)
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="tf-btn false"
                                onClick={() => handleTfSelection(false)}
                              >
                                <X size={18} /> Fals (D / →)
                              </motion.button>
                            </div>
                          </>
                        ) : (
                          <>
                            {(() => {
                              const correctCount = Object.values(tfAnswers).filter(Boolean).length;
                              const total = tfStatements.length;
                              const passed = correctCount >= Math.ceil(total / 2);
                              return (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`quiz-result-banner ${passed ? 'pass' : 'fail'}`}
                                  style={{ width: '100%' }}
                                >
                                  {passed ? '🎉 Joc Finalizat cu succes!' : '😔 Mai încearcă!'} — {correctCount}/{total} enunțuri evaluate corect
                                  <div className="quiz-result-score">{Math.round((correctCount / total) * 100)}% scor</div>
                                </motion.div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {gameMode === 'memory' && (
                  <div className="game-card">
                    {!memoryGameActive && !submitted ? (
                      <div className="game-intro">
                        <div className="game-icon-wrapper">
                          <Layers size={36} />
                        </div>
                        <h2>Joc de Memorie</h2>
                        <p>
                          Găsește perechile potrivite întorcând cardurile. Fiecare întrebare are o singură variantă potrivită de răspuns.
                        </p>
                        <button className="start-game-btn" onClick={() => setMemoryGameActive(true)}>
                          Start Joc
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="memory-grid">
                          {memoryCards.map((card, idx) => {
                            const isFlipped = card.isFlipped || card.isMatched;
                            return (
                              <motion.div
                                whileHover={{ scale: isFlipped ? 1 : 1.03 }}
                                key={card.id}
                                className={`memory-card-container ${isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                                onClick={() => handleMemoryCardClick(idx)}
                              >
                                <div className="memory-card-inner">
                                  <div className="memory-card-front">
                                    <HelpCircle size={24} />
                                  </div>
                                  <div className="memory-card-back">
                                    {card.text}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {submitted && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="quiz-result-banner pass"
                            style={{ marginTop: 24 }}
                          >
                            🎉 Excelent! Ai descoperit și potrivit toate cardurile de memorie!
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {gameMode === 'scrambled' && (
                  <div className="game-card">
                    {!scrambledGameActive && !submitted ? (
                      <div className="game-intro">
                        <div className="game-icon-wrapper">
                          <Type size={36} />
                        </div>
                        <h2>Litere Încurcate</h2>
                        <p>
                          Vizualizează întrebarea și asamblează literele corecte pentru a forma răspunsul potrivit din setul dat de caractere amestecate.
                        </p>
                        <button className="start-game-btn" onClick={startScrambledGame}>
                          Start Joc
                        </button>
                      </div>
                    ) : (
                      <div className="scrambled-layout" style={{ width: '100%' }}>
                        {!submitted ? (
                          <>
                            <div className="tf-progress" style={{ width: '100%' }}>
                              <span>Întrebarea {scrambledCurrentQIdx + 1} din {(currentItem.questions || []).length}</span>
                            </div>

                            <div className="scrambled-q">
                              {currentItem.questions?.[scrambledCurrentQIdx]?.question}
                            </div>

                            <div className="scrambled-slots">
                              {scrambledSelectedChars.length === 0 ? (
                                <span style={{ color: '#475569', fontSize: 13, alignSelf: 'center' }}>
                                  Selectează litere de mai jos...
                                </span>
                              ) : (
                                scrambledSelectedChars.map((sel, idx) => (
                                  <motion.div
                                    layout
                                    key={idx}
                                    className="scrambled-char-tile"
                                    onClick={() => handleScrambledSlotTileClick(idx)}
                                  >
                                    {sel.char}
                                  </motion.div>
                                ))
                              )}
                            </div>

                            <div className="scrambled-letters-pool">
                              {scrambledPool.map((char, idx) => {
                                const isUsed = scrambledSelectedChars.some(sel => sel.poolIndex === idx);
                                return (
                                  <motion.button
                                    layout
                                    key={idx}
                                    disabled={isUsed}
                                    className={`scrambled-pool-tile ${isUsed ? 'used' : ''}`}
                                    onClick={() => handleScrambledPoolTileClick(char, idx)}
                                  >
                                    {char}
                                  </motion.button>
                                );
                              })}
                            </div>

                            <div className="scrambled-actions">
                              <button className="scrambled-btn reset" onClick={resetScrambledSelection}>
                                <RotateCcw size={14} style={{ marginRight: 6 }} /> Resetează
                              </button>
                              <button
                                className="scrambled-btn check"
                                onClick={checkScrambledAnswer}
                                disabled={scrambledSelectedChars.length === 0}
                              >
                                Verifică & Următorul
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {(() => {
                              const correctCount = Object.values(scrambledAnswers).filter(val => val !== 'wrong').length;
                              const total = currentItem.questions?.length || 0;
                              const passed = correctCount >= Math.ceil(total / 2);
                              return (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`quiz-result-banner ${passed ? 'pass' : 'fail'}`}
                                  style={{ width: '100%' }}
                                >
                                  {passed ? '🎉 Joc Finalizat cu succes!' : '😔 Mai încearcă!'} — {correctCount}/{total} răspunsuri asamblate corect
                                  <div className="quiz-result-score">{Math.round((correctCount / total) * 100)}% scor</div>
                                </motion.div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="viewer-nav-buttons">
                  {currentIdx > 0 && (
                    <button className="nav-prev-btn" onClick={() => goToItem(currentIdx - 1)}>
                      <ArrowLeft size={16} /> Anteriorul
                    </button>
                  )}
                  <div />
                  {currentIdx < allItems.length - 1 && (
                    <button className="nav-next-btn" onClick={() => goToItem(currentIdx + 1)}>
                      Următorul <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCurrentChapterCompleted && !showResumeModal && !showCompletionModal && !showUnenrollModal && (
          <motion.div
            className="chapter-complete-mascot-container"
            initial={{ opacity: 0, y: 80, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <img 
              src="/chapter-complete-mascot.png" 
              alt="Capitol Completat!" 
              className="chapter-complete-mascot"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showResumeModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 15, 28, 0.55)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, borderRadius: '28px'
        }}>
          <div className="glass-premium" style={{
            width: '90%', maxWidth: 500, padding: 36, borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13, 20, 38, 0.7)',
            backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
            textAlign: 'center', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <Award size={48} style={{ color: '#29b6f6', marginBottom: 20 }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Ai progres anterior la acest curs</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
              Am găsit lecții parcurse și teste susținute în trecut pentru <strong>{courseTitle}</strong>. Cum dorești să continui?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleEnrollAndContinue}
                disabled={enrolling}
                style={{
                  padding: '16px', background: 'var(--primary-gradient)', color: 'white',
                  border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', transition: '0.2s', boxShadow: '0 8px 20px rgba(30, 111, 217, 0.2)'
                }}
              >
                Continui de unde am rămas
              </button>
              <button
                onClick={handleEnrollFromScratch}
                disabled={enrolling}
                style={{
                  padding: '16px', background: 'rgba(255,255,255,0.04)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', transition: '0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                O iau de la început (șterge progresul vechi)
              </button>
              <button
                onClick={() => setShowResumeModal(false)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 12
                }}
              >
                Renunță
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletionModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 15, 28, 0.55)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, borderRadius: '28px'
        }}>
          <div className="glass-premium" style={{
            width: '90%', maxWidth: 500, padding: 36, borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13, 20, 38, 0.7)',
            backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
            textAlign: 'center', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <Award size={48} style={{ color: '#fbbf24', marginBottom: 20 }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: 12 }}>🏆 Felicitări deosebite!</h3>
            <p style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Ai absolvit cursul 100%!</p>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Dorești să finalizezi oficial acest curs? Îl vom dezabona pentru a nu-ți mai încărca dashboard-ul, însă progresul, notele și badges-urile rămân salvate pentru totdeauna în profilul tău.
            </p>

            {/* Star Rating */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '20px 24px', marginBottom: 24, textAlign: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {feedbackSubmitted ? 'Mulțumim pentru feedback!' : 'Cum ți s-a părut cursul?'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setFeedbackHover(star)}
                    onMouseLeave={() => setFeedbackHover(0)}
                    onClick={() => { setFeedbackRating(star); setFeedbackSubmitted(false); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                      transition: 'color 0.15s'
                    }}
                  >
                    <Star
                      size={32}
                      fill={(feedbackHover || feedbackRating) >= star ? '#fbbf24' : 'transparent'}
                      color={(feedbackHover || feedbackRating) >= star ? '#fbbf24' : '#475569'}
                      style={{ transition: 'all 0.15s' }}
                    />
                  </motion.button>
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: feedbackRating > 0 && !feedbackSubmitted ? 12 : 0 }}>
                {feedbackRating === 0 ? 'Apasă pe stele pentru a oferi feedback' :
                  feedbackRating === 1 ? '⭐ Slab' :
                    feedbackRating === 2 ? '⭐⭐ Acceptabil' :
                      feedbackRating === 3 ? '⭐⭐⭐ Bun' :
                        feedbackRating === 4 ? '⭐⭐⭐⭐ Foarte Bun' :
                          '⭐⭐⭐⭐⭐ Excelent!'}
              </p>
              {feedbackRating > 0 && !feedbackSubmitted && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={submitRating}
                  style={{
                    padding: '10px 24px', background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)', color: '#fbbf24',
                    borderRadius: 12, fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  Trimite Feedback
                </motion.button>
              )}
              {feedbackSubmitted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#4ade80', fontSize: 13, fontWeight: 700 }}>
                  <Check size={14} /> Rating salvat!
                </motion.div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleFinalizeAndUnenroll}
                style={{
                  padding: '16px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0a0f1c',
                  border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 15,
                  cursor: 'pointer', transition: '0.2s', boxShadow: '0 8px 20px rgba(251, 191, 36, 0.2)'
                }}
              >
                Da, finalizează și dezabonează-mă
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                style={{
                  padding: '16px', background: 'rgba(255,255,255,0.04)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                Nu, păstrează cursul activ pe panou
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Unenroll Modal (Dezabonează-te oricând) */}
      {showUnenrollModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 15, 28, 0.55)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, borderRadius: '28px'
        }}>
          <div className="glass-premium" style={{
            width: '90%', maxWidth: 450, padding: 32, borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13, 20, 38, 0.7)',
            backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
            textAlign: 'center', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Dezabonează-te de la curs</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              Sigur dorești să te dezabonezi de la <strong>{courseTitle}</strong>? Cursul nu va mai apărea pe pagina principală, dar istoricul tău va rămâne salvat dacă te reînscrii în viitor.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleUnenroll}
                style={{
                  flex: 1, padding: '14px', background: '#ef4444', color: 'white',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                Da, dezabonează-mă
              </button>
              <button
                onClick={() => setShowUnenrollModal(false)}
                style={{
                  flex: 1, padding: '14px', background: 'rgba(255,255,255,0.04)', color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                Renunță
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default CourseViewerPage;
