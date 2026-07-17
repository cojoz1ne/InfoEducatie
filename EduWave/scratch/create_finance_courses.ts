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
        full_name: 'Prof. Finanțe',
        email: 'finante@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Piețe de Capital și Investiții',
      description: 'Cum funcționează bursa de valori, obligațiunile și portofoliile de investiții.',
      category: 'Finanțe & Bănci',
      image_url: 'https://picsum.photos/seed/finance1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Acțiunile',
          description: 'Să devii proprietar de companie.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Cumpărarea unei fracțiuni',
              content: '# Dividende și Creștere\nO acțiune reprezintă o fracțiune din capitalul social al unei companii. Investitorii cumpără acțiuni în speranța că valoarea companiei va crește în timp și/sau pentru a primi o parte din profitul companiei sub formă de dividende.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Dividende',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește porțiunea din profitul unei companii care este distribuită periodic acționarilor?',
                  order_index: 0,
                  options: [
                    { text: 'Dobândă', is_correct: false, order_index: 0 },
                    { text: 'Dividend', is_correct: true, order_index: 1 },
                    { text: 'Comision', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Obligațiunile',
          description: 'A împrumuta bani statului sau corporațiilor.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Investiții cu venit fix',
              content: '# Siguranță vs. Randament\nSpre deosebire de acțiuni, obligațiunile sunt instrumente de datorie. Cumpărând o obligațiune, practic împrumuți bani emitentului (stat sau firmă), care promite să-ți returneze suma la scadență, plus o dobândă (cupon) regulată.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Obligațiuni',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Atunci când cumperi o obligațiune emisă de o companie, devii coproprietar (acționar) al acelei companii.',
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
          title: 'Capitolul 3: Diversificarea',
          description: 'Managementul riscului în investiții.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Fondurile Mutuale și ETF-urile',
              content: '# Nu pune toate ouăle într-un singur coș\nDiversificarea este strategia de a investi în mai multe tipuri de active și companii pentru a reduce riscul. ETF-urile (Exchange Traded Funds) sunt instrumente ideale, permițând investiția într-un coș întreg de acțiuni printr-o singură tranzacție.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Strategii de Risc',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește strategia de investiții care presupune alocarea capitalului în multiple clase de active pentru a reduce riscul total?',
                  order_index: 0,
                  options: [
                    { text: 'Speculă', is_correct: false, order_index: 0 },
                    { text: 'Diversificare', is_correct: true, order_index: 1 },
                    { text: 'Arbitraj', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Sistemul Bancar și Creditarea',
      description: 'Cum creează băncile bani și cum funcționează dobânzile.',
      category: 'Finanțe & Bănci',
      image_url: 'https://picsum.photos/seed/finance2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Rezervele Fracționare',
          description: 'Cum funcționează băncile comerciale.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Multiplicatorul banilor',
              content: '# Crearea creditului\nÎn sistemul cu rezerve fracționare, băncile păstrează fizic doar o mică fracțiune din depozitele clienților (rezerva minimă obligatorie), împrumutând restul mai departe. Acest proces multiplică masa monetară aflată în circulație.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Multiplicatorul Bancar',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește sistemul prin care băncile sunt obligate să păstreze doar un mic procent din depozitele atrase, putând să împrumute restul?',
                  order_index: 0,
                  options: [
                    { text: 'Sistem de acoperire 100%', is_correct: false, order_index: 0 },
                    { text: 'Sistem cu rezerve fracționare', is_correct: true, order_index: 1 },
                    { text: 'Sistem mutual', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Dobânda Compusă',
          description: 'A opta minune a lumii.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Creșterea Exponențială',
              content: '# Dobândă la dobândă\nDobânda compusă înseamnă că dobânda se calculează nu doar la suma inițială (principal), ci și la dobânzile acumulate în perioadele anterioare, ducând la o creștere exponențială a banilor pe termen lung.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Calculul Dobânzii',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dobânda simplă generează câștiguri mai mari pe termen lung în comparație cu dobânda compusă.',
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
          title: 'Capitolul 3: Evaluarea Riscului de Credit',
          description: 'Cine primește împrumutul?',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Scorul de Credit (FICO)',
              content: '# Istoricul de plată\nBăncile evaluează riscul de a acorda un împrumut folosind scoruri de credit, care iau în calcul istoricul plăților trecute, gradul de îndatorare, durata istoricului de credit și numărul de interogări recente.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Scorul de Credit',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește scorul folosit pe scară largă de bănci pentru a evalua probabilitatea ca un client să își ramburseze datoria la timp?',
                  order_index: 0,
                  options: [
                    { text: 'Scor DAE', is_correct: false, order_index: 0 },
                    { text: 'Scor FICO', is_correct: true, order_index: 1 },
                    { text: 'Scor ROBOR', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created finance course 1:', course1.title);
    
    await course2.save();
    console.log('Created finance course 2:', course2.title);

    console.log('Successfully created courses for Finanțe & Bănci!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
