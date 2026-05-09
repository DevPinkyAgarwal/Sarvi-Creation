import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import MetaTags from '../components/MetaTags';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState(1000000);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const category = slug || searchParams.get('category') || '';
            const search = searchParams.get('search') || '';
            const { data } = await api.get(`/products?category=${category}&search=${encodeURIComponent(search)}&sort=${sortBy}&maxPrice=${priceRange}&limit=40`);
            setProducts(data.products || []);
        } catch (err) {
            console.error("ProductsPage: Fetch failed", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [slug, searchParams, sortBy, priceRange]);

    return (
        <div className="w-full px-6 sm:px-10 lg:px-16 py-12 space-y-12 bg-white min-h-screen">
            <MetaTags 
                title={slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Our Collections'}
                description={`Discover our exclusive ${slug ? slug.replace(/-/g, ' ') : 'jewelry'} collection. Handcrafted excellence by Sarvi Creation.`}
            />
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto pt-10">
                <div className="flex items-center gap-4 mb-2">
                    <span className="h-px w-8 bg-gray-200"></span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase italic">Collection</span>
                    <span className="h-px w-8 bg-gray-200"></span>
                </div>
                <h1 className="text-4xl lg:text-7xl font-serif text-gray-900 tracking-tight leading-none uppercase">
                    {searchParams.get('search')
                        ? `Findings for "${searchParams.get('search')}"`
                        : slug ? slug.replace(/-/g, ' ') : 'Our Collections'}
                </h1>
            </div>

            {/* Premium Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-y border-gray-100">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${showFilters ? 'text-[#D4AF37]' : 'text-gray-900'}`}
                    >
                        <Filter className={`w-3.5 h-3.5 transition-transform duration-500 ${showFilters ? 'rotate-180' : ''}`} />
                        {showFilters ? 'Hide Filters' : 'Filter Selection'}
                    </button>
                    <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        {products.length} Masterpieces Found
                    </span>
                </div>

                <div className="flex items-center gap-4 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Sort By</span>
                    <div className="relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-transparent pr-10 pl-2 py-1 text-[11px] font-bold tracking-[0.1em] uppercase focus:outline-none cursor-pointer border-b border-transparent hover:border-gray-900 transition-all"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <SlidersHorizontal className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Filter Sidebar */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.aside
                            initial={{ opacity: 0, width: 0, x: -20 }}
                            animate={{ opacity: 1, width: 280, x: 0 }}
                            exit={{ opacity: 0, width: 0, x: -20 }}
                            className="space-y-12 shrink-0 overflow-hidden"
                        >
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Price Range</h4>
                                <div className="space-y-4">
                                    <input 
                                        type="range" 
                                        min="1000" 
                                        max="2000000" 
                                        step="10000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>₹1,000</span>
                                        <span className="text-black">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Availability</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-black focus:ring-0" />
                                        <span className="text-[11px] text-gray-500 group-hover:text-black transition-colors uppercase tracking-wider">In Stock Only</span>
                                    </label>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-24 text-center space-y-6 bg-[#FAF9F6] rounded-[2.5rem]">
                            <SlidersHorizontal className="w-12 h-12 text-gray-200 mx-auto" />
                            <div className="space-y-2">
                                <p className="text-gray-900 font-serif text-xl italic">No pieces found</p>
                                <p className="text-gray-400 text-sm font-light">Try adjusting your filters or search query.</p>
                            </div>
                            <button 
                                onClick={() => { setPriceRange(2000000); setSortBy('newest'); }}
                                className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
                            {products.map((p: any) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
