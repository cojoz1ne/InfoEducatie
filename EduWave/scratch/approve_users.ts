import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function approveUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // We will approve all students that are currently pending approval
    const result = await User.updateMany(
      { role: 'student', is_approved: false },
      { $set: { is_approved: true } }
    );

    console.log(`Successfully approved ${result.modifiedCount} pending student users.`);

    process.exit(0);
  } catch (error) {
    console.error('Error approving users:', error);
    process.exit(1);
  }
}

approveUsers();
