import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { optimizeImage } from '../utils/image';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
        title: 'Timeless Elegance',
        subtitle: 'The 2026 Collection',
        description: 'Discover our latest curation of hand-crafted masterpieces designed for your most precious moments.',
        buttonText: 'SHOP COLLECTION',
        link: '/products'
    },
    {
        image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5',
        title: 'Rebel at Heart',
        subtitle: 'Artisanal Craftsmanship',
        description: 'Bold designs that break tradition. Explore our collection of avant-garde jewelry for the modern individual.',
        buttonText: 'DISCOVER SERIES',
        link: '/category/bracelets'
    },
    {
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
        title: 'Royal Solitaire',
        subtitle: 'Exceptional Brilliance',
        description: 'Rare diamonds meeting exquisite settings. The pinnacle of sophistication and timeless luxury.',
        buttonText: 'EXPLORE RINGS',
        link: '/category/rings'
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev: number) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds for a slower, more premium feel
        return () => clearInterval(timer);
    }, [isPaused]);

    // Listen for Mega Menu Hover events from Navbar
    useEffect(() => {
        const handleMegaMenuHover = (e: Event) => {
            const customEvent = e as CustomEvent<{ isHovered: boolean }>;
            setIsPaused(customEvent.detail.isHovered);
        };

        window.addEventListener('megaMenuHover', handleMegaMenuHover);
        return () => window.removeEventListener('megaMenuHover', handleMegaMenuHover);
    }, []);


    return (
        <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden bg-[#0A0A0A]">
            {/* Slides Container */}
            <div className="absolute inset-0 w-full h-full">
                {slides.map((slide, index) => {
                    let transform = 'translate-x-[100%]';
                    if (index === currentSlide) {
                        transform = 'translate-x-0';
                    } else if (index < currentSlide || (currentSlide === 0 && index === slides.length - 1)) {
                        transform = '-translate-x-[100%]';
                    }

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-transform duration-[1200ms] ease-[0.32, 0.72, 0, 1] ${transform}`}
                            style={{ willChange: 'transform' }}
                        >
                            <picture>
                                <source 
                                    media="(max-width: 768px)" 
                                    srcSet={optimizeImage(slide.image, { width: 800, height: 1200, crop: 'fill', quality: 70 })} 
                                />
                                <img
                                    src={optimizeImage(slide.image, { width: 1920, height: 1080, crop: 'fill', quality: 80 })}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-60 scale-105"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </picture>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
                        </div>
                    );
                })}
            </div>

            {/* Persistent Content Overlay with AnimatePresence */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="max-w-[1600px] w-full px-8 sm:px-12 lg:px-24 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "linear" }}
                            className="flex flex-col items-center space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-[10px] md:text-xs uppercase text-white font-medium tracking-[0.2em]"
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.span>
                                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-serif tracking-tight leading-[0.9]">
                                    {slides[currentSlide].title.split(' ')[0]} <br />
                                    <span className="italic font-light text-white/80">
                                        {slides[currentSlide].title.split(' ').slice(1).join(' ')}
                                    </span>
                                </h1>
                            </div>

                            <p className="text-base md:text-lg text-white/90 font-light max-w-xl leading-relaxed tracking-wide drop-shadow-md">
                                {slides[currentSlide].description}
                            </p>

                            <div className="pt-8">
                                <div
                                    className="relative inline-block"
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                >
                                    <Link
                                        to={slides[currentSlide].link}
                                        className="group relative flex items-center gap-8 bg-white px-12 py-5 rounded-full overflow-hidden transition-all duration-500 shadow-xl"
                                    >
                                        {/* Elegant Sweep Background */}
                                        <div className="absolute inset-0 bg-black w-0 group-hover:w-full transition-all duration-[600ms] ease-[0.25,1,0.5,1]" />

                                        <span className="text-[11px] font-bold tracking-[0.4em] uppercase z-10 text-black group-hover:text-white transition-colors duration-[600ms]">
                                            {slides[currentSlide].buttonText}
                                        </span>
                                        <div className="relative z-10 w-8 h-8 rounded-full border border-black/10 text-black group-hover:text-white flex items-center justify-center transition-all duration-[600ms] group-hover:border-white/20 group-hover:bg-white/10">
                                            <ChevronRight className="w-4 h-4 transition-transform duration-[600ms] group-hover:translate-x-0.5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setCurrentSlide(idx); setIsPaused(true); }}
                        className={`group relative h-px transition-all duration-1000 ${idx === currentSlide ? 'w-16 bg-white' : 'w-8 bg-white/20 hover:bg-white/40'}`}
                    >
                        <span className="absolute -top-4 left-0 w-full h-10 cursor-pointer" />
                    </button>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => { setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); setIsPaused(true); }}
                className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300 z-20"
            >
                <ChevronRight className="w-6 h-6 rotate-180" />
            </button>

            <button
                onClick={() => { setCurrentSlide((prev) => (prev + 1) % slides.length); setIsPaused(true); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300 z-20"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </section>
    );
}
