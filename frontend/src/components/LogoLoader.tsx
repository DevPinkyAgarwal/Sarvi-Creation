import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LogoLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds as requested

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative">
            {/* Logo Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              className="mb-8"
            >
              {/* Using a placeholder if logo is not available, but should be replaced with actual logo */}
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-serif tracking-[0.1em] text-black">SARVI</span>
                <span className="text-[10px] md:text-[14px] tracking-[0.6em] text-[#D4AF37] uppercase mt-2 ml-2">CREATION</span>
              </div>
            </motion.div>

            {/* Premium Loading Bar */}
            <div className="w-48 h-[2px] bg-slate-100 overflow-hidden rounded-full mx-auto">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-full h-full bg-black"
              />
            </div>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 text-[10px] tracking-[0.3em] uppercase text-slate-400 font-medium"
          >
            Defining Elegance
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
