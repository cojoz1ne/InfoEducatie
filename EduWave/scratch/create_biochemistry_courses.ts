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
        full_name: 'Prof. Biochimie',
        email: 'biochimie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Fundamentele Biochimiei',
      description: 'Studiul substanțelor chimice și al proceselor vitale care au loc în organismele vii.',
      category: 'Biochimie',
      image_url: 'https://picsum.photos/seed/bio1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Proteinele',
          description: 'Cărămizile fundamentale ale vieții.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Aminoacizii',
              content: '# Structura Proteinelor\nProteinele sunt macromolecule formate din lanțuri de aminoacizi. Există 20 de aminoacizi standard care intră în alcătuirea proteinelor umane.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Aminoacizii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Câți aminoacizi standard sunt utilizați pentru sinteza proteinelor la oameni?',
                  order_index: 0,
                  options: [
                    { text: '10', is_correct: false, order_index: 0 },
                    { text: '20', is_correct: true, order_index: 1 },
                    { text: '50', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Enzimele',
          description: 'Catalizatorii biologici.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Rolul Enzimelor',
              content: '# Accelerarea reacțiilor\nEnzimele sunt proteine care acționează ca și catalizatori biologici, micșorând energia de activare necesară pentru ca o reacție biochimică să aibă loc.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Catalizatori',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Enzimele sunt consumate în timpul reacțiilor chimice pe care le catalizează.',
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
          title: 'Capitolul 3: Glucidele',
          description: 'Principala sursă de energie a organismului.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Monozaharide și Polizaharide',
              content: '# Sursa de Energie\nGlucidele sunt clasificate în simple (monozaharide precum glucoza) și complexe (polizaharide precum amidonul sau glicogenul).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Carbohidrați',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele este un polizaharid?',
                  order_index: 0,
                  options: [
                    { text: 'Glucoza', is_correct: false, order_index: 0 },
                    { text: 'Fructoza', is_correct: false, order_index: 1 },
                    { text: 'Amidonul', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Genetica Moleculară și ADN-ul',
      description: 'Descoperă secretele codului genetic și modul în care informația este transmisă din generație în generație.',
      category: 'Biochimie',
      image_url: 'https://picsum.photos/seed/bio2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Structura ADN-ului',
          description: 'Dublul helix.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Baze Azotate',
              content: '# Alfabetul vieții\nADN-ul este format din 4 baze azotate: Adenină (A), Timină (T), Citozină (C) și Guanină (G). Adenina se leagă mereu cu Timina, iar Citozina cu Guanina.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Împerecherea Bazelor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cu ce bază azotată se leagă mereu Adenina (A) în structura ADN-ului?',
                  order_index: 0,
                  options: [
                    { text: 'Citozină (C)', is_correct: false, order_index: 0 },
                    { text: 'Timină (T)', is_correct: true, order_index: 1 },
                    { text: 'Guanină (G)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Replicarea ADN-ului',
          description: 'Cum se multiplică celulele.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Procesul de Replicare',
              content: '# Copierea fidelă\nReplicarea ADN-ului este procesul prin care molecula de ADN se dublează înaintea diviziunii celulare. Acest proces este semi-conservator.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Replicarea',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Replicarea ADN-ului este considerată un proces semi-conservator.',
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
          title: 'Capitolul 3: Sinteza Proteinelor',
          description: 'De la ADN la ARN și apoi la proteine.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Transcripția și Translația',
              content: '# Dogma Centrală\nInformația din ADN este transcrisă în ARN mesager (ARNm) în nucleu, iar apoi translatată în proteine cu ajutorul ribozomilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Transcripție',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care moleculă preia informația genetică din ADN și o duce la ribozomi?',
                  order_index: 0,
                  options: [
                    { text: 'ARN de transfer (ARNt)', is_correct: false, order_index: 0 },
                    { text: 'ARN mesager (ARNm)', is_correct: true, order_index: 1 },
                    { text: 'Polimeraza', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created biochemistry course 1:', course1.title);
    
    await course2.save();
    console.log('Created biochemistry course 2:', course2.title);

    console.log('Successfully created courses for Biochimie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
