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
        full_name: 'Prof. Botanică',
        email: 'botanica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Morfologia și Anatomia Plantelor',
      description: 'Studiul structurii interne și externe a plantelor cu flori (angiosperme).',
      category: 'Botanică',
      image_url: 'https://picsum.photos/seed/botany1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Rădăcina și Tulpina',
          description: 'Organele vegetative de bază.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Structura Tulpinii',
              content: '# Funcția de transport\nTulpina susține frunzele și florile și conține vase conductoare (xilem și floem) care transportă seva brută și elaborată în întreaga plantă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Țesuturi Conductoare',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care tip de țesut transportă seva brută (apă și săruri minerale) de la rădăcină spre frunze?',
                  order_index: 0,
                  options: [
                    { text: 'Floem', is_correct: false, order_index: 0 },
                    { text: 'Xilem', is_correct: true, order_index: 1 },
                    { text: 'Epiderma', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Frunza și Fotosinteza',
          description: 'Laboratorul plantei.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Procesul de Fotosinteză',
              content: '# Clorofila și Lumina\nFotosinteza are loc în cloroplaste, unde energia solară este folosită pentru a transforma dioxidul de carbon și apa în glucoză și oxigen.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Funcțiile Frunzei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Clorofila este pigmentul responsabil pentru culoarea verde a frunzelor și captarea energiei luminoase.',
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
          title: 'Capitolul 3: Floarea și Reproducerea',
          description: 'Organul de înmulțire al angiospermelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Părțile Florii',
              content: '# Polenizarea și Fecundația\nO floare completă are sepale, petale, stamine (organ masculin) și pistil/carpelă (organ feminin). Polenizarea transferă polenul de la stamină la pistil.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reproducerea Plantelor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește partea masculină a florii care produce polenul?',
                  order_index: 0,
                  options: [
                    { text: 'Pistil', is_correct: false, order_index: 0 },
                    { text: 'Stamina', is_correct: true, order_index: 1 },
                    { text: 'Sepala', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Taxonomia și Diversitatea Plantelor',
      description: 'O privire asupra clasificării și evoluției diverselor grupe de plante.',
      category: 'Botanică',
      image_url: 'https://picsum.photos/seed/botany2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Algele și Mușchii (Briofitele)',
          description: 'Plantele inferioare nevasculare.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Caracteristicile Briofitelor',
              content: '# Dependența de apă\nMușchii (briofitele) sunt primele plante terestre. Ei nu au vase conductoare adevărate și depind puternic de umiditate pentru reproducere.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Plante Inferioare',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'De ce depind puternic mușchii de mediile umede?',
                  order_index: 0,
                  options: [
                    { text: 'Nu au clorofilă', is_correct: false, order_index: 0 },
                    { text: 'Polenizarea este realizată de pești', is_correct: false, order_index: 1 },
                    { text: 'Reproducerea lor necesită apă pentru deplasarea gameților masculini', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Ferigile (Pteridofitele)',
          description: 'Primele plante cu vase conductoare.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Evoluția sistemului vascular',
              content: '# Xilem și Floem\nSpre deosebire de mușchi, ferigile au dezvoltat țesuturi vasculare care le permit să crească mult mai mari, transportând eficient nutrienții.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ferigi',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Ferigile se înmulțesc prin semințe.',
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
          title: 'Capitolul 3: Gimnosperme și Angiosperme',
          description: 'Plantele cu semințe.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Diferența dintre conifere și plantele cu flori',
              content: '# Semințe dezvelite vs. închise\nGimnospermele (ex: brad, pin) au semințele neînchise într-un fruct, în timp ce Angiospermele formează fructe care protejează semințele.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Conifere și Fructe',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'În ce grup de plante semințele sunt închise (protejate) într-un fruct?',
                  order_index: 0,
                  options: [
                    { text: 'Pteridofite', is_correct: false, order_index: 0 },
                    { text: 'Angiosperme', is_correct: true, order_index: 1 },
                    { text: 'Gimnosperme', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created botany course 1:', course1.title);
    
    await course2.save();
    console.log('Created botany course 2:', course2.title);

    console.log('Successfully created courses for Botanică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
