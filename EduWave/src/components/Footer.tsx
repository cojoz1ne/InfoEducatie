'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Te rugăm să introduci o adresă de email.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'A apărut o eroare. Te rugăm să încerci din nou.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('A apărut o eroare de rețea.');
    }
  };

  return (
    <footer className="landing-footer">
      <div className="footer-grid">
        {/* Column 1: Brand & Socials */}
        <div className="footer-brand-col">
          <img src="/wave_education.png" alt="EduWave Logo" className="footer-logo" />
          <p className="footer-brand-desc">
            Platformă educațională de ultimă generație creată special pentru elevi și profesori. Învățarea nu a fost niciodată mai interactivă.
          </p>
          <div className="footer-socials">
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="social-icon glass" title="Discord">
              <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.88-.65,1.72-1.34,2.51-2a75.58,75.58,0,0,0,76,0c.79.71,1.63,1.4,2.52,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.77,123.7,27.9,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.14,46,96.14,53,91,65.69,84.69,65.69Z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon glass" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon glass" title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.29 29 29 0 0 0-.46-5.33z"/>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigare Links */}
        <div className="footer-links-col">
          <h4>Link-uri Utile</h4>
          <ul>
            <li><Link href="/docs">Documentație</Link></li>
            <li><Link href="/register">Creare Cont Nou</Link></li>
            <li><Link href="/login">Intră în Cont</Link></li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="footer-newsletter-col">
          <h4>Fii la curent</h4>
          <p>Abonează-te la newsletter-ul EduWave pentru a afla primul când lansăm cursuri noi!</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Adresa ta de email" 
              className="glass" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            <button 
              type="submit" 
              className="btn-newsletter" 
              disabled={status === 'loading' || !email}
            >
              {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </form>
          {message && (
            <p style={{ marginTop: '10px', fontSize: '13px', color: status === 'success' ? '#4ade80' : '#f87171' }}>
              {message}
            </p>
          )}
        </div>

        {/* Column 4: Signature */}
        <div className="footer-signature-col">
          <span className="sig-label">Fondator</span>
          <div className="signature-fancy">
            <span className="sig-c">C</span>
            <span className="sig-david">David</span>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span className="copyright">
            © {new Date().getFullYear()} EduWave Corporation. Construit cu 💙 de echipa Wave Studios.
          </span>
          <div className="footer-bottom-links">
            <Link href="/privacy">Confidențialitate</Link>
            <span className="dot-sep">•</span>
            <Link href="/terms">Termeni & Condiții</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
