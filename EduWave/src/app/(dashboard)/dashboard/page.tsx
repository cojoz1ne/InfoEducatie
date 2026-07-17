'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Play,
  Calendar,
  Sparkles,
  Plus,
  Target,
  Zap,
  X,
  Trophy,
  User,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [greetingSubtitle, setGreetingSubtitle] = useState('Ești pregătit să înveți ceva nou astăzi?');
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEventData[]>([]);

  // Data States
  const [statsData, setStatsData] = useState({
    avgScore: 0,
    scoreHistory: [] as any[],
    totalStudyTime: 0,
    timeHistory: [] as any[],
    courseCount: 0,
    hasEnrolled: false,
    badges: [] as any[],
    streak: 0,
    activeDaysThisWeek: [false, false, false, false, false, false, false]
  });

  const [activeCourses, setActiveCourses] = useState<any[]>([]);

  // Automated quests evaluated based on real database statistics
  const quests = [
    { id: 1, text: 'Studiază cel puțin 15 minute', icon: Clock, completed: statsData.totalStudyTime >= 15 },
    { id: 2, text: 'Finalizează cel puțin un quiz', icon: Target, completed: statsData.scoreHistory.length > 0 },
    { id: 3, text: 'Înscrie-te la minimum un curs', icon: BookOpen, completed: statsData.hasEnrolled },
  ];
  const completedQuests = quests.filter(q => q.completed).length;

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchUpcomingEvents();
      const endSession = startStudySession();
      return () => {
        if (endSession) endSession();
      };
    }
  }, [user]);

  useEffect(() => {
    const subtitles = [
      'Ești pregătit să înveți ceva nou astăzi?',
      'Fiecare lecție parcursă te duce mai aproape de obiectivele tale!',
      'O zi excelentă pentru a acumula cunoștințe noi!',
      'Cunoașterea este singura comoară care crește atunci când o împarți.',
      'Mintea ta este o pânză, iar educația este vopseaua. Haideți să pictăm!',
      'Succesul se construiește pas cu pas, zi de zi.',
      'Fii curios, pune întrebări și explorează noi orizonturi!',
      'Educația deschide uși pe care nici nu știai că le ai în față.',
      'Progresul tău este cea mai mare realizare. Să continuăm!',
      'Învață cu pasiune și transformă-ți ideile în realitate.'
    ];
    const randomIndex = Math.floor(Math.random() * subtitles.length);
    setGreetingSubtitle(subtitles[randomIndex]);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Dashboard API returned ${res.status}:`, errorBody);
        throw new Error(`Eroare la preluarea datelor panoului. (Status: ${res.status})`);
      }
      const data = await res.json();

      setActiveCourses(data.activeCourses || []);
      setStatsData({
        avgScore: data.avgScore || 0,
        scoreHistory: data.scoreHistory || [],
        totalStudyTime: data.totalStudyTime || 0,
        timeHistory: data.timeHistory || [],
        courseCount: data.courseCount || 0,
        hasEnrolled: data.hasEnrolled || false,
        badges: data.badges || [],
        streak: data.streak || 0,
        activeDaysThisWeek: data.activeDaysThisWeek || [false, false, false, false, false, false, false]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        const todayStr = new Date().toISOString().split('T')[0];
        // Filter events that are today or in the future
        const futureEvents = data.filter((evt: any) => evt.date >= todayStr);
        // Sort and take top 3
        const sorted = futureEvents.sort((a: any, b: any) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.start_time.localeCompare(b.start_time);
        }).slice(0, 3);
        setUpcomingEvents(sorted);
      }
    } catch (err) {
      console.error('Error fetching calendar events for dashboard:', err);
    }
  };

  const startStudySession = () => {
    let sessionId: string | null = null;
    let startTime = new Date();

    const init = async () => {
      const res = await fetch('/api/dashboard/study-session', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        sessionId = data.id;
      }
    };

    init();

    return async () => {
      if (sessionId) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
        await fetch('/api/dashboard/study-session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, duration })
        });
      }
    };
  };

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    return `${(mins / 60).toFixed(1)}h`;
  };

  const stats = [
    { id: 'score', icon: <Target size={20} />, label: 'Scor Mediu', value: `${statsData.avgScore}%`, color: '#29b6f6', trend: 'Istoric', image: '/images/score-icon.png' },
    { id: 'time', icon: <Clock size={20} />, label: 'Timp Studiu', value: formatTime(statsData.totalStudyTime), color: '#4dd0e1', trend: '14 zile', image: '/images/study-icon.png' },
    { id: 'courses', icon: <BookOpen size={20} />, label: 'Cursuri', value: statsData.courseCount.toString(), color: '#1e6fd9', trend: 'Active', link: '/courses', image: '/images/courses-icon.png' },
    { id: 'badges', icon: <Award size={20} />, label: 'Insigne', value: statsData.badges.length.toString(), color: '#4527a0', trend: 'Colecție', link: '/badges', image: '/images/badges-icon.png' },
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <motion.div className="welcome-box" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1>Salut, <span className="gradient-text">{(user?.full_name ? user.full_name.split(' ').slice(1).join(' ') : 'Elev')} !</span></h1>
          <p>{loading ? 'Se încarcă progresul tău...' : greetingSubtitle}</p>
        </motion.div>
      </header>

      <div className="dashboard-grid">
        <div className="left-col">
          <section className="stats-container">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx} className="stat-card glass-premium"
                onClick={() => stat.link ? window.location.href = stat.link : setActiveModal(stat.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat-content">
                  <span className="s-label">{stat.label}</span>
                  <div className="s-value-wrap">
                    <span className="s-value">{stat.value}</span>
                    <span className="s-trend gradient-text">{stat.trend}</span>
                  </div>
                </div>
                {stat.image && <img src={stat.image} alt="" className={`stat-card-img stat-card-img-${stat.id}`} />}
              </motion.div>
            ))}
          </section>

          <div className="dashboard-middle-section">
            <div className="courses-column">
              <div className="section-title-wrap courses-section-title">
                <h2>Progres Curent</h2>
              </div>

              <div className="courses-grid">
                {activeCourses.length === 0 ? (
                  <div className="empty-courses glass-premium" style={{ position: 'relative', overflow: 'visible' }}>
                    <div className="empty-courses-watermark-wrapper">
                      <img src="/images/empty-courses-icon.png" alt="" className="empty-courses-icon-watermark" />
                    </div>
                    <img src="/images/empty-courses-icon.png" alt="Empty Courses" className="empty-courses-foreground-img" />
                    <div className="empty-courses-content" style={{ zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <BookOpen size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                      <p>Nu ești înscris la niciun curs momentan.</p>
                      <Link href="/courses" className="browse-btn">Explorează Catalogul</Link>
                    </div>
                  </div>
                ) : (
                  activeCourses.slice(0, 2).map((course, idx) => (
                    <Link href={`/courses/${course.id}`} key={idx} style={{ textDecoration: 'none' }}>
                      <motion.div className="course-card-v2 glass-premium">
                        <div className="card-thumb">
                          <img src={course.image} alt="" className="thumb-img" />
                          <div className="time-tag">{course.timeLeft}</div>
                        </div>
                        <div className="card-info">
                          <div className="info-top">
                            <span className="badge"><span className="badge-dot"></span>ÎN CURS</span>
                            <span className="teacher-name">{course.teacher}</span>
                          </div>
                          <h3>{course.title}</h3>
                          <div className="progress-section">
                            <div className="progress-labels"><span>Progres</span><span>{course.progress}%</span></div>
                            <div className="p-bar-container">
                              <div
                                className="p-bar-fill"
                                style={{
                                  width: `${course.progress}%`,
                                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Dynamic Study Planner upcoming activities (Low-Height Compact List rows) */}
            <div className="planner-section">
              <div className="section-title-wrap planner-section-title">
                <h2>Următoarele Activități</h2>
              </div>
              <div className="planner-content-wrapper">
                {upcomingEvents.length === 0 && (
                  <div className="planner-watermark-wrapper">
                    <img src="/images/calendar-icon.png" alt="" className="planner-calendar-watermark" />
                  </div>
                )}
                {upcomingEvents.length === 0 ? (
                  <div className="empty-planner glass-premium">
                    <Calendar size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p>Nu ai nicio activitate planificată în calendar.</p>
                    <Link href="/calendar" className="planner-direct-btn">Planifică o activitate</Link>
                  </div>
                ) : (
                  <div className="upcoming-activities-list">
                    {upcomingEvents.map((evt) => (
                      <Link href="/calendar" key={evt.id} style={{ textDecoration: 'none' }}>
                        <div
                          className="upcoming-activity-item glass-premium"
                          style={{ '--activity-color': evt.color } as React.CSSProperties}
                        >
                          {(() => {
                            const activityDate = new Date(`${evt.date}T00:00:00`);
                            return (
                              <>
                                <div className="activity-date-block" style={{ '--activity-color': evt.color } as React.CSSProperties}>
                                  <span>{activityDate.toLocaleDateString('ro-RO', { day: 'numeric' })}</span>
                                  <small>{activityDate.toLocaleDateString('ro-RO', { month: 'short' }).replace('.', '')}</small>
                                </div>
                              </>
                            );
                          })()}
                          <div className="activity-main-content">
                            <div className="activity-info-row">
                              <h4>{evt.title}</h4>
                              <span className="activity-badge-tag" style={{ background: `${evt.color}15`, color: evt.color }}>
                                {evt.type}
                              </span>
                            </div>
                            <div className="activity-meta-row">
                              <Clock size={12} />
                              <span>{new Date(evt.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })} • {evt.start_time} - {evt.end_time}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {upcomingEvents.length === 0 && (
                  <img src="/images/calendar-icon.png" alt="Calendar" className="planner-calendar-img" />
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-bottom-image-row">
            <div className="courses-bottom-image-container">
              <a href="https://rhqnetwork.biz" target="_blank" rel="noopener noreferrer" className="courses-bottom-image-link">
                <img src="/images/image.png" alt="Bottom Banner" className="courses-bottom-image" />
              </a>
            </div>
            <div className="courses-bottom-image-container">
              <a href="https://discord.gg/twaxxvrp" target="_blank" rel="noopener noreferrer" className="courses-bottom-image-link">
                <img src="/images/discord_banner.png" alt="Discord Banner" className="courses-bottom-image" />
              </a>
            </div>
          </div>
        </div>

        <aside className="right-col">
          {/* Daily Streak Widget */}
          <div className="widget-card streak-widget glass-premium">
            {/* Background watermark flame clipped wrapper */}
            <div className="streak-watermark-wrapper">
              <img src="/images/streak-flame.png" alt="" className="streak-flame-watermark" />
            </div>

            <div className="streak-container-layout">
              <div className="streak-left">
                <span className="streak-number">{statsData.streak}</span>
                <span className="streak-label">day streak</span>
              </div>
              <div className="streak-right">
                <img src="/images/streak-flame.png" alt="Streak Flame" className="streak-flame-img" />
              </div>
            </div>
          </div>

          {/* Automated Daily Quests Widget */}
          <div className="widget-card quests-widget glass-premium">
            {/* Background watermark icon clipped wrapper */}
            <div className="quests-watermark-wrapper">
              <img src="/images/quests-icon.png" alt="" className="quests-icon-watermark" />
            </div>

            <div className="quests-container-layout">
              <div className="quests-left">
                <span className="quests-completed-count">{completedQuests}/{quests.length}</span>
                <span className="quests-label">Daily Missions</span>
              </div>
              <div className="quests-right">
                <img src="/images/quests-icon.png" alt="Quests Icon" className="quests-foreground-img" />
              </div>
            </div>

            <div className="quests-progress">
              <div className="quests-progress-track">
                <div
                  className="quests-progress-fill"
                  style={{ width: `${(completedQuests / quests.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="quests-list">
              {quests.map((q) => {
                const QuestIcon = q.icon;
                return (
                  <div key={q.id} className={`quest-item-automated ${q.completed ? 'completed' : ''}`}>
                    <div className={`quest-check-circle ${q.completed ? 'checked' : ''}`}>
                      {q.completed && <CheckCircle size={14} color="white" />}
                    </div>
                    <span className="quest-text">{q.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="modal-overlay" onClick={() => setActiveModal(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-premium" style={{ transition: 'none' }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{activeModal === 'score' ? 'Istoric Scoruri' : activeModal === 'time' ? 'Activitate Studiu' : 'Colecție Insigne'}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                {activeModal === 'score' && (
                  <div className="history-list">
                    {statsData.scoreHistory.length === 0 ? <p className="empty-msg">Nicio notă înregistrată.</p> :
                      statsData.scoreHistory.map((g, i) => (
                        <div key={i} className="history-item">
                          <div className="item-info"><strong>{new Date(g.created_at).toLocaleDateString()}</strong><span>Test</span></div>
                          <div className="item-val blue">{g.score}%</div>
                        </div>
                      ))}
                  </div>
                )}
                {activeModal === 'time' && (
                  <div className="history-list">
                    {statsData.timeHistory.length === 0 ? <p className="empty-msg">Nicio sesiune de studiu recentă.</p> :
                      statsData.timeHistory.map((s, i) => (
                        <div key={i} className="history-item">
                          <div className="item-info"><strong>{s.date}</strong><span>Timp de studiu</span></div>
                          <div className="item-val blue">{s.mins} min</div>
                        </div>
                      ))}
                  </div>
                )}
                {activeModal === 'badges' && (
                  <div className="badges-modal-grid">
                    {statsData.badges.length === 0 ? <p className="empty-msg">Nu ai obținut nicio insignă momentan.</p> :
                      statsData.badges.map((b, i) => (
                        <div key={i} className="badge-modal-card">
                          <div className="badge-modal-icon">🏆</div>
                          <h4>{b.badges?.title || 'Insignă'}</h4>
                          <p>{b.badges?.description || 'Felicitări pentru realizare!'}</p>
                          <span className="badge-date">Obținut la: {new Date(b.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardPage;
