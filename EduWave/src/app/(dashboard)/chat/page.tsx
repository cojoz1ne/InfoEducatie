'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Send, MessageSquare, Users, X, Check, Paperclip, Mic, Trash2, Download, FileText, Loader2, Play, Pause
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import './chat.css';

type Conversation = {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  otherUserName?: string;
  otherUserId?: string;
  otherUserAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  senderName?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  waveform?: number[];
};

type UserInfo = {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
};

const waveBars = [
  20, 35, 45, 25, 60, 75, 50, 40, 65, 85, 55, 30, 45, 70, 90, 65, 35, 50, 75, 60, 40, 55, 80, 50, 30, 45, 65, 45, 25, 35, 55, 30, 20, 15
];

const normalizeAndFitWaveform = (peaks: number[], targetLength: number = 34): number[] => {
  if (!peaks || peaks.length === 0) return waveBars;
  const maxVal = Math.max(...peaks) || 1;
  // Apply a quadratic curve (Math.pow(ratio, 2)) to stretch volume ranges, creating more contrast (fluctuations)
  const normalized = peaks.map(p => {
    const ratio = p / maxVal;
    return Math.max(15, Math.round(Math.pow(ratio, 2) * 90));
  });
  const result: number[] = [];
  for (let i = 0; i < targetLength; i++) {
    const index = Math.floor((i / targetLength) * normalized.length);
    result.push(normalized[index] || 15);
  }
  return result;
};

