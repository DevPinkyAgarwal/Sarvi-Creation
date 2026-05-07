import { useEffect, useState } from 'react';
import { Mail, Search, Download, Trash2, UserCheck, Calendar } from 'lucide-react';
import api from '../../lib/api';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Subscriber {
    _id: string;
    email: string;
    createdAt: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/newsletter/admin/all');
            setSubscribers(data);
        } catch (err) {
            console.error("Newsletter: Failed to fetch", err);
            toast.error("Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscribers(); }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this subscriber?")) return;
        try {
            await api.delete(`/newsletter/admin/${id}`);
            toast.success("Subscriber removed");
            fetchSubscribers();
        } catch (err) {
            toast.error("Failed to remove subscriber");
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Subscribed At\n"
            + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleString()}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sarvi_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filtered = subscribers.filter(s => s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Newsletter Subscribers</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your marketing audience and export leads</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Audience</p>
                        <p className="text-3xl font-bold text-slate-800">{subscribers.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Leads</p>
                        <p className="text-3xl font-bold text-slate-800">{subscribers.length}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search subscribers by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-slate-400 animate-pulse">Loading audience...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <Mail className="w-12 h-12 text-slate-100 mx-auto" />
                        <p className="text-slate-400 text-sm">No subscribers found matching your search.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subscriber Email</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined On</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(s => (
                                <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5 font-medium text-slate-700">{s.email}</td>
                                    <td className="px-6 py-5 text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => handleDelete(s._id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
