'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  BookOpen, 
  Award, 
  Star, 
  Calendar, 
  Edit3,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import './profile.css';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string;
}

interface UserBadge {
  id: string;
  earned_at: string;
  badges: {
    title: string;
    description: string;
    icon: string;
    color: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState({
    courses: 0,
    badges: 0,
    points: 0 // Mock points based on badges or completions
  });
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      setProfile({
        id: user!.id,
        full_name: user?.full_name || 'Utilizator',
        email: user?.email || '',
        role: user?.role || 'student',
        avatar_url: user?.avatar_url || ''
      });

      const isTeacherUser = user?.role === 'teacher';
      let coursesCount = 0;
      
      if (isTeacherUser) {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const courses = await res.json();
          const teacherCourses = courses.filter((c: any) => c.teacher_id === user!.id);
          coursesCount = teacherCourses.length;
        }
      } else {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          coursesCount = data.courseCount || 0;
        }
      }

      const resBadges = await fetch('/api/badges');
      if (resBadges.ok) {
        const { badges: allBadges, earnedBadgeIds } = await resBadges.json();
        
        const earnedSet = new Set(earnedBadgeIds);
        const fetchedBadges = allBadges
          .filter((b: any) => earnedSet.has(b.id))
          .map((b: any) => ({
            id: b.id,
            earned_at: new Date().toISOString(),
            badges: {
              title: b.title,
              description: b.description,
              icon: b.icon,
              color: b.color
            }
          }));

        setBadges(fetchedBadges);
        setStats({
          courses: coursesCount,
          badges: fetchedBadges.length,
          points: fetchedBadges.length * 50
        });
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Te rog selectează o imagine validă.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Optimizare: Arătăm imaginea imediat local
      const reader = new FileReader();
      reader.onload = (e) => {
        if (profile) {
          setProfile({ ...profile, avatar_url: e.target?.result as string });
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) throw new Error('Eroare la încărcarea imaginii.');
      
      const uploadData = await uploadRes.json();
      const newAvatarUrl = uploadData.url;

      const profileRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: newAvatarUrl })
      });
      if (!profileRes.ok) throw new Error('Eroare la salvarea avatarului în profil.');

      if (profile) {
        setProfile({ ...profile, avatar_url: newAvatarUrl });
      }
      
      window.location.reload();
    } catch (error: any) {
      console.error('Eroare la încărcarea avatarului:', error);
      alert(`Eroare: ${error.message || 'A apărut o problemă la salvarea imaginii.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  const isTeacher = profile?.role === 'teacher';

  return (
    <div className="profile-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        style={{ display: 'none' }} 
        accept="image/*"
      />
      {/* Cover and Avatar Section */}
      <section className="profile-cover-section">
        <div className="profile-cover">
          <div className="cover-particles"></div>
        </div>
        
        <div className="profile-info-bar">
          <div className="profile-avatar-group">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} style={{ opacity: isUploading ? 0.5 : 1, transition: '0.3s' }} />
                ) : (
                  <span className="avatar-placeholder">{profile?.full_name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <button 
                className="avatar-edit-btn" 
                title="Schimbă poza de profil"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Edit3 size={16} />}
              </button>
            </div>
            
            <div className="profile-name-role">
              <h1 className="profile-name">{profile?.full_name}</h1>
              <div className={`profile-role-badge ${isTeacher ? 'teacher' : ''}`}>
                <Shield size={14} />
                {isTeacher ? 'Profesor' : 'Elev'}
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => window.location.href = '/settings'}>
              <Edit3 size={18} />
              Editează Profilul
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="profile-grid">
        {/* Sidebar Info */}
        <aside className="profile-sidebar">
          <div className="info-card">
            <h3 className="info-card-header">
              <Star className="icon" size={20} />
              Informații Contact
            </h3>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon-box">
                  <Mail size={18} />
                </div>
                <div className="info-text">
                  <h4>Email</h4>
                  <p>{profile?.email || 'Nespecificat'}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-box">
                  <Calendar size={18} />
                </div>
                <div className="info-text">
                  <h4>Membru din</h4>
                  <p>{new Date((user as any)?.createdAt || Date.now()).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="profile-main">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon courses">
                <BookOpen size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.courses}</h3>
                <p>Cursuri {isTeacher ? 'Create' : 'Înscrise'}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon badges">
                <Award size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.badges}</h3>
                <p>Insigne Obținute</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon points">
                <Star size={28} />
              </div>
              <div className="stat-info">
                <h3>{stats.points}</h3>
                <p>Puncte de Experiență</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
