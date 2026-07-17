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
        full_name: 'Prof. Sociologie',
        email: 'sociologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Sociologie: Structuri Sociale',
      description: 'Studiul modului în care funcționează societatea, instituțiile sociale și interacțiunile umane.',
      category: 'Sociologie',
      image_url: 'https://picsum.photos/seed/sociology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Imaginația Sociologică',
          description: 'Privirea dincolo de individual.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: C. Wright Mills și Problemele Publice',
              content: '# Conectarea biografiei cu istoria\nImaginația sociologică reprezintă capacitatea de a face legătura între experiențele personale ale unui individ (necazurile personale, ex: șomajul propriu) și structurile sociale mai mari (problemele publice, ex: o criză economică globală). Ea ne permite să vedem că deciziile noastre aparent private sunt profund influențate de contextul social și istoric.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Imaginația Sociologică',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Cine a definit conceptul de „Imaginație Sociologică” ca un instrument de înțelegere a relației dintre individ și structura socială?',
                  order_index: 0,
                  options: [
                    { text: 'Emile Durkheim', is_correct: false, order_index: 0 },
                    { text: 'C. Wright Mills', is_correct: true, order_index: 1 },
                    { text: 'Karl Marx', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Socializarea',
          description: 'Cum devenim membri ai societății.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Agenții Socializării',
              content: '# Învățarea normelor și valorilor\nSocializarea este procesul de-a lungul vieții prin care indivizii adoptă valorile, credințele și normele societății din care fac parte. Agenții principali ai socializării sunt: Familia (primar), Școala (secundar), Grupul de egali (peer group) și Mass-media.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Agenți de Socializare',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Familia este considerată cel mai important agent al socializării secundare în primii ani de viață ai copilului.',
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
          title: 'Capitolul 3: Instituțiile Sociale',
          description: 'Pilonii societății.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Familia, Educația și Religia',
              content: '# Structuri stabile și funcționale\nInstituțiile sociale sunt seturi de reguli și tipare de comportament stabilite pentru a satisface nevoile de bază ale societății. Ele mențin ordinea socială și transmit cultura. Printre cele mai vechi se numără familia (asigură reproducerea și îngrijirea), educația (transmiterea formală a cunoașterii) și sistemul politic.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Instituții Sociale',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce instituție socială are ca rol principal transmiterea formală a cunoștințelor, abilităților și normelor culturale într-o societate modernă?',
                  order_index: 0,
                  options: [
                    { text: 'Familia', is_correct: false, order_index: 0 },
                    { text: 'Educația', is_correct: true, order_index: 1 },
                    { text: 'Sistemul de sănătate', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Devianță și Control Social',
      description: 'Cum definește societatea regulile, de ce le încalcă oamenii și cum se impune conformitatea.',
      category: 'Sociologie',
      image_url: 'https://picsum.photos/seed/sociology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Ce este Devianța?',
          description: 'Încălcarea normelor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Devianța ca Construcție Socială',
              content: '# Normele sunt relative\nDevianța reprezintă încălcarea normelor sociale acceptate. Ea este relativă: ce este considerat deviant într-o epocă sau cultură (ex: purtarea pantalonilor de către femei în trecut) poate fi considerat complet normal în alta. Devianța nu este o calitate intrinsecă a unui act, ci este definită de reacția societății la acel act.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Relativitatea Devianței',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce înseamnă că devianța este „relativă” din punct de vedere sociologic?',
                  order_index: 0,
                  options: [
                    { text: 'Că este cauzată exclusiv de genele biologice ale omului', is_correct: false, order_index: 0 },
                    { text: 'Că depinde de contextul cultural, istoric și social în care se manifestă', is_correct: true, order_index: 1 },
                    { text: 'Că este pedepsită întotdeauna cu închisoarea', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Teoria Anomiei și Teoria Etichetării',
          description: 'De ce apare comportamentul deviant.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Robert K. Merton și Tensiunea Structurală',
              content: '# Scopuri vs. Mijloace\nTeoria anomiei (sau teoria tensiunii) a lui Merton arată că devianța apare când există un decalaj între scopurile promovate de societate (ex: succesul financiar) și mijloacele legitime disponibile pentru a le atinge (ex: locuri de muncă bine plătite). Unii oameni recurg la metode ilegale (inovare) pentru a atinge succesul.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Teoria Anomiei',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Conform teoriei lui Merton, comportamentul deviant poate apărea atunci când societatea pune accent pe succes, dar nu oferă oportunități egale tuturor membrilor de a-l atinge legal.',
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
          title: 'Capitolul 3: Controlul Social',
          description: 'Mecanismele conformării.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Sancțiuni Formale și Informale',
              content: '# Corectarea comportamentelor\nControlul social cuprinde metodele folosite de societate pentru a asigura conformitatea. Sancțiunile formale sunt reacții oficiale ale instituțiilor (ex: legi, amenzi, pedepse penale). Sancțiunile informale sunt reacții neoficiale în viața de zi cu zi (ex: o privire dezaprobatoare, excluderea din grup sau laudele colegilor).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Sancțiuni Sociale',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de sancțiune este reprezentat de o amendă rutieră emisă de poliție sau o exmatriculare emisă de școală?',
                  order_index: 0,
                  options: [
                    { text: 'Sancțiune informală', is_correct: false, order_index: 0 },
                    { text: 'Sancțiune formală', is_correct: true, order_index: 1 },
                    { text: 'Sancțiune bio-genetică', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created sociology course 1:', course1.title);
    
    await course2.save();
    console.log('Created sociology course 2:', course2.title);

    console.log('Successfully created courses for Sociologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
