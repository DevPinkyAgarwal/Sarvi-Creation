import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ChromaGrid from './animations/ChromaGrid/ChromaGrid';
import { optimizeImage } from '../utils/image';


interface Product {
    _id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
    slug: string;
    images: { url: string }[];
    categories: { name: string }[];
}

export default function TrendingProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetching products from the 'trending-now' category
                const { data } = await api.get('/products?category=trending-now&limit=50');
                
                if (data.products && data.products.length > 0) {
                    // Shuffle the products and take the first 8
                    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                    setProducts(shuffled.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching trending products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const chromaItems = products.map(product => ({
        image: optimizeImage(product.images[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e', { width: 800, height: 1000, crop: 'fill', quality: 75 }),
        title: product.name,
        subtitle: product.categories && product.categories.length > 0 ? product.categories[0].name : 'Collection',
        handle: `₹${product.basePrice.toLocaleString('en-IN')}`,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        gradient: 'transparent',
        url: `/product/${product.slug}`
    }));

    if (loading && products.length === 0) {
        return <div className="h-[400px] flex items-center justify-center text-gray-400 font-serif italic">Loading Collections...</div>;
    }

    // Fallback if no products found in trending-now category
    if (!loading && products.length === 0) {
        return null; // Or show a fallback message
    }

    return (
        <section className="relative max-w-[1600px] mx-auto pt-4 pb-8 lg:pt-8 lg:pb-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-6 mb-12 lg:mb-16">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-4 opacity-50">
                        <span className="h-[1px] w-12 bg-gray-300"></span>
                        <span className="text-[9px] font-bold tracking-[0.4em] text-gray-500 uppercase">Curated Selection</span>
                        <span className="h-[1px] w-12 bg-gray-300"></span>
                    </div>
                    <h2 className="text-4xl lg:text-[56px] font-serif text-[#0f172a] tracking-normal leading-none uppercase mt-2">
                        Trending Now
                    </h2>
                </div>
                <p className="text-[10px] lg:text-[11px] text-gray-400 font-medium max-w-2xl mx-auto leading-loose tracking-[0.2em] uppercase">
                    A carefully chosen selection of our most popular, handcrafted jewelry pieces.
                </p>
                <div className="pt-2">
                    <Link to="/category/trending-now" className="inline-block text-[10px] lg:text-[11px] font-bold tracking-[0.3em] uppercase text-gray-800 border-b border-gray-800 pb-2 hover:text-gray-500 hover:border-gray-500 transition-colors">
                        View All Trending Products
                    </Link>
                </div>
            </div>

            <div className="relative min-h-[400px] w-full py-0 overflow-hidden text-left">
                <ChromaGrid 
                    items={chromaItems}
                    radius={500}
                    columns={4}
                    rows={2}
                    damping={0.3}
                    fadeOut={1}
                    ease="power2.out"
                />
            </div>
        </section>
    );
}
