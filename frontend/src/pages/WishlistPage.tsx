import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import { optimizeImage } from '../utils/image';

export default function WishlistPage() {
    const items = useWishlistStore(state => state.items);
    const setDrawerOpen = useCartStore(state => state.setDrawerOpen);
    const removeItem = useWishlistStore(state => state.removeItem);
    const addItemToCart = useCartStore(state => state.addItem);

    const handleMoveToCart = (item: any) => {
        addItemToCart({
            product: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            variantSku: 'standard', // Fallback for simple wishlist move
            stock: 10 // Default fallback stock
        });
        removeItem(item._id);
        setDrawerOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20">
            <MetaTags 
                title="Your Wishlist | Sarvi Creation"
                description="View and manage your curated selection of luxury jewelry and fine craftsmanship."
            />
            
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-black"></span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase font-sans">Curated For You</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 tracking-tight leading-none uppercase">
                            Your <span className="italic text-gray-400">Wishlist</span>
                        </h1>
                    </div>
                    <p className="text-[11px] text-gray-500 tracking-[0.2em] uppercase font-bold">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
                    </p>
                </div>

                {items.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                            <Heart className="w-10 h-10 text-gray-200 stroke-[1]" />
                        </div>
                        <h2 className="text-2xl font-serif text-gray-900 mb-4 uppercase tracking-wider">Your wishlist is empty</h2>
                        <p className="text-sm text-gray-500 font-light max-w-md mx-auto mb-10 leading-relaxed">
                            Discover our exquisite collections and save your favorite pieces to view them later.
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all rounded-sm"
                        >
                            Explore Collections <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                                    className="group relative flex flex-col space-y-6"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-sm">
                                        <Link to={`/product/${item.slug}`} className="block w-full h-full">
                                            <img 
                                                src={optimizeImage(item.image, { width: 600, height: 800, crop: 'fill' })} 
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </Link>
                                        
                                        {/* Actions Overlay */}
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                            aria-label="Remove from wishlist"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                                            <button 
                                                onClick={() => handleMoveToCart(item)}
                                                className="w-full bg-black/90 backdrop-blur-md text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-2xl"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className="space-y-1">
                                            <Link to={`/product/${item.slug}`}>
                                                <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] hover:text-gray-500 transition-colors line-clamp-1">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-[14px] font-medium text-gray-900">
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100 w-12 mx-auto"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
