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
        full_name: 'Prof. English',
        email: 'english@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Gramatică Esențială: Timpurile Verbale',
      description: 'Înțelege și folosește corect timpurile verbale din limba engleză.',
      category: 'Limba Engleză',
      image_url: 'https://picsum.photos/seed/english1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Prezentul',
          description: 'Simple vs. Continuous.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Rutină vs. Momentul vorbirii',
              content: '# Present Simple vs. Present Continuous\nFolosim "Present Simple" pentru acțiuni de rutină, fapte generale sau adevăruri (ex: "I drink coffee every day"). Folosim "Present Continuous" pentru acțiuni care se întâmplă exact în momentul vorbirii sau în jurul acestuia (ex: "I am drinking coffee right now").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Alegerea Prezentului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care formă este corectă pentru a exprima o acțiune de rutină (obicei)?',
                  order_index: 0,
                  options: [
                    { text: 'She is walking to school every day.', is_correct: false, order_index: 0 },
                    { text: 'She walks to school every day.', is_correct: true, order_index: 1 },
                    { text: 'She walking to school every day.', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Trecutul',
          description: 'Past Simple vs. Present Perfect.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Când s-a întâmplat?',
              content: '# Timp specific vs. Experiență\nFolosim "Past Simple" când menționăm exact CÂND s-a întâmplat acțiunea în trecut (ex: "I saw him yesterday"). Folosim "Present Perfect" pentru a vorbi despre experiențe trecute fără a specifica momentul exact, având o legătură cu prezentul (ex: "I have seen that movie").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Past vs Perfect',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dacă precizezi anul exact în care ai vizitat Londra (ex: în 2015), trebuie să folosești "Present Perfect" (ex: I have visited London in 2015).',
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
          title: 'Capitolul 3: Viitorul',
          description: 'Will vs. Going to.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Planuri și Predicții',
              content: '# Cum exprimăm viitorul\nFolosim "will" pentru decizii spontane, promisiuni sau predicții fără dovezi clare (ex: "I will help you"). Folosim "going to" pentru planuri deja stabilite sau predicții bazate pe dovezi evidente în prezent (ex: "Look at those clouds! It is going to rain").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Will sau Going to?',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce formă este recomandată atunci când iei o decizie spontană, fix în momentul vorbirii?',
                  order_index: 0,
                  options: [
                    { text: 'Going to', is_correct: false, order_index: 0 },
                    { text: 'Will', is_correct: true, order_index: 1 },
                    { text: 'Present Continuous', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Business English',
      description: 'Vocabular și expresii esențiale pentru mediul de afaceri internațional.',
      category: 'Limba Engleză',
      image_url: 'https://picsum.photos/seed/english2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Comunicarea prin Email',
          description: 'Formal vs. Informal.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Formule de Salut și Încheiere',
              content: '# Politețea profesională\nÎntr-un email formal, începem cu "Dear Mr./Ms. [Nume]" și încheiem cu "Sincerely" sau "Best regards". Evităm contracțiile (folosim "I am" în loc de "I\'m") și folosim un limbaj direct și politicos.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Email-uri',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele este cea mai potrivită formulă de încheiere pentru un email formal, adresat unui client nou?',
                  order_index: 0,
                  options: [
                    { text: 'Cheers,', is_correct: false, order_index: 0 },
                    { text: 'Best regards,', is_correct: true, order_index: 1 },
                    { text: 'See ya,', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Ședințe (Meetings)',
          description: 'Vocabularul negocierilor.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Exprimarea Opiniilor',
              content: '# Cum să fii diplomat\nÎn timpul ședințelor (meetings), este important să-ți exprimi opinia fără a fi agresiv. Folosește structuri precum "From my point of view...", "I strongly believe that..." sau "If you ask me...". Pentru a dezaproba politicos, folosește "I see your point, but...".',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Dezacordul',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Într-o întâlnire de afaceri, este considerat politicos să spui "You are completely wrong" atunci când nu ești de acord cu un coleg.',
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
          title: 'Capitolul 3: Prezentări și Grafice',
          description: 'Cum să susții o prezentare.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Descrierea Tendințelor',
              content: '# Up and Down\nCând prezinți grafice, ai nevoie de verbe specifice. Pentru creștere: "to increase, to rise, to go up". Pentru scădere: "to decrease, to fall, to drop". Pentru menținere la același nivel: "to remain stable, to level off".',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Vocabular Grafice',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele verbe indică o SCĂDERE a vânzărilor într-un grafic?',
                  order_index: 0,
                  options: [
                    { text: 'To rise', is_correct: false, order_index: 0 },
                    { text: 'To drop', is_correct: true, order_index: 1 },
                    { text: 'To climb', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created english course 1:', course1.title);
    
    await course2.save();
    console.log('Created english course 2:', course2.title);

    console.log('Successfully created courses for Limba Engleză!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
