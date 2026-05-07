import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use a slightly longer delay (100ms) to ensure the new page content is rendered
        // and the smooth scroll engine (Lenis) has initialized for the new view.
        const scrollTimeout = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
            
            // Fallbacks for various scroll containers
            document.documentElement.style.scrollBehavior = 'auto';
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // Re-enable smooth scroll after reset
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = 'smooth';
            }, 50);
        }, 100);

        return () => clearTimeout(scrollTimeout);
    }, [pathname]);

    return null;
}
