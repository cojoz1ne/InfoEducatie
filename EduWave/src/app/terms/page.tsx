'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Play, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import '../landing.css';

export default function TermsPage() {
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
          <h1>Termeni și Condiții de Utilizare</h1>
          <span className="legal-last-update">Ultima actualizare: 19 Mai 2026</span>

          <div className="legal-section">
            <h2><span>1.</span> Definiții și Dispoziții Introducătoare</h2>
            <p>
              Prezentul document stabilește termenii contractuali generali care guvernează utilizarea platformei software, a serviciilor educaționale și a conținutului digital pus la dispoziție prin intermediul platformei <strong>EduWave</strong> (denumit în continuare „Site-ul”, „Platforma” sau „Aplicația”), administrat de <strong>S.C. EDUWAVE EDUCATION S.R.L.</strong> (denumită în continuare „EduWave”, „noi” sau „Societatea”).
            </p>
            <p>
              Prin accesarea, înregistrarea unui cont sau utilizarea serviciilor EduWave, vă asumați calitatea de „Utilizator” și **vă exprimați acordul deplin, expres și neechivoc** de a respecta prezenta versiune a Termenilor și Condițiilor. Dacă nu sunteți de acord cu prevederile prezentului document, vă rugăm să încetați imediat utilizarea Platformei.
            </p>
            <p>
              <strong>Definiții cheie utilizate în prezentul contract:</strong><br />
              * <strong>Platforma:</strong> Site-ul web de tip portal LMS (Learning Management System) și aplicația mobilă asociată.<br />
              * <strong>Utilizator:</strong> Orice persoană fizică sau reprezentant legal care accesează Platforma (clasificat în funcție de rol în: Elev, Profesor, Diriginte sau Vizitator).<br />
              * <strong>Cont:</strong> Secțiunea securizată din Platformă protejată prin e-mail și parolă, destinată accesării cursurilor, trimiterii rezolvărilor și acumulării recompenselor.<br />
              * <strong>Serviciu:</strong> Furnizarea de conținut educațional digital, asistență educațională integrată bazată pe inteligență artificială, quiz-uri interactive și catalog digital.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>2.</span> Condiții de Înregistrare, Vârstă și Securitatea Contului</h2>
            <p>
              Pentru a accesa funcționalitățile complete ale platformei, este necesară înregistrarea și configurarea unui Cont prin furnizarea unei adrese valide de e-mail și a unui nume real.
            </p>
            <ul>
              <li><strong>Limita de Vârstă:</strong> Conform legislației din România și a Regulamentului GDPR, minorii cu vârsta sub **16 ani** pot folosi serviciile platformei EduWave doar cu acordul expres sau sub directa supraveghere a părinților sau a reprezentanților legali. Societatea își rezervă dreptul de a anula conturile minorilor înregistrate fără un astfel de consimțământ verificabil.</li>
              <li><strong>Exactitatea Datelor:</strong> Vă obligați să furnizați informații corecte și complete la înregistrare și să le actualizați în caz de modificări. Utilizarea de pseudonime calomnioase sau date de identitate false constituie o încălcare gravă a contractului.</li>
              <li><strong>Confidențialitatea Contului:</strong> Contul Dumneavoastră este personal și netransmisibil. Sunteți pe deplin responsabil pentru păstrarea confidențialității parolei de acces și pentru orice activitate derulată sub contul respectiv. Împărtășirea credențialelor de acces sau vânzarea contului este strict interzisă și atrage suspendarea imediată a serviciului fără despăgubiri.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>3.</span> Proprietatea Intelectuală și Drepturile de Autor</h2>
            <p>
              Întregul conținut al Platformei, incluzând, dar fără a se limita la: codul sursă (HTML, CSS, JavaScript, React, Next.js), designul grafic, layout-ul general al site-ului, sigla, grafica personalizată a insignelor (badges), structura și textul cursurilor, materialele video, materialele PDF, chestionarele de studiu și răspunsurile generate de EduWave AI Assistant sunt protejate de **Legea nr. 8/1996 privind dreptul de autor și drepturile conexe** și aparțin în exclusivitate Societății S.C. EDUWAVE EDUCATION S.R.L. sau partenerilor săi licențiați.
            </p>
            <p>
              <strong>Restricții absolute privind utilizarea conținutului:</strong><br />
              * Este strict interzisă copierea, reproducerea, redistribuirea, retransmiterea, descărcarea neautorizată, vinderea sau publicarea oricărui material din platformă fără acordul prealabil, scris, semnat digital de reprezentantul legal al EduWave.<br />
              * Utilizatorilor li se acordă o licență **limitată, neexclusivă, revocabilă și netransmisibilă** de utilizare a conținutului doar în scopuri educaționale personale, non-comerciale, pe perioada în care contul lor este activ.<br />
              * Orice utilizare a roboților, scripturilor de colectare a datelor (scraping) sau inginerie inversă asupra codului sursă ori a modelului lingvistic al AI-ului integrat reprezintă infracțiune și va fi raportată autorităților judiciare, solicitându-se plata de daune-interese morale și materiale integrale.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>4.</span> Servicii Premium, Achiziții, Facturare și Plăți (Stripe)</h2>
            <p>
              Platforma oferă cursuri de bază gratuite, precum și cursuri avansate sau module specializate supuse unei taxe de participare (denumite „Cursuri Premium” sau „Abonamente”).
            </p>
            <ul>
              <li><strong>Procesarea Plăților:</strong> Tranzacțiile financiare pe platformă se realizează în mod exclusiv prin intermediul procesatorului de plăți autorizat **Stripe Inc.** Toate tranzacțiile se desfășoară în mediu criptat securizat 3D Secure. EduWave nu stochează, nu colectează și nu are acces la datele cardului bancar al Utilizatorului.</li>
              <li><strong>Prețuri și Facturare:</strong> Prețurile afișate pe platformă sunt exprimate în RON sau EUR și includ toate taxele aplicabile. Pentru fiecare achiziție premium finalizată cu succes, utilizatorul va primi o factură fiscală electronică emisă în conformitate cu normele Codului Fiscal din România.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>5.</span> Dreptul de Retragere și Exceptarea de la Politica de Rambursare</h2>
            <p>
              Conform **Ordonanței de Urgență (OUG) nr. 34/2014** privind drepturile consumatorilor în cadrul contractelor încheiate cu profesioniștii, consumatorii beneficiază, ca regulă generală, de un termen de 14 zile calendaristice pentru a se retrage dintr-un contract încheiat la distanță, fără a fi nevoiți să justifice decizia.
            </p>
            <p style={{ paddingLeft: '20px', borderLeft: '3px solid #ef4444', fontWeight: 600 }}>
              IMPORTANT - Excepția prevăzută de lege pentru Conținutul Digital:<br />
              Conform Articolului 16 litera m) din OUG nr. 34/2014, sunt exceptate de la dreptul de retragere: „contractele de furnizare de conținut digital care nu este livrat pe un suport material, dacă prestarea a început cu acordul prealabil expres al consumatorului și după ce acesta a confirmat că a luat cunoștință de faptul că își va pierde dreptul la retragere”.
            </p>
            <p>
              Deoarece cursurile, lecțiile interactive și resursele EduWave reprezintă conținut digital la distanță accesibil instant după plată, **solicitarea accesului la un Curs Premium sau Abonament și deschiderea primei lecții din cadrul acestuia constituie consimțământul Dumneavoastră expres de începere imediată a prestării serviciului și reprezintă o renunțare directă la dreptul legal de retragere de 14 zile**, achiziția devenind nerambursabilă.
            </p>
          </div>

          <div className="legal-section">
            <h2><span>6.</span> Codul de Conduită al Utilizatorului</h2>
            <p>Pentru a asigura o atmosferă academică armonioasă și sigură, vă obligați să respectați următoarele reguli de bază în utilizarea serviciilor platformei:</p>
            <ul>
              <li><strong>Interdicția Comportamentului Abuziv:</strong> Este strict interzisă trimiterea sau publicarea de mesaje obscene, rasiste, jignitoare, amenințătoare sau calomnioase în sistemul de chat integrat, în recenziile cursurilor sau în interacțiunile cu profesorii și colegii.</li>
              <li><strong>Integritate Academică:</strong> Utilizatorul se obligă să rezolve testele și temele pe baza propriilor cunoștințe. Copierea excesivă sau încercarea de fraudare a scorurilor platformei va duce la invalidarea punctajelor și retragerea automată a insignelor câștigate necuvenit.</li>
              <li><strong>Securitatea Tehnică:</strong> Este strict interzisă încărcarea de malware, viruși, încercarea de bypass a sistemelor de securitate (hacking, SQL Injection, DDOS) sau utilizarea platformei pentru a colecta e-mailurile altor studenți (spamming).</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>7.</span> Limitarea Răspunderii</h2>
            <p>
              EduWave oferă o platformă tehnologică modernă, asistent educațional AI de ultimă generație și conținut didactic riguros. Cu toate acestea:
            </p>
            <ul>
              <li><strong>Garanția Serviciului:</strong> Platforma este furnizată „așa cum este” și „așa cum este disponibilă”, fără garanții explicite de funcționare 100% neîntreruptă sau lipsită de bug-uri tehnice temporare în timpul actualizărilor.</li>
              <li><strong>Performanța Școlară:</strong> EduWave nu garantează promovarea examenelor oficiale de stat, creșterea automată a notelor din cataloagele naționale sau obținerea unui anumit nivel de performanță școlară de către elev. Rezultatele depind în totalitate de implicarea, timpul alocat studiului de către elev și capacitatea de asimilare a acestuia.</li>
              <li><strong>Răspunderea AI Assistant:</strong> Asistentul AI integrat folosește tehnologii generative avansate. Deși implementăm mecanisme stricte de filtrare, pot exista cazuri extrem de rare în care AI-ul generează răspunsuri eronate sau inexacte (cunoscute sub denumirea de halucinații). Utilizatorul se obligă să trateze cu discernământ critic răspunsurile asistentului și să le compare cu bibliografia de curs.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><span>8.</span> Rezilierea, Suspendarea Contului și Litigii</h2>
            <p>
              EduWave își rezervă dreptul de a suspenda temporar sau de a șterge definitiv, fără notificare prealabilă, contul oricărui utilizator care încalcă grav prevederile prezentei secțiuni de Termeni și Condiții, fraudează sistemul sau aduce prejudicii de imagine platformei.
            </p>
            <p>
              Prezentele clauze sunt guvernate de **legislația română și europeană în vigoare**. Orice neînțelegere sau litigiu apărut în legătură cu interpretarea sau executarea prezentului contract se va soluționa pe cale amiabilă. În caz de eșec, competența de soluționare aparține în mod exclusiv **instanțelor judecătorești din București, România**.
            </p>
            <p>
              Utilizatorii au, de asemenea, opțiunea de a apela la metode alternative de soluționare a disputelor comerciale prin platforma europeană SOL (Soluționarea Online a Litigiilor) sau depunând o sesizare oficială către **Autoritatea Națională pentru Protecția Consumatorilor (ANPC)**.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
