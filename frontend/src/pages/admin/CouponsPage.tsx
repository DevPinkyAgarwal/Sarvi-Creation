import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Percent, Calendar, Tag } from 'lucide-react';
import api from '../../lib/api';

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    expiryDate: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState<Partial<Coupon> | null>(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleOpenModal = (coupon: Coupon | null = null) => {
        setCurrentCoupon(coupon || {
            code: '',
            discountType: 'percentage',
            discountValue: 0,
            minPurchaseAmount: 0,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentCoupon?._id) {
                await api.put(`/coupons/${currentCoupon._id}`, currentCoupon);
            } else {
                await api.post('/coupons', currentCoupon);
            }
            setIsModalOpen(false);
            fetchCoupons();
        } catch (error) {
            console.error('Error saving coupon:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon code?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Coupons</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage discount codes and promotions</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading coupons...</div>
                ) : coupons.length === 0 ? (
                    <div className="p-12 text-center">
                        <Percent className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No coupons found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Code', 'Discount', 'Min. Purchase', 'Expiry', 'Usage', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map(coupon => {
                                const isExpired = new Date(coupon.expiryDate) < new Date();
                                return (
                                    <tr key={coupon._id} className="hover:bg-slate-50 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="font-mono font-bold text-slate-800">{coupon.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-slate-700">
                                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">₹{coupon.minPurchaseAmount || 0}</td>
                                        <td className="px-5 py-4">
                                            <div className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? 'text-red-500' : 'text-slate-500'}`}>
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-slate-700">{coupon.usedCount} used</span>
                                                {coupon.usageLimit && <span className="text-[10px] text-slate-400">Limit: {coupon.usageLimit}</span>}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${coupon.isActive && !isExpired ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenModal(coupon)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(coupon._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">
                                {currentCoupon?._id ? 'Edit Coupon' : 'Create New Coupon'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="E.G. SUMMER20"
                                        value={currentCoupon?.code || ''}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        value={currentCoupon?.discountType}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value as any })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (₹)</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                                    <input
                                        type="number"
                                        required
                                        value={currentCoupon?.discountValue || 0}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min. Purchase</label>
                                    <input
                                        type="number"
                                        value={currentCoupon?.minPurchaseAmount || 0}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, minPurchaseAmount: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={currentCoupon?.expiryDate?.split('T')[0] || ''}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiryDate: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="couponActive"
                                        checked={currentCoupon?.isActive ?? true}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, isActive: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="couponActive" className="text-sm font-medium text-slate-700">Active</label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
                                >
                                    {currentCoupon?._id ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
