'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Video,
  User,
  Settings,
  LogOut,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  Shield,
  AlertTriangle,
  Menu,
  Bell,
  CheckCheck,
  Inbox,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


import './dashboard.css';

type AppNotif = {
  id: string;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  promo?: boolean;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { signOut, user, loading, profile, isAdmin, isTeacher, isApproved } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [rhqPromo, setRhqPromo] = useState<AppNotif | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const RHQ_PROMO_ID = 'rhq-promo';

  // Shows the RHQ promo notification at most once per day, with a random daily roll.
  const evaluateRhqPromo = useCallback(() => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const raw = localStorage.getItem('rhq_promo');
      let data: { date: string; active: boolean; read: boolean } | null = raw ? JSON.parse(raw) : null;

      const forced = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('rhq');

      if (!data || data.date !== today) {
        const active = forced || Math.random() < 0.6; // ~60% chance/day, or forced via ?rhq
        data = { date: today, active, read: false };
        localStorage.setItem('rhq_promo', JSON.stringify(data));
      } else if (forced && !data.active) {
        data = { ...data, active: true };
        localStorage.setItem('rhq_promo', JSON.stringify(data));
      }

      if (data.active) {
        setRhqPromo({
          id: RHQ_PROMO_ID,
          type: 'rhq',
          title: 'Descopera RHQ Network',
          content: 'Publica-ti proiectele pe rhqnetwork.biz.',
          is_read: data.read,
          created_at: new Date().toISOString(),
          promo: true,
        });
      } else {
        setRhqPromo(null);
      }
    } catch {
      setRhqPromo(null);
    }
  }, []);

  const markRhqPromoRead = useCallback(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('rhq_promo', JSON.stringify({ date: today, active: true, read: true }));
    } catch { /* ignore */ }
    setRhqPromo((prev) => (prev ? { ...prev, is_read: true } : prev));
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      evaluateRhqPromo();
      
      const handleRefresh = () => {
        fetchNotifications();
      };
      window.addEventListener('refresh-notifications', handleRefresh);

      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('refresh-notifications', handleRefresh);
      };
    }
  }, [user, fetchNotifications, evaluateRhqPromo]);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      if (rhqPromo && !rhqPromo.is_read) markRhqPromoRead();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const markOneAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Acum';
    if (diffMins < 60) return `Acum ${diffMins} min`;
    if (diffHours < 24) return `Acum ${diffHours}h`;
    if (diffDays < 7) return `Acum ${diffDays}z`;
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  };

  const getNotifImage = (type: string) => {
    switch (type) {
      case 'badge':
        return '/images/badges-icon.png';
      case 'course':
      case 'quest_enrollment':
        return '/images/courses-icon.png';
      case 'quiz':
      case 'quest_quiz_complete':
        return '/images/score-icon.png';
      case 'streak':
      case 'quest_study_time':
        return '/images/streak-flame.png';
      case 'admin':
        return '/images/warning-icon.png';
      case 'password':
        return '/images/password-icon.png';
      case 'rhq':
        return '/images/rhq-logo.png';
      default:
        return '/images/quests-icon.png';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bună dimineața';
    if (hour >= 12 && hour < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  const displayNotifications = rhqPromo ? [rhqPromo, ...notifications] : notifications;
  const totalUnread = unreadCount + (rhqPromo && !rhqPromo.is_read ? 1 : 0);



  useEffect(() => {
    const url = user?.avatar_url;
    if (url) {
      setProfileImage(url);
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // Here you would typically upload to Supabase storage
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="app-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#29b6f6', borderRadius: '50%' }}
        />
      </div>
    );
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Panou', href: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Cursuri', href: '/courses' },
    { icon: <Calendar size={20} />, label: 'Calendar', href: '/calendar' },
    { icon: <Award size={20} />, label: 'Insigne', href: '/badges' },
    { icon: <MessageSquare size={20} />, label: 'Chat', href: '/chat' },
    { icon: <Sparkles size={20} />, label: 'Asistent IA', href: '/ai-assistant' },
    { icon: <User size={20} />, label: 'Profil', href: '/profile' },
    ...(isAdmin ? [{ icon: <Shield size={20} />, label: 'Admin', href: '/admin' }] : []),
  ];

  const getHeaderTitle = () => {
    if (pathname === '/dashboard') {
      return `${getGreeting()}, ${(user?.full_name ? user.full_name.split(' ').slice(1).join(' ') : 'Elev')} !`;
    }
    
  const segments = pathname.split('/').filter(Boolean);
  // Remove 'dashboard' segment if present (when using nested dashboard layout)
  if (segments[0] === 'dashboard') {
    segments.shift();
  }
  if (segments.length === 0) return 'EduWave';

  // Special cases for course subroutes
  if (segments[0] === 'courses') {
    if (segments.length === 2) {
      return 'Studiu Curs';
    }
    if (segments.length === 3 && segments[2] === 'edit') {
      return 'Editare Curs';
    }
  }

    const lastSegment = segments[segments.length - 1];
    
    // Translation map for top-level paths
    const translations: Record<string, string> = {
      'courses': 'Cursuri',
      'calendar': 'Planificator & Calendar',
      'badges': 'Insigne de Merit',
      'chat': 'Centru de Comunicare',
      'ai-assistant': 'Asistent Inteligență Artificială',
      'profile': 'Profilul Meu',
      'admin': 'Panou Administrativ',
      'settings': 'Setări Cont'
    };

    if (translations[lastSegment]) {
      return translations[lastSegment];
    }
    
    // Detect UUID pattern (simple check for hyphens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(lastSegment)) {
      // Return generic course title instead of raw UUID
      return 'Curs';
    }
    
    // Default capitalization fallback
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="app-shell">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="mobile-overlay" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${collapsed ? 'is-collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-box">
          {/* Top Header */}
          <div className="sidebar-top">
            <div className="logo-section">
              <div
                className="logo-link"
                onClick={(e) => {
                  if (collapsed) {
                    setCollapsed(false);
                  }
                }}
                style={{ cursor: collapsed ? 'pointer' : 'default' }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={collapsed ? 'collapsed' : 'expanded'}
                    src={collapsed ? "/logo-collapsed.png" : "/wave_education.png"}
                    alt="EduWave"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={collapsed ? "logo-img-collapsed" : "logo-img-full"}
                  />
                </AnimatePresence>
              </div>
            </div>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="toggle-disk"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft size={16} />
              </motion.button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="nav-group">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item-link ${pathname === item.href ? 'is-active' : ''}`}
              >
                <div className="item-content-inner">
                  <div className="item-icon-box">{item.icon}</div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="item-label-text"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {item.label.split('').map((char, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 + 0.1 }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="sidebar-bottom">
            <Link href="/settings" className={`nav-item-link ${pathname === '/settings' ? 'is-active' : ''}`}>
              <div className="item-content-inner">
                <div className="item-icon-box"><Settings size={20} /></div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="item-label-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {"Setări".split('').map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 + 0.1 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
            <button onClick={handleLogout} className="nav-item-link logout-trigger">
              <div className="item-content-inner">
                <div className="item-icon-box"><LogOut size={20} /></div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="item-label-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {"Deconectare".split('').map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 + 0.1 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div className={`content-view-shell ${pathname === '/courses' ? 'has-bottom-blur' : ''}`}>
        <main className="view-body-scroll">
          <header className="top-navbar-premium" style={(notificationsOpen || profileDropdownOpen) ? { zIndex: 10005 } : undefined}>
            <div className="top-navbar-left" style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                className="mobile-menu-btn" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="top-navbar-right">
              <div className="date-badge-navbar">
                <Calendar size={14} />
                <span>{new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}</span>
              </div>

              <div className="sep-line"></div>

              {/* Notifications Bell */}
              <div className="notif-dropdown-wrapper" ref={notifRef}>
                <button
                  className="notif-bell-btn"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  aria-label="Notificări"
                >
                  <Bell size={20} />
                  {totalUnread > 0 && (
                    <span className="notif-badge-count">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      className="notif-popout-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="notif-popout-header">
                        <h4>Notificări</h4>
                        {totalUnread > 0 && (
                          <button className="notif-mark-all-btn" onClick={markAllAsRead}>
                            <CheckCheck size={14} />
                            <span>Marchează tot</span>
                          </button>
                        )}
                      </div>

                      <div className="notif-popout-divider"></div>

                      <div className="notif-popout-list">
                        {displayNotifications.length === 0 ? (
                          <div className="notif-empty-state">
                            <Inbox size={32} />
                            <p>Nicio notificare</p>
                            <span>Vei primi notificări când se întâmplă ceva important.</span>
                          </div>
                        ) : (
                          displayNotifications.map((notif) => {
                            const cleanText = (txt: string) => {
                              return txt ? txt.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim() : '';
                            };
                            return (
                              <div
                                key={notif.id}
                                className={`notif-item type-${notif.type} ${!notif.is_read ? 'is-unread' : ''}`}
                                onClick={() => {
                                  if (!notif.is_read) {
                                    if (notif.id === RHQ_PROMO_ID) {
                                      markRhqPromoRead();
                                      window.open('https://rhqnetwork.biz', '_blank', 'noopener,noreferrer');
                                    } else {
                                      markOneAsRead(notif.id);
                                    }
                                  }
                                }}
                              >
                                <div className="notif-item-body">
                                  <span className="notif-item-title">{cleanText(notif.title)}</span>
                                  <span className="notif-item-content">{cleanText(notif.content)}</span>
                                  <span className="notif-item-time">{getRelativeTime(notif.created_at)}</span>
                                </div>
                                <div className="notif-item-img-container">
                                  <img src={getNotifImage(notif.type)} alt="" className="notif-item-img" />
                                </div>
                                {!notif.is_read && <div className="notif-unread-dot"></div>}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sep-line"></div>

              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <div className="user-profile-trigger" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                  <div className="user-capsule-v2">
                    <div className="user-meta-v2">
                      <span className="u-name-v2">{user?.full_name || 'Utilizator'}</span>
                      <span className="u-role-v2">{profile?.role === 'admin' ? 'Admin' : profile?.role === 'teacher' ? 'Profesor' : 'Elev'}</span>
                    </div>
                    <div className="u-avatar-v2 overflow-hidden">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={() => setProfileImage(null)}
                        />
                      ) : (
                        <span className="avatar-initials">
                          {user?.full_name?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {profileDropdownOpen && (
                  <div className="profile-popout-dropdown">
                    <div className="popout-header">
                      <div className="popout-avatar-wrapper">
                        {profileImage ? (
                          <img src={profileImage} alt="" className="popout-avatar" />
                        ) : (
                          <span className="popout-avatar-placeholder">{user?.full_name?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="popout-user-info">
                        <h4 className="popout-name">{user?.full_name}</h4>
                        <p className="popout-role">{profile?.role === 'admin' ? 'Administrator' : profile?.role === 'teacher' ? 'Profesor' : 'Elev'}</p>
                      </div>
                    </div>

                    <div className="popout-divider"></div>

                    <div className="popout-options">
                      <Link href="/dashboard" className="popout-option" onClick={() => setProfileDropdownOpen(false)}>
                        <LayoutDashboard size={16} />
                        <span>Lecțiile mele</span>
                      </Link>
                      <Link href="/profile" className="popout-option" onClick={() => setProfileDropdownOpen(false)}>
                        <User size={16} />
                        <span>Profilul meu</span>
                      </Link>
                      <Link href="/settings" className="popout-option" onClick={() => setProfileDropdownOpen(false)}>
                        <Settings size={16} />
                        <span>Contul meu</span>
                      </Link>
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); handleLogout(); }} 
                        className="popout-option logout-btn"
                      >
                        <LogOut size={16} />
                        <span>Ieșire</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {isTeacher && !isApproved && (
            <div className="pending-banner">
              <div className="pending-banner-inner">
                <AlertTriangle size={20} />
                <div className="pending-banner-text">
                  <strong>Cont în așteptarea verificării</strong>
                  <span>Contul tău de profesor este în curs de verificare de către un administrator. Vei fi notificat când contul va fi aprobat.</span>
                </div>
                <img src="/images/warning-icon.png" alt="Warning" className="pending-banner-img" />
              </div>
            </div>
          )}
          <div className="page-content-wrapper">
            {children}
          </div>
        </main>
        {/* Ambient Background Waves */}
        <div className="wave-container-bg">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(30, 111, 217, 0.04)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(41, 182, 246, 0.06)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(30, 111, 217, 0.1)" />
              <use href="#gentle-wave" x="48" y="7" fill="rgba(41, 182, 246, 0.15)" />
            </g>
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            className="logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="logout-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="logout-modal-icon">
                <LogOut size={24} />
              </div>
              <h3>Deconectare cont</h3>
              <p>Ești sigur că vrei să te deconectezi de pe EduWave?</p>
              <div className="logout-modal-actions">
                <button 
                  className="logout-modal-cancel" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Anulează
                </button>
                <button 
                  className="logout-modal-confirm" 
                  onClick={confirmLogout}
                >
                  Deconectare
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
