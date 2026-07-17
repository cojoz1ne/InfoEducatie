'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  Check,
  Smartphone,
  Mail,
  Eye,
  Lock,
  Moon,
  Sun,
  Monitor,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const triggerAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Form State
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: (user as any)?.bio || '',
    email_notifications: (user as any)?.email_notifications ?? true,
    push_notifications: (user as any)?.push_notifications ?? true,
    public_profile: (user as any)?.public_profile ?? false
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <User size={18} /> },
    { id: 'security', label: 'Securitate', icon: <Shield size={18} /> },
    { id: 'privacy', label: 'Confidențialitate', icon: <Globe size={18} /> },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          bio: formData.bio,
          email_notifications: formData.email_notifications,
          push_notifications: formData.push_notifications,
          public_profile: formData.public_profile
        })
      });
      if (!res.ok) throw new Error('Eroare la salvarea setărilor.');

      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
      triggerAlert('Eroare', 'Eroare la salvarea setărilor.', 'error');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      triggerAlert('Parolele nu coincid', 'Noua parolă și parola de confirmare trebuie să fie identice.', 'warning');
      return;
    }
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordData.newPassword })
      });
      if (!res.ok) throw new Error('Eroare la actualizarea parolei.');
      triggerAlert('Succes! 🎉', 'Parola ta a fost actualizată cu succes.', 'success');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      window.dispatchEvent(new Event('refresh-notifications'));
    } catch (error) {
      triggerAlert('Eroare', 'Nu s-a putut actualiza parola. Încearcă din nou.', 'error');
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <div>
          <h1>Setări Cont</h1>
          <p>Gestionează-ți profilul și preferințele de utilizare EduWave.</p>
        </div>
        <button 
          className={`save-btn ${isSaving ? 'loading' : ''} ${showSaved ? 'success' : ''}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <div className="spinner"></div> : showSaved ? <Check size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Se salvează...' : showSaved ? 'Salvat!' : 'Salvează Modificările'}</span>
        </button>
      </header>

      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <aside className="settings-nav glass-premium">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="active-indicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="settings-content glass-premium">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="tab-panel"
            >
              {activeTab === 'general' && (
                <div className="settings-section">
                  <h2 className="section-title">Profil Personal</h2>
                  <div className="input-grid">
                    <div className="input-group">
                      <label>Nume Complet</label>
                      <input 
                        type="text" 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Ex: Popescu Ion" 
                        autoComplete="off"
                      />
                    </div>
                    <div className="input-group">
                      <label>Adresă Email</label>
                      <input type="email" defaultValue={user?.email || ''} readOnly />
                      <p className="hint">Email-ul este gestionat de furnizorul tău de autentificare.</p>
                    </div>
                    <div className="input-group full-width">
                      <label>Bio</label>
                      <textarea 
                        value={formData.bio} 
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Spune câteva cuvinte despre tine..." 
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2 className="section-title">Securitate Cont</h2>
                  <div className="action-list">
                    <div className="action-card vertical">
                      <div className="action-main">
                        <Lock size={20} className="icon-gold" />
                        <div>
                          <h4>Schimbă Parola</h4>
                          <p>Introduceți o parolă nouă pentru a vă securiza contul.</p>
                        </div>
                      </div>
                      <div className="password-fields">
                        <input 
                          type="password" 
                          placeholder="Parolă Nouă" 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          autoComplete="new-password"
                        />
                        <input 
                          type="password" 
                          placeholder="Confirmă Parola" 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          autoComplete="new-password"
                        />
                        <button className="btn-primary small" onClick={handlePasswordUpdate}>Actualizează Parola</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="settings-section">
                  <h2 className="section-title">Confidențialitate</h2>
                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <Eye size={20} className="icon-blue" />
                        <div>
                          <h4>Profil Public</h4>
                          <p>Permite altor colegi să îți vadă profilul și cursurile.</p>
                        </div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={formData.public_profile} 
                          onChange={(e) => setFormData({...formData, public_profile: e.target.checked})}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style jsx>{`
        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settings-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .settings-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: var(--primary-gradient);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px rgba(30, 111, 217, 0.2);
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(30, 111, 217, 0.3);
        }

        .save-btn.success {
          background: #10b981;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          padding: 12px;
          border-radius: 24px;
        }

        .nav-tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .nav-tab-btn:hover:not(.active) {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.03);
          padding-left: 24px;
        }

        .nav-tab-btn.active {
          color: white !important;
        }

        .nav-tab-btn.active .tab-icon {
          color: white !important;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: var(--primary-gradient);
          border-radius: 16px;
          z-index: -1;
          box-shadow: 0 8px 20px rgba(30, 111, 217, 0.25);
        }

        .settings-content {
          border-radius: 32px;
          padding: 40px;
          min-height: 600px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 32px;
          color: white;
        }

        /* Forms */
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-group.full-width {
          grid-column: span 2;
        }

        .input-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

         input, textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px 20px;
          color: white;
          width: 100%;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input:hover, textarea:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #29b6f6;
          background: rgba(41, 182, 246, 0.04);
          box-shadow: 0 0 20px rgba(41, 182, 246, 0.15);
        }

        input:read-only {
          background: rgba(255, 255, 255, 0.01) !important;
          border-color: rgba(255, 255, 255, 0.04) !important;
          color: rgba(255, 255, 255, 0.4) !important;
          cursor: not-allowed;
        }

        .hint {
          font-size: 12px;
          color: #64748b;
          margin-top: 8px;
        }

        /* Toggle List */
        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-item:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .toggle-info {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .toggle-info h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .toggle-info p { font-size: 13px; color: #64748b; }

        .icon-blue { color: #29b6f6; }
        .icon-purple { color: #a855f7; }
        .icon-gold { color: #facc15; }
        .icon-green { color: #22c55e; }

        /* Theme Grid */
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .theme-option {
          cursor: pointer;
          text-align: center;
        }

        .theme-preview {
          height: 120px;
          border-radius: 16px;
          margin-bottom: 12px;
          border: 2px solid transparent;
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 10px;
        }

        .theme-option.active .theme-preview {
          border-color: #29b6f6;
          box-shadow: 0 0 20px rgba(41, 182, 246, 0.2);
        }

        .theme-preview.dark { background: #0f172a; }
        .theme-preview.light { background: #f8fafc; }
        .theme-preview.system { background: linear-gradient(135deg, #0f172a 50%, #f8fafc 50%); }

        .p-circle { width: 30px; height: 30px; border-radius: 50%; background: #29b6f6; opacity: 0.3; }
        .p-lines span { display: block; height: 4px; background: currentColor; opacity: 0.1; border-radius: 2px; margin-bottom: 6px; }
        .p-lines span:last-child { width: 60%; }

        .theme-preview.light .p-lines span { background: #000; }

        .theme-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 700;
          font-size: 14px;
          color: #94a3b8;
        }

        .theme-option.active .theme-label { color: white; }

        /* Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 58px;
          height: 32px;
          flex-shrink: 0;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.08);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 34px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 3px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(145deg, #ffffff, #e2e8f0);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          border-radius: 50%;
        }

        input:checked + .slider {
          background: var(--primary-gradient);
          border-color: transparent;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 14px rgba(41, 182, 246, 0.45);
        }

        input:checked + .slider:before {
          left: calc(100% - 27px);
          transform: translateY(-50%) scale(1.05);
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
        }

        .switch:hover .slider:before {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
        }

        .switch:active .slider:before {
          width: 28px;
        }

        /* Actions */
        .action-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 20px;
          margin-bottom: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
          background: var(--primary-gradient);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 16px rgba(30, 111, 217, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(30, 111, 217, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary.small {
          padding: 10px 20px;
          font-size: 13px;
          border-radius: 10px;
        }

        .action-main { display: flex; gap: 20px; align-items: center; }
        .action-main h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .action-main p { font-size: 13px; color: #64748b; }

        .btn-secondary.small {
          padding: 10px 20px;
          font-size: 13px;
          border-radius: 10px;
        }

        /* Spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .action-card.vertical {
          flex-direction: column;
          align-items: stretch;
          gap: 20px;
        }

        .password-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .password-fields input {
          max-width: 300px;
        }

        @media (max-width: 1024px) {
          .settings-layout { grid-template-columns: 1fr; }
          .input-grid { grid-template-columns: 1fr; }
          .input-group.full-width { grid-column: span 1; }
        }

        :global(.custom-alert-overlay) {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          transition: none !important;
        }

        :global(.custom-alert-card) {
          width: 95%;
          max-width: 380px;
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center !important;
          justify-content: center;
          gap: 16px;
          backdrop-filter: blur(20px);
          position: relative;
          transition: none !important;
        }

        :global(.alert-icon-wrapper) {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        :global(.alert-icon-wrapper.success) {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        :global(.alert-icon-wrapper.error) {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        :global(.alert-icon-wrapper.warning) {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        :global(.custom-alert-card h2) {
          color: white;
          font-size: 22px;
          font-weight: 800;
          margin: 0;
          text-align: center;
        }

        :global(.custom-alert-card p) {
          color: var(--text-secondary, #94a3b8);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          text-align: center;
        }

        :global(.custom-alert-btn) {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        :global(.custom-alert-btn:hover) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        :global(.custom-alert-btn:active) {
          transform: translateY(0);
        }
      `}</style>

      <AnimatePresence>
        {alertConfig.isOpen && (
          <motion.div 
            className="custom-alert-overlay"
            style={{ transition: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="custom-alert-card glass-premium"
              style={{ transition: 'none' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`alert-icon-wrapper ${alertConfig.type}`}>
                {alertConfig.type === 'success' && <CheckCircle size={32} />}
                {alertConfig.type === 'error' && <XCircle size={32} />}
                {alertConfig.type === 'warning' && <AlertTriangle size={32} />}
              </div>
              <h2>{alertConfig.title}</h2>
              <p>{alertConfig.message}</p>
              <button 
                className="custom-alert-btn" 
                onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
