import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const { data } = await api.post('/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(data.message || 'Successfully subscribed!');
            setEmail('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <footer className="bg-[#FAF9F6] border-t border-gray-200 relative overflow-hidden">
            {/* Subtle glow/shadow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 lg:pt-16 pb-8 lg:pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 mb-16 lg:mb-20">

                    {/* Brand & Newsletter (Takes up more space) */}
                    <div className="lg:col-span-4 lg:col-start-1 space-y-10">
                        <Link to="/" className="inline-block group">
                            <img 
                                src="/Sarvi Creation Logo without Background.png" 
                                alt="Sarvi Creation" 
                                className="h-48 w-auto object-contain"
                            />
                        </Link>

                        <p className="text-gray-500 text-sm font-light leading-relaxed max-w-sm">
                            Crafting timeless elegance and sustainable luxury since 2020. Our collections reflect a harmonious blend of nature's finest elements and masterful artistry.
                        </p>

                        <div className="space-y-4 pt-4">
                            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Join Our Universe</h5>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <div className="flex items-center border-b border-gray-300 pb-2 focus-within:border-gray-900 transition-colors group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        required
                                        disabled={status === 'loading'}
                                        className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 w-full disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="text-gray-400 hover:text-gray-900 transition-colors p-1 disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                                {message && (
                                    <p className={`text-xs ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>

                        <div className="flex gap-4 pt-4">
                            {[
                                { icon: Instagram, href: 'https://instagram.com/sarvicreation' },
                                { icon: Facebook, href: 'https://facebook.com/sarvicreation' },
                                { icon: Twitter, href: 'https://twitter.com/sarvicreation' },
                            ].map((social, idx) => (
                                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 hover:bg-white transition-all duration-300">
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Brand Links */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-serif text-lg tracking-wide text-gray-900 mb-8">Brand</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Our Story', to: '/about' },
                                { name: 'Craftsmanship', to: '/about' },
                                { name: 'Collections', to: '/products' },
                                { name: 'Store Locator', to: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.to} className="group inline-flex items-center text-sm font-light text-gray-500 hover:text-gray-900 transition-colors duration-300">
                                        <span className="relative">
                                            {item.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="lg:col-span-2 lg:col-start-8">
                        <h4 className="font-serif text-lg tracking-wide text-gray-900 mb-8">Client Care</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Shipping Info', path: '/info/shipping' },
                                { name: 'Returns & Exchanges', path: '/info/returns' },
                                { name: 'Care Guide', path: '/info/care-guide' },
                                { name: 'Privacy Policy', path: '/info/privacy' },
                                { name: 'Terms of Service', path: '/info/terms' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="group inline-flex items-center text-sm font-light text-gray-500 hover:text-gray-900 transition-colors duration-300">
                                        <span className="relative">
                                            {item.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact (Takes remaining space) */}
                    <div className="lg:col-span-3 lg:col-start-10">
                        <h4 className="font-serif text-lg tracking-wide text-gray-900 mb-8">Boutique</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 group">
                                <div className="mt-1 p-2 rounded-full border border-gray-200 group-hover:border-[#D4AF37]/50 transition-colors bg-white">
                                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="text-gray-900 text-sm font-medium">Flagship Store</span>
                                    <span className="text-sm font-light text-gray-500 leading-relaxed max-w-[200px]">
                                        4301, 1st Floor, KGB ka Rasta, 1st Crossing, Johari Bazar, Jaipur, Rajasthan - 302003
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="mt-1 p-2 rounded-full border border-gray-200 group-hover:border-[#D4AF37]/50 transition-colors bg-white">
                                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="text-gray-900 text-sm font-medium">Concierge</span>
                                    <a href="tel:+917080803366" className="text-sm font-light text-gray-500 hover:text-gray-900 transition-colors">+91 7080803366</a>
                                </div>
                            </li>
                            <li className="group cursor-pointer">
                                <a href="mailto:care@sarvicreation.com" className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-full border border-gray-200 group-hover:border-[#D4AF37]/50 transition-colors bg-white">
                                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-gray-900 text-sm font-medium">Email Us</span>
                                        <span className="text-sm font-light text-gray-500 group-hover:text-gray-900 transition-colors">care@sarvicreation.com</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-light tracking-wider text-gray-400 uppercase">
                        © {new Date().getFullYear()} Sarvi Creation Private Limited. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6 opacity-60">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Secure Payments</span>
                        <div className="flex gap-4 items-center grayscale hover:grayscale-0 transition-all duration-500 mix-blend-multiply">
                            <img src="https://img.icons8.com/color/48/visa.png" className="h-6 object-contain" alt="Visa" />
                            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5 object-contain" alt="Mastercard" />
                            <img src="https://img.icons8.com/color/48/amex.png" className="h-6 object-contain" alt="Amex" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
