import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Security: Simple input sanitization
const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const { setUser } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [honeypot, setHoneypot] = useState('');

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Security: Bot check
        if (honeypot) return;

        if (!validateForm()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { 
                email: sanitizeInput(email), 
                password: password // Don't sanitize password
            });
            setUser(data);
            navigate(redirect);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                    <img 
                        src="/Sarvi Creation Logo without Background.png" 
                        alt="Sarvi Creation" 
                        className="h-64 w-auto mx-auto mb-10 object-contain"
                    />
                    <h1 className="text-4xl font-serif text-gray-900 tracking-tight uppercase">Welcome Back</h1>
                    <p className="text-gray-500 text-sm font-light">Sign in to your Sarvi account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#FAF9F6] p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 space-y-6">
                    {/* Security: Honeypot */}
                    <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest px-2">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-black transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-black focus:ring-0" />
                            Remember Me
                        </label>
                        <Link 
                            to="/forgot-password"
                            className="text-[#D4AF37] hover:opacity-80 transition-opacity"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-6 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 group active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Don't have an account? <Link to="/register" className="text-black hover:opacity-70 transition-colors ml-1">Create One</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
