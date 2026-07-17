# 🌊 EduWave - Sistem Educațional Inteligent și E-Learning de Ultimă Generație

EduWave este o platformă e-learning modernă și un ecosistem educațional interactiv, bazat pe Inteligență Artificială și gamificare avansată, dezvoltat ca proiect de performanță pentru competiția națională **InfoEducație**. Platforma înlocuiește monotonia sistemelor tradiționale de e-learning printr-un design extrem de premium, 5 tipuri de minijocuri educaționale interactive integrate în cursuri și asistență cognitivă oferită de modele de limbaj (LLM) rulate fie local pe server, fie prin servicii cloud (Google Gemini & OpenAI).

Spre deosebire de arhitecturile dependente de platforme proprietare terțe, **EduWave utilizează o bază de date locală MongoDB, fiind un sistem 100% auto-găzduit (self-hosted)**, gata pentru producție, securizat și optimizat pentru performanță sporită pe Windows Server/Linux VPS.

---

## 🎯 Scopul, Viziunea și Obiectivele Proiectului

EduWave a fost proiectat pentru a transforma procesul de învățare online într-o experiență captivantă:
1. **Învățare Activă prin Gamificare (Active Learning):** Elevii nu doar citesc pagini de text, ci își validează cunoștințele prin activități interactive ce folosesc mecanici de joc (potrivirea elementelor, antrenamentul memoriei, jocuri de cuvinte).
2. **Personalizarea Învățării (AI Tutoring):** Fiecare elev beneficiază de ghidaj din partea unui tutore inteligent capabil să analizeze cursul curent și să ofere explicații suplimentare.
3. **Consistență și Motivație:** Sistemul de **Daily Streak** (zile consecutive de studiu) și acordarea de insigne digitale pe baza realizărilor concrete încurajează studiul zilnic.
4. **Independent și Auto-găzduit:** Întregul stack rulează local sau pe un VPS privat, oferind control absolut asupra datelor utilizatorilor și costuri de operare minime.

---

## 🛠️ Stack-ul Tehnologic Detaliat

Aplicația este o platformă Next.js complet integrată cu MongoDB, utilizând tehnologii moderne și optimizate:

### 🖥️ Frontend & UI
* **Framework Core:** `Next.js 16.2.6` (bazat pe React 19 și TypeScript) folosind structura **App Router** și compilatorul Turbopack pentru asamblare rapidă.
* **Aero-Design (Styling):** Sistem de design premium scris integral în **Vanilla CSS** cu tematică implicită Dark Mode, elemente de transparență (Glassmorphism), animații spline și tranziții interactive rulate prin **Framer Motion**.
* **Interfață Responsivă:** Adaptare completă pe desktop, tabletă și ecrane mobile.
* **Redare Markdown:** `react-markdown` cu plugin-uri pentru tabele GFM (`remark-gfm`) și componentă de evidențiere a sintaxei pentru cod (`react-syntax-highlighter` bazată pe Prism), permițând scrierea de lecții bogate din punct de vedere tehnic.

### ⚙️ Backend & API
* **Bază de date:** `MongoDB` local cu modelare prin `Mongoose`. Toate structurile de date sunt validate la nivel de schemă.
* **Autentificare Personalizată:** Autentificare bazată pe **JWT (JSON Web Tokens)** stocate în cookie-uri HTTP-only cu atribute de securitate ridicată (`secure: true`, `SameSite: Lax`, `httpOnly: true`).
* **Autentificare Socială (OAuth 2.0):** Integrare completă cu furnizori de identitate externi (Google Cloud și GitHub OAuth) pentru acces instant.
* **Integrare IA (Tutor Cognitiv):**
  * **Offline/Local:** Suport pentru rularea locală a modelelor LLM instruite (precum Phi-3 Mini GGUF) direct pe CPU-ul serverului prin intermediul wrapper-ului performant `node-llama-cpp`.
  * **Cloud:** Integrare nativă cu API-urile oficiale **Google Gemini** și **OpenAI**.

