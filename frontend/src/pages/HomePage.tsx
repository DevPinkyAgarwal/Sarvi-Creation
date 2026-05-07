import { useEffect, useState } from 'react';
import api from '../lib/api';
import HeroSlider from '../components/HeroSlider';
import TrendingProducts from '../components/TrendingProducts';
import ShopByCategory from '../components/ShopByCategory';
import HeritageStory from '../components/HeritageStory';
import MetaTags from '../components/MetaTags';
import AmbassadorSection from '../components/AmbassadorSection';
import ExperienceSection from '../components/ExperienceSection';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: { url: string };
    productCount?: number;
}


export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/categories');
                // Filter out trending and inactive
                const filtered = data.filter((c: any) => c.slug !== 'trending-now' && c.isActive !== false);
                setCategories(filtered);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const displayCategories = categories.length > 0 ? categories : [];

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <MetaTags 
                title="Sarvi Creation | Luxury Jewelry & Fine Craftsmanship"
                description="Experience the epitome of quiet luxury with Sarvi Creation. Explore our curated collection of fine jewelry and premium accessories handcrafted with heritage."
            />
            {/* Global Background - Optimized for performance */}
            <div 
                className="fixed inset-0 z-0 pointer-events-none"
                style={{ 
                    background: 'radial-gradient(circle at 50% -20%, #ffffff 0%, #f1f5f9 100%)',
                    opacity: 0.8
                }} 
            />

            <div className="relative z-10 space-y-6 lg:space-y-10">
                <HeroSlider />

                {/* Shop by Category Grid */}
                <ShopByCategory categories={displayCategories} loading={loading} />

                {/* Trending Products Carousel */}
                <TrendingProducts />

                {/* Brand Ambassador / Featured Collection */}
                <AmbassadorSection />

                {/* Heritage & Craftsmanship Story */}
                <section style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px', willChange: 'transform' }}>
                    <HeritageStory />
                </section>



                {/* The Sarvi Experience Section (Redesigned) */}
                <ExperienceSection />

            </div>
        </div>
    );
}
