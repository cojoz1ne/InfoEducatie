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
        full_name: 'Prof. Zoologie',
        email: 'zoologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Zoologia Nevertebratelor: Lumea fără Coloană',
      description: 'Studiul celor mai numeroase și diverse organisme de pe Pământ: artropode, moluște, viermi și celenterate.',
      category: 'Zoologie',
      image_url: 'https://picsum.photos/seed/zoology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Clasificarea și Structura Artropodelor',
          description: 'Corpul segmentat și exoscheletul.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Exoscheletul de Chitină și Năpârlirea',
              content: '# Armura externă\nArtropodele (ex: insecte, păianjeni, crustacee) reprezintă peste 80% din speciile animale. Ele au picioare articulate și un exoschelet dur din chitină care le protejează corpul. Deoarece exoscheletul nu crește odată cu animalul, acesta trebuie îndepărtat periodic printr-un proces numit năpârlire (ecdiză).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Structura Artropodelor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Din ce substanță organică rezistentă este alcătuit exoscheletul protector al artropodelor?',
                  order_index: 0,
                  options: [
                    { text: 'Keratină', is_correct: false, order_index: 0 },
                    { text: 'Chitină', is_correct: true, order_index: 1 },
                    { text: 'Celuloză', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Moluștele',
          description: 'Organisme cu corp moale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Mantaua, Radula și Cochilia',
              content: '# Diversitatea moluștelor\nMoluștele (ex: melci, scoici, caracatițe) au corpul moale, ne-segmentat. Majoritatea au o cochilie calcaroasă protectoare secretată de un țesut numit manta. Multe folosesc o „limbă” zimțată numită radulă pentru a mărunți hrana.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Anatomia Moluștelor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Cochilia calcaroasă a unei moluște este secretată direct de un țesut muscular intern numit radulă.',
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
          title: 'Capitolul 3: Cefalopodele',
          description: 'Inteligența din adâncuri.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Cromatoforii și Camuflajul',
              content: '# Maeștrii deghizării\nCefalopodele (caracatițe, sepii) sunt cele mai inteligente nevertebrate, având un sistem nervos complex. Ele își pot schimba instantaneu culoarea și textura pielii folosind celule pigmentare speciale numite cromatofori, controlate direct de creier, pentru a se camufla sau a comunica.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cromatoforii',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numesc celulele speciale din pielea cefalopodelor care le permit deghizarea instantanee prin schimbarea culorii?',
                  order_index: 0,
                  options: [
                    { text: 'Melanocite', is_correct: false, order_index: 0 },
                    { text: 'Cromatofori', is_correct: true, order_index: 1 },
                    { text: 'Cloroplaste', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Zoologia Vertebratelor: De la Pești la Mamifere',
      description: 'Studiul structurilor anatomice, al fiziologiei și al comportamentului animalelor cu coloană vertebrală.',
      category: 'Zoologie',
      image_url: 'https://picsum.photos/seed/zoology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Adaptarea la Mediul Acvatic (Pești)',
          description: 'Respirația branhiară și linia laterală.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Scheletul Cartilaginos vs. Osos',
              content: '# Rechinii vs. Peștii Clasici\nPeștii se împart în pești cartilaginoși (Chondrichthyes, ex: rechini, pisici de mare - au schelet flexibil, nu au vezică înotătoare) și pești osoși (Osteichthyes - au schelet osos dur și vezică înotătoare pentru controlul flotabilității). Toți folosesc linia laterală pentru a simți vibrațiile apei.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fiziologia Peștilor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce organ senzorial specific permite peștilor să detecteze curenții de apă, presiunea și vibrațiile din jur?',
                  order_index: 0,
                  options: [
                    { text: 'Vezica înotătoare', is_correct: false, order_index: 0 },
                    { text: 'Linia laterală', is_correct: true, order_index: 1 },
                    { text: 'Branhiile', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Păsările și Zborul',
          description: 'Adaptări anatomice uimitoare.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Oasele Pneumatice și Sacii Aerieni',
              content: '# Fiziologia zborului\nZborul a impus adaptări extreme: transformarea membrelor anterioare în aripi, prezența penajului și, crucial, oasele pneumatice (oase goale pe dinăuntru, foarte ușoare). De asemenea, păsările au saci aerieni conectați la plămâni, care asigură un flux continuu de oxigen atât la inspirație, cât și la expirație.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Adaptări Păsări',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Oasele pneumatice ale păsărilor sunt grele și dense pentru a rezista la presiunea din timpul zborului de mare viteză.',
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
          title: 'Capitolul 3: Mamiferele și Homeotermia',
          description: 'Reglarea temperaturii și adaptarea terestră.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Glandele Mamare și Temperatura Constantă',
              content: '# Caracteristicile mamiferelor\nMamiferele sunt animale homeoterme (cu sânge cald, își mențin temperatura corpului constantă, indiferent de mediu). Caracteristicile lor unice includ prezența părului/blănii (izolație termică) și a glandelor mamare (femelele produc lapte pentru hrănirea puilor).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Caracteristici Mamifere',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele caracteristici este exclusivă și definitorie pentru clasa mamiferelor?',
                  order_index: 0,
                  options: [
                    { text: 'Capacitatea de a zbura', is_correct: false, order_index: 0 },
                    { text: 'Prezența glandelor mamare (producerea laptelui)', is_correct: true, order_index: 1 },
                    { text: 'Respirația pulmonară', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created zoology course 1:', course1.title);
    
    await course2.save();
    console.log('Created zoology course 2:', course2.title);

    console.log('Successfully created courses for Zoologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
