'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Play, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import '../landing.css';

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      {/* Background Glowing Mesh Effects */}
      <div className="landing-glow-wrapper">
        <div className="landing-glow-1"></div>
        <div className="landing-glow-2"></div>
      </div>

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
            <Link href="/#features">Beneficii</Link>
            <Link href="/#preview">Interfață</Link>
            <Link href="/docs">Documentație</Link>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn-link">Conectare</Link>
            <Link href="/register" className="btn-primary-glow">Începe Gratuit</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="legal-content-container">
        <Link href="/" className="btn-back-home">
          <ArrowLeft size={16} />
          <span>Înapoi la pagina principală</span>
        </Link>

        <div className="legal-card">
          <h1>Politică de Confidențialitate</h1>
          <span className="legal-last-update">Ultima actualizare: 19 Mai 2026</span>

          <div className="legal-section">
            <h2><span>1.</span> Informații Generale și Identitatea Operatorului</h2>
            <p>
              Prezenta Politică de Confidențialitate reglementează modalitatea în care <strong>S.C. EDUWAVE EDUCATION S.R.L.</strong> (denumită în continuare „EduWave”, „noi” sau „Operatorul”), persoană juridică română cu sediul social în București, înregistrată la Registrul Comerțului sub nr. J40/12345/2026, Cod Unic de Înregistrare (CUI) RO987654321, colectează, prelucrează, stochează și protejează datele cu caracter personal ale utilizatorilor (denumiți în continuare „Utilizatori”, „Elevi”, „Profesori” sau „Dumneavoastră”) prin intermediul platformei online și al aplicației mobile EduWave (disponibile la adresa http://localhost:3000/ și subdomeniile acesteia).
            </p>
            <p>
              EduWave funcționează ca un Operator de Date cu caracter personal în deplină conformitate cu dispozițiile **Regulamentului (UE) 2016/679 (GDPR)** privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal, ale **Legii nr. 190/2018** și ale **Legii nr. 506/2004** privind prelucrarea datelor cu caracter personal și protecția vieții private în sectorul comunicațiilor electronice.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>2.</span> Temeiurile Juridice și Scopurile Prelucrării</h2>
            <p>Prelucrăm datele Dumneavoastră cu caracter personal în mod legal, echitabil și transparent. Temeiurile juridice pe care se bazează prelucrarea sunt stabilite de art. 6 din GDPR:</p>
            <ul>
              <li><strong>Executarea Contractului (Art. 6 alin. 1 lit. b GDPR):</strong> Prelucrarea este necesară pentru crearea, administrarea și funcționarea contului de utilizator, procesarea înscrierilor la cursuri, eliberarea automată a certificatelor, urmărirea progresului educațional și participarea la chestionare gamificate.</li>
              <li><strong>Consimțământul Dumneavoastră (Art. 6 alin. 1 lit. a GDPR):</strong> Solicitat în mod expres în cazul trimiterii de newslettere de marketing, comunicări comerciale personalizate, utilizării cookie-urilor neesențiale sau colectării datelor facultative din profilul personal. Consimțământul poate fi retras în orice moment.</li>
              <li><strong>Interesul Legitim al Operatorului (Art. 6 alin. 1 lit. f GDPR):</strong> Prelucrarea este necesară pentru a asigura securitatea cibernetică a platformei, prevenirea fraudelor, protejarea drepturilor de autor ale cursurilor, optimizarea performanței tehnice a site-ului și analizarea modului de utilizare a platformei pentru a îmbunătăți structura cursurilor.</li>
              <li><strong>Obligații Legale (Art. 6 alin. 1 lit. c GDPR):</strong> Prelucrarea necesară pentru îndeplinirea unor obligații legale impuse de legislația fiscală, financiară sau de reglementare (ex. facturarea cursurilor premium achiziționate, păstrarea evidențelor contabile).</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>3.</span> Categoriile de Date cu Caracter Personal Prelucrate</h2>
            <p>În funcție de tipul contului (Elev, Profesor, Diriginte) și de interacțiunea cu platforma, prelucrăm următoarele categorii de date:</p>
            <ul>
              <li><strong>Date de Identificare și Autentificare:</strong> Nume, prenume, adresă de e-mail principală, parolă criptată prin algoritm de tip hash, imagine de profil (opțional), rol în platformă (Elev, Profesor, Admin).</li>
              <li><strong>Date de Profil Educațional și Performanță (Gamificare):</strong> Cursurile înscrise, stadiul de parcurgere a lecțiilor, notele și rezolvările transmise în cadrul chestionarelor, istoricul activității zilnice (streak-uri active), punctajul cumulat, insigne (badges) câștigate și statistici de învățare.</li>
              <li><strong>Date Privind Tranzacțiile și Plățile:</strong> Istoricul achizițiilor de cursuri premium, date de facturare (nume, adresă fiscală, număr de telefon). Nota: Datele complete ale cardului bancar sunt procesate securizat direct de procesatorul nostru de plăți partener (Stripe), EduWave nestocând niciodată numerele sau codurile de securitate ale cardurilor bancare.</li>
              <li><strong>Date de Interacțiune și Asistență (AI Assistant & Chat):</strong> Mesajele trimise către asistentul de studiu integrat EduWave AI Assistant, interogările adresate acestuia, istoricul conversațiilor educaționale, notele acordate feedback-ului oferit și comunicările text realizate cu profesorii prin chat-ul integrat.</li>
              <li><strong>Date Tehnice de Navigare:</strong> Adresa IP, tipul de sistem de operare utilizat, tipul și versiunea browserului web, ID-ul dispozitivului mobil, geolocalizarea aproximativă la nivel de oraș (bazată pe IP), paginile vizualizate și erorile de sistem înregistrate în fișiere de tip log.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>4.</span> Destinatarii Datelor și Transferul acestora</h2>
            <p>
              EduWave nu vinde, nu închiriază și nu dezvăluie datele Dumneavoastră cu caracter personal către terțe părți în scopuri comerciale. Pentru funcționarea optimă a platformei, utilizăm o serie de furnizori de servicii cu rol de subîmputerniciți, cu care avem semnate acorduri stricte de prelucrare a datelor (DPA) în conformitate cu Art. 28 GDPR:
            </p>
            <ul>
              <li><strong>Supabase Inc.</strong> - Utilizat ca infrastructură principală de bază de date securizată și mecanisme de autentificare a utilizatorilor (datele sunt stocate în servere securizate localizate în Uniunea Europeană).</li>
              <li><strong>Stripe Inc.</strong> - Procesatorul de plăți securizate online. Orice tranzacție bancară se supune standardelor stricte de securitate PCI-DSS ale acestuia.</li>
              <li><strong>Resend / Amazon Web Services (AWS)</strong> - Servicii de livrare și trimitere automată a e-mailurilor tranzacționale (ex. confirmări de cont, resetare de parolă, notificări administrative).</li>
              <li><strong>Autorități Publice și Agenții Guvernamentale:</strong> Atunci când există o obligație legală imperativă sau o solicitare din partea instanțelor judecătorești sau a organelor de urmărire penală conform legii aplicabile.</li>
            </ul>
            <p>
              Nu realizăm transferuri de date în afara Spațiului Economic European (SEE) decât către furnizori care prezintă garanții adecvate de securitate recunoscute de Comisia Europeană prin decizii de adecvare sau clauze contractuale standard (SCC).
            </p>
          </div>

          <div className="legal-section">
            <h2><span>5.</span> Perioada de Păstrare a Datelor</h2>
            <p>
              Păstrăm datele Dumneavoastră cu caracter personal doar atât timp cât este necesar pentru îndeplinirea scopurilor menționate în prezenta politică:
            </p>
            <ul>
              <li><strong>Datele de Cont:</strong> Sunt păstrate pe toată durata de activitate a contului utilizatorului. Dacă solicitați închiderea contului, datele de identificare vor fi șterse sau anonimizate în cel mult 30 de zile de la solicitare.</li>
              <li><strong>Datele Statistice și de Performanță:</strong> Sunt păstrate pe durata derulării contractului. Putem alege să anonimizăm statisticile de progres (făcând imposibilă corelarea lor cu o persoană fizică identificabilă) pentru a le păstra în scopuri pur statistice de optimizare a platformei.</li>
              <li><strong>Datele Fiscale și Financiar-Contabile:</strong> Documentele justificative referitoare la plăți, facturi emise și tranzacții sunt păstrate pe o perioadă de **10 ani**, conform obligațiilor prevăzute de legislația fiscal-contabilă din România.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>6.</span> Drepturile Dumneavoastră conform GDPR</h2>
            <p>În calitate de persoană vizată, Regulamentul GDPR vă garantează o serie de drepturi fundamentale pe care le puteți exercita oricând:</p>
            <ul>
              <li><strong>Dreptul de Acces (Art. 15 GDPR):</strong> Puteți solicita o confirmare dacă prelucrăm sau nu date personalizate și o copie completă a acestora.</li>
              <li><strong>Dreptul la Rectificare (Art. 16 GDPR):</strong> Puteți cere corectarea datelor inexacte sau completarea datelor incomplete din contul Dumneavoastră.</li>
              <li><strong>Dreptul la Ștergere - „Dreptul de a fi uitat” (Art. 17 GDPR):</strong> Puteți solicita ștergerea definitivă a tuturor datelor, în cazurile în care acestea nu mai sunt necesare scopurilor inițiale, consimțământul a fost retras sau prelucrarea a fost ilegală.</li>
              <li><strong>Dreptul la Restricționarea Prelucrării (Art. 18 GDPR):</strong> Puteți bloca temporar utilizarea datelor în cazul în care le contestați acuratețea sau legalitatea.</li>
              <li><strong>Dreptul la Portabilitatea Datelor (Art. 20 GDPR):</strong> Aveți dreptul de a primi datele Dumneavoastră într-un format structurat, utilizat în mod curent și citibil automat pentru a le putea transfera ușor altui operator.</li>
              <li><strong>Dreptul la Opoziție (Art. 21 GDPR):</strong> Vă puteți opune în orice moment prelucrării bazate pe un interes legitim sau în scopuri de marketing direct (inclusiv profilare).</li>
              <li><strong>Dreptul de a nu face obiectul unei decizii automatizate (Art. 22 GDPR):</strong> Dreptul de a nu fi supus unei decizii bazate exclusiv pe prelucrare automată care produce efecte juridice asupra Dumneavoastră.</li>
            </ul>
            <p>
              Pentru exercitarea oricăruia dintre aceste drepturi, vă rugăm să trimiteți o cerere scrisă, datată și semnată, la adresa de e-mail **privacy@eduwave.ro**. Vă vom răspunde fără întârzieri nejustificate și în termen de maximum 30 de zile.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>7.</span> Securitatea Datelor și Criptarea</h2>
            <p>
              EduWave acordă o importanță deosebită integrității datelor. Folosim protocoale tehnice avansate de securitate de ultimă generație pentru a proteja datele de orice acces neautorizat, alterare, distrugere sau scurgere accidentală:
            </p>
            <ul>
              <li><strong>Criptarea în tranzit:</strong> Toate comunicațiile realizate între browserul Dumneavoastră și serverele noastre sunt securizate prin certificate SSL/TLS pe protocol HTTPS.</li>
              <li><strong>Securitatea Parolelor:</strong> Parolele utilizatorilor nu sunt niciodată salvate în clar. Folosim algoritmi de criptare unidirecționali complecși cu sare (salting și hashing) de tip bcrypt.</li>
              <li><strong>Protecția Bazelor de Date:</strong> Bazele noastre de date pe platforma Supabase sunt protejate prin firewall-uri dedicate, izolare logică a row-level security (RLS) pentru a asigura că niciun utilizator nu poate accesa datele altui utilizator și copii de siguranță (backups) criptate zilnice.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>8.</span> Modulele Cookie și Tehnologii de Urmărire</h2>
            <p>
              Platforma noastră utilizează fișiere de tip cookie pentru a vă asigura o funcționare fluentă a sesiunilor de navigare, securitate ridicată și memorarea preferințelor de limbă sau temă vizuală. Utilizăm cookie-uri necesare (fără de care platforma nu poate funcționa) și cookie-uri analitice opționale (memorate doar cu acordul Dumneavoastră). Puteți gestiona și bloca oricând setările cookie-urilor direct din meniul browserului Dumneavoastră web.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>9.</span> Autoritatea de Supraveghere și Reclamații</h2>
            <p>
              În cazul în care considerați că prelucrarea datelor Dumneavoastră cu caracter personal încalcă reglementările GDPR, aveți dreptul de a depune o plângere oficială la autoritatea națională de supraveghere din România:
            </p>
            <p style={{ paddingLeft: '20px', fontStyle: 'italic', borderLeft: '3px solid #29b6f6' }}>
              <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</strong><br />
              B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, cod poștal 010336, București, România<br />
              E-mail: anspdcp@dataprotection.ro | Website: www.dataprotection.ro
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
