import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import BlurText from './animations/BlurText';

export default function HeritageStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <section ref={containerRef} className="w-full bg-[#FAF9F6] py-12 lg:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden relative">
            {/* Decorative Background Text to fill whitespace */}
            <motion.div 
                style={{ opacity: 0.03 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0"
            >
                <h2 className="text-[20vw] font-serif font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                    Heritage
                </h2>
            </motion.div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    {/* Left: Visual Side - Compact Cluster */}
                    <div className="relative h-fit">
                        <motion.div 
                            style={{ y: y1 }}
                            className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg w-full max-w-md mx-auto lg:mx-0"
                        >
                            <img 
                                src="/about-atelier.png" 
                                alt="Jewelry Craftsmanship"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>
                        
                        <motion.div 
                            style={{ y: y2 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute -bottom-8 -right-4 lg:-right-8 w-2/5 aspect-square overflow-hidden rounded-xl shadow-2xl border-[6px] border-white z-20"
                        >
                            <img 
                                src="/about-pendant.png" 
                                alt="Jewelry Detail"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Narrative Side - More spread out to fill space */}
                    <div className="space-y-10 lg:pl-4">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex items-center gap-4"
                            >
                                <span className="h-[1px] w-12 bg-black/20"></span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">The Art of Creation</span>
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-serif text-[#0f172a] tracking-tight leading-[1.1] uppercase">
                                <BlurText text="Jewelry made" animateBy="words" direction="bottom" />
                                <br />
                                <span className="italic block text-right pr-4 lg:pr-12 text-gray-400">
                                    <BlurText text="for your story" delay={0.2} animateBy="words" direction="bottom" />
                                </span>
                            </h2>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
                        >
                            <div className="space-y-4">
                                <p className="text-base text-gray-600 font-light leading-relaxed">
                                    We handcraft every piece with care and love. For us, it's not just jewelry; it's a part of who you are and the moments you cherish.
                                </p>
                                <Link to="/about" className="group inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase">
                                    <span>Learn More</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-6 border-l border-gray-100 pl-8">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Real Gold</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">Pure, recycled gold for a lifetime of wear.</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Fairly Made</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">Ethically sourced and made by hand.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
