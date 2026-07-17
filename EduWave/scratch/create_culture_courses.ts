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
        full_name: 'Prof. Cultură',
        email: 'cultura@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Civilizațiile Antice ale Lumii',
      description: 'O călătorie prin istoria primelor mari culturi umane.',
      category: 'Cultură & Civilizație',
      image_url: 'https://picsum.photos/seed/culture1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Mesopotamia',
          description: 'Leagănul civilizației.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Sumerienii și Scrierea Cuneiformă',
              content: '# Prima scriere\nSumerienii din Mesopotamia antică (în zona Irakului de astăzi) sunt considerați inventatorii primei forme de scriere din lume, scrierea cuneiformă, realizată pe tăblițe de lut.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Mesopotamia',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește prima formă de scriere inventată de sumerieni?',
                  order_index: 0,
                  options: [
                    { text: 'Hieroglife', is_correct: false, order_index: 0 },
                    { text: 'Cuneiformă', is_correct: true, order_index: 1 },
                    { text: 'Alfabet fonetic', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Egiptul Antic',
          description: 'Faraoni, piramide și zei.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Viața de Apoi',
              content: '# Ritualul Mumificării\nEgiptenii antici credeau cu tărie în viața de apoi. Procesul de mumificare avea scopul de a păstra corpul fizic intact, astfel încât sufletul (Ka și Ba) să poată trăi etern.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Mumificarea',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Scopul principal al mumificării în Egiptul Antic era protejarea corpului de boli contagioase.',
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
          title: 'Capitolul 3: Grecia Antică',
          description: 'Filosofia și democrația.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Polisul',
              content: '# Orașul-Stat\nGrecia antică nu era o țară unitară, ci era formată din sute de polisuri (orașe-stat) independente, precum Atena și Sparta, cu sisteme proprii de guvernare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Orașele Grecești',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numeau orașele-stat independente din Grecia Antică?',
                  order_index: 0,
                  options: [
                    { text: 'Provincii', is_correct: false, order_index: 0 },
                    { text: 'Polisuri', is_correct: true, order_index: 1 },
                    { text: 'Imperii', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Mitologie și Folclor Universal',
      description: 'Poveștile și credințele care au modelat cultura globală.',
      category: 'Cultură & Civilizație',
      image_url: 'https://picsum.photos/seed/culture2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Mitologia Nordică',
          description: 'Zei, uriași și Ragnarok.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Arborele Lumii',
              content: '# Yggdrasil\nÎn cosmologia nordică, universul este susținut de Yggdrasil, un frasin gigantic care conectează cele nouă lumi, inclusiv Asgard (lumea zeilor) și Midgard (lumea oamenilor).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Yggdrasil',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce copac mitologic susține cele nouă lumi în mitologia nordică?',
                  order_index: 0,
                  options: [
                    { text: 'Yggdrasil', is_correct: true, order_index: 0 },
                    { text: 'Muntele Olimp', is_correct: false, order_index: 1 },
                    { text: 'Stejarul Sacru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Mitologia Japoneză',
          description: 'Kami, spirite și tradiții shinto.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Conceptul de Kami',
              content: '# Spiritele naturii\nÎn religia Shinto din Japonia antică și modernă, "Kami" sunt spiritele sacre care iau forma unor elemente naturale, animale sau strămoși venerați.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Kami',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Termenul "Kami" se referă exclusiv la spirite malefice și demoni din folclorul japonez.',
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
          title: 'Capitolul 3: Folclorul European',
          description: 'Basme, zâne și creaturi magice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Frații Grimm',
              content: '# Culegerea basmelor\nÎn secolul XIX, Jacob și Wilhelm Grimm au colectat și publicat povești populare germane. Inițial, aceste basme erau mult mai întunecate și nu erau destinate exclusiv copiilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Basme',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care era publicul țintă inițial al primelor versiuni ale basmelor culese de Frații Grimm?',
                  order_index: 0,
                  options: [
                    { text: 'Copiii mici', is_correct: false, order_index: 0 },
                    { text: 'Adulții și academicienii', is_correct: true, order_index: 1 },
                    { text: 'Regalitatea', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created culture course 1:', course1.title);
    
    await course2.save();
    console.log('Created culture course 2:', course2.title);

    console.log('Successfully created courses for Cultură & Civilizație!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