### 📱 Aplicație Mobilă
* **Wrapper Nativ:** `Capacitor 8` de la Ionic, permițând compilarea și rularea proiectului ca aplicație Android nativă (APK) cu acces la performanța nativă a dispozitivului.

---

## 📂 Structura Proiectului și Rolul Directoarelor

```
EduWave/
├── .agents/               # Customizări și reguli locale pentru agenții IA de dezvoltare
├── android/               # Proiectul Android generat de Capacitor (gata de compilat în Android Studio)
├── backups/               # Folderul securizat unde se salvează backup-urile zilnice MongoDB (.json)
├── database/              # Schema și fișierele de configurare a bazei de date
├── models/                # Modelele GGUF descărcate local (ex: Phi-3) pentru rularea IA offline
├── public/                # Resursele media statice ale site-ului (imagini, logo-uri, mascote)
├── scratch/               # Scripturi utilitare administrative (import, conversie date)
│   ├── convert_ids.js     # Script de migrare a ID-urilor text din backup în ObjectIds
│   └── import_db.js       # Script de populare a bazei de date din JSON-ul de backup
├── src/
│   ├── app/               # Rutele aplicației Next.js (App Router)
│   │   ├── (auth)/        # Rute de autentificare: /login și /register
│   │   ├── (dashboard)/   # Rute din spatele login-ului: /dashboard, /courses, /chat, /admin, etc.
│   │   ├── api/           # Endpoint-urile API (rutele de backend) ale aplicației
│   │   ├── layout.tsx     # Layout-ul global al aplicației
│   │   └── page.tsx       # Pagina principală (Landing Page)
│   ├── context/           # React Context (ex: AuthContext.tsx pentru gestiunea stării de logare)
│   ├── lib/               # Utilitare: conexiunea la MongoDB (mongodb.ts), gestiunea autentificării, etc.
│   └── models/            # Definițiile Schemelor Mongoose pentru MongoDB
├── Caddyfile              # Fișierul de configurare a proxy-ului web securizat Caddy (HTTPS)
├── capacitor.config.ts    # Configurația Capacitor pentru aplicația mobilă
├── package.json           # Dependențele, scripturile și metadatele npm
├── run_backup.bat         # Batch script rulat automat la 03:00 AM pentru backup MongoDB
├── start_caddy.bat        # Batch script pentru rularea automată a Caddy Server ca serviciu
├── start_nextjs.bat       # Batch script pentru rularea automată a serverului Next.js de producție
└── tsconfig.json          # Configurația compilatorului TypeScript
```

---

## 🗄️ Modele de Date (Mongoose Schemas)

Baza de date locală MongoDB este structurată în colecții bine definite prin Mongoose:

1. **`User` (`src/models/User.ts`):** Stochează datele utilizatorilor (Elevi, Profesori, Administratori). Conține setările de profil (avatar, bio, notificări) și starea contului (ban, timeout, is_approved).
2. **`Course` (`src/models/Course.ts`):** Structura completă a cursurilor, împărțită pe capitole (`CourseChapter`) și lecții/quiz-uri (`ChapterItem`). Sub-documentele de quiz-uri conțin întrebări și opțiunile de răspuns aferente.
3. **`Enrollment` (`src/models/Enrollment.ts`):** Asociază un elev cu un curs în care s-a înscris.
4. **`LessonProgress` (`src/models/LessonProgress.ts`):** Monitorizează ce lecții din cadrul unui curs au fost parcurse și finalizate de un anumit elev.
5. **`QuizAttempt` (`src/models/QuizAttempt.ts`):** Înregistrează încercările elevilor la testele din capitole, scorurile obținute și răspunsurile oferite pentru evaluare.
6. **`Badge` (`src/models/Badge.ts`) & `UserBadge`:** Gestionează insignele disponibile pe platformă și pe cele deținute de fiecare elev în parte.
7. **`StudySession` (`src/models/StudySession.ts`):** Înregistrează timpul petrecut de elevi studiind pe platformă, folosit pentru a calcula streak-ul zilnic și statisticile din Dashboard.
8. **`DirectConversation` & `DirectMessage`:** Structurile din spatele modulului de Chat, asigurând mesageria directă între utilizatori.
9. **`AIConversation` & `AIMessage`:** Salvează istoricul discuțiilor elevilor cu asistentul inteligent pentru continuitatea conversației.
10. **`CalendarEvent` (`src/models/CalendarEvent.ts`):** Evenimentele din calendarul personal al utilizatorului.

