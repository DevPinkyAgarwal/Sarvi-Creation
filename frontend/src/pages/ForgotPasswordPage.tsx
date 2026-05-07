import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

// Security: Simple input sanitization
const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/forgot-password', { email: sanitizeInput(email) });
            setSubmitted(true);
            toast.success('Reset link sent! Please check your inbox.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
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
                    <h1 className="text-4xl font-serif text-gray-900 tracking-tight uppercase">
                        {submitted ? 'Check Inbox' : 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">
                        {submitted 
                            ? `We've sent a recovery link to ${email}. It may take a few minutes to arrive.`
                            : 'Enter your registered email and we will send you a link to reset your password.'}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="bg-[#FAF9F6] p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 space-y-6">
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-6 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 group active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'SENDING LINK...' : 'SEND RESET LINK'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="text-center pt-4">
                            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-black transition-colors">
                                <ChevronLeft className="w-3 h-3" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="bg-[#FAF9F6] p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            Didn't receive it? Check your spam folder or 
                            <button onClick={() => setSubmitted(false)} className="text-black underline ml-1">try again</button>
                        </p>
                        <Link 
                            to="/login" 
                            className="w-full bg-black text-white py-6 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                        >
                            RETURN TO LOGIN
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
