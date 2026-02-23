import { useEffect } from 'react';
import Lenis from 'lenis';

const useInertiaScroll = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return undefined;

        const lenis = new Lenis({
            duration: 0.95,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.86,
            touchMultiplier: 1.35,
            infinite: false,
        });
        window.__portfolioLenis = lenis;

        let rafId = 0;
        const raf = (time) => {
            lenis.raf(time);
            rafId = window.requestAnimationFrame(raf);
        };
        rafId = window.requestAnimationFrame(raf);

        return () => {
            window.cancelAnimationFrame(rafId);
            lenis.destroy();
            if (window.__portfolioLenis === lenis) {
                delete window.__portfolioLenis;
            }
        };
    }, []);
};

export default useInertiaScroll;
