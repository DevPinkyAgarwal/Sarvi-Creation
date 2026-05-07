import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';
import { Product } from './models/Product.model';
import { Category } from './models/Category.model';

dotenv.config();

const categoriesData = [
    { name: 'Rings', section: 'category', description: 'Exceptional diamond and gemstone rings.', image: { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200' } },
    { name: 'Necklaces', section: 'category', description: 'Statement pieces for timeless elegance.', image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200' } },
    { name: 'Earrings', section: 'category', description: 'Luminous accents for every silhouette.', image: { url: 'https://images.unsplash.com/photo-1630019051933-e746f8cea245?q=80&w=1200' } },
    { name: 'Bracelets', section: 'category', description: 'Finely crafted wristwear in solid gold.', image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200' } },
    { name: 'Bangles', section: 'category', description: 'Iconic heritage craftsmanship.', image: { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1200' } },
    
    { name: 'The Diamond Suite', section: 'collection', description: 'Unrivaled brilliance in every cut.', image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200' } },
    { name: 'Bridal Heritage', section: 'collection', description: 'Heirloom pieces for your eternal legacy.', image: { url: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1200' } },
    { name: 'Signature Gold', section: 'collection', description: 'Minimalist luxury for the daily muse.', image: { url: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=1200' } },
    
    { name: '18K Yellow Gold', section: 'material', description: 'The golden standard of luxury.', image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200' } },
    { name: 'Platinum', section: 'material', description: 'Rare, pure, and eternally enduring.', image: { url: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200' } },
    
    { name: 'New Arrivals', section: 'discover', description: 'The latest curations from our atelier.', image: { url: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=80&w=1200' } },
    { name: 'Best Sellers', section: 'discover', description: 'Iconic designs loved by our clientele.', image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200' } }
];

const productsData = [
    {
        name: 'The Imperial Solitaire',
        description: 'A flawless 2.5-carat round brilliant-cut diamond, ethically sourced and set in a signature 18K white gold platinum-prong mounting.',
        basePrice: 425000,
        categories: ['Rings', 'The Diamond Suite', 'Best Sellers'],
        images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200' }]
    },
    {
        name: 'Royal Heritage Emerald Collar',
        description: 'Deep forest green Zambian emeralds totaling 12 carats, interlaced with D-flawless diamonds in an 18K yellow gold setting.',
        basePrice: 850000,
        categories: ['Necklaces', 'Bridal Heritage', '18K Yellow Gold'],
        images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200' }]
    },
    {
        name: 'Celestial Drop Earrings',
        description: 'Elongated pear-cut diamonds suspended from a delicate diamond-encrusted chain, designed to catch the light at every angle.',
        basePrice: 145000,
        categories: ['Earrings', 'The Diamond Suite', 'Best Sellers'],
        images: [{ url: 'https://images.unsplash.com/photo-1630019051933-e746f8cea245?q=80&w=1200' }]
    },
    {
        name: 'The Atelier Gold Cuff',
        description: 'A structural masterpiece in high-polish 18K yellow gold, featuring a minimalist open-back design for modern sophistication.',
        basePrice: 88000,
        categories: ['Bracelets', 'Signature Gold', '18K Yellow Gold', 'New Arrivals'],
        images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200' }]
    },
    {
        name: 'Infinity Diamond Bangle',
        description: 'A seamless circle of brilliant-cut diamonds, meticulously pavé-set in a solid 18K rose gold frame.',
        basePrice: 215000,
        categories: ['Bangles', 'The Diamond Suite', 'New Arrivals'],
        images: [{ url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1200' }]
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
                image: { public_id: `seed_${cat.name}`, url: cat.image.url },
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
                images: prod.images.map(img => ({ public_id: `seed_${prod.name}`, url: img.url, isPrimary: true })),
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
