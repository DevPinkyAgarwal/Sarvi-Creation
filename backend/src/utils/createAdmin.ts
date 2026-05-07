import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI not found in environment');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const name = 'Admin User';
        const email = 'care@sarvicreation.com';
        const password = 'adminpassword123'; // Highly recommended to change this after first login
        const phone = '1234567890';

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User with this email already exists. Checking role...');
            if (userExists.role === 'admin') {
                console.log('Admin user already exists.');
            } else {
                console.log('User exists but is not an admin. Updating role...');
                userExists.role = 'admin';
                await userExists.save();
                console.log('User role updated to admin.');
            }
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            phone
        });

        console.log(`Admin user created successfully: ${admin.email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
