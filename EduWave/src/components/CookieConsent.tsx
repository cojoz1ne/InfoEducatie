"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay showing the cookie banner slightly so it doesn't clash with loading screen
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cookie-consent-wrapper"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        >
          <div className="glass cookie-consent-box">
            <div className="cookie-icon-wrapper">
              <Cookie size={24} color="#38bdf8" />
            </div>
            
            <div className="cookie-content">
              <h4>Folosim Cookie-uri</h4>
              <p>
                EduWave utilizează cookie-uri pentru a-ți asigura cea mai bună experiență de navigare, 
                pentru a personaliza conținutul și pentru a analiza traficul.
              </p>
            </div>

            <div className="cookie-actions">
              <button onClick={handleReject} className="btn-cookie-secondary">
                Refuză
              </button>
              <button onClick={handleAccept} className="btn-cookie-primary">
                Acceptă Toate
              </button>
            </div>
            
            <button onClick={handleReject} className="cookie-close-btn" aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
