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
        full_name: 'Prof. Oceanografie',
        email: 'oceanografie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Oceanografia Fizică și Dinamica Oceanelor',
      description: 'Studiul curenților oceanici, al valurilor și al mareelor, precum și al interacțiunii ocean-atmosferă.',
      category: 'Oceanografie',
      image_url: 'https://picsum.photos/seed/ocean1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Salinitatea și Temperatura',
          description: 'Proprietățile fizice ale apei de mare.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Haloclina și Termoclina',
              content: '# Straturile oceanului\nProprietățile apei de mare variază cu adâncimea. Termoclina este stratul în care temperatura apei scade rapid odată cu adâncimea. Haloclina reprezintă zona în care salinitatea se modifică brusc. Aceste variații creează straturi de densități diferite care influențează dinamica globală.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Straturile de Densitate',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește stratul de apă în care temperatura scade extrem de rapid pe măsură ce adâncimea crește?',
                  order_index: 0,
                  options: [
                    { text: 'Haloclină', is_correct: false, order_index: 0 },
                    { text: 'Termoclină', is_correct: true, order_index: 1 },
                    { text: 'Baroclină', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Curenții Oceanici Globali',
          description: 'Marea bandă transportoare globală.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Circulația Termohalină',
              content: '# Motorul climatic al planetei\nCirculația termohalină este determinată de diferențele de densitate ale apei, controlate de temperatură (termo) și salinitate (halină). Apa rece și sărată din zonele polare se scufundă și călătorește spre ecuator, creând un curent global de adâncime crucial pentru reglarea climei terestre.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Circulația Termohalină',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Circulația termohalină globală este condusă în principal de vânturile de suprafață, nu de diferențele de temperatură și salinitate ale apei.',
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
          title: 'Capitolul 3: Mareele',
          description: 'Influența Lunii și a Soarelui asupra mărilor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Forțele de Atracție Gravitațională',
              content: '# Flux și reflux\nMareele sunt variații periodice ale nivelului mărilor și oceanelor, cauzate de atracția gravitațională conjugată a Lunii și a Soarelui asupra Pământului aflat în rotație. Cel mai înalt nivel se numește flux (flux maxim), iar cel mai coborât se numește reflux.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Mecanismul Mareelor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce corp ceresc are cea mai puternică influență gravitațională directă asupra formării mareelor terestre?',
                  order_index: 0,
                  options: [
                    { text: 'Soarele', is_correct: false, order_index: 0 },
                    { text: 'Luna', is_correct: true, order_index: 1 },
                    { text: 'Marte', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Oceanografia Biologică: Ecosistemele Marine',
      description: 'Viața în mări și oceane, de la fitoplancton la giganții din adâncuri.',
      category: 'Oceanografie',
      image_url: 'https://picsum.photos/seed/ocean2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Plonjon în Zona Fotică',
          description: 'Viața unde ajunge lumina.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Fitoplanctonul și Fotosinteza',
              content: '# Plămânul verde al oceanului\nZona fotica (până la ~200m adâncime) permite pătrunderea luminii solare. Aici trăiește fitoplanctonul (organisme microscopice fotosintetice), responsabil pentru producerea a peste 50% din oxigenul planetei și baza lanțului trofic marin.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Producția de Oxigen',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce grup de organisme marine microscopice produce peste jumătate din oxigenul atmosferei terestre prin fotosinteză?',
                  order_index: 0,
                  options: [
                    { text: 'Recifele de corali', is_correct: false, order_index: 0 },
                    { text: 'Fitoplanctonul', is_correct: true, order_index: 1 },
                    { text: 'Meduzele', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Recifele de Corali',
          description: 'Pădurile tropicale ale oceanului.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Simbioza Coral-Zooxantelă',
              content: '# Structuri vii expuse pericolului\nRecifele de corali adăpostesc 25% din viața marină, deși acoperă sub 1% din fundul oceanului. Ele trăiesc în simbioză cu algele zooxantele (care le oferă hrană și culori vibrante). Încălzirea apelor rupe această simbioză, determinând albirea coralilor și moartea lor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Albirea Coralilor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Fenomenul de „albire” a coralilor este cauzat de pierderea algelor simbiotice (zooxantele) pe fondul creșterii temperaturii apei.',
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
          title: 'Capitolul 3: Zona Abisală',
          description: 'Viața în întuneric total și presiune extremă.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Bioluminescența și Izvoarele Hidrotermale',
              content: '# Supraviețuirea fără soare\nÎn zona abisală (sub 4000m), lumina soarelui nu pătrunde deloc. Organismele de aici folosesc bioluminescența (producerea de lumină proprie) pentru a vâna sau a comunica. Lângă izvoarele hidrotermale de pe fundul mării, viața prosperă nu prin fotosinteză, ci prin chimiosinteză (bacterii care descompun compuși de sulf).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Chimiosinteza',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Prin ce proces produc energie organismele de lângă izvoarele hidrotermale din adâncul oceanului, în absența completă a luminii?',
                  order_index: 0,
                  options: [
                    { text: 'Fotosinteză', is_correct: false, order_index: 0 },
                    { text: 'Chimiosinteză', is_correct: true, order_index: 1 },
                    { text: 'Termofuziune', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created oceanography course 1:', course1.title);
    
    await course2.save();
    console.log('Created oceanography course 2:', course2.title);

    console.log('Successfully created courses for Oceanografie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
