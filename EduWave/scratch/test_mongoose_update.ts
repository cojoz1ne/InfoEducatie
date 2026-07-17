import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function testUpdate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Running update...');

    const userId = "6a5207d807ab177aa030f9b7";
    const updateData = { is_banned: true };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    console.log('Updated user in DB:');
    console.log(JSON.stringify(updatedUser, null, 2));

    // Reset it back
    await User.findByIdAndUpdate(userId, { is_banned: false }, { new: true });
    console.log('Reset completed.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testUpdate();