const VoicePlayer = ({ src, isOwn, waveform }: { src: string; isOwn: boolean; waveform?: number[] }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (audio.readyState >= 1) {
      setDuration(audio.duration || 0);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error('Error playing audio:', err));
      setIsPlaying(true);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const time = percentage * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleSpeed = () => {
    if (!audioRef.current) return;
    let nextRate = 1;
    if (playbackRate === 1) nextRate = 1.5;
    else if (playbackRate === 1.5) nextRate = 2;
    else nextRate = 1;

    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const bars = waveform && waveform.length > 0 ? waveform : waveBars;

  return (
    <div className={`custom-voice-player ${isOwn ? 'own' : ''}`}>
      <button className="voice-play-btn" onClick={togglePlay}>
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </button>

      <div className="voice-timeline-container">
        <div className="voice-waveform" onClick={handleWaveformClick}>
          {bars.map((heightPercent, index) => {
            const barProgress = index / bars.length;
            const currentProgress = currentTime / (duration || 1);
            const isActive = barProgress <= currentProgress;
            return (
              <div
                key={index}
                className={`voice-wave-bar ${isActive ? 'active' : ''}`}
                style={{ height: `${(heightPercent * 24) / 100}px` }}
              />
            );
          })}
        </div>
        <div className="voice-time-info">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      <button className="voice-speed-btn" onClick={toggleSpeed}>
        {playbackRate}x
      </button>
    </div>
  );
};

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);

  // Attachment states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Audio refs for waveform volume analyzing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingAmplitudesRef = useRef<number[]>([]);

  // New conversation modal
  const [showNewConv, setShowNewConv] = useState(false);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [usersSearch, setUsersSearch] = useState('');

  // User name cache
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const myName = user?.full_name || 'Eu';

  // ===== LOAD CONVERSATIONS =====
  // ===== LOAD CONVERSATIONS =====
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/chat/direct/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data || []);
      }
    } catch (err: any) {
      console.error('Error loading conversations:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ===== LOAD ALL USERS (for new conversation) =====
  const loadAllUsers = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/chat/direct/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data || []);
      }
    } catch (err: any) {
      console.error('Error loading users:', err?.message || err);
    }
  };

  // ===== RESOLVE USER NAMES & AVATARS =====
  useEffect(() => {
    const resolveNames = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/chat/direct/users');
        if (res.ok) {
          const profiles = await res.json();
          const names: Record<string, string> = {};
          const avatars: Record<string, string> = {};

          names[user.id] = user.full_name || 'Eu';
          avatars[user.id] = user.avatar_url || '';

          profiles.forEach((p: any) => {
            names[p.id] = p.full_name || 'Utilizator';
            avatars[p.id] = p.avatar_url || '';
          });

          setUserNames(names);
          setUserAvatars(avatars);
        }
      } catch (err) {
        console.error('Error resolving names:', err);
      }
    };

    resolveNames();
  }, [user]);

  // ===== LOAD MESSAGES FOR ACTIVE CONVERSATION =====
  const loadMessages = useCallback(async () => {
    if (!activeConvId) return;
    try {
      const res = await fetch(`/api/chat/direct/messages?conversationId=${activeConvId}`);
      if (res.ok) {
        const data = await res.json();
        const enriched = data.map((msg: any) => ({
          ...msg,
          senderName: userNames[msg.sender_id] || 'Utilizator'
        }));
        setMessages(enriched);
      }
    } catch (err: any) {
      console.error('Error loading messages:', err?.message || err);
    }
  }, [activeConvId, userNames]);

  // ===== INITIAL LOAD =====
  useEffect(() => {
    if (user) loadConversations();
  }, [user, userNames]);

  // ===== LOAD MESSAGES WHEN CONV CHANGES =====
  useEffect(() => {
    if (activeConvId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeConvId, loadMessages]);

  // ===== POLLING FOR NEW MESSAGES =====
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (activeConvId) {
      pollRef.current = setInterval(() => {
        loadMessages();
      }, 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConvId, loadMessages]);

  // ===== POLLING FOR NEW CONVERSATIONS =====
  useEffect(() => {
    if (convPollRef.current) clearInterval(convPollRef.current);
    convPollRef.current = setInterval(() => {
      loadConversations();
    }, 5000);
    return () => { if (convPollRef.current) clearInterval(convPollRef.current); };
  }, [loadConversations]);

  // ===== SCROLL TO BOTTOM =====
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean up recording stream on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      return null;
    } catch (err) {
      console.error('Error uploading file:', err);
      return null;
    }
  };

  // Start recording voice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Reset recorded waveform peaks
      recordingAmplitudesRef.current = [];

      // Setup Web Audio API volume peaks tracking
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const sampleInterval = setInterval(() => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let max = 0;
          for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > max) max = dataArray[i];
          }
          // Push peak volume level
          recordingAmplitudesRef.current.push(max);
        }
      }, 150);
      recordingIntervalRef.current = sampleInterval;

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Nu s-a putut accesa microfonul. Te rugăm să permiți accesul.');
    }
  };

  // Stop recording and get the audio blob
  const stopRecordingAndGetBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
      
      // Clean up analyser resources
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsRecording(false);
    });
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };
      mediaRecorderRef.current.stop();
    }
    
    // Clean up analyser resources
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    recordingAmplitudesRef.current = [];

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const sendVoiceMessage = async () => {
    const peaks = [...recordingAmplitudesRef.current];
    const audioBlob = await stopRecordingAndGetBlob();
    if (!audioBlob || !activeConvId || !user) return;

    setSendingMsg(true);
    try {
      const fileExt = 'webm';
      const fileName = `Mesaj vocal - ${new Date().toLocaleDateString('ro-RO')} ${new Date().toLocaleTimeString('ro-RO')}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', audioBlob, `voice-${Date.now()}.${fileExt}`);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload audio failed');
      }

      const uploadData = await uploadRes.json();
      const audioUrl = uploadData.url;

      // Fit dynamic waveform amplitudes to 34 bars
      const fittedWaveform = normalizeAndFitWaveform(peaks, 34);

      const res = await fetch('/api/chat/direct/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: '',
          fileUrl: audioUrl,
          fileName: fileName,
          fileType: 'audio',
          waveform: fittedWaveform
        })
      });

      if (res.ok) {
        await loadMessages();
        await loadConversations();
      }
    } catch (err) {
      console.error('Error sending voice message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ===== SEND MESSAGE =====
  const sendMessage = async () => {
    if (!activeConvId || !user) return;
    if (!messageText.trim() && !selectedFile) return;

    const text = messageText.trim();
    setMessageText('');
    setSendingMsg(true);

    let fileUrl = '';
    let fileName = '';
    let fileType = '';

    if (selectedFile) {
      setUploadingFile(true);
      const url = await uploadFile(selectedFile);
      setUploadingFile(false);
      if (url) {
        fileUrl = url;
        fileName = selectedFile.name;
        const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
          fileType = 'image';
        } else if (['mp3', 'wav', 'ogg', 'm4a', 'webm'].includes(ext)) {
          fileType = 'audio';
        } else {
          fileType = 'file';
        }
      }
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    try {
      const res = await fetch('/api/chat/direct/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: text,
          fileUrl: fileUrl || undefined,
          fileName: fileName || undefined,
          fileType: fileType || undefined
        })
      });

      if (res.ok) {
        await loadMessages();
        await loadConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setSendingMsg(false);
  };

  // ===== CREATE NEW CONVERSATION =====
  const createConversation = async () => {
    if (!selectedUserId || !user) return;
    try {
      const res = await fetch('/api/chat/direct/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: selectedUserId
        })
      });

      if (res.ok) {
        const data = await res.json();
        await loadConversations();
        setActiveConvId(data.id);
        setShowNewConv(false);
        setSelectedUserId(null);
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  // ===== FORMAT TIME =====
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'Acum';
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'Ieri';
    return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  };

  const formatMsgTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  };

  // ===== ACTIVE CONVERSATION DATA =====
  const activeConv = conversations.find(c => c.id === activeConvId);

  // Filter conversations
  const filtered = conversations.filter(c => {
    const name = c.otherUserName || c.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter users in modal
  const filteredUsers = allUsers.filter(u =>
    u.full_name.toLowerCase().includes(usersSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#29b6f6', borderRadius: '50%' }}
        />
      </div>
    );
  }

  return (
    <div className="page-content-wrapper" style={{ padding: 0, maxWidth: 'none' }}>
      <div className="chat-shell">
        {/* ===== SIDEBAR ===== */}
        <div className="chat-sidebar-panel">
          <div className="chat-sidebar-head">
            <h2><MessageSquare size={20} /> Mesaje</h2>
            <button className="new-chat-btn" onClick={() => { setShowNewConv(true); loadAllUsers(); }}>
              <Plus size={18} />
            </button>
          </div>

          <div className="chat-search-box">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Caută conversație..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="conversations-list">
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
                <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 13, fontWeight: 600 }}>
                  {conversations.length === 0 ? 'Nicio conversație. Apasă + pentru a începe!' : 'Niciun rezultat.'}
                </p>
              </div>
            ) : (
              filtered.map(conv => (
                <div
                  key={conv.id}
                  className={`conv-item ${activeConvId === conv.id ? 'active' : ''}`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <div className={`conv-avatar ${conv.is_group ? 'group' : ''}`} style={{ overflow: 'hidden' }}>
                    {conv.is_group ? (
                      <Users size={18} />
                    ) : (conv.otherUserAvatar && !failedAvatars[conv.otherUserId || '']) ? (
                      <img 
                        src={conv.otherUserAvatar} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={() => setFailedAvatars(prev => ({ ...prev, [conv.otherUserId || '']: true }))}
                      />
                    ) : (
                      conv.otherUserName?.[0] || 'U'
                    )}
                  </div>
                  <div className="conv-info">
                    <div className="conv-top-row">
                      <span className="conv-name">{conv.otherUserName || conv.name || 'Chat'}</span>
                      <span className="conv-time">{formatTime(conv.lastMessageTime!)}</span>
                    </div>
                    <span className="conv-last-msg">{conv.lastMessage}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== MAIN CHAT ===== */}
        <div className="chat-main-panel">
          {!activeConv ? (
            <div className="chat-empty-state">
              <MessageSquare size={48} style={{ opacity: 0.3 }} />
              <h3>Selectează o conversație</h3>
              <p>Alege din lista din stânga sau apasă + pentru a începe o conversație nouă.</p>
            </div>
          ) : (
            <>
              <div className="chat-top-bar">
                <div className="chat-top-info">
                  <div className={`conv-avatar ${activeConv.is_group ? 'group' : ''}`} style={{ overflow: 'hidden' }}>
                    {activeConv.is_group ? (
                      <Users size={18} />
                    ) : (activeConv.otherUserAvatar && !failedAvatars[activeConv.otherUserId || '']) ? (
                      <img 
                        src={activeConv.otherUserAvatar} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={() => setFailedAvatars(prev => ({ ...prev, [activeConv.otherUserId || '']: true }))}
                      />
                    ) : (
                      activeConv.otherUserName?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <h3>{activeConv.otherUserName || activeConv.name || 'Chat'}</h3>
                    <span>Conversație privată</span>
                  </div>
                </div>
              </div>

              <div className="chat-messages-area" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                  <div className="chat-empty-state">
                    <Send size={32} style={{ opacity: 0.2 }} />
                    <p style={{ fontSize: 13 }}>Începe conversația cu un mesaj!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.sender_id === user?.id;
                    const hasAttachment = !!msg.file_url;
                    const hasText = !!msg.content;
                    const isMediaOnly = hasAttachment && !hasText;
                    return (
                      <motion.div
                        key={msg.id}
                        className={`msg-wrap ${isOwn ? 'own' : ''}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {!isOwn && <span className="msg-sender">{msg.senderName}</span>}
                        <div className={`msg-bubble ${isMediaOnly ? 'media-only' : ''} ${hasAttachment ? 'has-attachment' : ''}`}>
                          {msg.file_url && (
                            <div style={{ marginBottom: msg.content ? '8px' : '0' }}>
                              {msg.file_type === 'image' && (
                                <img
                                  src={msg.file_url}
                                  alt={msg.file_name || 'Imagine'}
                                  className="msg-image"
                                  onClick={() => window.open(msg.file_url, '_blank')}
                                />
                              )}
                              {msg.file_type === 'audio' && (
                                <VoicePlayer src={msg.file_url} isOwn={isOwn} waveform={msg.waveform} />
                              )}
                              {msg.file_type === 'file' && (
                                <a
                                  href={msg.file_url}
                                  download={msg.file_name}
                                  className="msg-file-card"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="msg-file-icon">
                                    <FileText size={24} />
                                  </div>
                                  <div className="msg-file-info">
                                    <span className="msg-file-name">{msg.file_name}</span>
                                    <span className="msg-file-size">Apasă pentru descărcare</span>
                                  </div>
                                  <div className="msg-file-download">
                                    <Download size={18} />
                                  </div>
                                </a>
                              )}
                            </div>
                          )}
                          {msg.content && <span>{msg.content}</span>}
                        </div>
                        <span className="msg-time-stamp">{formatMsgTime(msg.created_at)}</span>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {selectedFile && (
                <div className="chat-input-preview-bar">
                  <div className="chat-input-preview-info">
                    <Paperclip size={16} color="#29b6f6" />
                    <span className="chat-input-preview-name">{selectedFile.name}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button className="chat-input-preview-remove" onClick={removeSelectedFile}>
                    <X size={16} />
                  </button>
                </div>
              )}

              {isRecording ? (
                <div className="chat-input-bar">
                  <div className="chat-recording-bar">
                    <div className="chat-recording-status">
                      <div className="recording-dot" />
                      <span>Înregistrare voce... ({formatRecordingTime(recordingTime)})</span>
                    </div>
                    <div className="chat-recording-actions">
                      <button className="chat-recording-btn cancel" onClick={cancelRecording} title="Anulează">
                        <Trash2 size={20} />
                      </button>
                      <button className="chat-recording-btn send" onClick={sendVoiceMessage} title="Trimite">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-input-bar">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*,.zip,.rar"
                    onChange={handleFileChange}
                  />
                  <div className="chat-input-actions">
                    <button
                      className="chat-action-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={sendingMsg || uploadingFile}
                      title="Încarcă fișier (.zip, .rar, imagine)"
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>
                  <div className="chat-text-input">
                    <input
                      type="text"
                      placeholder="Scrie un mesaj..."
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      disabled={sendingMsg || uploadingFile}
                    />
                  </div>
                  <button
                    className="chat-action-btn"
                    onClick={startRecording}
                    disabled={sendingMsg || uploadingFile}
                    title="Mesaj vocal"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={(!messageText.trim() && !selectedFile) || sendingMsg || uploadingFile}
                  >
                    {uploadingFile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      {/* ===== NEW CONVERSATION MODAL ===== */}
      <AnimatePresence>
        {showNewConv && (
          <motion.div
            className="new-conv-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewConv(false)}
          >
            <motion.div
              className="new-conv-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3><MessageSquare size={20} /> Conversație Nouă</h3>

              <div className="chat-search-box" style={{ margin: '0 0 16px 0' }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Caută utilizator..."
                  value={usersSearch}
                  onChange={e => setUsersSearch(e.target.value)}
                />
              </div>

              <div className="users-search-list">
                {filteredUsers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: '#475569', fontSize: 13 }}>
                    Niciun utilizator găsit.
                  </div>
                ) : (
                  filteredUsers.map(u => (
                    <div
                      key={u.id}
                      className={`user-pick-item ${selectedUserId === u.id ? 'selected' : ''}`}
                      onClick={() => setSelectedUserId(u.id === selectedUserId ? null : u.id)}
                    >
                      <div className="user-pick-avatar" style={{ overflow: 'hidden' }}>
                        {(u.avatar_url && !failedAvatars[u.id]) ? (
                          <img 
                            src={u.avatar_url} 
                            alt="" 
                            referrerPolicy="no-referrer"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={() => setFailedAvatars(prev => ({ ...prev, [u.id]: true }))}
                          />
                        ) : (
                          u.full_name[0]
                        )}
                      </div>
                      <div>
                        <div className="user-pick-name">{u.full_name}</div>
                      </div>
                      {selectedUserId === u.id && (
                        <Check size={16} style={{ color: '#29b6f6', marginLeft: 'auto' }} />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={() => { setShowNewConv(false); setSelectedUserId(null); }}>
                  Anulează
                </button>
                <button
                  className="modal-start-btn"
                  disabled={!selectedUserId}
                  onClick={createConversation}
                >
                  Începe Chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
