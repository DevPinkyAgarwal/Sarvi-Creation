import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { optimizeImage } from '../utils/image';

export default function SideCart() {
    const { items, removeItem, updateQuantity, totalPrice, isDrawerOpen, setDrawerOpen } = useCartStore();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setDrawerOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDrawerOpen(false)}
                        className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[130] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-gray-900" />
                                <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-gray-900">Your Shopping Bag</h2>
                                <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {items.length}
                                </span>
                            </div>
                            <button 
                                onClick={() => setDrawerOpen(false)}
                                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-black" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto HideScrollbar p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <ShoppingBag className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-900 font-serif text-xl italic">Your bag is empty</p>
                                        <p className="text-gray-400 text-sm font-light">Explore our latest collections to find something special.</p>
                                    </div>
                                    <button 
                                        onClick={() => { setDrawerOpen(false); navigate('/products'); }}
                                        className="text-[11px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <motion.div 
                                            key={item.variantSku}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-5 group"
                                        >
                                            <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                                <img 
                                                    src={optimizeImage(item.image, { width: 200, height: 300, crop: 'fill' })} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider leading-tight">{item.name}</h3>
                                                        <button 
                                                            onClick={() => removeItem(item.variantSku)}
                                                            className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{item.variantSku !== 'default' ? item.variantSku : 'Standard Size'}</p>
                                                    <p className="text-[13px] font-bold text-gray-900 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-100 rounded-lg bg-white overflow-hidden scale-90 -ml-2">
                                                        <button 
                                                            onClick={() => updateQuantity(item.variantSku, Math.max(1, item.quantity - 1))}
                                                            className="px-3 py-1.5 hover:bg-gray-50 text-gray-500"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-[12px] font-bold text-gray-900">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.variantSku, Math.min(item.stock, item.quantity + 1))}
                                                            className="px-3 py-1.5 hover:bg-gray-50 text-gray-500"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-[#FAF9F6] space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] text-gray-500 uppercase tracking-widest">Subtotal</span>
                                        <span className="text-xl font-bold text-gray-900 tracking-tight">₹{totalPrice().toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                                        Shipping and taxes calculated at checkout. Free shipping on all prepaid orders.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full bg-black text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                                    >
                                        Checkout Now
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setDrawerOpen(false)}
                                        className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 opacity-40">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Secure Payments by Razorpay</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
