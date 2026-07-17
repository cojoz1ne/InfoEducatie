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
        full_name: 'Prof. Cinema',
        email: 'cinema@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Istoria Cinematografiei',
      description: 'De la primele cadre mute până la blockbusterele moderne.',
      category: 'Cinema & Film',
      image_url: 'https://picsum.photos/seed/cinema1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Începuturile Filmului',
          description: 'Frații Lumière și Georges Méliès.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Prima Proiecție',
              content: '# Nașterea Cinematografului\nÎn 1895, Frații Lumière au organizat prima proiecție publică cu plată, marcând nașterea cinematografiei. S-a remarcat documentarul scurt "Ieșirea muncitorilor din uzina Lumière".',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Frații Lumière',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'În ce an a avut loc prima proiecție cinematografică publică a Fraților Lumière?',
                  order_index: 0,
                  options: [
                    { text: '1885', is_correct: false, order_index: 0 },
                    { text: '1895', is_correct: true, order_index: 1 },
                    { text: '1905', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Epoca de Aur a Hollywood-ului',
          description: 'Sistemul studiourilor.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Sistemul Studiourilor',
              content: '# Controlul total\nÎntre anii 1920 și 1960, "The Big Five" (marile studiouri de la Hollywood) controlau producția, distribuția și difuzarea filmelor, având actori pe contracte exclusive.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: The Big Five',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'În Epoca de Aur a Hollywood-ului, marile studiouri dețineau propriile lanțuri de cinematografe.',
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
          title: 'Capitolul 3: Cinematografia Modernă',
          description: 'Efectele speciale și CGI.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Revoluția Digitală',
              content: '# CGI (Computer Generated Imagery)\nFilme precum Jurassic Park și The Matrix au revoluționat modul în care se realizează efectele speciale, trecând de la machete practice la animație generată pe calculator.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tehnologii de Filmare',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tehnologia care folosește grafica generată pe calculator pentru efectele speciale din filme?',
                  order_index: 0,
                  options: [
                    { text: 'VFX Practic', is_correct: false, order_index: 0 },
                    { text: 'CGI', is_correct: true, order_index: 1 },
                    { text: 'Rotoscoping', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Scenaristică și Regie',
      description: 'Arta de a spune povești vizuale de impact.',
      category: 'Cinema & Film',
      image_url: 'https://picsum.photos/seed/cinema2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Structura Narativă',
          description: 'Arcul narativ și cele trei acte.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Structura în trei acte',
              content: '# Început, Mijloc, Sfârșit\nMajoritatea filmelor folosesc structura clasică în trei acte: Actul I (Expoziția), Actul II (Confruntarea/Desfășurarea acțiunii) și Actul III (Rezoluția).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Actele Scenariului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'În ce act are loc de obicei "Climaxul" (punctul culminant) al poveștii?',
                  order_index: 0,
                  options: [
                    { text: 'Actul I', is_correct: false, order_index: 0 },
                    { text: 'Actul II', is_correct: false, order_index: 1 },
                    { text: 'Actul III', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Limbajul Vizual',
          description: 'Încadraturi și mișcări de aparat.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Tipuri de cadre',
              content: '# De la plan general la detaliu\nUn regizor folosește planul general pentru a stabili locația, planul mediu pentru dialoguri și prim-planul (close-up) pentru a sublinia emoția personajului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Cadre',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Prim-planul (Close-up) este folosit în principal pentru a arăta peisajul și locația în care se află personajele.',
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
          title: 'Capitolul 3: Rolul Regizorului',
          description: 'Conducerea echipei și a actorilor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Viziunea Regizorală',
              content: '# Căpitanul navei\nRegizorul este responsabil de transpunerea scenariului în imagini. El coordonează departamentele de imagine, sunet, decoruri și îndrumă actorii (mise-en-scène).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Viziunea Creativă',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care termen franțuzesc este frecvent folosit pentru a descrie așezarea elementelor vizuale și a actorilor în fața camerei?',
                  order_index: 0,
                  options: [
                    { text: 'Montage', is_correct: false, order_index: 0 },
                    { text: 'Mise-en-scène', is_correct: true, order_index: 1 },
                    { text: 'Auteur', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created cinema course 1:', course1.title);
    
    await course2.save();
    console.log('Created cinema course 2:', course2.title);

    console.log('Successfully created courses for Cinema & Film!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
