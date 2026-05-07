import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImage } from '../utils/image';
import MetaTags from '../components/MetaTags';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <MetaTags title="Shopping Bag | Sarvi Creation" />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-serif text-gray-900 tracking-tight">Your bag is empty</h2>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                            Discover our latest collections and find the perfect piece to add to your collection.
                        </p>
                    </div>
                    <Link to="/products" className="inline-block bg-black text-white px-12 py-5 rounded-xl text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gray-900 transition-all shadow-xl shadow-black/10">
                        Explore Collection
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            <MetaTags title="Shopping Bag | Sarvi Creation" />
            
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 lg:pt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-gray-200"></span>
                            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Your Selection</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-tight uppercase">
                            Shopping Bag
                        </h1>
                    </div>
                    <p className="text-sm text-gray-400 font-light tracking-wide uppercase">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'} Selected
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-10">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, idx) => (
                                <motion.div 
                                    key={item.variantSku}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-gray-100 group"
                                >
                                    <Link to={`/product/${item.product}`} className="w-full sm:w-48 aspect-[4/5] rounded-2xl overflow-hidden bg-[#F8F8F8] border border-gray-100 shrink-0">
                                        <img 
                                            src={optimizeImage(item.image, { width: 400, height: 500, crop: 'fill' })} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                        />
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-between py-2">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-serif text-gray-900 leading-tight uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {item.variantSku !== 'default' ? `Size: ${item.variantSku}` : 'Standard Edition'}
                                                    </p>
                                                </div>
                                                <p className="text-xl font-sans font-light tracking-wider text-gray-900">
                                                    ₹{item.price.toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, Math.max(1, item.quantity - 1))}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantSku, Math.min(item.stock, item.quantity + 1))}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                
                                                <button
                                                    onClick={() => removeItem(item.variantSku)}
                                                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-rose-500 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-green-600">In Stock</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-light">Usually ships in 2-3 business days</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#FAF9F6] rounded-[2.5rem] p-10 lg:p-12 space-y-10"
                        >
                            <h3 className="text-2xl font-serif text-gray-900 tracking-tight">Order Summary</h3>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{totalPrice().toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                                        <span className="text-gray-500">Estimated Shipping</span>
                                        <span className="text-green-600 font-bold">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                                        <span className="text-gray-500">Taxes (GST)</span>
                                        <span className="font-bold text-gray-900">Included</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-1">Total Amount</span>
                                        <p className="text-4xl font-sans font-light tracking-tight text-gray-900">
                                            ₹{totalPrice().toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Link to="/checkout" className="w-full bg-black text-white py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-2xl shadow-black/10 active:scale-[0.98] group">
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/products" className="block w-full py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                                    Continue Browsing
                                </Link>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Secure Payment</h4>
                                        <p className="text-[10px] text-gray-400 font-light">SSL Encrypted Transaction</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center opacity-40 grayscale filter scale-90 origin-left">
                                    <img src="https://img.icons8.com/color/48/visa.png" className="h-6 object-contain" alt="Visa" />
                                    <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5 object-contain" alt="Mastercard" />
                                    <img src="https://img.icons8.com/color/48/amex.png" className="h-6 object-contain" alt="Amex" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
