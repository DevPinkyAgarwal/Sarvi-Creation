import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI not found in environment');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing data (optional, but good for a clean seed)
        console.log('Clearing existing categories and products...');
        await Category.deleteMany({});
        await Product.deleteMany({});

        // 1. Seed Categories
        console.log('Seeding categories...');
        const categoriesData = [
            {
                name: 'Rings',
                slug: 'rings',
                description: 'Elegant rings for all occasions.',
                image: { public_id: 'seed/rings', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' }
            },
            {
                name: 'Necklaces',
                slug: 'necklaces',
                description: 'Statement and delicate necklaces.',
                image: { public_id: 'seed/necklaces', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' }
            },
            {
                name: 'Earrings',
                slug: 'earrings',
                description: 'Beautifully crafted earrings.',
                image: { public_id: 'seed/earrings', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' }
            },
            {
                name: 'Bracelets',
                slug: 'bracelets',
                description: 'Timeless bracelets.',
                image: { public_id: 'seed/bracelets', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' }
            },
            {
                name: 'Rebel at Heart',
                slug: 'rebel-at-heart',
                description: 'Bold designs for the modern spirit.',
                image: { public_id: 'seed/rebel', url: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=800' }
            }
        ];

        const insertedCategories = await Category.insertMany(categoriesData);
        const getCatId = (slug: string) => insertedCategories.find(c => c.slug === slug)?._id;

        // 2. Seed Products
        console.log('Seeding products...');
        const productsData = [
            {
                name: 'The Solitaire Promise Ring',
                slug: 'solitaire-promise-ring',
                description: 'A breathtaking 18K solid gold promise ring featuring a brilliant VVS1 diamond. Precision crafted for life\'s most precious moments with exceptional clarity and a timeless setting.',
                category: getCatId('rings'),
                images: [
                    { public_id: 'seed/solitaire-1', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', isPrimary: true },
                    { public_id: 'seed/solitaire-2', url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=800', isPrimary: false },
                    { public_id: 'seed/solitaire-3', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', isPrimary: false },
                    { public_id: 'seed/solitaire-4', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', isPrimary: false }
                ],
                basePrice: 1250,
                makingCharges: 0,
                variants: [
                    { size: 'US 6', material: '18K Yellow Gold', purity: '18K', priceAmount: 1250, stockQuantity: 5, sku: 'RNG-SOL-18Y-6' },
                    { size: 'US 7', material: '18K Yellow Gold', purity: '18K', priceAmount: 1250, stockQuantity: 3, sku: 'RNG-SOL-18Y-7' },
                    { size: 'US 6', material: '18K White Gold', purity: '18K', priceAmount: 1250, stockQuantity: 4, sku: 'RNG-SOL-18W-6' },
                    { size: 'US 7', material: '18K White Gold', purity: '18K', priceAmount: 1250, stockQuantity: 2, sku: 'RNG-SOL-18W-7' }
                ],
                ratingsAverage: 4.9,
                ratingsQuantity: 128
            },
            {
                name: 'Sapphire Drop Necklace',
                slug: 'sapphire-drop-necklace',
                description: 'Elegant drop necklace featuring a deep blue sapphire surrounded by diamonds.',
                category: getCatId('necklaces'),
                images: [
                    { public_id: 'seed/prod2-1', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', isPrimary: true }
                ],
                basePrice: 85000,
                makingCharges: 8000,
                variants: [
                    { material: 'Platinum', purity: '950', priceAmount: 93000, stockQuantity: 2, sku: 'NCK-SAP-PT' }
                ],
                ratingsAverage: 5.0,
                ratingsQuantity: 12
            },
            {
                name: 'Gold Hoop Earrings',
                slug: 'gold-hoop-earrings',
                description: 'Minimalist, everyday 22K gold hoop earrings.',
                category: getCatId('earrings'),
                images: [
                    { public_id: 'seed/prod3-1', url: 'https://images.unsplash.com/photo-1535633302704-c02f4f7d53f2?auto=format&fit=crop&q=80&w=800', isPrimary: true }
                ],
                basePrice: 15000,
                makingCharges: 2500,
                variants: [
                    { size: 'Medium', material: '22K Gold', purity: '22K', priceAmount: 17500, stockQuantity: 15, sku: 'ERR-HOP-22K-M' }
                ],
                ratingsAverage: 4.5,
                ratingsQuantity: 45
            },
            {
                name: 'Rebel Skull Pendant',
                slug: 'rebel-skull-pendant',
                description: 'Sterling silver pendant featuring a wildly detailed skull motif. Perfect for the Rebel at Heart collection.',
                category: getCatId('rebel-at-heart'),
                images: [
                    { public_id: 'seed/prod4-1', url: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=800', isPrimary: true }
                ],
                basePrice: 8500,
                makingCharges: 1000,
                variants: [
                    { size: 'One Size', material: 'Sterling Silver', purity: '925', priceAmount: 9500, stockQuantity: 20, sku: 'RBL-SKL-925' }
                ],
                ratingsAverage: 4.9,
                ratingsQuantity: 8
            }
        ];

        await Product.insertMany(productsData);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
