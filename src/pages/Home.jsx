import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GlassNavBar from '../components/ui/GlassNavBar';
import DemoOne from '../components/ui/demo';

const rotatingWords = [
    { text: 'complex systems', color: '#A81415' },
    { text: 'data-driven workflows', color: '#A81415' },
    { text: 'AI-assisted products', color: '#A81415' },
];

const Home = () => {
    const [wordIndex, setWordIndex] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [introCollapse, setIntroCollapse] = useState(false);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setWordIndex((current) => (current + 1) % rotatingWords.length);
        }, 3200);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setShowIntro(false);
            return undefined;
        }

        const totalMs = 4600;
        const collapseDurationMs = 1200;

        const collapseTimer = window.setTimeout(() => {
            setIntroCollapse(true);
        }, totalMs - collapseDurationMs);

        const timer = window.setTimeout(() => {
            setShowIntro(false);
            setIntroCollapse(false);
            window.scrollTo({ top: 0, behavior: 'auto' });
            if (window.__portfolioLenis) {
                window.__portfolioLenis.scrollTo(0, { immediate: true, force: true });
            }
        }, totalMs);

        return () => {
            window.clearTimeout(collapseTimer);
            window.clearTimeout(timer);
        };
    }, []);

    const containerRef = useRef(null);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {showIntro && (
                <motion.div
                    initial={false}
                    animate={
                        introCollapse
                            ? {
                                opacity: 1,
                                scale: 1,
                                filter: 'blur(0px)',
                                z: 0,
                            }
                            : {
                                opacity: 1,
                                scale: 1,
                                filter: 'blur(0px)',
                                z: 0,
                            }
                    }
                    transition={{
                        duration: 1.28,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1200,
                        pointerEvents: 'auto',
                        background: '#F4F4F4',
                        overflow: 'hidden',
                        transformPerspective: 1200,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <DemoOne collapse={introCollapse} />
                </motion.div>
            )}

            <motion.div
                initial={false}
                animate={
                    showIntro
                        ? { scale: 1.08, opacity: 0, filter: 'blur(8px)' }
                        : { scale: 1, opacity: 1, filter: 'blur(0px)' }
                }
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'relative',
                    transformOrigin: '50% 50%',
                    willChange: 'transform, opacity, filter',
                    zIndex: 1
                }}
            >
                <section id="home" className="hero" style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 5vw',
                    position: 'relative',
                    background: 'transparent',
                    zIndex: 1
                }}>
                    <GlassNavBar />

                    <div className="hero-content" style={{
                        zIndex: 1,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.8rem',
                        marginTop: '0'
                    }}>
                        <div style={{ overflow: 'hidden', padding: '0.5em 2rem' }}>
                            <motion.div
                                style={{
                                    zIndex: 10,
                                    textAlign: 'left',
                                    display: 'inline-block',
                                    position: 'relative',
                                    width: 'fit-content',
                                    margin: '0 auto'
                                }}
                                >
                                    <h2
                                        className="hero-headline"
                                    style={{
                                        fontSize: '6.5vw',
                                        lineHeight: 1.15,
                                        fontWeight: 700,
                                        letterSpacing: '-0.025em',
                                        maxWidth: '100%',
                                        margin: 0,
                                        color: '#1A1A1A',
                                        textShadow: '0 0 0.35px rgba(255,255,255,0.82), 0 0 1.2px rgba(255,255,255,0.34)',
                                        wordSpacing: '0.06em',
                                        fontFamily: '"Fraunces", "Cormorant Garamond", serif'
                                    }}
                                >
                                    <span style={{ display: 'block', fontSize: '0.44em', lineHeight: 1.1, marginBottom: '0.58em', letterSpacing: '-0.01em' }}>
                                        Product Designer
                                    </span>
                                    <span style={{ display: 'block' }}>
                                        Designing tools for
                                    </span>
                                    <span className="hero-rotating-word-wrap" style={{ display: 'block', marginTop: '0.1em', position: 'relative' }}>
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                visibility: 'hidden',
                                                display: 'block',
                                                whiteSpace: 'nowrap',
                                                fontSize: '0.92em'
                                            }}
                                        >
                                            data-driven workflows
                                        </span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={rotatingWords[wordIndex].text}
                                                initial={{ opacity: 0, y: '0.2em' }}
                                                animate={{ opacity: 1, y: '0em' }}
                                                exit={{ opacity: 0, y: '-0.15em' }}
                                                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                                                className="hero-rotating-word"
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.92em',
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                <span style={{ color: rotatingWords[wordIndex].color }}>
                                                    {rotatingWords[wordIndex].text}
                                                </span>
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </h2>
                            </motion.div>
                        </div>
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '3rem',
                            left: '4rem',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            color: '#1A1A1A',
                            fontFamily: '"Inter", sans-serif',
                            opacity: 0.6,
                            textTransform: 'uppercase'
                        }}
                    >
                        Seattle / Vancouver
                    </div>

                    <motion.div
                        initial={false}
                        animate={{
                            opacity: 0.6,
                            y: [0, 10, 0]
                        }}
                        transition={{
                            y: {
                                delay: 0.4,
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '3rem',
                            right: '4rem',
                            opacity: 0.6
                        }}
                    >
                        <svg width="24" height="80" viewBox="0 0 24 80" fill="none">
                            <line x1="12" y1="0" x2="12" y2="70" stroke="#1A1A1A" strokeWidth="1.5" />
                            <polyline points="6,64 12,70 18,64" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </section>
            </motion.div>
        </div>
    );
};

export default Home;
