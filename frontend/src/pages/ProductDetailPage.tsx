import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Star, ShieldCheck, Truck, ShoppingBag, Heart, Plus, Minus, ChevronRight, Check } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews from '../components/ProductReviews';
import MetaTags from '../components/MetaTags';
import SchemaOrg from '../components/SchemaOrg';
import { optimizeImage } from '../utils/image';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
    const [addedToCart, setAddedToCart] = useState(false);

    const addItem = useCartStore(state => state.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data);
                if (data.variants?.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        setAddedToCart(false);
        setQuantity(1);
    }, [slug]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    if (loading) return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <ProductDetailSkeleton />
        </div>
    );

    if (!product) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
            <h2 className="text-3xl font-serif text-gray-900">Piece Not Found</h2>
            <p className="text-gray-500 text-sm">We couldn't locate the jewelry you are looking for.</p>
            <Link to="/products" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-gray-800 transition-colors">
                Return to Collection
            </Link>
        </div>
    );

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addItem({
            product: product._id,
            name: product.name,
            variantSku: selectedVariant.sku,
            price: selectedVariant.priceAmount,
            image: product.images[0]?.url,
            quantity: quantity,
            stock: selectedVariant.stockQuantity
        });

        setAddedToCart(true);
        useCartStore.getState().setDrawerOpen(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <MetaTags 
                title={product.name}
                description={product.description?.substring(0, 160)}
                image={product.images[0]?.url}
                type="product"
            />
            
            {/* Structured Data */}
            <SchemaOrg 
                type="Product" 
                data={{
                    ...product,
                    sku: selectedVariant?.sku || product.variants[0]?.sku,
                    stockQuantity: selectedVariant?.stockQuantity || product.variants[0]?.stockQuantity
                }} 
            />
            <SchemaOrg 
                type="BreadcrumbList" 
                data={{
                    items: [
                        { name: 'Home', url: 'https://sarvicreation.com/' },
                        { 
                            name: product.categories?.[0]?.name || 'Collection', 
                            url: `https://sarvicreation.com/category/${product.categories?.[0]?.slug || 'trending-now'}` 
                        },
                        { name: product.name, url: window.location.href }
                    ]
                }} 
            />
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-8 lg:mb-12">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                <Link to={`/category/${product.categories?.[0]?.slug || 'trending-now'}`} className="hover:text-black transition-colors">
                    {product.categories?.[0]?.name || 'Collection'}
                </Link>
                <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* Images Section (Left side, takes 7 columns on desktop) */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:gap-6 lg:sticky lg:top-28">
                    {/* Thumbnail Strip */}
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0 shrink-0 md:w-20 lg:w-24">
                        {product.images.map((img: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-20 h-24 md:w-full md:h-auto md:aspect-[4/5] overflow-hidden bg-gray-50 flex-none group ${activeImage === i ? '' : 'opacity-60 hover:opacity-100 transition-opacity'}`}
                            >
                                <img src={optimizeImage(img.url, { width: 100, height: 125, crop: 'fill' })} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i + 1}`} />
                                {activeImage === i && (
                                    <div className="absolute inset-0 border border-black pointer-events-none"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Image View */}
                    <div
                        className="relative flex-1 aspect-[4/5] bg-[#F8F8F8] overflow-hidden cursor-crosshair group"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomPos(p => ({ ...p, show: false }))}
                    >
                        {/* Hover hint for zoom */}
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-widest text-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            Hover to zoom
                        </div>

                        <img
                            src={optimizeImage(product.images[activeImage]?.url, { width: 1200, height: 1500, crop: 'fill' })}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ease-out bg-[#F8F8F8] ${zoomPos.show ? 'scale-[1.8]' : 'scale-100'}`}
                            style={zoomPos.show ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                        />
                    </div>
                </div>

                {/* Info Section (Right side, takes 5 columns on desktop) */}
                <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8 w-full max-w-lg mx-auto lg:mx-0">

                    {/* Header info */}
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-start gap-4">
                            <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 leading-[1.1] tracking-tight">
                                {product.name}
                            </h1>
                            <button 
                                onClick={() => toggleItem({
                                    _id: product._id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.basePrice,
                                    image: product.images[0]?.url
                                })}
                                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isInWishlist(product._id) ? 'bg-rose-50 text-rose-500 shadow-sm' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50 border border-gray-100'}`}
                            >
                                <Heart className={`w-5 h-5 stroke-[1.5] ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage) ? 'text-black fill-black' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] text-gray-500 uppercase tracking-widest">
                                {product.ratingsQuantity} REVIEWS
                            </span>
                        </div>
                        <p className="text-3xl font-light text-gray-900">₹{product.basePrice.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 mb-8"></div>

                    {/* Description */}
                    <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed font-light">
                        <p>{product.description}</p>
                    </div>

                    {/* Product Options */}
                    <div className="space-y-8 mb-10">
                        {/* Variants Selection */}
                        {product.variants.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-black uppercase tracking-widest">Select Size</span>
                                    <button className="text-[11px] text-gray-500 border-b border-gray-400 hover:text-black hover:border-black transition-colors">Size Guide</button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {product.variants.map((v: any, i: number) => {
                                        const isSelected = selectedVariant?.sku === v.sku;
                                        const isLowStock = v.stockQuantity > 0 && v.stockQuantity < 5;
                                        const isOutOfStock = v.stockQuantity === 0;

                                        return (
                                            <button
                                                key={i}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`
                                                    relative py-3 px-4 text-xs tracking-wider transition-all duration-200 
                                                    ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 border hover:border-black'}
                                                    ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                                                `}
                                            >
                                                {v.size}
                                                {isOutOfStock && <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 -translate-y-1/2 rotate-[-15deg]"></div>}
                                                {isLowStock && !isOutOfStock && (
                                                    <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-400' : 'bg-rose-500'}`} title="Low stock"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-gray-500 uppercase tracking-wide">
                                        Material: <span className="text-black font-medium">{selectedVariant?.material || product.variants[0]?.material}</span>
                                    </span>
                                    {selectedVariant?.stockQuantity < 5 && selectedVariant?.stockQuantity > 0 && (
                                        <span className="text-rose-600">Only {selectedVariant.stockQuantity} left</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <span className="text-[11px] font-bold text-black uppercase tracking-widest block">Quantity</span>
                            <div className="inline-flex items-center border border-gray-200 h-12">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-12 text-center text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 1, quantity + 1))}
                                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="flex flex-col gap-3 mb-12">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                            className={`
                                w-full h-14 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300
                                ${(!selectedVariant || selectedVariant.stockQuantity === 0)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : addedToCart
                                        ? 'bg-[#1b4332] text-white hover:bg-[#1b4332]'
                                        : 'bg-black text-white hover:bg-black/80'}
                            `}
                        >
                            {addedToCart ? (
                                <>
                                    <Check className="w-4 h-4" /> Added To Bag
                                </>
                            ) : (!selectedVariant || selectedVariant.stockQuantity === 0) ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4" /> Add To Bag
                                </>
                            )}
                        </button>

                        <button
                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                            onClick={() => {
                                if (!selectedVariant) return;
                                addItem({
                                    product: product._id,
                                    name: product.name,
                                    variantSku: selectedVariant.sku,
                                    price: selectedVariant.priceAmount,
                                    image: product.images[0]?.url,
                                    quantity,
                                    stock: selectedVariant.stockQuantity,
                                });
                                navigate('/checkout');
                            }}
                            className={`
                                w-full h-14 border flex items-center justify-center text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300
                                ${(!selectedVariant || selectedVariant.stockQuantity === 0)
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                    : 'border-black text-black hover:bg-black hover:text-white'}
                            `}
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Assurance / Value Props underneath form */}
                    <div className="grid grid-cols-1 gap-5 pt-8 border-t border-gray-200">
                        <div className="group flex text-left gap-4 p-4 border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors">
                            <Truck className="w-5 h-5 text-gray-400 stroke-[1.5] group-hover:text-black transition-colors" />
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-1">Complimentary Delivery</h4>
                                <p className="text-[13px] text-gray-500">Secure, insured delivery within 3-5 business days.</p>
                            </div>
                        </div>

                        <div className="group flex text-left gap-4 p-4 border border-gray-100 hover:border-gray-200 hover:bg-[#F8F8F8] transition-colors">
                            <ShieldCheck className="w-5 h-5 text-gray-400 stroke-[1.5] group-hover:text-black transition-colors" />
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-1">Certified Hallmarked</h4>
                                <p className="text-[13px] text-gray-500">All the jewellery is hallmarked and 100% matches the description.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews product={product} />

            {/* Related Products */}
            <RelatedProducts 
                currentProductId={product._id} 
                categorySlug={product.categories?.[0]?.slug || 'trending-now'} 
            />

            {/* Custom CSS for hidden scrollbar on mobile gallery */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </div>
    );
}
