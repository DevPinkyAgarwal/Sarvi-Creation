import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Mail, Trash2, CheckCircle, Clock, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    isBusiness?: boolean;
    createdAt: string;
}

export default function AdminContactPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/contact/admin');
            setMessages(data);
        } catch (error: any) {
            toast.error('Failed to fetch messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.put(`/contact/admin/${id}/read`);
            setMessages(messages.map((m: any) => m._id === id ? { ...m, isRead: true } : m));
            toast.success('Marked as read.');
        } catch (error) {
            toast.error('Failed to update message.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.delete(`/contact/admin/${id}`);
            setMessages(messages.filter((m: any) => m._id !== id));
            toast.success('Message deleted.');
        } catch (error) {
            toast.error('Failed to delete message.');
        }
    };

    const filteredMessages = messages.filter((m: any) => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             m.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'unread') return !m.isRead && matchesSearch;
        if (filter === 'read') return m.isRead && matchesSearch;
        return matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
                    <p className="text-sm text-slate-500">Manage customer messages and support tickets.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filter === 'all' ? 'bg-black text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filter === 'unread' ? 'bg-black text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        Unread
                    </button>
                    <button 
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filter === 'read' ? 'bg-black text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        Read
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center text-slate-400">Loading inquiries...</div>
                ) : filteredMessages.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Mail className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No inquiries found.</p>
                    </div>
                ) : (
                    filteredMessages.map((msg: any) => (
                        <div 
                            key={msg._id}
                            className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-lg ${msg.isRead ? 'border-slate-100 opacity-80' : 'border-black/5 shadow-sm'}`}
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Status & Meta */}
                                <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:w-48 shrink-0">
                                    <div className="flex items-center gap-2">
                                        {msg.isRead ? (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                <CheckCircle className="w-3 h-3" /> Read
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                <Clock className="w-3 h-3" /> New
                                            </span>
                                        )}
                                        {msg.isBusiness && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Business
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400">{format(new Date(msg.createdAt), 'MMM dd, yyyy')}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{format(new Date(msg.createdAt), 'HH:mm')}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{msg.name}</h3>
                                            <a href={`mailto:${msg.email}`} className="text-slate-400 hover:text-black transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">{msg.email}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{msg.subject}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col items-center justify-end gap-3 shrink-0">
                                    {!msg.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(msg._id)}
                                            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all"
                                            title="Mark as read"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(msg._id)}
                                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                        title="Delete message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
