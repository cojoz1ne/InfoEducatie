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
        full_name: 'Prof. Arte',
        email: 'arte@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Pictură și Culoare',
      description: 'Învață bazele compoziției, teoria culorilor și tehnici esențiale de pictură pe pânză.',
      category: 'Arte Vizuale',
      image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Teoria Culorilor',
          description: 'Cum să amesteci și să înțelegi roata culorilor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Culorile Primare și Secundare',
              content: '# Roata Culorilor\nCulorile primare (roșu, galben, albastru) nu pot fi obținute prin amestec, dar sunt baza pentru culorile secundare (portocaliu, verde, violet).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Roata Culorilor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce culori trebuie amestecate pentru a obține culoarea verde?',
                  order_index: 0,
                  options: [
                    { text: 'Roșu și Galben', is_correct: false, order_index: 0 },
                    { text: 'Galben și Albastru', is_correct: true, order_index: 1 },
                    { text: 'Roșu și Albastru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Compoziția',
          description: 'Regula treimilor și echilibrul vizual.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Regula Treimilor',
              content: '# Echilibrul Visual\nÎmparte pânza imaginar în 9 pătrate egale folosind linii intersectate. Punctele de intersecție sunt zonele ideale pentru subiectul principal.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Poziționarea Subiectului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Subiectul principal trebuie să fie plasat exact în centrul tabloului pentru a fi plăcut ochiului.',
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
          title: 'Capitolul 3: Tehnici de Pensulație',
          description: 'Impasto, laviu și pensula uscată.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Tehnica Impasto',
              content: '# Textură tridimensională\nImpasto implică aplicarea vopselei (adesea ulei sau acrilic) într-un strat foarte gros, adăugând o calitate texturală lucrării (ex. Vincent van Gogh).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tehnici speciale',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tehnica aplicării unui strat gros de vopsea pentru a crea textură?',
                  order_index: 0,
                  options: [
                    { text: 'Laviu', is_correct: false, order_index: 0 },
                    { text: 'Sfumato', is_correct: false, order_index: 1 },
                    { text: 'Impasto', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Fotografia Digitală - De la Începător la Avansat',
      description: 'Stăpânește aparatul foto DSLR/Mirrorless, compoziția și editarea de bază.',
      category: 'Arte Vizuale',
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Triunghiul Expunerii',
          description: 'ISO, Diafragmă și Timp de expunere.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Diafragma (Aperture)',
              content: '# Profunzimea de câmp\nDiafragma controlează cantitatea de lumină care intră prin obiectiv, dar și fundalul încețoșat (bokeh). O valoare mică (ex. f/1.8) izolează subiectul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reglajele Camerei',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce parametru controlează înghețarea sau estomparea mișcării?',
                  order_index: 0,
                  options: [
                    { text: 'ISO', is_correct: false, order_index: 0 },
                    { text: 'Timpul de expunere (Shutter Speed)', is_correct: true, order_index: 1 },
                    { text: 'Balansul de alb (White Balance)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Lumina în Fotografie',
          description: 'Golden hour și direcția luminii.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Ora de Aur (Golden Hour)',
              content: '# Magia Luminii\nOra de aur este perioada scurtă de după răsărit și înainte de apus, când lumina este moale, difuză și are o nuanță caldă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Lumină',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Lumina de la amiază (mijlocul zilei) este cea mai recomandată pentru portrete din cauza umbrelor dure.',
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
          title: 'Capitolul 3: Editare și Post-procesare',
          description: 'Bazele Lightroom și Photoshop.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: RAW vs. JPEG',
              content: '# Formate de fișier\nFormatul RAW stochează toate informațiile captate de senzor, permițând o flexibilitate mult mai mare la editare față de formatul JPEG.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Post-procesare',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care format este considerat a fi un "negativ digital" datorită cantității mari de date reținute?',
                  order_index: 0,
                  options: [
                    { text: 'PNG', is_correct: false, order_index: 0 },
                    { text: 'JPEG', is_correct: false, order_index: 1 },
                    { text: 'RAW', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created visual arts course 1:', course1.title);
    
    await course2.save();
    console.log('Created visual arts course 2:', course2.title);

    console.log('Successfully created complex courses for Arte Vizuale!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
