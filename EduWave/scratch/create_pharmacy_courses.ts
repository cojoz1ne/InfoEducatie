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
        full_name: 'Prof. Farmacie',
        email: 'farmacie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Farmacologie Generală',
      description: 'Studiul acțiunii medicamentelor asupra organismului uman și reacțiile adverse.',
      category: 'Farmacie',
      image_url: 'https://picsum.photos/seed/pharmacy1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Farmacocinetica',
          description: 'Ce face organismul medicamentului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Absorbția și Distribuția',
              content: '# Traseul medicamentului\nFarmacocinetica studiază evoluția medicamentului în organism. Aceasta cuprinde fazele ADME: Absorbție (intrarea în sânge), Distribuție (ajungerea la țesuturi), Metabolizare (transformarea în ficat) și Excreție (eliminarea prin rinichi).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fazele ADME',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă litera "M" din acronimul ADME, specific farmacocineticii?',
                  order_index: 0,
                  options: [
                    { text: 'Medicamentație', is_correct: false, order_index: 0 },
                    { text: 'Metabolizare', is_correct: true, order_index: 1 },
                    { text: 'Menținere', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Farmacodinamia',
          description: 'Ce face medicamentul organismului.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Receptori și Efecte',
              content: '# Mecanismul de acțiune\nFarmacodinamia analizează modul în care medicamentul produce un efect, de obicei legându-se de receptori specifici din celule (acționând ca un agonist, care activează receptorul, sau antagonist, care îl blochează).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Agoniști și Antagoniști',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un medicament de tip antagonist are rolul de a bloca un receptor celular, împiedicând activarea acestuia.',
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
          title: 'Capitolul 3: Reacții Adverse',
          description: 'Efectele nedorite ale tratamentelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Toxicitatea',
              content: '# Balanța risc-beneficiu\nOrice substanță activă poate deveni toxică dacă doza este prea mare. Farmacovigilența se ocupă cu detectarea, evaluarea, înțelegerea și prevenirea efectelor adverse ale medicamentelor prescrise.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Farmacovigilența',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește știința care monitorizează și evaluează reacțiile adverse ale medicamentelor pentru a garanta siguranța pacienților?',
                  order_index: 0,
                  options: [
                    { text: 'Farmacocinetica', is_correct: false, order_index: 0 },
                    { text: 'Farmacovigilența', is_correct: true, order_index: 1 },
                    { text: 'Farmacognozia', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Botanică Farmaceutică',
      description: 'Studiul plantelor medicinale și al principiilor active de origine vegetală.',
      category: 'Farmacie',
      image_url: 'https://picsum.photos/seed/pharmacy2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Istoria Fitoterapiei',
          description: 'Plantele ca primă formă de medicină.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: De la vraci la știință',
              content: '# Vindecarea naturală\nÎnainte de sintetizarea chimică a medicamentelor, plantele erau singura sursă de tratament (fitoterapie). Chiar și azi, aproximativ 25% din medicamentele moderne sunt derivate direct sau indirect din plante.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Originea Medicamentelor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Aproximativ ce procent din medicamentele moderne au la bază principii active derivate din plante?',
                  order_index: 0,
                  options: [
                    { text: 'Aproape 0%', is_correct: false, order_index: 0 },
                    { text: 'În jur de 25%', is_correct: true, order_index: 1 },
                    { text: 'Peste 95%', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Principii Active',
          description: 'Substanțele care vindecă.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Alcaloizi și Flavonoide',
              content: '# Chimia plantelor\nPrincipiile active sunt compușii care dau plantei efectul terapeutic. Alcaloizii (ex. morfina, cofeina) au efecte puternice asupra sistemului nervos, în timp ce flavonoidele sunt recunoscute pentru proprietățile lor antioxidante.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Alcaloizii',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Morfina și cofeina fac parte din clasa de principii active numită alcaloizi.',
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
          title: 'Capitolul 3: Extracția și Prepararea',
          description: 'Obținerea medicamentului din plantă.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Tincturi și Infuzii',
              content: '# Metode de prelucrare\nPentru a extrage substanțele active, se folosesc diferite metode. Infuzia folosește apă fierbinte (pentru flori și frunze), decoctul implică fierberea (pentru rădăcini), iar macerarea produce tincturi folosind alcool.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Metode de Extracție',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește preparatul obținut prin extracția principiilor active din plante folosind alcoolul ca solvent?',
                  order_index: 0,
                  options: [
                    { text: 'Infuzie', is_correct: false, order_index: 0 },
                    { text: 'Tinctură', is_correct: true, order_index: 1 },
                    { text: 'Sirop', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created pharmacy course 1:', course1.title);
    
    await course2.save();
    console.log('Created pharmacy course 2:', course2.title);

    console.log('Successfully created courses for Farmacie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
