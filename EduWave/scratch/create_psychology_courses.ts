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
        full_name: 'Prof. Psihologie',
        email: 'psihologie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Psihologia Cognitivă',
      description: 'Studiul proceselor mentale superioare: percepția, atenția, memoria și rezolvarea de probleme.',
      category: 'Psihologie',
      image_url: 'https://picsum.photos/seed/psychology1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Percepția și Iluziile Optice',
          description: 'Cum interpretează creierul realitatea.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Senzație vs. Percepție',
              content: '# Procesarea stimulilor\nSenzația reprezintă detectarea fizică a stimulilor externi (lumină, sunet, presiune) prin organele de simț. Percepția este procesul cognitiv prin care creierul organizează, interpretează și oferă sens acestor senzații. Iluziile optice demonstrează că percepția este o construcție mentală, nu o simplă înregistrare a realității.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Senzație și Percepție',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce proces mental se ocupă cu interpretarea și atribuirea de sens stimulilor captați de organele de simț?',
                  order_index: 0,
                  options: [
                    { text: 'Senzația', is_correct: false, order_index: 0 },
                    { text: 'Percepția', is_correct: true, order_index: 1 },
                    { text: 'Memoria de lucru', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Atenția și Selectivitatea',
          description: 'Filtrarea informațiilor din mediu.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Atenția Selectivă și Efectul Cocktail Party',
              content: '# Focalizarea mentală\nAtenția selectivă este abilitatea de a ne concentra pe un singur stimul în timp ce ignorăm alți stimuli perturbanți. „Efectul Cocktail Party” descrie capacitatea creierului de a detecta informații importante (cum ar fi auzirea propriului nume) dintr-un fundal zgomotos pe care îl ignoram.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Atenția Selectivă',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: '„Efectul Cocktail Party” demonstrează că atenția noastră blochează complet analiza inconștientă a tuturor stimulilor din jur.',
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
          title: 'Capitolul 3: Memoria Umană',
          description: 'Cum codificăm și recuperăm amintirile.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Uitarea și Distorsionarea Amintirilor',
              content: '# Memoria ca reconstrucție\nUitarea poate apărea din cauza degradării urmei de memorie sau a interferențelor (informații noi care le blochează pe cele vechi). Amintirile nu sunt înregistrări video fixe; ele sunt reconstruite la fiecare accesare și pot fi ușor distorsionate de sugestii externe (efectul de dezinformare al lui Elizabeth Loftus).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Distorsionarea amintirilor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce psiholog a demonstrat că amintirile martorilor oculari pot fi ușor manipulate și distorsionate prin simpla formulare a întrebărilor?',
                  order_index: 0,
                  options: [
                    { text: 'Sigmund Freud', is_correct: false, order_index: 0 },
                    { text: 'Elizabeth Loftus', is_correct: true, order_index: 1 },
                    { text: 'Jean Piaget', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Psihologie Socială și Influență',
      description: 'Cum sunt influențate gândurile, sentimentele și comportamentele noastre de prezența celorlalți.',
      category: 'Psihologie',
      image_url: 'https://picsum.photos/seed/psychology2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Conformismul',
          description: 'Presiunea grupului asupra individului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Experimentul lui Solomon Asch',
              content: '# De ce ne conformăm?\nConformismul reprezintă schimbarea comportamentului sau a opiniilor pentru a se potrivi cu cele ale unui grup. În experimentul său faimos, Solomon Asch a arătat că peste o treime dintre participanți au ales un răspuns evident greșit la un test vizual simplu, doar pentru a nu contrazice opinia unanimă a grupului.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Experimentul Asch',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce fenomen psihologic a fost demonstrat și măsurat prin experimentele realizate de Solomon Asch?',
                  order_index: 0,
                  options: [
                    { text: 'Obediența față de autoritate', is_correct: false, order_index: 0 },
                    { text: 'Conformismul în grup', is_correct: true, order_index: 1 },
                    { text: 'Efectul de spectator', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Obediența față de Autoritate',
          description: 'Cât de departe putem merge când ni se ordonă.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Experimentul lui Stanley Milgram',
              content: '# Puterea situației\nMilgram a investigat disponibilitatea oamenilor de a asculta de o autoritate, chiar și atunci când ordinele intrau în conflict cu propria conștiință. Participanții au fost instruiți să aplice șocuri electrice din ce în ce mai mari unui alt subiect (complice) la fiecare greșeală. Spre surprinderea cercetătorilor, 65% dintre participanți au mers până la nivelul maxim de șoc (potențial letal), doar pentru că li s-a ordonat.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Experimentul Milgram',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Experimentul lui Milgram a arătat că majoritatea oamenilor refuză instantaneu să asculte de o autoritate dacă ordinele implică provocarea de durere unei alte persoane.',
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
          title: 'Capitolul 3: Efectul de Spectator (Bystander Effect)',
          description: 'De ce nu ajutăm când sunt mulți oameni în jur.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Difuzia Responsabilității',
              content: '# Ignoranța pluralistă\nEfectul de spectator arată că probabilitatea ca o persoană să ofere ajutor într-o situație de urgență scade odată cu creșterea numărului de martori. Aceasta se datorează difuziei responsabilității (fiecare crede că va interveni altcineva) și ignoranței pluraliste (privim la ceilalți pentru a vedea cum reacționează și tragem concluzia că nu e o urgență dacă nimeni nu face nimic).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Efectul de Spectator',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește fenomenul prin care prezența mai multor martori scade șansele ca cineva să intervină într-o urgență?',
                  order_index: 0,
                  options: [
                    { text: 'Presiunea grupului', is_correct: false, order_index: 0 },
                    { text: 'Efectul de spectator (Bystander Effect)', is_correct: true, order_index: 1 },
                    { text: 'Obediență socială', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created psychology course 1:', course1.title);
    
    await course2.save();
    console.log('Created psychology course 2:', course2.title);

    console.log('Successfully created courses for Psihologie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
