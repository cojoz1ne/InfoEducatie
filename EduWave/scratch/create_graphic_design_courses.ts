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
        full_name: 'Prof. Design Grafic',
        email: 'graphic@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Fundamentele Designului Grafic',
      description: 'Învață bazele vizuale: tipografie, compoziție și teoria culorilor pentru a crea materiale de impact.',
      category: 'Design Grafic',
      image_url: 'https://picsum.photos/seed/graphic1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Principiile Compoziției',
          description: 'Cum să aranjezi elementele în pagină.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Ierarhia Vizuală',
              content: '# Ghidarea ochiului\nIerarhia vizuală folosește dimensiunea, culoarea și contrastul pentru a ghida privirea utilizatorului către cele mai importante elemente ale designului, în ordinea relevanței lor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Compoziție',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce instrument de design este folosit cel mai frecvent pentru a crea ierarhie vizuală, făcând un text să iasă în evidență față de restul?',
                  order_index: 0,
                  options: [
                    { text: 'Alinierea la stânga', is_correct: false, order_index: 0 },
                    { text: 'Contrastul (dimensiune sau culoare)', is_correct: true, order_index: 1 },
                    { text: 'Textura de fundal', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Teoria Culorilor în Design',
          description: 'Cum comunică culorile.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: CMYK vs RGB',
              content: '# Print vs Digital\nSistemul RGB (Roșu, Verde, Albastru) este folosit pentru mediile digitale (ecrane), în timp ce CMYK (Cyan, Magenta, Galben, Negru) este standardul pentru materialele tipărite.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Modele de Culoare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Modelul CMYK este folosit în principal pentru designul adresat ecranelor și platformelor web.',
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
          title: 'Capitolul 3: Tipografia',
          description: 'Arta literelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Serif vs Sans-Serif',
              content: '# Alegerea fontului potrivit\nFonturile "Serif" au mici prelungiri decorative la capetele literelor (ex. Times New Roman) și oferă un aer clasic, pe când "Sans-Serif" (ex. Arial) sunt drepte și moderne.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fonturi Serif',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numesc fonturile care NU au acele mici prelungiri decorative la capetele literelor?',
                  order_index: 0,
                  options: [
                    { text: 'Script', is_correct: false, order_index: 0 },
                    { text: 'Sans-Serif', is_correct: true, order_index: 1 },
                    { text: 'Serif', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Branding și Identitate Vizuală',
      description: 'Cum să creezi un brand memorabil, de la logo la brandbook.',
      category: 'Design Grafic',
      image_url: 'https://picsum.photos/seed/graphic2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Designul de Logo',
          description: 'Simbolul unui brand.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Simplitate și Versatilitate',
              content: '# Rețeta unui logo de succes\nUn logo eficient trebuie să fie simplu, memorabil și versatil – adică să funcționeze la fel de bine atât alb-negru, cât și color, și la dimensiuni foarte mici sau pe panouri uriașe.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Calitățile unui Logo',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce caracteristică face ca un logo să poată fi printat clar pe un pix, dar și pe un panou stradal uriaș?',
                  order_index: 0,
                  options: [
                    { text: 'Complexitatea', is_correct: false, order_index: 0 },
                    { text: 'Versatilitatea (Scalabilitatea)', is_correct: true, order_index: 1 },
                    { text: 'Multitudinea de culori', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Ghidul de Brand (Brandbook)',
          description: 'Regulile de aur ale identității vizuale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Componentele Brandbook-ului',
              content: '# Coerența în comunicare\nUn brandbook documentează regulile stricte de utilizare a logo-ului, paleta de culori permisă, tipografia oficială și tonul vocii (tone of voice), asigurând o prezență constantă a brandului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Scopul Brandbook-ului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Scopul principal al unui brandbook este de a permite oricui să modifice culorile logo-ului după preferințe.',
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
          title: 'Capitolul 3: Arhetipurile de Brand',
          description: 'Personalitatea din spatele vizualului.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Cele 12 Arhetipuri',
              content: '# Conectarea emoțională\nCarl Jung a propus 12 arhetipuri (ex: Eroul, Magicianul, Rebelul) pe care brandurile le adoptă pentru a crea o conexiune emoțională puternică și a avea o personalitate recunoscută de public.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Arhetipuri',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește psihologul care a introdus conceptul celor 12 arhetipuri, folosite astăzi în branding?',
                  order_index: 0,
                  options: [
                    { text: 'Sigmund Freud', is_correct: false, order_index: 0 },
                    { text: 'Carl Jung', is_correct: true, order_index: 1 },
                    { text: 'B.F. Skinner', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created graphic design course 1:', course1.title);
    
    await course2.save();
    console.log('Created graphic design course 2:', course2.title);

    console.log('Successfully created courses for Design Grafic!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
