import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';
import { Product } from './models/Product.model';
import { Category } from './models/Category.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const categoriesData = [
    // SECTIONS: category, collection, material, discover
    { name: 'Rings', section: 'category', description: 'Timeless rings for every occasion.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Necklaces', section: 'category', description: 'Elegant neck pieces.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Earrings', section: 'category', description: 'Stunning earrings.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bracelets', section: 'category', description: 'Classic wristwear.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
    
    { name: 'Bridal Collection', section: 'collection', description: 'For your special day.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Minimalist', section: 'collection', description: 'Daily wear essentials.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=800' },
    
    { name: '18K Gold', section: 'material', description: 'Pure luxury.', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sterling Silver', section: 'material', description: 'Modern and chic.', image: 'https://images.unsplash.com/photo-1596944210214-469b81efba07?auto=format&fit=crop&q=80&w=800' },
    
    { name: 'Trending Now', section: 'discover', description: 'What everyone is wearing.', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800' },
    { name: 'Gift Guide', section: 'discover', description: 'Perfect presents.', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800' }
];

const productsData = [
    {
        name: 'Solitaire Diamond Ring',
        description: 'A stunning 1-carat solitaire diamond set in 18K white gold.',
        basePrice: 125000,
        categories: ['Rings', 'Trending Now', '18K Gold'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Emerald Tear Drop Necklace',
        description: 'Vibrant emerald stone surrounded by micro-diamonds.',
        basePrice: 85000,
        categories: ['Necklaces', 'Bridal Collection'],
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Classic Gold Hoops',
        description: 'Essential 18K gold hoops for daily elegance.',
        basePrice: 15000,
        categories: ['Earrings', 'Minimalist', '18K Gold', 'Trending Now'],
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Pearl Infinity Bracelet',
        description: 'Delicate fresh water pearls on a silver chain.',
        basePrice: 12000,
        categories: ['Bracelets', 'Minimalist', 'Sterling Silver'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Royal Sapphire Pendent',
        description: 'Deep blue sapphire set in sterling silver.',
        basePrice: 45000,
        categories: ['Necklaces', 'Trending Now', 'Sterling Silver'],
        images: ['https://images.unsplash.com/photo-1596944210214-469b81efba07?auto=format&fit=crop&q=80&w=800']
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data (Optional, but good for a fresh seed)
        // await Category.deleteMany({});
        // await Product.deleteMany({});

        const createdCategories: any = {};

        // 1. Seed Categories
        for (const cat of categoriesData) {
            let existing = await Category.findOne({ slug: slugify(cat.name, { lower: true }) });
            if (existing) {
                console.log(`Category exists: ${cat.name}`);
                createdCategories[cat.name] = existing;
            } else {
                const newCat = await Category.create({
                    name: cat.name,
                    slug: slugify(cat.name, { lower: true }),
                    description: cat.description,
                    section: cat.section,
                    image: { public_id: `seed_${cat.name}`, url: cat.image },
                    isActive: true
                });
                console.log(`Created Category: ${cat.name}`);
                createdCategories[cat.name] = newCat;
            }
        }

        // 2. Seed Products
        for (const prod of productsData) {
            let existing = await Product.findOne({ slug: slugify(prod.name, { lower: true }) });
            if (existing) {
                console.log(`Product exists: ${prod.name}`);
            } else {
                const categoryIds = prod.categories.map(name => createdCategories[name]?._id).filter(id => id);
                
                await Product.create({
                    name: prod.name,
                    slug: slugify(prod.name, { lower: true }),
                    description: prod.description,
                    basePrice: prod.basePrice,
                    categories: categoryIds,
                    images: prod.images.map(url => ({ public_id: `seed_${prod.name}`, url, isPrimary: true })),
                    isActive: true,
                    variants: [{
                        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
                        material: prod.categories.find(c => c.includes('Gold') || c.includes('Silver')) || 'Gold',
                        purity: '18K',
                        stockQuantity: 10,
                        priceAmount: prod.basePrice
                    }]
                });
                console.log(`Created Product: ${prod.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
