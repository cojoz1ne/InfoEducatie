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
        full_name: 'Prof. Geologie',
        email: 'geologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Minerale și Roci',
      description: 'Studiul materialelor care alcătuiesc scoarța terestră.',
      category: 'Geologie',
      image_url: 'https://picsum.photos/seed/geology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Mineralogia',
          description: 'Cărămizile naturii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Structura Cristalină',
              content: '# Atomii ordonați\nMineralele sunt substanțe solide, anorganice, apărute natural, cu o compoziție chimică definită și o structură cristalină bine organizată (ex: Cuarțul, Diamantul).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ce este un mineral?',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele caracteristici este absolut necesară pentru ca o substanță să fie considerată un mineral?',
                  order_index: 0,
                  options: [
                    { text: 'Să fie de origine organică (provenită din viețuitoare)', is_correct: false, order_index: 0 },
                    { text: 'Să aibă o structură cristalină ordonată', is_correct: true, order_index: 1 },
                    { text: 'Să fie creată exclusiv în laborator', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Rocile Magmatice',
          description: 'Născute din foc.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Răcirea Magmei',
              content: '# Vulcanismul\nRocile magmatice (sau ignee) se formează prin solidificarea magmei (subteran, ex: granitul) sau a lavei (la suprafață, ex: bazaltul).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Roci Magmatice',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Granitul este o rocă formată prin răcirea lentă a magmei adânc în interiorul scoarței terestre.',
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
          title: 'Capitolul 3: Roci Sedimentare și Metamorfice',
          description: 'Eroziunea și presiunea timpului.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Transformarea rocilor',
              content: '# Ciclul rocilor\nRocile sedimentare (ex: gresia, calcarul) se formează prin acumularea și cimentarea fragmentelor altor roci. Rocile metamorfice (ex: marmura din calcar) se formează când rocile existente sunt supuse la temperaturi și presiuni uriașe, fără a se topi complet.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Metamorfism',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește clasa de roci formate prin transformarea altor roci sub acțiunea căldurii și presiunii intense din interiorul Pământului?',
                  order_index: 0,
                  options: [
                    { text: 'Magmatice', is_correct: false, order_index: 0 },
                    { text: 'Metamorfice', is_correct: true, order_index: 1 },
                    { text: 'Sedimentare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Paleontologie și Istoria Pământului',
      description: 'Cum citim istoria planetei în straturile de rocă și fosile.',
      category: 'Geologie',
      image_url: 'https://picsum.photos/seed/geology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Stratigrafia',
          description: 'Cartea de piatră a timpului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Principiul Suprapunerii',
              content: '# Mai jos înseamnă mai vechi\nÎn straturile de roci sedimentare nedisturbate, stratul cel mai de jos a fost depus primul și este cel mai vechi, în timp ce straturile superioare sunt progresiv mai noi.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Principiul Suprapunerii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce postulează "Principiul Suprapunerii" în geologie referitor la straturile sedimentare neperturbate?',
                  order_index: 0,
                  options: [
                    { text: 'Toate straturile au aceeași vârstă', is_correct: false, order_index: 0 },
                    { text: 'Stratul de jos este cel mai vechi', is_correct: true, order_index: 1 },
                    { text: 'Stratul de sus este cel mai vechi', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Fosilizarea',
          description: 'Martorii trecutului.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Păstrarea Urmelor',
              content: '# Condiții speciale\nFosilele sunt resturile sau urmele conservate ale organismelor din trecutul geologic. Procesul de fosilizare este rar și necesită îngroparea rapidă a organismului într-un mediu lipsit de oxigen pentru a încetini descompunerea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fosilizare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Procesul de fosilizare necesită, în mod ideal, o expunere prelungită la suprafață, în prezența oxigenului abundent.',
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
          title: 'Capitolul 3: Extincții în Masă',
          description: 'Momentele în care viața a fost aproape ștearsă.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Impactul din Cretacic-Paleogen',
              content: '# Sfârșitul dinozaurilor\nAcum aproximativ 66 de milioane de ani, impactul unui asteroid a provocat extincția K-Pg, ducând la dispariția a 75% din speciile de pe Pământ, inclusiv toți dinozaurii non-aviari.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Extincția Dinozaurilor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește evenimentul de extincție în masă care a dus la dispariția dinozaurilor acum 66 de milioane de ani?',
                  order_index: 0,
                  options: [
                    { text: 'Extincția Permian-Triasic', is_correct: false, order_index: 0 },
                    { text: 'Extincția Cretacic-Paleogen (K-Pg)', is_correct: true, order_index: 1 },
                    { text: 'Era Glaciară', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created geology course 1:', course1.title);
    
    await course2.save();
    console.log('Created geology course 2:', course2.title);

    console.log('Successfully created courses for Geologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
