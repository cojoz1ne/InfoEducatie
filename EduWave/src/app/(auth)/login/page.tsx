'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams ? searchParams.get('error') : null;
  const customMessage = searchParams ? searchParams.get('message') : null;

  const { refreshProfile } = useAuth();

  React.useEffect(() => {
    if (customMessage) {
      setError(customMessage);
    } else if (oauthError) {
      let msg = 'Autentificarea a eșuat.';
      if (oauthError === 'EmailUsedInOtherMethod') {
        msg = 'Acest email este deja utilizat printr-o altă metodă de conectare (e.g. e-mail simplu sau alt cont social).';
      } else if (oauthError === 'OAuthNoCode') {
        msg = 'Nu s-a putut obține codul de autorizare de la furnizorul de autentificare.';
      } else if (oauthError === 'OAuthTokenExchangeFailed') {
        msg = 'Eroare la schimbul de jetoane cu furnizorul de autentificare.';
      } else if (oauthError === 'OAuthProfileFetchFailed') {
        msg = 'Nu s-au putut prelua datele de profil.';
      } else if (oauthError === 'OAuthEmailMissing') {
        msg = 'Adresa de email lipsește din datele furnizate de contul social.';
      } else if (oauthError === 'OAuthInternalError') {
        msg = 'Eroare internă la autentificarea prin intermediul contului social.';
      }
      setError(msg);
    }
  }, [oauthError, customMessage]);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/oauth?provider=${provider}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Eroare la pornirea fluxului OAuth.');
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL-ul de redirecționare OAuth lipsește.');
      }
    } catch (err: any) {
      setError(err.message || 'Eroare la autentificare.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshProfile();
        router.push('/dashboard');
      } else {
        let msg = data.message;
        if (msg === 'Invalid login credentials') msg = 'Date de autentificare invalide';
        setError(msg);
      }
    } catch (err: any) {
      setError('A apărut o eroare de rețea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left Visual Side */}
      <div className="auth-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="visual-logo-container"
          >
            <div className="app-logo">
              <img src="/logo.png" alt="Wave Education" className="main-logo-img" />
            </div>
          </motion.div>
          
          <motion.div 
            className="visual-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="title">Bine ai revenit</h2>
            <p className="subtitle">Cea mai avansată platformă de învățare bazată pe IA te așteaptă.</p>
          </motion.div>

          <div className="visual-footer">
            <span>Susținut de IA de generație următoare</span>
            <div className="dot"></div>
            <span>v2.0 Beta</span>
          </div>
        </div>

        <div className="wave-separator-integrated">
          <svg 
            viewBox="0 0 200 1200" 
            preserveAspectRatio="none"
            className="wave-svg-integrated"
          >
            <defs>
              <path id="wave-integrated-path" 
                d="M200,0 L85,0 
                   C70,50 70,150 85,200 S100,350 85,400 
                   C70,450 70,550 85,600 S100,750 85,800 
                   C70,850 70,950 85,1000 S100,1150 85,1200 
                   L200,1200 Z" />
            </defs>
            <g className="wave-group-integrated">
              <use href="#wave-integrated-path" x="-15" fill="#0a1020" opacity="0.3" className="wave-layer-int l-slow" />
              <use href="#wave-integrated-path" x="-8" fill="#0a1020" opacity="0.6" className="wave-layer-int l-mid" />
              <use href="#wave-integrated-path" x="0" fill="#0a1020" opacity="1" className="wave-layer-int l-fast" />
            </g>
          </svg>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="form-inner">
          <motion.div 
            className="form-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="form-title">
              <h3>Autentificare</h3>
              <p>Introdu datele tale pentru a accesa panoul de control</p>
            </div>

            <form onSubmit={handleLogin} className="form-main">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="error-box">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="input-wrap">
                <label>Adresă de Email</label>
                <div className="input-box">
                  <Mail size={20} className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="nume@exemplu.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-wrap">
                <div className="label-row">
                  <label>Parolă</label>
                  <Link href="/forgot-password">Ai uitat-o?</Link>
                </div>
                <div className="input-box">
                  <Lock size={20} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="pass-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Se autentifică...' : 'Autentifică-te acum'} <ArrowRight size={20} />
              </button>
            </form>

            <div className="divider">
              <span>Sau continuă cu</span>
            </div>

            <div className="social-grid">
              <button 
                type="button" 
                className="social-item"
                onClick={() => handleSocialLogin('github')}
              >
                <GithubIcon size={20} />
                <span>GitHub</span>
              </button>
              <button 
                type="button" 
                className="social-item"
                onClick={() => handleSocialLogin('google')}
              >
                <GoogleIcon size={20} />
                <span>Google</span>
              </button>
            </div>

            <p className="footer-link">
              Nou pe EduWave? <Link href="/register">Creează un cont</Link>
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .auth-split-container {
          display: flex;
          min-height: 100vh;
          background: #060a14;
          position: relative;
          overflow: hidden;
        }

        .auth-visual {
          flex: 1.2;
          background: var(--brand-gradient);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: white;
          overflow: visible;
          z-index: 5;
        }

        .visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 100%);
          z-index: 1;
        }

        .visual-content {
          max-width: 440px;
          z-index: 5;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        .main-logo-img {
          max-width: 280px;
          height: auto;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
        }

        .visual-info .title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .visual-info .subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          line-height: 1.6;
        }

        .visual-footer {
          position: absolute;
          bottom: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
          opacity: 0.5;
        }

        .dot { width: 4px; height: 4px; background: white; border-radius: 50%; }

        .wave-separator-integrated {
          position: absolute;
          top: 0;
          right: -100px;
          width: 300px;
          height: 100%;
          z-index: 100;
          pointer-events: none;
          overflow: hidden;
        }

        .wave-svg-integrated {
          width: 100%;
          height: 150%;
        }

        .wave-layer-int {
          transform-origin: center top;
          will-change: transform;
        }

        .l-slow { animation: wave-loop-int 35s linear infinite; }
        .l-mid { animation: wave-loop-int 25s linear infinite; }
        .l-fast { animation: wave-loop-int 18s linear infinite; }

        @keyframes wave-loop-int {
          0% { transform: translateY(0); }
          100% { transform: translateY(-400px); }
        }

        .auth-form-side {
          flex: 1;
          background: #0a1020;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          position: relative;
          z-index: 10;
        }

        .form-inner {
          width: 100%;
          max-width: 420px;
          z-index: 2;
        }

        .form-title { margin-bottom: 40px; }
        .form-title h3 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .form-title p { color: var(--text-secondary); }

        .form-main { display: flex; flex-direction: column; gap: 24px; }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ff8080;
          font-size: 14px;
          font-weight: 600;
        }

        .input-wrap { display: flex; flex-direction: column; gap: 10px; }
        .input-wrap label { font-size: 14px; font-weight: 600; color: var(--text-secondary); }
        
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .label-row a { font-size: 13px; color: #29b6f6; font-weight: 700; }

        .input-box {
          display: flex;
          align-items: center;
          padding: 0 18px;
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
        }

        .input-box:focus-within {
          border-color: #29b6f6;
          background: #1e293b;
          box-shadow: 0 0 20px rgba(41, 182, 246, 0.2), inset 0 0 10px rgba(41, 182, 246, 0.05);
        }

        .input-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: 0.3s;
          z-index: 5;
        }
        
        .input-box:focus-within .input-icon {
          color: #29b6f6;
          transform: scale(1.1);
        }

        .input-box input {
          width: 100%;
          padding: 16px 14px;
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-size: 1rem;
          outline: none;
          box-shadow: none !important;
          z-index: 5;
        }

        .input-box input:-webkit-autofill,
        .input-box input:-webkit-autofill:hover,
        .input-box input:-webkit-autofill:focus,
        .input-box input:-webkit-autofill:active {
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s !important;
          background-color: transparent !important;
          -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .input-box input:focus {
          background: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .pass-toggle {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }

        .pass-toggle:hover {
          color: #29b6f6;
          transform: scale(1.1);
        }

        .submit-btn {
          background: var(--primary-gradient);
          color: white;
          padding: 18px;
          border-radius: 16px;
          border: none;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 10px 20px rgba(30, 111, 217, 0.2);
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(30, 111, 217, 0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
        }
        .divider::before, .divider::after {
          content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.05);
        }
        .divider span { padding: 0 15px; text-transform: uppercase; letter-spacing: 1px; }

        .social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        
        .social-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: 600;
          color: white;
        }

        .social-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .footer-link { margin-top: 40px; text-align: center; color: var(--text-secondary); }
        .footer-link a { color: #29b6f6; font-weight: 800; }

        @media (max-width: 1024px) {
          .auth-split-container { flex-direction: column; }
          .auth-visual { flex: 0 0 auto; padding: 80px 40px 120px; }
          .wave-separator-integrated { display: none; }
          .auth-form-side {
            padding: 40px 20px 80px;
            margin-top: -60px;
            border-radius: 40px 40px 0 0;
            z-index: 20;
          }
        }
      `}</style>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', background: '#060a14', alignItems: 'center', justifyContent: 'center', color: '#a5c0d6', fontFamily: 'Outfit, sans-serif' }}>
        Se încarcă...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
