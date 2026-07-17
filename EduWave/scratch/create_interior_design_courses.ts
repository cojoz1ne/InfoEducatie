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
        full_name: 'Prof. Design Interior',
        email: 'interiordesign@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Principiile Designului de Interior',
      description: 'Învață bazele compoziției, culorilor și proporțiilor în amenajarea spațiilor.',
      category: 'Design de Interior',
      image_url: 'https://picsum.photos/seed/interiordesign1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Spațiul și Funcționalitatea',
          description: 'Cum să optimizezi orice încăpere.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Planificarea Spațiului',
              content: '# Ergonomia și Fluxul\nPlanificarea eficientă a spațiului implică stabilirea unui flux de circulație logic și asigurarea că fiecare zonă îndeplinește funcția pentru care a fost concepută, menținând în același timp confortul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Planificarea Spațiului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce element este cel mai important atunci când se stabilește fluxul de circulație într-o cameră?',
                  order_index: 0,
                  options: [
                    { text: 'Culoarea pereților', is_correct: false, order_index: 0 },
                    { text: 'Ergonomia și utilitatea', is_correct: true, order_index: 1 },
                    { text: 'Textura covoarelor', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Teoria Culorilor',
          description: 'Roata culorilor și impactul psihologic.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Armonia Cromatică',
              content: '# Scheme de culori\nCulorile influențează direct starea de spirit. Schemele complementare (culori opuse pe roată) creează contrast și energie, în timp ce schemele analoage aduc un sentiment de calm.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Schema Complementară',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O schemă de culori complementară utilizează nuanțe aflate una lângă alta pe roata culorilor.',
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
          title: 'Capitolul 3: Iluminatul',
          description: 'Lumina ambientală, de accent și de lucru.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Straturile de lumină',
              content: '# Atmosfera camerei\nUn design reușit folosește trei straturi de iluminat: ambiental (general), de lucru (functional) și de accent (pentru a evidenția arhitectura sau arta).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Iluminat',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tipul de iluminat folosit pentru a evidenția o operă de artă sau o textură murală?',
                  order_index: 0,
                  options: [
                    { text: 'Ambiental', is_correct: false, order_index: 0 },
                    { text: 'De accent', is_correct: true, order_index: 1 },
                    { text: 'De lucru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Stiluri de Amenajare: De la Clasic la Modern',
      description: 'Cum să recunoști și să aplici principalele stiluri arhitecturale de interior.',
      category: 'Design de Interior',
      image_url: 'https://picsum.photos/seed/interiordesign2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Stilul Minimalist',
          description: 'Less is more.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Filozofia Minimalistă',
              content: '# Simplitatea Formelor\nMinimalismul se bazează pe principiul "less is more", folosind linii curate, palete de culori neutre și eliminând detaliile inutile pentru a crea un spațiu aerisit.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Elementele Minimalismului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce principiu descrie cel mai bine stilul minimalist?',
                  order_index: 0,
                  options: [
                    { text: 'More is more', is_correct: false, order_index: 0 },
                    { text: 'Less is more', is_correct: true, order_index: 1 },
                    { text: 'Form follows emotion', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Stilul Industrial',
          description: 'Cărămida aparentă și elementele brute.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Materiale și Texturi',
              content: '# Estetica Lofturilor\nStilul industrial se inspiră din fabricile vechi, lăsând la vedere elemente structurale precum țevi, grinzi, cărămidă aparentă și folosind mult metal, lemn brut și beton.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Stilul Industrial',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Stilul industrial ascunde de obicei țevile și elementele structurale în spatele pereților falși.',
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
          title: 'Capitolul 3: Stilul Scandinav',
          description: 'Hygge și funcționalitatea caldă.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Lumina și Confortul',
              content: '# Conceptul Hygge\nDesignul scandinav combină utilitatea cu o estetică primitoare. Se bazează pe lumină naturală abundentă, lemn deschis la culoare și textile confortabile pentru a promova starea de bine.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Conceptul Hygge',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește conceptul danez care stă la baza stilului scandinav, axat pe confort, căldură și stare de bine?',
                  order_index: 0,
                  options: [
                    { text: 'Wabi-Sabi', is_correct: false, order_index: 0 },
                    { text: 'Hygge', is_correct: true, order_index: 1 },
                    { text: 'Lagom', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created interior design course 1:', course1.title);
    
    await course2.save();
    console.log('Created interior design course 2:', course2.title);

    console.log('Successfully created courses for Design de Interior!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
