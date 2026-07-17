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
        full_name: 'Prof. Criptografie',
        email: 'cripto@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    const course1 = new Course({
      title: 'Bazele Criptografiei Clasice',
      description: 'Descoperă metodele antice și clasice de ascundere a mesajelor, de la Cezar la Enigma.',
      category: 'Criptografie',
      image_url: 'https://picsum.photos/seed/crypto1/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Cifrul Cezar',
          description: 'Cel mai vechi algoritm de substituție.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Substituția Monofabetică',
              content: '# Decalarea alfabetului\nCifrul Cezar este o tehnică simplă în care fiecare literă din textul clar este înlocuită cu o literă aflată la un număr fix de poziții în alfabet (ex. decalaj 3: A devine D).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Decalajul lui Cezar',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Ce literă va înlocui litera "B" într-un Cifru Cezar cu decalaj de 2 poziții?',
                  order_index: 0,
                  options: [
                    { text: 'A', is_correct: false, order_index: 0 },
                    { text: 'D', is_correct: true, order_index: 1 },
                    { text: 'E', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Cifrul Vigenère',
          description: 'Substituția polialfabetică.',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Pătratul Vigenère',
              content: '# Folosirea unei chei\nSpre deosebire de Cifrul Cezar, Vigenère folosește mai multe alfabete cifrate bazate pe literele unui cuvânt-cheie, făcând analiza frecvențelor mult mai dificilă.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Analiza Frecvențelor',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Cifrul Vigenère este la fel de vulnerabil la o simplă analiză a frecvențelor literelor precum Cifrul Cezar.',
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
          title: 'Capitolul 3: Mașina Enigma',
          description: 'Criptografia mecanică în Al Doilea Război Mondial.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: Rotoarele Enigmei',
              content: '# Complexitatea mecanică\nMașina Enigma folosea o serie de rotoare care își schimbau poziția la fiecare tastă apăsată, creând o substituție polialfabetică extrem de complexă care a fost spartă de Alan Turing.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Alan Turing',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numea mașina electromecanică britanică utilizată pentru a decripta mesajele Enigma?',
                  order_index: 0,
                  options: [
                    { text: 'Colossus', is_correct: false, order_index: 0 },
                    { text: 'Bombe', is_correct: true, order_index: 1 },
                    { text: 'Z3', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Criptografia Modernă',
      description: 'De la chei simetrice la RSA și criptografia cuantică.',
      category: 'Criptografie',
      image_url: 'https://picsum.photos/seed/crypto2/800/400',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Criptografia Simetrică',
          description: 'AES, DES și securitatea datelor.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1: Cheia Unică',
              content: '# Criptarea și Decriptarea\nÎn criptografia simetrică (cum ar fi AES), expeditorul și destinatarul folosesc aceeași cheie secretă pentru a cripta și decripta informația. Provocarea majoră este distribuția sigură a cheii.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Cheia Simetrică',
              quiz_type: 'classic',
              order_index: 1,
              questions: [
                {
                  question: 'Care este principalul dezavantaj al criptografiei simetrice?',
                  order_index: 0,
                  options: [
                    { text: 'Viteza redusă de procesare', is_correct: false, order_index: 0 },
                    { text: 'Problema schimbului securizat de chei', is_correct: true, order_index: 1 },
                    { text: 'Consumul mare de memorie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Capitolul 2: Criptografia Asimetrică',
          description: 'Sistemul cu chei publice (RSA).',
          order_index: 1,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 2: Cheia Publică și Privată',
              content: '# Două chei diferite\nCriptografia asimetrică (ex. RSA) utilizează o pereche de chei: o cheie publică (care poate fi distribuită oricui) pentru criptare și o cheie privată (păstrată secretă) pentru decriptare.',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Funcționarea RSA',
              quiz_type: 'truefalse',
              order_index: 1,
              questions: [
                {
                  question: 'Într-un sistem asimetric, un mesaj criptat cu cheia ta publică poate fi decriptat tot cu cheia ta publică.',
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
          title: 'Capitolul 3: Funcții Hash',
          description: 'Integritatea datelor și semnăturile digitale.',
          order_index: 2,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 3: SHA-256',
              content: '# Amprenta Digitală\nO funcție hash (precum SHA-256) transformă un input de lungime variabilă într-un output de lungime fixă, numit hash. Este o funcție "one-way" (ireversibilă).',
              order_index: 0
            },
            {
              type: 'quiz',
              title: 'Quiz: Proprietăți Hash',
              quiz_type: 'scrambled',
              order_index: 1,
              questions: [
                {
                  question: 'Cum se numește proprietatea unei funcții hash prin care este practic imposibil să obții datele originale din hash-ul rezultat?',
                  order_index: 0,
                  options: [
                    { text: 'Reversibilitate', is_correct: false, order_index: 0 },
                    { text: 'Ireversibilitate (One-way)', is_correct: true, order_index: 1 },
                    { text: 'Simetrie', is_correct: false, order_index: 2 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created cryptography course 1:', course1.title);
    
    await course2.save();
    console.log('Created cryptography course 2:', course2.title);

    console.log('Successfully created courses for Criptografie!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
