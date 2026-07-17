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
        full_name: 'Prof. Limba Română',
        email: 'romana@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const courses = [
      {
        title: 'Morfologie: Părțile de Vorbire Flexibile',
        description: 'Studiul aprofundat al claselor morfologice care își schimbă forma: verbul, substantivul, adjectivul și pronumele.',
        category: 'Limba Română',
        image_url: 'https://picsum.photos/seed/ro1/800/400',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters: [
          {
            title: 'Capitolul 1: Substantivul și Categoriile sale Gramaticale',
            description: 'Genul, numărul și cazurile substantivului în limba română.',
            order_index: 0,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 1.1: Cazurile și Funcțiile Sintactice ale Substantivului',
                content: '# Declinarea Substantivului\nSubstantivul are cinci cazuri în limba română:\n1. **Nominativ (N)**: răspunde la întrebările *cine?*, *ce?* (Funcție principală: Subiect).\n2. **Acuzativ (Ac)**: răspunde la *pe cine?*, *ce?*, *cu cine?*, *la ce?* etc. (Funcții: Complement direct, Complement prepozițional, Circumstanțiale).\n3. **Genitiv (G)**: răspunde la *al/a/ai/ale cui?* (Funcție: Atribut substantival genitival).\n4. **Dativ (D)**: răspunde la *cui?* (Funcție: Complement indirect).\n5. **Vocativ (V)**: exprimă o strigare, chemare sau adresare directă (Nu are funcție sintactică).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Cazurile Substantivului',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'În propoziția „Cartea este a elevului.”, la ce caz se află substantivul „elevului”?',
                    order_index: 0,
                    options: [
                      { text: 'Dativ', is_correct: false, order_index: 0 },
                      { text: 'Genitiv', is_correct: true, order_index: 1 },
                      { text: 'Acuzativ', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 2: Adjectivul și Gradele de Comparație',
            description: 'Determinantul calitativ al substantivului și nuanțele sale de intensitate.',
            order_index: 1,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 2.1: Exprimarea Intensității și Comparației',
                content: '# Gradele de Comparație ale Adjectivului\n1. **Pozitiv**: *frumos*.\n2. **Comparativ**:\n   - *de superioritate*: mai frumos\n   - *de egalitate*: la fel de frumos / tot atât de frumos\n   - *de inferioritate*: mai puțin frumos\n3. **Superlativ**:\n   - *Relativ* (de superioritate: cel mai frumos / de inferioritate: cel mai puțin frumos)\n   - *Absolut* (foarte frumos, extraordinar de frumos, din cale-afară de frumos).\n*Atenție*: Unele adjective nu au grade de comparație (ex: optim, complet, rotund, viu, mort, gigantic, sublim).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Grade de Comparație',
                quiz_type: 'truefalse',
                order_index: 1,
                questions: [
                  {
                    question: 'Adjectivul „optim” admite gradul de comparație superlativ absolut (ex: „foarte optim”).',
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
            title: 'Capitolul 3: Pronumele - Substitutul Substantivului',
            description: 'Tipuri de pronume: personal, posesiv, demonstrativ, relativ și nehotărât.',
            order_index: 2,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 3.1: Pronumele Personal și Formele Clitice',
                content: '# Forme Accentuate și Neaccentuate\nPronumele personal prezintă forme accentuate (mie, tine, el, noi) și neaccentuate/clitice (îmi, mi, te, o, le, vă). Formele neaccentuate se folosesc adesea în cazurile Dativ și Acuzativ și se pot uni prin cratimă cu alte părți de vorbire (ex: „ți-am spus”, „o văd”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Forme Neaccentuate',
                quiz_type: 'scrambled',
                order_index: 1,
                questions: [
                  {
                    question: 'Identifică pronumele personal în formă neaccentuată din propoziția: „El îți dăruiește o floare.”',
                    order_index: 0,
                    options: [
                      { text: 'El', is_correct: false, order_index: 0 },
                      { text: 'îți', is_correct: true, order_index: 1 },
                      { text: 'floare', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 4: Verbul - Nucleul Propoziției',
            description: 'Modurile personale și nepersonale, diatezele și conjugările.',
            order_index: 3,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 4.1: Modurile Nepersonale (Nepredicative)',
                content: '# Infinitive, Gerunzii, Participii și Supine\nModurile nepersonale nu pot îndeplini funcția de predicat verbal:\n1. **Infinitiv**: a citi, a scrie.\n2. **Gerunziu**: citind, scriind (se termină în -ind/-ând).\n3. **Participiu**: citit, scris (formă adjectivală, ajută la timpurile compuse).\n4. **Supin**: de citit, la scris (prepoziție + participiu).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Moduri Nepersonale',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'În ce mod nepersonal este pus verbul din structura: „Tema este ușor de făcut.”?',
                    order_index: 0,
                    options: [
                      { text: 'Gerunziu', is_correct: false, order_index: 0 },
                      { text: 'Supin', is_correct: true, order_index: 1 },
                      { text: 'Participiu', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Sintaxa Propoziției: Structuri și Funcții',
        description: 'Analiza detaliată a elementelor constitutive ale propoziției: subiectul, predicatul, atributele și complementele.',
        category: 'Limba Română',
        image_url: 'https://picsum.photos/seed/ro2/800/400',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters: [
          {
            title: 'Capitolul 1: Subiectul și Predicatul',
            description: 'Părțile principale de propoziție.',
            order_index: 0,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 1.1: Predicatul Verbal vs. Predicatul Nominal',
                content: '# Tipuri de Predicat\n1. **Predicatul Verbal (PV)**: exprimă o acțiune sau o stare și este realizat prin verbe predicative (ex: „Elevul *citește*”).\n2. **Predicatul Nominal (PN)**: exprimă o calitate sau o caracteristică și se formează dintr-un verb copulativ (a fi, a deveni, a părea, a ajunge etc.) + nume predicativ (substantiv, adjectiv etc.) (ex: „El *este inteligent*”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Predicate',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'Ce fel de predicat avem în propoziția: „Colegul meu a ajuns inginer.”?',
                    order_index: 0,
                    options: [
                      { text: 'Predicat verbal', is_correct: false, order_index: 0 },
                      { text: 'Predicat nominal', is_correct: true, order_index: 1 },
                      { text: 'Nu există predicat', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 2: Atributul',
            description: 'Determinantul substantivului.',
            order_index: 1,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 2.1: Tipuri de Atribut',
                content: '# Clasificarea Atributului\nAtributul determină un substantiv sau substitut al acestuia. Tipuri:\n- **Atribut adjectival**: „floare *roșie*”\n- **Atribut substantival**: „cartea *elevului*” (genitival), „orașul *Iași*” (apozițional)\n- **Atribut pronominal**: „caietul *său*”\n- **Atribut verbal**: „dorința *de a citi*”\n- **Atribut adverbial**: „mersul *înapoi*”.',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Recunoașterea Atributului',
                quiz_type: 'truefalse',
                order_index: 1,
                questions: [
                  {
                    question: 'În structura „Dorința de a reuși este mare”, secvența „de a reuși” este un atribut verbal exprimat prin verb la modul infinitiv.',
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
            title: 'Capitolul 3: Complementul Direct și Indirect',
            description: 'Determinarea verbului prin obiectele sale.',
            order_index: 2,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 3.1: Obiectul acțiunii',
                content: '# Complementul Direct vs. Complementul Indirect\n- **Complementul Direct (CD)**: reprezintă obiectul asupra căruia se exercită direct acțiunea verbului. Răspunde la întrebările: *pe cine?*, *ce?* (ex: „Îl văd *pe Andrei*”, „Citesc *o carte*”).\n- **Complementul Indirect (CI)**: desemnează beneficiarul acțiunii. Răspunde la: *cui?* (Dativ), *despre cine?*, *la ce?*, *cu ce?* (Acuzativ cu prepoziție) (ex: „I-am dat *mamei* o carte”, „Se gândește *la vacanță*”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Direct sau Indirect?',
                quiz_type: 'scrambled',
                order_index: 1,
                questions: [
                  {
                    question: 'Ce funcție sintactică are substantivul subliniat: „Le povestesc *prietenilor* o întâmplare.”?',
                    order_index: 0,
                    options: [
                      { text: 'Complement direct', is_correct: false, order_index: 0 },
                      { text: 'Complement indirect', is_correct: true, order_index: 1 },
                      { text: 'Subiect', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Sintaxa Frazei: Structura Enunțului Complex',
        description: 'Reguli de delimitare a propozițiilor, coordonarea și tipurile de propoziții subordonate.',
        category: 'Limba Română',
        image_url: 'https://picsum.photos/seed/ro3/800/400',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters: [
          {
            title: 'Capitolul 1: Raportul de Coordonare',
            description: 'Legarea propozițiilor de același fel.',
            order_index: 0,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 1.1: Mijloace de Coordonare',
                content: '# Coordonarea Copulativă, Adversativă, Disjunctivă și Conclusivă\nCoordonarea se realizează prin:\n- **Copulative**: și, nici (ex: „Scrie și citește.”)\n- **Adversative**: dar, iar, însă, ci (ex: „Ar vrea, dar nu poate.” - se pune mereu virgulă înainte!)\n- **Disjunctive**: sau, ori, fie (ex: „Pleacă sau rămâne.”)\n- **Conclusive**: deci, prin urmare (ex: „Nu a învățat, deci a picat.”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Conjuncții Adversative',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'Înainte de care conjuncție coordonatoare este obligatorie folosirea virgulei în frază?',
                    order_index: 0,
                    options: [
                      { text: 'Și', is_correct: false, order_index: 0 },
                      { text: 'Dar', is_correct: true, order_index: 1 },
                      { text: 'Sau', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 2: Propozițiile Subordonate Completive',
            description: 'Completiva directă și completiva indirectă la nivel de frază.',
            order_index: 1,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 2.1: Expansiunea Complementelor',
                content: '# CD devine CD-ul frazei\n1. **Completiva Directă (CD)**: ține locul unui complement direct pe lângă verbul regent (ex: „Știu *ce dorești*” - echivalent cu „Știu *dorința ta*”).\n2. **Completiva Indirectă (CI)**: ține locul unui complement indirect (ex: „Se gândește *la cine va veni*”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Identificarea subordonatei',
                quiz_type: 'truefalse',
                order_index: 1,
                questions: [
                  {
                    question: 'În fraza „Cine se scoală de dimineață departe ajunge.”, propoziția „Cine se scoală de dimineață” este o completivă directă.',
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
            title: 'Capitolul 3: Propoziția Atributivă',
            description: 'Determinantul propozițional al unui substantiv.',
            order_index: 2,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 3.1: Elementele Relaționale la Atributivă',
                content: '# Care, Cine, Ce, Unde\nPropoziția Atributivă (AT) determină un substantiv din propoziția regentă. Se introduce cel mai des prin pronume relative (care, ce, cine) sau adverbe relative (unde, când, cum) (ex: „Băiatul *pe care l-ai văzut* este fratele meu”, „Orașul *unde locuiesc* este liniștit”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Atributivă',
                quiz_type: 'scrambled',
                order_index: 1,
                questions: [
                  {
                    question: 'Care este propoziția regentă pentru atributiva din fraza: „Am cumpărat cartea despre care mi-ai vorbit.”?',
                    order_index: 0,
                    options: [
                      { text: 'despre care mi-ai vorbit', is_correct: false, order_index: 0 },
                      { text: 'Am cumpărat cartea', is_correct: true, order_index: 1 },
                      { text: 'despre care mi-ai vorbit cartea', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Vocabular și Semantică în Limba Română',
        description: 'Studiul sensurilor cuvintelor, relațiile semantice și greșeli frecvente de exprimare (pleonasme, paronime).',
        category: 'Limba Română',
        image_url: 'https://picsum.photos/seed/ro4/800/400',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters: [
          {
            title: 'Capitolul 1: Relații Semantice',
            description: 'Sinonime, Antonime, Omonime, Paronime.',
            order_index: 0,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 1.1: Omonime și Paronime',
                content: '# Confuzii frecvente\n- **Omonime**: cuvinte cu formă identică și sensuri complet diferite (ex: lac - apă stătătoare / lac - substanță lucioasă).\n- **Paronime**: cuvinte cu formă foarte asemănătoare (diferă de obicei prin 1-2 sunete) și sensuri complet diferite. Confuzia lor duce la erori (ex: *a enerva* / *a inerva*; *original* - autentic / *originar* - de loc din).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Paronime',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'Alege varianta corectă pentru sensul de „autentic, inedit”:',
                    order_index: 0,
                    options: [
                      { text: 'originar', is_correct: false, order_index: 0 },
                      { text: 'original', is_correct: true, order_index: 1 },
                      { text: 'origo', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 2: Pleonasmul',
            description: 'Eroarea repetiției inutile.',
            order_index: 1,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 2.1: Pleonasme frecvente în vorbirea curentă',
                content: '# Exprimarea redundantă\nPleonasmul constă în alăturarea unor cuvinte care repetă inutil aceeași idee. Exemple greșite:\n- *a coborî jos* (nu poți coborî decât jos)\n- *hemoragie de sânge* (hemoragia este doar de sânge)\n- *protagonist principal* (protagonistul este deja personajul principal)\n- *panaceu universal* (panaceul este prin definiție un remediu universal).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Evitarea Pleonasmului',
                quiz_type: 'truefalse',
                order_index: 1,
                questions: [
                  {
                    question: 'Expresia „a avansa înainte” este o exprimare corectă și acceptată în limba română literară.',
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
            title: 'Capitolul 3: Împrumuturi și Neologisme',
            description: 'Integrarea cuvintelor străine.',
            order_index: 2,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 3.1: Adaptarea ortografică',
                content: '# Anglicisme vs Neologisme clasice\nLimba română adoptă numeroase cuvinte din engleză (ex: *job*, *site*, *computer*). Când le scriem, trebuie să respectăm normele DOOM-3 (Dicționarul Ortografic, Ortoepic și Morfologic). De exemplu, se scrie *site-uri* (cu cratimă din cauza finalei pronunțate diferit față de scriere).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Ortografie DOOM-3',
                quiz_type: 'scrambled',
                order_index: 1,
                questions: [
                  {
                    question: 'Care este scrierea corectă de plural conform DOOM-3?',
                    order_index: 0,
                    options: [
                      { text: 'siteuri', is_correct: false, order_index: 0 },
                      { text: 'site-uri', is_correct: true, order_index: 1 },
                      { text: 'situri', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'Norme Ortografice și de Punctuație',
        description: 'Ghidul practic pentru scrierea corectă: utilizarea cratimei, a semnelor de punctuație și evitarea greșelilor comune.',
        category: 'Limba Română',
        image_url: 'https://picsum.photos/seed/ro5/800/400',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters: [
          {
            title: 'Capitolul 1: Ortografia Cratimei',
            description: 'Când și de ce folosim cratima.',
            order_index: 0,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 1.1: Cratima în pronunție și legătură',
                content: '# Rolurile cratimei\nCratima (liniuța de unire) marchează pronunțarea a două părți de vorbire diferite în aceeași silabă (ex: „s-a dus”, unde „s-” este pronume, iar „a dus” este verb) sau eludarea unei vocale (ex: „de-a lungul”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Utilizarea cratimei',
                quiz_type: 'classic',
                order_index: 1,
                questions: [
                  {
                    question: 'De ce se folosește cratima în structura „v-am văzut”?',
                    order_index: 0,
                    options: [
                      { text: 'Pentru a separa două cuvinte fără legătură semantică', is_correct: false, order_index: 0 },
                      { text: 'Pentru a marca pronunțarea într-o singură silabă a pronumelui și a verbului auxiliar', is_correct: true, order_index: 1 },
                      { text: 'Pentru a arăta că acțiunea este viitoare', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Capitolul 2: Regulile Virgulei',
            description: 'Unde punem și unde NU punem virgulă.',
            order_index: 1,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 2.1: Interdicția despărțirii subiectului de predicat',
                content: '# Regula de aur a punctuației\n**NICIODATĂ** nu se pune virgulă între subiect și predicat, chiar dacă subiectul este foarte lung sau multiplu (ex: „Copilul cel mic și cuminte, a plecat la școală.” - INCORECT. Corect: „Copilul cel mic și cuminte a plecat la școală.”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Virgula Interzisă',
                quiz_type: 'truefalse',
                order_index: 1,
                questions: [
                  {
                    question: 'Este corectă marcarea prin virgulă a raportului dintre subiect și predicat pentru a respira în citire?',
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
            title: 'Capitolul 3: Confuzia „i”-urilor',
            description: 'Scrierea corectă a cuvintelor cu unul, doi sau trei „i”.',
            order_index: 2,
            items: [
              {
                type: 'lesson',
                title: 'Lecția 3.1: Reguli practice pentru plural și articulare',
                content: '# Când scriem membri, membrii sau membrii-i\n- **membri** (un „i”): când cuvântul este nearticulat (ex: „Doi membri au plecat”).\n- **membrii** (doi „i”): când cuvântul este articulat hotărât (ex: „Membrii asociației sunt aici”).\n- **copiii** (trei „i”): cuvântul de bază la plural nearticulat este „copii” (doi „i”). Prin articulare hotărâtă adăugăm al treilea „i” -> „copiii” (ex: „Copiii se joacă”).',
                order_index: 0
              },
              {
                type: 'quiz',
                title: 'Quiz: Câți „i”?',
                quiz_type: 'scrambled',
                order_index: 1,
                questions: [
                  {
                    question: 'Alege forma corectă articulată hotărât a pluralului substantivului „fiu”:',
                    order_index: 0,
                    options: [
                      { text: 'fii', is_correct: false, order_index: 0 },
                      { text: 'fiii', is_correct: true, order_index: 1 },
                      { text: 'fiiii', is_correct: false, order_index: 2 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    for (const c of courses) {
      const course = new Course(c);
      await course.save();
      console.log('Created Romanian course:', course.title);
    }

    console.log('Successfully created all 5 courses for Limba Română!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
