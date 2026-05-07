import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'sonner';

const EXPERIENCE_ITEMS = [
    {
        title: "Book an Appointment",
        description: "Master the art of gifting with a one-on-one in-store or virtual appointment with a Sarvi Creation client advisor.",
        image: "/exp-gifting.png",
        linkText: "Schedule an Appointment",
        to: "/contact",
        type: 'link'
    },
    {
        title: "Personalization",
        description: "Make a design from Sarvi Creation even more memorable with bespoke engraving and custom finishing.",
        image: "/exp-personalization.png",
        linkText: "Request Customization",
        to: "#",
        type: 'bespoke'
    },
    {
        title: "Contact Us",
        description: "From tailored gifting advice to providing after-sales care, our specialist advisors are always at your service.",
        image: "/exp-contact.png",
        linkText: "Get in Touch",
        to: "#",
        type: 'contact'
    }
];

export default function ExperienceSection() {
    const [activeModal, setActiveModal] = useState<null | 'bespoke' | 'contact'>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [bespokeData, setBespokeData] = useState({
        name: '',
        email: '',
        jewelryType: 'Ring',
        details: ''
    });

    const handleBespokeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/contact', {
                name: bespokeData.name,
                email: bespokeData.email,
                subject: `Bespoke Request: ${bespokeData.jewelryType}`,
                message: bespokeData.details,
                isBusiness: false
            });
            setSubmitted(true);
            toast.success('Request sent successfully!');
        } catch (error) {
            toast.error('Failed to send request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full bg-white pt-24 pb-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
            <div className="max-w-[1600px] mx-auto space-y-16 lg:space-y-24">
                {/* Header */}
                <div className="text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight uppercase"
                    >
                        The Sarvi Experience
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {EXPERIENCE_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group flex flex-col items-center text-center space-y-8"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-[#F8F8F8]">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-4 max-w-[280px]">
                                <h3 className="text-xl lg:text-2xl font-serif text-gray-900 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed tracking-wide">
                                    {item.description}
                                </p>
                            </div>

                            {/* Link / Action */}
                            <div className="pt-2">
                                {item.type === 'link' ? (
                                    <Link 
                                        to={item.to}
                                        className="group/link inline-flex flex-col text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900"
                                    >
                                        <span className="mb-2">{item.linkText}</span>
                                        <span className="h-[1px] w-full bg-gray-900 origin-left transition-transform duration-500 scale-x-100 group-hover/link:scale-x-0" />
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setActiveModal(item.type as any);
                                            setSubmitted(false);
                                        }}
                                        className="group/link inline-flex flex-col text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900"
                                    >
                                        <span className="mb-2">{item.linkText}</span>
                                        <span className="h-[1px] w-full bg-gray-900 origin-left transition-transform duration-500 scale-x-100 group-hover/link:scale-x-0" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modals Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12"
                        >
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {activeModal === 'bespoke' ? (
                                <div className="space-y-8">
                                    {submitted ? (
                                        <div className="py-12 text-center space-y-6">
                                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-serif">Request Received</h3>
                                            <p className="text-sm text-gray-500 font-light">Our artisans will review your customization request and contact you shortly.</p>
                                            <button 
                                                onClick={() => setActiveModal(null)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-serif text-gray-900">Bespoke Request</h3>
                                                <p className="text-sm text-gray-500 font-light">Tell us about your dream piece.</p>
                                            </div>
                                            <form onSubmit={handleBespokeSubmit} className="space-y-6">
                                                <div className="space-y-4">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Full Name"
                                                        required
                                                        value={bespokeData.name}
                                                        onChange={(e) => setBespokeData({...bespokeData, name: e.target.value})}
                                                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                                    />
                                                    <input 
                                                        type="email" 
                                                        placeholder="Email Address"
                                                        required
                                                        value={bespokeData.email}
                                                        onChange={(e) => setBespokeData({...bespokeData, email: e.target.value})}
                                                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                                    />
                                                    <select 
                                                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                                        value={bespokeData.jewelryType}
                                                        onChange={(e) => setBespokeData({...bespokeData, jewelryType: e.target.value})}
                                                    >
                                                        <option>Ring</option>
                                                        <option>Necklace</option>
                                                        <option>Earrings</option>
                                                        <option>Bracelet</option>
                                                        <option>Other</option>
                                                    </select>
                                                    <textarea 
                                                        placeholder="Describe your vision (engraving, stones, metal...)"
                                                        required
                                                        rows={4}
                                                        value={bespokeData.details}
                                                        onChange={(e) => setBespokeData({...bespokeData, details: e.target.value})}
                                                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5 resize-none"
                                                    />
                                                </div>
                                                <button 
                                                    disabled={isSubmitting}
                                                    className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? 'Sending...' : <><Send className="w-3.5 h-3.5" /> Submit Request</>}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-10 text-center py-8">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-serif text-gray-900">Get in Touch</h3>
                                        <p className="text-sm text-gray-500 font-light tracking-wide">Our specialist advisors are at your service.</p>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 mb-2">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Us</p>
                                                <a href="mailto:care@sarvicreation.com" className="text-xl font-serif text-gray-900 hover:text-gray-500 transition-colors">
                                                    care@sarvicreation.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="w-12 h-px bg-gray-100 mx-auto" />

                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 mb-2">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Call Us</p>
                                                <a href="tel:+912245678901" className="text-xl font-serif text-gray-900 hover:text-gray-500 transition-colors">
                                                    +91 (22) 4567-8901
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <button 
                                            onClick={() => setActiveModal(null)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