---

## 🌟 Funcționalitățile Sistemului

### 🎯 Panoul Principal & Sistemul de Gamificare
* **Dashboard Premium:** Afișează numărul de cursuri active, progresul mediu și numărul total de insigne câștigate.
* **Study Streak (Zile Consecutive):** O metodă excelentă de auto-disciplinare. Dacă utilizatorul învață în fiecare zi, streak-ul crește, oferind recompense sub formă de insigne.
* **Mascota Inteligentă:** O mascotă 3D/ilustrată interacționează cu utilizatorul direct în dashboard, oferindu-i mesaje de încurajare personalizate în funcție de progres.

### 📚 Sistemul Avansat de Cursuri
Elevii au acces la un vizualizator dinamic de cursuri, iar profesorii pot construi capitole ce combină lecțiile teoretice cu minijocuri interactive:
* **Match Pairs (Potrivește Perechile):** Elevul trebuie să asocieze elemente din stânga cu definiții din dreapta. O unealtă excelentă pentru învățarea termenilor noi.
* **Memory Game (Joc de Memorie):** Carduri întoarse cu spatele ce conțin întrebări și răspunsuri. Elevul trebuie să întoarcă cardurile potrivite din memorie.
* **True or False (Adevărat sau Fals):** O serie rapidă de afirmații unde utilizatorul trebuie să decidă contra-cronometru dacă sunt adevărate sau false.
* **Scrambled Letters (Litere Amestecate):** Cuvântul cheie din lecție este amestecat, iar elevul trebuie să-l rearanjeze literă cu literă.
* **Quiz Clasic:** Întrebări cu răspuns multiplu pentru testarea formală la final de capitol.

### 🤖 Asistentul Cognitiv bazat pe IA
* Integrat direct în pagina cursului, asistentul poate fi apelat pentru a răspunde la întrebări referitoare la lecția curentă.
* Elevul poate alege dacă dorește rularea **locală (complet securizată și privată pe server, fără conexiune externă)** folosind modele GGUF compacte, sau în **cloud** (viteză maximă folosind API OpenAI/Gemini).

---

## ⚙️ Ghid de Instalare, Rulare și Deploy

### Cerințe de Sistem
* Node.js LTS (versiunea 20 sau mai nouă)
* MongoDB Community Server rulând local pe portul standard `27017`
* Drepturi de Administrator (pentru instalarea serviciilor automate pe Windows Server)

---

### Pasul 1: Instalare Dependențe
Deschide terminalul în directorul proiectului și rulează:
```bash
npm install
```

### Pasul 2: Configurarea Variabilelor de Mediu
Creează fișierul `.env.local` în folderul rădăcină. Configurația de MongoDB local nu necesită user/parolă suplimentară dacă rulează implicit pe VPS:

```env
# Variabile de mediu pentru Inteligența Artificială (Cloud)
OPENAI_API_KEY=cheia-ta-openai
GEMINI_API_KEY=cheia-ta-gemini-aici

# Configurare Autentificare prin Conturi Sociale
GOOGLE_CLIENT_ID=id-ul-aplicatiei-din-google-console
GOOGLE_CLIENT_SECRET=secretul-aplicatiei-din-google-console
GITHUB_CLIENT_ID=id-ul-aplicatiei-din-github-settings
GITHUB_CLIENT_SECRET=secretul-aplicatiei-din-github-settings

# JWT Secret - O cheie lungă și complexă pentru criptarea sesiunilor
JWT_SECRET=o_cheie_criptografica_foarte_lunga_si_securizata_de_productie
```

