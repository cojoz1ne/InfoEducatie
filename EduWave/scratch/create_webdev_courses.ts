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
        full_name: 'Prof. Programare Web',
        email: 'webdev@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Introducere în Web: HTML, CSS și Javascript',
      description: 'Învață bazele absolute ale programării web front-end și creează prima ta pagină web funcțională.',
      category: 'Programare Web',
      image_url: 'https://picsum.photos/seed/webdev1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Structura cu HTML5',
          description: 'Skeletul paginii web.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Taguri Semantice',
              content: '# Scrierea unui cod curat\nHTML5 introduce taguri semantice care ajută motoarele de căutare (SEO) și cititoarele de ecran să înțeleagă structura paginii. Folosim `<header>` pentru antet, `<nav>` pentru meniuri, `<main>` pentru conținutul principal, `<article>` pentru postări individuale și `<footer>` pentru subsol, renunțând la clasicele div-uri abuzate.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Taguri Semantice',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care dintre următoarele elemente HTML5 este semantic și indică zona principală de navigare a site-ului?',
                  order_index: 0,
                  options: [
                    { text: '<div>', is_correct: false, order_index: 0 },
                    { text: '<nav>', is_correct: true, order_index: 1 },
                    { text: '<section>', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Stiluri Moderne cu CSS3',
          description: 'Design, layout și culori.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: CSS Flexbox',
              content: '# Aliniere flexibilă\nFlexbox este un model de layout unidimensional (pe rânduri sau pe coloane) extrem de puternic. Prin adăugarea proprietății `display: flex;` pe un container părinte, putem alinia cu ușurință elementele copii folosind `justify-content` (pe axa principală) și `align-items` (pe axa secundară).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: CSS Flexbox',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Pentru a activa Flexbox pe un set de elemente, trebuie să aplicăm regula `display: flex;` pe fiecare element copil în parte, nu pe containerul părinte.',
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
          title: 'Capitolul 3: Interactivitate cu JavaScript',
          description: 'Adăugarea de logică în browser.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Manipularea DOM-ului',
              content: '# Conectarea paginii cu JS\nDocument Object Model (DOM) este reprezentarea structurată în memorie a paginii tale HTML. Cu Javascript, poți selecta elemente din DOM (ex: `document.querySelector("#buton")`) și le poți atașa ascultători de evenimente (ex: `addEventListener("click", ...)` pentru a schimba comportamentul paginii în timp real.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Evenimente JS',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce metodă nativă din JS este folosită pentru a asculta când utilizatorul dă click pe un buton?',
                  order_index: 0,
                  options: [
                    { text: 'onClick()', is_correct: false, order_index: 0 },
                    { text: 'addEventListener()', is_correct: true, order_index: 1 },
                    { text: 'attachTrigger()', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Dezvoltare Modernă cu React',
      description: 'Construiește aplicații web dinamice utilizând componente, stări și hook-uri React.',
      category: 'Programare Web',
      image_url: 'https://picsum.photos/seed/webdev2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Componente și Props',
          description: 'Modularizarea codului.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Componente Funcționale',
              content: '# Reutilizarea codului\nÎn React, o componentă este o funcție Javascript care returnează cod JSX (o extensie de sintaxă asemănătoare cu HTML). Componentele pot primi date din exterior numite `props` (proprietăți), făcându-le extrem de dinamice și reutilizabile în întreaga aplicație.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Componente React',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce reprezintă „props” în contextul componentelor React?',
                  order_index: 0,
                  options: [
                    { text: 'Variabile interne de stare ce pot fi mutate local', is_correct: false, order_index: 0 },
                    { text: 'Date de intrare transmise de la o componentă părinte către o componentă copil', is_correct: true, order_index: 1 },
                    { text: 'O metodă de a optimiza viteza de randare', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Starea (State) cu useState',
          description: 'Aplicații care reacționează la date.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Reactivitate și re-randare',
              content: '# Memoria componentelor\nSpre deosebire de props, starea (`state`) reprezintă date interne gestionate în interiorul componentei, care se pot schimba în timp. Folosim hook-ul `useState` (ex: `const [count, setCount] = useState(0);`). Când starea se modifică, React re-randează automat componenta pe ecran.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: useState Hook',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Modificarea directă a unei variabile de stare React (ex: state = 5) fără utilizarea funcției de setare (ex: setState(5)) va declanșa re-randarea corectă a interfeței.',
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
          title: 'Capitolul 3: Efecte Secundare cu useEffect',
          description: 'Preluarea datelor de la API-uri și cicluri de viață.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Lucrul cu API-uri externe',
              content: '# Hook-ul pentru efecte\n`useEffect` permite rularea de cod ca reacție la schimbările din aplicație (efecte secundare, cum ar fi apelarea unui API sau setarea unui timer). Primește o funcție și un tablou de dependențe. Dacă tabloul este gol `[]`, efectul rulează o singură dată, la montarea componentei.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: useEffect Dependențe',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se comportă un hook `useEffect` dacă îi transmitem un tablou de dependențe gol `[]` ca al doilea argument?',
                  order_index: 0,
                  options: [
                    { text: 'Rulează la fiecare re-randare a componentei', is_correct: false, order_index: 0 },
                    { text: 'Rulează o singură dată, după prima montare a componentei', is_correct: true, order_index: 1 },
                    { text: 'Nu rulează niciodată', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created webdev course 1:', course1.title);
    
    await course2.save();
    console.log('Created webdev course 2:', course2.title);

    console.log('Successfully created courses for Programare Web!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
