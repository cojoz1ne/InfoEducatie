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
        full_name: 'Prof. Teatru',
        email: 'teatru@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Arta Actorului',
      description: 'Descoperă tehnicile fundamentale de actorie, dezvoltarea personajului și expresivitatea scenică.',
      category: 'Arte Dramatice & Teatru',
      image_url: 'https://images.unsplash.com/photo-1510515638166-508b9cd2c3e1?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Prezența Scenică',
          description: 'Elementele de bază ale spațiului scenic.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Spațiul și Corpul',
              content: '# Conștientizarea spațiului\nActorul trebuie să stăpânească spațiul în care joacă. Totul pornește de la postură, respirație și contactul vizual.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Mișcarea Scenică',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce este un element esențial pentru o prezență scenică puternică?',
                  order_index: 0,
                  options: [
                    { text: 'Memorarea perfectă a textului', is_correct: false, order_index: 0 },
                    { text: 'Controlul respirației și postura', is_correct: true, order_index: 1 },
                    { text: 'Costumația elaborată', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Tehnica Stanislavski',
          description: 'Sistemul care a revoluționat actoria modernă.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Memoria Afectivă',
              content: '# Construirea emoției\nStanislavski propunea folosirea memoriei afective pentru a retrăi emoții reale și a le transfera personajului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Memoria Emoțională',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Tehnica Stanislavski încurajează exagerarea emoțiilor pentru a impresiona publicul.',
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
          title: 'Capitolul 3: Improvizația',
          description: 'Reacția spontană și lucrul cu partenerul.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Regula "Da, și..."',
              content: '# Baza improvizației\nCea mai importantă regulă în improvizație este acceptarea ofertei partenerului ("Da") și adăugarea de informații noi ("și...").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reguli de Improvizație',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'În improvizație, respingerea ideii partenerului duce la:',
                  order_index: 0,
                  options: [
                    { text: 'Un conflict dramatic excelent', is_correct: false, order_index: 0 },
                    { text: 'Blocarea scenei (Blocking)', is_correct: true, order_index: 1 },
                    { text: 'Mai multă creativitate', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Istoria Teatrului',
      description: 'O călătorie prin evoluția teatrului, de la grecii antici până la teatrul contemporan.',
      category: 'Arte Dramatice & Teatru',
      image_url: 'https://images.unsplash.com/photo-1521405085354-94071ec26a41?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Teatrul Antic Grecesc',
          description: 'Începuturile artei dramatice.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Tragedia și Comedia',
              content: '# Originile\nTeatrul a apărut la vechii greci în cadrul festivalurilor dedicate zeului Dionysos. Tragedia a fost prima formă literară dramatică.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Originile Teatrului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Teatrul grecesc antic a apărut ca o sărbătoare dedicată zeului Apollo.',
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
          title: 'Capitolul 2: Teatrul Renașterii și Shakespeare',
          description: 'Epoca de aur a teatrului englez.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Teatrul Elisabetan',
              content: '# Globe Theatre\nTeatrul elisabetan a fost marcat de operele lui William Shakespeare, jucate în spații circulare în aer liber, precum The Globe.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Epoca lui Shakespeare',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numea celebrul teatru asociat cu William Shakespeare?',
                  order_index: 0,
                  options: [
                    { text: 'The Rose', is_correct: false, order_index: 0 },
                    { text: 'The Globe', is_correct: true, order_index: 1 },
                    { text: 'The Swan', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 3: Teatrul Absurdului',
          description: 'Curentul avangardist postbelic.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Eugen Ionescu și Samuel Beckett',
              content: '# Lipsa de sens\nTeatrul absurdului explorează alienarea umană, folosind un limbaj aparent ilogic. O piesă reprezentativă este "Așteptându-l pe Godot".',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Dramaturgii Absurdului',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cine a scris piesa "Așteptându-l pe Godot"?',
                  order_index: 0,
                  options: [
                    { text: 'Anton Cehov', is_correct: false, order_index: 0 },
                    { text: 'Samuel Beckett', is_correct: true, order_index: 1 },
                    { text: 'Eugen Ionescu', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created theatre course 1:', course1.title);
    
    await course2.save();
    console.log('Created theatre course 2:', course2.title);

    console.log('Successfully created complex courses for Arte Dramatice & Teatru!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