### Pasul 3: Popularea inițială a Bazei de Date (Import)
Dacă pornești pe un server nou și vrei să importi datele demo existente în backup (138 de cursuri, lecții, întrebări și utilizatori):
```bash
$env:PATH += ";C:\Program Files\nodejs"; node scratch/import_db.js
```
*Notă: Dacă ai importat date din backup-ul vechi, acestea ar putea avea ID-uri stocate ca text. Rulează următorul script de migrare pentru a le converti automat în ObjectIds native:*
```bash
$env:PATH += ";C:\Program Files\nodejs"; node scratch/convert_ids.js
```

### Pasul 4: Pornirea în Mod Dezvoltare (Development)
Pentru testare rapidă locală cu auto-reload la modificări de cod:
```bash
npm run dev
```
Aplicația se va deschide pe: [http://localhost:3000](http://localhost:3000).

### Pasul 5: Compilarea și Rularea în Producție (Build)
Înainte de a pune site-ul live, acesta trebuie compilat:
```bash
# Compilare proiect
$env:PATH += ";C:\Program Files\nodejs"; npm run build

# Pornire server de producție
$env:PORT=3000; $env:PATH += ";C:\Program Files\nodejs"; npm start
```

---

## 🛡️ Rularea Permanentă și Deploy-ul pe VPS (Windows Server)

Pentru ca platforma să ruleze 24/7 și să repornească automat la restartul serverului, proiectul folosește **Windows Task Scheduler** împreună cu serverul de reverse proxy **Caddy**:

### A. Cum funcționează serviciile automate:
1. **Caddy Server:** Folosește scriptul [start_caddy.bat](file:///c:/Users/Administrator/Downloads/EduWave/EduWave/start_caddy.bat) pentru a asculta pe porturile standard `80` (HTTP) și `443` (HTTPS) și a redirecționa traficul securizat către Next.js (portul 3000). El obține și reînnoiește automat certificatele SSL pentru domeniul `eduwave.site`.
2. **Next.js Application:** Folosește scriptul [start_nextjs.bat](file:///c:/Users/Administrator/Downloads/EduWave/EduWave/start_nextjs.bat) pentru a menține instanța de producție activă în fundal.
3. **Daily Backup:** Folosește scriptul [run_backup.bat](file:///c:/Users/Administrator/Downloads/EduWave/EduWave/run_backup.bat) care execută zilnic la ora 03:00 AM scriptul `backup_db.js` pentru exportul bazei de date.

### B. Înregistrarea Serviciilor în Windows Task Scheduler
Pentru a le înregistra ca sarcini permanente la pornirea sistemului, rulează următoarele comenzi în PowerShell ca Administrator:

```powershell
$username = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$caddyAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c c:\Users\Administrator\Downloads\EduWave\EduWave\start_caddy.bat"
$nextjsAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c c:\Users\Administrator\Downloads\EduWave\EduWave\start_nextjs.bat"
$backupAction = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c c:\Users\Administrator\Downloads\EduWave\EduWave\run_backup.bat"

$startupTrigger = New-ScheduledTaskTrigger -AtStartup
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At 3am

# Înregistrare sarcini
Register-ScheduledTask -TaskName "EduWave_Caddy" -Action $caddyAction -Trigger $startupTrigger -User $username -RunLevel Highest -Force
Register-ScheduledTask -TaskName "EduWave_NextJS" -Action $nextjsAction -Trigger $startupTrigger -User $username -RunLevel Highest -Force
Register-ScheduledTask -TaskName "EduWave_DB_Backup" -Action $backupAction -Trigger $dailyTrigger -User $username -RunLevel Highest -Force
```

---

## 📱 Generarea Aplicației Mobile (APK)

Aplicația este pregătită pentru export ca aplicație de Android nativă prin Capacitor:

1. Asigură-te că Next.js este compilat:
   ```bash
   npm run build
   ```
2. Sincronizează codul web cu Capacitor:
   ```bash
   npx cap sync
   ```
3. Deschide proiectul în **Android Studio**:
   ```bash
   npx cap open android
   ```
4. Din Android Studio, mergi la **Build > Build Bundle(s) / APK(s) > Build APK(s)**. Fișierul `.apk` rezultat va fi gata pentru instalare pe orice dispozitiv Android!

---

⭐ *EduWave - O soluție modernă, completă și inovatoare pentru digitalizarea procesului educațional.*
