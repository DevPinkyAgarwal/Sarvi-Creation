import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, MapPin, Truck } from 'lucide-react';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { optimizeImage } from '../utils/image';

export default function OrderSuccessPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error("OrderSuccess: Failed to fetch order", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    return (
        <div className="min-h-screen bg-white pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-50 blur-3xl rounded-full" />
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="relative w-32 h-32 bg-white rounded-full border border-green-100 flex items-center justify-center mx-auto shadow-2xl"
                        >
                            <CheckCircle2 className="w-16 h-16 text-green-600 stroke-[1.2]" />
                        </motion.div>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="w-10 h-10 text-[#D4AF37] opacity-60" />
                        </motion.div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 tracking-tight uppercase">Masterpiece Reserved</h1>
                        <p className="text-gray-500 max-w-md mx-auto font-light leading-relaxed">
                            Thank you for your purchase. Your order <span className="text-black font-bold tracking-widest">#{id?.slice(-8).toUpperCase()}</span> has been placed successfully and is being prepared for hallmarking.
                        </p>
                    </div>

                    {order && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left mt-16"
                        >
                            {/* Order Details */}
                            <div className="md:col-span-8 bg-[#FAF9F6] rounded-[2.5rem] p-8 lg:p-10 space-y-8">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4">Order Summary</h3>
                                <div className="space-y-6">
                                    {order.orderItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-6 items-center">
                                            <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                                                <img 
                                                    src={optimizeImage(item.image, { width: 200, height: 250, crop: 'fill' })} 
                                                    alt={item.productName} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">{item.productName}</h4>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Qty: {item.quantity} • Size: {item.variantSku}</p>
                                                <p className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Paid</span>
                                    <span className="text-2xl font-serif text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="md:col-span-4 space-y-6">
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
                                    <div className="flex items-center gap-4 text-gray-900">
                                        <MapPin className="w-5 h-5 stroke-[1.5]" />
                                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Shipping To</h4>
                                    </div>
                                    <div className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                        {order.shippingAddress.street}, {order.shippingAddress.flatNo}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.pincode}<br />
                                        {order.shippingAddress.state}, {order.shippingAddress.country}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
                                    <div className="flex items-center gap-4 text-gray-900">
                                        <Truck className="w-5 h-5 stroke-[1.5]" />
                                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">Delivery</h4>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-gray-900">Arriving in 3-5 days</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Insured Logistics</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-12">
                        <Link to="/products" className="px-12 py-5 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group">
                            Continue Browsing
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/" className="px-12 py-5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 hover:border-black transition-all">
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
