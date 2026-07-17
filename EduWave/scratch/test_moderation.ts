import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function testModeration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Find test user teststudent456@example.com (Test Student)
    const testEmail = 'teststudent456@example.com';
    const user = await User.findOne({ email: testEmail });

    if (!user) {
      console.log(`Test user ${testEmail} not found!`);
      process.exit(1);
    }

    console.log(`Original user state: is_banned=${user.is_banned}, is_ai_blacklisted=${user.is_ai_blacklisted}, timeout_until=${user.timeout_until}, mute_until=${user.mute_until}`);

    // Let's toggle AI blacklist and Mute for testing
    user.is_ai_blacklisted = !user.is_ai_blacklisted;
    user.mute_until = new Date(Date.now() + 10 * 60 * 1000); // 10 mins mute
    await user.save();

    console.log(`Updated user state: is_banned=${user.is_banned}, is_ai_blacklisted=${user.is_ai_blacklisted}, timeout_until=${user.timeout_until}, mute_until=${user.mute_until}`);

    // Let's reset Mute and AI blacklist to normal
    user.is_ai_blacklisted = false;
    user.mute_until = null;
    await user.save();

    console.log('Test completed successfully and state restored.');
    process.exit(0);
  } catch (error) {
    console.error('Error during moderation test:', error);
    process.exit(1);
  }
}

testModeration();
