import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Fetching users...');

    const users = await User.find({}, 'email full_name role is_approved createdAt');
    console.log('Total users:', users.length);
    console.log('Users list:');
    users.forEach(u => {
      console.log(`- ${u.full_name} (${u.email}) [Role: ${u.role}, Approved: ${u.is_approved}, Created: ${u.createdAt}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
