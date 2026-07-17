'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  Tag,
  Pencil,
  AlertCircle
} from 'lucide-react';
import './calendar.css';

interface CalendarEventData {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  type: string;
  color: string;
}

const formatMinutesToTime = (val: number) => {
  const hours = Math.floor(val);
  const minutes = (val % 1) === 0 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const parseTimeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h + (m === 30 ? 0.5 : 0);
};

// Generate time options at 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const min of ['00', '30']) {
      const hStr = hour.toString().padStart(2, '0');
      options.push(`${hStr}:${min}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();
const ACTIVITY_TYPES = ['Studiu', 'Examen', 'Focus', 'Altceva'];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [startValue, setStartValue] = useState(9); // 09:00
  const [endValue, setEndValue] = useState(10); // 10:00
  const [newType, setNewType] = useState('Studiu');
  const [customType, setCustomType] = useState('');
  const [newColor, setNewColor] = useState('#1e6fd9');
  const [submitting, setSubmitting] = useState(false);

  // Refs for tracking programmatically triggered scroll to avoid event fight
  const isScrollingProgrammaticallyStart = useRef(false);
  const isScrollingProgrammaticallyEnd = useRef(false);
  const scrollTimeoutStart = useRef<any>(null);
  const scrollTimeoutEnd = useRef<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to center item in viewport programmatically
  const centerItemInViewport = (vp: HTMLElement, val: number) => {
    const timeStr = formatMinutesToTime(val);
    const activeItem = Array.from(vp.querySelectorAll('.wheel-item')).find(
      item => item.textContent?.trim() === timeStr
    );
    if (activeItem) {
      const vpHeight = vp.clientHeight;
      const itemTop = (activeItem as HTMLElement).offsetTop;
      const itemHeight = (activeItem as HTMLElement).clientHeight;
      vp.scrollTo({
        top: itemTop - vpHeight / 2 + itemHeight / 2,
        behavior: 'smooth'
      });
    }
  };

  // Center elements when modal opens or edit targets change
  useEffect(() => {
    if (showAddModal) {
      const timer = setTimeout(() => {
        const viewports = document.querySelectorAll('.wheel-scroll-viewport');
        if (viewports[0]) {
          isScrollingProgrammaticallyStart.current = true;
          centerItemInViewport(viewports[0] as HTMLElement, startValue);
          setTimeout(() => { isScrollingProgrammaticallyStart.current = false; }, 500);
        }
        if (viewports[1]) {
          isScrollingProgrammaticallyEnd.current = true;
          centerItemInViewport(viewports[1] as HTMLElement, endValue);
          setTimeout(() => { isScrollingProgrammaticallyEnd.current = false; }, 500);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showAddModal]);

  const handleStartValueChange = (val: number) => {
    setStartValue(val);
    if (val >= endValue) {
      const nextEnd = Math.min(val + 0.5, 24);
      setEndValue(nextEnd);
      // Auto-scroll end viewport to match
      const viewports = document.querySelectorAll('.wheel-scroll-viewport');
      if (viewports[1]) {
        isScrollingProgrammaticallyEnd.current = true;
        centerItemInViewport(viewports[1] as HTMLElement, nextEnd);
        setTimeout(() => { isScrollingProgrammaticallyEnd.current = false; }, 500);
      }
    }
  };

  const handleEndValueChange = (val: number) => {
    if (val <= startValue) return;
    setEndValue(val);
  };

  // Debounced scroll listener to detect center element and set value
  const handleScrollStart = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingProgrammaticallyStart.current) return;
    const vp = e.currentTarget;

    if (scrollTimeoutStart.current) clearTimeout(scrollTimeoutStart.current);
    scrollTimeoutStart.current = setTimeout(() => {
      const vpHeight = vp.clientHeight;
      const scrollTop = vp.scrollTop;
      const items = vp.querySelectorAll('.wheel-item');
      let closestItem: HTMLElement | null = null;
      let minDistance = Infinity;

      items.forEach(item => {
        const htmlItem = item as HTMLElement;
        const itemCenter = htmlItem.offsetTop + htmlItem.clientHeight / 2;
        const vpCenter = scrollTop + vpHeight / 2;
        const distance = Math.abs(itemCenter - vpCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = htmlItem;
        }
      });

      if (closestItem) {
        const text = (closestItem as HTMLElement).textContent || '';
        const val = parseTimeToMinutes(text);
        if (val !== startValue) {
          handleStartValueChange(val);
        }
      }
    }, 150);
  };

  const handleScrollEnd = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingProgrammaticallyEnd.current) return;
    const vp = e.currentTarget;

    if (scrollTimeoutEnd.current) clearTimeout(scrollTimeoutEnd.current);
    scrollTimeoutEnd.current = setTimeout(() => {
      const vpHeight = vp.clientHeight;
      const scrollTop = vp.scrollTop;
      const items = vp.querySelectorAll('.wheel-item');
      let closestItem: HTMLElement | null = null;
      let minDistance = Infinity;

      items.forEach(item => {
        const htmlItem = item as HTMLElement;
        const itemCenter = htmlItem.offsetTop + htmlItem.clientHeight / 2;
        const vpCenter = scrollTop + vpHeight / 2;
        const distance = Math.abs(itemCenter - vpCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = htmlItem;
        }
      });

      if (closestItem) {
        const text = (closestItem as HTMLElement).textContent || '';
        const val = parseTimeToMinutes(text);
        const isDisabled = val <= startValue;
        if (!isDisabled && val !== endValue) {
          handleEndValueChange(val);
        } else if (isDisabled) {
          // If stopped on disabled, force scroll back to a valid selection
          isScrollingProgrammaticallyEnd.current = true;
          centerItemInViewport(vp, endValue);
          setTimeout(() => { isScrollingProgrammaticallyEnd.current = false; }, 500);
        }
      }
    }, 150);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setNewTitle('');
    setNewDescription('');
    setStartValue(9);
    setEndValue(10);
    setNewType('Studiu');
    setCustomType('');
    setNewColor('#1e6fd9');
    setShowAddModal(true);
  };

  const handleStartEdit = (evt: CalendarEventData) => {
    setEditingEventId(evt.id);
    setNewTitle(evt.title);
    setNewDescription(evt.description || '');
    setStartValue(parseTimeToMinutes(evt.start_time));
    setEndValue(parseTimeToMinutes(evt.end_time));
    setNewType(ACTIVITY_TYPES.includes(evt.type) && evt.type !== 'Altceva' ? evt.type : 'Altceva');
    setCustomType(ACTIVITY_TYPES.includes(evt.type) ? '' : evt.type);
    setNewColor(evt.color);
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedType = newType === 'Altceva' ? customType.trim() : newType;
    if (!newTitle.trim() || !selectedType) return;

    setSubmitting(true);
    try {
      const payload = {
        title: newTitle,
        description: newDescription,
        date: selectedDate,
        start_time: formatMinutesToTime(startValue),
        end_time: formatMinutesToTime(endValue),
        type: selectedType,
        color: newColor
      };

      if (editingEventId) {
        // Edit Mode
        const res = await fetch('/api/calendar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEventId, ...payload })
        });

        if (res.ok) {
          const updatedEvent = await res.json();
          setEvents(events.map(evt => evt.id === editingEventId ? updatedEvent : evt));
          setShowAddModal(false);
        }
      } else {
        // Add Mode
        const res = await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const addedEvent = await res.json();
          setEvents([...events, addedEvent]);
          setShowAddModal(false);
        }
      }
    } catch (err) {
      console.error('Error saving event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setDeleteConfirmId(eventId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/calendar?id=${deleteConfirmId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setEvents(events.filter(evt => evt.id !== deleteConfirmId));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Helper calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter(evt => evt.date === dateStr);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'Studiu': return { bg: 'rgba(30, 111, 217, 0.15)', text: '#29b6f6' };
      case 'Examen': return { bg: 'rgba(229, 57, 53, 0.15)', text: '#ef5350' };
      case 'Focus': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' };
      default: return { bg: 'rgba(142, 68, 173, 0.15)', text: '#af7ac5' };
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isPastDate = selectedDate < todayStr;

  return (
    <div className="calendar-page-wrapper">
      <div className="calendar-grid-container">

        {/* Left Side: The Calendar Matrix */}
        <div className="calendar-card-panel glass-premium">
          <div className="calendar-header-controls">
            <h2>{monthNames[month]} {year}</h2>
            <div className="month-nav-btns">
              <button onClick={handlePrevMonth} className="nav-arrow"><ChevronLeft size={20} /></button>
              <button onClick={handleNextMonth} className="nav-arrow"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="weekday-labels">
            {['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'].map((day, idx) => (
              <div key={idx} className="weekday-label">{day}</div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="calendar-day-cell empty"></div>;

              const dateStr = day.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              const dayEvents = getEventsForDate(dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`calendar-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <div className="day-event-dots">
                    {dayEvents.slice(0, 3).map((evt, eIdx) => (
                      <span
                        key={evt.id || eIdx}
                        className="event-dot"
                        style={{ backgroundColor: evt.color }}
                      ></span>
                    ))}
                    {dayEvents.length > 3 && <span className="event-dot-more">+</span>}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="day-hover-preview">
                      {dayEvents.slice(0, 3).map((evt, eIdx) => (
                        <div key={evt.id || eIdx} className="preview-item">
                          <span className="preview-dot" style={{ backgroundColor: evt.color }}></span>
                          <div className="preview-text">
                            <span className="preview-title">{evt.title}</span>
                            <span className="preview-time">{evt.start_time} - {evt.end_time}</span>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="preview-more">+{dayEvents.length - 3} mai multe</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Day Details & Planned Activities */}
        <div className="details-card-panel glass-premium">
          <div className="details-header">
            <div>
              <h3>Activități</h3>
              <p className="selected-date-text">
                {new Date(selectedDate).toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            {!isPastDate && (
              <button className="add-activity-btn" onClick={handleOpenAddModal}>
                <Plus size={16} />
                <span>Adaugă</span>
              </button>
            )}
          </div>

          <div className="activities-list-container">
            {loading ? (
              <div className="loader-box">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  style={{ width: 30, height: 30, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#29b6f6', borderRadius: '50%' }}
                />
              </div>
            ) : selectedDateEvents.length === 0 ? (
              <div className="empty-activities">
                <CalendarIcon size={40} className="empty-icon" />
                <p>Nicio activitate programată pentru această zi.</p>
                {!isPastDate ? (
                  <button className="schedule-prompt-btn" onClick={handleOpenAddModal}>
                    Planifică acum
                  </button>
                ) : (
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '6px' }}>
                    Nu poți planifica activități în trecut.
                  </p>
                )}
              </div>
            ) : (
              <div className="activities-list">
                {selectedDateEvents.map((evt) => {
                  const badge = getEventBadgeColor(evt.type);
                  return (
                    <div
                      key={evt.id}
                      className="activity-item-card glass-premium"
                      style={{ background: `${evt.color}0d`, borderColor: `${evt.color}20` }}
                    >
                      <div className="activity-card-body">
                        <div className="activity-card-header">
                          <span className="activity-badge" style={{ background: badge.bg, color: badge.text }}>
                            {evt.type}
                          </span>
                          <div className="activity-action-btns">
                            <button className="activity-edit-btn" onClick={() => handleStartEdit(evt)}>
                              <Pencil size={13} />
                            </button>
                            <button className="activity-delete-btn" onClick={() => handleDeleteEvent(evt.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <h4>{evt.title}</h4>
                        {evt.description && <p className="activity-desc">{evt.description}</p>}
                        <div className="activity-time-info">
                          <Clock size={12} />
                          <span>{evt.start_time} - {evt.end_time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Activity Modal Popup */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setShowAddModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-premium"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '420px', padding: '24px' }}
            >
              <div className="modal-header">
                <h3>{editingEventId ? 'Editare Activitate' : 'Programare Activitate'}</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="add-event-form">
                <div className="form-group">
                  <label>Titlu Activitate</label>
                  <input
                    type="text"
                    placeholder="Ex: Curs Matematică - Analiză"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descriere (Opțional)</label>
                  <textarea
                    placeholder="Detalii suplimentare sau notițe..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    rows={2}
                    maxLength={50}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Custom Phone Roller Wheel Time Picker */}
                <div className="form-group">
                  <label>Interval Orar (Derulează/Click)</label>

                  <div className="wheel-time-picker-wrapper">

                    {/* Start Time Column */}
                    <div className="wheel-time-column">
                      <span className="wheel-column-title">Începe la</span>
                      <div className="wheel-scroll-viewport" onScroll={handleScrollStart}>
                        <div className="wheel-selection-highlight"></div>
                        <div className="wheel-scroll-items">
                          {TIME_OPTIONS.map((time) => {
                            const val = parseTimeToMinutes(time);
                            const isActive = startValue === val;
                            return (
                              <div
                                key={`start-${time}`}
                                className={`wheel-item ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                  isScrollingProgrammaticallyStart.current = true;
                                  handleStartValueChange(val);
                                  const vp = document.querySelectorAll('.wheel-scroll-viewport')[0];
                                  if (vp) centerItemInViewport(vp as HTMLElement, val);
                                  setTimeout(() => { isScrollingProgrammaticallyStart.current = false; }, 500);
                                }}
                              >
                                {time}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* End Time Column */}
                    <div className="wheel-time-column">
                      <span className="wheel-column-title">Se termină la</span>
                      <div className="wheel-scroll-viewport" onScroll={handleScrollEnd}>
                        <div className="wheel-selection-highlight"></div>
                        <div className="wheel-scroll-items">
                          {TIME_OPTIONS.map((time) => {
                            const val = parseTimeToMinutes(time);
                            const isActive = endValue === val;
                            const isDisabled = val <= startValue;
                            return (
                              <div
                                key={`end-${time}`}
                                className={`wheel-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                onClick={() => {
                                  if (isDisabled) return;
                                  isScrollingProgrammaticallyEnd.current = true;
                                  handleEndValueChange(val);
                                  const vp = document.querySelectorAll('.wheel-scroll-viewport')[1];
                                  if (vp) centerItemInViewport(vp as HTMLElement, val);
                                  setTimeout(() => { isScrollingProgrammaticallyEnd.current = false; }, 500);
                                }}
                              >
                                {time}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tip Activitate</label>
                    <div className="type-selector-row">
                      {ACTIVITY_TYPES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => {
                            setNewType(t);
                            if (t !== 'Altceva') setCustomType('');
                          }}
                          className={`type-pill ${newType === t ? 'active' : ''}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {newType === 'Altceva' && (
                      <input
                        type="text"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        placeholder="Scrie tipul activității"
                        className="custom-type-input"
                        maxLength={40}
                        required
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label>Culoare Indicator</label>
                    <div className="color-presets-row">
                      {['#1e6fd9', '#e53935', '#4dd0e1', '#4527a0', '#2e7d32'].map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setNewColor(c)}
                          className={`color-preset-circle ${newColor === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-event-btn" disabled={submitting}>
                  {submitting ? 'Se salvează...' : (editingEventId ? 'Salvează Modificările' : 'Adaugă Activitate')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal Popup */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            key="confirm-overlay"
            className="calendar-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              key="confirm-card"
              className="calendar-confirm-card glass-premium"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef5350',
                marginBottom: 4
              }}>
                <AlertCircle size={24} />
              </div>
              <h3>Ștergere Activitate</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5 }}>
                Ești sigur că vrei să ștergi această activitate programată? Această acțiune nu poate fi anulată.
              </p>
              <div className="confirm-buttons">
                <button type="button" className="confirm-btn-cancel" onClick={() => setDeleteConfirmId(null)}>
                  Anulează
                </button>
                <button type="button" className="confirm-btn-danger" onClick={handleConfirmDelete}>
                  Șterge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;
