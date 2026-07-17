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
        full_name: 'Prof. Drept',
        email: 'drept@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Fundamentele Dreptului Civil',
      description: 'O introducere în regulile care guvernează relațiile dintre persoanele fizice și juridice.',
      category: 'Drept & Legislație',
      image_url: 'https://picsum.photos/seed/law1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Subiectele de Drept',
          description: 'Persoane fizice și persoane juridice.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Capacitatea Juridică',
              content: '# Capacitatea de folosință și de exercițiu\nCapacitatea de folosință reprezintă aptitudinea unei persoane de a avea drepturi și obligații (dobândită la naștere). Capacitatea de exercițiu reprezintă aptitudinea de a-și exercita aceste drepturi și de a-și asuma obligații prin acte proprii (deplină la 18 ani).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Capacitatea de Exercițiu',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'La ce vârstă se dobândește, de regulă, capacitatea de exercițiu deplină în sistemul juridic românesc?',
                  order_index: 0,
                  options: [
                    { text: '14 ani', is_correct: false, order_index: 0 },
                    { text: '18 ani', is_correct: true, order_index: 1 },
                    { text: '21 ani', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Teoria Obligațiilor',
          description: 'Contractele și răspunderea civilă.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Elementele Contractului',
              content: '# Consimțământ, Obiect, Cauză\nPentru ca un contract să fie valabil încheiat, acesta trebuie să îndeplinească anumite condiții esențiale: capacitatea de a contracta, consimțământul valabil al părților, un obiect determinat și licit, și o cauză morală.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Valabilitatea Contractului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Pentru ca un contract să fie valid, obiectul acestuia trebuie să fie determinat (sau cel puțin determinabil) și licit.',
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
          title: 'Capitolul 3: Drepturile Reale',
          description: 'Proprietatea și dezmembrămintele ei.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Dreptul de Proprietate',
              content: '# Posesie, Folosință, Dispoziție (Usus, Fructus, Abusus)\nDreptul de proprietate este dreptul real cel mai complet, conferind titularului său atributele de a poseda bunul, de a-i culege roadele și de a dispune de el (a-l vinde, dona, distruge).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Atributele Proprietății',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește atributul dreptului de proprietate care permite titularului să culeagă roadele (fructele) bunului respectiv?',
                  order_index: 0,
                  options: [
                    { text: 'Usus', is_correct: false, order_index: 0 },
                    { text: 'Fructus', is_correct: true, order_index: 1 },
                    { text: 'Abusus', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Dreptul Penal: Infracțiuni și Pedepse',
      description: 'Regulile privind faptele periculoase pentru societate și sancționarea lor.',
      category: 'Drept & Legislație',
      image_url: 'https://picsum.photos/seed/law2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Elementele Infracțiunii',
          description: 'Latura obiectivă și latura subiectivă.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Vinovăția',
              content: '# Intenție vs. Culpă\nPentru ca o faptă să constituie infracțiune, ea trebuie comisă cu vinovăție. Aceasta poate îmbrăca forma intenției (directe sau indirecte) sau a culpei (imprudență sau neglijență).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Forma Vinovăției',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește forma de vinovăție în care autorul prevede rezultatul faptei sale și urmărește producerea lui?',
                  order_index: 0,
                  options: [
                    { text: 'Culpă cu prevedere', is_correct: false, order_index: 0 },
                    { text: 'Intenție directă', is_correct: true, order_index: 1 },
                    { text: 'Intenție indirectă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Cauze care Înlătură Caracterul Penal',
          description: 'Legitima apărare și starea de necesitate.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Legitima Apărare',
              content: '# Proporționalitatea reacției\nLegitima apărare înlătură caracterul penal al faptei dacă este săvârșită pentru a respinge un atac material, direct, imediat și injust. Reacția celui care se apără trebuie să fie proporțională cu gravitatea atacului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Legitima Apărare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Legitima apărare justifică o ripostă indiferent de cât de disproporționată este față de atacul inițial.',
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
          title: 'Capitolul 3: Categoriile de Pedepse',
          description: 'Sancțiunile penale.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Pedepsele Principale',
              content: '# Închisoarea, amenda și detențiunea pe viață\nÎn dreptul penal modern, pedepsele principale care pot fi aplicate persoanelor fizice sunt închisoarea (pe durată determinată), amenda penală și, pentru cele mai grave crime, detențiunea pe viață.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sancțiuni Penale',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele este considerată o pedeapsă principală pentru persoana fizică în sistemul de drept penal românesc?',
                  order_index: 0,
                  options: [
                    { text: 'Confiscarea specială', is_correct: false, order_index: 0 },
                    { text: 'Amenda penală', is_correct: true, order_index: 1 },
                    { text: 'Munca în folosul comunității', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created law course 1:', course1.title);
    
    await course2.save();
    console.log('Created law course 2:', course2.title);

    console.log('Successfully created courses for Drept & Legislație!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
