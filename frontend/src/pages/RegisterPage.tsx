import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [honeypot, setHoneypot] = useState('');

    const validateForm = () => {
        if (formData.name.length < 2) {
            toast.error('Please enter your full name');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (honeypot) return;
        if (!validateForm()) return;

        setLoading(true);
        try {
            const { data } = await api.post('/users/register', {
                name: sanitizeInput(formData.name),
                email: sanitizeInput(formData.email),
                password: formData.password
            });
            setUser(data);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                    <h1 className="text-4xl font-serif text-gray-900 tracking-tight uppercase">Create Account</h1>
                    <p className="text-gray-500 text-sm font-light">Join the Sarvi Universe for a personalized experience</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#FAF9F6] p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 space-y-6">
                    <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Create Password"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <input type="checkbox" required className="w-4 h-4 rounded border-gray-200 text-black focus:ring-0 cursor-pointer" />
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            I agree to the <Link to="/info/terms" className="text-black underline underline-offset-4">Terms of Service</Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-6 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 group active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Already have an account? <Link to="/login" className="text-black hover:opacity-70 transition-colors ml-1">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
