import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import Footer from './Footer';
import Testimonials from './Testimonials';
import Home from '../../pages/Home';
// import HeroShader from '../canvas/HeroShader';
import homeHero from '../../assets/images/homehero.JPG';

import preloHeroHero from '../../assets/images/preloherohero.png';
import preloSm from '../../assets/images/prelosm.jpg';
import xheatHero from '../../assets/images/X-Heal_Hero.png';
import salmonHero from '../../assets/images/salmon_hero.png';
import deviceVideo from '../../assets/images/device.mp4';
// import salmonSaysVideo from '../../assets/images/SalmonSays Final Video.mp4';
const salmonSaysVideo = "https://www.youtube.com/embed/Bk0cCWW6BX4?autoplay=1&loop=1&playlist=Bk0cCWW6BX4&mute=1&controls=0&modestbranding=1";
const ProjectDetailModal = lazy(() => import('../ui/ProjectDetailModal'));

// Preload at module level — card / hero imagery only. Modal-only assets load on “View project”.
const ALL_PRELOAD_SOURCES = [
    homeHero, salmonHero, xheatHero, preloHeroHero,
    preloSm,
];

function ModalChunkFallback({ onClose }) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (typeof document === 'undefined') return null;
    return createPortal(
        <>
            <div
                role="presentation"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            />
            <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                aria-label="Loading project"
                className="modal-chunk-fallback-panel"
            >
                <div className="modal-chunk-fallback-bar" style={{ width: '92%' }} />
                <div className="modal-chunk-fallback-bar" style={{ width: '72%' }} />
                <div className="modal-chunk-fallback-bar" style={{ width: '56%' }} />
            </div>
        </>,
        document.body
    );
}

if (typeof window !== 'undefined') {
    ALL_PRELOAD_SOURCES.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
    });
    ALL_PRELOAD_SOURCES.forEach((src) => {
        const img = new Image();
        img.fetchPriority = 'high';
        img.src = src;
        img.onload = () => { img.decode?.().catch(() => {}); };
    });
}

const projects = [
    {
        id: 3,
        title: 'Salmon Says',
        category: 'Human-in-the-Loop UX',
        image: salmonHero,
        secondaryImage: '',
        secondaryVideo: salmonSaysVideo,
        eyebrow: '01 / Case Study',
        description: 'Built an AI-assisted system for faster salmon origin identification. Reduced turnaround from days to near-immediate.',
        tags: ['Decision Architecture', 'Human-in-the-Loop AI'],
        sponsor: '',
        highlights: ['Deployed internally at Washington DFW'],
        thumbnails: [],
        thumbnailLabels: [],
        thumbnailVideo: salmonSaysVideo,
    },
    {
        id: 1,
        title: 'X-Heal',
        category: 'Real-World Systems',
        image: xheatHero,
        secondaryImage: '',
        secondaryVideo: deviceVideo,
        eyebrow: '02 / Case Study',
        description: 'Real-time rehab system that turns physical\nmotion into guided exercise feedback.',
        tags: ['Dual BLE Sensors', 'System Logic'],
        sponsor: 'In collaboration with T-Mobile',
        highlights: ['Motion Guidance', 'Clinician Feedback Loop', 'Connected Rehab Experience'],
        thumbnails: [],
        thumbnailLabels: [],
        thumbnailVideo: deviceVideo,
    },
    {
        id: 2,
        title: 'Prelo',
        category: 'Decision UX',
        image: preloHeroHero,
        secondaryImage: preloSm,
        eyebrow: '03 / Case Study',
        description: 'Turns unfamiliar menus into confident choices through visual previews and structured dish information.',
        tags: ['Decision UX', 'Information Structuring'],
        sponsor: '',
        highlights: ['Menu Clarity', 'Visual Decision Support', 'Structured Dish Data'],
        thumbnails: [preloSm],
        thumbnailLabels: [],
    },
];

