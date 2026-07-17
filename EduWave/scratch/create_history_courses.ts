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
        full_name: 'Prof. Istorie',
        email: 'istorie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Antichitatea și Marile Imperii',
      description: 'De la primele civilizații mesopotamiene la căderea Romei.',
      category: 'Istorie',
      image_url: 'https://picsum.photos/seed/history1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Leagănul Civilizației',
          description: 'Mesopotamia și Egiptul Antic.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Apariția Scrierii',
              content: '# Cuneiformele sumeriene\nIstoria începe odată cu inventarea scrierii. Sumerienii din Mesopotamia au dezvoltat prima formă de scriere, numită cuneiformă, realizată prin presarea unui stilou pe tăblițe de lut moale, inițial pentru ținerea evidenței agricole.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Prima Scriere',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește prima formă de scriere inventată de sumerieni în Mesopotamia antică?',
                  order_index: 0,
                  options: [
                    { text: 'Hieroglifică', is_correct: false, order_index: 0 },
                    { text: 'Cuneiformă', is_correct: true, order_index: 1 },
                    { text: 'Alfabetul Fenician', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Grecia Antică',
          description: 'Democrația și filosofia.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Atena vs. Sparta',
              content: '# Două modele opuse\nÎn timp ce Atena s-a concentrat pe cultură, comerț naval și a dezvoltat prima formă de democrație directă, Sparta a fost o societate strict militaristă, condusă de o oligarhie, axată pe pregătirea războinicilor de elită.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Modele Grecești',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Spre deosebire de Atena, orașul-stat Sparta a fost recunoscut în antichitate ca fiind principalul centru al artelor și al democrației.',
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
          title: 'Capitolul 3: Imperiul Roman',
          description: 'Ascensiunea și declinul unei superputeri.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Trecerea la Imperiu',
              content: '# De la Republică la Dictatură\nRoma a fost o Republică timp de aproape 500 de ani. După asasinarea lui Iulius Cezar și victoria lui Octavian (Augustus) în războaiele civile, Republica s-a prăbușit, făcând loc Imperiului Roman (27 î.Hr.).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Primul Împărat',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numea liderul roman care, după moartea lui Iulius Cezar, a devenit primul împărat al Imperiului Roman?',
                  order_index: 0,
                  options: [
                    { text: 'Nero', is_correct: false, order_index: 0 },
                    { text: 'Octavian (Augustus)', is_correct: true, order_index: 1 },
                    { text: 'Traian', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Istoria Contemporană (Secolul XX)',
      description: 'Războaiele mondiale, Războiul Rece și formarea lumii moderne.',
      category: 'Istorie',
      image_url: 'https://picsum.photos/seed/history2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Primul Război Mondial',
          description: 'Tragedia tranșeelor (1914-1918).',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Scânteia Războiului',
              content: '# Asasinatul de la Sarajevo\nCauzele adânci ale Primului Război Mondial includ naționalismul extrem, imperialismul și sistemul de alianțe. Scânteia directă a fost asasinarea arhiducelui Franz Ferdinand, moștenitorul tronului austro-ungar, pe 28 iunie 1914.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Declansarea WWI',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care a fost evenimentul (scânteia) care a declanșat direct începerea Primului Război Mondial în 1914?',
                  order_index: 0,
                  options: [
                    { text: 'Scufundarea navei Lusitania', is_correct: false, order_index: 0 },
                    { text: 'Asasinarea Arhiducelui Franz Ferdinand', is_correct: true, order_index: 1 },
                    { text: 'Căderea Zidului Berlinului', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Al Doilea Război Mondial',
          description: 'Cel mai distructiv conflict din istorie (1939-1945).',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Puncte de Cotitură',
              content: '# Bătălia de la Stalingrad și Ziua Z\nAnul 1942 a marcat schimbarea cursului războiului în Europa prin victoria sovietică de la Stalingrad, oprind avansul german. În 1944, debarcarea din Normandia (Ziua Z) a deschis al doilea front în vest.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Puncte de Cotitură',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Debarcarea aliaților în Normandia, cunoscută ca Ziua Z (D-Day), a avut loc în anul 1944.',
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
          title: 'Capitolul 3: Războiul Rece',
          description: 'Confruntarea ideologică (1947-1991).',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Cortina de Fier',
              content: '# Două blocuri opuse\nDupă 1945, lumea s-a împărțit în două: Blocul Vestic (capitalist, condus de SUA) și Blocul Estic (comunist, condus de URSS). Deși nu a existat o confruntare militară directă între cele două superputeri, s-au purtat multiple războaie "proxy" (Coreea, Vietnam).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Războiul Rece',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum a fost numită metaforic granița ideologică și fizică ce a divizat Europa în timpul Războiului Rece?',
                  order_index: 0,
                  options: [
                    { text: 'Zidul Atlanticului', is_correct: false, order_index: 0 },
                    { text: 'Cortina de Fier', is_correct: true, order_index: 1 },
                    { text: 'Linia Maginot', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created history course 1:', course1.title);
    
    await course2.save();
    console.log('Created history course 2:', course2.title);

    console.log('Successfully created courses for Istorie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
