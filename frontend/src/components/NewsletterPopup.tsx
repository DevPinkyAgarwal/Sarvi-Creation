import { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('sarvi-newsletter-popup');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('sarvi-newsletter-popup', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('success');
        setTimeout(() => handleClose(), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-[#FAF9F6] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
                    >
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-10 lg:p-14 text-center space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 mb-2">
                                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <span className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase">The Privilege Club</span>
                                <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 tracking-tight uppercase">
                                    Join Our Universe
                                </h2>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs mx-auto">
                                    Receive exclusive invitations to private viewings and early access to our most precious collections.
                                </p>
                            </div>

                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 text-green-800 p-4 rounded-lg text-sm"
                                >
                                    Thank you for joining our universe.
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-sm outline-none focus:border-black transition-colors text-sm"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all"
                                    >
                                        Subscribe Now
                                    </button>
                                </form>
                            )}

                            <p className="text-[10px] text-gray-400 font-light italic">
                                By subscribing, you agree to our Privacy Policy and Terms of Service.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
