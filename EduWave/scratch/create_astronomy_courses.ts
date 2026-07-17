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
        full_name: 'Prof. Astronomie',
        email: 'astronomie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Sistemul Solar și Planetele',
      description: 'O explorare fascinantă a planetelor, sateliților și corpurilor cerești din sistemul nostru solar.',
      category: 'Astronomie',
      image_url: 'https://picsum.photos/seed/astro1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Soarele și Planetele Interioare',
          description: 'Mercur, Venus, Pământ și Marte.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Planetele Telurice',
              content: '# Planetele stâncoase\nPrimele patru planete de la Soare sunt cunoscute ca planete interioare sau telurice, fiind formate preponderent din rocă și metal.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Planetele Interioare',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care planetă este cea mai apropiată de Soare?',
                  order_index: 0,
                  options: [
                    { text: 'Venus', is_correct: false, order_index: 0 },
                    { text: 'Marte', is_correct: false, order_index: 1 },
                    { text: 'Mercur', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Giganții Gazoși',
          description: 'Jupiter și Saturn.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Jupiter - Regele Planetelor',
              content: '# Cel mai mare corp planetar\nJupiter este compus în principal din hidrogen și heliu. Marea Pată Roșie este o furtună gigantică anticiclonica ce durează de sute de ani.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Jupiter',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Saturn este cea mai mare planetă din sistemul nostru solar.',
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
          title: 'Capitolul 3: Corpuri Cerești Mici',
          description: 'Asteroizi, comete și planete pitice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Centura de Asteroizi',
              content: '# Între Marte și Jupiter\nCentura de asteroizi găzduiește milioane de fragmente de rocă rămase de la formarea sistemului solar, precum și planeta pitică Ceres.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Asteroizi și Comete',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este numele celei mai mari planete pitice din centura de asteroizi?',
                  order_index: 0,
                  options: [
                    { text: 'Pluto', is_correct: false, order_index: 0 },
                    { text: 'Eris', is_correct: false, order_index: 1 },
                    { text: 'Ceres', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Galaxii și Evoluția Universului',
      description: 'De la Big Bang până la structura la scară mare a cosmosului și găurile negre.',
      category: 'Astronomie',
      image_url: 'https://picsum.photos/seed/astro2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Big Bang și Originea',
          description: 'Cum a început totul.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Expansiunea Universului',
              content: '# Modelul Big Bang\nUniversul a început dintr-un punct de densitate și temperatură infinită, extinzându-se și răcindu-se de-a lungul a aproximativ 13.8 miliarde de ani.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Vârsta Universului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Aproximativ ce vârstă are universul nostru?',
                  order_index: 0,
                  options: [
                    { text: '4.5 miliarde de ani', is_correct: false, order_index: 0 },
                    { text: '13.8 miliarde de ani', is_correct: true, order_index: 1 },
                    { text: '100 miliarde de ani', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Galaxii',
          description: 'Calea Lactee și vecinii noștri cosmici.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Tipuri de Galaxii',
              content: '# Spirale și Eliptice\nGalaxiile se clasifică în funcție de forma lor (clasificarea Hubble). Calea Lactee este o galaxie spirală barată.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Forma Galaxiei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Calea Lactee, galaxia noastră, este clasificată ca fiind o galaxie eliptică.',
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
          title: 'Capitolul 3: Găuri Negre',
          description: 'Cele mai misterioase obiecte din univers.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Orizontul Evenimentelor',
              content: '# Punctul fără întoarcere\nOrizontul evenimentelor este granița unei găuri negre dincolo de care viteza de evadare o depășește pe cea a luminii.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Găuri Negre',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește limita în jurul unei găuri negre de unde lumina nu mai poate scăpa?',
                  order_index: 0,
                  options: [
                    { text: 'Punctul de singularitate', is_correct: false, order_index: 0 },
                    { text: 'Orizontul evenimentelor', is_correct: true, order_index: 1 },
                    { text: 'Discul de acreție', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created astronomy course 1:', course1.title);
    
    await course2.save();
    console.log('Created astronomy course 2:', course2.title);

    console.log('Successfully created courses for Astronomie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
