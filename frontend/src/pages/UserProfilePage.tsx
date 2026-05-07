import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { User, Package, MapPin, LogOut, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Mail, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Order {
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    orderItems: any[];
}

const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

export default function UserProfilePage() {
    const { user, logout, setUser } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
    
    // Profile Edit State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                console.error("Profile: Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: sanitizeInput(profileData.name),
                phone: profileData.phone.replace(/[^0-9]/g, '')
            });
            setUser(data);
            toast.success('Profile updated successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const statusIcons: any = {
        Pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
        Processing: <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
        Shipped: <Truck className="w-3.5 h-3.5 text-indigo-500" />,
        Delivered: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
        Cancelled: <XCircle className="w-3.5 h-3.5 text-rose-500" />
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-black/10"
                        >
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-3xl font-serif">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif tracking-tight uppercase">{user.name}</h2>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{user.email}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 text-[10px] font-bold text-gray-400 hover:text-rose-400 transition-colors uppercase tracking-[0.3em] group"
                                >
                                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>

                        <nav className="space-y-2">
                            {[
                                { id: 'orders', label: 'Order History', icon: Package },
                                { id: 'profile', label: 'Account Details', icon: User },
                                { id: 'addresses', label: 'My Addresses', icon: MapPin }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${
                                        activeTab === tab.id 
                                        ? 'bg-white border-gray-100 text-black shadow-sm' 
                                        : 'bg-transparent border-transparent text-gray-400 hover:text-black'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#D4AF37]' : ''}`} />
                                        {tab.label}
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-1' : 'opacity-0'}`} />
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div 
                                    key="orders"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-tight">Order History</h1>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100">
                                            {orders.length} TOTAL RESERVATIONS
                                        </span>
                                    </div>

                                    {loading ? (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retrieving your collection...</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="py-32 bg-white rounded-[3rem] border border-gray-100 text-center space-y-6">
                                            <Package className="w-12 h-12 text-gray-100 mx-auto" />
                                            <div className="space-y-2">
                                                <p className="text-xl font-serif italic text-gray-900">Your journey hasn't started yet</p>
                                                <p className="text-sm text-gray-400 font-light">Explore our collections to find your first masterpiece.</p>
                                            </div>
                                            <Link to="/products" className="inline-block px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all">
                                                Explore Collections
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map(order => (
                                                <div key={order._id} className="p-8 bg-white border border-gray-50 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-[#FAF9F6] rounded-2xl flex items-center justify-center text-gray-400 font-mono text-[10px] font-bold transition-colors group-hover:bg-black group-hover:text-white">
                                                            #{order._id.slice(-4).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                            <p className="text-2xl font-serif text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`flex items-center gap-2 px-6 py-3 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                                                            order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                            order.status === 'Cancelled' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                            'bg-blue-50 border-blue-100 text-blue-600'
                                                        }`}>
                                                            {statusIcons[order.status] || <Clock className="w-3.5 h-3.5" />}
                                                            {order.status}
                                                        </div>
                                                        <Link to={`/order-success/${order._id}`} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-black hover:border-black transition-all">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'profile' && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-2xl space-y-12"
                                >
                                    <div className="space-y-4">
                                        <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-tight">Account Details</h1>
                                        <p className="text-gray-400 text-sm font-light">Update your personal information to enhance your experience.</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="bg-white rounded-[3rem] p-10 border border-gray-100 space-y-8 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Full Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full bg-[#FAF9F6] border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Email Address
                                                </label>
                                                <div className="w-full bg-[#FAF9F6] opacity-60 rounded-2xl py-4 px-6 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                                                    <Phone className="w-3 h-3" /> Mobile Number
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    placeholder="10-digit number"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full bg-[#FAF9F6] border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                disabled={updating}
                                                className="bg-black text-white px-12 py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center gap-4 group disabled:opacity-50"
                                            >
                                                {updating ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                                                {!updating && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'addresses' && (
                                <motion.div 
                                    key="addresses"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-12"
                                >
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-tight">Saved Addresses</h1>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
                                            + Add New Address
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                                                <div className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Default</div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Home Office</h4>
                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest leading-relaxed">
                                                    Current shipping details from your latest order will appear here.
                                                </p>
                                            </div>
                                            <div className="flex gap-6 pt-4 border-t border-gray-50">
                                                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Edit</button>
                                                <button className="text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-colors">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Link import for within component if needed (though already in App)
import { Link } from 'react-router-dom';
