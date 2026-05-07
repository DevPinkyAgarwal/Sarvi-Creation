import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';
import { Product } from './models/Product.model';
import { Category } from './models/Category.model';

dotenv.config();

const categoriesData = [
    // SECTIONS: category, collection, material, discover
    { name: 'Rings', section: 'category', description: 'Exquisite rings crafted for eternal elegance.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Necklaces', section: 'category', description: 'Statement neckwear for the modern connoisseur.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Earrings', section: 'category', description: 'Delicate brilliance for every occasion.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bracelets', section: 'category', description: 'Timeless wristwear in fine metals.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bangles', section: 'category', description: 'Traditional craftsmanship meets modern design.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=800' },
    
    { name: 'Bridal Heritage', section: 'collection', description: 'The ultimate collection for your forever moment.', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Solitaire Suite', section: 'collection', description: 'Pure brilliance in a single stone.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Minimalist Gold', section: 'collection', description: 'Daily luxury for the contemporary woman.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=800' },
    
    { name: '18K Yellow Gold', section: 'material', description: 'The warmth of pure, classic gold.', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rose Gold', section: 'material', description: 'Romantic and sophisticated pink hues.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sterling Silver', section: 'material', description: 'Cool brilliance in high-grade silver.', image: 'https://images.unsplash.com/photo-1596944210214-469b81efba07?auto=format&fit=crop&q=80&w=800' },
    
    { name: 'New Arrivals', section: 'discover', description: 'Freshly curated from our atelier.', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800' },
    { name: 'Best Sellers', section: 'discover', description: 'Our most loved and iconic pieces.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' }
];

const productsData = [
    {
        name: 'The Eternal Solitaire Ring',
        description: 'A magnificent 1.5-carat round brilliant-cut diamond, set in an 18K white gold four-prong cathedral setting.',
        basePrice: 185000,
        categories: ['Rings', 'Solitaire Suite', 'Best Sellers'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Heritage Emerald Pendant',
        description: 'A 2.0-carat Zambian emerald pendant surrounded by a halo of micro-pave diamonds in 18K yellow gold.',
        basePrice: 95000,
        categories: ['Necklaces', 'Bridal Heritage', '18K Yellow Gold'],
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Cascade Diamond Earrings',
        description: 'Breathtaking drop earrings featuring a cascade of shimmering diamonds set in platinum-plated silver.',
        basePrice: 65000,
        categories: ['Earrings', 'Bridal Heritage', 'Best Sellers'],
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Modernist Link Bracelet',
        description: 'A bold, contemporary interlocking link bracelet in polished 18K yellow gold.',
        basePrice: 42000,
        categories: ['Bracelets', 'Minimalist Gold', '18K Yellow Gold', 'New Arrivals'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Celestial Star Bangle',
        description: 'A sleek rose gold bangle featuring a dainty star motif encrusted with brilliant-cut diamonds.',
        basePrice: 28000,
        categories: ['Bangles', 'Rose Gold', 'New Arrivals'],
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Classic Silver Hoops',
        description: 'Precision-crafted sterling silver hoops with a high-polish finish for everyday luxury.',
        basePrice: 8500,
        categories: ['Earrings', 'Sterling Silver', 'Minimalist Gold'],
        images: ['https://images.unsplash.com/photo-1596944210214-469b81efba07?auto=format&fit=crop&q=80&w=800']
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB for seeding...');

        // IMPORTANT: Clear existing data for a fresh professional start
        console.log('Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});

        const createdCategories: any = {};

        // 1. Seed Categories
        for (const cat of categoriesData) {
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

        // 2. Seed Products
        for (const prod of productsData) {
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
                    sku: `SKU-${Math.floor(Math.random() * 100000)}`,
                    material: prod.categories.find(c => c.includes('Gold') || c.includes('Silver')) || 'Gold',
                    purity: '18K',
                    stockQuantity: 10,
                    priceAmount: prod.basePrice
                }]
            });
            console.log(`Created Product: ${prod.name}`);
        }

        console.log('Professional seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
