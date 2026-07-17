import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function changeEmails() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // 1. Update Profesor EduWave
    console.log("Updating 'Profesor EduWave' email...");
    const teacherResult = await User.findOneAndUpdate(
      { full_name: 'Profesor EduWave' },
      { email: 'profesor@eduwave.site' },
      { new: true }
    );
    if (teacherResult) {
      console.log('Profesor EduWave email updated to:', teacherResult.email);
    } else {
      console.log('Profesor EduWave not found in database.');
    }

    // 2. Update Admin EduWave
    console.log("Updating 'Admin EduWave' email...");
    const adminResult = await User.findOneAndUpdate(
      { full_name: 'Admin EduWave' },
      { email: 'admin@eduwave.site' },
      { new: true }
    );
    if (adminResult) {
      console.log('Admin EduWave email updated to:', adminResult.email);
    } else {
      console.log('Admin EduWave not found in database.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error changing emails:', error);
    process.exit(1);
  }
}

changeEmails();
