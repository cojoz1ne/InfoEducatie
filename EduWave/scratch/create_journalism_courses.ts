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
        full_name: 'Prof. Jurnalism',
        email: 'jurnalism@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Redactare și Raportare',
      description: 'Învață cum să scrii știri obiective și de impact.',
      category: 'Jurnalism & Media',
      image_url: 'https://picsum.photos/seed/journalism1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Știrea de Bază',
          description: 'Structura și esența informației.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Regula celor 5W',
              content: '# Fundamentul jurnalismului\nO știre completă trebuie să răspundă rapid la cinci întrebări esențiale (cunoscute ca "The 5 Ws" în engleză): Cine? Ce? Când? Unde? De ce? (Who, What, When, Where, Why) și, uneori, Cum? (How).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Regula 5W',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele NU face parte din "Regula celor 5W" obligatorii pentru o știre jurnalistică de bază?',
                  order_index: 0,
                  options: [
                    { text: 'Ce? (What)', is_correct: false, order_index: 0 },
                    { text: 'Cât costă? (How much)', is_correct: true, order_index: 1 },
                    { text: 'Când? (When)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Piramida Răsturnată',
          description: 'Cum să captezi atenția.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Organizarea Informației',
              content: '# Esențialul la început\nStilul "piramidei răsturnate" presupune plasarea celor mai importante și de impact informații (Lead-ul) chiar în primul paragraf. Detaliile de context și informațiile secundare sunt lăsate pentru finalul articolului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Piramida Răsturnată',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Structura "piramidei răsturnate" presupune păstrarea celei mai importante informații pentru finalul articolului, pentru a crea suspans.',
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
          title: 'Capitolul 3: Etica Jurnalistică',
          description: 'Adevăr, obiectivitate și responsabilitate.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Verificarea Surselor',
              content: '# Combaterea dezinformării\nJurnalismul etic cere ca orice informație să fie verificată din cel puțin două surse independente înainte de publicare. Acuratețea primează mereu în fața vitezei (de a fi primul care publică).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Verificarea Surselor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Conform normelor jurnalistice standard, din câte surse independente ar trebui verificată o informație sensibilă înainte de a fi publicată?',
                  order_index: 0,
                  options: [
                    { text: 'O singură sursă', is_correct: false, order_index: 0 },
                    { text: 'Două surse', is_correct: true, order_index: 1 },
                    { text: 'Nicio sursă (doar intuiția)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Media Digitală și Era Fake News',
      description: 'Cum s-a schimbat consumul de informație în secolul 21.',
      category: 'Jurnalism & Media',
      image_url: 'https://picsum.photos/seed/journalism2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Jurnalismul Cetățenesc',
          description: 'Când oricine are o voce.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Impactul Social Media',
              content: '# Telefonul ca armă media\nPrin intermediul smartphone-urilor și rețelelor sociale, oricine poate documenta și transmite evenimente în timp real (jurnalism cetățenesc). Deși democratizează informația, lipsește deseori filtrul etic și editorial.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Jurnalism Cetățenesc',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce termen descrie fenomenul prin care oamenii de rând filmează și publică evenimente de interes public pe rețelele sociale, ocolind presa tradițională?',
                  order_index: 0,
                  options: [
                    { text: 'Jurnalism de investigație', is_correct: false, order_index: 0 },
                    { text: 'Jurnalism cetățenesc', is_correct: true, order_index: 1 },
                    { text: 'Propagandă de stat', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Clickbait-ul',
          description: 'Goana după atenție.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Economia Atenției',
              content: '# Titluri senzaționaliste\nClickbait-ul folosește titluri exagerate, misterioase sau incomplete ("Nu o să-ți vină să crezi ce s-a întâmplat!") exclusiv pentru a atrage click-uri, generând astfel venituri din reclame, adesea dezamăgind cititorul prin conținut slab.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Clickbait',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Titlurile de tip "Clickbait" sunt considerate o practică excelentă de jurnalism calitativ, fiind predate în facultățile de profil.',
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
          title: 'Capitolul 3: Fake News și Dezinformarea',
          description: 'Cum să recunoști manipularea.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Fact-Checking',
              content: '# Verificarea faptelor\nȘtirile false (Fake News) sunt informații fabricate intenționat pentru a înșela, a influența alegeri sau a face bani. Fact-checking-ul implică analiza dovezilor, a URL-urilor, a datelor pozelor (Reverse Image Search) și a intenției autorului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fact-Checking',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește procesul riguros de verificare a afirmațiilor și dovezilor dintr-un articol pentru a combate dezinformarea?',
                  order_index: 0,
                  options: [
                    { text: 'Clickbaiting', is_correct: false, order_index: 0 },
                    { text: 'Fact-checking', is_correct: true, order_index: 1 },
                    { text: 'Brainstorming', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created journalism course 1:', course1.title);
    
    await course2.save();
    console.log('Created journalism course 2:', course2.title);

    console.log('Successfully created courses for Jurnalism & Media!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
