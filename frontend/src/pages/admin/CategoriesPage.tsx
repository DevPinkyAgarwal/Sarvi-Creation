import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag, Image as ImageIcon, Search } from 'lucide-react';
import api from '../../lib/api';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image?: { url: string };
    isActive: boolean;
    section: 'category' | 'collection' | 'material' | 'discover';
}

interface Product {
    _id: string;
    name: string;
    images: { url: string }[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // Product Management State
    const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const { data } = await api.get('/products?limit=50');
            setAllProducts(data.products);
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };

    const fetchCategoryProducts = async (catId: string) => {
        try {
            const { data } = await api.get(`/products?category=${catId}&limit=100`);
            setCategoryProducts(data.products);
        } catch (error) {
            console.error('Error fetching category products:', error);
        }
    };

    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const { data } = await api.get(`/products?search=${query}&limit=10`);
            setSearchResults(data.products);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => { 
        fetchCategories(); 
        fetchAllProducts();
    }, []);

    const handleOpenModal = (category: Category | null = null) => {
        setCurrentCategory(category || { name: '', description: '', isActive: true, section: 'collection' });
        setImageFile(null);
        setActiveTab('details');
        setCategoryProducts([]);
        setSearchQuery('');
        setSearchResults([]);
        if (category) {
            fetchCategoryProducts(category.slug);
            fetchAllProducts();
        }
        setIsEditModalOpen(true);
    };

    const handleAddProduct = async (productId: string) => {
        if (!currentCategory?._id) return;
        try {
            await api.put(`/categories/${currentCategory._id}/products`, {
                addProductIds: [productId]
            });
            fetchCategoryProducts(currentCategory.slug!);
            setSearchQuery('');
            setSearchResults([]);
            fetchAllProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleRemoveProduct = async (productId: string) => {
        if (!currentCategory?._id) return;
        try {
            await api.put(`/categories/${currentCategory._id}/products`, {
                removeProductIds: [productId]
            });
            fetchCategoryProducts(currentCategory.slug!);
            fetchAllProducts();
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', currentCategory?.name || '');
        formData.append('description', currentCategory?.description || '');
        formData.append('isActive', String(currentCategory?.isActive ?? true));
        formData.append('section', currentCategory?.section || 'collection');
        if (imageFile) formData.append('image', imageFile);

        try {
            if (currentCategory?._id) {
                await api.put(`/categories/${currentCategory._id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
                    <p className="text-slate-500 text-sm mt-1">{categories.length} categories total</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center">
                        <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No categories found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Category', 'Description', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map(cat => (
                                <tr key={cat._id} className="hover:bg-slate-50 transition">
                                    <td className="px-5 py-3.5 flex items-center gap-3">
                                        {cat.image ? (
                                            <img src={cat.image.url} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt={cat.name} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Tag className="w-4 h-4 text-slate-400" />
                                            </div>
                                        )}
                                        <span className="font-medium text-slate-800">{cat.name}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 max-w-md truncate">{cat.description}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(cat)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                disabled={cat.slug === 'trending-now'}
                                                className={`p-1.5 rounded-lg transition ${cat.slug === 'trending-now' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                title={cat.slug === 'trending-now' ? 'Protected Category' : 'Delete Category'}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex border-b border-slate-100">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 p-4 font-semibold text-sm transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Category Details
                            </button>
                            {currentCategory?._id && (
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`flex-1 p-4 font-semibold text-sm transition-colors ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Products ({categoryProducts.length})
                                </button>
                            )}
                        </div>

                        {activeTab === 'details' ? (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentCategory?.name || ''}
                                            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={currentCategory?.description || ''}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        {(imageFile || currentCategory?.image) ? (
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : currentCategory?.image?.url}
                                                className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm"
                                                alt="Preview"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center border border-dashed border-slate-300 text-slate-400">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={currentCategory?.isActive ?? true}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, isActive: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Display this category on the website</label>
                                </div>
                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
                                    >
                                        {currentCategory?._id ? 'Save Changes' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for products to add..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            searchProducts(e.target.value);
                                        }}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Searching...</div>}

                                    {searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-xl mt-2 shadow-xl z-10 overflow-hidden divide-y divide-slate-50">
                                            {searchResults.map(p => (
                                                <div key={p._id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                                                    <div className="flex items-center gap-3">
                                                        <img src={p.images[0]?.url} className="w-8 h-8 rounded bg-slate-100 object-cover" />
                                                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddProduct(p._id)}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                            Current Products ({categoryProducts.length})
                                        </h4>
                                        {categoryProducts.length === 0 ? (
                                            <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 text-sm italic">No products currently in this category</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {categoryProducts.map(p => (
                                                    <div key={p._id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition group/item">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <img src={p.images[0]?.url} className="w-12 h-12 rounded-xl bg-slate-50 object-cover" />
                                                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
                                                            </div>
                                                            <span className="text-[13px] font-semibold text-slate-800">{p.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProduct(p._id)}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                                            title="Remove from category"
                                                        >
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                                    <div className="space-y-3">
                                         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Available to Add</h4>
                                         <div className="grid grid-cols-1 gap-2.5">
                                            {allProducts
                                                .filter(ap => !categoryProducts.find(cp => cp._id === ap._id))
                                                .slice(0, 15) // Show top 15 available
                                                .map(p => (
                                                    <div key={p._id} className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-blue-100 hover:bg-white transition group/avail">
                                                        <div className="flex items-center gap-4">
                                                            <img src={p.images[0]?.url} className="w-10 h-10 rounded-xl bg-slate-50 object-cover grayscale-[30%] group-hover/avail:grayscale-0 transition-all" />
                                                            <span className="text-[13px] font-medium text-slate-600 group-hover/avail:text-slate-900">{p.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddProduct(p._id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                            Add
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                         </div>
                                    </div>
                                </div>

                                <div className="pt-6 sticky bottom-0 bg-white/80 backdrop-blur-md">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                                    >
                                        Done Styling
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
