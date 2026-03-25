import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import ProjectDetailModal from '../ui/ProjectDetailModal';
import Footer from './Footer';
import Home from '../../pages/Home';
// import HeroShader from '../canvas/HeroShader';
import homeHero from '../../assets/images/homehero.JPG';

import preloHero from '../../assets/images/Prelo_hero.png';
import preloSm from '../../assets/images/prelosm.png';
import xheatHero from '../../assets/images/X-Heal_Hero.png';
import salmonHero from '../../assets/images/salmon_hero.png';
import salmonRouting from '../../assets/images/salmon_routing.png';
import salmonPipeline from '../../assets/images/salmonPipline.png';
import deviceVideo from '../../assets/images/device.mov';
// import salmonSaysVideo from '../../assets/images/SalmonSays Final Video.mp4';
const salmonSaysVideo = "https://www.youtube.com/embed/Bk0cCWW6BX4?autoplay=1&loop=1&playlist=Bk0cCWW6BX4&mute=1&controls=0&modestbranding=1";
import x1 from '../../assets/images/X1.png';
import x12 from '../../assets/images/X1.2.png';
import x13 from '../../assets/images/X1.3.png';
import preloLong from '../../assets/images/p1.png';

let hasPreloadedProjectAssets = false;

const projects = [
    {
        id: 3,
        title: 'Salmon Says',
        category: 'Human-in-the-Loop UX',
        image: salmonHero,
        secondaryImage: '',
        secondaryVideo: salmonSaysVideo,
        eyebrow: '01 / Case Study',
        description: 'Designing a faster salmon origin identification workflow for Washington Department of Fish & Wildlife.',
        tags: ['Decision Architecture', 'Safe Automation'],
        sponsor: 'deployed at Washington DFW for internal use',
        highlights: ['Confidence Triage', 'Expert Guardrails', 'Structured Write-back'],
        thumbnails: [salmonRouting, salmonPipeline],
        thumbnailLabels: ['Origin Routing', 'AI Pipeline'],
    },
    {
        id: 1,
        title: 'X-Heal',
        category: 'Real-World Systems',
        image: xheatHero,
        secondaryImage: '',
        secondaryVideo: deviceVideo,
        eyebrow: '02 / Case Study',
        description: 'Real-time rehab system that turns physical motion into guided exercise feedback.',
        tags: ['Dual BLE Sensors', 'System Logic'],
        sponsor: 'In collaboration with T-Mobile',
        highlights: ['Motion Guidance', 'Clinician Feedback Loop', 'Connected Rehab Experience'],
        thumbnails: [x1, x12],
        thumbnailLabels: ['Device Interface', 'Motion Feedback'],
    },
    {
        id: 2,
        title: 'Prelo',
        category: 'Decision UX',
        image: preloHero,
        secondaryImage: preloSm,
        eyebrow: '03 / Case Study',
        description: 'Turns unfamiliar menus into confident choices through visual previews and structured dish information.',
        tags: ['Decision UX', 'Information Structuring'],
        sponsor: '',
        highlights: ['Menu Clarity', 'Visual Decision Support', 'Structured Dish Data'],
        thumbnails: [preloSm, preloLong],
        thumbnailLabels: ['Mobile App', 'Full Flow'],
    },
];

// Removed StickyCardWrapper — replaced with inline sticky stacking in Gallery return

