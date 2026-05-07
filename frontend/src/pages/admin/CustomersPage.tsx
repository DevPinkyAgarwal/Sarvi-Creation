import { useEffect, useState } from 'react';
import { Users, Search, Calendar, Shield, Trash2 } from 'lucide-react';
import api from '../../lib/api';

interface Customer {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users/admin/all');
            setCustomers(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
                    <p className="text-slate-500 text-sm mt-1">{customers.length} total registered users</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading customers...</div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">No customers found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Customer', 'Role', 'Joined Date', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCustomers.map(customer => (
                                <tr key={customer._id} className="hover:bg-slate-50 transition">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium text-slate-800 truncate">{customer.name}</span>
                                                <span className="text-xs text-slate-400 truncate">{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${customer.role === 'admin'
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : 'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                <Shield className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
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
        </div>
    );
}
