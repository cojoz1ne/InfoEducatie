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
        full_name: 'Prof. Franceză',
        email: 'franceza@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Franceză pentru Începători (A1-A2)',
      description: 'Învață vocabularul de bază și formulele esențiale de politețe în limba franceză.',
      category: 'Limba Franceză',
      image_url: 'https://picsum.photos/seed/french1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Saluturi și Prezentări',
          description: 'Cum să te prezinți.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Bonjour et Au revoir',
              content: '# Politețea franceză\nÎn Franța, salutul este foarte important. Folosim "Bonjour" ziua și "Bonsoir" seara. Pentru a ne prezenta, spunem "Je m\'appelle..." (Eu mă numesc...). Dacă întâlnim pe cineva formal, adăugăm "Enchanté(e)" (Încântat/ă).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Salutul Formal',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se spune "Bună seara" în limba franceză?',
                  order_index: 0,
                  options: [
                    { text: 'Bonjour', is_correct: false, order_index: 0 },
                    { text: 'Bonsoir', is_correct: true, order_index: 1 },
                    { text: 'Bonne nuit', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Verbele de Bază',
          description: 'A fi și A avea.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Être et Avoir',
              content: '# Cele mai folosite verbe\nVerbul "être" (a fi): Je suis, tu es, il/elle est. Verbul "avoir" (a avea): J\'ai, tu as, il/elle a. Atenție la pronunție și la eliziunea "J\'ai" (în loc de "Je ai").',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Verbul Être',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Forma corectă pentru "Eu sunt" în limba franceză este "Je suis".',
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
          title: 'Capitolul 3: La Cumpărături',
          description: 'Vocabular util în magazin.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Numere și Prețuri',
              content: '# Cât costă?\nPentru a întreba cât costă un produs, spunem "Combien ça coûte?". Este esențial să cunoaștem numerele de bază și cuvintele "s\'il vous plaît" (vă rog) și "merci" (mulțumesc).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Prețul',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum întrebi "Cât costă?" în limba franceză?',
                  order_index: 0,
                  options: [
                    { text: 'Comment ça va?', is_correct: false, order_index: 0 },
                    { text: 'Combien ça coûte?', is_correct: true, order_index: 1 },
                    { text: 'Où est la gare?', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Gramatică Intermediară (B1-B2)',
      description: 'Aprofundează timpurile trecute și exprimarea opiniilor.',
      category: 'Limba Franceză',
      image_url: 'https://picsum.photos/seed/french2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Trecutul Compus',
          description: 'Le Passé Composé.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Auxiliarele Avoir și Être',
              content: '# Formarea trecutului\n"Passé Composé" se folosește pentru acțiuni terminate în trecut. Se formează din verbul auxiliar (avoir sau être) conjugat la prezent + participiul trecut al verbului de conjugat (ex: "J\'ai mangé" - am mâncat, "Je suis allé" - am mers).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Passé Composé',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Majoritatea verbelor din limba franceză formează "Passé Composé" folosind care verb auxiliar?',
                  order_index: 0,
                  options: [
                    { text: 'Être (A fi)', is_correct: false, order_index: 0 },
                    { text: 'Avoir (A avea)', is_correct: true, order_index: 1 },
                    { text: 'Aller (A merge)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Imperfectul',
          description: 'L\'Imparfait.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Descrieri și Obiceiuri',
              content: '# Cadru și repetiție\nImperfectul este folosit pentru a descrie o situație din trecut (ex: "Il faisait beau" - era frumos) sau o acțiune repetitivă/obicei în trecut (ex: "Quand j\'étais petit, je jouais au foot" - Când eram mic, mă jucam fotbal).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Passé Composé vs Imparfait',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Pentru a descrie vremea din ziua de ieri (ex: "Ploua"), se folosește de obicei Passé Composé, nu Imparfait.',
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
          title: 'Capitolul 3: Modul Subjonctiv',
          description: 'Le Subjonctif.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Dorințe, Îndoieli și Obligații',
              content: '# O latură subiectivă\nSubjonctivul nu exprimă o certitudine, ci un fapt privit prin prisma unui sentiment, a unei voințe sau a unei îndoieli. Se folosește foarte des după expresia "Il faut que..." (Trebuie ca...).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Subjonctivul',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce stare sau atitudine exprimă de regulă modul Subjonctiv în limba franceză?',
                  order_index: 0,
                  options: [
                    { text: 'O certitudine absolută (fapt real)', is_correct: false, order_index: 0 },
                    { text: 'O dorință, obligație sau îndoială', is_correct: true, order_index: 1 },
                    { text: 'O acțiune care s-a încheiat clar în trecut', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created french course 1:', course1.title);
    
    await course2.save();
    console.log('Created french course 2:', course2.title);

    console.log('Successfully created courses for Limba Franceză!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
