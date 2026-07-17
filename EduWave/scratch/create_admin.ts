import mongoose from 'mongoose';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const email = 'admin@eduwave.site';
    const password = 'EduWaveAdmin2026!';
    const full_name = 'Admin EduWave';

    console.log(`Checking if user ${email} already exists...`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Admin user already exists. Updating role to admin...');
      existingUser.role = 'admin';
      existingUser.full_name = full_name;
      existingUser.is_approved = true;
      
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt);
      
      await existingUser.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = new User({
        email,
        password: hashedPassword,
        full_name,
        role: 'admin',
        is_approved: true,
        auth_provider: 'credentials',
      });

      await newAdmin.save();
      console.log('Admin user created successfully.');
    }

    console.log('\n--- Credentials ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Role: admin');
    console.log('Approved: true');
    console.log('-------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
