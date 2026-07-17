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
        full_name: 'Prof. Design Industrial',
        email: 'industrial@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Designul Industrial',
      description: 'Descoperă cum se proiectează produsele de masă, de la concept la manufactură.',
      category: 'Design Industrial',
      image_url: 'https://picsum.photos/seed/industrial1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ergonomie și Utilitate',
          description: 'Design centrat pe om.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Principiile Ergonomiei',
              content: '# Interacțiunea om-obiect\nErgonomia studiază modul în care oamenii interacționează cu produsele, asigurându-se că obiectele sunt sigure, confortabile și eficiente în utilizare (ex. forma unui scaun sau mânerul unei unelte).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ergonomie',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce domeniu se ocupă cu adaptarea produselor pentru a fi cât mai confortabile și sigure pentru corpul uman?',
                  order_index: 0,
                  options: [
                    { text: 'Estetica', is_correct: false, order_index: 0 },
                    { text: 'Ergonomia', is_correct: true, order_index: 1 },
                    { text: 'Mecanica', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Procesul de Proiectare',
          description: 'Etapele de la idee la prototip.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Modelarea 3D și Prototiparea',
              content: '# CAD și Printare 3D\nDesignul industrial modern se bazează pe software CAD (Computer-Aided Design) pentru crearea modelelor virtuale, urmat de crearea unui prototip fizic folosind tehnici precum printarea 3D sau frezarea CNC.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Software CAD',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Acronimul CAD vine de la "Computer-Aided Design" și reprezintă softurile folosite pentru modelarea digitală a produselor.',
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
          title: 'Capitolul 3: Materiale și Manufactură',
          description: 'Alegerea materialelor potrivite.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Injecția de mase plastice',
              content: '# Producția de Masă\nUnul dintre cele mai comune procedee de fabricație pentru piese complexe din plastic este turnarea prin injecție, unde plasticul topit este forțat într-o matriță care se răcește pentru a forma piesa dorită.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Turnarea prin Injecție',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește procesul prin care materialul topit este introdus sub presiune într-o matriță pentru a produce piese de serie?',
                  order_index: 0,
                  options: [
                    { text: 'Extrudare', is_correct: false, order_index: 0 },
                    { text: 'Turnare prin injecție', is_correct: true, order_index: 1 },
                    { text: 'Forjare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Sustenabilitate în Design',
      description: 'Proiectarea de produse durabile și ecologice.',
      category: 'Design Industrial',
      image_url: 'https://picsum.photos/seed/industrial2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ciclul de Viață al Produsului',
          description: 'Analiza amprentei ecologice.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: De la leagăn la leagăn (Cradle to Cradle)',
              content: '# Economia Circulară\nConceptul Cradle to Cradle propune ca la finalul duratei de viață, produsele să nu devină deșeuri, ci materialele lor să se întoarcă complet în natură sau să fie complet reciclate pentru noi produse.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cradle to Cradle',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce model de design promovează reutilizarea sau descompunerea completă a produselor la sfârșitul duratei lor de viață?',
                  order_index: 0,
                  options: [
                    { text: 'Modelul Liniar', is_correct: false, order_index: 0 },
                    { text: 'Cradle to Cradle (Economie Circulară)', is_correct: true, order_index: 1 },
                    { text: 'Obsolescența Planificată', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Materiale Ecologice',
          description: 'Alternative la plasticele convenționale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Bioplasticele',
              content: '# Polimeri din surse vegetale\nBioplasticele (precum PLA - Acidul polilactic) sunt derivate din resurse regenerabile precum amidonul de porumb sau trestia de zahăr și, în condiții adecvate, sunt biodegradabile.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Bioplastice',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Toate bioplasticele se degradează instantaneu odată aruncate în mediul natural.',
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
          title: 'Capitolul 3: Obsolescența Planificată',
          description: 'Combaterea produselor de unică folosință.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Design pentru Reparabilitate',
              content: '# Dreptul de a repara\nUn produs sustenabil trebuie să poată fi dezasamblat cu ușurință pentru a permite utilizatorului să înlocuiască doar piesa defectă, prelungindu-i astfel durata de viață.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reparabilitatea',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește strategia prin care producătorii proiectează intenționat un bun să se strice după un anumit timp pentru a forța o nouă achiziție?',
                  order_index: 0,
                  options: [
                    { text: 'Design modular', is_correct: false, order_index: 0 },
                    { text: 'Obsolescență planificată', is_correct: true, order_index: 1 },
                    { text: 'Economie de scară', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created industrial design course 1:', course1.title);
    
    await course2.save();
    console.log('Created industrial design course 2:', course2.title);

    console.log('Successfully created courses for Design Industrial!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
