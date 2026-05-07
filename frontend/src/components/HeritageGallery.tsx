import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/image';

interface HeritageGalleryProps {
    items: Array<{ image: string; text: string; slug?: string }>;
}

export default function HeritageGallery({ items }: HeritageGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className="relative w-full overflow-hidden bg-white py-10 lg:py-20">
            {/* Horizontal Scroll Container */}
            <div 
                ref={containerRef}
                className="flex gap-8 lg:gap-16 overflow-x-auto pb-20 px-8 lg:px-[10vw] hide-scrollbar cursor-grab active:cursor-grabbing"
                style={{ scrollSnapType: 'x proximity' }}
            >
                {items.map((item, index) => (
                    <GalleryItem 
                        key={index} 
                        item={item} 
                        index={index} 
                        total={items.length}
                    />
                ))}
            </div>

            {/* Custom CSS for hidden scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}

function GalleryItem({ item, index, total }: { item: any; index: number; total: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className="relative flex-none w-[300px] lg:w-[500px] group"
            style={{ scrollSnapAlign: 'center' }}
        >
            <Link to={`/category/${item.slug || item.text.toLowerCase().replace(' ', '-')}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl">
                {/* Background Shadow/Glow */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                
                {/* Image with subtle parallax on hover */}
                <motion.img
                    src={optimizeImage(item.image, { width: 600, height: 800, crop: 'fill' })}
                    alt={item.text}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-6 bg-[#D4AF37]"></span>
                            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Collection</span>
                        </div>
                        <h3 className="text-3xl lg:text-5xl font-serif text-white tracking-tight leading-none uppercase">
                            {item.text}
                        </h3>
                        <div className="pt-4 overflow-hidden">
                            <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase border-b border-white/30 pb-2 group-hover:border-white group-hover:text-white transition-all">
                                Explore Portfolio
                            </span>
                        </div>
                    </div>
                </div>

                {/* Index Indicator */}
                <div className="absolute top-8 left-8 z-20">
                    <span className="text-[10px] font-bold text-white/40 tracking-[0.2em]">
                        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}
