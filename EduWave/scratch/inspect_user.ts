import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function inspect() {
  try {
    await mongoose.connect(MONGODB_URI);
    const user = await User.findOne({ email: 'z1necojo.biz@gmail.com' });
    console.log('User z1necojo.biz@gmail.com:');
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

inspect();
