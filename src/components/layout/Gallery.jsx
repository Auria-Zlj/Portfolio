import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import ProjectDetailModal from '../ui/ProjectDetailModal';
import Footer from './Footer';
import Home from '../../pages/Home';

import preloHero from '../../assets/images/Prelo_hero.png';
import xheatHero from '../../assets/images/X-Heal_Hero.png';
import salmonHero from '../../assets/images/salmon_hero.png';
import salmonRouting from '../../assets/images/salmon_routing.png';
import salmonPipeline from '../../assets/images/salmonPipline.png';
import x1 from '../../assets/images/X1.png';
import x12 from '../../assets/images/X1.2.png';
import x13 from '../../assets/images/X1.3.png';
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
        title: 'Wildlife HITL ML',
        category: 'Human-in-the-Loop UX',
        image: salmonHero,
        secondaryImage: salmonPipeline,
        eyebrow: '03 / Case Study',
        description: 'Human-calibrated ML routing system that replaced physical mail handoff with confidence-based decision architecture.',
        tags: ['Decision Architecture', 'Safe Automation'],
        sponsor: 'Washington DFW · NDA details redacted',
        highlights: ['Confidence Triage', 'Expert Guardrails', 'Structured Write-back'],
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
            salmonHero,
            salmonPipeline,
            salmonRouting,
            x1,
            x12,
            x13,
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
                overscrollBehavior: 'auto',
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
