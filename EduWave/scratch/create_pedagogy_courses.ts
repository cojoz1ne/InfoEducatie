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
        full_name: 'Prof. Pedagogie',
        email: 'pedagogie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Teorii ale Învățării și Aplicații Practice',
      description: 'Studiul modului în care oamenii asimilează cunoștințe, de la behaviorism la constructivism.',
      category: 'Pedagogie',
      image_url: 'https://picsum.photos/seed/pedagogy1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Behaviorismul',
          description: 'Învățarea ca răspuns la stimuli.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Condiționarea Clasică și Operantă',
              content: '# Pavlov și Skinner\nBehaviorismul se concentrează pe comportamentele observabile. Condiționarea clasică (Pavlov) asociază un stimul neutru cu unul natural pentru a genera o reacție automată. Condiționarea operantă (Skinner) folosește recompense (întăriri pozitive) și pedepse pentru a modela comportamentul voluntar.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Condiționare',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce metodă din behaviorism folosește recompensele pentru a crește frecvența unui comportament dorit?',
                  order_index: 0,
                  options: [
                    { text: 'Pedeapsa pozitivă', is_correct: false, order_index: 0 },
                    { text: 'Întărirea pozitivă', is_correct: true, order_index: 1 },
                    { text: 'Extincția', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Cognitivismul',
          description: 'Procesarea internă a informației.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Memoria de Scurtă și Lungă Durată',
              content: '# Cum stocăm informația\nCognitivismul compară mintea umană cu un computer. Informația intră prin senzori, este prelucrată în memoria de lucru/scurtă durată (capacitate limitată) și, dacă este codificată corect prin repetiție și asociere, este stocată în memoria de lungă durată.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Memoria de lucru',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Memoria de scurtă durată (de lucru) are o capacitate nelimitată de stocare a informațiilor simultane.',
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
          title: 'Capitolul 3: Constructivismul',
          description: 'Elevul ca participant activ.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Jean Piaget și Lev Vygotsky',
              content: '# Construirea cunoașterii\nConstructivismul susține că elevii își construiesc propriul sistem de cunoștințe pe baza experiențelor anterioare. Piaget pune accent pe etapele de dezvoltare cognitivă, iar Vygotsky introduce „Zona Proximei Dezvoltări” (ZPD) și importanța interacțiunii sociale în învățare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Zona Proximei Dezvoltări',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care psiholog a propus conceptul de „Zona Proximei Dezvoltări” (ZPD) în procesul de învățare?',
                  order_index: 0,
                  options: [
                    { text: 'Jean Piaget', is_correct: false, order_index: 0 },
                    { text: 'Lev Vygotsky', is_correct: true, order_index: 1 },
                    { text: 'B.F. Skinner', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Metode Didactice și Managementul Clasei',
      description: 'Tehnici de predare modernă, evaluare eficientă și gestionarea relațiilor cu elevii.',
      category: 'Pedagogie',
      image_url: 'https://picsum.photos/seed/pedagogy2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Metode de Predare Moderne',
          description: 'De la expunere la interactivitate.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Învățarea bazată pe proiecte (PBL)',
              content: '# Elevul rezolvă probleme reale\nMetodele active plasează elevul în centrul atenției. Project-Based Learning (PBL) implică studenții în investigarea unei probleme complexe de lungă durată, rezultând într-un produs sau o prezentare finală, dezvoltând gândirea critică și lucrul în echipă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Învățarea pe Proiecte',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este principalul avantaj al metodei Project-Based Learning (PBL)?',
                  order_index: 0,
                  options: [
                    { text: 'Memorarea rapidă a unor liste de date', is_correct: false, order_index: 0 },
                    { text: 'Dezvoltarea gândirii critice prin rezolvarea de probleme reale', is_correct: true, order_index: 1 },
                    { text: 'Evaluarea exclusivă prin teste grilă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Evaluarea Educațională',
          description: 'Cum măsurăm progresul.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Evaluarea Formativă vs. Sumativă',
              content: '# Feedback vs. Notă finală\nEvaluarea formativă are loc pe tot parcursul procesului de predare-învățare, scopul fiind îmbunătățirea învățării (ex: quiz-uri scurte, feedback verbal). Evaluarea sumativă are loc la finalul unei unități sau semestru, evaluând rezultatele finale (ex: examene, teze).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Evaluare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Evaluarea formativă este realizată exclusiv la sfârșitul anului școlar pentru a stabili media finală a elevului.',
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
          title: 'Capitolul 3: Managementul Clasei',
          description: 'Prevenirea comportamentelor problematice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Stabilirea Regulilor și Climatul Pozitiv',
              content: '# Structură și respect reciproc\nUn bun management al clasei presupune stabilirea unor reguli clare, pozitive și colaborative chiar din prima zi. Climatul clasei trebuie să fie sigur din punct de vedere emoțional, încurajând participarea activă și prevenind din timp elementele perturbatoare prin strategii non-verbale.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Reguli de Clasă',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este cel mai bun moment pentru a stabili regulile de funcționare ale clasei alături de elevi?',
                  order_index: 0,
                  options: [
                    { text: 'La finalul anului școlar', is_correct: false, order_index: 0 },
                    { text: 'În primele zile/săptămâni de curs', is_correct: true, order_index: 1 },
                    { text: 'Doar atunci când apare un conflict major', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created pedagogy course 1:', course1.title);
    
    await course2.save();
    console.log('Created pedagogy course 2:', course2.title);

    console.log('Successfully created courses for Pedagogie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
