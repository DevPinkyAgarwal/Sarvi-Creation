import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AmbassadorSection() {
    return (
        <section className="w-full bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[600px] lg:min-h-[750px]">
                {/* Left: Image */}
                <div className="w-full md:w-[65%] relative overflow-hidden h-[500px] md:h-auto">
                    <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        src="/ambassador.png" 
                        alt="Sarvi Creation Ambassador"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Right: Text */}
                <div className="w-full md:w-[35%] flex flex-col justify-center items-center md:items-start p-12 lg:p-24 text-center md:text-left space-y-8 bg-[#FAF9F6]">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-6xl font-serif text-gray-900 tracking-tight leading-[1.1] uppercase">
                                A Symbol of <br className="hidden lg:block" /> Love's Strength
                            </h2>
                            <p className="text-sm lg:text-[15px] text-gray-500 font-light leading-relaxed max-w-sm tracking-wide">
                                Worn by our brand ambassador, the latest collection by Sarvi Creation is a lasting reminder of the strength we find within.
                            </p>
                        </div>
                        
                        <div className="pt-6">
                            <Link 
                                to="/products" 
                                className="group inline-flex flex-col text-[11px] font-bold tracking-[0.4em] uppercase text-gray-900"
                            >
                                <span className="mb-2">Shop the Collection</span>
                                <span className="h-[2px] w-full bg-gray-900 origin-left transition-transform duration-500 scale-x-100 group-hover:scale-x-50" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
