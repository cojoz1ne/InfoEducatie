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
        full_name: 'Prof. Inovație',
        email: 'inovatie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Inovația Disruptivă și Strategia de Business',
      description: 'Înțelege cum tehnologiile noi transformă industrii întregi și cum poți crea o strategie de inovație de succes.',
      category: 'Tehnologie & Inovație',
      image_url: 'https://picsum.photos/seed/innovation1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ce este Inovația Disruptivă?',
          description: 'Teoria lui Clayton Christensen.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Disruptiv vs. Sustenabil',
              content: '# Transformarea piețelor\nInovația sustenabilă (sustaining) îmbunătățește performanța produselor existente pentru clienții actuali. Inovația disruptivă (disruptive) introduce produse mai simple, mai ieftine și mai accesibile, vizând clienți nebăgați în seamă la început, pentru ca ulterior să cucerească întreaga piață și să elimine liderii vechi (ex: Netflix vs. Blockbuster).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Inovație Disruptivă',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce caracterizează, la început, o inovație disruptivă comparativ cu soluțiile existente ale liderilor de piață?',
                  order_index: 0,
                  options: [
                    { text: 'Este mult mai scumpă și exclusivistă', is_correct: false, order_index: 0 },
                    { text: 'Este adesea mai simplă, mai ieftină și se adresează unui segment de piață nebăgat în seamă', is_correct: true, order_index: 1 },
                    { text: 'Are întotdeauna performanțe tehnice superioare din prima zi', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Dilema Creatorului',
          description: 'De ce eșuează marile companii.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Ascultarea excesivă a clienților actuali',
              content: '# Capcana succesului\n„Dilema Creatorului” explică cum companii mari, bine conduse, își pierd poziția de lider deoarece fac totul corect: își ascultă clienții importanți și investesc în tehnologii sigure. Acest comportament le împiedică să aloce resurse pentru tehnologii noi, experimentale și mai puțin profitabile în stadiu inițial.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Dilema Creatorului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Conform dilemei creatorului, marile companii eșuează adesea tocmai pentru că ignoră tehnologiile experimentale și se concentrează exclusiv pe dorințele clienților actuali profitabili.',
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
          title: 'Capitolul 3: Design Thinking',
          description: 'Procesul creativ de rezolvare a problemelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Empatizare, Defenire, Ideare, Prototipare și Testare',
              content: '# Inovația centrată pe om\nDesign Thinking este o metodologie non-lineară utilizată pentru a înțelege utilizatorii, a redefini problemele și a crea soluții inovatoare. Ea pune accent pe empatie directă cu utilizatorul, prototipare rapidă și testare iterativă a ideilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Etapele Design Thinking',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este prima etapă fundamentală în procesul de inovație prin Design Thinking?',
                  order_index: 0,
                  options: [
                    { text: 'Prototiparea', is_correct: false, order_index: 0 },
                    { text: 'Empatizarea (Înțelegerea utilizatorului)', is_correct: true, order_index: 1 },
                    { text: 'Idearea', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Tehnologii Emergente: Web3 și Blockchain',
      description: 'Înțelege fundamentele descentralizării, contractele inteligente și viitorul internetului securizat.',
      category: 'Tehnologie & Inovație',
      image_url: 'https://picsum.photos/seed/innovation2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Fundamentele Blockchain',
          description: 'Cum funcționează registrul distribuit.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Descentralizare și Criptografie',
              content: '# Registrul care nu poate fi modificat\nUn blockchain este o bază de date distribuită (registru public) partajată între nodurile unei rețele de computere. Tranzacțiile sunt grupate în blocuri conectate criptografic în ordine cronologică. Odată înregistrate, datele din blocuri nu mai pot fi modificate retroactiv fără consensul rețelei.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Structura Blockchain',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce caracteristică cheie face ca datele înregistrate pe un blockchain să fie extrem de sigure și imposibil de modificat arbitrar?',
                  order_index: 0,
                  options: [
                    { text: 'Sunt stocate pe un singur server central secret', is_correct: false, order_index: 0 },
                    { text: 'Sunt distribuite pe mii de noduri și legate criptografic', is_correct: true, order_index: 1 },
                    { text: 'Sunt șterse automat la fiecare 24 de ore', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Contracte Inteligente (Smart Contracts)',
          description: 'Codul auto-executabil.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Eliminarea intermediarilor',
              content: '# If/Else pe blockchain\nContractele inteligente sunt programe stocate pe blockchain care rulează automat atunci când sunt îndeplinite condiții predeterminate (ex: eliberarea automată a banilor la primirea unui serviciu). Ele elimină nevoia unui intermediar de încredere (cum ar fi un notar sau o bancă).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Smart Contracts',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Contractele inteligente au nevoie întotdeauna de validarea manuală a unui notar autorizat înainte de a se executa pe blockchain.',
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
          title: 'Capitolul 3: Evoluția Internetului (Web3)',
          description: 'De la Web1 la Web3.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Proprietatea digitală',
              content: '# Read, Write, Own\n- **Web1 (anii \'90)**: Doar citire (pagini statice, directoare).\n- **Web2 (anii 2000+)**: Citire și scriere (rețele sociale, platforme centralizate ce dețin datele tale).\n- **Web3 (viitorul)**: Citire, scriere și proprietate (descentralizat, controlat de utilizatori prin tokeni și identități digitale unice).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Web3 și Proprietatea',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce element definitoriu aduce conceptul de Web3 față de actualul Web2 (social media centralizat)?',
                  order_index: 0,
                  options: [
                    { text: 'Doar pagini statice HTML fără poze', is_correct: false, order_index: 0 },
                    { text: 'Proprietatea directă și descentralizată a utilizatorilor asupra datelor', is_correct: true, order_index: 1 },
                    { text: 'Obligația de a plăti pentru fiecare căutare pe Google', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created innovation course 1:', course1.title);
    
    await course2.save();
    console.log('Created innovation course 2:', course2.title);

    console.log('Successfully created courses for Tehnologie & Inovație!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
