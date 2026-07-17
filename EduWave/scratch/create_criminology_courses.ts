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
        full_name: 'Prof. Criminologie',
        email: 'criminologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Criminologie',
      description: 'Studiul cauzelor, consecințelor și prevenirii comportamentului criminal.',
      category: 'Criminologie',
      image_url: 'https://picsum.photos/seed/criminology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Teorii Clasice',
          description: 'Școala clasică și liberul arbitru.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Cesare Beccaria',
              content: '# Rațiunea și Pedeapsa\nȘcoala clasică de criminologie (sec. XVIII) a susținut că infractorii acționează din liberul arbitru, cântărind plăcerea de a comite o infracțiune versus durerea pedepsei.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Școala Clasică',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce concept central stă la baza teoriei criminologice din Școala Clasică?',
                  order_index: 0,
                  options: [
                    { text: 'Determinismul genetic', is_correct: false, order_index: 0 },
                    { text: 'Liberul arbitru', is_correct: true, order_index: 1 },
                    { text: 'Influența mediului', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Factori Sociologici',
          description: 'Mediul și criminalitatea.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Teoria Tensiunii',
              content: '# Societatea și Devianța\nTeoria Tensiunii (Strain Theory) dezvoltată de Robert Merton sugerează că stresul social determinat de incapacitatea de a atinge scopurile sociale (ex. bogăția) prin mijloace legitime duce la infracționalitate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Teoria Tensiunii',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Conform Teoriei Tensiunii, toți indivizii au aceleași posibilități de a atinge succesul prin mijloace legale.',
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
          title: 'Capitolul 3: Sistemul de Justiție Penală',
          description: 'Cum reacționează societatea.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Rolul Penitenciarelor',
              content: '# Retribuție vs. Reabilitare\nSistemul penal are rolul de a pedepsi vinovații, de a proteja societatea, dar și de a reabilita infractorii pentru a preveni recidiva.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Scopul Închisorii',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care termen definește tendința unui infractor condamnat de a repeta un comportament criminal după eliberare?',
                  order_index: 0,
                  options: [
                    { text: 'Retribuție', is_correct: false, order_index: 0 },
                    { text: 'Recidivă', is_correct: true, order_index: 1 },
                    { text: 'Descurajare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Psihologia Criminală',
      description: 'Analiza minții criminale și profilarea psihologică.',
      category: 'Criminologie',
      image_url: 'https://picsum.photos/seed/criminology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Psihopatia și Sociopatia',
          description: 'Tulburările de personalitate antisocială.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Lipsa Empatiei',
              content: '# Mintea prădătorului\nPsihopatia se caracterizează prin lipsa empatiei, superficialitate afectivă și comportament manipulator. Sociopatia este adesea asociată mai mult cu mediul traumatizant.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Trăsături Psihopatice',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care trăsătură este definitorie pentru diagnosticul de psihopatie?',
                  order_index: 0,
                  options: [
                    { text: 'Anxietatea severă', is_correct: false, order_index: 0 },
                    { text: 'Lipsa empatiei și a remușcărilor', is_correct: true, order_index: 1 },
                    { text: 'Halucinațiile', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Criminalii în Serie',
          description: 'Motive, metode și semnături.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Modus Operandi vs. Semnătura',
              content: '# Anchetele comportamentale\nModus Operandi (MO) reprezintă metodele folosite pentru a comite crima și se poate schimba în timp, în timp ce "semnătura" este comportamentul dictat de o fantezie psihologică și rămâne constantă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: M.O. vs Semnătură',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Modus Operandi al unui criminal în serie este strict emoțional și nu servește niciunui scop practic.',
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
          title: 'Capitolul 3: Profilarea Criminală',
          description: 'FBI și analiza locului faptei.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Analiza Investigativă',
              content: '# Behavioral Science Unit\nProfilarea (profiling) este procesul de deducere a trăsăturilor de personalitate, comportament și demografice ale unui infractor necunoscut, pe baza dovezilor de la locul crimei.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Profiling',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește procesul de deducere a trăsăturilor unui infractor pe baza locului faptei?',
                  order_index: 0,
                  options: [
                    { text: 'Interogatoriu', is_correct: false, order_index: 0 },
                    { text: 'Profilare criminală', is_correct: true, order_index: 1 },
                    { text: 'Victimologie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created criminology course 1:', course1.title);
    
    await course2.save();
    console.log('Created criminology course 2:', course2.title);

    console.log('Successfully created courses for Criminologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
