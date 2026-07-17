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
        full_name: 'Prof. Germană',
        email: 'germana@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Germană: Primii Pași (A1)',
      description: 'Saluturi, pronunție și vocabular de bază pentru a te descurca în Germania.',
      category: 'Limba Germană',
      image_url: 'https://picsum.photos/seed/german1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Formule de Salut',
          description: 'Cum interacționăm inițial.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Hallo și Tschüss',
              content: '# Salutul zilnic\nÎn germană, cel mai comun salut informal este "Hallo" (Bună). Formal, folosim "Guten Morgen" (Bună dimineața) sau "Guten Tag" (Bună ziua). La despărțire, folosim informal "Tschüss" (Pa) sau formal "Auf Wiedersehen" (La revedere).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Saluturi',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este forma corectă și politicoasă de a spune "La revedere" în limba germană?',
                  order_index: 0,
                  options: [
                    { text: 'Hallo', is_correct: false, order_index: 0 },
                    { text: 'Auf Wiedersehen', is_correct: true, order_index: 1 },
                    { text: 'Bitte', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Articolele Hotărâte',
          description: 'Der, Die, Das.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Genul Substantivelor',
              content: '# Capcana genurilor\nÎn germană, substantivele au trei genuri: Masculin ("der", ex: der Mann - bărbatul), Feminin ("die", ex: die Frau - femeia) și Neutru ("das", ex: das Kind - copilul). Important: Toate substantivele se scriu cu literă mare!',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Substantive',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'În limba germană, doar numele proprii și numele de orașe se scriu cu literă mare; restul substantivelor se scriu cu literă mică.',
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
          title: 'Capitolul 3: Numerele',
          description: 'Cum să numeri până la 100.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Inversarea Unităților',
              content: '# Zeci și Unități\nDe la 21 în sus, germanii spun unitățile înaintea zecilor. De exemplu, pentru 24 se spune "vierundzwanzig" (patru-și-douăzeci). Numerele de la 1 la 10 sunt: eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Numere',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se citește corect numărul 24 în limba germană?',
                  order_index: 0,
                  options: [
                    { text: 'Zwanzigvier', is_correct: false, order_index: 0 },
                    { text: 'Vierundzwanzig', is_correct: true, order_index: 1 },
                    { text: 'Vierzwanzig', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Gramatică: Ordinea Cuvintelor',
      description: 'Stăpânește structura complexă a propozițiilor germane.',
      category: 'Limba Germană',
      image_url: 'https://picsum.photos/seed/german2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Propoziția Principală',
          description: 'Regula Poziției 2.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Verbul mereu pe locul doi',
              content: '# Regula de aur\nÎntr-o propoziție principală afirmativă în germană, verbul conjugat trebuie să stea întotdeauna pe poziția a 2-a. Dacă începi propoziția cu o indicație de timp (ex: "Heute" - Astăzi), subiectul se va muta după verb (ex: "Heute gehe ich...", nu "Heute ich gehe...").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Poziția Verbului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Unde se plasează întotdeauna verbul conjugat într-o propoziție principală afirmativă în germană?',
                  order_index: 0,
                  options: [
                    { text: 'La finalul propoziției', is_correct: false, order_index: 0 },
                    { text: 'Pe poziția a 2-a', is_correct: true, order_index: 1 },
                    { text: 'Mereu pe prima poziție', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Propoziția Secundară',
          description: 'Când verbul pleacă la final.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Conjuncțiile Subordonatoare',
              content: '# Weil, Dass, Wenn\nCând folosești conjuncții subordonatoare (cum ar fi "weil" - pentru că, "dass" - că, "wenn" - dacă), verbul conjugat este aruncat la sfârșitul propoziției secundare (ex: "Ich lerne Deutsch, *weil* es wichtig *ist*").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Verbul la Final',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'După conjuncția "weil" (pentru că), verbul conjugat din propoziția secundară trebuie mutat obligatoriu la final.',
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
          title: 'Capitolul 3: Verbele Separabile',
          description: 'Trennbare Verben.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Prefixul Călător',
              content: '# Despărțirea verbului\nMulte verbe în germană au un prefix separabil (ex: "aufstehen" - a se trezi/a se ridica). Când conjugăm verbul într-o propoziție principală, prefixul ("auf") se desprinde și se duce fix la sfârșitul propoziției (ex: "Ich stehe um 7 Uhr auf").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Verbe Separabile',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce se întâmplă cu prefixul unui verb separabil (ex: "auf-" din "aufstehen") într-o propoziție principală?',
                  order_index: 0,
                  options: [
                    { text: 'Rămâne lipit de verb pe poziția a 2-a', is_correct: false, order_index: 0 },
                    { text: 'Se mută la sfârșitul propoziției', is_correct: true, order_index: 1 },
                    { text: 'Se mută la începutul propoziției', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created german course 1:', course1.title);
    
    await course2.save();
    console.log('Created german course 2:', course2.title);

    console.log('Successfully created courses for Limba Germană!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
