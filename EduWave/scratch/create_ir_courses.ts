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
        full_name: 'Prof. Relații Internaționale',
        email: 'ri@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Teorii ale Relațiilor Internaționale',
      description: 'Studiul modului în care statele interacționează prin prisma realismului, liberalismului și constructivismului.',
      category: 'Relații Internaționale',
      image_url: 'https://picsum.photos/seed/ir1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Realismul Clasic',
          description: 'Lupta pentru putere și anarhia internațională.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Anarhia și Auto-ajutorarea (Self-Help)',
              content: '# Interesele naționale primează\nRealismul consideră statul ca fiind actorul principal în relațiile internaționale. Întrucât nu există un guvern mondial centralizat (anarhie), statele se află într-o competiție continuă pentru securitate și putere, bazându-se pe auto-ajutorare (self-help) și pe balanța de putere.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Realismul Clasic',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este actorul central în analiza relațiilor internaționale conform realismului?',
                  order_index: 0,
                  options: [
                    { text: 'Organizațiile Non-Guvernamentale', is_correct: false, order_index: 0 },
                    { text: 'Statul suveran', is_correct: true, order_index: 1 },
                    { text: 'Corporațiile multinaționale', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Liberalismul și Cooperarea',
          description: 'Rolul instituțiilor internaționale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Teoria Păcii Democrate și Instituționalismul',
              content: '# Cooperarea prin reguli comune\nLiberalismul susține că statele pot coopera durabil prin intermediul organizațiilor internaționale (ex: ONU, UE) și al comerțului liber. „Teoria Păcii Democrate” afirmă că statele democratice nu poartă războaie între ele, preferând rezolvarea diplomatică a conflictelor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Liberalismul',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: '„Teoria Păcii Democrate” susține că statele democratice sunt, în general, mult mai predispuse să declare război altor democrații.',
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
          title: 'Capitolul 3: Constructivismul',
          description: 'Identități, norme și idei.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Anarhia este ceea ce statele fac din ea',
              content: '# Lumea construită social\nConstructivismul (popularizat de Alexander Wendt) susține că aspectele cheie ale relațiilor internaționale sunt construite social prin idei, identități și norme culturale. Anarhia nu dictează automat conflictul, ci relațiile de încredere sau dușmănie se construiesc prin interacțiune.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Constructivism',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce teoretician al Relațiilor Internaționale este faimos pentru sintagma „Anarhia este ceea ce statele fac din ea”?',
                  order_index: 0,
                  options: [
                    { text: 'Hans Morgenthau', is_correct: false, order_index: 0 },
                    { text: 'Alexander Wendt', is_correct: true, order_index: 1 },
                    { text: 'John Mearsheimer', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Diplomație și Organizații Internaționale',
      description: 'Istoria diplomației moderne, a tratatelor globale și a organizațiilor internaționale precum ONU.',
      category: 'Relații Internaționale',
      image_url: 'https://picsum.photos/seed/ir2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Tratatul de la Westfalia',
          description: 'Nașterea sistemului modern de state.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Suveranitatea Westfalică',
              content: '# Piatra de temelie a suveranității\nTratatul din 1648 (Pacea Westfalică) a pus capăt Războiului de Treizeci de Ani și a definit principiul suveranității statale: niciun stat nu are dreptul să intervină în afacerile interne ale altui stat, stabilind egalitatea juridică a statelor moderne.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Pacea Westfalică',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'În ce an a fost semnat Tratatul de la Westfalia, punând bazele sistemului internațional de state suverane?',
                  order_index: 0,
                  options: [
                    { text: '1789', is_correct: false, order_index: 0 },
                    { text: '1648', is_correct: true, order_index: 1 },
                    { text: '1918', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Organizația Națiunilor Unite (ONU)',
          description: 'Arhitectura păcii globale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Consiliul de Securitate și Dreptul de Veto',
              content: '# Deciziile colective de securitate\nÎnființată în 1945, ONU are rolul de a menține pacea mondială. Consiliul de Securitate este organul decizional principal, având 5 membri permanenți (SUA, Rusia, China, Marea Britanie, Franța) care dețin dreptul de veto, putând bloca orice rezoluție.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Consiliul de Securitate',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dreptul de veto în cadrul Consiliului de Securitate al ONU este deținut de toți membrii Adunării Generale.',
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
          title: 'Capitolul 3: Diplomație Bilaterală și Multilaterală',
          description: 'Arta negocierii tratatelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Convenția de la Viena privind Relațiile Diplomatice',
              content: '# Imunități și ambasade\nSemnată în 1961, această convenție stabilește normele activității diplomatice. Ea definește imunitatea diplomatică (diplomații nu pot fi arestați în statul gazdă) și inviolabilitatea ambasadei (forțele de ordine din statul gazdă nu pot intra fără permisiune).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Imunitatea Diplomatică',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce convenție internațională din 1961 reglementează imunitățile, drepturile și obligațiile misiunilor diplomatice globale?',
                  order_index: 0,
                  options: [
                    { text: 'Convenția de la Geneva', is_correct: false, order_index: 0 },
                    { text: 'Convenția de la Viena', is_correct: true, order_index: 1 },
                    { text: 'Tratatul de la Versailles', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created ir course 1:', course1.title);
    
    await course2.save();
    console.log('Created ir course 2:', course2.title);

    console.log('Successfully created courses for Relații Internaționale!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
