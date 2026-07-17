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
        full_name: 'Prof. Mitologie',
        email: 'mitologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Mitologia Greacă: Zeii din Olimp',
      description: 'Călătorește în Grecia Antică pentru a descoperi legendele zeilor olimpieni.',
      category: 'Mitologie',
      image_url: 'https://picsum.photos/seed/mythology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Cosmogonia și Titanomahia',
          description: 'Originea zeilor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Războiul cu Titanii',
              content: '# Cronos vs. Zeus\nLa început a fost Haosul. Apoi s-au născut Geea (Pământul) și Uranus (Cerul). Titanul Cronos își detronează tatăl, dar își devorează proprii copii de frică să nu pățească la fel. Zeus, salvat de mama sa, Reea, pornește un război de 10 ani (Titanomahia) și își închide tatăl în Tartar, devenind regele zeilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Titanomahia',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește tatăl lui Zeus, cel care își devora copiii pentru a nu fi detronat?',
                  order_index: 0,
                  options: [
                    { text: 'Prometeu', is_correct: false, order_index: 0 },
                    { text: 'Cronos', is_correct: true, order_index: 1 },
                    { text: 'Atlas', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Cei Trei Mari Zei',
          description: 'Împărțirea lumii între frați.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Zeus, Poseidon și Hades',
              content: '# Cerul, Mările și Infernul\nDupă înfrângerea titanilor, cei trei frați trag la sorți stăpânirea lumii. Zeus primește Cerul și devine conducătorul suprem, Poseidon primește stăpânirea Mărilor și a cutremurelor, iar Hades primește Lumea Subpământeană (Tărâmul morților).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cei Trei Zei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Zeus a primit prin tragere la sorți stăpânirea Lumii Subpământene, în timp ce Hades a devenit zeul cerului și al trăsnetului.',
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
          title: 'Capitolul 3: Prometeu și Focul',
          description: 'Pedepsirea titanului binefăcător.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Focul Furat',
              content: '# Sacrificiul pentru oameni\nTitanul Prometeu iubea oamenii creați din lut. Pentru a-i ajuta să supraviețuiască și să progreseze, el fură focul din forja lui Hefaistos și li-l dăruiește. Furios, Zeus îl înlănțuiește pe o stâncă în Caucaz, unde un vultur îi mănâncă zilnic ficatul care se regenerează noaptea.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Prometeu',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce element divin a furat titanul Prometeu de la zei pentru a-l dărui oamenilor?',
                  order_index: 0,
                  options: [
                    { text: 'Apa sfințită', is_correct: false, order_index: 0 },
                    { text: 'Focul', is_correct: true, order_index: 1 },
                    { text: 'Fulgerul lui Zeus', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Mitologia Nordică: Ragnarok și Zeii Asgardului',
      description: 'Lumea vikingilor: Odin, Thor, Loki și bătălia de la sfârșitul lumii.',
      category: 'Mitologie',
      image_url: 'https://picsum.photos/seed/mythology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Arborele Lumii și Tărâmurile',
          description: 'Yggdrasil și cosmologia nordică.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Asgard, Midgard și Niflheim',
              content: '# Cele 9 lumi\nCosmologia nordică se sprijină pe Yggdrasil, un frasin uriaș ce leagă nouă lumi diferite. Printre acestea se numără Asgard (tărâmul zeilor Aesir, condus de Odin), Midgard (lumea oamenilor) și Helheim/Niflheim (lumea înghețată a morților).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Arborele Yggdrasil',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește arborele gigantic ce susține și leagă cele 9 lumi în mitologia nordică?',
                  order_index: 0,
                  options: [
                    { text: 'Valhala', is_correct: false, order_index: 0 },
                    { text: 'Yggdrasil', is_correct: true, order_index: 1 },
                    { text: 'Bifrost', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Odin, Thor și Loki',
          description: 'Cei mai cunoscuți zei nordici.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Ciocanul și Înțelepciunea',
              content: '# Panteonul Nordului\nOdin este zeul suprem, al înțelepciunii și al războiului (și-a sacrificat un ochi pentru cunoaștere). Thor este zeul fulgerului și protectorul oamenilor, purtând ciocanul magic Mjolnir. Loki este zeul farselor și al înșelăciunii, având o loialitate schimbătoare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Zeii Nordului',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Ciocanul magic Mjolnir aparține zeului Odin, cel care conduce tărâmul Asgard.',
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
          title: 'Capitolul 3: Ragnarok',
          description: 'Amurgul Zeilor și sfârșitul lumii.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Bătălia Finală',
              content: '# Apocalipsa nordică\nRagnarok este destinul final al zeilor, o serie de catastrofe naturale urmate de o bătălie apocaliptică între zeii conduși de Odin și forțele haosului conduse de Loki și gigantul Surt. În această luptă, Odin, Thor, Loki și majoritatea zeilor mor, iar lumea este acoperită de ape pentru a renaște apoi.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sfârșitul Lumii',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește bătălia finală și apocaliptică din mitologia nordică în care majoritatea zeilor își găsesc sfârșitul?',
                  order_index: 0,
                  options: [
                    { text: 'Valhalla', is_correct: false, order_index: 0 },
                    { text: 'Ragnarok', is_correct: true, order_index: 1 },
                    { text: 'Helheim', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created mythology course 1:', course1.title);
    
    await course2.save();
    console.log('Created mythology course 2:', course2.title);

    console.log('Successfully created courses for Mitologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
