import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Performance: Disable smooth scroll on mobile devices where native scroll is already optimized
    if (window.innerWidth < 1024) return;

    const lenis = new Lenis({
      duration: 1.0, 
      lerp: 0.1, 
      wheelMultiplier: 1.0,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle scroll to top on route change within Lenis
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Fallback for native scroll
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
