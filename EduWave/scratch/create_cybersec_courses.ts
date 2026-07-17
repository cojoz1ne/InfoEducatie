import mongoose from 'mongoose';
import Course from '../src/models/Course';
import User from '../src/models/User';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      teacher = await User.findOne();
    }
    
    if (!teacher) {
      teacher = new User({
        full_name: 'Prof. Cybersecuritate',
        email: 'cyber@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Cybersecuritate',
      description: 'Conceptele fundamentale ale protecției datelor și sistemelor.',
      category: 'Cybersecuritate',
      image_url: 'https://picsum.photos/seed/cyber1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Concepte de Bază (Triada CIA)',
          description: 'Confidențialitate, Integritate, Disponibilitate.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Principiile Securității',
              content: '# Modelul CIA\nTriada CIA este fundamentul securității informației. Ea stipulează că datele trebuie să fie confidențiale (accesibile doar celor autorizați), integre (nemodificate fraudulos) și disponibile (accesibile când este nevoie).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Triada CIA',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă litera "I" în Triada CIA?',
                  order_index: 0,
                  options: [
                    { text: 'Informație', is_correct: false, order_index: 0 },
                    { text: 'Integritate', is_correct: true, order_index: 1 },
                    { text: 'Interoperabilitate', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Amenințări și Malware',
          description: 'Viruși, viermi și troieni.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Tipuri de Malware',
              content: '# Ransomware și Phishing\nMalware-ul este un software rău intenționat. Ransomware-ul criptează fișierele și cere răscumpărare, în timp ce atacurile de Phishing păcălesc utilizatorul să își divulge datele sensibile.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ransomware',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Ransomware-ul este un tip de atac care criptează datele utilizatorului și solicită plata unei răscumpărări pentru decriptare.',
                  order_index: 0,
                  options: [
                    { text: 'Adevărat', is_correct: true, order_index: 0 },
                    { text: 'Fals', is_correct: false, order_index: 1 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 3: Securitatea Rețelelor',
          description: 'Firewalls și VPN.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Protecția Perimetrului',
              content: '# Firewall-uri\nUn firewall acționează ca o barieră între o rețea internă sigură și o rețea externă nesigură (precum Internetul), filtrând traficul de rețea pe baza unui set de reguli predefinite.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Firewall',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește sistemul de securitate care monitorizează și controlează traficul de rețea (in/out)?',
                  order_index: 0,
                  options: [
                    { text: 'Antivirus', is_correct: false, order_index: 0 },
                    { text: 'Firewall', is_correct: true, order_index: 1 },
                    { text: 'Router', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Hacking Etic și Penetration Testing',
      description: 'Cum să gândești ca un hacker pentru a securiza sistemele.',
      category: 'Cybersecuritate',
      image_url: 'https://picsum.photos/seed/cyber2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Faza de Recunoaștere',
          description: 'Culegerea informațiilor (OSINT).',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Footprinting',
              content: '# Colectarea datelor\nPrima fază a unui atac (sau test de penetrare) este recunoașterea. Aici se colectează informații publice (OSINT) despre țintă pentru a identifica posibile puncte de intrare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: OSINT',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce înseamnă acronimul OSINT?',
                  order_index: 0,
                  options: [
                    { text: 'Open Source Intelligence', is_correct: true, order_index: 0 },
                    { text: 'Offline Secure Internet', is_correct: false, order_index: 1 },
                    { text: 'Open System Interconnection', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Scanarea și Enumerarea',
          description: 'Identificarea porturilor și a vulnerabilităților.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Nmap',
              content: '# Scanarea porturilor\nInstrumentele de scanare, precum Nmap, sunt folosite pentru a descoperi gazdele active pe o rețea și porturile deschise, care indică serviciile ce rulează pe acea mașină.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Scanare Porturi',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Nmap este un instrument folosit în principal pentru editarea textelor și codului sursă.',
                  order_index: 0,
                  options: [
                    { text: 'Adevărat', is_correct: false, order_index: 0 },
                    { text: 'Fals', is_correct: true, order_index: 1 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 3: Exploatarea și Post-Exploatarea',
          description: 'Câștigarea și menținerea accesului.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Exploatarea vulnerabilităților',
              content: '# Găsirea breșelor\nDupă identificarea unei vulnerabilități, hackerul etic (pentester-ul) încearcă să o exploateze pentru a câștiga acces. Post-exploatarea implică menținerea acelui acces (ex. instalarea unui backdoor) pentru a demonstra riscul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Post-Exploatare',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește metoda prin care un atacator își asigură o modalitate ascunsă de a reveni într-un sistem compromis?',
                  order_index: 0,
                  options: [
                    { text: 'Firewall', is_correct: false, order_index: 0 },
                    { text: 'Backdoor', is_correct: true, order_index: 1 },
                    { text: 'Patching', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created cybersec course 1:', course1.title);
    
    await course2.save();
    console.log('Created cybersec course 2:', course2.title);

    console.log('Successfully created courses for Cybersecuritate!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
