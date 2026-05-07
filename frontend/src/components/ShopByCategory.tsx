import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/image';
import { motion } from 'framer-motion';
import { CategorySkeleton } from './SkeletonLoader';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: { url: string };
}

interface ShopByCategoryProps {
    categories: Category[];
    loading?: boolean;
}

export default function ShopByCategory({ categories, loading }: ShopByCategoryProps) {
    // We only want exactly 6 categories as requested
    const displayCategories = categories.slice(0, 6);

    if (!loading && displayCategories.length === 0) return null;

    return (
        <section className="w-full pt-12 pb-8 bg-white" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex flex-col items-center text-center space-y-6 mb-12 lg:mb-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4 opacity-50">
                            <span className="h-[1px] w-12 bg-gray-300"></span>
                            <span className="text-[9px] font-bold tracking-[0.4em] text-gray-500 uppercase">Discover Collections</span>
                            <span className="h-[1px] w-12 bg-gray-300"></span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif text-[#0f172a] tracking-normal leading-none uppercase mt-2">
                            Shop by Category
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => <CategorySkeleton key={i} />)
                    ) : (
                        displayCategories.map((cat, index) => (
                            <motion.div 
                                key={cat._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                                className="group flex flex-col items-center"
                            >
                                <Link to={`/category/${cat.slug}`} className="w-full flex flex-col items-center">
                                    <div className="w-full aspect-square overflow-hidden rounded-[24px] mb-4 bg-[#F8F8F8]">
                                        <img
                                            src={optimizeImage(cat.image?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e', { width: 600, height: 600, crop: 'fill', quality: 80 })}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="text-lg md:text-xl font-medium tracking-[0.05em] text-gray-900 group-hover:text-gray-500 transition-colors">
                                        {cat.name}
                                    </span>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
