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
        full_name: 'Prof. Geografie',
        email: 'geografie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Geografie Fizică: Planeta Pământ',
      description: 'Studiul reliefului, climatului și hidrografiei terestre.',
      category: 'Geografie',
      image_url: 'https://picsum.photos/seed/geography1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Litosfera și Relieful',
          description: 'Cum s-au format munții și câmpiile.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Plăcile Tectonice',
              content: '# Mișcarea continentelor\nScoarța terestră este fragmentată în bucăți uriașe numite plăci tectonice. Mișcarea acestora (depărtare, coliziune sau frecare) determină formarea munților, apariția cutremurelor și a vulcanilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tectonica',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce fenomen geologic este cauzat în principal de coliziunea sau frecarea plăcilor tectonice?',
                  order_index: 0,
                  options: [
                    { text: 'Formarea uraganelor', is_correct: false, order_index: 0 },
                    { text: 'Cutremurele', is_correct: true, order_index: 1 },
                    { text: 'Formarea deșerturilor', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Atmosfera și Clima',
          description: 'Vremea și factorii care o influențează.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Straturile Atmosferei',
              content: '# Scutul Pământului\nAtmosfera ne protejează de radiațiile solare. Stratul în care trăim și unde au loc majoritatea fenomenelor meteorologice (ploi, vânt, nori) se numește Troposferă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Straturile Atmosferei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Stratosfera este stratul atmosferei terestre situat cel mai aproape de suprafața Pământului, unde apar norii.',
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
          title: 'Capitolul 3: Hidrosfera',
          description: 'Oceanele, mările și apele dulci.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Circuitul Apei în Natură',
              content: '# Evaporare și precipitații\nApa pe Pământ se află într-o mișcare continuă: se evaporă din oceane sub acțiunea soarelui, condensează formând norii și revine pe sol sub formă de precipitații, ajungând înapoi în oceane prin râuri.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Circuitul Apei',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește procesul prin care vaporii de apă din atmosferă se transformă înapoi în lichid, formând norii?',
                  order_index: 0,
                  options: [
                    { text: 'Evaporare', is_correct: false, order_index: 0 },
                    { text: 'Condensare', is_correct: true, order_index: 1 },
                    { text: 'Infiltrare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Geografie Umană și Economică',
      description: 'Studiul populației, resurselor și dezvoltării globale.',
      category: 'Geografie',
      image_url: 'https://picsum.photos/seed/geography2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Dinamica Populației',
          description: 'Natalitate, mortalitate și migrație.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Sporul Natural',
              content: '# Creșterea și scăderea populației\nSporul natural reprezintă diferența dintre numărul nașterilor (natalitate) și numărul deceselor (mortalitate) într-o anumită regiune și perioadă. Un spor negativ duce la declin demografic.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sporul Natural',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce indică un spor natural negativ al unei țări?',
                  order_index: 0,
                  options: [
                    { text: 'Un număr mare de imigranți', is_correct: false, order_index: 0 },
                    { text: 'Că numărul deceselor este mai mare decât numărul nașterilor', is_correct: true, order_index: 1 },
                    { text: 'Că țara se află într-un boom economic', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Așezările Umane',
          description: 'De la sat la metropolă.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Urbanizarea',
              content: '# Creșterea orașelor\nUrbanizarea este procesul de migrație a populației din mediul rural către cel urban. Deși oferă oportunități economice, urbanizarea rapidă poate crea probleme de poluare, trafic și lipsa locuințelor adecvate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Urbanizare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Urbanizarea se referă la procesul prin care populația dintr-un oraș se mută masiv în zonele rurale pentru agricultură.',
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
          title: 'Capitolul 3: Resursele Economice',
          description: 'Sectoarele economiei.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Sectoarele Primar, Secundar și Terțiar',
              content: '# Cum ne câștigăm existența\nGeografia economică împarte activitățile în trei sectoare: Primar (extragerea resurselor: agricultură, minerit), Secundar (prelucrare: industrie, construcții) și Terțiar (servicii: turism, comerț, educație).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sectoare Economice',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'În ce sector economic se încadrează activități precum agricultura, pescuitul și mineritul?',
                  order_index: 0,
                  options: [
                    { text: 'Sectorul Secundar', is_correct: false, order_index: 0 },
                    { text: 'Sectorul Primar', is_correct: true, order_index: 1 },
                    { text: 'Sectorul Terțiar', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created geography course 1:', course1.title);
    
    await course2.save();
    console.log('Created geography course 2:', course2.title);

    console.log('Successfully created courses for Geografie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
