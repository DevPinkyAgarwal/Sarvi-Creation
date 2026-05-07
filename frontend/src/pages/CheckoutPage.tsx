import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight, ChevronLeft, Lock, Truck, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Security: Simple input sanitization
const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

const InputField = ({ label, value, onChange, placeholder, required = false, type = "text", half = false }: any) => (
    <div className={`relative ${half ? 'md:col-span-1' : 'md:col-span-2'}`}>
        <label className="absolute -top-2 left-3 px-1 bg-white text-[9px] font-sans font-bold text-gray-500 uppercase tracking-widest z-10">
            {label}{required && '*'}
        </label>
        <input
            required={required}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-white border border-gray-200 rounded-md py-4 px-4 text-sm font-sans text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all placeholder:text-gray-300"
            placeholder={placeholder}
        />
    </div>
);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        flatNo: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    const couponDiscount = 0;
    const appliedCoupon = null;
    const [loading, setLoading] = useState(false);
    const [honeypot, setHoneypot] = useState(''); // Security: Bot protection

    // Calculate delivery date (today + 5 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const pincodeRegex = /^\d{6}$/;

        if (shippingAddress.firstName.length < 2) {
            toast.error('First name must be at least 2 characters.');
            return false;
        }
        if (shippingAddress.lastName.length < 2) {
            toast.error('Last name must be at least 2 characters.');
            return false;
        }
        if (shippingAddress.address.length < 5) {
            toast.error('Please enter a more complete street address.');
            return false;
        }
        if (shippingAddress.city.length < 2) {
            toast.error('City name must be at least 2 characters.');
            return false;
        }
        if (shippingAddress.state.length < 2) {
            toast.error('State name must be at least 2 characters.');
            return false;
        }
        if (shippingAddress.flatNo && shippingAddress.flatNo.length < 1) {
            toast.error('Please enter a valid Flat or Building details.');
            return false;
        }
        if (shippingAddress.landmark && shippingAddress.landmark.length < 3) {
            toast.error('Landmark should be at least 3 characters for better delivery accuracy.');
            return false;
        }
        if (!emailRegex.test(shippingAddress.email)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (!phoneRegex.test(shippingAddress.phone.replace(/[^0-9]/g, ''))) {
            toast.error('Please enter a valid 10-digit mobile number.');
            return false;
        }
        if (!pincodeRegex.test(shippingAddress.postalCode)) {
            toast.error('Please enter a valid 6-digit pincode.');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Security: Bot check
        if (honeypot) return;

        if (!user) {
            navigate('/login?redirect=checkout');
            return;
        }

        if (!validateForm()) return;

        const finalTotalAmount = totalPrice() - couponDiscount;
        setLoading(true);
        
        try {
            const orderData = {
                orderItems: items.map(i => ({
                    product: i.product,
                    productName: i.name,
                    variantSku: i.variantSku,
                    quantity: i.quantity,
                    price: i.price,
                    image: i.image // Required by backend model
                })),
                shippingAddress: {
                    firstName: sanitizeInput(shippingAddress.firstName),
                    lastName: sanitizeInput(shippingAddress.lastName),
                    phone: shippingAddress.phone.replace(/[^0-9]/g, ''),
                    email: sanitizeInput(shippingAddress.email),
                    street: sanitizeInput(shippingAddress.address),
                    flatNo: sanitizeInput(shippingAddress.flatNo),
                    landmark: sanitizeInput(shippingAddress.landmark),
                    city: sanitizeInput(shippingAddress.city),
                    state: sanitizeInput(shippingAddress.state),
                    pincode: sanitizeInput(shippingAddress.postalCode),
                    country: shippingAddress.country
                },
                paymentMethod: 'Razorpay',
                itemsPrice: totalPrice(),
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: finalTotalAmount,
                couponCode: appliedCoupon
            };

            const { data: dbOrder } = await api.post('/orders', orderData);
            const { data: rzpOrder } = await api.post('/payment/razorpay', { 
                amount: finalTotalAmount, 
                orderId: dbOrder._id 
            });

            const res = await loadRazorpay();
            if (!res) {
                toast.error('Payment gateway failed to load.');
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: rzpOrder.amount,
                currency: 'INR',
                name: 'Sarvi Creation',
                description: 'Luxury Jewelry Purchase',
                order_id: rzpOrder.id,
                handler: async function (response: any) {
                    try {
                        await api.post('/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: dbOrder._id
                        });
                        
                        clearCart();
                        toast.success('Order placed successfully!');
                        navigate(`/order-success/${dbOrder._id}`);
                    } catch (err) {
                        toast.error('Payment verification failed.');
                    }
                },
                prefill: {
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    email: shippingAddress.email,
                    contact: shippingAddress.phone
                },
                theme: {
                    color: '#1a1a1a'
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Order placement failed:', error);
            toast.error('Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const finalTotal = totalPrice() - couponDiscount;

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-24">
            <div className="max-w-[1350px] mx-auto px-6 lg:px-12">
                
                {/* Top Nav/Breadcrumb */}
                <div className="mb-10 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/cart')}
                        className="group inline-flex items-center gap-2 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Return to Bag
                    </button>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Detailed Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        <div className="bg-white border border-gray-100 rounded-xl p-8 lg:p-10 space-y-10 shadow-sm">
                            {/* Security: Honeypot */}
                            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                            {/* Section: Shipping */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    <h2 className="text-base font-sans font-bold text-gray-900 uppercase tracking-widest">Shipping Address</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <InputField 
                                        label="Street Address"
                                        required 
                                        value={shippingAddress.address}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        placeholder="Enter your street address"
                                    />
                                    
                                    <InputField 
                                        label="Flat / Building"
                                        half
                                        value={shippingAddress.flatNo}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, flatNo: e.target.value })}
                                        placeholder="Flat or building name"
                                    />

                                    <InputField 
                                        label="Landmark"
                                        half
                                        value={shippingAddress.landmark}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                                        placeholder="E.g. Near City Park"
                                    />

                                    <div className="relative md:col-span-1">
                                        <label className="absolute -top-2 left-3 px-1 bg-white text-[9px] font-sans font-bold text-gray-500 uppercase tracking-widest z-10">
                                            Country
                                        </label>
                                        <div className="w-full bg-gray-50 border border-gray-200 rounded-md py-4 px-4 text-sm font-sans text-gray-400">
                                            India
                                        </div>
                                    </div>

                                    <InputField 
                                        label="State"
                                        half
                                        required
                                        value={shippingAddress.state}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        placeholder="Enter state"
                                    />

                                    <InputField 
                                        label="City"
                                        half
                                        required
                                        value={shippingAddress.city}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        placeholder="Enter city"
                                    />

                                    <InputField 
                                        label="Pincode"
                                        half
                                        required
                                        value={shippingAddress.postalCode}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        placeholder="6-digit PIN"
                                    />
                                </div>
                            </div>

                            {/* Section: Contact */}
                            <div className="space-y-8 pt-8 border-t border-gray-50">
                                <h2 className="text-base font-sans font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4">Contact Details</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <InputField 
                                        label="First Name"
                                        half
                                        required
                                        value={shippingAddress.firstName}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                        placeholder="Your first name"
                                    />
                                    <InputField 
                                        label="Last Name"
                                        half
                                        required
                                        value={shippingAddress.lastName}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                        placeholder="Your last name"
                                    />
                                    <InputField 
                                        label="Mobile Number"
                                        required
                                        value={shippingAddress.phone}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        placeholder="10-digit mobile number"
                                    />
                                    <InputField 
                                        label="Email"
                                        type="email"
                                        value={shippingAddress.email}
                                        onChange={(e: any) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                        placeholder="yourname@example.com"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-4 pt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black" />
                                    <span className="text-[11px] font-sans text-gray-600 tracking-wide group-hover:text-black transition-colors">Keep my Shipping and Billing Addresses same</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black" />
                                    <span className="text-[11px] font-sans text-gray-600 tracking-wide group-hover:text-black transition-colors">Sign up for offers and updates from Sarvi Creation.</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Summary Column */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        <div className="space-y-6 sticky top-32">
                            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm space-y-8">
                                <h3 className="text-sm font-sans font-bold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Order Summary
                                </h3>

                                {/* Items Card List */}
                                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.variantSku} className="bg-[#FAF9F6]/50 border border-gray-100 rounded-lg p-4 flex gap-4">
                                            <div className="w-16 h-16 bg-white overflow-hidden rounded-md shrink-0 border border-gray-50">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-[10px] font-sans font-bold text-gray-900 uppercase tracking-widest leading-tight line-clamp-2">{item.name}</p>
                                                <p className="text-[9px] font-sans text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                <p className="text-[11px] font-sans font-bold text-gray-900 tracking-wider">₹{item.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center text-[11px] font-sans text-gray-500 tracking-wide">
                                        <span>Subtotal (MRP)</span>
                                        <span className="text-gray-900 font-bold">₹{totalPrice().toLocaleString('en-IN')}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between items-center text-[11px] font-sans text-[#D4AF37] tracking-wide">
                                            <span>Product Discount</span>
                                            <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[11px] font-sans text-gray-500 tracking-wide">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold">Free</span>
                                    </div>
                                    
                                    <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                                        <span className="text-sm font-sans font-bold text-gray-900">Order Total <span className="text-[10px] font-normal text-gray-400 lowercase">(including GST)</span></span>
                                        <span className="text-xl font-sans font-bold text-gray-900 tracking-wider">₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white py-5 rounded-md text-[11px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 shadow-xl shadow-black/10"
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        {loading ? 'Processing...' : 'Proceed to Payment'}
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-white border border-gray-100 rounded-xl p-6 grid grid-cols-2 gap-8 items-center shadow-sm">
                                <div className="flex flex-col items-center gap-2 text-center group">
                                    <BadgeCheck className="w-7 h-7 text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-widest group-hover:text-black leading-tight">BIS Hallmark</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center group">
                                    <BadgeCheck className="w-7 h-7 text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-widest group-hover:text-black leading-tight">Free Returns</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}
