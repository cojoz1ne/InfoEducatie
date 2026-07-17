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
        full_name: 'Prof. Economie',
        email: 'economie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Microeconomie: Piețe și Prețuri',
      description: 'Studiul comportamentului indivizilor și firmelor în luarea deciziilor de alocare a resurselor limitate.',
      category: 'Economie',
      image_url: 'https://picsum.photos/seed/economics1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Cererea și Oferta',
          description: 'Mecanismul de bază al pieței.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Legea Cererii',
              content: '# Relația Preț-Cantitate\nLegea cererii afirmă că, menținând toți ceilalți factori constanți (ceteris paribus), pe măsură ce prețul unui bun crește, cantitatea cerută din acel bun scade, și invers.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Legea Cererii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum evoluează, în general, cantitatea cerută atunci când prețul unui bun scade?',
                  order_index: 0,
                  options: [
                    { text: 'Rămâne constantă', is_correct: false, order_index: 0 },
                    { text: 'Crește', is_correct: true, order_index: 1 },
                    { text: 'Scade', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Elasticitatea',
          description: 'Sensibilitatea la modificările de preț.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Elasticitatea Prețului Cererii',
              content: '# Bunuri de strictă necesitate vs. Lux\nElasticitatea măsoară cât de mult se modifică cantitatea cerută ca răspuns la o schimbare de preț. Bunurile de necesitate (ex. pâinea, medicamentele) au o cerere inelastică (reacționează puțin la preț).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cererea Inelastică',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O creștere bruscă a prețului insulinei ar duce la o scădere masivă a cantității cerute de către pacienții dependenți.',
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
          title: 'Capitolul 3: Structurile de Piață',
          description: 'De la concurență perfectă la monopol.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Monopolul',
              content: '# Un singur vânzător\nÎntr-o piață de tip monopol, există un singur furnizor pentru un anumit bun sau serviciu, care nu are substitute apropiate, permițându-i să dicteze prețul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Structuri de piață',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește structura de piață caracterizată prin prezența unui singur producător sau vânzător dominant?',
                  order_index: 0,
                  options: [
                    { text: 'Oligopol', is_correct: false, order_index: 0 },
                    { text: 'Monopol', is_correct: true, order_index: 1 },
                    { text: 'Concurență perfectă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Macroeconomie: Creștere și Cicluri Economice',
      description: 'Performanța, structura și comportamentul economiei la nivel național.',
      category: 'Economie',
      image_url: 'https://picsum.photos/seed/economics2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Produsul Intern Brut (PIB)',
          description: 'Măsurarea producției totale.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Componentele PIB-ului',
              content: '# C = Consum, I = Investiții, G = Cheltuieli Guvernamentale, NX = Export Net\nPIB-ul este valoarea de piață a tuturor bunurilor și serviciilor finale produse într-o țară, într-o perioadă dată de timp (de obicei un an).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Calculul PIB',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Sunt incluse în calculul PIB-ului componentele de la mâna a doua (de exemplu, vânzarea unei mașini folosite)?',
                  order_index: 0,
                  options: [
                    { text: 'Da, întotdeauna', is_correct: false, order_index: 0 },
                    { text: 'Nu, doar bunurile noi', is_correct: true, order_index: 1 },
                    { text: 'Da, dar doar la jumătate de preț', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Inflația și Șomajul',
          description: 'Două dintre cele mai mari probleme macroeconomice.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Puterea de Cumpărare',
              content: '# Creșterea generalizată a prețurilor\nInflația reprezintă creșterea susținută și generalizată a nivelului prețurilor, ceea ce înseamnă că o unitate monetară va putea cumpăra mai puține bunuri în viitor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Efectele Inflației',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Inflația ridicată determină o creștere a puterii de cumpărare a populației.',
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
          title: 'Capitolul 3: Politica Monetară și Fiscală',
          description: 'Cum intervine statul.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Rolul Băncii Centrale',
              content: '# Dobânda Cheie\nPolitica monetară este gestionată de Banca Centrală (ex. BNR) și implică controlul ofertei de bani și a ratelor dobânzilor pentru a stabiliza economia, pe când politica fiscală ține de Guvern (impozite, cheltuieli).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: BNR și Politicile Economice',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cine este instituția responsabilă cu gestionarea politicii monetare într-o țară?',
                  order_index: 0,
                  options: [
                    { text: 'Ministerul Finanțelor', is_correct: false, order_index: 0 },
                    { text: 'Banca Centrală (ex: BNR)', is_correct: true, order_index: 1 },
                    { text: 'Parlamentul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created economics course 1:', course1.title);
    
    await course2.save();
    console.log('Created economics course 2:', course2.title);

    console.log('Successfully created courses for Economie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
