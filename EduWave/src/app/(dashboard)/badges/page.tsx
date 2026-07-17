'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Trophy, BookOpen, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


type BadgeWithCourse = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge_type: 'course_complete' | 'quiz_complete';
  quiz_item_id: string | null;
  image_url: string | null;
  courses: {
    title: string;
  } | null;
};

const BadgesCatalogPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allBadges, setAllBadges] = useState<BadgeWithCourse[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithCourse | null>(null);
  const isUnlocked = selectedBadge ? earnedBadgeIds.has(selectedBadge.id) : false;

  useEffect(() => {
    if (user) {
      loadBadgesData();
    }
  }, [user]);

  const loadBadgesData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/badges');
      if (!res.ok) throw new Error('Eroare la preluarea insignelor.');
      const data = await res.json();

      setAllBadges(data.badges || []);
      setEarnedBadgeIds(new Set(data.earnedBadgeIds || []));
    } catch (err: any) {
      console.error('Error loading badges:', err?.message || err);
    }
    setLoading(false);
  };

  // Filtered badges list
  const filteredBadges = allBadges.filter(badge => {
    const isUnlocked = earnedBadgeIds.has(badge.id);
    if (activeFilter === 'unlocked') return isUnlocked;
    if (activeFilter === 'locked') return !isUnlocked;
    return true;
  });

  const earnedCount = earnedBadgeIds.size;
  const totalCount = allBadges.length;
  const percentageEarned = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="page-content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#29b6f6', borderRadius: '50%' }}
        />
      </div>
    );
  }

  return (
    <div className="page-content-wrapper" style={{ position: 'relative', padding: '36px 16px 24px', maxWidth: 1100, margin: '0 auto' }}>

      {/* 1. Header Banner */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(41, 182, 246, 0.1) 0%, rgba(2, 136, 209, 0.01) 100%)',
        border: '1px solid rgba(41, 182, 246, 0.15)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 24,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        zIndex: 1001
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: -90, left: -90, width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, rgba(234, 179, 8, 0.06) 100%)',
          borderRadius: '50%', filter: 'blur(75px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -100, width: 250, height: 250,
          background: 'rgba(41, 182, 246, 0.12)',
          borderRadius: '50%', filter: 'blur(75px)', pointerEvents: 'none'
        }} />

        {/* Background watermark icon wrapper (bottom-right) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 20,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img
            src="/images/badges-icon.png"
            alt=""
            style={{
              width: 'auto',
              height: '160px',
              objectFit: 'contain',
              position: 'absolute',
              right: '-60px',
              bottom: '-45px',
              pointerEvents: 'none',
              opacity: 0.08,
            }}
          />
        </div>

        {/* Foreground badge icon in the bottom-right */}
        <img
          src="/images/badges-icon.png"
          alt="Badges Icon"
          style={{
            width: 'auto',
            height: '115px',
            objectFit: 'contain',
            position: 'absolute',
            right: '-40px',
            bottom: '-30px',
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'drop-shadow(0 4px 15px rgba(41, 182, 246, 0.35)) drop-shadow(0 2px 5px rgba(2, 136, 209, 0.2))'
          }}
        />

        {/* Background watermark icon wrapper (top-left) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 20,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img
            src="/images/header-icon.png"
            alt=""
            style={{
              width: 'auto',
              height: '160px',
              objectFit: 'contain',
              position: 'absolute',
              left: '-60px',
              top: '-45px',
              pointerEvents: 'none',
              opacity: 0.08,
              transform: 'rotate(10deg)'
            }}
          />
        </div>

        {/* Foreground badge icon in the top-left */}
        <img
          src="/images/header-icon.png"
          alt="Header Icon"
          style={{
            width: 'auto',
            height: '115px',
            objectFit: 'contain',
            position: 'absolute',
            left: '-40px',
            top: '-30px',
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'drop-shadow(0 4px 15px rgba(249, 115, 22, 0.45)) drop-shadow(0 2px 5px rgba(234, 179, 8, 0.25))',
            transform: 'rotate(10deg)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 2, paddingLeft: 60 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.3px' }}>
              Colecția Ta de Insigne
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 13.5, lineHeight: 1.5, maxWidth: 640, margin: 0 }}>
              Fiecare insignă reprezintă o realizare unică pe drumul tău spre cunoaștere.
              Parcurge lecțiile, treci testările cu peste 50% și completează cursurile pentru a le debloca pe toate!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stats and Filters Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Stat Card: Earned Badges */}
        <div className="glass-premium" style={{
          padding: 16, borderRadius: 16, background: 'rgba(13, 20, 38, 0.4)',
          border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'visible',
          clipPath: 'inset(0px round 16px)',
          transition: 'clip-path 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.clipPath = 'inset(-40px -40px -40px 0px round 16px)';
            const img = e.currentTarget.querySelector('.stat-card-badge-img-hover') as HTMLImageElement;
            if (img) {
              img.style.opacity = '0.95';
              img.style.transform = 'translateY(-6px) scale(1.08) rotate(3deg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.clipPath = 'inset(0px round 16px)';
            const img = e.currentTarget.querySelector('.stat-card-badge-img-hover') as HTMLImageElement;
            if (img) {
              img.style.opacity = '0.22';
              img.style.transform = 'rotate(5deg)';
            }
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 2 }}>
              Insigne Deblocate
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
              {earnedCount} <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>/ {totalCount} total</span>
            </div>
          </div>

          <img
            src="/images/badges-icon.png"
            alt=""
            className="stat-card-badge-img-hover"
            style={{
              height: '95px',
              width: 'auto',
              objectFit: 'contain',
              position: 'absolute',
              right: '-26px',
              bottom: '-22px',
              pointerEvents: 'none',
              opacity: 0.22,
              transform: 'rotate(5deg)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 1
            }}
          />
        </div>

        {/* Stat Card: Progress Ratio */}
        <div className="glass-premium" style={{
          padding: 16, borderRadius: 16, background: 'rgba(13, 20, 38, 0.4)',
          border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'visible',
          clipPath: 'inset(0px round 16px)',
          transition: 'clip-path 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.clipPath = 'inset(-40px -40px -40px 0px round 16px)';
            const img = e.currentTarget.querySelector('.stat-card-progress-img-hover') as HTMLImageElement;
            if (img) {
              img.style.opacity = '0.95';
              img.style.transform = 'translateY(-6px) scale(1.08) rotate(3deg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.clipPath = 'inset(0px round 16px)';
            const img = e.currentTarget.querySelector('.stat-card-progress-img-hover') as HTMLImageElement;
            if (img) {
              img.style.opacity = '0.22';
              img.style.transform = 'rotate(5deg)';
            }
          }}
        >
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, width: 'calc(100% - 65px)' }}>
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>
              Rata de Completare
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#29b6f6' }}>
              {percentageEarned}%
            </span>
          </div>
          {/* Progress Bar */}
          <div style={{ position: 'relative', zIndex: 2, width: 'calc(100% - 65px)', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${percentageEarned}%`,
              height: '100%',
              background: 'var(--primary-gradient)',
              borderRadius: 3,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>

          <img
            src="/images/progress-icon.png"
            alt=""
            className="stat-card-progress-img-hover"
            style={{
              height: '95px',
              width: 'auto',
              objectFit: 'contain',
              position: 'absolute',
              right: '-26px',
              bottom: '-22px',
              pointerEvents: 'none',
              opacity: 0.22,
              transform: 'rotate(5deg)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 1
            }}
          />
        </div>

        {/* Filter Controls Card */}
        <div className="glass-premium" style={{
          padding: 16, borderRadius: 16, background: 'rgba(13, 20, 38, 0.4)',
          border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 8 }}>
            Filtrează Realizările
          </div>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.15)', padding: 3, borderRadius: 10, position: 'relative' }}>
            {(['all', 'unlocked', 'locked'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  flex: 1, padding: '6px 10px', border: 'none', borderRadius: 8,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', position: 'relative',
                  background: 'transparent',
                  color: activeFilter === filter ? 'white' : '#94a3b8',
                  transition: 'color 0.2s ease',
                  outline: 'none'
                }}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilterPill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--primary-gradient)',
                      borderRadius: 8,
                      zIndex: 1
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {filter === 'all' ? 'Toate' : filter === 'unlocked' ? 'Deblocate' : 'Blocate'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Catalog Grid */}
      {filteredBadges.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px', background: 'rgba(13, 20, 38, 0.15)',
          border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 20,
          position: 'relative', overflow: 'visible'
        }}>
          {/* Red Glow Effect in the bottom-right */}
          <div style={{
            position: 'absolute', bottom: -60, right: -60, width: 220, height: 220,
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(220, 38, 38, 0) 100%)',
            borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1
          }} />

          {/* Watermark Image (clipped inside borders) */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20, pointerEvents: 'none', zIndex: 1
          }}>
            <img 
              src="/images/empty-badges-icon.png" 
              alt="" 
              style={{
                width: 'auto',
                height: '190px',
                objectFit: 'contain',
                position: 'absolute',
                right: '-55px',
                bottom: '-45px',
                pointerEvents: 'none',
                opacity: 0.08,
              }} 
            />
          </div>

          {/* Foreground Icon (floats outside borders) */}
          <img 
            src="/images/empty-badges-icon.png" 
            alt="Empty Badges Icon" 
            style={{
              width: 'auto',
              height: '135px',
              objectFit: 'contain',
              position: 'absolute',
              right: '-35px',
              bottom: '-35px',
              pointerEvents: 'none',
              zIndex: 3,
              filter: 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.45)) drop-shadow(0 2px 4px rgba(220, 38, 38, 0.25))'
            }} 
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <Award size={36} style={{ color: '#475569', marginBottom: 16 }} />
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Nicio insignă găsită</h3>
            <p style={{ color: '#64748b', maxWidth: 360, margin: '0 auto', fontSize: 13 }}>
              Nu există insigne care să corespundă filtrului selectat.
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 20
        }}>
          {filteredBadges.map((badge, idx) => {
            const isUnlocked = earnedBadgeIds.has(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: idx * 0.015
                }}
                onClick={() => setSelectedBadge(badge)}
                className="glass-premium"
                style={{
                  borderRadius: 20,
                  background: isUnlocked
                    ? 'rgba(13, 20, 38, 0.4)'
                    : 'rgba(13, 20, 38, 0.15)',
                  border: isUnlocked
                    ? `1.5px solid ${badge.color}20`
                    : '1.5px solid rgba(255,255,255,0.03)',
                  padding: '12px 10px 10px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'center',
                  height: 146,
                  boxShadow: isUnlocked ? `0 8px 24px ${badge.color}03` : 'none',
                  transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = isUnlocked ? `0 14px 30px ${badge.color}15` : '0 8px 20px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = isUnlocked ? `${badge.color}50` : 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = isUnlocked ? 'rgba(13, 20, 38, 0.5)' : 'rgba(13, 20, 38, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isUnlocked ? `0 8px 24px ${badge.color}03` : 'none';
                  e.currentTarget.style.borderColor = isUnlocked ? `${badge.color}20` : 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.background = isUnlocked ? 'rgba(13, 20, 38, 0.4)' : 'rgba(13, 20, 38, 0.15)';
                }}
              >
                {/* Badge Shape Container */}
                <div style={{
                  width: 74,
                  height: 74,
                  borderRadius: '50%',
                  background: isUnlocked 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)' 
                    : 'rgba(0,0,0,0.2)',
                  border: isUnlocked ? `1.5px solid ${badge.color}` : '1.5px dashed rgba(255,255,255,0.1)',
                  boxShadow: isUnlocked ? `0 0 15px ${badge.color}25` : 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {badge.image_url ? (
                    <img
                      src={badge.image_url}
                      alt={badge.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(35%)' 
                      }}
                    />
                  ) : (
                    <span style={{ 
                      fontSize: 38,
                      filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(35%)'
                    }}>{badge.icon || '🏆'}</span>
                  )}

                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(13, 20, 38, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      color: '#cbd5e1',
                      backdropFilter: 'blur(1px)'
                    }}>
                      <Lock size={18} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    </div>
                  )}
                </div>

                {/* Compact text wrapper */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <h3 style={{ 
                    color: 'white', 
                    fontWeight: 800, 
                    fontSize: 12, 
                    margin: 0, 
                    letterSpacing: '-0.1px',
                    lineHeight: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: 32
                  }}>
                    {badge.title.replace('Absolvent ', '')}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Modal Detail view */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            key={`overlay-${selectedBadge.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="badge-modal-overlay"
          >
            <motion.div
              key={`card-${selectedBadge.id}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 360 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-premium badge-modal-card"
              style={{
                width: '100%',
                maxWidth: 440,
                borderRadius: 24,
                padding: 28,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: isUnlocked ? `0 20px 50px ${selectedBadge.color}15` : '0 20px 50px rgba(0,0,0,0.5)',
                ['--badge-border-color' as any]: isUnlocked ? `${selectedBadge.color}30` : 'rgba(255,255,255,0.06)',
              }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBadge(null)}
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <X size={16} />
                </button>

                {/* Big Glow Icon Container */}
                <div style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: isUnlocked 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%)' 
                    : 'rgba(0,0,0,0.3)',
                  border: 'none',
                  boxShadow: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {selectedBadge.image_url ? (
                    <img
                      src={selectedBadge.image_url}
                      alt={selectedBadge.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(35%)' 
                      }}
                    />
                  ) : (
                    <span style={{ 
                      fontSize: 48,
                      filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(35%)'
                    }}>{selectedBadge.icon || '🏆'}</span>
                  )}

                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(13, 20, 38, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      color: '#cbd5e1',
                      backdropFilter: 'blur(2px)'
                    }}>
                      <Lock size={26} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    </div>
                  )}
                </div>

                {/* Category Tag */}
                <span style={{
                  fontSize: 10,
                  color: isUnlocked ? selectedBadge.color : '#64748b',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6
                }}>
                  {selectedBadge.courses?.title || 'Curs general'}
                </span>

                {/* Title */}
                <h2 style={{
                  color: 'white',
                  fontWeight: 850,
                  fontSize: '1.4rem',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.25
                }}>
                  {selectedBadge.title}
                </h2>

                {/* Status Tag */}
                <div style={{ marginBottom: 16 }}>
                  {isUnlocked ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(16, 185, 129, 0.08)', color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                      DEBLOCATĂ
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(148, 163, 184, 0.08)', color: '#94a3b8',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
                      BLOCATĂ
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{
                  color: '#94a3b8',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  margin: '0 0 24px 0',
                  padding: '0 10px'
                }}>
                  {selectedBadge.description || 'Nicio descriere adăugată pentru această insignă.'}
                </p>

                {/* Condition Footer */}
                <div style={{
                  width: '100%',
                  paddingTop: 18,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen size={14} style={{ color: '#64748b' }} />
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                      Cerință: {selectedBadge.badge_type === 'course_complete' ? 'Finalizarea completă a cursului' : 'Promovarea testului aferent'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      borderRadius: 14,
                      color: '#10b981',
                      fontSize: 13,
                      fontWeight: 800
                    }}>
                      Insignă obținută în totalitate! 🎉
                    </div>
                  ) : (
                    <Link
                      href={`/courses/${selectedBadge.course_id}`}
                      onClick={() => setSelectedBadge(null)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--primary-gradient)',
                        borderRadius: 14,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: '0 8px 20px rgba(30, 111, 217, 0.25)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(30, 111, 217, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(30, 111, 217, 0.25)';
                      }}
                    >
                      Începe Cursul pentru deblocare <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgesCatalogPage;
