import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MapPin, Phone } from 'lucide-react';
import api from '../lib/api';
import MetaTags from '../components/MetaTags';
import { toast } from 'sonner';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        isBusiness: false
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            toast.success('Message sent successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <MetaTags 
                title="Contact Us | Sarvi Creation"
                description="Get in touch with Sarvi Creation for inquiries about our fine jewelry, bespoke services, or any assistance you may need."
            />

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
                    
                    {/* Left: Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-16"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="h-px w-8 bg-gray-200"></span>
                                <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">Get in Touch</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-tight uppercase">
                                We are at Your <br /> Service
                            </h1>
                            <p className="text-sm lg:text-base text-gray-500 font-light leading-relaxed max-w-md tracking-wide">
                                Whether you have a question about our collections, need styling advice, or want to discuss a bespoke commission, our specialist advisors are here to help.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Us</h3>
                                    <p className="text-[13px] text-gray-900 font-medium">care@sarvicreation.com</p>
                                    <p className="text-[13px] text-gray-500 font-light">Available 24/7 for inquiries.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Visit Us</h3>
                                    <p className="text-[13px] text-gray-900 font-medium leading-relaxed max-w-[200px]">
                                        4301, 1st Floor, KGB ka Rasta, 1st Crossing, Johari Bazar, Jaipur, Rajasthan - 302003
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Call Us</h3>
                                    <a href="tel:+917080803366" className="text-[13px] text-gray-900 font-medium hover:text-gray-500 transition-colors">+91 7080803366</a>
                                    <p className="text-[13px] text-gray-500 font-light">Mon-Sat: 10:00 AM - 7:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-[#FAF9F6] p-8 lg:p-16 rounded-3xl relative overflow-hidden"
                    >
                        {submitted ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-[500px] flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-serif text-gray-900 tracking-tight">Message Received</h2>
                                <p className="text-sm text-gray-500 font-light max-w-xs mx-auto leading-relaxed">
                                    Thank you for reaching out. A specialist from our concierge team will contact you within 24 hours.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900 border-b border-gray-900 pb-1 mt-4"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-sm outline-none focus:border-black transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-sm outline-none focus:border-black transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this inquiry about?"
                                        className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-sm outline-none focus:border-black transition-all shadow-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <input 
                                        type="checkbox" 
                                        id="isBusiness"
                                        name="isBusiness"
                                        checked={formData.isBusiness}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                    />
                                    <label htmlFor="isBusiness" className="text-xs font-medium text-gray-600 cursor-pointer select-none">
                                        Are you a business entity? (Wholesale/B2B inquiry)
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                                    <textarea 
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we assist you today?"
                                        className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-sm outline-none focus:border-black transition-all shadow-sm resize-none"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none"
                                >
                                    {loading ? 'Sending...' : <><Send className="w-3.5 h-3.5" /> Send Inquiry</>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
