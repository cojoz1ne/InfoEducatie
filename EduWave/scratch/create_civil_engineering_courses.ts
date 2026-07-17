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
        full_name: 'Prof. Inginerie Civilă',
        email: 'constructii@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Rezistența Materialelor',
      description: 'Studiul forțelor interne și deformărilor din structurile de construcții.',
      category: 'Inginerie Civilă',
      image_url: 'https://picsum.photos/seed/civil1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Tensiune și Deformație',
          description: 'Cum răspund materialele la sarcini.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Legea lui Hooke',
              content: '# Domeniul Elastic\nLegea lui Hooke stipulează că, în domeniul elastic al unui material, deformarea (alungirea sau scurtarea) este direct proporțională cu forța (tensiunea) aplicată. Dacă forța este îndepărtată, materialul revine la forma inițială.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Legea lui Hooke',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce comportament descrie "domeniul elastic" al unui material conform Legii lui Hooke?',
                  order_index: 0,
                  options: [
                    { text: 'Materialul se rupe imediat la aplicarea forței', is_correct: false, order_index: 0 },
                    { text: 'Materialul revine la forma inițială după încetarea forței', is_correct: true, order_index: 1 },
                    { text: 'Materialul se deformează permanent, ireversibil', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Eforturi Secționale',
          description: 'Încovoiere, Tăiere și Torsiune.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Momentul Încovoietor',
              content: '# Flambajul grinzilor\nCând o grindă orizontală suportă o greutate (ex: un planșeu), ea este supusă încovoierii. Partea superioară a grinzii se comprimă, iar partea inferioară se întinde (este supusă la tracțiune).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Încovoierea Grinzilor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Atunci când o grindă simplu rezemată este încărcată gravitațional în mijloc, partea ei inferioară este supusă exclusiv la eforturi de compresiune.',
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
          title: 'Capitolul 3: Betonul Armat',
          description: 'Sinergia perfectă din construcții.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Rolul Armăturii',
              content: '# De ce combinăm betonul cu oțelul?\nBetonul simplu este excelent la preluarea forțelor de compresiune, dar este foarte casant la întindere (tracțiune). Oțelul (armătura) este introdus exact în zonele întinse ale structurii (de ex. la baza grinzii) pentru a prelua aceste eforturi și a preveni ruperea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Beton Armat',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de eforturi (forțe) este menit să preia oțelul (armătura) într-un element din beton armat?',
                  order_index: 0,
                  options: [
                    { text: 'Compresiune', is_correct: false, order_index: 0 },
                    { text: 'Întindere (Tracțiune)', is_correct: true, order_index: 1 },
                    { text: 'Forfecare pură', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Geotehnică și Fundații',
      description: 'Cum interacționează structurile cu terenul pe care sunt construite.',
      category: 'Inginerie Civilă',
      image_url: 'https://picsum.photos/seed/civil2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Clasificarea Pământurilor',
          description: 'Pietriș, Nisip, Praf, Argilă.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Granulometria',
              content: '# Tipuri de soluri\nComportamentul terenului depinde de mărimea particulelor. Pământurile necoezive (pietriș, nisip) permit apei să treacă ușor, în timp ce pământurile coezive (argilele) rețin apa, se umflă și pot deveni instabile la construcție.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Pământ',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de sol este cunoscut pentru proprietatea sa de a reține apa și de a prezenta fenomene de umflare/contracție (coeziune ridicată)?',
                  order_index: 0,
                  options: [
                    { text: 'Pietrișul', is_correct: false, order_index: 0 },
                    { text: 'Argila', is_correct: true, order_index: 1 },
                    { text: 'Nisipul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Capacitatea Portantă',
          description: 'Cât poate susține pământul.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Presiunea pe talpa fundației',
              content: '# Tasarea\nCapacitatea portantă este presiunea maximă pe care o fundație o poate transfera solului fără a provoca o cedare (rupere a pământului) sau o tasare (scufundare) excesivă care ar crăpa clădirea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tasarea',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O fundație bine proiectată va garanta o tasare (scufundare) absolut zero a clădirii pe durata vieții acesteia.',
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
          title: 'Capitolul 3: Tipuri de Fundații',
          description: 'Fundații de suprafață vs. de adâncime.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Piloții Forați',
              content: '# Când solul de la suprafață e slab\nDacă terenul bun (capabil să susțină clădirea) se află la mare adâncime (ex: în zone mlăștinoase), se folosesc fundații indirecte, cum ar fi piloții. Aceștia sunt practic stâlpi introduși adânc în pământ pentru a transfera greutatea la un strat de rocă dură.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fundații de Adâncime',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numesc elementele structurale de adâncime, folosite pentru a transfera greutatea unei clădiri către straturile dure aflate mult sub nivelul solului?',
                  order_index: 0,
                  options: [
                    { text: 'Radiere', is_correct: false, order_index: 0 },
                    { text: 'Piloți', is_correct: true, order_index: 1 },
                    { text: 'Grinzi de fundare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created civil course 1:', course1.title);
    
    await course2.save();
    console.log('Created civil course 2:', course2.title);

    console.log('Successfully created courses for Inginerie Civilă!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
