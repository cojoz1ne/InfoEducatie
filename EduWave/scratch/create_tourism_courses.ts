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
        full_name: 'Prof. Turism',
        email: 'turism@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Managementul Hotelier și Serviciile de Front Office',
      description: 'Ghidul complet pentru gestionarea operațiunilor de bază într-un hotel modern și livrarea unor servicii excelente clienților.',
      category: 'Turism & Ospitalitate',
      image_url: 'https://picsum.photos/seed/tourism1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ciclul Oaspetelui (Guest Cycle)',
          description: 'Etapele interacțiunii dintre client și hotel.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Pre-sosire, Sosire, Sejur și Plecare',
              content: '# Fluxul operațiunilor hoteliere\nCiclul oaspetelui împarte experiența clientului în patru faze distincte:\n1. **Pre-sosire**: Rezervarea și stabilirea primei impresii.\n2. **Sosire (Check-in)**: Înregistrarea, atribuirea camerei și securizarea plății.\n3. **Sejur (Occupancy)**: Serviciile de curățenie, concierge și rezolvarea solicitărilor.\n4. **Plecare (Check-out)**: Facturarea finală, predarea cheilor și feedback-ul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Check-in și Check-out',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'În ce fază a ciclului oaspetelui se realizează înregistrarea legală a clientului și securizarea detaliilor de plată?',
                  order_index: 0,
                  options: [
                    { text: 'Pre-sosire', is_correct: false, order_index: 0 },
                    { text: 'Sosire (Check-in)', is_correct: true, order_index: 1 },
                    { text: 'Plecare (Check-out)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Managementul Tarifelor (Revenue Management)',
          description: 'Maximizarea profitului prin prețuri dinamice.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Indicatorii cheie: RevPAR și Rata de Ocupare',
              content: '# Analiza performanței financiare\nRevenue management implică ajustarea prețurilor camerelor în funcție de cerere. Indicatorii principali sunt:\n- **Rata de ocupare (Occupancy Rate)**: Raportul dintre camerele vândute și cele disponibile.\n- **RevPAR (Revenue Per Available Room)**: Venitul total din cazare împărțit la numărul total de camere disponibile. Arată eficiența reală a strategiei de preț.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Indicatori Financiari',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'RevPAR (Revenue Per Available Room) se calculează împărțind veniturile doar la numărul de camere efectiv ocupate, ignorându-le pe cele libere.',
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
          title: 'Capitolul 3: Soluționarea Reclamațiilor',
          description: 'Tehnica LAST pentru clienți nemulțumiți.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Metoda L.A.S.T.',
              content: '# Redresarea serviciilor\nRezolvarea reclamațiilor oaspeților este critică în PR-ul hotelier. Metoda LAST oferă pași simpli:\n1. **L**isten (Ascultă activ, fără să întrerupi).\n2. **A**pologize (Cere-ți scuze sincer în numele hotelului).\n3. **S**olve (Oferă o soluție rapidă și realistă).\n4. **T**hank (Mulțumește clientului pentru că a semnalat problema).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Metoda L.A.S.T.',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă prima literă „L” din acronimul metodei de rezolvare a reclamațiilor L.A.S.T.?',
                  order_index: 0,
                  options: [
                    { text: 'Laugh (Râzi)', is_correct: false, order_index: 0 },
                    { text: 'Listen (Ascultă)', is_correct: true, order_index: 1 },
                    { text: 'Leave (Pleacă)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Ecoturism și Turism Sustenabil',
      description: 'Cum să dezvolți destinații turistice care protejează mediul și susțin comunitățile locale.',
      category: 'Turism & Ospitalitate',
      image_url: 'https://picsum.photos/seed/tourism2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Principiile Ecoturismului',
          description: 'Conservare și educație ecologică.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Definiție și Impact Minim',
              content: '# Călătoria responsabilă\nEcoturismul este turismul în zone naturale, care conservă mediul și susține bunăstarea localnicilor. Principiile sale includ minimizarea impactului fizic, social și psihologic al vizitei, educarea turiștilor privind conservarea și direcționarea fondurilor către protejarea ariilor protejate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ce este ecoturismul?',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este scopul principal al ecoturismului în comparație cu turismul de masă tradițional?',
                  order_index: 0,
                  options: [
                    { text: 'Construirea de resorturi uriașe pe plajă', is_correct: false, order_index: 0 },
                    { text: 'Conservarea mediului natural și susținerea comunităților locale', is_correct: true, order_index: 1 },
                    { text: 'Reducerea prețurilor la zborurile charter', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Capacitatea de Suport a Destinației',
          description: 'Prevenirea supra-turismului (Overtourism).',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Limitele fizice și sociale ale unei destinații',
              content: '# Cât poate duce o zonă?\nCapacitatea de suport reprezintă numărul maxim de turiști care pot vizita o destinație simultan fără a provoca degradarea ireversibilă a mediului fizic sau o scădere inacceptabilă a calității vieții localnicilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Capacitatea de Suport',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Capacitatea de suport a unei destinații se măsoară exclusiv prin numărul de paturi disponibile în hoteluri, fără legătură cu resursele de apă sau poluare.',
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
          title: 'Capitolul 3: Certificări Verzi (Green Certifications)',
          description: 'Standarde ecologice în ospitalitate.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Green Key și Standardele de Sustenabilitate',
              content: '# Hoteluri prietenoase cu natura\nCertificări precum „Green Key” sunt acordate hotelurilor care respectă standarde stricte privind consumul de apă, eficiența energetică, managementul deșeurilor, utilizarea produselor ecologice de curățenie și educația ecologică a personalului și a clienților.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Certificări Ecologice',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește una dintre cele mai cunoscute certificări ecologice internaționale pentru unitățile de cazare durabile?',
                  order_index: 0,
                  options: [
                    { text: 'ISO 9001', is_correct: false, order_index: 0 },
                    { text: 'Green Key (Cheia Verde)', is_correct: true, order_index: 1 },
                    { text: 'Michelin Star', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created tourism course 1:', course1.title);
    
    await course2.save();
    console.log('Created tourism course 2:', course2.title);

    console.log('Successfully created courses for Turism & Ospitalitate!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
