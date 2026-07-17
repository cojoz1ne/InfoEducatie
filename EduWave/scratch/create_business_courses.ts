import mongoose from 'mongoose';
import Course from '../src/models/Course';
import User from '../src/models/User';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch a user to be the teacher
    let teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      teacher = await User.findOne();
    }
    
    if (!teacher) {
      console.log('No users found in database. Creating a mock teacher...');
      teacher = new User({
        full_name: 'Prof. Business',
        email: 'business@eduwave.ro',
        password: 'password123',
        role: 'teacher'
      });
      await teacher.save();
    }

    console.log('Using teacher:', teacher.full_name);

    const course1 = new Course({
      title: 'Introducere în Managementul Afacerilor',
      description: 'Acest curs oferă o bază solidă în principiile fundamentale ale managementului, planificării strategice și leadership-ului.',
      category: 'Afaceri & Management',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Concepte de Bază',
          description: 'Introducere în management',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Ce este Managementul?',
              content: 'Managementul este procesul de planificare, organizare, conducere și control al resurselor unei organizații.',
              order_index: 0
            }
          ]
        }
      ]
    });

    const course2 = new Course({
      title: 'Antreprenoriat și Start-up-uri',
      description: 'Învață cum să îți transformi ideea într-o afacere de succes, de la validarea ideii până la obținerea finanțării.',
      category: 'Afaceri & Management',
      image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop',
      teacher_id: teacher._id,
      teacher_name: teacher.full_name,
      chapters: [
        {
          title: 'Validarea Ideii',
          description: 'Cum să știi dacă ideea ta este bună',
          order_index: 0,
          items: [
            {
              type: 'lesson',
              title: 'Cercetarea de Piață',
              content: 'Primul pas este să înțelegi nevoia din piață și competiția.',
              order_index: 0
            }
          ]
        }
      ]
    });

    await course1.save();
    console.log('Created course 1:', course1.title);
    
    await course2.save();
    console.log('Created course 2:', course2.title);

    console.log('Successfully created 2 courses for Afaceri & Management!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
