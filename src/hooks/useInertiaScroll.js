import { useEffect } from 'react';
// import Lenis from 'lenis';
// import 'lenis/dist/lenis.css';

const useInertiaScroll = () => {
    useEffect(() => {
        // Lenis disabled to allow CSS scroll-snap to work
        // The sticky stack effect requires native scroll behavior for snap points

        // const lenis = new Lenis({
        //     duration: 1.2,
        //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        //     orientation: 'vertical',
        //     smoothWheel: true,
        // });

        // function raf(time) {
        //     lenis.raf(time);
        //     requestAnimationFrame(raf);
        // }

        // requestAnimationFrame(raf);

        // return () => {
        //     lenis.destroy();
        // };
    }, []);
};

export default useInertiaScroll;
