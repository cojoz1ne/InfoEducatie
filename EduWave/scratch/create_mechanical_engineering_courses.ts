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
        full_name: 'Prof. Inginerie Mecanică',
        email: 'mecanica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Termodinamică și Motoare',
      description: 'Studiul transformării căldurii în lucru mecanic și funcționarea motoarelor termice.',
      category: 'Inginerie Mecanică',
      image_url: 'https://picsum.photos/seed/mechanical1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Principiile Termodinamicii',
          description: 'Legile fundamentale ale energiei.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Conservarea și Entropia',
              content: '# Cele două legi de bază\nPrimul principiu al termodinamicii afirmă că energia nu poate fi creată sau distrusă, ci doar transformată. Al doilea principiu introduce conceptul de entropie, arătând că în orice proces real, o parte din energie se pierde sub formă de căldură disipată.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Principiile Termodinamicii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce mărime fizică, asociată cu al doilea principiu al termodinamicii, măsoară gradul de dezordine dintr-un sistem termodinamic?',
                  order_index: 0,
                  options: [
                    { text: 'Entalpia', is_correct: false, order_index: 0 },
                    { text: 'Entropia', is_correct: true, order_index: 1 },
                    { text: 'Energia cinetică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Motorul cu Ardere Internă',
          description: 'Cum funcționează mașinile clasice.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Ciclul în 4 Timpi',
              content: '# Admisie, Compresie, Ardere, Evacuare\nMajoritatea motoarelor auto funcționează pe baza ciclului Otto în 4 timpi. Amestecul de aer-combustibil este aspirat, comprimat de piston, aprins de o scânteie (care generează forța), iar gazele arse sunt eliminate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Timpii Motorului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Într-un motor în 4 timpi (ciclul Otto), timpul în care se produce efectiv lucrul mecanic (forța) este faza de "Admisie".',
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
          title: 'Capitolul 3: Transferul de Căldură',
          description: 'Răcirea și izolarea termică.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Conducție, Convecție, Radiație',
              content: '# Cum se mișcă căldura\nCăldura se poate transfera prin contact direct în solide (conducție), prin mișcarea fluidelor - aer sau apă (convecție) și prin unde electromagnetice în vid (radiație termică).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Transfer Termic',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește metoda de transfer de căldură care are loc prin mișcarea curenților de fluid (lichid sau gaz)?',
                  order_index: 0,
                  options: [
                    { text: 'Conducție', is_correct: false, order_index: 0 },
                    { text: 'Convecție', is_correct: true, order_index: 1 },
                    { text: 'Radiație', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Mecanica Fluidelor și Hidraulică',
      description: 'Studiul comportamentului lichidelor și gazelor în mișcare.',
      category: 'Inginerie Mecanică',
      image_url: 'https://picsum.photos/seed/mechanical2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Statica Fluidelor',
          description: 'Fluidele aflate în repaus.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Principiul lui Pascal',
              content: '# Presiunea se transmite integral\nConform principiului lui Pascal, presiunea exercitată asupra unui fluid incompresibil închis se transmite integral în toată masa fluidului și pe toți pereții vasului. Acesta este principiul de bază al sistemelor hidraulice (ex: frânele auto, presele hidraulice).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Principiul lui Pascal',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de echipamente mecanice funcționează direct pe baza principiului lui Pascal?',
                  order_index: 0,
                  options: [
                    { text: 'Motoarele cu reacție', is_correct: false, order_index: 0 },
                    { text: 'Presele și frânele hidraulice', is_correct: true, order_index: 1 },
                    { text: 'Compresoarele de aer', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Dinamica Fluidelor',
          description: 'Lichidele și gazele în mișcare.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Principiul lui Bernoulli',
              content: '# Viteză mare, presiune mică\nEcuația lui Bernoulli arată că într-un fluid în mișcare, o creștere a vitezei fluidului este însoțită de o scădere a presiunii. Acesta este motivul pentru care avioanele zboară (presiunea e mai mică deasupra aripii din cauza formei acesteia).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Efectul Bernoulli',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Conform principiului lui Bernoulli, atunci când viteza unui curent de aer crește, presiunea exercitată de acel curent de aer va crește proporțional.',
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
          title: 'Capitolul 3: Pompe și Turbine',
          description: 'Mașini hidraulice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Generarea de energie și mișcare',
              content: '# Cine dă și cine ia energie\nPompele consumă lucru mecanic (de la un motor) pentru a mișca un fluid sau a-i crește presiunea. Turbinele fac exact invers: extrag energie din mișcarea unui fluid (apă, abur, vânt) pentru a genera lucru mecanic (care învârte un generator electric).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Pompe vs Turbine',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește mașina hidraulică al cărei rol este să extragă energia dintr-un fluid aflat în mișcare pentru a produce lucru mecanic?',
                  order_index: 0,
                  options: [
                    { text: 'Pompă', is_correct: false, order_index: 0 },
                    { text: 'Turbină', is_correct: true, order_index: 1 },
                    { text: 'Compresor', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created mechanical course 1:', course1.title);
    
    await course2.save();
    console.log('Created mechanical course 2:', course2.title);

    console.log('Successfully created courses for Inginerie Mecanică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
