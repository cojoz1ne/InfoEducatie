import mongoose from 'mongoose';
import Course from '../src/models/Course';
import User from '../src/models/User';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // First delete the previous ones so we don't duplicate
    await Course.deleteMany({
      title: { $in: ['Introducere în Managementul Afacerilor', 'Antreprenoriat și Start-up-uri'] }
    });
    console.log('Deleted old courses.');

    let teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      teacher = await User.findOne();
    }
    
    if (!teacher) {
      teacher = new User({
        full_name: 'Prof. Business',
        email: 'business@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Managementul Afacerilor',
      description: 'Acest curs oferă o bază solidă în principiile fundamentale ale managementului, planificării strategice și leadership-ului.',
      category: 'Afaceri & Management',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Concepte de Bază',
          description: 'Introducere în fundamentele managementului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Ce este Managementul?',
              content: '# Funcțiile Managementului\nManagementul presupune planificare, organizare, decizie și control. Este esențial în orice companie modernă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Fundamentele Managementului',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este prima funcție a managementului?',
                  order_index: 0,
                  options: [
                    { text: 'Planificarea', is_correct: true, order_index: 0 },
                    { text: 'Controlul', is_correct: false, order_index: 1 },
                    { text: 'Motivarea', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Leadership vs. Management',
          description: 'Află diferența între a conduce oameni și a gestiona procese.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Stiluri de Leadership',
              content: '# Tipuri de lideri\nUn manager bun nu este mereu un lider. Liderii inspiră, managerii coordonează. Vom discuta despre stilul autocratic, democratic și laissez-faire.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ești Lider sau Manager?',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un lider trebuie să fie întotdeauna autocratic pentru a avea succes.',
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
          title: 'Capitolul 3: Strategie Organizațională',
          description: 'Dezvoltarea planului pe termen lung.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Analiza SWOT',
              content: '# Instrumente de planificare\nAnaliza SWOT ne ajută să evaluăm Punctele Tari, Punctele Slabe, Oportunitățile și Amenințările dintr-un mediu de afaceri.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Testează-ți cunoștințele SWOT',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce literă din SWOT reprezintă elemente externe pozitive?',
                  order_index: 0,
                  options: [
                    { text: 'S (Strengths)', is_correct: false, order_index: 0 },
                    { text: 'W (Weaknesses)', is_correct: false, order_index: 1 },
                    { text: 'O (Opportunities)', is_correct: true, order_index: 2 },
                    { text: 'T (Threats)', is_correct: false, order_index: 3 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Antreprenoriat și Start-up-uri',
      description: 'Învață cum să îți transformi ideea într-o afacere de succes, de la validarea ideii până la obținerea finanțării.',
      category: 'Afaceri & Management',
      image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Validarea Ideii',
          description: 'Cum să știi dacă ideea ta este bună',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Nevoia și Soluția',
              content: 'Orice startup rezolvă o problemă. Dacă problema nu este presantă, startup-ul va eșua.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Evaluarea pieței',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Orice idee genială este automat și profitabilă.',
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
          title: 'Capitolul 2: Modelul de Afaceri',
          description: 'Cum vei genera venituri?',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Business Model Canvas',
              content: 'Acest instrument vizual te ajută să vezi pe o singură pagină partenerii cheie, activitățile, resursele și fluxurile de venit.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Planul de afaceri',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce segment din Canvas se concentrează pe cine cumpără produsul?',
                  order_index: 0,
                  options: [
                    { text: 'Structura costurilor', is_correct: false, order_index: 0 },
                    { text: 'Segmentele de clienți', is_correct: true, order_index: 1 },
                    { text: 'Partenerii cheie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 3: Finanțarea și Scalarea',
          description: 'Atragerea de capital.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Pitching pentru Investitori',
              content: 'Un pitch deck bun trebuie să conțină problema, soluția, mărimea pieței, echipa și ce sumă ceri.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Termeni financiari',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este principalul obiectiv al unui Angel Investor?',
                  order_index: 0,
                  options: [
                    { text: 'Finanțarea ideilor la început de drum', is_correct: true, order_index: 0 },
                    { text: 'Oferirea de împrumuturi bancare', is_correct: false, order_index: 1 },
                    { text: 'Cumpărarea de acțiuni la companii publice', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created complex course 1:', course1.title);
    
    await course2.save();
    console.log('Created complex course 2:', course2.title);

    console.log('Successfully created complex courses!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
