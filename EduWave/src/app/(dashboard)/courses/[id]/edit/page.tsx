'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Plus, Save, ArrowLeft, BookOpen, HelpCircle,
  Trash2, Check, GripVertical, FileText, MousePointerClick, Award, Edit,
  Shuffle, Play, Layers, Type
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import './builder.css';

type Badge = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge_type: 'course_complete' | 'quiz_complete';
  quiz_item_id: string | null;
  image_url?: string | null;
};

type ChapterItem = {
  id: string;
  chapter_id: string;
  type: 'lesson' | 'quiz';
  title: string;
  content: string;
  order_index: number;
  questions?: QuizQuestion[];
  quiz_type?: 'classic' | 'connect' | 'truefalse' | 'memory' | 'scrambled';
};

type QuizQuestion = {
  id: string;
  item_id: string;
  question: string;
  order_index: number;
  options: QuizOption[];
};

type QuizOption = {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  order_index: number;
};

type Chapter = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  items: ChapterItem[];
};

const CourseBuilderPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [courseTitle, setCourseTitle] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<{ chapterId: string; itemId: string | null; type: 'chapter' | 'lesson' | 'quiz' | 'badge' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingBadgeId, setUploadingBadgeId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'structura' | 'editor'>('structura');
  const [codeLang, setCodeLang] = useState('cpp');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const selectItemAndSwitchTab = (item: { chapterId: string; itemId: string | null; type: 'chapter' | 'lesson' | 'quiz' | 'badge' } | null) => {
    setSelectedItem(item);
    if (item) setMobileTab('editor');
  };

  // Load course data
  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const courseRes = await fetch(`/api/courses/${courseId}`);
      if (courseRes.ok) {
        const course = await courseRes.json();
        setCourseTitle(course.title);
        setChapters(course.chapters || []);

        if (course.chapters && course.chapters.length > 0) {
          setExpandedChapters(new Set([course.chapters[0].id]));
        }
      }

      const badgesRes = await fetch('/api/badges');
      if (badgesRes.ok) {
        const { badges: allBadges } = await badgesRes.json();
        const courseBadges = allBadges.filter((b: any) => b.course_id === courseId);
        setBadges(courseBadges);
      }
    } catch (err) {
      console.error('Error loading course:', err);
    }
    setLoading(false);
  };

  // === SAVE ALL ===
  const saveAll = async () => {
    setSaving(true);
    try {
      const courseRes = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters })
      });
      if (!courseRes.ok) {
        throw new Error('Eroare la salvarea capitolelor cursului.');
      }

      for (const badge of badges) {
        const badgeRes = await fetch('/api/badges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(badge)
        });
        if (!badgeRes.ok) {
          throw new Error(`Eroare la salvarea insigniei ${badge.title}`);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(`Eroare la salvare: ${err.message}`);
    }
    setSaving(false);
  };

  // === ADD CHAPTER ===
  const addChapter = () => {
    const newId = crypto.randomUUID();
    const orderIdx = chapters.length;
    const newChapter: Chapter = {
      id: newId,
      course_id: courseId,
      title: `Capitol ${orderIdx + 1}`,
      description: '',
      order_index: orderIdx,
      items: []
    };

    setChapters(prev => [...prev, newChapter]);
    setExpandedChapters(prev => new Set(prev).add(newId));
    selectItemAndSwitchTab({ chapterId: newId, itemId: null, type: 'chapter' });
  };

  // === DELETE CHAPTER ===
  const deleteChapter = (chapterId: string) => {
    setChapters(prev => prev.filter(c => c.id !== chapterId));
    if (selectedItem?.chapterId === chapterId) selectItemAndSwitchTab(null);
  };

  // === ADD ITEM ===
  const addItem = (chapterId: string, type: 'lesson' | 'quiz') => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const newId = crypto.randomUUID();
    const orderIdx = chapter.items.length;
    const title = type === 'lesson' ? `Lecție ${orderIdx + 1}` : `Quiz ${orderIdx + 1}`;

    const newItem: ChapterItem = {
      id: newId, chapter_id: chapterId, type, title, content: '', order_index: orderIdx, questions: [], quiz_type: type === 'quiz' ? 'classic' : undefined
    };

    setChapters(prev => prev.map(c =>
      c.id === chapterId ? { ...c, items: [...c.items, newItem] } : c
    ));
    selectItemAndSwitchTab({ chapterId, itemId: newId, type });
  };

  // === DELETE ITEM ===
  const deleteItem = (chapterId: string, itemId: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
    ));
    if (selectedItem?.itemId === itemId) selectItemAndSwitchTab(null);
  };

  // === UPDATE CHAPTER ===
  const updateChapter = (chapterId: string, field: string, value: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? { ...c, [field]: value } : c
    ));
  };

  // === UPDATE ITEM ===
  const updateItem = (chapterId: string, itemId: string, field: string, value: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId
        ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
        : c
    ));
  };

  // === LESSON CONTENT FORMATTING TOOLBAR ===
  const formatLesson = (type: string) => {
    const ta = contentTextareaRef.current;
    if (!ta || !sel?.item) return;
    const value = sel.item.content || '';
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);

    let result = value;
    let selStart = start;
    let selEnd = end;

    const wrap = (marker: string, placeholder: string) => {
      const inner = selected || placeholder;
      const inserted = marker + inner + marker;
      result = before + inserted + after;
      selStart = start + marker.length;
      selEnd = selStart + inner.length;
    };

    const linePrefix = (prefix: string) => {
      const lineStart = before.lastIndexOf('\n') + 1;
      const newBefore = before.slice(0, lineStart) + prefix + before.slice(lineStart);
      result = newBefore + after;
      selStart = start + prefix.length;
      selEnd = end + prefix.length;
    };

    switch (type) {
      case 'bold': wrap('**', 'text îngroșat'); break;
      case 'italic': wrap('*', 'text italic'); break;
      case 'h1': linePrefix('# '); break;
      case 'h2': linePrefix('## '); break;
      case 'h3': linePrefix('### '); break;
      case 'ul': linePrefix('- '); break;
      case 'ol': linePrefix('1. '); break;
      case 'quote': linePrefix('> '); break;
      case 'link': {
        const inner = selected || 'text link';
        const inserted = `[${inner}](https://)`;
        result = before + inserted + after;
        selStart = start + 1;
        selEnd = selStart + inner.length;
        break;
      }
      case 'code': {
        const inner = selected || '// scrie codul aici';
        const block = '\n```' + codeLang + '\n' + inner + '\n```\n';
        result = before + block + after;
        selStart = start + block.indexOf(inner);
        selEnd = selStart + inner.length;
        break;
      }
    }

    updateItem(sel.chapter!.id, sel.item.id, 'content', result);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };

  // === QUIZ HELPERS ===
  const addQuestion = (chapterId: string, itemId: string) => {
    const qId = crypto.randomUUID();
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: [...(i.questions || []), {
              id: qId, item_id: itemId, question: '', order_index: (i.questions || []).length,
              options: [
                { id: crypto.randomUUID(), question_id: qId, text: '', is_correct: true, order_index: 0 },
                { id: crypto.randomUUID(), question_id: qId, text: '', is_correct: false, order_index: 1 },
              ]
            }]
          } : i)
      } : c
    ));
  };

  const deleteQuestion = (chapterId: string, itemId: string, questionId: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? { ...i, questions: (i.questions || []).filter(q => q.id !== questionId) } : i)
      } : c
    ));
  };

  const updateQuestion = (chapterId: string, itemId: string, questionId: string, value: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: (i.questions || []).map(q => q.id === questionId ? { ...q, question: value } : q)
          } : i)
      } : c
    ));
  };

  const addOption = (chapterId: string, itemId: string, questionId: string) => {
    const oId = crypto.randomUUID();
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: (i.questions || []).map(q =>
              q.id === questionId ? {
                ...q, options: [...q.options, { id: oId, question_id: questionId, text: '', is_correct: false, order_index: q.options.length }]
              } : q)
          } : i)
      } : c
    ));
  };

  const deleteOption = (chapterId: string, itemId: string, questionId: string, optionId: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: (i.questions || []).map(q =>
              q.id === questionId ? { ...q, options: q.options.filter(o => o.id !== optionId) } : q)
          } : i)
      } : c
    ));
  };

  const updateOption = (chapterId: string, itemId: string, questionId: string, optionId: string, field: string, value: any) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: (i.questions || []).map(q =>
              q.id === questionId ? {
                ...q, options: q.options.map(o => o.id === optionId ? { ...o, [field]: value } : o)
              } : q)
          } : i)
      } : c
    ));
  };

  const toggleCorrect = (chapterId: string, itemId: string, questionId: string, optionId: string) => {
    setChapters(prev => prev.map(c =>
      c.id === chapterId ? {
        ...c, items: c.items.map(i =>
          i.id === itemId ? {
            ...i, questions: (i.questions || []).map(q =>
              q.id === questionId ? {
                ...q, options: q.options.map(o => ({ ...o, is_correct: o.id === optionId }))
              } : q)
          } : i)
      } : c
    ));
  };

  // === BADGE HELPERS ===
  const addBadge = () => {
    const newBadge: Badge = {
      id: crypto.randomUUID(),
      course_id: courseId,
      title: 'Insignă Nouă',
      description: 'Ai finalizat cursul!',
      icon: '🏆',
      color: '#fbbf24',
      badge_type: 'course_complete',
      quiz_item_id: null,
      image_url: ''
    };
    setBadges(prev => [...prev, newBadge]);
    selectItemAndSwitchTab({ chapterId: '', itemId: newBadge.id, type: 'badge' });
  };

  const deleteBadge = async (badgeId: string) => {
    try {
      const res = await fetch(`/api/badges?id=${badgeId}`, { method: 'DELETE' });
      if (res.ok) {
        setBadges(prev => prev.filter(b => b.id !== badgeId));
        if (selectedItem?.itemId === badgeId) selectItemAndSwitchTab(null);
      }
    } catch (err: any) {
      console.error('Error deleting badge:', err);
    }
  };

  const updateBadge = (badgeId: string, field: string, value: any) => {
    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, [field]: value } : b));
  };

  const uploadBadgeImage = async (badgeId: string, file: File) => {
    setUploadingBadgeId(badgeId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        updateBadge(badgeId, 'image_url', data.url);
      }
    } catch (err: any) {
      console.error('Error uploading badge image:', err);
    } finally {
      setUploadingBadgeId(null);
    }
  };

  // Get current selected data
  const getSelectedData = () => {
    if (!selectedItem) return null;
    if (selectedItem.type === 'badge') return { chapter: null, item: null, badge: badges.find(b => b.id === selectedItem.itemId) };
    const chapter = chapters.find(c => c.id === selectedItem.chapterId);
    if (!chapter) return null;
    if (selectedItem.type === 'chapter') return { chapter, item: null, badge: null };
    const item = chapter.items.find(i => i.id === selectedItem.itemId);
    return { chapter, item: item || null, badge: null };
  };

  const sel = getSelectedData();

  if (loading) {
    return (
      <div className="page-content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="save-status">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="page-content-wrapper" style={{ padding: 0, maxWidth: 'none' }}>
      
      {/* Mobile Tab Switcher (hidden on desktop) */}
      <div className="mobile-builder-tabs">
        <button className={mobileTab === 'structura' ? 'active' : ''} onClick={() => setMobileTab('structura')}>
          Structură
        </button>
        <button className={mobileTab === 'editor' ? 'active' : ''} onClick={() => setMobileTab('editor')}>
          Editor
        </button>
      </div>

      <div className={`builder-shell mobile-show-${mobileTab}`}>
        {/* === SIDEBAR === */}
        <div className="builder-sidebar">
          <div className="sidebar-head">
            <h3><BookOpen size={18} /> Structura Cursului</h3>
            <button className="add-chapter-btn" onClick={addChapter}>
              <Plus size={16} />
              Adaugă Capitol
            </button>
          </div>

          <div className="chapters-list">
            {chapters.map((chapter, chIdx) => {
              const isExpanded = expandedChapters.has(chapter.id);
              return (
                <div key={chapter.id} className={`chapter-block ${selectedItem?.chapterId === chapter.id ? 'active' : ''}`}>
                  <div
                    className="chapter-header"
                    onClick={() => {
                      const next = new Set(expandedChapters);
                      isExpanded ? next.delete(chapter.id) : next.add(chapter.id);
                      setExpandedChapters(next);
                    }}
                  >
                    <div className="chapter-number">{chIdx + 1}</div>
                    <div className="chapter-header-text">
                      <h4>{chapter.title}</h4>
                      <span>{chapter.items.length} elemente</span>
                    </div>
                    <button
                      className="chapter-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectItemAndSwitchTab({ chapterId: chapter.id, itemId: null, type: 'chapter' });
                      }}
                      title="Editează capitol"
                    >
                      <Edit size={14} />
                    </button>
                    <ChevronDown size={16} className={`chapter-toggle ${isExpanded ? 'open' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="chapter-items">
                          {chapter.items.map(item => (
                            <div
                              key={item.id}
                              className={`sidebar-item ${selectedItem?.itemId === item.id ? 'active' : ''}`}
                              onClick={() => selectItemAndSwitchTab({ chapterId: chapter.id, itemId: item.id, type: item.type })}
                            >
                              <div className={`item-type-icon ${item.type}`}>
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
                              <span className="sidebar-item-title">{item.title}</span>
                              <button
                                className="sidebar-item-delete"
                                onClick={(e) => { e.stopPropagation(); deleteItem(chapter.id, item.id); }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="add-item-row">
                          <button className="add-item-btn add-lesson-btn" onClick={() => addItem(chapter.id, 'lesson')}>
                            <FileText size={12} /> Lecție
                          </button>
                          <button className="add-item-btn add-quiz-btn" onClick={() => addItem(chapter.id, 'quiz')}>
                            <HelpCircle size={12} /> Quiz
                          </button>
                        </div>

                        <div className="delete-chapter-row">
                          <button className="delete-chapter-btn" onClick={() => deleteChapter(chapter.id)}>
                            <Trash2 size={11} /> Șterge capitol
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="sidebar-head" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none' }}>
            <button className="add-chapter-btn" onClick={addBadge} style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }}>
              <Plus size={16} /> Adaugă Insignă
            </button>
            {badges.length > 0 && (
              <div className="chapter-items" style={{ marginTop: 16, padding: 0 }}>
                {badges.map(b => (
                  <div
                    key={b.id}
                    className={`sidebar-item ${selectedItem?.itemId === b.id ? 'active' : ''}`}
                    onClick={() => selectItemAndSwitchTab({ chapterId: '', itemId: b.id, type: 'badge' })}
                    style={{ background: selectedItem?.itemId === b.id ? 'rgba(251, 191, 36, 0.1)' : 'transparent', color: selectedItem?.itemId === b.id ? '#fbbf24' : '#94a3b8', cursor: 'pointer' }}
                  >
                    <div className="item-type-icon" style={{ background: 'transparent', fontSize: 18 }}>{b.icon}</div>
                    <span className="sidebar-item-title">{b.title}</span>
                    <div className="sidebar-item-delete" onClick={(e) => { e.stopPropagation(); deleteBadge(b.id); }}><Trash2 size={12} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === EDITOR === */}
        <div className="builder-editor">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <button className="back-btn" onClick={() => router.push('/courses')}>
                <ArrowLeft size={18} />
              </button>
              <span className="toolbar-title">{courseTitle}</span>
            </div>
            <div className="toolbar-right">
              {saved && <span className="save-status saved"><Check size={16} /> Salvat!</span>}
              <button className="toolbar-save-btn" onClick={saveAll} disabled={saving}>
                <Save size={16} />
                {saving ? 'Se salvează...' : 'Salvează Tot'}
              </button>
            </div>
          </div>

          <div className="editor-content">
            {!selectedItem ? (
              <div className="editor-empty">
                <MousePointerClick size={48} />
                <h3>Selectează un element</h3>
                <p>Alege un capitol, o lecție sau o insignă din sidebar pentru a edita.</p>
              </div>
            ) : sel?.badge ? (
              /* Badge Editor */
              <div className="badge-editor" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                <div className="badge-card" style={{ margin: 0 }}>
                  <div className="badge-header">
                    <h4><Award size={18} /> Editare Insignă</h4>
                    <button className="delete-badge-btn" onClick={() => deleteBadge(sel.badge!.id)}><Trash2 size={14} /></button>
                  </div>
                  
                  <div className="badge-inputs-row">
                    <div className="editor-field" style={{ flex: 1 }}>
                      <label>Emoji (dacă nu pui imagine)</label>
                      <input 
                        value={sel.badge!.icon} 
                        onChange={e => updateBadge(sel.badge!.id, 'icon', e.target.value)} 
                        maxLength={2}
                        style={{ fontSize: 24, textAlign: 'center', width: 80 }}
                      />
                    </div>
                    <div className="editor-field" style={{ flex: 1 }}>
                      <label>Culoare Temă</label>
                      <input 
                        type="color" 
                        value={sel.badge!.color} 
                        onChange={e => updateBadge(sel.badge!.id, 'color', e.target.value)} 
                        style={{ padding: 4, height: 50, cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="editor-field">
                    <label>Titlu Insignă</label>
                    <input 
                      value={sel.badge!.title} 
                      onChange={e => updateBadge(sel.badge!.id, 'title', e.target.value)} 
                      placeholder="Ex: Maestru React"
                    />
                  </div>

                  <div className="editor-field">
                    <label>Descriere Insignă</label>
                    <textarea 
                      className="content-textarea"
                      style={{ minHeight: '80px' }}
                      value={sel.badge!.description} 
                      onChange={e => updateBadge(sel.badge!.id, 'description', e.target.value)} 
                      placeholder="Ex: Felicitări! Ai finalizat cu brio testul capitolului 1."
                    />
                  </div>

                  <div className="editor-field">
                    <label>Imagine Insignă (1:1)</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input 
                        value={sel.badge!.image_url || ''} 
                        onChange={e => updateBadge(sel.badge!.id, 'image_url', e.target.value)} 
                        placeholder="Ex: https://example.com/badge.png sau încarcă din PC"
                        style={{ flex: 1 }}
                      />
                      <input 
                        type="file" 
                        id={`badge-upload-${sel.badge!.id}`}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            await uploadBadgeImage(sel.badge!.id, file);
                          }
                        }}
                      />
                      <label 
                        htmlFor={`badge-upload-${sel.badge!.id}`}
                        style={{
                          background: 'var(--primary-gradient)',
                          color: 'white',
                          padding: '12px 18px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          userSelect: 'none',
                          transition: 'opacity 0.2s',
                          opacity: uploadingBadgeId === sel.badge!.id ? 0.6 : 1,
                          pointerEvents: uploadingBadgeId === sel.badge!.id ? 'none' : 'auto'
                        }}
                      >
                        {uploadingBadgeId === sel.badge!.id ? 'Se încarcă...' : 'Încarcă din PC'}
                      </label>
                    </div>
                  </div>

                  <div className="editor-field">
                    <label>Condiție Obținere</label>
                    <select 
                      className="question-input" 
                      style={{ cursor: 'pointer', appearance: 'none' }}
                      value={sel.badge!.badge_type}
                      onChange={e => updateBadge(sel.badge!.id, 'badge_type', e.target.value)}
                    >
                      <option value="course_complete">Finalizarea întregului curs</option>
                      <option value="quiz_complete">Finalizarea unui anumit quiz (min 50%)</option>
                    </select>
                  </div>

                  {sel.badge!.badge_type === 'quiz_complete' && (
                    <div className="editor-field">
                      <label>Alege Quiz-ul asociat</label>
                      <select 
                        className="question-input" 
                        style={{ cursor: 'pointer', appearance: 'none' }}
                        value={sel.badge!.quiz_item_id || ''}
                        onChange={e => updateBadge(sel.badge!.id, 'quiz_item_id', e.target.value)}
                      >
                        <option value="">-- Selectează un quiz --</option>
                        {chapters.flatMap(ch => ch.items).filter(i => i.type === 'quiz').map(q => (
                          <option key={q.id} value={q.id}>{q.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <button 
                      onClick={saveAll}
                      disabled={saving}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--primary-gradient)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 14,
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 8px 20px rgba(41, 182, 246, 0.25)',
                        transition: '0.2s',
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      <Save size={18} />
                      {saving ? 'Se salvează...' : 'Salvează Insignă'}
                    </button>
                  </div>
                </div>

                {/* Badge Visual Preview */}
                <div style={{
                  background: 'rgba(13, 20, 38, 0.6)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 24,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  boxShadow: `0 8px 32px ${sel.badge!.color}10`
                }}>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, marginBottom: 20 }}>
                    Previzualizare
                  </span>
                  
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    border: `3px dashed ${sel.badge!.color}`,
                    boxShadow: `0 0 20px ${sel.badge!.color}20`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 20, position: 'relative', overflow: 'hidden'
                  }}>
                    {sel.badge!.image_url ? (
                      <img 
                        src={sel.badge!.image_url} 
                        alt="Badge Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ fontSize: 60 }}>{sel.badge!.icon || '🏆'}</span>
                    )}
                  </div>

                  <h4 style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                    {sel.badge!.title || 'Insignă Nouă'}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, marginBottom: 0 }}>
                    {sel.badge!.description || 'Descrierea insigniei va apărea aici.'}
                  </p>
                </div>
              </div>
            ) : sel?.item === null && sel?.chapter ? (
              /* Chapter Editor */
              <div className="chapter-title-editor">
                <div className="editor-field">
                  <label>Titlu Capitol</label>
                  <input
                    value={sel.chapter.title}
                    onChange={e => updateChapter(sel.chapter.id, 'title', e.target.value)}
                    placeholder="Ex: Introducere în React"
                  />
                </div>
                <div className="editor-field">
                  <label>Descriere Capitol</label>
                  <textarea
                    className="content-textarea"
                    style={{ minHeight: '120px' }}
                    value={sel.chapter.description}
                    onChange={e => updateChapter(sel.chapter.id, 'description', e.target.value)}
                    placeholder="O scurtă descriere a acestui capitol..."
                  />
                </div>
              </div>
            ) : sel?.item?.type === 'lesson' ? (
              /* Lesson Editor */
              <div className="lesson-editor">
                <div className="editor-field">
                  <label>Titlu Lecție</label>
                  <input
                    value={sel.item.title}
                    onChange={e => updateItem(sel.chapter!.id, sel.item!.id, 'title', e.target.value)}
                    placeholder="Ex: Ce este JSX?"
                    spellCheck={false}
                  />
                </div>
                <div className="editor-field">
                  <label>Conținut</label>
                  <div className="editor-textarea-wrapper">
                    <div className="lesson-toolbar">
                      <button type="button" className="tool-btn" title="Titlu 1" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('h1')}><strong>H1</strong></button>
                      <button type="button" className="tool-btn" title="Titlu 2" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('h2')}><strong>H2</strong></button>
                      <button type="button" className="tool-btn" title="Titlu 3" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('h3')}><strong>H3</strong></button>
                      <span className="tool-sep" />
                      <button type="button" className="tool-btn" title="Îngroșat" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('bold')}><strong>B</strong></button>
                      <button type="button" className="tool-btn" title="Italic" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('italic')}><em>I</em></button>
                      <span className="tool-sep" />
                      <button type="button" className="tool-btn" title="Listă cu puncte" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('ul')}>• Listă</button>
                      <button type="button" className="tool-btn" title="Listă numerotată" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('ol')}>1. Listă</button>
                      <button type="button" className="tool-btn" title="Citat" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('quote')}>❝</button>
                      <button type="button" className="tool-btn" title="Link" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('link')}>🔗</button>
                      <select
                        className="tool-lang"
                        value={codeLang}
                        onChange={e => setCodeLang(e.target.value)}
                        title="Limbajul de cod"
                      >
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="sql">SQL</option>
                        <option value="bash">Bash</option>
                        <option value="xml">XML</option>
                        <option value="markdown">Markdown</option>
                        <option value="plaintext">Text</option>
                      </select>
                      <button type="button" className="tool-btn tool-code" title="Bloc de cod" onMouseDown={e => e.preventDefault()} onClick={() => formatLesson('code')}>{'</>'}</button>
                    </div>
                    <textarea
                      ref={contentTextareaRef}
                      className="content-textarea"
                      spellCheck={false}
                      value={sel.item.content}
                      onChange={e => updateItem(sel.chapter!.id, sel.item!.id, 'content', e.target.value)}
                      placeholder="Scrie conținutul lecției aici... Selectează un text și apasă un buton pentru a-l formata. Pentru cod, folosește butonul </>."
                    />
                  </div>
                </div>
              </div>
            ) : sel?.item?.type === 'quiz' ? (
              /* Quiz Editor */
              <div className="quiz-editor">
                <div className="editor-field">
                  <label>Titlu Quiz</label>
                  <input
                    value={sel.item.title}
                    onChange={e => updateItem(sel.chapter!.id, sel.item!.id, 'title', e.target.value)}
                    placeholder="Ex: Test Capitol 1"
                  />
                </div>

                <div className="editor-field" style={{ marginTop: '16px' }}>
                  <label>Tip Activitate / Minigame</label>
                  <select
                    value={sel.item.quiz_type || 'classic'}
                    onChange={e => updateItem(sel.chapter!.id, sel.item!.id, 'quiz_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="classic" style={{ background: '#0d1426', color: 'white' }}>Grilă Clasic</option>
                    <option value="connect" style={{ background: '#0d1426', color: 'white' }}>Conectează Perechile</option>
                    <option value="truefalse" style={{ background: '#0d1426', color: 'white' }}>Adevărat sau Fals</option>
                    <option value="memory" style={{ background: '#0d1426', color: 'white' }}>Joc de Memorie</option>
                    <option value="scrambled" style={{ background: '#0d1426', color: 'white' }}>Litere Încurcate</option>
                  </select>
                </div>

                {(!sel.item.quiz_type || sel.item.quiz_type === 'classic') && (sel.item.questions || []).map((q, qIdx) => (
                  <div key={q.id} className="question-card">
                    <div className="question-header">
                      <span className="question-number">
                        <HelpCircle size={14} /> Întrebarea {qIdx + 1}
                      </span>
                      <button className="delete-question-btn" onClick={() => deleteQuestion(sel.chapter!.id, sel.item!.id, q.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      className="question-input"
                      value={q.question}
                      onChange={e => updateQuestion(sel.chapter!.id, sel.item!.id, q.id, e.target.value)}
                      placeholder="Scrie întrebarea..."
                    />

                    <div className="options-list">
                      {q.options.map((o, oIdx) => (
                        <div key={o.id} className="option-row">
                          <button
                            className={`correct-toggle ${o.is_correct ? 'is-correct' : ''}`}
                            onClick={() => toggleCorrect(sel.chapter!.id, sel.item!.id, q.id, o.id)}
                            title={o.is_correct ? 'Răspuns corect' : 'Marchează ca corect'}
                          >
                            <Check size={16} />
                          </button>
                          <input
                            value={o.text}
                            onChange={e => updateOption(sel.chapter!.id, sel.item!.id, q.id, o.id, 'text', e.target.value)}
                            placeholder={`Opțiunea ${oIdx + 1}`}
                          />
                          {q.options.length > 2 && (
                            <button className="remove-option-btn" onClick={() => deleteOption(sel.chapter!.id, sel.item!.id, q.id, o.id)}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button className="add-option-btn" onClick={() => addOption(sel.chapter!.id, sel.item!.id, q.id)}>
                      <Plus size={14} /> Adaugă Opțiune
                    </button>
                  </div>
                ))}

                {(sel.item.quiz_type === 'connect' || sel.item.quiz_type === 'memory') && (sel.item.questions || []).map((q, qIdx) => {
                  const firstOpt = q.options[0] || { id: crypto.randomUUID(), question_id: q.id, text: '', is_correct: true, order_index: 0 };
                  if (q.options.length === 0) {
                    q.options = [firstOpt];
                  } else if (q.options.length > 1) {
                    const correctOption = q.options.find(o => o.is_correct) || q.options[0];
                    q.options = [{ ...correctOption, is_correct: true }];
                  }

                  return (
                    <div key={q.id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">
                          {sel.item?.quiz_type === 'memory' ? <Layers size={14} /> : <Shuffle size={14} />} Perechea {qIdx + 1}
                        </span>
                        <button className="delete-question-btn" onClick={() => deleteQuestion(sel.chapter!.id, sel.item!.id, q.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="editor-field">
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Element Stânga (Card 1 / Întrebare)
                        </label>
                        <input
                          className="question-input"
                          value={q.question}
                          onChange={e => updateQuestion(sel.chapter!.id, sel.item!.id, q.id, e.target.value)}
                          placeholder="Ex: HTML sau Concept..."
                        />
                      </div>

                      <div className="editor-field" style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Element Dreapta (Card 2 / Răspuns Pereche)
                        </label>
                        <input
                          value={firstOpt.text}
                          onChange={e => updateOption(sel.chapter!.id, sel.item!.id, q.id, firstOpt.id, 'text', e.target.value)}
                          placeholder="Ex: HyperText Markup Language sau Definiție..."
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {sel.item.quiz_type === 'truefalse' && (sel.item.questions || []).map((q, qIdx) => {
                  let trueOpt = q.options.find(o => o.text === 'Adevărat');
                  let falseOpt = q.options.find(o => o.text === 'Fals');

                  if (!trueOpt || !falseOpt) {
                    const trueId = crypto.randomUUID();
                    const falseId = crypto.randomUUID();
                    trueOpt = { id: trueId, question_id: q.id, text: 'Adevărat', is_correct: true, order_index: 0 };
                    falseOpt = { id: falseId, question_id: q.id, text: 'Fals', is_correct: false, order_index: 1 };
                    q.options = [trueOpt, falseOpt];
                  }

                  const activeTrueOpt = trueOpt;
                  const activeFalseOpt = falseOpt;
                  const isStatementTrue = activeTrueOpt.is_correct;

                  const handleTfToggle = (isTrueCorrect: boolean) => {
                    updateOption(sel.chapter!.id, sel.item!.id, q.id, activeTrueOpt.id, 'is_correct', isTrueCorrect);
                    updateOption(sel.chapter!.id, sel.item!.id, q.id, activeFalseOpt.id, 'is_correct', !isTrueCorrect);
                  };

                  return (
                    <div key={q.id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">
                          <Play size={14} /> Afirmația {qIdx + 1}
                        </span>
                        <button className="delete-question-btn" onClick={() => deleteQuestion(sel.chapter!.id, sel.item!.id, q.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="editor-field">
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Afirmație / Enunț
                        </label>
                        <input
                          className="question-input"
                          value={q.question}
                          onChange={e => updateQuestion(sel.chapter!.id, sel.item!.id, q.id, e.target.value)}
                          placeholder="Ex: Soarele este o stea."
                        />
                      </div>

                      <div className="editor-field" style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Valoare Adevăr (Răspunsul Corect)
                        </label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                          <button
                            className="tf-btn"
                            onClick={() => handleTfToggle(true)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '12px',
                              background: isStatementTrue ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.02)',
                              border: isStatementTrue ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
                              color: isStatementTrue ? '#4ade80' : '#94a3b8',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: '0.2s'
                            }}
                          >
                            Adevărat
                          </button>
                          <button
                            className="tf-btn"
                            onClick={() => handleTfToggle(false)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '12px',
                              background: !isStatementTrue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                              border: !isStatementTrue ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                              color: !isStatementTrue ? '#f87171' : '#94a3b8',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: '0.2s'
                            }}
                          >
                            Fals
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sel.item.quiz_type === 'scrambled' && (sel.item.questions || []).map((q, qIdx) => {
                  const firstOpt = q.options[0] || { id: crypto.randomUUID(), question_id: q.id, text: '', is_correct: true, order_index: 0 };
                  if (q.options.length === 0) {
                    q.options = [firstOpt];
                  } else if (q.options.length > 1) {
                    const correctOption = q.options.find(o => o.is_correct) || q.options[0];
                    q.options = [{ ...correctOption, is_correct: true }];
                  }

                  return (
                    <div key={q.id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">
                          <Type size={14} /> Întrebarea {qIdx + 1}
                        </span>
                        <button className="delete-question-btn" onClick={() => deleteQuestion(sel.chapter!.id, sel.item!.id, q.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="editor-field">
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Întrebare / Indiciu
                        </label>
                        <input
                          className="question-input"
                          value={q.question}
                          onChange={e => updateQuestion(sel.chapter!.id, sel.item!.id, q.id, e.target.value)}
                          placeholder="Ex: Care este capitala Italiei?"
                        />
                      </div>

                      <div className="editor-field" style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                          Cuvânt Răspuns (Literele vor fi amestecate)
                        </label>
                        <input
                          value={firstOpt.text}
                          onChange={e => updateOption(sel.chapter!.id, sel.item!.id, q.id, firstOpt.id, 'text', e.target.value.replace(/[^A-Za-zĂÂÎȘȚăâîșț]/gi, ''))}
                          placeholder="Ex: ROMA (fără spații sau caractere speciale)"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                <button className="add-question-btn" onClick={() => addQuestion(sel.chapter!.id, sel.item!.id)}>
                  <Plus size={18} /> Adaugă Întrebare
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilderPage;
