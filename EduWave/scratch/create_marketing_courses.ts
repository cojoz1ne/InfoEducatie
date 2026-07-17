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
        full_name: 'Prof. Marketing',
        email: 'marketing@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Bazele Marketingului: Mixul de Marketing',
      description: 'Înțelege cei 4P ai marketingului și cum să creezi o strategie de succes.',
      category: 'Marketing & PR',
      image_url: 'https://picsum.photos/seed/marketing1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Produsul și Prețul',
          description: 'Crearea valorii și stabilirea costului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Propunerea de Valoare (Value Proposition)',
              content: '# Ce vinzi de fapt?\nUn produs nu este doar un obiect fizic, ci o soluție la o problemă a consumatorului. Prețul trebuie stabilit nu doar pe baza costului de producție, ci mai ales pe baza valorii percepute de client și a poziționării pe piață.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Produs și Preț',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă „Valoarea Percepută” în stabilirea prețului unui produs?',
                  order_index: 0,
                  options: [
                    { text: 'Costul brut al materiilor prime', is_correct: false, order_index: 0 },
                    { text: 'Cât de mult crede clientul că merită produsul respectiv', is_correct: true, order_index: 1 },
                    { text: 'Prețul impus de legislația în vigoare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Plasarea și Promovarea',
          description: 'Canale de distribuție și comunicarea cu piața.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Canalele de Distribuție și Mixul Promoțional',
              content: '# Cum ajunge produsul la client?\nPlasarea (Place) se referă la modul și locurile în care produsul este vândut (online, retail, direct). Promovarea include publicitatea, relațiile publice, promovarea vânzărilor și marketingul direct pentru a convinge clientul să cumpere.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Distribuție și Promovare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Componenta „Place” (Plasare) din mixul de marketing se referă exclusiv la designul fizic al sediului unei companii.',
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
          title: 'Capitolul 3: Cercetarea de Piață',
          description: 'Cum să îți înțelegi audiența.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Segmentare, Targetare și Poziționare (STP)',
              content: '# Nu poți vinde tuturor\nCercetarea de piață te ajută să împarți piața în grupuri omogene (Segmentare), să alegi grupul cel mai profitabil (Targetare) și să definești imaginea unică a produsului tău în mintea acelor consumatori (Poziționare).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Strategia STP',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește etapa din modelul STP în care selectezi segmentul de public țintă către care îți vei orienta campaniile?',
                  order_index: 0,
                  options: [
                    { text: 'Segmentare', is_correct: false, order_index: 0 },
                    { text: 'Targetare (Targeting)', is_correct: true, order_index: 1 },
                    { text: 'Poziționare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Strategii de Relații Publice (PR)',
      description: 'Managementul reputației, comunicarea de criză și relația cu presa.',
      category: 'Marketing & PR',
      image_url: 'https://picsum.photos/seed/marketing2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ce sunt Relațiile Publice?',
          description: 'PR vs. Publicitate.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Construirea Reputației',
              content: '# Publicitatea este plătită, PR-ul este câștigat\nSpre deosebire de publicitate (unde plătești spațiu media), PR-ul se concentrează pe obținerea de expunere organică și construirea unei relații de încredere între brand și public prin comunicate de presă, evenimente și responsabilitate socială.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: PR vs Publicitate',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este diferența principală dintre publicitate (Advertising) și Relații Publice (PR)?',
                  order_index: 0,
                  options: [
                    { text: 'Publicitatea nu costă bani', is_correct: false, order_index: 0 },
                    { text: 'Publicitatea implică spațiu media plătit, în timp ce PR-ul vizează acoperire organică bazată pe relații și reputație', is_correct: true, order_index: 1 },
                    { text: 'PR-ul se adresează doar angajaților interni', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Comunicatul de Presă',
          description: 'Cum să scrii un text pe care jurnaliștii să-l publice.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Structura unui Comunicat de Presă',
              content: '# Cârligul de știri\nUn comunicat de presă eficient are un titlu de impact, un prim paragraf care rezumă știrea, citate relevante de la liderii companiei și o secțiune scurtă despre companie la final (boilerplate), plus date de contact clare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Comunicatul de Presă',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Un comunicat de presă reușit trebuie scris ca un eseu literar lung, plin de metafore și detalii artistice.',
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
          title: 'Capitolul 3: Managementul Crizei de PR',
          description: 'Cum să protejezi brandul în momente critice.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Reguli în caz de criză',
              content: '# Asumare, Rapiditate, Sinceritate\nCând o companie se confruntă cu un scandal sau o eroare gravă, tactica PR-ului de criză este esențială. Nu ignora problema, reacționează rapid, asumă-ți greșelile transparent și prezintă clar planul de remediere.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Comunicare de Criză',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este prima regulă fundamentală atunci când un brand se confruntă cu o criză majoră de imagine?',
                  order_index: 0,
                  options: [
                    { text: 'Să ascundă și să nege informațiile', is_correct: false, order_index: 0 },
                    { text: 'Să comunice transparent, rapid și asumat', is_correct: true, order_index: 1 },
                    { text: 'Să dea în judecată toată presa imediat', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created marketing course 1:', course1.title);
    
    await course2.save();
    console.log('Created marketing course 2:', course2.title);

    console.log('Successfully created courses for Marketing & PR!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
