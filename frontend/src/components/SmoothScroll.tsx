import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Performance: Disable smooth scroll on mobile devices where native scroll is already optimized
    if (window.innerWidth < 1024) return;

    const lenis = new Lenis({
      duration: 1.0, 
      lerp: 0.1, // Even snappier for better performance perception
      wheelMultiplier: 1.0,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Disable touch sync for better mobile native feel if it reaches mobile
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
