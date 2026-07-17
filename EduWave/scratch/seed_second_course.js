import mongoose from 'mongoose';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';
import Enrollment from '../src/models/Enrollment.js';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // 1. Gaseste un user profesor
    let teacher = await User.findOne({ role: { $in: ['teacher', 'admin'] } });
    if (!teacher) {
      teacher = await User.findOne();
    }
    if (!teacher) {
      console.log('Niciun utilizator gasit. Creeaza profesor...');
      teacher = new User({
        email: 'profesor@eduwave.site',
        full_name: 'Profesor EduWave',
        role: 'teacher',
        is_approved: true
      });
      await teacher.save();
    }

    // 2. Gaseste un elev la care sa inscriem cursul (primul elev din baza de date)
    let student = await User.findOne({ role: 'student' });
    if (!student) {
      student = await User.findOne();
    }
    if (!student) {
      console.log('Niciun elev gasit pentru inscriere.');
      process.exit(1);
    }

    console.log(`Profesor: ${teacher.full_name} (${teacher._id})`);
    console.log(`Elev: ${student.full_name} (${student._id})`);

    // 3. Creeaza al doilea curs (pentru a fi doua cursuri in total)
    const course2 = new Course({
      title: 'Dezvoltare Web Modernă cu Node.js și Express',
      description: 'Învață să creezi API-uri REST securizate și performante utilizând Node.js, Express și baze de date MongoDB.',
      category: 'Web Development',
      image_url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&auto=format&fit=crop&q=60',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Capitolul 1: Bazele Node.js',
          description: 'Introducere în runtime-ul Node.js.',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Lecția 1.1: Module de sistem în Node',
              content: 'Utilizarea modulelor default fs, path, http în aplicațiile Node.',
              order_index: 0,
              questions: []
            }
          ]
        }
      ]
    });

    await course2.save();
    console.log('Al doilea curs a fost adăugat cu succes!');

    // 4. Gasim primul curs din baza de date ca sa le inscriem pe amandoua la student
    const allCourses = await Course.find();
    
    // Inscriem studentul la toate cursurile pentru a avea 2 cursuri active în dashboard
    for (const c of allCourses) {
      const alreadyEnrolled = await Enrollment.findOne({ user_id: student._id, course_id: c._id });
      if (!alreadyEnrolled) {
        const enrollment = new Enrollment({
          user_id: student._id,
          course_id: c._id,
          progress: 0,
          status: 'active'
        });
        await enrollment.save();
        console.log(`Studentul a fost înscris cu succes la cursul: ${c.title}`);
      } else {
        console.log(`Studentul era deja înscris la cursul: ${c.title}`);
      }
    }

    console.log('Seed complet!');
    process.exit(0);
  } catch (error) {
    console.error('Eroare la inserare:', error);
    process.exit(1);
  }
}

seed();
