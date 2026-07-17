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
        full_name: 'Prof. Nutriție',
        email: 'nutritie@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Bazele Nutriției: Macronutrienții',
      description: 'Studiul aprofundat al proteinelor, carbohidraților și grăsimilor și rolul lor în organism.',
      category: 'Nutriție & Dietetică',
      image_url: 'https://picsum.photos/seed/nutrition1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Proteinele',
          description: 'Cărămizile musculare și structurale.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Aminoacizii Esențiali și Neesențiali',
              content: '# Rolul proteinelor\nProteinele sunt alcătuite din aminoacizi. Există 9 aminoacizi esențiali (pe care corpul nu îi poate produce singur și trebuie aduși din alimentație) și 11 aminoacizi neesențiali (produși de organism). Proteinele ajută la refacerea musculară, producerea de hormoni și enzime.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Aminoacizii',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Câți aminoacizi sunt considerați „esențiali” pentru organismul uman adult, trebuind să fie asigurați exclusiv prin dietă?',
                  order_index: 0,
                  options: [
                    { text: '5', is_correct: false, order_index: 0 },
                    { text: '9', is_correct: true, order_index: 1 },
                    { text: '20', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Carbohidrații',
          description: 'Combustibilul principal al corpului.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Carbohidrați Simpli vs. Complecși',
              content: '# Energia organismului\nCarbohidrații simpli (ex: zahăr, miere) cresc rapid glicemia și oferă energie pe termen scurt. Carbohidrații complecși (ex: ovăz, orez brun, cartofi dulci) conțin fibre, se digeră lent și oferă energie constantă în timp.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Carbohidrați',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Carbohidrații complecși (cum ar fi cei din cerealele integrale) determină o creștere mult mai rapidă și bruscă a glicemiei comparativ cu zahărul simplu.',
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
          title: 'Capitolul 3: Lipidele (Grăsimile)',
          description: 'Esențiale pentru creier și hormoni.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Grăsimi Săturate și Nesaturate',
              content: '# Grăsimi sănătoase\nGrăsimile nesaturate (ex: ulei de măsline, avocado, nuci) susțin sănătatea inimii și funcția cerebrală. Grăsimile trans (procesate industrial) trebuie evitate deoarece cresc riscul de boli cardiovasculare prin creșterea LDL-colesterolului (colesterolul rău).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Lipide',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce tip de grăsimi procesate industrial este considerat cel mai periculos pentru sănătatea cardiovasculară?',
                  order_index: 0,
                  options: [
                    { text: 'Grăsimi mono-nesaturate', is_correct: false, order_index: 0 },
                    { text: 'Grăsimi trans', is_correct: true, order_index: 1 },
                    { text: 'Grăsimi polinesaturate', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Planificarea Dietei și Echilibrul Caloric',
      description: 'Cum să calculezi necesarul caloric și să creezi un plan alimentar echilibrat.',
      category: 'Nutriție & Dietetică',
      image_url: 'https://picsum.photos/seed/nutrition2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Rata Metabolică Bazală (BMR)',
          description: 'Energia consumată în stare de repaus.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Ce este BMR și cum se calculează?',
              content: '# Consumul în repaus\nBMR reprezintă numărul de calorii de care corpul are nevoie doar pentru a menține funcțiile vitale în stare de repaus complet (respirație, circulație, reglarea temperaturii). Acesta este influențat de sex, vârstă, înălțime și masa musculară.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Ce înseamnă BMR?',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce măsoară în mod direct Rata Metabolică Bazală (BMR)?',
                  order_index: 0,
                  options: [
                    { text: 'Caloriile arse în timpul unui antrenament intens', is_correct: false, order_index: 0 },
                    { text: 'Caloriile necesare doar pentru menținerea funcțiilor vitale în repaus total', is_correct: true, order_index: 1 },
                    { text: 'Energia necesară pentru digestia alimentelor', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Balanța Calorică',
          description: 'Slăbire vs. acumulare de masă musculară.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Deficit și Surplus Caloric',
              content: '# Legea conservării energiei în corp\nPentru a pierde în greutate, organismul trebuie să se afle într-un deficit caloric (să consume mai puține calorii decât arde). Pentru a acumula greutate sau masă musculară, este necesar un surplus caloric (să consume mai multe calorii decât arde).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Balanța Calorică',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Pentru a pierde în greutate, o persoană trebuie să consume în mod constant mai multe calorii decât arde zilnic.',
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
          title: 'Capitolul 3: Densitatea Nutrițională',
          description: 'Calitate vs. cantitate în mâncare.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Alimente dense caloric vs. dense nutrițional',
              content: '# Alegeri inteligente\nAlimentele dense caloric oferă multe calorii, dar puține vitamine/minerale (ex: dulciuri, fast-food). Alimentele dense nutrițional oferă un raport excelent de vitamine, minerale și fibre raportat la cantitatea de calorii (ex: legume verzi, fructe de pădure, leguminoase).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Calitatea Alimentelor',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Ce proprietate au alimentele considerate „dense nutrițional”?',
                  order_index: 0,
                  options: [
                    { text: 'Au foarte multe calorii și deloc fibre', is_correct: false, order_index: 0 },
                    { text: 'Au o concentrație mare de vitamine, minerale și micronutrienți esențiali per calorie', is_correct: true, order_index: 1 },
                    { text: 'Sunt obținute exclusiv prin prăjire intensă', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created nutrition course 1:', course1.title);
    
    await course2.save();
    console.log('Created nutrition course 2:', course2.title);

    console.log('Successfully created courses for Nutriție & Dietetică!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
