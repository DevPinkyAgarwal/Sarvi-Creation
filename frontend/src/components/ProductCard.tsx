import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { motion } from 'framer-motion';
import QuickViewModal from './QuickViewModal';
import { optimizeImage } from '../utils/image';

interface ProductCardProps {
    product: any;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const { toggleItem, isInWishlist } = useWishlistStore();
    
    const primaryImage = optimizeImage(product.images[0]?.url, { width: 600, height: 800, crop: 'fill' });
    const secondaryImage = optimizeImage(product.images[1]?.url || product.images[0]?.url, { width: 600, height: 800, crop: 'fill' });

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem({
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.basePrice,
            image: product.images[0]?.url
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.6 }}
            className="group flex flex-col space-y-5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] rounded-2xl group/img">
                {/* Brand Identifier */}
                <div className="absolute top-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Sarvi <span className="text-gray-300">Est. 2026</span>
                    </p>
                </div>

                {/* Primary Image */}
                <motion.img
                    src={primaryImage}
                    alt={product.name}
                    animate={{ 
                        opacity: isHovered && product.images.length > 1 ? 0 : 1,
                        scale: isHovered ? 1.02 : 1
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Secondary Image (Hover) */}
                {product.images.length > 1 && (
                    <motion.img
                        src={secondaryImage}
                        alt={`${product.name} detail`}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1.02 : 1.05
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

                {/* Actions */}
                <button 
                    onClick={handleWishlist}
                    className={`absolute top-6 right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 transform ${isInWishlist(product._id) ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/90 backdrop-blur-md text-gray-900 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0'}`}
                >
                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Actions Bottom */}
                <div className="absolute inset-x-6 bottom-6 z-20 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.22,1,0.36,1]">
                    <button 
                        onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
                        className="flex-1 bg-white/90 backdrop-blur-md text-gray-900 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                </div>
            </Link>

            <QuickViewModal 
                product={product} 
                isOpen={isQuickViewOpen} 
                onClose={() => setIsQuickViewOpen(false)} 
            />

            {/* Info */}
            <div className="flex flex-col items-center text-center space-y-2">
                <Link to={`/product/${product.slug}`} className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{product.categories?.[0]?.name || 'Fine Jewelry'}</p>
                    <h3 className="text-sm font-medium text-gray-900 tracking-wide hover:text-gray-500 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                
                <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-gray-900 tracking-wider">
                        ₹{product.basePrice.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
