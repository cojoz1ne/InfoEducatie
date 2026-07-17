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
        full_name: 'Prof. Fotografie',
        email: 'foto@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Bazele Fotografiei Digitale',
      description: 'Stăpânește aparatul foto: de la modul Auto la cel Manual (M).',
      category: 'Fotografie',
      image_url: 'https://picsum.photos/seed/photo1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Triunghiul Expunerii',
          description: 'Apertură, Timp de expunere, ISO.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Apertura (Diafragma)',
              content: '# Controlul luminii și adâncimii\nApertura reprezintă deschiderea obiectivului prin care intră lumina (ex: f/1.8, f/8). O apertură mare (număr f mic, ex. f/1.8) lasă să intre multă lumină și creează acel fundal blurat (bokeh), ideal pentru portrete.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Diafragma',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Dacă dorești să obții un fundal foarte neclar (blur / bokeh) în spatele subiectului tău, ce setare de diafragmă ar trebui să alegi?',
                  order_index: 0,
                  options: [
                    { text: 'f/1.4', is_correct: true, order_index: 0 },
                    { text: 'f/8', is_correct: false, order_index: 1 },
                    { text: 'f/22', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Timpul de expunere',
          description: 'Înghețarea mișcării.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Shutter Speed',
              content: '# Durata capturii\nTimpul de expunere reprezintă durata în care senzorul aparatului este expus la lumină. Pentru a îngheța o acțiune rapidă (ex: un sportiv alergând), ai nevoie de un timp scurt (ex: 1/1000 secunde).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Shutter Speed',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un timp de expunere lung (ex: 2 secunde) fără trepied va duce cel mai probabil la o imagine mișcată (blurată).',
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
          title: 'Capitolul 3: Sensibilitatea ISO',
          description: 'Fotografia în condiții de lumină slabă.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Zgomotul de imagine',
              content: '# Compromisul luminii\nISO reprezintă sensibilitatea senzorului la lumină. Un ISO mare (ex: 3200) te ajută să faci poze pe întuneric, dar cu prețul apariției "zgomotului" de imagine (granulației).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: ISO și Granulația',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește efectul nedorit de "granulație" care apare pe o fotografie atunci când folosim valori ISO foarte mari?',
                  order_index: 0,
                  options: [
                    { text: 'Vignetare', is_correct: false, order_index: 0 },
                    { text: 'Zgomot de imagine', is_correct: true, order_index: 1 },
                    { text: 'Aberație cromatică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Compoziția și Arta Vizuală',
      description: 'Reguli de estetică pentru a transforma o poză banală într-o operă de artă.',
      category: 'Fotografie',
      image_url: 'https://picsum.photos/seed/photo2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Regula Treimilor',
          description: 'Poziționarea subiectului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Intersecțiile de interes',
              content: '# Grila imaginativă\nRegula treimilor împarte imaginea cu două linii orizontale și două verticale. Plasarea punctelor de interes ale fotografiei (ex: ochii subiectului) pe aceste linii sau la intersecția lor face imaginea mult mai dinamică decât plasarea fix pe centru.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Regula Treimilor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce presupune "Regula treimilor" în compoziția fotografică?',
                  order_index: 0,
                  options: [
                    { text: 'Plasarea subiectului mereu în centrul absolut al imaginii', is_correct: false, order_index: 0 },
                    { text: 'Plasarea subiectului pe una dintre liniile (sau intersecțiile) unei grile 3x3', is_correct: true, order_index: 1 },
                    { text: 'Folosirea a doar trei culori dominante în cadru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Linii Conducătoare',
          description: 'Ghidarea privirii.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Perspectiva Liniară',
              content: '# Atragerea ochiului în adâncime\nLiniile conducătoare (leading lines) folosesc elemente naturale sau arhitecturale din cadru (ex: un drum, o cale ferată, un gard) pentru a ghida privirea spectatorului direct către subiectul principal.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Linii Conducătoare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Liniile conducătoare au scopul de a deruta privitorul și de a ascunde subiectul principal al fotografiei.',
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
          title: 'Capitolul 3: Încadrare și Planuri',
          description: 'Povești cu profunzime.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Prim-plan și Fundal',
              content: '# Cadru în cadru\nFolosirea unui element în prim-plan (Foreground) creează un sentiment de adâncime și tridimensionalitate. Tehnica "cadru în cadru" folosește elemente (ca ferestre, ramuri de copaci) pentru a "încadra" vizual subiectul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Profunzime',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tehnica de compoziție care folosește elemente fizice (ferestre, uși, crengi) la marginea imaginii pentru a "închide" subiectul în interior?',
                  order_index: 0,
                  options: [
                    { text: 'Vignetare', is_correct: false, order_index: 0 },
                    { text: 'Cadru în cadru', is_correct: true, order_index: 1 },
                    { text: 'Macro', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created photography course 1:', course1.title);
    
    await course2.save();
    console.log('Created photography course 2:', course2.title);

    console.log('Successfully created courses for Fotografie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
