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
        full_name: 'Prof. Literatură',
        email: 'literatura@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Genul Epic în Literatura Română',
      description: 'Studiul marilor opere narative din literatura autohtonă.',
      category: 'Literatură',
      image_url: 'https://picsum.photos/seed/literature1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Nuvela Realistă',
          description: 'Analiza nuvelei Moara cu noroc de Ioan Slavici.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Dezumanizarea sub influența banului',
              content: '# Moara cu noroc\nNuvela prezintă destinul tragic al cizmarului Ghiță, care dorește să se îmbogățească rapid luând în arendă cârciuma de la Moara cu noroc. Relația cu Lică Sămădăul îi aduce decăderea morală, înstrăinarea de familie și, în final, moartea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Moara cu noroc',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este personajul care determină decăderea morală a lui Ghiță?',
                  order_index: 0,
                  options: [
                    { text: 'Pintea', is_correct: false, order_index: 0 },
                    { text: 'Lică Sămădăul', is_correct: true, order_index: 1 },
                    { text: 'Bătrâna', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Romanul Realist-Obiectiv',
          description: 'Studiul operei Ion de Liviu Rebreanu.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Glasul Pământului vs. Glasul Iubirii',
              content: '# Ion\nPrimul roman realist modern din literatura română prezintă lupta din sufletul țăranului Ion al Glanetașului între patima pentru pământ (reprezentată prin Ana) și iubirea pentru Florica. Destinul său tragic demonstrează că dorința de înavuțire depășește moralitatea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ion de Liviu Rebreanu',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Romanul „Ion” este o operă subiectivă, scrisă la persoana I, din perspectiva directă a personajului principal.',
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
          title: 'Capitolul 3: Romanul Experienței',
          description: 'Maitreyi de Mircea Eliade.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Confruntarea dintre două culturi',
              content: '# Maitreyi\nRomanul analizează iubirea exotică dintre Allan (tânărul european) și Maitreyi (fiica inginerului indian Narendra Sen). Diferențele majore de mentalitate, tradiție și religie duc la imposibilitatea împlinirii iubirii lor, generând o profundă suferință.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Iubirea neîmplinită',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește personajul principal masculin (european) din romanul Maitreyi?',
                  order_index: 0,
                  options: [
                    { text: 'Narendra', is_correct: false, order_index: 0 },
                    { text: 'Allan', is_correct: true, order_index: 1 },
                    { text: 'Harold', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Genul Liric și Curentele Literare',
      description: 'Poezia românească de la romantism la modernism.',
      category: 'Literatură',
      image_url: 'https://picsum.photos/seed/literature2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Romantismul Eminescian',
          description: 'Luceafărul - capodopera absolută.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Condiția Omului de Geniu',
              content: '# Luceafărul\nPoemul romantic se bazează pe antiteza dintre lumea terestră (omul comun, reprezentat de Cătălina și Cătălin, supuși trecerii timpului) și lumea cosmică (omul de geniu Hyperion, nemuritor, dar condamnat la singurătate).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Luceafărul',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce nume primește Luceafărul de la tatăl său cosmic (Demiurgul)?',
                  order_index: 0,
                  options: [
                    { text: 'Cătălin', is_correct: false, order_index: 0 },
                    { text: 'Hyperion', is_correct: true, order_index: 1 },
                    { text: 'Lucifer', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Modernismul Interbelic',
          description: 'Poezia lui Lucian Blaga sau Tudor Arghezi.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Cunoașterea luciferică la Blaga',
              content: '# Eu nu strivesc corola de minuni a lumii\nPoezia lui Blaga este o artă poetică modernistă. Autorul respinge cunoașterea rațională, logică (științifică, „paradisiacă”), alegând cunoașterea poetică („luciferică”), ce sporește misterul lumii prin metaforă și trăire.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cunoașterea Blagiană',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Lucian Blaga susține în arta sa poetică distrugerea completă a misterelor lumii prin intermediul logicii reci.',
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
          title: 'Capitolul 3: Simbolismul',
          description: 'Plumb de George Bacovia.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Nevroza și monotonia bacoviană',
              content: '# Plumb\nBacovia folosește motive simboliste specifice: plumbul (sugerează greutatea, culoarea cenușie, moartea), culorile reci, ploaia și monotonia. Lumea sa este un spațiu închis (cavoul), din care evadarea este imposibilă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Simbolism Bacovian',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce metal, folosit ca motiv central și titlu în poezia lui Bacovia, sugerează starea de angoasă și moarte?',
                  order_index: 0,
                  options: [
                    { text: 'Aur', is_correct: false, order_index: 0 },
                    { text: 'Plumb', is_correct: true, order_index: 1 },
                    { text: 'Cupru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created literature course 1:', course1.title);
    
    await course2.save();
    console.log('Created literature course 2:', course2.title);

    console.log('Successfully created courses for Literatură!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
