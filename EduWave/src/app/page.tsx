'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import './landing.css';

const HeroScene = dynamic(() => import('@/components/landing/HeroScene'), {
  ssr: false,
});
import { 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Zap, 
  Shield, 
  Rocket, 
  ArrowRight, 
  Play, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  TrendingUp 
} from 'lucide-react';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const part1 = "Învățarea devine ";
    const part2 = "Inteligentă.";
    let i = 0;
    let j = 0;
    
    const timer = setInterval(() => {
      if (i < part1.length) {
        setText1(part1.substring(0, i + 1));
        i++;
      } else if (j < part2.length) {
        setText2(part2.substring(0, j + 1));
        j++;
      } else {
        setIsDone(true);
        clearInterval(timer);
      }
    }, 70);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Background Glowing Mesh Effects */}
      <div className="landing-glow-wrapper">
        <div className="landing-glow-1"></div>
        <div className="landing-glow-2"></div>
        <div className="landing-glow-3"></div>
      </div>

      {/* 3D Interactive Wave Scene */}
      <HeroScene />

      {/* Floating Header */}
      <nav 
        className="navbar"
        style={{
          background: 'rgba(8, 12, 24, 0.82)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.02)'
        }}
      >
        <div className="nav-content">
          <Link href="/" className="logo-section">
            <img src="/wave_education.png" alt="EduWave" className="logo-img" />
          </Link>
          <div className="nav-links">
            <Link href="#features">Beneficii</Link>
            <Link href="#preview">Interfață</Link>
            <Link href="/docs">Documentație</Link>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn-link">Conectare</Link>
            <Link href="/register" className="btn-primary-glow">Începe Gratuit</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-container">
          {/* Left Column: Text & CTA */}
          <div className="hero-left">

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {text1 || '\u00A0'}
              {text2.length === 0 && <span className="typing-cursor">|</span>}
              <br />
              <span className="gradient-text-interactive">{text2 || '\u00A0'}</span>
              {text2.length > 0 && <span className={`typing-cursor ${isDone ? 'blinking' : ''}`}>|</span>}
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              EduWave revoluționează studiul prin gamificare avansată, insigne inteligente, streak-uri zilnice și un asistent AI ultra-rapid integrat. Înalță-ți notele în timp record!
            </motion.p>

            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/register" className="btn-cta-primary">
                Explorează Cursurile <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn-cta-secondary">
                <Play size={16} fill="currentColor" /> Vezi Demo
              </Link>
            </motion.div>

            {/* Premium Stat Inline Grid */}
            <motion.div 
              className="hero-stats-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="stat-card-inline">
                <span className="stat-number">500+</span>
                <span className="stat-label">Materiale de Studiu</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card-inline">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Asistență AI Instantiată</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card-inline">
                <span className="stat-number">98%</span>
                <span className="stat-label">Rată de Promovare</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Isometric Interactive Mockup Preview */}
          <div className="hero-right">
            <motion.div 
              className="isometric-mockup glass-card-premium"
              initial={{ opacity: 0, scale: 0.9, rotateY: 10, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: -12, rotateX: 12 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ rotateY: -4, rotateX: 4, scale: 1.02 }}
            >
              {/* Inner Mockup Window Frame */}
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-tab">EduWave Platform - Dashboard</div>
              </div>

              {/* Mockup Content Panel */}
              <div className="mockup-body">
                {/* User Info Bar */}
                <div className="mockup-user-bar">
                  <div className="mockup-avatar">A</div>
                  <div className="mockup-meta">
                    <h4>Alex Dumitrescu</h4>
                    <span>Elev în Curs de Dezvoltare • Streak active: 🔥 7 Zile</span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="mockup-stats-row">
                  <div className="mockup-stat-box glass">
                    <BookOpen size={16} color="#38bdf8" />
                    <div>
                      <h5>12 Cursuri</h5>
                      <span>3 Finalizate</span>
                    </div>
                  </div>
                  <div className="mockup-stat-box glass">
                    <Award size={16} color="#4dd0e1" />
                    <div>
                      <h5>15 Insigne</h5>
                      <span>Nivel Elite</span>
                    </div>
                  </div>
                </div>

                {/* Mock AI Conversation */}
                <div className="mockup-chat">
                  <div className="mockup-chat-header">
                    <Sparkles size={14} color="#38bdf8" />
                    <span>EduWave AI Chatbot</span>
                  </div>
                  <div className="mockup-bubble ai">
                    <Sparkles size={12} />
                    <p>Salut Alex! Am observat că lucrezi la sortarea <strong>Bubble Sort</strong> în C++. Ai nevoie să îți explic linia de swap? 🚀</p>
                  </div>
                  <div className="mockup-bubble user">
                    <p>Da, te rog, explică-mi algoritmul pe scurt!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-intro">
          <span className="section-subtitle">Beneficii Complete</span>
          <h2 className="gradient-text-interactive">De ce să alegi EduWave?</h2>
          <p>O platformă de învățare construită cu dragoste, tehnologie de vârf și design modern.</p>
        </div>

        <div className="features-grid">
          {[
            { 
              icon: <Zap size={24} />, 
              title: "Tutore Inteligent AI", 
              desc: "Asistentul nostru AI îți înțelege stilul de învățare, îți explică concepte complexe în română și îți oferă răspunsuri în sub o secundă." 
            },
            { 
              icon: <Award size={24} />, 
              title: "Gamificare Interactivă", 
              desc: "Câștigă insigne speciale pentru realizările tale, menține-ți streak-ul zilnic de studiu și urmărește-ți progresul pe grafice detaliate." 
            },
            { 
              icon: <MessageSquare size={24} />, 
              title: "Mesagerie în Timp Real", 
              desc: "Comunică instantaneu cu profesorii și colegii tăi prin intermediul chat-ului integrat pentru a rezolva împreună orice exercițiu." 
            },
            { 
              icon: <BookOpen size={24} />, 
              title: "Cursuri structurate", 
              desc: "Explorează cursuri bogate din orice domeniu, parcurge lecții interactive și testează-ți cunoștințele prin quiz-uri generate automat." 
            },
            { 
              icon: <Shield size={24} />, 
              title: "Confidențialitate Totală", 
              desc: "Securitate de top oferită de Supabase. Datele tale de studiu sunt complet private sau pot fi făcute publice doar dacă dorești." 
            },
            { 
              icon: <Rocket size={24} />, 
              title: "Pregătit pentru Viitor", 
              desc: "Fie că ești elev, profesor sau diriginte, EduWave îți pune la dispoziție instrumente moderne pentru a monitoriza catalogul și progresul." 
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="feature-card-premium glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, borderColor: 'rgba(41, 182, 246, 0.3)' }}
            >
              <div className="feature-icon-wrapper brand-bg">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-container glass">
          <div className="cta-banner-glow"></div>
          <h2>Ești pregătit să treci la următorul nivel?</h2>
          <p>Creează-ți un cont gratuit în mai puțin de 60 de secunde și explorează cel mai inovator mod de a învăța.</p>
          <div className="cta-banner-buttons">
            <Link href="/register" className="btn-cta-primary large">Începe Acum Gratuit</Link>
            <Link href="/login" className="btn-cta-secondary large">Conectează-te</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
