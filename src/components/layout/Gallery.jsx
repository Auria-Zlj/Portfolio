import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import ProjectDetailModal from '../ui/ProjectDetailModal';
import Footer from './Footer';
import Home from '../../pages/Home';

import preloHero from '../../assets/images/Prelo_hero.png';
import xheatHero from '../../assets/images/X-Heal_Hero.png';
import mushroomateHero from '../../assets/images/mushroomate_hero.png';
import x1 from '../../assets/images/X1.png';
import x12 from '../../assets/images/X1.2.png';
import x13 from '../../assets/images/X1.3.png';
import m2 from '../../assets/images/M2.png';
import m21 from '../../assets/images/M2.1.png';
import preloLong from '../../assets/images/p1.png';

let hasPreloadedProjectAssets = false;

const projects = [
    {
        id: 1,
        title: 'X-Heal',
        category: 'Real-World Systems',
        image: xheatHero,
        secondaryImage: '',
        eyebrow: '01 / Case Study',
        description: 'Real-time rehab system that turns physical motion into guided exercise feedback.',
        tags: ['Dual BLE Sensors', 'System Logic'],
        sponsor: 'In collaboration with T-Mobile',
        highlights: ['Motion Guidance', 'Clinician Feedback Loop', 'Connected Rehab Experience'],
    },
    {
        id: 2,
        title: 'Prelo',
        category: 'Decision UX',
        image: preloHero,
        secondaryImage: '',
        eyebrow: '02 / Case Study',
        description: 'Turns unfamiliar menus into confident choices through visual previews and structured dish information.',
        tags: ['Decision UX', 'Information Structuring'],
        sponsor: '',
        highlights: ['Menu Clarity', 'Visual Decision Support', 'Structured Dish Data'],
    },
    {
        id: 3,
        title: 'MushRoommate',
        category: 'Process Design',
        image: mushroomateHero,
        secondaryImage: '',
        eyebrow: '03 / Case Study',
        description: 'A home growing service designed for post-pandemic food supply disruption.',
        tags: ['Process Design', 'Habit Support'],
        sponsor: '',
        highlights: ['Home Grow Workflow', 'Behavior Support', 'Supply Resilience'],
    },
];

const StickyCardWrapper = ({ children, index, viewportHeight }) => {
    return (
        <div
            data-snap-point="true"
            style={{
                position: 'relative',
                width: '100vw',
                minHeight: viewportHeight,
                height: viewportHeight,
                background: 'transparent',
                // Removed backdrop-filter - now handled by shader
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                zIndex: index + 1,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                willChange: 'auto',
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
        </div>
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
    const [activeProjectId, setActiveProjectId] = useState(null);
    const isSafari =
        typeof navigator !== 'undefined' &&
        /Safari/i.test(navigator.userAgent) &&
        !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(navigator.userAgent);
    const viewportHeight = isSafari ? '100svh' : '100dvh';
    const { scrollYProgress: selectedProgress } = useScroll({
        target: selectedWorksRef,
        offset: ['start end', 'end start']
    });
    // Symmetric zoom: coming from top or bottom both have the same reveal.
    const selectedOpacity = useTransform(selectedProgress, [0, 0.18, 0.5, 0.82, 1], [0, 0.78, 1, 0.78, 0]);
    const selectedScale = useTransform(selectedProgress, [0, 0.5, 1], [0.84, 1, 0.84]);
    const selectedY = useTransform(selectedProgress, [0, 0.5, 1], [44, 0, -44]);
    const selectedOpacitySmooth = useSpring(selectedOpacity, { stiffness: 210, damping: 28, mass: 0.26 });
    const selectedScaleSmooth = useSpring(selectedScale, { stiffness: 230, damping: 26, mass: 0.28 });
    const selectedYSmooth = useSpring(selectedY, { stiffness: 210, damping: 28, mass: 0.26 });
    const activeProject = projects.find((project) => project.id === activeProjectId) || null;
    const preloadedImageRefs = useRef([]);
    const preloadLinkRefs = useRef([]);

    useEffect(() => {
        if (hasPreloadedProjectAssets || typeof window === 'undefined') return;
        hasPreloadedProjectAssets = true;

        const preloadSources = [
            xheatHero,
            preloHero,
            mushroomateHero,
            x1,
            x12,
            x13,
            m2,
            m21,
            preloLong,
        ];

        preloadSources.forEach((src) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
            preloadLinkRefs.current.push(link);
        });

        preloadSources.forEach((src) => {
            const img = new Image();
            img.loading = 'eager';
            img.fetchPriority = 'high';
            img.decoding = 'async';
            img.src = src;
            img.onload = () => {
                if (typeof img.decode === 'function') {
                    img.decode().catch(() => {});
                }
            };
            preloadedImageRefs.current.push(img);
        });

        return () => {
            preloadLinkRefs.current.forEach((link) => link.remove());
            preloadLinkRefs.current = [];
        };
    }, []);

    useEffect(() => {
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const getNearestSnapIndex = (nodes, y) => {
            let nearestIndex = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;
            nodes.forEach((node, idx) => {
                const distance = Math.abs(node.offsetTop - y);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = idx;
                }
            });
            return nearestIndex;
        };

        const settleSnap = () => {
            if (isProgrammaticSnapRef.current) return;
            const root = containerRef.current;
            if (!root) return;

            const snapNodes = root.querySelectorAll('[data-snap-point="true"]');
            if (!snapNodes.length) return;

            const currentY = window.scrollY;
            const maxIndex = snapNodes.length - 1;
            const topLockThreshold = window.innerHeight * 0.12;
            if (currentY <= topLockThreshold) {
                currentSnapIndexRef.current = 0;
                return;
            }

            const currentIndex = clamp(
                getNearestSnapIndex(Array.from(snapNodes), currentY),
                0,
                maxIndex
            );
            currentSnapIndexRef.current = currentIndex;
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
            const topLockThreshold = window.innerHeight * 0.12;
            if (currentY <= topLockThreshold) {
                currentSnapIndexRef.current = 0;
                lastScrollYRef.current = currentY;
                if (snapTimeoutRef.current) window.clearTimeout(snapTimeoutRef.current);
                return;
            }
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
                        opacity: selectedOpacitySmooth,
                        scale: selectedScaleSmooth,
                        y: selectedYSmooth,
                        transformOrigin: 'center center',
                        willChange: 'transform, opacity'
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
                    <ProjectCard
                        {...project}
                        index={index}
                        onOpenProject={setActiveProjectId}
                    />
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

            <ProjectDetailModal
                project={activeProject}
                onClose={() => setActiveProjectId(null)}
            />
        </section>
    );
};

export default Gallery;
