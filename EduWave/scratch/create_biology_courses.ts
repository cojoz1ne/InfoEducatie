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
        full_name: 'Prof. Biologie',
        email: 'biologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Biologie Celulară: Unitatea de Bază a Vieții',
      description: 'Explorează structura, funcțiile și procesele care au loc în celulele procariote și eucariote.',
      category: 'Biologie',
      image_url: 'https://picsum.photos/seed/biology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Celula Procariotă vs. Eucariotă',
          description: 'Asemănări și deosebiri între cele două mari tipuri de celule.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Structura Celulară',
              content: '# Nucleul vs. Nucleoidul\nPrincipala diferență între eucariote și procariote este prezența unui nucleu adevărat, delimitat de membrană, în cazul eucariotelor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Celule',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce organit lipsește din celula procariotă comparativ cu cea eucariotă?',
                  order_index: 0,
                  options: [
                    { text: 'Ribozomul', is_correct: false, order_index: 0 },
                    { text: 'Membrana plasmatică', is_correct: false, order_index: 1 },
                    { text: 'Nucleul individualizat', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Organitele Celulare',
          description: 'Fuziunea, respirația și digestia celulară.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Mitocondria',
              content: '# Uzina de energie\nMitocondria este considerată "uzina energetică" a celulei deoarece aici se desfășoară etapele esențiale ale respirației celulare pentru producerea ATP-ului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Producția de Energie',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Mitocondria este responsabilă pentru fotosinteză în celula animală.',
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
          title: 'Capitolul 3: Ciclul Celular și Mitoza',
          description: 'Cum se reproduc și cum se refac țesuturile.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Faze ale diviziunii',
              content: '# Profaza, Metafaza, Anafaza, Telofaza\nMitoza este procesul de diviziune celulară în care o celulă mamă se divide în două celule fiice identice din punct de vedere genetic.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Faze Celulare',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'În care fază a mitozei cromozomii se aliniază în centrul celulei (placa ecuatorială)?',
                  order_index: 0,
                  options: [
                    { text: 'Profază', is_correct: false, order_index: 0 },
                    { text: 'Anafază', is_correct: false, order_index: 1 },
                    { text: 'Metafază', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Anatomia și Fiziologia Umană',
      description: 'Studiul aprofundat al sistemelor corpului uman și al modului în care acestea interacționează.',
      category: 'Biologie',
      image_url: 'https://picsum.photos/seed/biology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Sistemul Digestiv',
          description: 'De la ingestie la absorbția nutrienților.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Digestia în Stomac',
              content: '# Sucul Gastric\nStomacul folosește acid clorhidric (HCl) și enzime, precum pepsina, pentru a iniția descompunerea proteinelor în peptide mai mici.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sucul Gastric',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce enzimă principală acționează în stomac pentru descompunerea proteinelor?',
                  order_index: 0,
                  options: [
                    { text: 'Amilaza', is_correct: false, order_index: 0 },
                    { text: 'Pepsina', is_correct: true, order_index: 1 },
                    { text: 'Lipaza', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Sistemul Respirator',
          description: 'Schimbul de gaze.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Alveolele Pulmonare',
              content: '# Schimbul Gazoș\nAlveolele sunt săculeți mici de aer unde are loc schimbul de oxigen și dioxid de carbon între plămâni și sânge.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Oxigenarea',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Schimbul de gaze (oxigen și dioxid de carbon) are loc în bronhii.',
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
          title: 'Capitolul 3: Sistemul Circulator',
          description: 'Inima și vasele de sânge.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Mica și Marea Circulație',
              content: '# Pomparea sângelui\nMica circulație transportă sângele de la inimă la plămâni pentru oxigenare, în timp ce marea circulație îl distribuie către restul corpului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Circulație',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Unde ajunge sângele oxigenat imediat ce părăsește plămânii înmica circulație?',
                  order_index: 0,
                  options: [
                    { text: 'Atriul drept', is_correct: false, order_index: 0 },
                    { text: 'Atriul stâng', is_correct: true, order_index: 1 },
                    { text: 'Ventriculul drept', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created biology course 1:', course1.title);
    
    await course2.save();
    console.log('Created biology course 2:', course2.title);

    console.log('Successfully created courses for Biologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
