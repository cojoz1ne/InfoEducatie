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
        full_name: 'Prof. Robotică',
        email: 'robotica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Robotică și Microcontrolere',
      description: 'Construiește-ți primele proiecte cu Arduino, senzori și actuatoare.',
      category: 'Robotică',
      image_url: 'https://picsum.photos/seed/robotics1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Microcontrolerul Arduino',
          description: 'Creierul micilor proiecte.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Intrări și Ieșiri Digitale',
              content: '# Bazele platformei Arduino\nArduino este o placă de dezvoltare open-source dotată cu un microcontroler. Pinii săi pot fi configurați ca intrări (ex: citește starea unui buton) sau ieșiri (ex: trimite curent pentru a aprinde un LED). Scriem codul în C++ în funcțiile `setup()` (rulează o singură dată) și `loop()` (rulează la infinit).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Structura codului Arduino',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care funcție dintr-un cod Arduino rulează în mod continuu și repetitiv după pornirea plăcii?',
                  order_index: 0,
                  options: [
                    { text: 'setup()', is_correct: false, order_index: 0 },
                    { text: 'loop()', is_correct: true, order_index: 1 },
                    { text: 'main()', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Senzori și Captarea Datelor',
          description: 'Cum interacționează robotul cu lumea.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Senzori Analogici vs. Digitali',
              content: '# Citirea datelor din mediu\nSenzorii permit robotului să simtă mediul înconjurător. Senzorii digitali au doar două stări: pornit/oprit (ex: comutator limită). Senzorii analogici oferă o gamă largă de valori (ex: un senzor de temperatură sau un senzor ultrasonic de distanță, care transformă valorile în numere de la 0 la 1023 prin ADC).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Senzori',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un senzor analogic poate măsura exclusiv valori binare de tip DA (1) sau NU (0).',
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
          title: 'Capitolul 3: Actuatoare și Motoare',
          description: 'Punerea robotului în mișcare.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Servomotoare și Motoare DC',
              content: '# Mișcarea precisă\nMotoarele de curent continuu (DC) sunt ideale pentru rotație liberă continuă (ex: roțile unui robot). Servomotoarele sunt concepute pentru rotație unghiulară controlată precis (de obicei între 0 și 180 de grade), ideale pentru brațe robotice sau mecanisme de direcție.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Controlul Unghiular',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de motor este utilizat atunci când avem nevoie de o rotație exactă la un anumit unghi (ex: 90 de grade)?',
                  order_index: 0,
                  options: [
                    { text: 'Motor DC clasic', is_correct: false, order_index: 0 },
                    { text: 'Servomotor', is_correct: true, order_index: 1 },
                    { text: 'Turbină cu abur', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Roboți Autonomi și Cinetică',
      description: 'Planificarea traiectoriilor, cinematica directă și roboții care iau singuri decizii.',
      category: 'Robotică',
      image_url: 'https://picsum.photos/seed/robotics2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Roboți Mobili: Evitarea Obstacolelor',
          description: 'Algoritmi simpli de navigare.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Bucla de Control Simplă',
              content: '# Citește, Decide, Acționează\nUn robot mobil autonom rulează o buclă continuă de feedback. De exemplu, citește distanța prin senzorul ultrasonic. Dacă distanța e sub 20 cm, se oprește, virează la dreapta și măsoară din nou. Altfel, continuă să meargă înainte.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Evitare Obstacole',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de senzor este cel mai des folosit pentru a calcula rapid distanța până la un obstacol în fața unui robot?',
                  order_index: 0,
                  options: [
                    { text: 'Senzor de temperatură', is_correct: false, order_index: 0 },
                    { text: 'Senzor ultrasonic (ultrasunete)', is_correct: true, order_index: 1 },
                    { text: 'Giroscop', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Cinematica Brațelor Robotice',
          description: 'Geometria mișcării.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Cinematica Directă vs. Inversă',
              content: '# Calcularea coordonatelor\nCinematica Directă calculează poziția exactă a vârfului brațului robotului (end-effector) pe baza unghiurilor cunoscute ale articulațiilor sale. Cinematica Inversă face calculul opus: determină ce unghiuri trebuie să aibă articulațiile pentru ca vârful robotului să ajungă într-o coordonată spațială specifică (x, y, z).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cinematica Inversă',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Cinematica Inversă are rolul de a calcula unde se află brațul robotului pornind exclusiv de la unghiurile date ale articulațiilor sale.',
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
          title: 'Capitolul 3: Sisteme de Control Feedback',
          description: 'Menținerea stabilității.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Introducere în Controlerul PID',
              content: '# Ajustarea automată a erorilor\nControlerul PID (Proporțional-Integral-Derivativ) este cel mai folosit algoritm de control cu feedback. El calculează continuu o valoare a erorii (diferența dintre starea dorită și cea reală) și aplică corecții bazate pe termenul curent (P), trecut (I) și viitor/estimat (D) (ex: stabilizarea unui dorn sau controlul precis al vitezei unei roți).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Algoritmul PID',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă acronimul algoritmului de reglare automată folosit masiv în robotică pentru minimizarea erorilor (PID)?',
                  order_index: 0,
                  options: [
                    { text: 'Pneumatic-Inductiv-Diodă', is_correct: false, order_index: 0 },
                    { text: 'Proporțional-Integral-Derivativ', is_correct: true, order_index: 1 },
                    { text: 'Programabil-Interactiv-Digital', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created robotics course 1:', course1.title);
    
    await course2.save();
    console.log('Created robotics course 2:', course2.title);

    console.log('Successfully created courses for Robotică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
