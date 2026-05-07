import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, PackageX } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
    variants: { sku: string; stockQuantity: number }[];
    images: { url: string }[];
    categories: { name: string }[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products?search=${search}&limit=50`);
            setProducts(data.products);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProducts(); };

    const toggleActive = async (id: string, current: boolean) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!current));
            await api.put(`/products/${id}`, formData);
            toast.success(`Product ${!current ? 'activated' : 'deactivated'}`);
            fetchProducts();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product permanently?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Products</h2>
                    <p className="text-slate-500 text-sm mt-1">{products.length} products total</p>
                </div>
                <a href="/products/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    Add Product
                </a>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </form>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center">
                        <PackageX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No products found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Product', 'Category', 'Base Price', 'Stock', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map(p => {
                                const totalStock = p.variants.reduce((s, v) => s + v.stockQuantity, 0);
                                return (
                                    <tr key={p._id} className="hover:bg-slate-50 transition">
                                        <td className="px-5 py-3.5 flex items-center gap-3">
                                            {p.images[0] ? (
                                                <img src={p.images[0].url} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt={p.name} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <PackageX className="w-4 h-4 text-slate-400" />
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-800 truncate max-w-[180px]">{p.name}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500">
                                            {p.categories?.length > 0 
                                                ? p.categories.map(c => c.name).join(', ') 
                                                : 'Uncategorized'}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-700 font-medium">₹{p.basePrice.toLocaleString('en-IN')}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold ${totalStock <= 5 ? 'text-red-500' : 'text-slate-600'}`}>{totalStock}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <button
                                                onClick={() => toggleActive(p._id, p.isActive)}
                                                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                                            >
                                                {p.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(p._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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
        </div>
    );
}
