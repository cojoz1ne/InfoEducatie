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
        full_name: 'Prof. Statistică',
        email: 'statistica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Statistică Descriptivă și Analiza Datelor',
      description: 'Învață cum să colectezi, să organizezi, să analizezi și să prezinți seturi de date numerice.',
      category: 'Statistică',
      image_url: 'https://picsum.photos/seed/statistics1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Indicatori ai Tendinței Centrale',
          description: 'Media, Mediana și Modul.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Cum descriem mijlocul datelor',
              content: '# Măsuri descriptive de bază\n1. **Media aritmetică**: Suma tuturor valorilor împărțită la numărul lor (ex: sensibilă la valori extreme/outliers).\n2. **Mediana**: Valoarea de mijloc după ce datele au fost ordonate crescător (ex: foarte stabilă la outliers).\n3. **Modul**: Valoarea care apare cu cea mai mare frecvență în setul de date.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Media și Mediana',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care indicator al tendinței centrale reprezintă exact valoarea de mijloc a unui set de date ordonat crescător?',
                  order_index: 0,
                  options: [
                    { text: 'Media', is_correct: false, order_index: 0 },
                    { text: 'Mediana', is_correct: true, order_index: 1 },
                    { text: 'Dispersia', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Indicatori ai Împrăștierii',
          description: 'Deviația standard și dispersia.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Amplitudinea și Deviația Standard',
              content: '# Cât de mult variază datele\nIndicatorii împrăștierii arată cât de distanțate sunt valorile față de medie. Amplitudinea este diferența dintre maxim și minim. Dispersia măsoară media pătratelor deviațiilor de la medie. Deviația standard (abaterea medie pătratică) este rădăcina pătrată a dispersiei, fiind exprimată în aceeași unitate de măsură ca datele originale.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Deviația Standard',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O deviație standard mare indică faptul că majoritatea valorilor din setul de date sunt grupate foarte aproape în jurul mediei.',
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
          title: 'Capitolul 3: Distribuția Normală',
          description: 'Curba lui Gauss.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Proprietățile Distribuției Normale',
              content: '# Clopotul lui Gauss\nDistribuția normală este simetrică față de medie (unde media = mediana = modul). Regula empirică (68-95-99.7) afirmă că: ~68% din date se află la o deviație standard de medie, ~95% la două deviații standard și ~99.7% la trei deviații standard.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Regula Empirică',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce procent aproximativ din totalul datelor se încadrează în intervalul de o deviație standard în stânga și în dreapta mediei într-o distribuție normală?',
                  order_index: 0,
                  options: [
                    { text: '50%', is_correct: false, order_index: 0 },
                    { text: '68%', is_correct: true, order_index: 1 },
                    { text: '95%', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Statistică Inferențială și Testarea Ipotezelor',
      description: 'Cum să tragi concluzii despre o populație întreagă studiind doar un eșantion.',
      category: 'Statistică',
      image_url: 'https://picsum.photos/seed/statistics2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ipoteza Nulă și Ipoteza Alternativă',
          description: 'Formularea corectă a testelor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Formularea H0 și H1',
              content: '# Ce testăm de fapt?\n- **Ipoteza Nulă (H0)**: presupune că nu există nicio diferență semnificativă sau efect (ex: „noul medicament nu are efect”). Scopul testului este de a încerca să o respingem.\n- **Ipoteza Alternativă (H1)**: afirmă prezența unui efect sau a unei diferențe (ex: „noul medicament funcționează”).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ipoteza Nulă',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce postulează, de regulă, Ipoteza Nulă (H0) în testarea statistică?',
                  order_index: 0,
                  options: [
                    { text: 'Că există un efect uriaș', is_correct: false, order_index: 0 },
                    { text: 'Că nu există nicio diferență sau efect semnificativ', is_correct: true, order_index: 1 },
                    { text: 'Că eșantionul este prea mic', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Pragul de Semnificație și p-value',
          description: 'Când este un rezultat cu adevărat important.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Semnificația Statistică',
              content: '# Valoarea p (p-value)\nValoarea p măsoară probabilitatea de a obține rezultatele observate (sau unele mai extreme) dacă ipoteza nulă ar fi complet adevărată. Dacă p-value este mai mic decât pragul de semnificație alfa (de obicei 0.05), respingem ipoteza nulă, considerând rezultatul „semnificativ statistic”.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Pragul de 0.05',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dacă p-value calculat este de 0.01 (mai mic decât alfa = 0.05), atunci decidem să acceptăm Ipoteza Nulă.',
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
          title: 'Capitolul 3: Erori de Tip I și Tip II',
          description: 'Greșelile posibile în deciziile statistice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Fals Pozitiv vs. Fals Negativ',
              content: '# Limitele deciziilor\n- **Eroarea de Tip I (Fals Pozitiv)**: Respingerea ipotezei nule când ea este, de fapt, adevărată (ex: spui că tratamentul funcționează, deși nu are efect).\n- **Eroarea de Tip II (Fals Negativ)**: Eșecul de a respinge ipoteza nulă când ea este falsă (ex: spui că tratamentul nu are efect, deși el funcționează).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Eroarea de Tip I',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se mai numește eroarea de Tip I (atunci când respingem în mod greșit o ipoteză nulă adevărată)?',
                  order_index: 0,
                  options: [
                    { text: 'Fals Negativ', is_correct: false, order_index: 0 },
                    { text: 'Fals Pozitiv', is_correct: true, order_index: 1 },
                    { text: 'Eroare sistemică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created statistics course 1:', course1.title);
    
    await course2.save();
    console.log('Created statistics course 2:', course2.title);

    console.log('Successfully created courses for Statistică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
