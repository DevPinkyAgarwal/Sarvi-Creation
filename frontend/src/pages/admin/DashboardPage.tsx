import { useEffect, useState } from 'react';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../lib/api';
import { useSocket } from '../../hooks/useSocket';

interface DashboardData {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    revenueChart: { _id: { year: number; month: number }; revenue: number }[];
    topProducts: { productName: string; totalSold: number; revenue: number }[];
    lowStockProducts: { name: string; variants: { stockQuantity: number }[] }[];
    recentOrders: { _id: string; user: { name: string; email: string }; totalPrice: number; status: string; isPaid: boolean; createdAt: string }[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = () => {
        api.get('/orders/admin/dashboard')
            .then(res => { setData(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    };
    
    useEffect(() => {
        fetchStats();
    }, []);

    // Listen for real-time updates
    useSocket(() => {
        console.log('🔄 Refreshing dashboard stats due to real-time update...');
        fetchStats();
    });

    const chartData = data?.revenueChart.map(r => ({
        month: MONTHS[(r._id.month ?? 1) - 1],
        revenue: r.revenue,
    })) || [];

    const statCards = [
        {
            label: 'Total Revenue',
            value: data ? `₹${data.totalRevenue.toLocaleString('en-IN')}` : '—',
            icon: TrendingUp,
        },
        {
            label: 'Total Orders',
            value: data?.totalOrders ?? '—',
            icon: ShoppingCart,
        },
        {
            label: 'Pending Orders',
            value: data?.pendingOrders ?? '—',
            icon: Package,
        },
    ];

    return (
        <div className="space-y-8 font-sans pb-12">
            <div>
                <h2 className="text-3xl font-serif text-[#0f172a] tracking-wide">Dashboard</h2>
                <p className="text-slate-500 text-sm mt-1 font-light tracking-wide uppercase text-[11px]">Welcome back, Admin. Here is your overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white p-6 border-b border-l border-slate-200 hover:border-slate-300 transition-colors shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-medium">{label}</span>
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
                        </div>
                        <p className="text-3xl font-serif text-slate-900 tracking-tight">{loading ? '...' : value}</p>
                        
                        {/* Subtle bottom edge highlight */}
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 border-t border-r border-slate-200 shadow-sm">
                    <h3 className="text-sm font-serif uppercase tracking-[0.1em] text-slate-900 mb-8">Revenue (Last 6 Months)</h3>
                    {loading ? (
                        <div className="h-52 flex items-center justify-center text-slate-400 font-serif italic text-sm">Loading chart...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'serif' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'serif' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} dx={-10} />
                                <Tooltip
                                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none', fontFamily: 'sans-serif', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={1.5} fill="url(#revenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 border-b border-l border-slate-200 shadow-sm">
                    <h3 className="text-sm font-serif uppercase tracking-[0.1em] text-slate-900 mb-8">Top Products</h3>
                    {loading ? (
                        <div className="text-slate-400 font-serif italic text-sm">Loading...</div>
                    ) : (
                        <ul className="space-y-6">
                            {(data?.topProducts || []).map((p, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-medium text-slate-500 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-slate-900 truncate tracking-wide">{p.productName}</p>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">{p.totalSold} Units Sold</p>
                                    </div>
                                    <span className="text-[13px] font-medium text-slate-900">₹{(p.revenue / 1000).toFixed(1)}k</span>
                                </li>
                            ))}
                            {(data?.topProducts?.length ?? 0) === 0 && (
                                <p className="text-slate-400 text-sm">No sales data yet.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bottom Row: Recent Orders */}
            <div className="grid grid-cols-1 gap-8">
                {/* Recent Orders */}
                <div className="bg-white p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-serif uppercase tracking-[0.1em] text-slate-900">Recent Orders</h3>
                    </div>
                    {loading ? (
                        <div className="text-slate-400 font-serif italic text-sm">Loading orders...</div>
                    ) : (data?.recentOrders?.length ?? 0) === 0 ? (
                        <div className="text-slate-400 text-sm italic">No recent orders found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="pb-3 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">Order ID</th>
                                        <th className="pb-3 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">Customer</th>
                                        <th className="pb-3 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">Amount</th>
                                        <th className="pb-3 text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data?.recentOrders.map(order => (
                                        <tr key={order._id} className="group">
                                            <td className="py-4 text-[12px] font-mono text-slate-500">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="py-4">
                                                <p className="text-[13px] font-medium text-slate-900">{order.user?.name || 'Guest'}</p>
                                            </td>
                                            <td className="py-4 text-[13px] font-medium text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                            <td className="py-4">
                                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                                                    order.status === 'Delivered' ? 'border-green-200 text-green-700' :
                                                    order.status === 'Pending' ? 'border-amber-200 text-amber-700' :
                                                    'border-slate-200 text-slate-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
