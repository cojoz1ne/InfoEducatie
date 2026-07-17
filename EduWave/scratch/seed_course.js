import mongoose from 'mongoose';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Gaseste un user profesor sau admin
    let teacher = await User.findOne({ role: { $in: ['teacher', 'admin'] } });
    if (!teacher) {
      // Daca nu exista, cautam orice utilizator
      teacher = await User.findOne();
    }

    if (!teacher) {
      console.log('Nu s-a gasit niciun utilizator in baza de date. Se creeaza un profesor default...');
      teacher = new User({
        email: 'profesor@eduwave.ro',
        full_name: 'Prof. Andrei Ionescu',
        role: 'teacher',
        is_approved: true
      });
      await teacher.save();
    }

    console.log(`Folosim profesorul: ${teacher.full_name} (${teacher._id})`);

    const newCourse = new Course({
      title: 'Introducere în React și Next.js 15',
      description: 'Învață bazele dezvoltării web moderne folosind React, Next.js cu App Router și Mongoose.',
      category: 'Web Development',
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Fundamentele React',
          description: 'Componente, state și props.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1.1: Ce este React?',
              content: 'React este o bibliotecă JS declarativă și eficientă pentru construirea de interfețe utilizator bazate pe componente.',
              order_index: 0,
              questions: []
            }
          ]
        }
      ]
    });

    await newCourse.save();
    console.log('Cursul a fost adaugat cu succes!');
    process.exit(0);
  } catch (error) {
    console.error('Eroare la inserare:', error);
    process.exit(1);
  }
}

seed();