const logoItems = [
    { src: '/image/Amazon_Web_Services_Logo.svg.png',                          alt: 'AWS',                          name: 'Amazon Web Services', height: 56  },
    { src: '/image/Washington_State_Department_of_Fish_and_Wildlife_(logo).svg', alt: 'WA Fish & Wildlife',           name: 'WA Dept. of Fish & Wildlife',  height: 120 },
    { src: '/image/Bosch-logo.svg.png',                                         alt: 'Bosch',                        name: 'Bosch Home Comfort',  height: 44  },
    { src: '/image/T-Mobile-Logo.png',                                          alt: 'T-Mobile',                     name: 'T-Mobile',            height: 80  },
    { src: '/image/Sheridan_College_Logo.png',                                  alt: 'Sheridan College',             name: 'Sheridan College',    height: 85  },
    { src: '/image/Skill-Squirrel-LOGO-vert-PURPLE.png',                        alt: 'Skill Squirrel',               name: 'Skill Squirrel',      height: 105 },
];

const LogoSection = () => {
    const [hoveredName, setHoveredName] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 6vw' }}>
            {/* Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                <span style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: '1.3rem',
                    fontWeight: 450,
                    color: '#FFFFFF',
                    marginBottom: '6px',
                    letterSpacing: '0.06em',
                }}>
                    Worked with
                </span>
                <div style={{ position: 'relative', height: '3.8rem', overflow: 'hidden' }}>
                    <p aria-hidden style={{
                        fontFamily: '"Outfit", system-ui, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: 'transparent',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        margin: 0,
                        lineHeight: 1.2,
                    }}>
                        WA Dept. of Fish & Wildlife
                    </p>
                    <div style={{ position: 'absolute', inset: 0 }}>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={hoveredName ?? 'default'}
                                initial={{ y: 12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -12, opacity: 0 }}
                                transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    fontFamily: '"Outfit", system-ui, sans-serif',
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    color: '#E3FE7A',
                                    whiteSpace: 'nowrap',
                                    margin: 0,
                                    lineHeight: 1.2,
                                    textAlign: 'center',
                                    width: '100%',
                                    textShadow: '0 0 32px #E3FE7A40',
                                }}
                            >
                                {hoveredName ?? 'real teams'}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Logos */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5rem',
                flexWrap: 'wrap',
            }}>
                {logoItems.map(({ src, alt, name, height }) => {
                    const isHovered = hoveredName === name;
                    const isDimmed = hoveredName !== null && !isHovered;
                    return (
                        <motion.img
                            key={alt}
                            src={src}
                            alt={alt}
                            onMouseEnter={() => setHoveredName(name)}
                            onMouseLeave={() => setHoveredName(null)}
                            animate={{
                                scale: isHovered ? 1.08 : 1,
                                opacity: isDimmed ? 0.35 : 1,
                            }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            style={{
                                height: `${height}px`,
                                objectFit: 'contain',
                                mixBlendMode: 'screen',
                                filter: isHovered
                                    ? 'invert(1) grayscale(100%) brightness(2.5) opacity(1)'
                                    : 'invert(1) grayscale(100%) brightness(2) opacity(0.85)',
                                cursor: 'default',
                                transition: 'filter 0.22s ease',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

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
    const selectedScale = useTransform(selectedProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
    const selectedY = useTransform(selectedProgress, [0, 0.5, 1], [30, 0, -30]);
    const selectedScaleSmooth = useSpring(selectedScale, { stiffness: 230, damping: 26, mass: 0.28 });
    const selectedYSmooth = useSpring(selectedY, { stiffness: 210, damping: 28, mass: 0.26 });
    const activeProject = projects.find((project) => project.id === activeProjectId) || null;

    useEffect(() => {
        if (activeProjectId == null) return undefined;
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const lenis = window.__portfolioLenis;
        lenis?.stop?.();
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            lenis?.start?.();
        };
    }, [activeProjectId]);

    useEffect(() => {
        const resetHeroShader = () => {
            setHeroShaderResetKey((prev) => prev + 1);
        };

        window.addEventListener('portfolio:reset-hero-shader', resetHeroShader);
        return () => {
            window.removeEventListener('portfolio:reset-hero-shader', resetHeroShader);
        };
    }, []);

    /** Past Selected Works → project / footer are dark; nav switches to light text via event */
    useEffect(() => {
        const NAV_THRESHOLD = 72;
        let ticking = false;
        const update = () => {
            ticking = false;
            const el = selectedWorksRef.current;
            if (!el) return;
            const bottom = el.getBoundingClientRect().bottom;
            const surface = bottom < NAV_THRESHOLD ? 'dark' : 'light';
            window.dispatchEvent(new CustomEvent('portfolio:nav-surface', { detail: { surface } }));
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update);
        const lenis = window.__portfolioLenis;
        lenis?.on?.('scroll', update);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', update);
            lenis?.off?.('scroll', update);
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
            {/* Salmon fixed (z3) + X-Heal/Prelo sticky (z5). Fixed + backdrop-filter is what causes the glass seam vs sticky cards. */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 3,
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }}>
                <ProjectCard
                    {...projects[0]}
                    index={0}
                    onOpenProject={setActiveProjectId}
                    thumbnails={projects[0].thumbnails || []}
                    thumbnailLabels={projects[0].thumbnailLabels || []}
                />
            </div>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `calc(${viewportHeight} * 7.85)`,
                zIndex: 5,
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
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
                            pointerEvents: 'auto',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                            marginTop: index === 0
                                ? `calc(${viewportHeight} * 4.6)`
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
                zIndex: 24,
                backgroundImage: `url(${homeHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }} data-snap-point="true">
                <Home />
            </div>

            {/* Selected Works - Second snap point */}
            <div
                id="selected-works"
                style={{
                    width: '100vw',
                    minHeight: viewportHeight,
                    height: viewportHeight,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 22,
                    backgroundImage: `url(${homeHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
                data-snap-point="true"
            >
                <motion.div
                    style={{
                        opacity: 1,
                        scale: selectedScaleSmooth,
                        y: selectedYSmooth,
                        transformOrigin: 'center center',
                        willChange: 'transform',
                    }}
                >
                    <h2 style={{
                        fontFamily: '"Outfit", system-ui, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        letterSpacing: '-0.03em',
                    }}>
                        Selected Works <span style={{ color: '#E3FE7A', fontSize: '1rem', verticalAlign: 'middle' }}>●</span>
                    </h2>
                </motion.div>
            </div>

            {/* Client & Collaboration Wall - Third snap point */}
            <div
                id="logo-wall"
                ref={selectedWorksRef}
                style={{
                    width: '100vw',
                    minHeight: viewportHeight,
                    height: viewportHeight,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'normal',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '10vh',
                    position: 'relative',
                    zIndex: 22,
                    backgroundImage: `url(${homeHero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
                data-snap-point="true"
            >
                <LogoSection />
            </div>

            {/* Project snap spacers — scroll height + snap; Salmon fixed, X-Heal/Prelo sticky. */}
            {projects.map((project) => (
                <div
                    key={`spacer-${project.id}`}
                    data-snap-point="true"
                    style={{
                        width: '100vw',
                        height: `calc(${viewportHeight} * 1.6)`,
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'normal',
                        flexShrink: 0,
                        pointerEvents: 'none',
                        contentVisibility: 'auto',
                        containIntrinsicSize: `100vw calc(${viewportHeight} * 1.6)`,
                    }}
                />
            ))}

            {/* Testimonials */}
            <div style={{
                width: '100vw',
                position: 'relative',
                background: '#0A0A0A',
                zIndex: projects.length + 3,
            }}>
                <Testimonials />
            </div>

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

            {activeProjectId != null && (
                <Suspense
                    fallback={
                        <ModalChunkFallback onClose={() => setActiveProjectId(null)} />
                    }
                >
                    <ProjectDetailModal
                        project={activeProject}
                        onClose={() => setActiveProjectId(null)}
                    />
                </Suspense>
            )}
        </section>
    );
};

export default Gallery;
