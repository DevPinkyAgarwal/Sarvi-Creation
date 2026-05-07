import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function createAdmin() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sarvi-creation';
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);

        const email = 'dev@nirvanapc.com';
        const password = 'Kimber@52';
        const name = 'Admin';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists. Updating to admin and reset password...');
            const hashedPassword = await bcrypt.hash(password, 12);
            existingUser.role = 'admin';
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
