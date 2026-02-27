import { useEffect } from 'react';
import Lenis from 'lenis';

const useInertiaScroll = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return undefined;

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const jumpToTop = () => {
            window.scrollTo(0, 0);
            const activeLenis = window.__portfolioLenis;
            if (activeLenis) {
                activeLenis.scrollTo(0, { immediate: true, force: true });
            }
        };

        jumpToTop();

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
        lenis.scrollTo(0, { immediate: true, force: true });

        const handlePageShow = () => {
            jumpToTop();
        };
        window.addEventListener('pageshow', handlePageShow);

        let rafId = 0;
        const raf = (time) => {
            lenis.raf(time);
            rafId = window.requestAnimationFrame(raf);
        };
        rafId = window.requestAnimationFrame(raf);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            window.cancelAnimationFrame(rafId);
            lenis.destroy();
            if (window.__portfolioLenis === lenis) {
                delete window.__portfolioLenis;
            }
        };
    }, []);
};

export default useInertiaScroll;
