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
        full_name: 'Prof. AI',
        email: 'ai@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Machine Learning Fundamentals',
      description: 'Cum învață calculatoarele din date, fără a fi programate explicit.',
      category: 'Inteligență Artificială',
      image_url: 'https://picsum.photos/seed/ai1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Învățarea Supervizată',
          description: 'Când algoritmul are un profesor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Clasificare vs. Regresie',
              content: '# Predicții din exemple\nÎn învățarea supervizată, modelul este antrenat pe un set de date etichetat (știm răspunsul corect). Dacă vrem să prezicem o categorie (ex: "spam" sau "not spam"), avem o problemă de Clasificare. Dacă vrem să prezicem o valoare numerică continuă (ex: prețul unei case), avem o problemă de Regresie.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Predicții',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tipul de problemă de învățare supervizată în care scopul este prezicerea unei valori numerice continue (cum ar fi temperatura de mâine)?',
                  order_index: 0,
                  options: [
                    { text: 'Clasificare', is_correct: false, order_index: 0 },
                    { text: 'Regresie', is_correct: true, order_index: 1 },
                    { text: 'Grupare (Clustering)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Învățarea Nesupervizată',
          description: 'Găsirea de tipare ascunse.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Clustering (Grupare)',
              content: '# Date fără etichetă\nÎn învățarea nesupervizată, datele nu au răspunsuri atașate. Algoritmul (ex: K-Means) încearcă să găsească singur structuri sau similarități, grupând datele în "clustere" (ex: segmentarea clienților în funcție de comportamentul de cumpărare).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Învățare Nesupervizată',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'În învățarea nesupervizată (cum ar fi clustering-ul), setul de date folosit pentru antrenament are deja etichete (răspunsuri corecte) atașate fiecărui exemplu.',
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
          title: 'Capitolul 3: Evaluarea Modelelor',
          description: 'Cât de bun este algoritmul tău?',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Overfitting (Supra-antrenare)',
              content: '# Memorare vs. Generalizare\nOverfitting-ul apare când un model "învață pe de rost" datele de antrenament, inclusiv zgomotul (erorile), devenind foarte exact pe acestea, dar eșuând lamentabil când este testat pe date noi, pe care nu le-a mai văzut.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Overfitting',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește fenomenul negativ în care un model de ML se potrivește perfect pe datele de antrenament, dar performează slab pe date noi?',
                  order_index: 0,
                  options: [
                    { text: 'Underfitting', is_correct: false, order_index: 0 },
                    { text: 'Overfitting', is_correct: true, order_index: 1 },
                    { text: 'Cross-validation', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Rețele Neuronale și Deep Learning',
      description: 'Arhitecturi inspirate de creierul uman, care stau la baza ChatGPT sau Midjourney.',
      category: 'Inteligență Artificială',
      image_url: 'https://picsum.photos/seed/ai2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Neuronul Artificial',
          description: 'Cărămida de bază.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Ponderi și Funcții de Activare',
              content: '# Perceptronul\nUn neuron artificial primește mai multe intrări, le înmulțește cu anumite greutăți (ponderi), le adună și trece rezultatul printr-o "funcție de activare" (ex: ReLU, Sigmoid) pentru a decide dacă "se activează" (transmite semnalul mai departe) sau nu.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Neuronul Artificial',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce rol are funcția de activare într-un neuron artificial?',
                  order_index: 0,
                  options: [
                    { text: 'Să genereze date de antrenament noi', is_correct: false, order_index: 0 },
                    { text: 'Să determine dacă neuronul trebuie să "tragă" (să transmită semnalul mai departe)', is_correct: true, order_index: 1 },
                    { text: 'Să șteargă ponderile din memorie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Arhitecturi Deep Learning',
          description: 'CNN-uri și imagini.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Rețele Convoluționale (CNN)',
              content: '# Viziunea artificială\nRețelele Neuronale Convoluționale (CNN) sunt arhitecturi specializate pe procesarea datelor tip grilă, cum ar fi imaginile. Ele folosesc "filtre" (convoluții) pentru a extrage caracteristici (ex: muchii, forme) înainte de a clasifica imaginea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Rețele Convoluționale',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Rețelele Neuronale Convoluționale (CNN) sunt folosite predominant pentru procesarea textului și recunoașterea vocală, nu pentru imagini.',
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
          title: 'Capitolul 3: Modele Generative',
          description: 'LLM-uri și AI Creativ.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Arhitectura Transformer',
              content: '# Atenția este tot ce ai nevoie\nIntrodusă în 2017, arhitectura "Transformer" (pe care se bazează LLM-urile precum GPT-4) a revoluționat AI-ul prin mecanismul de "atenție", care permite modelului să analizeze întregul context al unei propoziții simultan, nu doar cuvânt cu cuvânt.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Arhitectura Transformer',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce mecanism cheie a introdus arhitectura Transformer, permițând modelului să "cântărească" importanța diferitelor cuvinte dintr-un text?',
                  order_index: 0,
                  options: [
                    { text: 'Backpropagation', is_correct: false, order_index: 0 },
                    { text: 'Mecanismul de Atenție', is_correct: true, order_index: 1 },
                    { text: 'Dropout', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created ai course 1:', course1.title);
    
    await course2.save();
    console.log('Created ai course 2:', course2.title);

    console.log('Successfully created courses for Inteligență Artificială!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
