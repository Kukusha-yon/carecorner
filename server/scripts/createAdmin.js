import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if admin already exists
    console.log('Checking for existing admin user...');
    const adminExists = await User.findOne({ email: 'admin@carecorner.com' });
    if (adminExists) {
      console.log('Admin user already exists:', {
        id: adminExists._id,
        email: adminExists.email,
        role: adminExists.role,
        isEmailVerified: adminExists.isEmailVerified
      });
      process.exit(0);
    }

    // Create admin user
    console.log('Creating new admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@carecorner.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: 'admin',
      isEmailVerified: true
    });

    console.log('Admin user created successfully:', {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isEmailVerified: admin.isEmailVerified
    });
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error.code === 11000) {
      console.error('Duplicate email error - admin user might already exist');
    }
    process.exit(1);
  }
};

createAdmin(); 