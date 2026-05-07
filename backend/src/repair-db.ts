import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Product } from './models/Product.model';
import { Category } from './models/Category.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const repair = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB for repairs...');

        // 1. Get the Trending Now category
        const trendingCat = await Category.findOne({ slug: 'trending-now' });
        if (trendingCat) {
            console.log(`Found Trending Now: ${trendingCat._id}`);
            // Assign ALL products to Trending Now just to be safe and visible
            const result = await Product.updateMany({}, { $addToSet: { categories: trendingCat._id } });
            console.log(`Linked ${result.modifiedCount} products to Trending Now.`);
        }

        // 2. Fix other categories by matching names if possible
        const categories = await Category.find({});
        const products = await Product.find({});
        
        for (const p of products) {
            // Ensure isActive is true
            p.isActive = true;
            
            // If it has no valid categories, pick the first one from the list (fallback)
            if (!p.categories || p.categories.length === 0) {
                 if (categories.length > 0) {
                     p.categories = [categories[0]._id as any];
                 }
            }
            await p.save();
        }

        console.log('Repairs completed successfully. All products are now active and linked.');
        process.exit(0);
    } catch (error) {
        console.error('Repair failed:', error);
        process.exit(1);
    }
};

repair();
