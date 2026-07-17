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
        full_name: 'Prof. Filologie',
        email: 'filologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Lingvistică',
      description: 'Studiul științific al limbajului uman, de la sunete la sensuri.',
      category: 'Filologie',
      image_url: 'https://picsum.photos/seed/philology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Fonetica și Fonologia',
          description: 'Studiul sunetelor limbii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Alfabetul Fonetic Internațional (IPA)',
              content: '# Scrierea sunetelor\nIPA este un sistem standardizat de reprezentare a sunetelor limbajului vorbit, folosind simboluri unice pentru fiecare sunet, independent de limba în care este pronunțat.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Alfabetul Fonetic',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă acronimul IPA în lingvistică?',
                  order_index: 0,
                  options: [
                    { text: 'Internet Protocol Address', is_correct: false, order_index: 0 },
                    { text: 'International Phonetic Alphabet', is_correct: true, order_index: 1 },
                    { text: 'Internal Phrasal Analysis', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Morfologia',
          description: 'Structura internă a cuvintelor.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Morfemele',
              content: '# Cărămizile cuvintelor\nMorfemul este cea mai mică unitate de sens a unei limbi. Cuvintele pot fi formate dintr-un singur morfem (rădăcină) sau mai multe (rădăcină + prefixe/sufixe).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Morfemul',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Morfemul este definit ca fiind unitatea sonoră (sunetul) de bază a unei limbi, lipsită de sens.',
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
          title: 'Capitolul 3: Semantica și Pragmatica',
          description: 'Sensul și contextul.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Dincolo de dicționar',
              content: '# Înțelesul în context\nSemantica studiază sensul literal al cuvintelor și propozițiilor, în timp ce pragmatica analizează modul în care contextul influențează interpretarea mesajului (ex: ironia).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ramuri ale lingvisticii',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește ramura lingvisticii care studiază influența contextului asupra sensului unui enunț?',
                  order_index: 0,
                  options: [
                    { text: 'Sintaxa', is_correct: false, order_index: 0 },
                    { text: 'Pragmatica', is_correct: true, order_index: 1 },
                    { text: 'Fonologia', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Literatură Universală Comparată',
      description: 'Analiza capodoperelor literare din diferite epoci și culturi.',
      category: 'Filologie',
      image_url: 'https://picsum.photos/seed/philology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Antichitatea',
          description: 'Epopeile lui Homer și tragedia greacă.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Iliada și Odiseea',
              content: '# Epopeea eroică\nOperele atribuite lui Homer pun bazele literaturii occidentale. Iliada se concentrează pe Războiul Troian, subliniind furia lui Ahile, în timp ce Odiseea urmărește călătoria de întoarcere a lui Ulise.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Operele lui Homer',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele teme este centrală în epopeea "Iliada"?',
                  order_index: 0,
                  options: [
                    { text: 'Călătoria de 10 ani pe mare', is_correct: false, order_index: 0 },
                    { text: 'Războiul Troian și furia lui Ahile', is_correct: true, order_index: 1 },
                    { text: 'Întemeierea Romei', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Romantismul',
          description: 'Emoția și revolta împotriva rațiunii.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Trăsăturile Curentului Romantic',
              content: '# Cultul sensibilității\nApărut ca o reacție la rigorile Clasicismului, Romantismul pune accent pe imaginație, sentimente, individualism, evadarea în natură și interesul pentru trecut (Evul Mediu).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Romantismul',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Romantismul literar se caracterizează prin respectarea strictă a regulilor rațiunii și a formelor clasice antice.',
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
          title: 'Capitolul 3: Modernismul',
          description: 'Ruperea tradiției.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Fluxul Conștiinței',
              content: '# Inovații narative\nModernismul de la începutul sec. XX (reprezentat de James Joyce, Virginia Woolf) experimentează cu tehnici precum "fluxul conștiinței", redând gândurile personajelor în mod necenzurat și non-linear.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tehnici Moderne',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tehnica narativă care urmărește să redea exact procesul neîntrerupt al gândirii unui personaj?',
                  order_index: 0,
                  options: [
                    { text: 'Perspectivă omniscientă', is_correct: false, order_index: 0 },
                    { text: 'Fluxul conștiinței', is_correct: true, order_index: 1 },
                    { text: 'Stil indirect liber', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created philology course 1:', course1.title);
    
    await course2.save();
    console.log('Created philology course 2:', course2.title);

    console.log('Successfully created courses for Filologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
