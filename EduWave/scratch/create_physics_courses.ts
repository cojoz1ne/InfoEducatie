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
        full_name: 'Prof. Fizică',
        email: 'fizica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Mecanica Clasică',
      description: 'Studiul mișcării corpurilor și al forțelor care o determină, de la Galileo la Newton.',
      category: 'Fizică',
      image_url: 'https://picsum.photos/seed/physics1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Cinematica',
          description: 'Descrierea mișcării fără a ține cont de cauze.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Viteză și Accelerație',
              content: '# Cum se mișcă lucrurile\nCinematica studiază traiectoria, viteza (variația poziției în timp) și accelerația (variația vitezei în timp). O mașină care merge cu viteză constantă are accelerația zero.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Accelerația',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce valoare are accelerația unui corp care se deplasează în linie dreaptă, cu o viteză perfect constantă?',
                  order_index: 0,
                  options: [
                    { text: 'Este maximă', is_correct: false, order_index: 0 },
                    { text: 'Zero', is_correct: true, order_index: 1 },
                    { text: 'Depinde de masă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Dinamica',
          description: 'Legile lui Newton și cauzele mișcării.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: F = m * a',
              content: '# A doua lege a lui Newton\nDinamica explică de ce se mișcă obiectele. A doua lege a lui Newton afirmă că forța (F) aplicată asupra unui corp este egală cu masa (m) corpului înmulțită cu accelerația (a) pe care o capătă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Legile lui Newton',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Conform celei de-a doua legi a lui Newton, dacă aplicăm aceeași forță pe două corpuri de mase diferite, corpul mai greu va avea o accelerație mai mare.',
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
          title: 'Capitolul 3: Conservarea Energiei',
          description: 'Lucrul mecanic și energia mecanică.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Energie Cinetică vs. Potențială',
              content: '# Transformarea energiei\nÎntr-un sistem izolat fără frecare, energia mecanică totală se conservă. Energia potențială (datorată poziției, ex: o minge la înălțime) se transformă în energie cinetică (datorată mișcării, ex: mingea căzând).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Energie',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește energia pe care un corp o deține strict datorită mișcării (vitezei) sale?',
                  order_index: 0,
                  options: [
                    { text: 'Energie Potențială', is_correct: false, order_index: 0 },
                    { text: 'Energie Cinetică', is_correct: true, order_index: 1 },
                    { text: 'Energie Termică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Fizica Cuantică: Lumea Subatomică',
      description: 'O călătorie în universul bizar al particulelor, unde legile clasice nu se mai aplică.',
      category: 'Fizică',
      image_url: 'https://picsum.photos/seed/physics2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Dualitatea Undă-Corpuscul',
          description: 'Natura dublă a luminii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Experimentul celor două fante',
              content: '# Fotonii și Electronii\nExperimentul lui Young cu cele două fante a demonstrat că particulele elementare, cum ar fi electronii sau fotonii (particule de lumină), se pot comporta atât ca particule solide, cât și ca unde.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Natura Luminii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Conform mecanicii cuantice, lumina prezintă o natură duală. Ce înseamnă acest lucru?',
                  order_index: 0,
                  options: [
                    { text: 'Are doar masă și sarcină', is_correct: false, order_index: 0 },
                    { text: 'Se comportă atât ca undă, cât și ca particulă', is_correct: true, order_index: 1 },
                    { text: 'Este vizibilă și invizibilă simultan', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Principiul Incertitudinii',
          description: 'Limite în măsurare.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Heisenberg',
              content: '# O limită fundamentală\nPrincipiul incertitudinii formulat de Werner Heisenberg stipulează că este imposibil să cunoaștem simultan, cu precizie absolută, atât poziția, cât și impulsul (viteza) unei particule subatomice.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Principiul Incertitudinii',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Principiul incertitudinii se aplică din cauza lipsei unor instrumente de măsură suficient de performante în prezent.',
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
          title: 'Capitolul 3: Inseparabilitatea Cuantică (Entanglement)',
          description: 'Conexiuni la distanță.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: "Acțiune fantomatică la distanță"',
              content: '# Paradoxul EPR\nInseparabilitatea cuantică este fenomenul prin care două particule devin interconectate, astfel încât starea uneia determină instantaneu starea celeilalte, indiferent de distanța cosmică dintre ele (chiar și la ani lumină depărtare).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Entanglement',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum a numit Albert Einstein fenomenul de inseparabilitate cuantică (entanglement), fiind sceptic în privința lui?',
                  order_index: 0,
                  options: [
                    { text: 'Relativitate restrânsă', is_correct: false, order_index: 0 },
                    { text: 'Acțiune fantomatică la distanță', is_correct: true, order_index: 1 },
                    { text: 'Colapsul funcției de undă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created physics course 1:', course1.title);
    
    await course2.save();
    console.log('Created physics course 2:', course2.title);

    console.log('Successfully created courses for Fizică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
