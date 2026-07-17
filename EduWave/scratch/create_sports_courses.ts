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
        full_name: 'Prof. Sport',
        email: 'sport@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Bazele Nutriției Sportive',
      description: 'Află cum să îți alimentezi corpul pentru performanțe maxime și recuperare rapidă.',
      category: 'Educație Fizică & Sport',
      image_url: 'https://picsum.photos/seed/sport1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Macronutrienții',
          description: 'Proteine, Carbohidrați și Grăsimi.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Rolul Proteinelor',
              content: '# Construcția musculară\nProteinele sunt esențiale pentru repararea și creșterea țesutului muscular după efort. Sportivii necesită un aport proteic mai mare (1.6 - 2.2 g per kg corp) comparativ cu persoanele sedentare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Proteine',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este funcția principală a proteinelor în contextul antrenamentelor sportive?',
                  order_index: 0,
                  options: [
                    { text: 'Sursă rapidă de energie', is_correct: false, order_index: 0 },
                    { text: 'Repararea și creșterea musculară', is_correct: true, order_index: 1 },
                    { text: 'Hidratarea celulară', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Hidratarea',
          description: 'Importanța apei și a electroliților.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Electroliții',
              content: '# Echilibrul hidric\nÎn timpul transpirației intense, nu pierdem doar apă, ci și minerale esențiale numite electroliți (Sodiu, Potasiu, Magneziu). Refacerea lor este crucială pentru prevenirea crampelor musculare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Electroliți',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Prin transpirație, organismul pierde exclusiv apă, fiind suficientă simpla rehidratare cu apă plată după un efort extrem.',
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
          title: 'Capitolul 3: Suplimentele Sportive',
          description: 'Creatina, Pre-workout și Vitaminele.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Creatina Monohidrat',
              content: '# Forță și anduranță explozivă\nCreatina este unul dintre cele mai studiate și sigure suplimente. Ea ajută la regenerarea rapidă a ATP-ului (energia celulară), permițând sportivului să facă un efort scurt și intens (ex: ridicarea greutăților).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Suplimente',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește molecula de energie celulară pe care creatina ajută să o regenereze mai rapid?',
                  order_index: 0,
                  options: [
                    { text: 'ADN', is_correct: false, order_index: 0 },
                    { text: 'ATP', is_correct: true, order_index: 1 },
                    { text: 'ARN', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Antrenamentul de Forță și Condiționare',
      description: 'Principii de bază pentru dezvoltarea masei musculare și îmbunătățirea performanțelor cardiovasculare.',
      category: 'Educație Fizică & Sport',
      image_url: 'https://picsum.photos/seed/sport2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Hipertrofia Musculară',
          description: 'Cum cresc mușchii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Suprasarcina Progresivă',
              content: '# Cheia dezvoltării\nPentru ca mușchii să continue să crească în dimensiune și forță (hipertrofie), aceștia trebuie expuși constant la stimuli mai mari decât cei cu care sunt obișnuiți. Acest principiu se numește "suprasarcină progresivă" (ex. creșterea greutății sau a repetărilor).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Suprasarcină',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește principiul prin care creștem constant efortul (greutatea, repetările) pentru a forța adaptarea și creșterea musculară?',
                  order_index: 0,
                  options: [
                    { text: 'Recuperare activă', is_correct: false, order_index: 0 },
                    { text: 'Suprasarcină progresivă', is_correct: true, order_index: 1 },
                    { text: 'Epuizare musculară', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Recuperarea (Recovery)',
          description: 'Somnul, stretching-ul și odihna.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Importanța Somnului',
              content: '# Când se produce creșterea\nMușchii nu cresc în timpul antrenamentului, ci în timpul perioadelor de repaus. Un somn profund (7-9 ore) este momentul principal în care organismul secretă hormonul de creștere și repară țesuturile afectate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Importanța Odihnei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dezvoltarea și repararea țesutului muscular au loc în principal în timpul efortului intens de la sală.',
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
          title: 'Capitolul 3: Antrenamentul Cardiovascular',
          description: 'Sănătatea inimii și rezistența.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: HIIT vs. LISS',
              content: '# Metode de antrenament cardio\nLISS (Low-Intensity Steady State) implică un efort moderat și constant (ex: mers rapid timp de 45 minute). HIIT (High-Intensity Interval Training) alternează sprinturi scurte și explozive cu perioade scurte de repaus.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Tipuri de Cardio',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește antrenamentul cardiovascular care alternează intervale scurte de efort maxim cu intervale scurte de pauză?',
                  order_index: 0,
                  options: [
                    { text: 'LISS', is_correct: false, order_index: 0 },
                    { text: 'HIIT', is_correct: true, order_index: 1 },
                    { text: 'Crossfit', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created sports course 1:', course1.title);
    
    await course2.save();
    console.log('Created sports course 2:', course2.title);

    console.log('Successfully created courses for Educație Fizică & Sport!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
