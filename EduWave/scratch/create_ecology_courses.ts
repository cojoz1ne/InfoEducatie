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
        full_name: 'Prof. Ecologie',
        email: 'ecologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Schimbările Climatice și Încălzirea Globală',
      description: 'Înțelege cauzele, efectele și soluțiile pentru cea mai mare provocare a planetei noastre.',
      category: 'Ecologie & Mediu',
      image_url: 'https://picsum.photos/seed/ecology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Efectul de Seră',
          description: 'Cum reține atmosfera căldura.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Gazele cu Efect de Seră',
              content: '# Un proces natural amplificat\nEfectul de seră este un fenomen natural esențial pentru menținerea temperaturii optime pe Pământ. Însă, activitățile umane au crescut dramatic concentrația gazelor precum dioxidul de carbon (CO2) și metanul (CH4), amplificând acest efect și ducând la încălzire globală.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Gaze de Seră',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele gaze este principalul contributor de natură antropică (produs de om) la efectul de seră amplificat?',
                  order_index: 0,
                  options: [
                    { text: 'Oxigenul (O2)', is_correct: false, order_index: 0 },
                    { text: 'Dioxidul de carbon (CO2)', is_correct: true, order_index: 1 },
                    { text: 'Azotul (N2)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Topirea Ghețarilor',
          description: 'Creșterea nivelului mării.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Impactul Asupra Zonelor Costiere',
              content: '# Apele în creștere\nTopirea calotelor glaciare și a ghețarilor de munte adaugă volume uriașe de apă dulce în oceane. Acest lucru, combinat cu dilatarea termică a apei (apa caldă ocupă mai mult volum), duce la creșterea periculoasă a nivelului mărilor.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Nivelul Mărilor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Dilatarea termică a apei contribuie semnificativ la creșterea nivelului mărilor, nu doar topirea ghețarilor.',
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
          title: 'Capitolul 3: Soluții Durabile',
          description: 'Tranziția către energia verde.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Surse de Energie Regenerabilă',
              content: '# Alternativa ecologică\nPentru a diminua emisiile, omenirea trebuie să treacă de la combustibilii fosili (cărbune, petrol, gaze) la surse regenerabile precum energia solară, eoliană, hidroelectrică și geotermală, care nu emit gaze de seră în timpul funcționării.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Energie Verde',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele este considerată o sursă de energie regenerabilă?',
                  order_index: 0,
                  options: [
                    { text: 'Cărbunele', is_correct: false, order_index: 0 },
                    { text: 'Energia eoliană', is_correct: true, order_index: 1 },
                    { text: 'Uraniul (Energia nucleară)', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Biodiversitatea și Conservarea',
      description: 'Află de ce fiecare specie contează și cum putem proteja ecosistemele.',
      category: 'Ecologie & Mediu',
      image_url: 'https://picsum.photos/seed/ecology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Importanța Ecosistemelor',
          description: 'Rețele trofice și echilibrul naturii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Speciile Cheie',
              content: '# Temelia ecosistemului\nAnumite specii, numite "specii cheie" (keystone species), au un impact disproporționat de mare asupra mediului lor. De exemplu, lupii din Yellowstone sau albinele, a căror dispariție ar duce la colapsul întregului ecosistem.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Specii Cheie',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numesc speciile a căror dispariție ar declanșa colapsul întregului lanț trofic dintr-un ecosistem?',
                  order_index: 0,
                  options: [
                    { text: 'Specii invazive', is_correct: false, order_index: 0 },
                    { text: 'Specii cheie', is_correct: true, order_index: 1 },
                    { text: 'Specii endemice', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Specii Invazive',
          description: 'Amețările aduse biodiversității locale.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Impactul Biologic',
              content: '# Vizitatori nepoftiți\nO specie invazivă este un organism care nu este nativ unui anumit mediu și care, din lipsa prădătorilor naturali, se înmulțește necontrolat, dăunând speciilor locale și mediului înconjurător.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Invazia speciilor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Speciile invazive ajută la creșterea biodiversității locale deoarece adaugă noi animale și plante în ecosistem.',
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
          title: 'Capitolul 3: Protejarea Faunei',
          description: 'Parcuri naționale și eforturi de conservare.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Coridoarele Ecologice',
              content: '# Refacerea habitatelor\nPe lângă crearea zonelor protejate (parcuri, rezervații), ecologiștii folosesc coridoare ecologice (sau "poduri verzi") pentru a conecta ariile naturale fragmentate de autostrăzi sau orașe, permițând animalelor să migreze în siguranță.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Arii Protejate',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numesc pasajele speciale construite pentru a permite animalelor să traverseze în siguranță zonele fragmentate de infrastructura umană?',
                  order_index: 0,
                  options: [
                    { text: 'Rezervații', is_correct: false, order_index: 0 },
                    { text: 'Coridoare ecologice', is_correct: true, order_index: 1 },
                    { text: 'Bariere verzi', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created ecology course 1:', course1.title);
    
    await course2.save();
    console.log('Created ecology course 2:', course2.title);

    console.log('Successfully created courses for Ecologie & Mediu!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
