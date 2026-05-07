import { useEffect, useState } from 'react';
import { Package, Search, Filter, ChevronRight, X, Phone, Mail, MapPin, CreditCard, ShoppingBag, User } from 'lucide-react';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
    _id: string;
    user: { name: string; email: string };
    totalPrice: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    isPaid: boolean;
    paidAt?: string;
    createdAt: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
        street: string;
        flatNo?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    orderItems: {
        productName: string;
        quantity: number;
        price: number;
        variantSku: string;
    }[];
}

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-indigo-100 text-indigo-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
    Refunded: 'bg-slate-100 text-slate-700',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all'); // all, paid, unpaid
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Note: Adjusting the API call to include payment filter if supported, 
            // otherwise we'll filter on the frontend for simplicity in this step.
            const { data } = await api.get(`/orders/admin/all?page=${page}&status=${statusFilter}`);
            setOrders(data.orders);
            setTotalPages(data.pages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [page, statusFilter]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.put(`/orders/admin/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPayment = paymentFilter === 'all' ? true : 
                              paymentFilter === 'paid' ? order.isPaid : !order.isPaid;
        return matchesSearch && matchesPayment;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage customer orders and track abandoned carts</p>
                </div>
            </div>

            {/* Stats / Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                    onClick={() => setPaymentFilter('all')}
                    className={`p-4 rounded-2xl border text-left transition-all ${paymentFilter === 'all' ? 'bg-white border-blue-200 ring-2 ring-blue-500/10 shadow-md' : 'bg-white/50 border-slate-100 hover:border-slate-200'}`}
                >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{orders.length}</p>
                </button>
                <button 
                    onClick={() => setPaymentFilter('paid')}
                    className={`p-4 rounded-2xl border text-left transition-all ${paymentFilter === 'paid' ? 'bg-white border-emerald-200 ring-2 ring-emerald-500/10 shadow-md' : 'bg-white/50 border-slate-100 hover:border-slate-200'}`}
                >
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Paid Orders</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{orders.filter(o => o.isPaid).length}</p>
                </button>
                <button 
                    onClick={() => setPaymentFilter('unpaid')}
                    className={`p-4 rounded-2xl border text-left transition-all ${paymentFilter === 'unpaid' ? 'bg-white border-rose-200 ring-2 ring-rose-500/10 shadow-md' : 'bg-white/50 border-slate-100 hover:border-slate-200'}`}
                >
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Abandoned / Unpaid</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{orders.filter(o => !o.isPaid).length}</p>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="flex-1 sm:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No orders found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3 transition-colors">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map(order => {
                                return (
                                    <tr key={order._id} className="hover:bg-slate-50 transition">
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs font-semibold text-blue-600 truncate">#{order._id.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-800">{order.shippingAddress?.firstName || order.user.name} {order.shippingAddress?.lastName || ''}</span>
                                                <span className="text-xs text-slate-400">{order.shippingAddress?.email || order.user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4 text-slate-800 font-semibold">
                                            ₹{order.totalPrice.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                {order.isPaid ? 'Paid' : 'Abandoned'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 transition-all ${statusColors[order.status]}`}
                                            >
                                                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition group"
                                            >
                                                <span>View</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${page === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-400 hover:text-blue-600'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Order Details</h3>
                                        <p className="text-xs text-slate-400 font-mono">#{selectedOrder._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Grid: Customer & Payment */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3 h-3" /> Customer Details
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Mail className="w-3.5 h-3.5" /> {selectedOrder.shippingAddress?.email || selectedOrder.user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone className="w-3.5 h-3.5" /> {selectedOrder.shippingAddress?.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" /> Payment Summary
                                        </h4>
                                        <div className={`p-4 rounded-2xl border ${selectedOrder.isPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-medium text-slate-500">Status</span>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${selectedOrder.isPaid ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                                                    {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Total Amount</span>
                                                <span className="text-sm font-bold text-slate-800">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
                                            </div>
                                            {selectedOrder.paidAt && (
                                                <p className="text-[10px] text-slate-400 mt-2">Paid on: {new Date(selectedOrder.paidAt).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Shipping Address
                                    </h4>
                                    <div className="bg-slate-50 p-6 rounded-2xl text-sm text-slate-700 leading-relaxed">
                                        <p className="font-semibold text-slate-800 mb-1">{selectedOrder.shippingAddress?.street}</p>
                                        {selectedOrder.shippingAddress?.flatNo && <p>Flat/Building: {selectedOrder.shippingAddress.flatNo}</p>}
                                        {selectedOrder.shippingAddress?.landmark && <p>Landmark: {selectedOrder.shippingAddress.landmark}</p>}
                                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                        <p className="font-mono text-xs mt-2 text-slate-500">{selectedOrder.shippingAddress?.pincode}, {selectedOrder.shippingAddress?.country}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <ShoppingBag className="w-3 h-3" /> Order Items
                                    </h4>
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400">Product</th>
                                                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-400">Qty</th>
                                                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-400">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {selectedOrder.orderItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3">
                                                            <p className="font-medium text-slate-800">{item.productName}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{item.variantSku}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-800">₹{item.price.toLocaleString('en-IN')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
