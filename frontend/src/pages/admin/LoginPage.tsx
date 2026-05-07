import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/admin/authStore';
import { AlertCircle } from 'lucide-react';

// Security: Simple input sanitization
const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [honeypot, setHoneypot] = useState(''); // Security: Bot protection
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('adminEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 8) {
            setError('Security policy: Password must be at least 8 characters.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Security: Bot check
        if (honeypot) return;

        if (!validateForm()) return;

        if (rememberMe) {
            localStorage.setItem('adminEmail', email);
        } else {
            localStorage.removeItem('adminEmail');
        }
        try {
            await login(sanitizeInput(email), password);
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please check your admin credentials.');
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative z-10 bg-white">
                {/* Header */}
                <div className="p-8 flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-900"></div>
                    <span className="font-semibold text-slate-900 text-[17px] tracking-tight">Sarvi Creation Admin</span>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-[360px]">
                        <div className="mb-8">
                            <img 
                                src="/Sarvi Creation Logo without Background.png" 
                                alt="Sarvi Creation" 
                                className="h-32 w-auto mb-10 object-contain"
                            />
                            <h1 className="text-3xl font-semibold text-slate-900 mb-3 tracking-tight">Admin Portal</h1>
                            <p className="text-slate-500 text-sm">Access authorized controls. Enter your credentials.</p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-6 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Security: Honeypot */}
                            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="care@sarvicreation.com"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter secure password"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#7F56D9] focus:ring-[#7F56D9] transition-colors cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Remember session</span>
                                </label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2.5 bg-[#7F56D9] hover:bg-[#6941C6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm text-sm"
                                >
                                    {isLoading ? 'Verifying access...' : 'Secure Login'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 text-sm text-slate-500">
                    © Sarvi Creation {new Date().getFullYear()}
                </div>
            </div>

            {/* Right Column - Graphic */}
            <div className="hidden lg:block lg:w-1/2 bg-[#F2F4F7] relative overflow-hidden min-h-screen border-l border-slate-200">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                        {/* Top half circle (solid purple) */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-[#7F56D9] rounded-t-full z-10 shadow-sm"></div>

                        {/* Bottom reflection blur */}
                        <div className="absolute top-40 left-0 right-0 h-40 bg-[#7F56D9]/50 rounded-b-full blur-[40px] z-0 -translate-y-2 mix-blend-multiply opacity-80"></div>

                        {/* Horizontal glass divider */}
                        <div className="absolute top-[159px] left-[-20%] right-[-20%] h-[2px] bg-white/40 blur-[1px] z-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
