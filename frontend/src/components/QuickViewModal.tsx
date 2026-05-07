import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight, Star, ShieldCheck, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { toast } from 'sonner';
import { optimizeImage } from '../utils/image';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    
    const addItem = useCartStore(state => state.addItem);
    const { toggleWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        if (product && product.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
        setSelectedImage(0);
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        
        addItem({
            product: product._id,
            name: product.name,
            variantSku: selectedVariant.sku,
            price: selectedVariant.priceAmount || product.basePrice,
            image: product.images[0]?.url || '',
            quantity: quantity,
            stock: selectedVariant.stockQuantity || 10
        });
        
        setAddedToCart(true);
        useCartStore.getState().setDrawerOpen(true);
        toast.success('Added to bag');
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-black transition-colors shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Left: Image Gallery */}
                        <div className="w-full md:w-1/2 relative bg-[#F8F8F8] flex flex-col min-h-[300px]">
                            <div className="relative flex-1 overflow-hidden">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={optimizeImage(product.images[selectedImage]?.url || '', { width: 800, height: 1000, crop: 'fill' })}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                
                                {product.images?.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 hover:bg-white rounded-full transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 hover:bg-white rounded-full transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Thumbnails */}
                            <div className="flex gap-2 p-4 overflow-x-auto HideScrollbar bg-white/50">
                                {product.images?.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-black' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={optimizeImage(img.url, { width: 100, height: 100, crop: 'fill' })} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>Highly Recommended</span>
                                    </div>
                                    <h2 className="text-3xl font-serif text-gray-900 leading-tight uppercase tracking-tight">{product.name}</h2>
                                    <p className="text-2xl font-sans font-light tracking-wider text-gray-900">
                                        ₹{(selectedVariant?.priceAmount || product.basePrice).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="w-12 h-px bg-gray-200" />

                                <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-4">
                                    {product.description}
                                </p>

                                {/* Variants */}
                                {product.variants?.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Size</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {product.variants.map((variant: any) => (
                                                <button
                                                    key={variant.sku}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    disabled={variant.stockQuantity === 0}
                                                    className={`px-4 py-2 rounded-full text-[11px] font-medium tracking-wider border transition-all ${selectedVariant?.sku === variant.sku ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'} ${variant.stockQuantity === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                >
                                                    {variant.size || variant.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity & Actions */}
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50 transition-colors">-</button>
                                            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                                            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-gray-50 transition-colors">+</button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            className={`p-3 rounded-lg border transition-all ${isInWishlist(product._id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:text-black hover:border-gray-200'}`}
                                        >
                                            <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                                            className={`w-full py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/10 active:scale-[0.98] ${addedToCart ? 'bg-green-700 text-white shadow-green-900/10' : 'bg-black text-white hover:bg-gray-900'} ${(!selectedVariant || selectedVariant.stockQuantity === 0) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                        >
                                            {addedToCart ? <><Check className="w-4 h-4" /> Added to Bag</> : <><ShoppingBag className="w-4 h-4" /> Add to Bag</>}
                                        </button>
                                        
                                        <Link 
                                            to={`/product/${product.slug}`}
                                            onClick={onClose}
                                            className="w-full py-5 border border-black rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] text-center text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            View Full Details <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="pt-8 border-t border-gray-50 flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-tight">Lifetime <br /> Authenticity</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="text-[10px] font-medium text-gray-400">
                                        Free shipping on all <br /> prepaid orders across India.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
