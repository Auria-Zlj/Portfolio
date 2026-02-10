import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import Footer from './Footer';
import Home from '../../pages/Home';

import preloHero from '../../assets/images/Prelo_hero.png';
import xheatHero from '../../assets/images/X-Heal_Hero.png';
import mushroomateHero from '../../assets/images/mushroomate_hero.png';

const projects = [
    { id: 3, title: 'Lumina', category: 'Health / Wearable', image: xheatHero, secondaryImage: '' },
    { id: 1, title: 'Prelo', category: 'Fintech / Data', image: preloHero, secondaryImage: '' },
    { id: 4, title: 'Chronos', category: 'Productivity', image: mushroomateHero, secondaryImage: '' },
    { id: 2, title: 'Aether', category: 'AI / Voice', image: null, secondaryImage: '' }, // Placeholder/Empty at end
];

const StickyCardWrapper = ({ children, index, viewportHeight }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start start', 'end start']
    });

    const opacity = useTransform(scrollYProgress, [0, 0.16, 0.92, 1], [1, 1, 0.96, 0.92]);
    const scale = useTransform(scrollYProgress, [0, 0.16, 0.92, 1], [1, 1, 0.992, 0.985]);
    const smoothOpacity = useSpring(opacity, { stiffness: 160, damping: 26, mass: 0.2 });
    const smoothScale = useSpring(scale, { stiffness: 160, damping: 26, mass: 0.22 });

    return (
        <motion.div
            ref={cardRef}
            data-snap-point="true"
            style={{
                position: 'relative',
                width: '100vw',
                minHeight: viewportHeight,
                height: viewportHeight,
                background: 'rgba(255, 255, 255, 0.05)', // Subtle base tint
                // Removed backdrop-filter - now handled by shader
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -10px 50px rgba(0,0,0,0.02)',
                zIndex: index + 1,
                scale: smoothScale,
                opacity: smoothOpacity,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                willChange: 'transform, opacity',
                overflow: 'hidden' // Prevent shader overflow
            }}
        >
            {/* Content Layer */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {children}
            </div>
        </motion.div>
    );
};

const Gallery = () => {
    const containerRef = useRef(null);
    const selectedWorksRef = useRef(null);
    const snapTimeoutRef = useRef(null);
    const isProgrammaticSnapRef = useRef(false);
    const lastScrollYRef = useRef(0);
    const directionRef = useRef(1);
    const currentSnapIndexRef = useRef(0);
    const isSafari =
        typeof navigator !== 'undefined' &&
        /Safari/i.test(navigator.userAgent) &&
        !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(navigator.userAgent);
    const viewportHeight = isSafari ? '100svh' : '100dvh';
    const { scrollYProgress: selectedProgress } = useScroll({
        target: selectedWorksRef,
        offset: ['start end', 'end start']
    });
    const selectedScale = useTransform(selectedProgress, [0, 0.45, 0.72], [0.82, 1.08, 1]);
    const selectedOpacity = useTransform(selectedProgress, [0.06, 0.35], [0, 1]);
    const selectedY = useTransform(selectedProgress, [0, 0.45], [70, 0]);
    const selectedBlur = useTransform(selectedProgress, [0, 0.4], ['blur(14px)', 'blur(0px)']);
    const selectedScaleSmooth = useSpring(selectedScale, { stiffness: 170, damping: 28, mass: 0.35 });
    const selectedOpacitySmooth = useSpring(selectedOpacity, { stiffness: 150, damping: 24, mass: 0.32 });
    const selectedYSmooth = useSpring(selectedY, { stiffness: 150, damping: 24, mass: 0.32 });

    useEffect(() => {
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

        const settleSnap = () => {
            if (isProgrammaticSnapRef.current) return;
            const root = containerRef.current;
            if (!root) return;

            const snapNodes = root.querySelectorAll('[data-snap-point="true"]');
            if (!snapNodes.length) return;

            const currentY = window.scrollY;
            const maxIndex = snapNodes.length - 1;
            const currentIndex = clamp(currentSnapIndexRef.current, 0, maxIndex);
            const currentAnchorY = snapNodes[currentIndex].offsetTop;
            const deltaFromAnchor = currentY - currentAnchorY;
            const threshold = window.innerHeight * 0.52;

            let targetIndex = currentIndex;
            if (Math.abs(deltaFromAnchor) >= threshold) {
                targetIndex = clamp(
                    currentIndex + (directionRef.current > 0 ? 1 : -1),
                    0,
                    maxIndex
                );
            }

            const targetY = snapNodes[targetIndex].offsetTop;
            if (Math.abs(currentY - targetY) < 12) {
                currentSnapIndexRef.current = targetIndex;
                return;
            }

            isProgrammaticSnapRef.current = true;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
            window.setTimeout(() => {
                currentSnapIndexRef.current = targetIndex;
                isProgrammaticSnapRef.current = false;
            }, 420);
        };

        const onScroll = () => {
            if (isProgrammaticSnapRef.current) return;
            const currentY = window.scrollY;
            const delta = currentY - lastScrollYRef.current;
            if (Math.abs(delta) > 1) {
                directionRef.current = delta > 0 ? 1 : -1;
            }
            lastScrollYRef.current = currentY;
            if (snapTimeoutRef.current) window.clearTimeout(snapTimeoutRef.current);
            snapTimeoutRef.current = window.setTimeout(settleSnap, 260);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (snapTimeoutRef.current) window.clearTimeout(snapTimeoutRef.current);
        };
    }, []);

    return (
        <section
            id="work-gallery"
            ref={containerRef}
            style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 0,
                scrollSnapType: 'y mandatory',
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain',
                scrollPadding: 0
            }}
        >
            {/* Home - First snap point */}
            <div style={{
                width: '100vw',
                minHeight: viewportHeight,
                height: viewportHeight,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always'
            }} data-snap-point="true">
                <Home />
            </div>

            {/* Selected Works - Second snap point */}
            <div
                id="selected-works"
                ref={selectedWorksRef}
                style={{
                    width: '100vw',
                    minHeight: viewportHeight,
                    height: viewportHeight,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'transparent'
                }}
                data-snap-point="true">
                <motion.div
                    style={{
                        scale: selectedScaleSmooth,
                        opacity: selectedOpacitySmooth,
                        y: selectedYSmooth,
                        filter: selectedBlur,
                        transformOrigin: 'center center',
                        willChange: 'transform, opacity, filter'
                    }}
                >
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.03em',
                        marginBottom: '1rem'
                    }}>
                        Selected Works <span style={{ color: 'var(--color-accent)', fontSize: '1rem', verticalAlign: 'middle' }}>●</span>
                    </h2>
                </motion.div>
            </div>

            {projects.map((project, index) => (
                <StickyCardWrapper
                    key={project.id}
                    index={index}
                    viewportHeight={viewportHeight}
                >
                    <ProjectCard {...project} index={index} />
                </StickyCardWrapper>
            ))}

            {/* Footer - Final snap point */}
            <div style={{
                width: '100vw',
                minHeight: '60dvh', // Natural ending height
                position: 'relative',
                display: 'flex',
                background: '#0A0A0A', // Dark background to match new footer
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                zIndex: projects.length + 3
            }} data-snap-point="true">
                <Footer />
            </div>
        </section>
    );
};

export default Gallery;