const Gallery = () => {
    const containerRef = useRef(null);
    const selectedWorksRef = useRef(null);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [heroShaderResetKey, setHeroShaderResetKey] = useState(0);
    const isSafari =
        typeof navigator !== 'undefined' &&
        /Safari/i.test(navigator.userAgent) &&
        !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(navigator.userAgent);
    const viewportHeight = isSafari ? '100svh' : '100dvh';
    // bgY removed — homeHero stays fixed so no white gap between sections

    const { scrollYProgress: selectedProgress } = useScroll({
        target: selectedWorksRef,
        offset: ['start end', 'end start']
    });
    // Symmetric zoom: coming from top or bottom both have the same reveal.
    const selectedOpacity = useTransform(selectedProgress, [0, 0.10, 0.5, 0.96, 1], [0, 1, 1, 1, 0]);
    const selectedScale = useTransform(selectedProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
    const selectedY = useTransform(selectedProgress, [0, 0.5, 1], [30, 0, -30]);
    const selectedOpacitySmooth = useSpring(selectedOpacity, { stiffness: 210, damping: 28, mass: 0.26 });
    const selectedScaleSmooth = useSpring(selectedScale, { stiffness: 230, damping: 26, mass: 0.28 });
    const selectedYSmooth = useSpring(selectedY, { stiffness: 210, damping: 28, mass: 0.26 });
    const activeProject = projects.find((project) => project.id === activeProjectId) || null;
    const preloadedImageRefs = useRef([]);
    const preloadLinkRefs = useRef([]);

    useEffect(() => {
        const resetHeroShader = () => {
            setHeroShaderResetKey((prev) => prev + 1);
        };

        window.addEventListener('portfolio:reset-hero-shader', resetHeroShader);
        return () => {
            window.removeEventListener('portfolio:reset-hero-shader', resetHeroShader);
        };
    }, []);

    useEffect(() => {
        if (hasPreloadedProjectAssets || typeof window === 'undefined') return;
        hasPreloadedProjectAssets = true;

        const preloadSources = [
            homeHero,
            salmonHero,
            xheatHero,
            preloHero,
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
            link.fetchPriority = 'high';
            document.head.appendChild(link);
            preloadLinkRefs.current.push(link);
        });

        preloadSources.forEach((src) => {
            const img = new Image();
            img.loading = 'eager';
            img.fetchPriority = 'high';
            img.src = src;
            const decodeWhenReady = () => {
                if (typeof img.decode === 'function') {
                    img.decode().catch(() => {});
                }
            };
            if (img.complete) {
                decodeWhenReady();
            } else {
                img.onload = decodeWhenReady;
            }
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
                scrollPadding: 0,
            }}
        >
            {/* Salmon Says — fixed in viewport, revealed when Home+SW scroll away */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 3,
                willChange: 'transform',
            }}>
                <ProjectCard
                    {...projects[0]}
                    index={0}
                    onOpenProject={setActiveProjectId}
                    thumbnails={projects[0].thumbnails || []}
                    thumbnailLabels={projects[0].thumbnailLabels || []}
                />
            </div>

            {/* X-Heal & Prelo — absolute wrapper with sticky stacking, above Salmon Says */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `calc(${viewportHeight} * 7.2)`,
                zIndex: 5,
            }}>
                {projects.slice(1).map((project, index) => (
                    <div
                        key={project.id}
                        style={{
                            position: 'sticky',
                            top: 0,
                            height: viewportHeight,
                            overflow: 'hidden',
                            zIndex: index + 1,
                            marginTop: index === 0
                                ? `calc(${viewportHeight} * 3.95)`
                                : index === 1
                                ? `calc(${viewportHeight} * 0.6)`
                                : 0,
                        }}
                    >
                        <ProjectCard
                            {...project}
                            index={index + 1}
                            onOpenProject={setActiveProjectId}
                            thumbnails={project.thumbnails || []}
                            thumbnailLabels={project.thumbnailLabels || []}
                        />
                    </div>
                ))}
            </div>

            {/* Home - First snap point — sits on top of everything */}
            <div style={{
                width: '100vw',
                minHeight: viewportHeight,
                height: viewportHeight,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                position: 'relative',
                zIndex: 20,
                backgroundImage: `url(${homeHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }} data-snap-point="true">
                <Home />
            </div>

            {/* Selected Works - Second snap point — above project cards */}
            <div
                id="selected-works"
                ref={selectedWorksRef}
                style={{
                    width: '100vw',
                    minHeight: `calc(${viewportHeight} * 1.35)`,
                    height: `calc(${viewportHeight} * 1.35)`,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url(${homeHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    position: 'relative',
                    zIndex: 18,
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

            {/* Project snap spacers — transparent divs that provide scroll height + snap points.
                The actual visible cards live in the absolute layer above. */}
            {projects.map((project, index) => (
                <div
                    key={`spacer-${project.id}`}
                    data-snap-point="true"
                    style={{
                        width: '100vw',
                        height: `calc(${viewportHeight} * 1.6)`,
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        flexShrink: 0,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Footer - Final snap point */}
            <div style={{
                width: '100vw',
                minHeight: '70dvh',
                paddingTop: '10dvh',
                position: 'relative',
                display: 'flex',
                background: '#0A0A0A',
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
