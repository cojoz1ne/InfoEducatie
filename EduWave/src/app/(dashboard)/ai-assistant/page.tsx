'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  PlusCircle,
  Settings,
  MessageSquare,
  Trash2,
  Menu,
  X,
  GraduationCap,
  FileText,
  ListChecks,
  ChevronUp,
  ChevronDown,
  ShieldAlert,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@/context/AuthContext';

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
};

const AIAssistantPage = () => {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [functionMode, setFunctionMode] = useState<string>('general');
  const [selectedModel, setSelectedModel] = useState<string>('gemini');
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const firstName = user?.full_name?.split(' ')[0] || '';

  const GREETINGS: Record<string, string> = {
    general: `Salut ${firstName}! Sunt asistentul tău personal EduWave bazat pe IA. Cu ce te pot ajuta astăzi?`,
    explain: `Salut ${firstName}! Ce lecție sau concept vrei să îți explic?`,
    summarize: `Salut ${firstName}! Lipește textul pe care vrei să îl rezum.`,
    quiz: `Salut ${firstName}! Despre ce vrei să fie quizul?`,
  };

  const getGreeting = (mode: string): Message => ({
    role: 'assistant',
    content: GREETINGS[mode] ?? GREETINGS.general
  });

  // 1. Fetch Conversations on Mount
  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConvId) {
          setActiveConvId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Eroare la încărcarea conversațiilor:", error);
    }
  };

  // 2. Fetch Messages when Active Conversation changes
  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    } else {
      setMessages([getGreeting(functionMode)]);
    }
  }, [activeConvId]);

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMessages(data as Message[]);
        } else {
          setMessages([getGreeting(functionMode)]);
        }
      } else {
        setMessages([getGreeting(functionMode)]);
      }
    } catch (error) {
      console.error("Eroare la încărcarea mesajelor:", error);
      setMessages([getGreeting(functionMode)]);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // 3. Create a new chat
  const handleNewChat = () => {
    setFunctionMode('general');
    setActiveConvId(null);
    setMessages([getGreeting('general')]);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  // Function modes (Copilot-style sidebar)
  const FUNCTIONS = [
    { id: 'general', label: 'Chat general', icon: MessageSquare },
    { id: 'explain', label: 'Explică o lecție', icon: GraduationCap },
    { id: 'summarize', label: 'Rezumă text', icon: FileText },
    { id: 'quiz', label: 'Generează quiz', icon: ListChecks },
  ];

  const AI_MODELS = [
    { id: 'gemini', label: 'Gemini', type: 'online' },
    { id: 'openai', label: 'OpenAI', type: 'online' },
    { id: 'ollama', label: 'Ollama', type: 'local' },
  ];

  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const selectFunction = (id: string) => {
    setFunctionMode(id);
    setActiveConvId(null);
    setMessages([getGreeting(id)]);
    setInput('');
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  // 4. Delete a chat
  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chat/conversations?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) {
          setActiveConvId(null);
        }
      }
    } catch (error) {
      console.error("Eroare la ștergerea conversației:", error);
    }
  };

  // 5. Send Message
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input.trim();
    if (!textToSend || !user) return;

    // A. Save User Message to UI & Clear Input
    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // B. Call AI API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          conversationId: activeConvId,
          mode: functionMode,
          model: selectedModel
        })
      });
      
      const data = await res.json();
      const aiReplyText = !res.ok || data.error ? `Eroare: ${data.error || 'Eroare la AI'}` : data.reply;
      
      const aiMessage: Message = { role: 'assistant', content: aiReplyText };
      setMessages(prev => [...prev, aiMessage]);

      // If it's a new conversation, update active ID and list
      if (!activeConvId && data.conversationId) {
        setActiveConvId(data.conversationId);
        loadConversations();
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Eroare de conexiune la server.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isBlacklisted = user?.is_ai_blacklisted ?? false;

  return (
    <div 
      className="page-content-wrapper" 
      style={{ 
        padding: 0, 
        maxWidth: 'none', 
        position: 'relative', 
        height: 'calc(100vh - 120px)',
        minHeight: '500px'
      }}
    >
      <div className={`ai-layout ${isBlacklisted ? 'blurred-element' : ''}`}>

      {/* Sidebar */}
      <div className={`ai-sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="ai-sidebar-header">
          <div className="flex-align">
            <h2>EduWave AI</h2>
          </div>
          <div className="ai-sidebar-header-actions">
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="ai-sidebar-body">
          <button className="ai-new-chat-btn btn-primary" onClick={() => { setFunctionMode('general'); handleNewChat(); }}>
            <PlusCircle size={18} /> <span className="new-chat-label">Chat Nou</span>
          </button>

          <div className="ai-functions">
            <span className="history-label">Funcții</span>
            {FUNCTIONS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  className={`function-item ${functionMode === f.id ? 'active' : ''}`}
                  onClick={() => selectFunction(f.id)}
                >
                  <Icon size={18} className="function-icon" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="history-list">
            <span className="history-label">Istoric</span>
            <div className="history-scroll">
              {conversations.length === 0 ? (
                <p className="no-chats">Nicio conversație recentă.</p>
              ) : (
                conversations.map(conv => (
                  <div 
                    key={conv.id} 
                    className={`history-item ${activeConvId === conv.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      if (window.innerWidth < 768) setShowSidebar(false);
                    }}
                  >
                    <MessageSquare size={16} className="conv-icon" />
                    <span className="conv-title">{conv.title}</span>
                    <button 
                      className="delete-conv-btn"
                      onClick={(e) => handleDeleteChat(conv.id, e)}
                      title="Șterge conversația"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <button className="mobile-toggle-btn" onClick={() => setShowSidebar(true)}>
            <Menu size={20} />
          </button>
        </div>
        <div className="messages-container" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-wrapper ${msg.role}`}
            >
              {msg.role === 'assistant' ? (
                <div className="msg-row">
                  <div className="msg-avatar-box">
                    <img src="/logo-collapsed.png" alt="EduWave AI" />
                  </div>
                  <div className="msg-content">
                    <div className="msg-sender-label">EduWave AI</div>
                    <div className="message-bubble markdown-body">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return match ? (
                              <div className="code-block-wrapper">
                                <div className="code-block-header">
                                  <span className="code-lang">{match[1]}</span>
                                </div>
                                <SyntaxHighlighter
                                  style={vscDarkPlus as any}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, borderRadius: '0 0 8px 8px', background: '#1e1e1e', padding: '16px' }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="msg-row user-row">
                  <div className="msg-content user-content">
                    <div className="msg-sender-label user-label">{user?.full_name?.split(' ')[0] || 'Tu'}</div>
                    <div className="message-bubble">{msg.content}</div>
                  </div>
                  <div className="msg-avatar-box user-avatar">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user?.full_name?.split(' ')[0] || 'Tu'} />
                    ) : (
                      <span className="avatar-initials">{(user?.full_name?.split(' ')[0] || 'Tu')[0]}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="msg-row">
                <div className="msg-avatar-box">
                  <img src="/logo-collapsed.png" alt="EduWave AI" />
                </div>
                <div className="msg-content">
                  <div className="msg-sender-label">EduWave AI</div>
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer">
          <div className="model-dropdown">
            <button
              type="button"
              className="model-dropdown-trigger"
              onClick={() => setModelMenuOpen(o => !o)}
            >
              <span className="model-trigger-label">
                <span className={`model-dot ${currentModel.type}`}></span>
                {currentModel.label}
              </span>
              {modelMenuOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
            {modelMenuOpen && (
              <>
                <div className="model-menu-overlay" onClick={() => setModelMenuOpen(false)} />
                <div className="model-menu">
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={`model-menu-item ${selectedModel === m.id ? 'active' : ''}`}
                      onClick={() => { setSelectedModel(m.id); setModelMenuOpen(false); }}
                    >
                      <span className={`model-dot ${m.type}`}></span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <form onSubmit={handleSend} className="input-wrapper glass">
            <input 
              type="text" 
              placeholder="Întreabă AI-ul orice..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
      </div>

      {isBlacklisted && (
        <div className="ai-restricted-overlay">
          <div className="ai-restricted-card glass-premium">
            <ShieldAlert size={48} className="restricted-icon" />
            <h2>Acces Restricționat 🤖</h2>
            <p>
              Accesul tău la asistentul AI EduWave a fost suspendat de către un administrator.
            </p>
            <p className="contact-admin-sub">
              Dacă consideri că este o eroare, te rugăm să contactezi un administrator al platformei.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`

        .ai-layout {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 0;
          height: 100%;
          min-height: 0;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08));
          background: var(--sidebar-bg, rgba(13, 20, 38, 0.7));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-toggle-btn {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .mobile-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .ai-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 20px;
          min-width: 0;
          background: rgba(10, 15, 28, 0.35);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          box-shadow: none !important;
        }

        .ai-sidebar-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 4px;
          margin-top: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
        }

        .ai-sidebar-body::-webkit-scrollbar { width: 5px; }
        .ai-sidebar-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.18); border-radius: 8px; }

        .ai-functions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .function-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .function-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .function-item.active {
          background: var(--primary-gradient);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 10px 25px rgba(30, 111, 217, 0.2);
        }

        .function-icon {
          flex-shrink: 0;
        }

        .flex-align {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-sidebar-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .close-sidebar {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .ai-new-chat-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
        }

        .ai-new-chat-btn:hover {
          transform: none;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .history-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .history-scroll {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-right: 4px;
        }

        .history-scroll::-webkit-scrollbar { width: 4px; }
        .history-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 7px 12px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.2;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .history-item.active {
          background: var(--primary-gradient);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 10px 25px rgba(30, 111, 217, 0.2);
        }

        .conv-icon {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .conv-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .delete-conv-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          padding: 4px;
        }

        .history-item:hover .delete-conv-btn {
          opacity: 1;
        }

        .delete-conv-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }

        .no-chats {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          margin-top: 20px;
        }

        .chat-area {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
          padding: 0;
          background: transparent;
        }

        .chat-header {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          scroll-behavior: smooth;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 85%;
        }

        .message-wrapper.assistant {
          align-self: flex-start;
        }
        .message-wrapper.user { align-self: flex-end; align-items: flex-end; }

        .msg-sender-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.3px;
          padding-left: 0;
        }

        .msg-avatar-box {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .msg-avatar-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .msg-content {
          min-width: 0;
        }

        .msg-row {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 10px;
        }

        .msg-row.user-row {
          justify-content: flex-end;
        }

        .user-content {
          text-align: right;
        }

        .msg-sender-label.user-label {
          text-align: right;
        }

        .msg-avatar-box .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 14px;
          font-weight: 700;
          color: white;
          background: var(--primary-gradient);
        }

        .message-bubble {
          padding: 0;
          font-size: 14.5px;
          line-height: 1.6;
        }

        .message-wrapper.assistant .message-bubble {
          color: var(--text-main);
        }

        .message-wrapper.user .message-bubble {
          color: var(--text-main);
        }

        .message-bubble.typing {
          padding: 4px 0;
        }

        .chat-footer {
          padding: 20px 24px;
          background: transparent;
        }

        .model-dropdown {
          position: relative;
          display: inline-block;
          margin-bottom: 12px;
        }

        .model-dropdown-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition: color 0.2s ease;
        }

        .model-dropdown-trigger:hover {
          color: var(--text-main);
        }

        .model-trigger-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .model-menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 10;
        }

        .model-menu {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          min-width: 160px;
          background: rgba(13, 20, 38, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 20;
        }

        .model-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .model-menu-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
        }

        .model-menu-item.active {
          background: var(--primary-gradient);
          color: #fff;
        }

        .model-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .model-dot.online { background: #4ade80; }
        .model-dot.local { background: #fbbf24; }

        .input-wrapper {
          display: flex;
          align-items: center;
          padding: 6px 6px 6px 20px;
          border-radius: 30px;
          background: rgba(10, 16, 32, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within {
          border-color: #29b6f6;
          background: rgba(10, 16, 32, 0.85);
          box-shadow: 0 0 25px rgba(41, 182, 246, 0.2), inset 0 0 10px rgba(41, 182, 246, 0.05);
          transform: translateY(-1px);
        }

        .input-wrapper input {
          flex: 1;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          color: white !important;
          padding: 12px 0 !important;
          outline: none !important;
          font-size: 15px;
        }

        .input-wrapper input::placeholder {
          color: var(--text-muted) !important;
          opacity: 0.7 !important;
        }

        .send-btn {
          width: 42px;
          height: 42px;
          background: var(--primary-gradient);
          border: none;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.08) rotate(-15deg);
          box-shadow: 0 0 15px rgba(41, 182, 246, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #475569;
        }

        .typing span {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: var(--text-secondary);
          border-radius: 50%;
          margin: 0 2px;
          animation: typing 1.4s infinite both;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Markdown styles are defined globally in globals.css (.markdown-body) */
          @media (max-width: 768px) {
            .ai-layout {
              height: 100%;
              grid-template-columns: 1fr;
            }
          .mobile-toggle-btn {
            display: flex;
          }
          .ai-sidebar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 1000;
            transform: translateX(-110%);
            background: #090e1a !important;
            box-shadow: 20px 0 40px rgba(0, 0, 0, 0.7) !important;
            border-radius: 0 28px 28px 0;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
          }
          .ai-sidebar.show {
            transform: translateX(0);
          }
          .close-sidebar {
            display: block;
          }
          .chat-area {
            flex: 1;
            height: 100%;
            min-height: 0;
            border-radius: 0;
          }
          .chat-header {
            padding: 12px 16px;
          }
          .messages-container {
            padding: 16px;
            gap: 16px;
          }
          .chat-footer {
            padding: 12px 16px;
          }
          .message-wrapper {
            max-width: 95%;
          }
        .blurred-element {
          filter: blur(12px);
          pointer-events: none;
          user-select: none;
        }

        .ai-restricted-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 28px;
          padding: 24px;
        }

        .ai-restricted-card {
          max-width: 440px;
          width: 100%;
          background: rgba(30, 41, 59, 0.85) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          backdrop-filter: blur(16px);
          animation: scaleUp 0.3s ease-out;
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .restricted-icon {
          color: #ef4444;
          margin-bottom: 8px;
        }

        .ai-restricted-card h2 {
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }

        .ai-restricted-card p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .contact-admin-sub {
          font-size: 12px !important;
          opacity: 0.7;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 16px;
          margin-top: 8px !important;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AIAssistantPage;
