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
        full_name: 'Prof. Electronică',
        email: 'electronica@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Componente Electronice de Bază',
      description: 'Învață cum funcționează rezistențele, condensatoarele și tranzistorii în circuitele moderne.',
      category: 'Electronică & Automatizări',
      image_url: 'https://picsum.photos/seed/electronics1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Legea lui Ohm',
          description: 'Tensiune, curent și rezistență.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Formula de bază',
              content: '# V = I * R\nLegea lui Ohm este principiul fundamental al electronicii, stabilind relația matematică dintre tensiunea electrică (V - Volți), curentul electric (I - Amperi) și rezistența (R - Ohmi).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Legea lui Ohm',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se exprimă corect Legea lui Ohm?',
                  order_index: 0,
                  options: [
                    { text: 'I = V * R', is_correct: false, order_index: 0 },
                    { text: 'V = I * R', is_correct: true, order_index: 1 },
                    { text: 'R = V * I', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Semiconductori',
          description: 'Diodele și rolul lor.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Joncțiunea P-N',
              content: '# Sens unic pentru curent\nO diodă este o componentă semiconductoare cu două terminale care permite trecerea curentului electric predominant într-o singură direcție, blocându-l în direcția opusă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Funcția Diodei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'O diodă ideală permite trecerea curentului electric în ambele direcții cu aceeași intensitate.',
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
          title: 'Capitolul 3: Tranzistorul',
          description: 'Inima electronicii moderne.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Comutator și Amplificator',
              content: '# Revoluția digitală\nTranzistorul a înlocuit tuburile vidate, putând fi folosit fie ca un comutator (deschis/închis, esențial pentru logica binară 0/1 a calculatoarelor), fie ca amplificator de semnal.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Rolul Tranzistorului',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Care componentă este considerată baza electronicii moderne, acționând ca un comutator sau amplificator?',
                  order_index: 0,
                  options: [
                    { text: 'Condensatorul', is_correct: false, order_index: 0 },
                    { text: 'Tranzistorul', is_correct: true, order_index: 1 },
                    { text: 'Transformatorul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Automatizări Industriale și PLC',
      description: 'Cum programăm mașinăriile să funcționeze autonom.',
      category: 'Electronică & Automatizări',
      image_url: 'https://picsum.photos/seed/electronics2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Senzori și Actuatori',
          description: 'Ochii și mâinile mașinii.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Bucle de Control',
              content: '# Feedback-ul\nSenzorii citesc starea mediului (ex: temperatură, poziție), trimit datele la un controler (ex: PLC), care apoi comandă actuatorii (ex: motoare, valve) pentru a regla procesul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Bucle de Control',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Într-un sistem de automatizare, care componentă execută comanda fizică (de ex. închide o valvă)?',
                  order_index: 0,
                  options: [
                    { text: 'Senzorul', is_correct: false, order_index: 0 },
                    { text: 'Actuatorul', is_correct: true, order_index: 1 },
                    { text: 'Controlerul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Programarea PLC',
          description: 'Controllere logice programabile.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Limbajul Ladder Logic',
              content: '# Logica pe scări\nLadder Logic (sau logica cu relee) este cel mai comun limbaj vizual de programare a PLC-urilor în medii industriale, simulând o schemă electrică cu contacte normal deschise (NO) și normal închise (NC).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ladder Logic',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Ladder Logic folosește simboluri grafice asemănătoare schemelor electrice cu relee pentru a programa funcțiile unui PLC.',
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
          title: 'Capitolul 3: Sisteme SCADA',
          description: 'Monitorizare și achiziție de date.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Controlul la Nivel Înalt',
              content: '# Interfața Om-Mașină (HMI)\nSCADA (Supervisory Control and Data Acquisition) este o arhitectură software folosită pentru a monitoriza și controla echipamentele industriale de la distanță, oferind interfețe grafice detaliate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: SCADA',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce sistem de nivel înalt este folosit într-o fabrică pentru a oferi monitorizare globală și achiziție de date pe interfețe grafice?',
                  order_index: 0,
                  options: [
                    { text: 'Microcontrolerul', is_correct: false, order_index: 0 },
                    { text: 'SCADA', is_correct: true, order_index: 1 },
                    { text: 'Tranzistorul', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created electronics course 1:', course1.title);
    
    await course2.save();
    console.log('Created electronics course 2:', course2.title);

    console.log('Successfully created courses for Electronică & Automatizări!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
