import mongoose from 'mongoose';
import Course from '../src/models/Course';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Theatre courses
    await Course.updateOne(
      { title: 'Introducere în Arta Actorului' },
      { image_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80' } // A generic cinema/theatre image that works
    );
    await Course.updateOne(
      { title: 'Istoria Teatrului' },
      { image_url: 'https://images.unsplash.com/photo-1507676184212-d0330a15183c?auto=format&fit=crop&w=800&q=80' } // A working image
    );

    // Visual arts courses
    await Course.updateOne(
      { title: 'Introducere în Pictură și Culoare' },
      { image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' }
    );
    await Course.updateOne(
      { title: 'Fotografia Digitală - De la Începător la Avansat' },
      { image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' }
    );

    // Also update Afaceri & Management just in case they were broken too
    await Course.updateOne(
      { title: 'Introducere în Managementul Afacerilor' },
      { image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80' }
    );
    await Course.updateOne(
      { title: 'Antreprenoriat și Start-up-uri' },
      { image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80' }
    );

    console.log('Images updated successfully!');
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateImages();
