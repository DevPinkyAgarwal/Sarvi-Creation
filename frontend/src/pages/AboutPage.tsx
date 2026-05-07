import { motion } from 'framer-motion';
import MetaTags from '../components/MetaTags';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <MetaTags 
                title="Our Story | Sarvi Creation"
                description="Discover the heritage, craftsmanship, and the art of creation behind Sarvi Creation's fine jewelry."
            />

            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 px-6 sm:px-10 lg:px-16 max-w-[1400px] mx-auto">
                {/* Faint Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                    <span className="text-[20vw] font-serif font-bold tracking-tighter leading-none">HERITAGE</span>
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left: Images */}
                    <div className="relative order-2 lg:order-1">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img 
                                src="/about-atelier.png" 
                                alt="Master Craftsmanship"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute -bottom-12 -right-8 lg:-right-16 aspect-square w-48 lg:w-72 rounded-2xl overflow-hidden border-8 border-white shadow-2xl z-20"
                        >
                            <img 
                                src="/about-pendant.png" 
                                alt="Exquisite Design"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-12 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <span className="h-px w-8 bg-gray-200"></span>
                                <span className="text-[10px] font-bold tracking-[0.4em] text-[#BC9E6B] uppercase">The Art of Creation</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 tracking-tight leading-[1.1] uppercase">
                                Jewelry Made <br />
                                <span className="italic font-light text-gray-400">For Your Story</span>
                            </h1>
                            <p className="text-base lg:text-lg text-gray-500 font-light leading-relaxed max-w-lg tracking-wide">
                                We handcraft every piece with care and love. For us, it's not just jewelry; it's a part of who you are and the moments you cherish.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-12"
                        >
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-2 inline-block">Real Gold</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed">
                                    Pure, recycled gold for a lifetime of wear. Our materials are selected for their enduring beauty and ethical origins.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-2 inline-block">Fairly Made</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed">
                                    Ethically sourced and made by hand in our private atelier. We prioritize the well-being of our artisans and the planet.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-[#FAF9F6] py-24 lg:py-32">
                <div className="max-w-[1000px] mx-auto px-6 text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 uppercase tracking-wide">Our Philosophy</h2>
                        <div className="w-12 h-0.5 bg-[#BC9E6B] mx-auto"></div>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-lg lg:text-2xl font-serif italic text-gray-600 leading-relaxed font-light"
                    >
                        "A piece of jewelry is more than an accessory; it is a legacy. Our mission is to create timeless artifacts that carry your emotions through generations, crafted with the precision of a master and the heart of a storyteller."
                    </motion.p>
                </div>
            </section>

            {/* Atelier Detail Section */}
            <section className="py-24 lg:py-40 px-6 sm:px-10 lg:px-16 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                <div className="space-y-6">
                    <span className="text-[10px] font-bold text-[#BC9E6B] tracking-[0.3em] uppercase">01. Sourcing</span>
                    <h3 className="text-2xl font-serif text-gray-900 uppercase tracking-tight">Ethical Gems</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Every stone is hand-selected and conflict-free, ensuring that the beauty of our jewelry is matched by the integrity of its origin.
                    </p>
                </div>
                <div className="space-y-6">
                    <span className="text-[10px] font-bold text-[#BC9E6B] tracking-[0.3em] uppercase">02. Design</span>
                    <h3 className="text-2xl font-serif text-gray-900 uppercase tracking-tight">Timeless Design</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Our design language balances modern sophistication with classical elegance, creating pieces that remain relevant through shifting trends.
                    </p>
                </div>
                <div className="space-y-6">
                    <span className="text-[10px] font-bold text-[#BC9E6B] tracking-[0.3em] uppercase">03. Craft</span>
                    <h3 className="text-2xl font-serif text-gray-900 uppercase tracking-tight">Master Atelier</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                        From initial sketch to final polish, each creation is birthed in our atelier by artisans who have spent decades perfecting their craft.
                    </p>
                </div>
            </section>
        </div>
    );
}
