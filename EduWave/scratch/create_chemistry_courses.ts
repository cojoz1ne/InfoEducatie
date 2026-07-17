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
        full_name: 'Prof. Chimie',
        email: 'chimie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Chimia Generală: Atomi și Molecule',
      description: 'O introducere în structura materiei, tabelul periodic și legăturile chimice.',
      category: 'Chimie',
      image_url: 'https://picsum.photos/seed/chem1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Structura Atomului',
          description: 'Nucleul și învelișul de electroni.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Particule Subatomice',
              content: '# Protoni, Neutroni și Electroni\nAtomul este format dintr-un nucleu central care conține protoni (sarcină pozitivă) și neutroni (fără sarcină), înconjurat de un nor de electroni (sarcină negativă).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Nucleul Atomic',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce particule se găsesc în nucleul unui atom?',
                  order_index: 0,
                  options: [
                    { text: 'Electroni și protoni', is_correct: false, order_index: 0 },
                    { text: 'Protoni și neutroni', is_correct: true, order_index: 1 },
                    { text: 'Doar electroni', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Tabelul Periodic',
          description: 'Organizarea elementelor chimice.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Grupe și Perioade',
              content: '# Clasificarea lui Mendeleev\nTabelul periodic ordonează elementele după numărul atomic (Z). Coloanele verticale se numesc grupe, iar rândurile orizontale se numesc perioade.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Elementele Chimice',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Elementele din aceeași grupă a tabelului periodic au proprietăți chimice similare.',
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
          title: 'Capitolul 3: Legături Chimice',
          description: 'Cum se combină atomii.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Legătura Ionică și Covalentă',
              content: '# Formarea Moleculelor\nLegătura ionică implică transferul de electroni, în timp ce legătura covalentă presupune punerea în comun a perechilor de electroni între atomi nemetalici.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Legături',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește legătura chimică realizată prin punerea în comun a electronilor?',
                  order_index: 0,
                  options: [
                    { text: 'Ionică', is_correct: false, order_index: 0 },
                    { text: 'Covalentă', is_correct: true, order_index: 1 },
                    { text: 'Metalică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Chimia Organică: Compușii Carbonului',
      description: 'Studiul structurii, proprietăților și reacțiilor compușilor organici.',
      category: 'Chimie',
      image_url: 'https://picsum.photos/seed/chem2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Hidrocarburile Alifatice',
          description: 'Alcani, alchene și alchine.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Alcanii',
              content: '# Hidrocarburi Saturate\nAlcanii sunt hidrocarburi aciclice saturate, având doar legături simple carbon-carbon (C-C). Formula lor generală este CnH2n+2.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Formula Alcanilor',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este formula generală a alcanilor?',
                  order_index: 0,
                  options: [
                    { text: 'CnH2n', is_correct: false, order_index: 0 },
                    { text: 'CnH2n-2', is_correct: false, order_index: 1 },
                    { text: 'CnH2n+2', is_correct: true, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Hidrocarburi Aromatice',
          description: 'Benzenul și derivații săi.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Structura Benzenului',
              content: '# Inelul Aromatic\nBenzenul (C6H6) este cea mai simplă hidrocarbură aromatică, având o structură ciclică plană stabilizată de electronii delocalizați.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Formula Benzenului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Formula moleculară a benzenului este C6H6.',
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
          title: 'Capitolul 3: Compuși Organici cu Funcțiuni',
          description: 'Alcooli, acizi și esteri.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Grupa Hidroxil',
              content: '# Alcoolii\nAlcoolii sunt compuși organici care conțin grupa hidroxil (-OH) legată de un atom de carbon saturat. Metanolul și etanolul sunt cei mai cunoscuți.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Grupe Funcționale',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce grupă funcțională caracterizează alcoolii?',
                  order_index: 0,
                  options: [
                    { text: 'Grupa carboxil (-COOH)', is_correct: false, order_index: 0 },
                    { text: 'Grupa hidroxil (-OH)', is_correct: true, order_index: 1 },
                    { text: 'Grupa amino (-NH2)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created chemistry course 1:', course1.title);
    
    await course2.save();
    console.log('Created chemistry course 2:', course2.title);

    console.log('Successfully created courses for Chimie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
