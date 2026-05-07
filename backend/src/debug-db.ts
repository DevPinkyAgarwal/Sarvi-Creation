import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from './models/Product.model';
import { Category } from './models/Category.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB...');

        // 1. Get all products
        const products = await Product.find({}).lean();
        console.log(`DEBUG: Total Products in DB: ${products.length}`);

        for (const p of products) {
            console.log(`Product: ${p.name}`);
            console.log(` - categories (array):`, p.categories);
            console.log(` - category (old field):`, (p as any).category);
            
            // If categories is empty but old category exists, fix it again
            if ((!p.categories || p.categories.length === 0) && (p as any).category) {
                await Product.updateOne({ _id: p._id }, { $set: { categories: [(p as any).category] } });
                console.log(`   -> FIXED: Moved old category to new array.`);
            }
        }

        // 2. Check categories
        const cats = await Category.find({}).lean();
        console.log(`\nDEBUG: Total Categories in DB: ${cats.length}`);
        cats.forEach(c => console.log(` - Category: ${c.name} (${c._id}) slug: ${c.slug}`));

        process.exit(0);
    } catch (error) {
        console.error('Debug failed:', error);
        process.exit(1);
    }
};

debug();
