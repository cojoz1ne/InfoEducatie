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
        full_name: 'Prof. Teologie',
        email: 'teologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Religiile Lumii: O Perspectivă Comparată',
      description: 'Studiul marilor tradiții religioase ale lumii: Creștinismul, Islamul, Iudaismul, Hinduismul și Budismul.',
      category: 'Teologie & Religie',
      image_url: 'https://picsum.photos/seed/theology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Religiile Avraamice',
          description: 'Iudaismul, Creștinismul și Islamul.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Monoteismul și Patriarhul Avraam',
              content: '# Trăsături comune\nReligiile avraamice împărtășesc credința într-un singur Dumnezeu creator și îl recunosc pe Avraam ca figură centrală/patriarh. Iudaismul se bazează pe Tora, Creștinismul pe Noul Testament și pe figura lui Iisus Hristos, iar Islamul pe Coran și pe revelația transmisă Profetului Mohamed.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Monoteism',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care figură biblică este considerată patriarhul comun al Iudaismului, Creștinismului și Islamului?',
                  order_index: 0,
                  options: [
                    { text: 'Moise', is_correct: false, order_index: 0 },
                    { text: 'Avraam', is_correct: true, order_index: 1 },
                    { text: 'Noe', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Hinduismul și Ciclul Samsara',
          description: 'Karma, Dharma și Reîncarnarea.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Eliberarea sufletului (Moksha)',
              content: '# Legea cauzei și efectului\nHinduismul este una dintre cele mai vechi religii și nu are un fondator unic. Se bazează pe credința în Samsara (ciclul nesfârșit al renașterilor), guvernat de Karma (acțiunile noastre determină viața viitoare). Scopul final este Moksha – eliberarea sufletului și unirea cu absolutul (Brahman).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Samsara și Karma',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Samsara reprezintă starea de eliberare absolută și ieșire definitivă din ciclul reîncarnării în religia hinduistă.',
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
          title: 'Capitolul 3: Budismul și Cele Patru Adevăruri Nobile',
          description: 'Calea către Nirvana.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Învățăturile lui Siddhartha Gautama',
              content: '# Eliberarea de suferință\nFondat de Buddha (Siddhartha Gautama), budismul nu se concentrează pe un zeu creator, ci pe depășirea suferinței umane (Dukkha). Cele Patru Adevăruri Nobile arată că suferința provine din dorință și atașament, iar ea poate fi stinsă prin urmarea Căii cu Opt Brațe, atingându-se starea de Nirvana.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Budism',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește starea supremă de liniște, eliberare de suferință și iluminare din Budism?',
                  order_index: 0,
                  options: [
                    { text: 'Moksha', is_correct: false, order_index: 0 },
                    { text: 'Nirvana', is_correct: true, order_index: 1 },
                    { text: 'Samsara', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Introducere în Teologia Creștină',
      description: 'Studiul dogmelor fundamentale, al istoriei bisericești și al textelor sacre.',
      category: 'Teologie & Religie',
      image_url: 'https://picsum.photos/seed/theology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Canonul Scripturii și Evangheliile',
          description: 'Noul Testament.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Structura Bibliei și Evangheliile Sinoptice',
              content: '# Scrierile sfinte\nBiblia creștină combină Vechiul Testament (moștenit din iudaism) cu Noul Testament. Nucleul Noului Testament îl constituie cele patru Evanghelii (Matei, Marcu, Luca, Ioan) care relatează viața, învățăturile și învierea lui Iisus Hristos. Primele trei sunt numite sinoptice datorită structurii lor foarte asemănătoare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Evangheliile',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre cele patru Evanghelii canonice NU este considerată o evanghelie sinoptică din cauza stilului ei diferit și teologic distinct?',
                  order_index: 0,
                  options: [
                    { text: 'Marcu', is_correct: false, order_index: 0 },
                    { text: 'Ioan', is_correct: true, order_index: 1 },
                    { text: 'Luca', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Marea Schizmă din 1054',
          description: 'Divizarea dintre Răsărit și Apus.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Cauzele Rupturii',
              content: '# Ortodoxie și Catolicism\nÎn 1054, neînțelegerile teologice (cum ar fi disputa despre clauza „Filioque”) și cele legate de primatul papal au dus la Marea Schizmă. Biserica s-a divizat în Biserica Ortodoxă (în Răsărit, condusă spiritual de Patriarhul de la Constantinopol) și Biserica Romano-Catolică (în Apus, condusă de Papă).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Schizma din 1054',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Marea Schizmă din 1054 a dus la separarea definitivă a Bisericii în ramura Ortodoxă în Răsărit și ramura Romano-Catolică în Apus.',
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
          title: 'Capitolul 3: Reforma Protestantă',
          description: 'Sola Fide, Sola Scriptura.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Martin Luther și cele 95 de Teze',
              content: '# Revoluția religioasă a secolului XVI\nÎn 1517, călugărul Martin Luther a afișat cele 95 de teze pe ușa bisericii din Wittenberg, contestând vânzarea de indulgențe și corupția. Reforma a promovat principiile: Sola Scriptura (doar Biblia este autoritatea) și Sola Fide (mântuirea doar prin credință), dând naștere protestantismului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reforma Protestantă',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cine a declanșat Reforma Protestantă în Europa în anul 1517 prin publicarea celor 95 de teze?',
                  order_index: 0,
                  options: [
                    { text: 'Jean Calvin', is_correct: false, order_index: 0 },
                    { text: 'Martin Luther', is_correct: true, order_index: 1 },
                    { text: 'Henric al VIII-lea', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created theology course 1:', course1.title);
    
    await course2.save();
    console.log('Created theology course 2:', course2.title);

    console.log('Successfully created courses for Teologie & Religie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
