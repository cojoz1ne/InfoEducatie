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
        full_name: 'Prof. Muzică',
        email: 'muzica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Teoria Muzicii pentru Începători',
      description: 'Învață cum să citești notele muzicale, să înțelegi ritmul și să descifrezi o partitură.',
      category: 'Muzică',
      image_url: 'https://picsum.photos/seed/music1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Notele Muzicale și Portativul',
          description: 'Alfabetul muzicii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Cheia Sol și Portativul',
              content: '# Citirea partiturilor\nPortativul are 5 linii și 4 spații, numărate de jos în sus. Notele se plasează pe linii și în spații. Cheia Sol se așază la începutul portativului și stabilește nota Sol pe linia a doua. De acolo, notele urcă în ordine: Sol, La, Si, Do, Re...',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cheia Sol',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Pe ce linie a portativului se fixează nota Sol prin prezența Cheii Sol?',
                  order_index: 0,
                  options: [
                    { text: 'Prima linie', is_correct: false, order_index: 0 },
                    { text: 'A doua linie', is_correct: true, order_index: 1 },
                    { text: 'A treia linie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Ritm și Durate',
          description: 'Timpul în muzică.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Nota întreagă, Doimea și Pătrimea',
              content: '# Valorile notelor\nDurata unei note stabilește cât timp sună aceasta. Nota întreagă are 4 timpi. Doimea are 2 timpi (jumătate dintr-o notă întreagă). Pătrimea are 1 timp. Optimea are o jumătate de timp, iar șaisprezecimea un sfert de timp.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Durate de timp',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O doime (ca valoare de notă) durează mai mult timp decât o pătrime.',
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
          title: 'Capitolul 3: Acorduri și Armonie',
          description: 'Construirea acordurilor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Triada Majoră și Minoră',
              content: '# Bazele armoniei\nUn acord se formează prin cântarea simultană a cel puțin trei note diferite. Cel mai simplu acord este triada, formată din Fundamentala, Terța (care dă caracterul major - vesel, sau minor - trist) și Cvinta acordului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Acorduri',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce interval determină dacă o triadă (un acord de 3 note) sună vesel (major) sau trist (minor)?',
                  order_index: 0,
                  options: [
                    { text: 'Cvinta', is_correct: false, order_index: 0 },
                    { text: 'Terța', is_correct: true, order_index: 1 },
                    { text: 'Octava', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Istoria Muzicii: De la Bach la Rock',
      description: 'Călătorește prin epocile muzicii occidentale pentru a înțelege cum a evoluat arta sunetelor.',
      category: 'Muzică',
      image_url: 'https://picsum.photos/seed/music2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Epoca Barocă',
          description: 'Polifonia și complexitatea.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Johann Sebastian Bach',
              content: '# Geniul baroc\nMuzica barocă (aprox. 1600-1750) se caracterizează prin texturi polifonice complexe și utilizarea clavecinului. J.S. Bach este figura centrală a acestei epoci, faimos pentru fugile și suitele sale perfect structurate matematic.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Muzica Barocă',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următorii compozitori este considerat titanul și figura centrală a epocii Barocului?',
                  order_index: 0,
                  options: [
                    { text: 'Ludwig van Beethoven', is_correct: false, order_index: 0 },
                    { text: 'Johann Sebastian Bach', is_correct: true, order_index: 1 },
                    { text: 'Wolfgang Amadeus Mozart', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Clasicismul Muzical',
          description: 'Claritate, ordine și simetrie.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Mozart și Formele Clasice',
              content: '# Viena, centrul muzical\nClasicismul (aprox. 1750-1820) aduce o muzică mai curată, bazată pe melodii memorabile și simetrie structurală (cum ar fi Forma de Sonată). Wolfgang Amadeus Mozart este cel mai strălucit reprezentant, compunând simfonii, concerte și opere remarcabile.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Clasicism',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Clasicismul muzical pune accent pe o polifonie extrem de încărcată și complexă, abandonând melodia simplă și clară.',
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
          title: 'Capitolul 3: Nașterea Rock\'n\'Roll-ului',
          description: 'Revoluția electrică a secolului XX.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Blues-ul și chitara electrică',
              content: '# Anii \'50 și Elvis Presley\nRock\'n\'Roll-ul a apărut în SUA, combinând elemente de Rhythm and Blues (R&B) afro-american cu muzica Country. Popularizarea chitării electrice și apariția unor artiști rebeli precum Elvis Presley sau Chuck Berry au schimbat definitiv cultura globală.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Rock\'n\'Roll',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce instrument muzical electrificat a devenit simbolul și nucleul muzicii Rock\'n\'Roll?',
                  order_index: 0,
                  options: [
                    { text: 'Pianul', is_correct: false, order_index: 0 },
                    { text: 'Chitara electrică', is_correct: true, order_index: 1 },
                    { text: 'Sintetizatorul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created music course 1:', course1.title);
    
    await course2.save();
    console.log('Created music course 2:', course2.title);

    console.log('Successfully created courses for Muzică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
