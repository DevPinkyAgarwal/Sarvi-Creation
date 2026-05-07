import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use a slight delay to ensure the page has mounted and framer-motion animations have started
        const scrollTimeout = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
            // Also ensure the document body and element are reset
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(scrollTimeout);
    }, [pathname]);

    return null;
}
