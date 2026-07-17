import mongoose from 'mongoose';
import Course from '../src/models/Course';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Picsum photos are guaranteed to work and bypass any Unsplash hotlink/404 issues
    await Course.updateOne(
      { title: 'Introducere în Arta Actorului' },
      { image_url: 'https://picsum.photos/seed/theatre1/800/400' }
    );
    await Course.updateOne(
      { title: 'Istoria Teatrului' },
      { image_url: 'https://picsum.photos/seed/theatre2/800/400' }
    );
    await Course.updateOne(
      { title: 'Introducere în Pictură și Culoare' },
      { image_url: 'https://picsum.photos/seed/art1/800/400' }
    );
    await Course.updateOne(
      { title: 'Fotografia Digitală - De la Începător la Avansat' },
      { image_url: 'https://picsum.photos/seed/art2/800/400' }
    );

    console.log('Images updated to Picsum!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateImages();
