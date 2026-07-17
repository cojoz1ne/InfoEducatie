'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, BookOpen, Play, Plus, X, Upload, Save,
  ChevronDown, Check, SearchX, Compass, ShieldCheck, Trash2, FolderOpen,
  ImagePlus, Link as LinkIcon, Loader2, Pencil, Tag, Users, CheckCircle
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import './courses.css';

type TabType = 'browse' | 'admin';

const CoursesPage = () => {
  const { user, profile, isTeacher, isApproved } = useAuth();
  const router = useRouter();
  const isAdmin = isTeacher && isApproved;

  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [filter, setFilter] = useState('Toate');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [courseRatings, setCourseRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [courseStats, setCourseStats] = useState<Record<string, { started: number; finished: number; totalAttempts: number }>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; courseId: string | null; courseTitle: string }>({
    isOpen: false,
    courseId: null,
    courseTitle: ''
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Informatică',
    image_url: ''
  });

  const categories = [
    'Toate',
    'Administrație Publică',
    'Afaceri & Management',
    'Anatomie',
    'Antreprenoriat',
    'Antropologie',
    'Arheologie',
    'Arhitectură',
    'Arte Dramatice & Teatru',
    'Arte Vizuale',
    'Astronomie',
    'Biochimie',
    'Biologie',
    'Botanică',
    'Chimie',
    'Cinema & Film',
    'Criminologie',
    'Cryptografie',
    'Cultură & Civilizație',
    'Cybersecuritate',
    'Design de Interior',
    'Design Grafic',
    'Design Industrial',
    'Drept & Legislație',
    'Ecologie & Mediu',
    'Economie',
    'Educație Fizică & Sport',
    'Electronică & Automatizări',
    'Farmacie',
    'Filologie',
    'Filosofie',
    'Finanțe & Bănci',
    'Fizică',
    'Fotografie',
    'Geografie',
    'Geologie',
    'Informatică',
    'Inginerie Civilă',
    'Inginerie Mecanică',
    'Inteligență Artificială',
    'Istorie',
    'Jurnalism & Media',
    'Limba Engleză',
    'Limba Franceză',
    'Limba Germană',
    'Limba Română',
    'Literatură',
    'Marketing & PR',
    'Matematică',
    'Medicină & Sănătate',
    'Mitologie',
    'Muzică',
    'Nutriție & Dietetică',
    'Oceanografie',
    'Pedagogie',
    'Programare Web',
    'Psihologie',
    'Robotică',
    'Relații Internaționale',
    'Sociologie',
    'Statistică',
    'Tehnologie & Inovație',
    'Teologie & Religie',
    'Turism & Ospitalitate',
    'Zoologie'
  ];

  useEffect(() => {
    initialFetch();
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isFilterOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle single alphabetical character keystrokes
      if (e.key.length !== 1 || !/[a-zA-ZăâîșțĂÂÎȘȚ]/i.test(e.key)) return;

      const targetChar = e.key.toUpperCase();
      const targetIndex = categories.findIndex(cat =>
        cat !== 'Toate' && cat.toUpperCase().startsWith(targetChar)
      );

      if (targetIndex !== -1) {
        const dropdownList = document.querySelector('.fusion-inner-v8');
        if (dropdownList) {
          const items = dropdownList.querySelectorAll('.fusion-item-v8');
          const targetElement = items[targetIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            targetElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen]);

  const initialFetch = async () => {
    setLoading(true);
    await fetchCourses();
    setLoading(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Eroare la preluarea cursurilor.');
      const data = await res.json();
      setCourses(data || []);

      const ratingsRes = await fetch('/api/courses/ratings');
      if (ratingsRes.ok) {
        const avgMap = await ratingsRes.json();
        setCourseRatings(avgMap);
      }

      const statsMap: Record<string, { started: number; finished: number; totalAttempts: number }> = {};
      await Promise.all(
        (data || []).map(async (c: any) => {
          try {
            const sRes = await fetch(`/api/courses/${c.id}/quiz-attempts`);
            if (sRes.ok) statsMap[c.id] = await sRes.json();
          } catch { /* ignore */ }
        })
      );
      setCourseStats(statsMap);
    } catch (err: any) {
      console.error('Error fetching courses:', err?.message || err);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Te rog selectează o imagine (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Imaginea trebuie să fie mai mică de 5MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Eroare la încărcarea imaginii.');
    const data = await res.json();
    return data.url;
  };

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    setNewCourse(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefreshing(true);
    try {
      let finalImageUrl = newCourse.image_url;

      // Upload file if user chose file upload mode
      if (imageMode === 'upload' && imageFile) {
        setIsUploading(true);
        finalImageUrl = await uploadImageToStorage(imageFile);
        setIsUploading(false);
      }

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourse.title,
          description: newCourse.description,
          category: newCourse.category,
          image_url: finalImageUrl
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Eroare la crearea cursului.');
      }
      setShowCreateForm(false);
      setNewCourse({ title: '', description: '', category: 'Informatică', image_url: '' });
      resetImageState();
      await fetchCourses();
    } catch (err: any) {
      console.error('Error creating course:', err);
      alert(`Eroare la crearea cursului: ${err.message || 'Verifică consola'}`);
      setIsUploading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Eroare la ștergerea cursului.');
      }
      await fetchCourses();
      setDeleteConfirm({ isOpen: false, courseId: null, courseTitle: '' });
    } catch (err: any) {
      alert(`Eroare: ${err.message}`);
    }
  };

  const filteredCourses = courses.filter(c => {
    const courseCat = (c as any).category || 'General';
    const matchesFilter = filter === 'Toate' || courseCat === filter;
    const matchesSearch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const myCourses = courses.filter(c => c.teacher_id === user?.id);

  return (
    <div className="courses-page-container" style={{ position: 'relative' }}>
      <div style={{
        filter: deleteConfirm.isOpen ? 'blur(10px)' : 'none',
        transition: 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: deleteConfirm.isOpen ? 'none' : 'auto'
      }}>
        {/* Tab Navigation - Only render if user is admin/approved teacher */}
        {isAdmin && (
          <div className="courses-tabs">
            <button
              className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <Compass size={18} />
              <span>Explorează</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <ShieldCheck size={18} />
              <span>Administrare</span>
              {myCourses.length > 0 && (
                <span className="tab-badge">{myCourses.length}</span>
              )}
            </button>
          </div>
        )}

        {/* ===== BROWSE TAB ===== */}
        {activeTab === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <header className="courses-header-v2">
              <div className="header-text-v2">
                <h1>Explorează <span className="gradient-text">Cunoașterea.</span></h1>
                <p>Descoperă cursuri reale create de profesori și experți din comunitatea EduWave.</p>
              </div>

              <div className="action-row-v2">
                <div className="search-filter-bar-v7 glass-premium">
                  <div className="search-input-v7">
                    <Search size={20} className="s-icon" />
                    <input
                      type="text"
                      placeholder="Caută cursuri sau subiecte..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="sep-v" />

                  <div className="filter-fusion-container" ref={filterRef}>
                    <button
                      className={`filter-trigger-v8 ${isFilterOpen ? 'fused' : ''}`}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <div className="trigger-content">
                        <Filter size={18} className="f-icon" />
                        <span>{filter}</span>
                      </div>
                      <ChevronDown size={16} className={`chevron ${isFilterOpen ? 'rotate' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isFilterOpen && (
                        <motion.div
                          key="filter-dropdown"
                          className="dropdown-fusion-list-v8"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ duration: 0.1 }}
                          style={{ originY: 0 }}
                        >
                          <div className="fusion-inner-v8">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                className={`fusion-item-v8 ${filter === cat ? 'selected' : ''}`}
                                onClick={() => {
                                  setFilter(cat);
                                  setIsFilterOpen(false);
                                }}
                              >
                                <span>{cat}</span>
                                {filter === cat && <Check size={14} className="check-icon" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </header>

            <div className="courses-grid-v2">
              {loading ? (
                <div className="loading-state">Se încarcă cursurile...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="empty-state-card glass-premium">
                  <div className="empty-icon-box"><SearchX size={36} /></div>
                  <h2>Niciun curs găsit</h2>
                  <p>Nu am găsit rezultate pentru căutarea ta. Încearcă să schimbi filtrele sau să cauți altceva.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilter('Toate'); }}
                    className="reset-action-btn"
                  >
                    Resetează Filtrele
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, idx) => {
                    const isCompleted = course.progress === 100;
                    return (
                      <motion.div
                        key={course.id}
                        layout
                        className={`course-card-premium glass-premium ${isCompleted ? 'completed' : ''}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: idx * 0.03
                        }}
                      >
                        <div className="card-top" style={{ backgroundImage: `url("${course.image_url || 'https://images.unsplash.com/photo-1501504905953-f87540c3081c?w=800'}")` }} />

                        <div className="card-body">
                          <h3>{course.title}</h3>
                          <p className="course-desc">{course.description?.substring(0, 80)}...</p>
                          <div className="card-footer">
                            <div className="foot-stat"><Star size={14} className="star-gold" fill="#fbbf24" /> {courseRatings[course.id]?.avg?.toFixed(1) || 'N/A'}</div>
                            <div className="foot-stat"><BookOpen size={14} /> {course.teacher_name || 'Profesor'}</div>
                            <span className="cat-badge"><Tag size={13} /> {(course as any).category || 'General'}</span>
                          </div>
                          <button className="enroll-btn-v2" onClick={() => router.push(`/courses/${course.id}`)}>Accesează Curs</button>
                        </div>

                        {isCompleted && (
                          <img
                            src="/chapter-complete-mascot.png"
                            alt="Curs Finalizat"
                            className="card-complete-badge"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== ADMIN TAB ===== */}
        {activeTab === 'admin' && isAdmin && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-panel"
          >
            <div className="admin-header-row">
              <div>
                <h2>Administrare <span className="gradient-text">Cursuri</span></h2>
                <p>Creează și gestionează cursurile tale din acest panou.</p>
              </div>
              {!showCreateForm && (
                <button className="admin-create-btn" onClick={() => setShowCreateForm(true)}>
                  <Plus size={20} />
                  <span>Curs Nou</span>
                </button>
              )}
            </div>

            {/* Create Form (inline, expandable) */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  className="create-form-card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>Creează un <span className="gradient-text">Curs Nou</span></h3>
                  <form onSubmit={handleCreateCourse} className="create-form">
                    <div className="form-group">
                      <label>Titlu Curs</label>
                      <input
                        required type="text" placeholder="Ex: React pentru Începători"
                        value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                        autoComplete="off"
                      />
                    </div>

                    <div className="form-group">
                      <label>Categorie</label>
                      <select
                        className="modal-select"
                        value={newCourse.category}
                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                      >
                        {categories.filter(c => c !== 'Toate').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Descriere Scurtă</label>
                      <textarea
                        rows={3} placeholder="Despre ce este acest curs?"
                        value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Imagine Copertă</label>
                      <div className="image-mode-toggle">
                        <button
                          type="button"
                          className={`mode-btn ${imageMode === 'upload' ? 'active' : ''}`}
                          onClick={() => setImageMode('upload')}
                        >
                          <ImagePlus size={16} />
                          <span>Încarcă Fișier</span>
                        </button>
                        <button
                          type="button"
                          className={`mode-btn ${imageMode === 'url' ? 'active' : ''}`}
                          onClick={() => setImageMode('url')}
                        >
                          <LinkIcon size={16} />
                          <span>Link URL</span>
                        </button>
                      </div>

                      {imageMode === 'upload' ? (
                        <div
                          className={`upload-drop-zone ${imagePreview ? 'has-preview' : ''}`}
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelect(file);
                            }}
                          />
                          {imagePreview ? (
                            <div className="upload-preview">
                              <img src={imagePreview} alt="Preview" />
                              <div className="preview-overlay">
                                <button
                                  type="button"
                                  className="remove-preview-btn"
                                  onClick={(e) => { e.stopPropagation(); resetImageState(); }}
                                >
                                  <X size={16} />
                                  <span>Elimină</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-placeholder">
                              <Upload size={32} />
                              <p>Trage o imagine aici sau <span className="upload-link">alege un fișier</span></p>
                              <span className="upload-hint">JPG, PNG, WebP • Max 5MB</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="url-input">
                            <LinkIcon size={18} />
                            <input
                              type="text" placeholder="https://images.unsplash.com/..."
                              value={newCourse.image_url}
                              onChange={e => setNewCourse({ ...newCourse, image_url: e.target.value })}
                            />
                          </div>
                          {newCourse.image_url && (
                            <div className="url-preview">
                              <img
                                src={newCourse.image_url}
                                alt="Preview"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>Anulează</button>
                      <button type="submit" className="submit-course-btn" disabled={isRefreshing || isUploading}>
                        {(isRefreshing || isUploading) ? <Loader2 size={20} className="spin-icon" /> : <Save size={20} />}
                        <span>{isUploading ? 'Se încarcă imaginea...' : isRefreshing ? 'Se salvează...' : 'Salvează Cursul'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* My Courses List */}
            <div className="my-courses-section">
              <h3>Cursurile Mele ({myCourses.length})</h3>
              {myCourses.length === 0 ? (
                <div className="admin-empty">
                  <FolderOpen size={48} />
                  <p>Nu ai creat niciun curs încă. Apasă &quot;Curs Nou&quot; pentru a începe.</p>
                </div>
              ) : (
                <div className="my-courses-list">
                  {myCourses.map(course => (
                    <motion.div
                      key={course.id}
                      className="my-course-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      <div
                        className="my-course-thumb"
                        style={{ backgroundImage: `url("${course.image_url || 'https://images.unsplash.com/photo-1501504905953-f87540c3081c?w=800'}")` }}
                      />
                      <div className="my-course-info">
                        <h4>{course.title}</h4>
                        <span>{course.description?.substring(0, 60) || 'Fără descriere'}...</span>
                      </div>
                      <div className="my-course-stats">
                        <div className="mc-stat" title="Persoane care au intrat pe test">
                          <Users size={14} />
                          <span>{courseStats[course.id]?.started ?? 0}</span>
                        </div>
                        <div className="mc-stat" title="Persoane care au finalizat testul">
                          <CheckCircle size={14} />
                          <span>{courseStats[course.id]?.finished ?? 0}</span>
                        </div>
                        <div className="mc-stat" title="Rating mediu">
                          <Star size={14} className="star-gold" fill="#fbbf24" />
                          <span>{courseRatings[course.id]?.avg ? courseRatings[course.id].avg.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                      <button className="edit-course-btn" onClick={() => router.push(`/courses/${course.id}/edit`)}>
                        <Pencil size={16} />
                      </button>
                      <button className="delete-course-btn" onClick={() => setDeleteConfirm({ isOpen: true, courseId: course.id, courseTitle: course.title })}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            pointerEvents: 'auto'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: 420,
                background: 'rgba(13, 20, 38, 0.95)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Soft red glow */}
              <div style={{
                position: 'absolute', top: -60, left: -60, width: 150, height: 150,
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0) 100%)',
                borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none'
              }} />

              {/* Header / Warning */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Trash2 size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'white', fontSize: 16, fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.2px' }}>
                    Șterge Cursul
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>
                    Ești sigur că vrei să ștergi cursul <strong style={{ color: '#ef4444' }}>&quot;{deleteConfirm.courseTitle}&quot;</strong>?
                  </p>
                  <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.4, marginTop: 12, marginBottom: 0 }}>
                    Această acțiune este permanentă și va șterge toate datele asociate cursului, inclusiv lecțiile și testele create.
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                position: 'relative',
                zIndex: 1
              }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ isOpen: false, courseId: null, courseTitle: '' })}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#cbd5e1',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  Anulează
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteConfirm.courseId) handleDeleteCourse(deleteConfirm.courseId);
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 12,
                    border: 'none',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                  }}
                >
                  <Trash2 size={14} />
                  <span>Șterge Curs</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;
