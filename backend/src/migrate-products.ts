import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from './models/Product.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB for migration...');

        const products = await Product.find({ category: { $exists: true } });
        console.log(`Found ${products.length} products to migrate.`);

        for (const product of products) {
            const oldCategory = (product as any).category;
            if (oldCategory && (!product.categories || product.categories.length === 0)) {
                product.categories = [oldCategory];
                // We use set to clear the old field if needed, but categories is the new one
                await product.save();
                console.log(`Migrated product: ${product.name}`);
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
