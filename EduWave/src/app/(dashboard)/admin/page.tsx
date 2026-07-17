'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Shield, 
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Filter,
  Clock,
  VolumeX,
  Bot,
  ChevronDown,
  X
} from 'lucide-react';
import './admin.css';

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  is_approved: boolean;
  avatar_url: string;
  created_at?: string;
  createdAt?: string;
  is_banned?: boolean;
  is_ai_blacklisted?: boolean;
  timeout_until?: string | null;
  mute_until?: string | null;
};

const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Guard
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, activeTab, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?`;
      if (activeTab === 'requests') {
        url += 'role=teacher&approved=false';
      } else {
        if (roleFilter !== 'all') url += `role=${roleFilter}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (activeTab === 'users') {
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const handleAction = async (userId: string, action: string, newRole?: string, durationMinutes?: number) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, newRole, durationMinutes }),
      });

      if (res.ok) {
        // Refresh list
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`Eroare: ${err.error || err.message}`);
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('A apărut o eroare la efectuarea acțiunii.');
    }
  };

  const [activeDropdownUserId, setActiveDropdownUserId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<UserProfile | null>(null);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [modalDuration, setModalDuration] = useState<number>(60);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdownUserId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleRestrictionClick = (userId: string, action: string, user: UserProfile) => {
    setModalUser(user);
    setModalAction(action);
    if (action === 'timeout' || action === 'mute') {
      setModalDuration(60);
    }
    setIsModalOpen(true);
  };

  const confirmModerationAction = () => {
    if (!modalUser || !modalAction) return;
    const needsDuration = modalAction === 'timeout' || modalAction === 'mute';
    const duration = needsDuration ? modalDuration : undefined;

    handleAction(modalUser.id, modalAction, undefined, duration);
    setIsModalOpen(false);
    setModalUser(null);
    setModalAction(null);
  };

  if (authLoading || !isAdmin) return <div className="admin-loading">Se verifică permisiunile...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="gradient-text">Panou Administrator</h1>
          <p className="subtitle">Gestionează utilizatorii și aprobă conturile de profesor.</p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card glass-premium">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Utilizatori</span>
            <span className="stat-val">{users.length}</span>
          </div>
        </div>
        <div className="admin-stat-card glass-premium" onClick={() => setActiveTab('requests')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon yellow"><UserCheck size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Cereri Profesori</span>
            <span className="stat-val">
              {activeTab === 'requests' ? users.length : users.filter(u => u.role === 'teacher' && !u.is_approved).length}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-content glass-premium">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Toți Utilizatorii
          </button>
          <button 
            className={`admin-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Cereri Profesori Pending
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="admin-filters">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Caută după nume sau email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <Filter size={18} />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">Toate rolurile</option>
                <option value="student">Elevi</option>
                <option value="teacher">Profesori</option>
                <option value="admin">Administratori</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="loading-state">Se încarcă datele...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>Nu s-au găsit utilizatori conform criteriilor.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Utilizator</th>
                  <th>Rol</th>
                  <th>Status</th>
                  <th>Data Înregistrării</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.full_name} />
                          ) : (
                            <span>{user.full_name?.[0] || '?'}</span>
                          )}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.full_name || 'Fără nume'}</span>
                          <span className="user-email">{user.email}</span>
                        </div>

                        {/* Interactive mini sanction indicator squares */}
                        <div className="user-sanctions-indicators">
                          {user.is_banned && (
                            <div 
                              className="sanction-indicator-square ban" 
                              title="Banat permanent. Apăsați pentru ridicare suspendare."
                              onClick={() => handleRestrictionClick(user.id, 'unban', user)}
                            >
                              <UserX size={12} />
                            </div>
                          )}
                          {user.timeout_until && new Date(user.timeout_until) > new Date() && (
                            <div 
                              className="sanction-indicator-square timeout" 
                              title={`Timeout activ până la ${new Date(user.timeout_until).toLocaleString('ro-RO')}. Apăsați pentru ridicare.`}
                              onClick={() => handleRestrictionClick(user.id, 'untimeout', user)}
                            >
                              <Clock size={12} />
                            </div>
                          )}
                          {user.mute_until && new Date(user.mute_until) > new Date() && (
                            <div 
                              className="sanction-indicator-square mute" 
                              title={`Mute activ până la ${new Date(user.mute_until).toLocaleString('ro-RO')}. Apăsați pentru ridicare.`}
                              onClick={() => handleRestrictionClick(user.id, 'unmute', user)}
                            >
                              <VolumeX size={12} />
                            </div>
                          )}
                          {user.is_ai_blacklisted && (
                            <div 
                              className="sanction-indicator-square ai" 
                              title="Blocat de la Asistentul AI. Apăsați pentru ridicare."
                              onClick={() => handleRestrictionClick(user.id, 'remove_ai_blacklist', user)}
                            >
                              <Bot size={12} />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Profesor' : 'Elev'}
                      </span>
                    </td>
                     <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        {user.is_approved ? (
                          <span className="status-badge approved"><CheckCircle size={12} /> Aprobat</span>
                        ) : (
                          <span className="status-badge pending"><AlertCircle size={12} /> În așteptare</span>
                        )}
                        {user.is_banned && (
                          <span className="status-badge banned"><UserX size={12} /> Suspendat (Ban)</span>
                        )}
                        {user.timeout_until && new Date(user.timeout_until) > new Date() && (
                          <span className="status-badge timeout" title={`Până la ${new Date(user.timeout_until).toLocaleString('ro-RO')}`}>
                            <Clock size={12} /> Timeout
                          </span>
                        )}
                        {user.mute_until && new Date(user.mute_until) > new Date() && (
                          <span className="status-badge muted" title={`Până la ${new Date(user.mute_until).toLocaleString('ro-RO')}`}>
                            <VolumeX size={12} /> Mute
                          </span>
                        )}
                        {user.is_ai_blacklisted && (
                          <span className="status-badge ai-blacklisted"><Bot size={12} /> AI Blacklist</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">
                        {(() => {
                          const dateVal = user.createdAt || user.created_at;
                          return dateVal && !isNaN(Date.parse(dateVal)) 
                            ? new Date(dateVal).toLocaleDateString('ro-RO')
                            : 'Nespecificat';
                        })()}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {activeTab === 'requests' ? (
                          <>
                            <button className="action-btn approve" onClick={() => handleAction(user.id, 'approve')}>
                              <CheckCircle size={16} /> Aprobă
                            </button>
                            <button className="action-btn reject" onClick={() => handleAction(user.id, 'reject')}>
                              <XCircle size={16} /> Respinge
                            </button>
                          </>
                        ) : (
                          <>
                            <select 
                              className="role-select"
                              value={user.role}
                              onChange={(e) => handleAction(user.id, 'change_role', e.target.value)}
                              disabled={user.role === 'admin'} // Protect admins from accidental demotion here
                            >
                              <option value="student">Setează Elev</option>
                              <option value="teacher">Setează Profesor</option>
                              <option value="admin">Setează Admin</option>
                            </select>

                             {user.role !== 'admin' && (
                              <div className="custom-dropdown-container" onClick={(e) => e.stopPropagation()}>
                                {(() => {
                                  const hasRestrictions = user.is_banned || 
                                    (user.timeout_until && new Date(user.timeout_until) > new Date()) || 
                                    (user.mute_until && new Date(user.mute_until) > new Date()) || 
                                    user.is_ai_blacklisted;
                                    
                                  return (
                                    <button 
                                      className={`custom-dropdown-trigger ${hasRestrictions ? 'has-restrictions' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdownUserId(activeDropdownUserId === user.id ? null : user.id);
                                      }}
                                    >
                                      Restricții <ChevronDown size={14} />
                                    </button>
                                  );
                                })()}

                                <AnimatePresence>
                                  {activeDropdownUserId === user.id && (
                                    <motion.div 
                                      className="custom-dropdown-menu glass-premium"
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      {user.is_banned ? (
                                        <button className="dropdown-item success" onClick={() => { handleRestrictionClick(user.id, 'unban', user); setActiveDropdownUserId(null); }}>
                                          <UserCheck size={14} /> Dezbanează (Unban)
                                        </button>
                                      ) : (
                                        <button className="dropdown-item danger" onClick={() => { handleRestrictionClick(user.id, 'ban', user); setActiveDropdownUserId(null); }}>
                                          <UserX size={14} /> Banează (Ban)
                                        </button>
                                      )}

                                      {user.timeout_until && new Date(user.timeout_until) > new Date() ? (
                                        <button className="dropdown-item success" onClick={() => { handleRestrictionClick(user.id, 'untimeout', user); setActiveDropdownUserId(null); }}>
                                          <Clock size={14} /> Scoate Timeout
                                        </button>
                                      ) : (
                                        <button className="dropdown-item warning" onClick={() => { handleRestrictionClick(user.id, 'timeout', user); setActiveDropdownUserId(null); }}>
                                          <Clock size={14} /> Aplică Timeout...
                                        </button>
                                      )}

                                      {user.mute_until && new Date(user.mute_until) > new Date() ? (
                                        <button className="dropdown-item success" onClick={() => { handleRestrictionClick(user.id, 'unmute', user); setActiveDropdownUserId(null); }}>
                                          <VolumeX size={14} /> Scoate Mute
                                        </button>
                                      ) : (
                                        <button className="dropdown-item warning" onClick={() => { handleRestrictionClick(user.id, 'mute', user); setActiveDropdownUserId(null); }}>
                                          <VolumeX size={14} /> Aplică Mute...
                                        </button>
                                      )}

                                      {user.is_ai_blacklisted ? (
                                        <button className="dropdown-item success" onClick={() => { handleRestrictionClick(user.id, 'remove_ai_blacklist', user); setActiveDropdownUserId(null); }}>
                                          <Bot size={14} /> Permite AI
                                        </button>
                                      ) : (
                                        <button className="dropdown-item dark" onClick={() => { handleRestrictionClick(user.id, 'ai_blacklist', user); setActiveDropdownUserId(null); }}>
                                          <Bot size={14} /> Blochează AI
                                        </button>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && modalUser && modalAction && (
          <div className="moderation-modal-overlay">
            <motion.div 
              className="moderation-modal-content glass-premium"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  {modalAction === 'ban' && '🛑 Suspendare Permanentă (Ban)'}
                  {modalAction === 'unban' && '✅ Ridicarea Suspendării (Unban)'}
                  {modalAction === 'timeout' && '⏳ Aplicare Timeout'}
                  {modalAction === 'untimeout' && '✅ Ridicarea Restricției Timeout'}
                  {modalAction === 'mute' && '🔇 Aplicare Restricție Mute (Chat)'}
                  {modalAction === 'unmute' && '✅ Ridicarea Restricției Mute'}
                  {modalAction === 'ai_blacklist' && '🤖 Blocare Asistent AI'}
                  {modalAction === 'remove_ai_blacklist' && '✅ Deblocare Asistent AI'}
                </h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <p>
                  Sigur doriți să efectuați această acțiune pentru utilizatorul{' '}
                  <strong>{modalUser.full_name}</strong> (<span className="email-highlight">{modalUser.email}</span>)?
                </p>

                {(modalAction === 'timeout' || modalAction === 'mute') && (
                  <div className="duration-picker-section">
                    <label className="duration-label">Durată restricție:</label>
                    <div className="preset-buttons">
                      {[
                        { label: '10 Min', val: 10 },
                        { label: '1 Oră', val: 60 },
                        { label: '12 Ore', val: 720 },
                        { label: '24 Ore', val: 1440 },
                        { label: '7 Zile', val: 10080 }
                      ].map((preset) => (
                        <button 
                          key={preset.val}
                          type="button" 
                          className={`preset-btn ${modalDuration === preset.val ? 'active' : ''}`}
                          onClick={() => setModalDuration(preset.val)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="custom-duration-input">
                      <input 
                        type="number" 
                        value={modalDuration}
                        onChange={(e) => setModalDuration(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <span className="input-suffix">minute</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Anulează
                </button>
                <button 
                  className={`btn-confirm ${
                    ['ban', 'timeout', 'mute', 'ai_blacklist'].includes(modalAction) ? 'danger' : 'success'
                  }`}
                  onClick={confirmModerationAction}
                >
                  Confirmă
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
