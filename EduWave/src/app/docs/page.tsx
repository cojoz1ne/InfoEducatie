'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Award, 
  BookOpen, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

const DocsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simple text-based version of documentation for download
    const docText = `DOCUMENTATIE OFICIALA EDUWAVE LMS\n\n` +
      `Platforma Educationala de Ultima Generatie\n` +
      `Creat cu dragoste pentru educatie.\n\n` +
      `PAGINA 1: INTRODUCERE SI ROLURI\n` +
      `EduWave LMS este o platforma de management al invatarii care integreaza gamificarea, catalogul electronic si inteligenta artificiala pentru a oferi o experienta educationala premium elevilor si profesorilor.\n` +
      `Roluri:\n` +
      `- Elev: Vizualizare note, absente, puncte de comportament, asistent AI si colectare insigne.\n` +
      `- Profesor: Creare cursuri, notare, inregistrare absente, acordare puncte.\n` +
      `- Diriginte: Monitorizare statistica a clasei, motivare absente, rapoarte.\n\n` +
      `PAGINA 2: GAMIFICAREA SI ASISTENTUL AI\n` +
      `- Streak-ul Zilnic (🔥): Premiaza consecventa in studiu.\n` +
      `- Insignele: Medalii speciale acordate automat la terminarea quiz-urilor sau manual de profesori.\n` +
      `- EduWave AI Assistant: Tutore inteligent integrat disponibil 24/7 pentru raspunsuri instantanee.\n\n` +
      `Versiune: v1.4.2 | EduWave Corporation 2026`;

    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Documentatie_EduWave.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="docs-viewer-container">
      {/* Top Toolbar */}
      <div className="docs-toolbar glass">
        <div className="toolbar-left">
          <Link href="/" className="btn-back">
            <ArrowLeft size={16} />
            <span>Înapoi pe site</span>
          </Link>
          <div className="toolbar-divider"></div>
          <div className="doc-title-wrapper">
            <FileText size={18} color="#29b6f6" />
            <span className="doc-title">Documentatie_EduWave_Official.pdf</span>
          </div>
        </div>

        <div className="toolbar-center">
          <button 
            className="btn-tool" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="page-indicator">Pagina {currentPage} din 3</span>
          <button 
            className="btn-tool" 
            onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
            disabled={currentPage === 3}
          >
            <ChevronRight size={18} />
          </button>
          <div className="toolbar-divider"></div>
          <button 
            className="btn-tool"
            onClick={() => setZoom(prev => Math.max(70, prev - 10))}
          >
            <ZoomOut size={16} />
          </button>
          <span className="zoom-text">{zoom}%</span>
          <button 
            className="btn-tool"
            onClick={() => setZoom(prev => Math.min(150, prev + 10))}
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="toolbar-right">
          <button className="btn-action-primary" onClick={handleDownload}>
            <Download size={15} />
            <span>Descarcă PDF</span>
          </button>
          <button className="btn-action-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Printează PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Canvas */}
      <div className="docs-canvas">
        {/* Sidebar Navigation */}
        <div className="docs-sidebar glass">
          <h3 className="sidebar-section-title">SECȚIUNI DOCUMENT</h3>
          <div className="sidebar-links">
            <button 
              className={`sidebar-link ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              <span className="page-badge">1</span>
              <div className="link-meta">
                <h4>Copertă Oficială</h4>
                <span>Pagina de titlu</span>
              </div>
            </button>
            <button 
              className={`sidebar-link ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
            >
              <span className="page-badge">2</span>
              <div className="link-meta">
                <h4>Capitolul I</h4>
                <span>Ghidul Utilizatorului & Roluri</span>
              </div>
            </button>
            <button 
              className={`sidebar-link ${currentPage === 3 ? 'active' : ''}`}
              onClick={() => setCurrentPage(3)}
            >
              <span className="page-badge">3</span>
              <div className="link-meta">
                <h4>Capitolul II</h4>
                <span>Gamificare & Asistent AI</span>
              </div>
            </button>
          </div>

          <div className="docs-sidebar-info">
            <ShieldCheck size={16} color="#10b981" />
            <p>Document certificat digital de către administratorul platformei EduWave Corporation.</p>
          </div>
        </div>

        {/* PDF Sheets Container */}
        <div className="pdf-sheets-viewport">
          {/* PAGE 1: COVER PAGE */}
          {currentPage === 1 && (
            <div className="pdf-sheet" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="pdf-decor-top"></div>
              
              <div className="pdf-cover-content">
                <div className="pdf-cover-logo-wrapper">
                  <img src="/wave_education.png" alt="EduWave Logo" className="pdf-cover-logo" />
                  <span className="pdf-logo-tag">DOCUMENT STATUTAR</span>
                </div>

                <div className="pdf-cover-title-group">
                  <h1 className="pdf-doc-main-title">EduWave LMS</h1>
                  <h2 className="pdf-doc-subtitle">Manualul Oficial de Utilizare, Ghidul Utilizatorului și Specificații Tehnice</h2>
                  <div className="pdf-title-divider"></div>
                  <p className="pdf-cover-desc">
                    Acest document reprezintă ghidul oficial de utilizare și documentația arhitecturală a platformei EduWave LMS. 
                    Conține instrucțiuni detaliate referitoare la rolurile elevilor, profesorilor și diriginților, precum și integrarea asistentului AI și a gamificării.
                  </p>
                </div>

                <div className="pdf-metadata-table">
                  <div className="meta-row">
                    <span className="meta-label">Versiune Document:</span>
                    <span className="meta-value">v1.4.2 (Stable Release)</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Data publicării:</span>
                    <span className="meta-value">18 Mai 2026</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Departament:</span>
                    <span className="meta-value">Inginerie Software & Educație Digitală</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Autor principal:</span>
                    <span className="meta-value">Echipa de Dezvoltare EduWave Corporation</span>
                  </div>
                </div>

                <div className="pdf-cover-footer">
                  <div className="footer-stamp">
                    <div className="stamp-inner">
                      <span>VERIFICAT & APROBAT</span>
                      <small>EDUwave AI 2026</small>
                    </div>
                  </div>
                  <div className="footer-text-meta">
                    <p>© {new Date().getFullYear()} EduWave Corporation. Toate drepturile rezervate.</p>
                    <span>Acest document este proprietatea intelectuală a EduWave. Distribuirea este permisă doar în scopuri educaționale.</span>
                  </div>
                </div>
              </div>

              <div className="pdf-page-number">Pagina 1 din 3</div>
            </div>
          )}

          {/* PAGE 2: USER MANUAL & ROLES */}
          {currentPage === 2 && (
            <div className="pdf-sheet" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="pdf-header">
                <span className="header-doc-title">Documentație Oficială EduWave LMS</span>
                <span className="header-chapter">Capitolul I: Introducere și Roluri</span>
              </div>

              <div className="pdf-content">
                <h3 className="pdf-h3">1. Structura Generală a Platformei</h3>
                <p className="pdf-p">
                  EduWave LMS este o platformă modernă de tip <strong>Learning Management System (LMS)</strong> concepută pentru a eficientiza comunicarea, predarea și evidența activităților școlare în timp real. Platforma folosește o arhitectură cloud modulară cu acces bazat pe roluri (RBAC).
                </p>

                <h3 className="pdf-h3">2. Permisiuni și Funcționalități pe Roluri</h3>
                <p className="pdf-p">
                  Sistemul diferențiază trei tipuri principale de utilizatori în interiorul ecosistemului școlar:
                </p>

                <div className="pdf-role-grid">
                  <div className="role-item">
                    <div className="role-header">
                      <span className="role-icon elev-bg">E</span>
                      <h4>Rolul de Elev</h4>
                    </div>
                    <ul className="role-list">
                      <li>Acces complet la cursurile și materialele de studiu create de profesori.</li>
                      <li>Susținerea testelor (quiz-urilor) de evaluare atașate lecțiilor.</li>
                      <li>Vizualizarea catalogului electronic personal (note, absențe, mesaje).</li>
                      <li>Interacțiunea cu asistentul de învățare bazat pe Inteligență Artificială.</li>
                    </ul>
                  </div>

                  <div className="role-item">
                    <div className="role-header">
                      <span className="role-icon prof-bg">P</span>
                      <h4>Rolul de Profesor</h4>
                    </div>
                    <ul className="role-list">
                      <li>Crearea și modificarea structurii cursurilor, capitolelor și lecțiilor.</li>
                      <li>Adăugarea de quiz-uri interactive cu întrebări cu opțiuni multiple.</li>
                      <li>Notarea elevilor, introducerea absențelor și a observațiilor.</li>
                      <li>Crearea și acordarea de insigne personalizate elevilor performanți.</li>
                    </ul>
                  </div>

                  <div className="role-item font-diriginte">
                    <div className="role-header">
                      <span className="role-icon dirig-bg">D</span>
                      <h4>Rolul de Diriginte</h4>
                    </div>
                    <ul className="role-list">
                      <li>Acces complet la statistica generală a clasei (medii, prezență, comportament).</li>
                      <li><strong>Motivarea absențelor</strong> înregistrate de ceilalți profesori.</li>
                      <li>Generarea fișelor de raport pentru ședințele cu părinții.</li>
                      <li>Evidența punctelor de comportament și a sancțiunilor aplicate.</li>
                    </ul>
                  </div>
                </div>

                <h3 className="pdf-h3">3. Managementul Securității</h3>
                <p className="pdf-p">
                  Toate datele sunt securizate prin intermediul serviciului <strong>Supabase Auth</strong>. Datele catalogului sunt auditate constant, iar profesorii pot modifica notele doar în termenele stabilite de regulamentul școlar oficial, orice acțiune fiind salvată în logurile de securitate ale sistemului.
                </p>
              </div>

              <div className="pdf-page-number">Pagina 2 din 3</div>
            </div>
          )}

          {/* PAGE 3: GAMIFICATION & AI ASSISTANT */}
          {currentPage === 3 && (
            <div className="pdf-sheet" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="pdf-header">
                <span className="header-doc-title">Documentație Oficială EduWave LMS</span>
                <span className="header-chapter">Capitolul II: Gamificare și Inteligență Artificială</span>
              </div>

              <div className="pdf-content">
                <h3 className="pdf-h3">4. Sistemul Integrat de Gamificare</h3>
                <p className="pdf-p">
                  EduWave utilizează mecanisme avansate de gamificare pentru a crește gradul de implicare a elevilor și a preveni abandonul școlar digital. Acestea includ:
                </p>

                <div className="pdf-feature-row">
                  <div className="feature-icon-box">
                    <Award size={20} color="#29b6f6" />
                  </div>
                  <div className="feature-text-box">
                    <h4>Insigne & Medalii Inteligente (Badges)</h4>
                    <p>Elevii primesc automat insigne (ex: <i>"Campionul Algoritmilor"</i>, <i>"Prezență de Fier"</i>) la finalizarea anumitor capitole sau cursuri. Profesorii pot crea insigne customizate cu grafică unică din panoul de administrare al cursului.</p>
                  </div>
                </div>

                <div className="pdf-feature-row">
                  <div className="feature-icon-box">
                    <span style={{ fontSize: '20px' }}>🔥</span>
                  </div>
                  <div className="feature-text-box">
                    <h4>Streak-ul Zilnic (Studiu Consecvent)</h4>
                    <p>Fiecare zi consecutivă în care un elev accesează lecțiile sau rezolvă un quiz îi crește "Streak-ul". Menținerea unui streak activ de lungă durată oferă bonusuri în catalogul de comportament și acces la teme secrete de design pentru profil.</p>
                  </div>
                </div>

                <h3 className="pdf-h3">5. Asistentul Inteligent EduWave AI</h3>
                <p className="pdf-p">
                  Asistentul AI este bazat pe un model de limbaj optimizat, integrat local în arhitectura Next.js a platformei.
                </p>
                
                <div className="pdf-chat-mock-container">
                  <div className="mock-chat-heading">Interacțiune Simulată:</div>
                  <div className="mock-chat-bubble ai">
                    <Sparkles size={12} color="#29b6f6" />
                    <p><strong>EduWave AI:</strong> Salut! Sunt tutorele tău virtual. Am observat că te pregătești pentru examenul de fizică. Vrei să facem un quiz rapid pe tema forțelor? 🚀</p>
                  </div>
                  <div className="mock-chat-bubble user">
                    <p><strong>Elev:</strong> Da, te rog! Explică-mi forța de frecare.</p>
                  </div>
                </div>

                <h3 className="pdf-h3">6. Instrucțiuni pentru Generarea Fizică a Documentului</h3>
                <p className="pdf-p" style={{ fontSize: '12px', color: '#64748b' }}>
                  Pentru a obține acest document în format fizic PDF sau pentru a-l imprima pe hârtie A4, faceți click pe butonul <strong>"Printează PDF"</strong> din bara de instrumente de sus. În fereastra de dialog a sistemului, selectați <i>"Save as PDF"</i> sau imprimanta fizică preferată. Designul este optimizat automat pentru aspectul standard A4.
                </p>
              </div>

              <div className="pdf-page-number">Pagina 3 din 3</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .docs-viewer-container {
          min-height: 100vh;
          background: #090d16;
          color: white;
          font-family: 'Outfit', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Top Toolbar Styles */
        .docs-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(10, 16, 32, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1000;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }

        .btn-back:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
          transform: translateX(-3px);
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
        }

        .doc-title-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .doc-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.5px;
        }

        .toolbar-center {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.2);
          padding: 6px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-tool {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-tool:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .btn-tool:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .page-indicator {
          font-size: 13px;
          font-weight: 600;
          color: white;
          min-width: 110px;
          text-align: center;
        }

        .zoom-text {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          min-width: 44px;
          text-align: center;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-action-primary {
          background: var(--primary-gradient);
          color: white;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(30, 111, 217, 0.25);
          transition: all 0.2s ease;
        }

        .btn-action-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 111, 217, 0.4);
          filter: brightness(1.1);
        }

        .btn-action-secondary {
          background: rgba(255, 255, 255, 0.04);
          color: white;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-action-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* Workspace Grid */
        .docs-canvas {
          margin-top: 70px;
          flex: 1;
          display: grid;
          grid-template-columns: 280px 1fr;
          height: calc(100vh - 70px);
          overflow: hidden;
        }

        /* Sidebar Navigation */
        .docs-sidebar {
          background: rgba(10, 16, 32, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          overflow-y: auto;
        }

        .sidebar-section-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          text-transform: uppercase;
          padding-left: 8px;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .sidebar-link {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background: rgba(41, 182, 246, 0.05);
          border-color: rgba(41, 182, 246, 0.25);
        }

        .page-badge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .sidebar-link:hover .page-badge {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .sidebar-link.active .page-badge {
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 4px 10px rgba(30, 111, 217, 0.3);
        }

        .link-meta h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 2px;
        }

        .link-meta span {
          font-size: 11px;
          color: var(--text-secondary);
          display: block;
        }

        .docs-sidebar-info {
          background: rgba(16, 185, 129, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .docs-sidebar-info p {
          font-size: 11.5px;
          line-height: 1.5;
          color: #a7f3d0;
          margin: 0;
        }

        /* Viewport Canvas */
        .pdf-sheets-viewport {
          flex: 1;
          background: #080b13;
          padding: 40px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          height: 100%;
        }

        /* Virtual PDF Sheet (A4 Proportion) */
        .pdf-sheet {
          width: 794px; /* Standard A4 width at 96 DPI */
          height: 1123px; /* Standard A4 height at 96 DPI */
          min-height: 1123px;
          background: #ffffff;
          color: #1e293b;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(41, 182, 246, 0.05);
          border-radius: 4px;
          position: relative;
          padding: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transform-origin: top center;
          transition: transform 0.2s ease;
        }

        /* Page 1 Decor */
        .pdf-decor-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 16px;
          background: var(--brand-gradient);
        }

        .pdf-cover-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .pdf-cover-logo-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
        }

        .pdf-cover-logo {
          height: 48px;
          width: auto;
        }

        .pdf-logo-tag {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #475569;
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .pdf-cover-title-group {
          margin: 60px 0;
        }

        .pdf-doc-main-title {
          font-size: 56px;
          font-weight: 900;
          line-height: 1;
          color: #0f172a;
          letter-spacing: -2px;
          margin-bottom: 12px;
        }

        .pdf-doc-subtitle {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          color: #475569;
          margin-bottom: 32px;
        }

        .pdf-title-divider {
          width: 80px;
          height: 6px;
          background: #1e6fd9;
          border-radius: 3px;
          margin-bottom: 32px;
        }

        .pdf-cover-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: #334155;
        }

        .pdf-metadata-table {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 8px;
        }

        .meta-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .meta-label {
          font-weight: 700;
          font-size: 13px;
          color: #475569;
        }

        .meta-value {
          font-weight: 500;
          font-size: 13px;
          color: #0f172a;
        }

        .pdf-cover-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }

        .footer-stamp {
          width: 140px;
          height: 140px;
          border: 3px double #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .stamp-inner {
          width: 120px;
          height: 120px;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 1px;
        }

        .stamp-inner small {
          font-size: 8px;
          color: #cbd5e1;
          margin-top: 2px;
        }

        .footer-text-meta {
          max-width: 440px;
          text-align: right;
        }

        .footer-text-meta p {
          font-weight: 700;
          font-size: 13px;
          color: #334155;
          margin-bottom: 6px;
        }

        .footer-text-meta span {
          font-size: 11px;
          color: #64748b;
          display: block;
          line-height: 1.5;
        }

        .pdf-page-number {
          position: absolute;
          bottom: 30px;
          right: 80px;
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
        }

        /* Core Pages Header/Footer */
        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 40px;
        }

        .header-doc-title {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .header-chapter {
          font-size: 11px;
          font-weight: 800;
          color: #1e6fd9;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Core Pages Content typography */
        .pdf-content {
          flex: 1;
        }

        .pdf-h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          border-left: 4px solid #1e6fd9;
          padding-left: 12px;
        }

        .pdf-p {
          font-size: 13.5px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 20px;
        }

        .pdf-role-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin: 24px 0;
        }

        .role-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
        }

        .role-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .role-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          color: white;
        }

        .elev-bg { background: #38bdf8; }
        .prof-bg { background: #1e6fd9; }
        .dirig-bg { background: #10b981; }

        .role-header h4 {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .role-list {
          list-style-type: disc;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .role-list li {
          font-size: 12.5px;
          line-height: 1.5;
          color: #475569;
        }

        /* Page 3 Custom PDF Layouts */
        .pdf-feature-row {
          display: flex;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .feature-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
        }

        .feature-text-box h4 {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .feature-text-box p {
          font-size: 12.5px;
          line-height: 1.5;
          color: #475569;
          margin: 0;
        }

        .pdf-chat-mock-container {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          background: #f8fafc;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mock-chat-heading {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .mock-chat-bubble {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.4;
          max-width: 90%;
        }

        .mock-chat-bubble.ai {
          background: #f1f5f9;
          align-self: flex-start;
          display: flex;
          gap: 8px;
          border: 1px solid #e2e8f0;
        }

        .mock-chat-bubble.ai p { margin: 0; }

        .mock-chat-bubble.user {
          background: #1e6fd9;
          color: white;
          align-self: flex-end;
        }

        .mock-chat-bubble.user p { margin: 0; }

        /* PRINT STYLING - High Fidelity PDF Generation */
        @media print {
          .docs-toolbar,
          .docs-sidebar {
            display: none !important;
          }

          .docs-viewer-container,
          .docs-canvas,
          .pdf-sheets-viewport {
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }

          .pdf-sheet {
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 2.5cm !important; /* Standard official print padding */
            page-break-after: always !important;
            transform: none !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocsPage;
