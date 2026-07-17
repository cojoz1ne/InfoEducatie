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
        full_name: 'Prof. Filosofie',
        email: 'filosofie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Filosofia Antică Greacă',
      description: 'De la presocratici la Aristotel: fundamentele gândirii occidentale.',
      category: 'Filosofie',
      image_url: 'https://picsum.photos/seed/philosophy1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Presocraticii',
          description: 'Căutarea principiului originar (Arche).',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Apă, Foc, Aer',
              content: '# Trecerea de la Mit la Rațiune\nPrimii filosofi (precum Thales, Anaximandru sau Heraclit) au încercat să explice natura universului nu prin intervenția zeilor, ci căutând "Arche", elementul primordial din care s-a format totul (ex: apa pentru Thales).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Thales din Milet',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce element considera filosoful presocratic Thales din Milet ca fiind principiul originar al tuturor lucrurilor?',
                  order_index: 0,
                  options: [
                    { text: 'Focul', is_correct: false, order_index: 0 },
                    { text: 'Apa', is_correct: true, order_index: 1 },
                    { text: 'Aerul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Socrate',
          description: 'Cunoașterea de sine și maieutica.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Metoda Socratică',
              content: '# "Știu că nu știu nimic"\nSocrate nu a lăsat nimic scris. El folosea metoda dialogului (maieutica) pentru a-și face interlocutorii să descopere singuri adevărul, punându-le întrebări succesive care le scoteau la iveală propriile contradicții.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Metoda lui Socrate',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Socrate a scris numeroase tratate filosofice detaliind metoda sa de predare numită "Maieutică".',
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
          title: 'Capitolul 3: Platon și Aristotel',
          description: 'Lumea Ideilor și Lumea formelor.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Mitul Peșterii',
              content: '# Realitatea vs. Iluzie\nÎn "Mitul Peșterii", Platon sugerează că noi (oamenii de rând) vedem doar umbre ale realității proiectate pe un perete. Adevărata realitate este "Lumea Ideilor", accesibilă doar prin rațiune, nu prin simțuri.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Platon',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește celebra alegorie a lui Platon care descrie diferența dintre iluzie (umbre) și adevărata realitate (Lumea Ideilor)?',
                  order_index: 0,
                  options: [
                    { text: 'Mitul Sisif', is_correct: false, order_index: 0 },
                    { text: 'Mitul Peșterii', is_correct: true, order_index: 1 },
                    { text: 'Mitul Androginului', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Etică și Morală',
      description: 'Dileme morale majore și marile sisteme etice de-a lungul istoriei.',
      category: 'Filosofie',
      image_url: 'https://picsum.photos/seed/philosophy2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Utilitarismul',
          description: 'Cea mai mare fericire pentru cel mai mare număr.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Principiul Utilității',
              content: '# Consecințele contează\nDezvoltat de Jeremy Bentham și John Stuart Mill, Utilitarismul susține că o acțiune este corectă din punct de vedere moral dacă maximizează utilitatea, adică produce cea mai mare cantitate de fericire pentru cel mai mare număr de oameni.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Gândirea Utilitaristă',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Conform Utilitarismului, cum putem determina dacă o acțiune este morală sau imorală?',
                  order_index: 0,
                  options: [
                    { text: 'Urmărind intenția persoanei', is_correct: false, order_index: 0 },
                    { text: 'Evaluând consecințele (dacă aduce fericire majorității)', is_correct: true, order_index: 1 },
                    { text: 'Respectând cu strictețe legile divine', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Etica Kantiană',
          description: 'Datoria morală (Deontologia).',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Imperativul Categoric',
              content: '# Reguli universale\nImmanuel Kant s-a opus utilitarismului. El credea că moralitatea nu depinde de consecințe, ci de intenție și respectarea datoriei. "Imperativul categoric" ne cere să acționăm doar conform acelei maxime pe care am vrea să o vedem transformată în lege universală.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Etica lui Kant',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Immanuel Kant considera că o acțiune este morală doar dacă produce fericire generală, indiferent de mijloacele folosite.',
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
          title: 'Capitolul 3: Existențialismul',
          description: 'Libertatea, angoasa și sensul vieții.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Existența precede esența',
              content: '# Condamnarea la libertate\nPentru Jean-Paul Sartre, omul apare mai întâi în lume (existența) și abia apoi se definește pe sine prin acțiunile și alegerile sale (esența). Nu avem o natură predeterminată, suntem absolut liberi, dar responsabili pentru tot ce facem.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Existențialism',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care este deviza principală a existențialismului formulat de Jean-Paul Sartre?',
                  order_index: 0,
                  options: [
                    { text: 'Gândesc, deci exist', is_correct: false, order_index: 0 },
                    { text: 'Existența precede esența', is_correct: true, order_index: 1 },
                    { text: 'Totul curge (Panta rhei)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created philosophy course 1:', course1.title);
    
    await course2.save();
    console.log('Created philosophy course 2:', course2.title);

    console.log('Successfully created courses for Filosofie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
