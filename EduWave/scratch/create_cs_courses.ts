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
        full_name: 'Prof. Informatică',
        email: 'info@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Algoritmi și Structuri de Date',
      description: 'Fundamentele programării: cum să rezolvi probleme eficient.',
      category: 'Informatică',
      image_url: 'https://picsum.photos/seed/cs1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Introducere în Algoritmi',
          description: 'Rețete pentru calculator.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Ce este un algoritm?',
              content: '# Pas cu pas\nUn algoritm este o secvență finită și bine definită de instrucțiuni pentru a rezolva o problemă. Asemenea unei rețete de bucătărie, el primește date de intrare (input) și produce un rezultat (output).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Algoritmi',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce condiție esențială trebuie să îndeplinească o secvență de pași pentru a fi considerată un algoritm valid?',
                  order_index: 0,
                  options: [
                    { text: 'Să ruleze la infinit', is_correct: false, order_index: 0 },
                    { text: 'Să aibă un număr finit de pași', is_correct: true, order_index: 1 },
                    { text: 'Să fie scris doar în C++', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Complexitatea',
          description: 'Cât de rapid e codul tău?',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Notația Big O',
              content: '# Măsurarea performanței\nNotația Big O (ex: O(n), O(1)) exprimă modul în care timpul de execuție sau spațiul de memorie necesar crește pe măsură ce dimensiunea datelor de intrare devine foarte mare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Notația Big O',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un algoritm cu o complexitate de O(1) va rula în același timp, indiferent dacă procesează 10 elemente sau 1 milion de elemente.',
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
          title: 'Capitolul 3: Structuri de Date Liniare',
          description: 'Cum organizăm memoria.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Liste și Vectori',
              content: '# Arrays vs Linked Lists\nUn vector (Array) stochează elementele în zone contigue (alăturate) de memorie, permițând acces rapid (indexare). O listă înlănțuită stochează elementele oriunde, legându-le prin pointeri, facilitând inserările rapide.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Vectori',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește structura de date fundamentală care stochează elemente de același tip în locații contigue de memorie?',
                  order_index: 0,
                  options: [
                    { text: 'Arbore', is_correct: false, order_index: 0 },
                    { text: 'Vector (Array)', is_correct: true, order_index: 1 },
                    { text: 'Graf', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Baze de Date și SQL',
      description: 'Cum să stochezi, să interoghezi și să gestionezi volume mari de informații.',
      category: 'Informatică',
      image_url: 'https://picsum.photos/seed/cs2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Modelul Relațional',
          description: 'Date organizate în tabele.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Chei Primare și Externe',
              content: '# Conectarea tabelelor\nÎntr-o bază de date relațională, datele stau în tabele. O cheie primară (Primary Key) identifică unic un rând. O cheie externă (Foreign Key) face legătura către cheia primară a altui tabel.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cheia Primară',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este rolul principal al unei "Chei Primare" (Primary Key) într-un tabel relațional?',
                  order_index: 0,
                  options: [
                    { text: 'Să cripteze datele utilizatorului', is_correct: false, order_index: 0 },
                    { text: 'Să identifice în mod unic fiecare înregistrare (rând) din tabel', is_correct: true, order_index: 1 },
                    { text: 'Să limiteze numărul de rânduri permise', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Limbajul SQL',
          description: 'Cum vorbim cu baza de date.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: SELECT, INSERT, UPDATE, DELETE',
              content: '# Operațiile CRUD\nSQL (Structured Query Language) este standardul pentru baze relaționale. Pentru a citi date folosim SELECT. Pentru a adăuga: INSERT. Pentru a modifica: UPDATE. Pentru a șterge: DELETE.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Operații SQL',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Comanda SQL folosită pentru a adăuga un nou rând într-un tabel este "UPDATE".',
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
          title: 'Capitolul 3: Optimizare și Indexare',
          description: 'Cum facem căutările rapide.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Indexurile',
              content: '# Cuprinsul bazei de date\nFără un index, baza de date trebuie să scaneze fiecare rând din tabel (Full Table Scan) pentru a găsi ce ceri. Un index funcționează ca un cuprins de carte, permițând localizarea instantanee a datelor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Indexare',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește structura de date folosită de sistemele de baze de date pentru a îmbunătăți considerabil viteza de regăsire a informațiilor dintr-un tabel?',
                  order_index: 0,
                  options: [
                    { text: 'Cache', is_correct: false, order_index: 0 },
                    { text: 'Index', is_correct: true, order_index: 1 },
                    { text: 'Trigger', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created cs course 1:', course1.title);
    
    await course2.save();
    console.log('Created cs course 2:', course2.title);

    console.log('Successfully created courses for Informatică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
