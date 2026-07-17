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
        full_name: 'Prof. Medicină',
        email: 'medicina@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Anatomia Omului: Sistemul Cardiovascular',
      description: 'Studiul structurii și funcționării inimii și a vaselor de sânge.',
      category: 'Medicină & Sănătate',
      image_url: 'https://picsum.photos/seed/medicine1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Inima - Structură și Funcție',
          description: 'Camerele și valvele inimii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Atrii, Ventricule și Circulație',
              content: '# Pompa vieții\nInima omului are patru camere: două atrii (superioare) și două ventricule (inferioare). Sângele neoxigenat se întoarce la atriul drept, trece în ventriculul drept și este pompat către plămâni. Sângele oxigenat revine în atriul stâng, trece în ventriculul stâng și este pompat în tot corpul prin aortă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Camerele Inimii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care cameră a inimii pompează sângele oxigenat în artera aortă către întregul corp?',
                  order_index: 0,
                  options: [
                    { text: 'Ventriculul drept', is_correct: false, order_index: 0 },
                    { text: 'Ventriculul stâng', is_correct: true, order_index: 1 },
                    { text: 'Atriul stâng', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Vasele de Sânge',
          description: 'Artere, vene și capilare.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Presiunea și Fluxul Sanguin',
              content: '# Structuri vasculare\nArterele transportă sângele sub presiune ridicată de la inimă în corp, având pereți groși și elastici. Venele readuc sângele la inimă sub presiune joasă, având valve semilunare pentru a preveni refluxul. Capilarele sunt cele mai mici vase, unde au loc schimburile de nutrienți și gaze.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Vase',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Venele au valve interne care ajută la prevenirea refluxului sângelui înapoi sub acțiunea gravitației.',
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
          title: 'Capitolul 3: Ciclul Cardiac și ECG',
          description: 'Activitatea electrică a inimii.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Sistola și Diastola',
              content: '# Contracție și relaxare\nSistola reprezintă contracția camerelor inimii, când sângele este pompat în afară. Diastola reprezintă faza de relaxare, când camerele se umplu cu sânge. Electrocardiograma (ECG) măsoară impulsurile electrice declanșate de nodul sinoatrial (stimulatorul natural al inimii).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ciclul Cardiac',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește faza din ciclul cardiac în care inima se contractă pentru a pompa sângele în artere?',
                  order_index: 0,
                  options: [
                    { text: 'Diastolă', is_correct: false, order_index: 0 },
                    { text: 'Sistolă', is_correct: true, order_index: 1 },
                    { text: 'Aritmie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Prim Ajutor și Situații de Urgență',
      description: 'Manevre esențiale care pot salva vieți în caz de accident, stop cardiac sau sufocare.',
      category: 'Medicină & Sănătate',
      image_url: 'https://picsum.photos/seed/medicine2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Stopul Cardio-Respirator',
          description: 'Resuscitarea cardio-pulmonară (RCP).',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Algoritmul de Resuscitare',
              content: '# 30 de compresii, 2 ventilații\nDupă ce ai sunat la 112 și ai verificat că victima nu respiră, începe imediat compresiile toracice. Se apasă pe centrul sternului, la o adâncime de 5-6 cm, cu o frecvență de 100-120 de compresii pe minut. Raportul standard este de 30 de compresii urmate de 2 respirații artificiale.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Raportul RCP',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este raportul standard dintre compresiile toracice și ventilațiile artificiale în timpul resuscitării cardio-pulmonare la adulți?',
                  order_index: 0,
                  options: [
                    { text: '15 compresii și 5 respirații', is_correct: false, order_index: 0 },
                    { text: '30 de compresii și 2 respirații', is_correct: true, order_index: 1 },
                    { text: '50 de compresii și 1 respirație', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Obstrucția Căilor Aeriene',
          description: 'Sufocarea și Manevra Heimlich.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Aplicarea Manevrei Heimlich',
              content: '# Salvarea de la sufocare\nDacă o persoană conștientă se sufocă și nu poate tuși sau vorbi, poziționează-te în spatele ei. Pune pumnul deasupra ombilicului și dedesubtul sternului, prinde-l cu cealaltă mână și efectuează mișcări bruște spre interior și în sus.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Manevra Heimlich',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Manevra Heimlich trebuie aplicată doar dacă persoana afectată nu mai poate tuși eficient sau vorbi deloc.',
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
          title: 'Capitolul 3: Arsuri și Hemoragii',
          description: 'Primul ajutor în caz de traumatisme fizice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Controlul Sângerării și Răcirea Arsurilor',
              content: '# Intervenție rapidă\nÎn caz de hemoragie externă gravă, aplică presiune directă pe rană cu un pansament curat. În caz de arsură termică directă, răcește zona imediat cu apă rece de la robinet timp de cel puțin 10-15 minute. Nu aplica ulei, unt sau alte substanțe improvizate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tratarea Arsurilor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este prima măsură de prim ajutor recomandată în caz de arsură termică ușoară spre medie a pielii?',
                  order_index: 0,
                  options: [
                    { text: 'Aplicarea de unguente sau uleiuri', is_correct: false, order_index: 0 },
                    { text: 'Răcirea imediată cu apă curată rece timp de 10-15 minute', is_correct: true, order_index: 1 },
                    { text: 'Acoperirea strânsă cu un bandaj adeziv', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created medicine course 1:', course1.title);
    
    await course2.save();
    console.log('Created medicine course 2:', course2.title);

    console.log('Successfully created courses for Medicină & Sănătate!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
