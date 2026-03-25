import { useEffect, useState } from 'react';
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
    const [eggBottom, setEggBottom] = useState('10%');
    const [eggKey, setEggKey] = useState(0);
    const [eggShowing, setEggShowing] = useState(false);
    useEffect(() => {
        const updateEggPos = () => {
            const ratio = window.innerWidth / window.innerHeight;
            // MacBook 14" ratio ~1.54 → bottom 10%
            // as ratio shrinks (narrower/taller), push up
            const pct = Math.min(28, Math.max(10, 10 + (1.54 - ratio) * 22));
            setEggBottom(`${pct.toFixed(1)}%`);
        };
        updateEggPos();
        window.addEventListener('resize', updateEggPos);
        return () => window.removeEventListener('resize', updateEggPos);
    }, []);

    useEffect(() => {
        let alive = true;
        const run = async () => {
            await new Promise(r => setTimeout(r, 6500)); // wait for intro to finish (~4600ms) + buffer
            while (alive) {
                if (alive) { setEggKey(k => k + 1); setEggShowing(true); }
                await new Promise(r => setTimeout(r, 4000)); // visible: draw + linger
                if (alive) setEggShowing(false);
                await new Promise(r => setTimeout(r, 1500)); // pause before next
            }
        };
        run();
        return () => { alive = false; };
    }, []);

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

    return (
        <>
        <div style={{ position: 'relative' }}>
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
                    {!showIntro && <GlassNavBar />}

                    <div className="hero-content" style={{
                        zIndex: 1,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.8rem',
                        marginTop: '-8vh'
                    }}>
                        <div style={{ overflow: 'hidden', padding: '0.5em 2rem' }}>
                            <motion.div
                                style={{
                                    zIndex: 10,
                                    textAlign: 'center',
                                    display: 'inline-block',
                                    position: 'relative',
                                    width: 'fit-content',
                                    margin: '0 auto'
                                }}
                                >
                                    <h2
                                        className="hero-headline"
                                        style={{
                                            margin: 0,
                                            color: '#FFFFFF',
                                            fontFamily: '"Playfair Display", serif',
                                            textAlign: 'center',
                                        }}
                                    >
                                    <span style={{
                                        display: 'block',
                                        fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: '#3A3530',
                                        marginBottom: '10px',
                                        lineHeight: 1.2
                                    }}>
                                        Product Designer
                                    </span>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '34px',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        lineHeight: 1.1,
                                        letterSpacing: '0.01em',
                                        color: '#FFFFFF',
                                        fontFamily: '"Playfair Display", serif',
                                        marginBottom: '0px',
                                    }}>
                                        Crafting clarity for
                                    </span>
                                    <span className="hero-rotating-word-wrap" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        marginTop: '2px',
                                        overflow: 'visible',
                                        minHeight: 'calc(5.5rem * 1.2)',
                                    }}>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={rotatingWords[wordIndex].text}
                                                initial={{ opacity: 0, y: '0.15em' }}
                                                animate={{ opacity: 1, y: '0em' }}
                                                exit={{ opacity: 0, y: '-0.1em' }}
                                                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                                                className="hero-rotating-word"
                                                style={{
                                                    display: 'block',
                                                    fontSize: '5.5rem',
                                                    fontFamily: '"Playfair Display", serif',
                                                    fontStyle: 'italic',
                                                    fontWeight: 400,
                                                    letterSpacing: '-0.02em',
                                                    lineHeight: 1.05,
                                                    color: '#FFFFFF',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {rotatingWords[wordIndex].text}
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
                            fontSize: '12px',
                            fontWeight: 300,
                            letterSpacing: '0.12em',
                            color: '#FFFFFF',
                            fontFamily: '"Inter", sans-serif',
                            opacity: 0.9,
                            textTransform: 'uppercase'
                        }}
                    >
                        Seattle / Vancouver
                    </div>

                    {eggShowing && (
                        <div
                            key={eggKey}
                            className="hero-easter-egg"
                            style={{
                                position: 'absolute',
                                bottom: eggBottom,
                                left: '47%',
                                display: 'inline-block',
                                pointerEvents: 'none',
                                animation: 'eggFadeIn 0.4s ease forwards',
                            }}
                        >
                            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{
                                    display: 'block',
                                    color: '#FFFFFF',
                                    fontFamily: '"Outfit", system-ui, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '18px',
                                    letterSpacing: '0.05em',
                                    opacity: 0,
                                    animation: 'fadeInText 0.5s ease 1.8s forwards',
                                    whiteSpace: 'nowrap',
                                    marginBottom: '0.7vw',
                                    marginLeft: '8vw',
                                }}>
                                    👋 Hello, I&apos;m Auria.
                                </span>
                                <svg
                                    width="11vw"
                                    height="8.2vw"
                                    viewBox="0 0 166 123"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                        marginLeft: '0vw',
                                        overflow: 'visible',
                                        flexShrink: 0,
                                    }}
                                >
                                    <path
                                        d="M1.00024 112.81C16.1669 119.143 55.6002 128.01 92.0002 112.81C128.4 97.6101 149.167 39.1434 155 11.8101"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: 300,
                                            strokeDashoffset: 300,
                                            animation: 'drawArrowBody 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards',
                                        }}
                                    />
                                    <path
                                        d="M141 25.8101C142.167 20.1434 145.6 7.71009 150 3.31009C151.5 1.97676 155.1 -0.189911 157.5 1.81009C159.9 3.81009 161.834 9.1434 162 10.8101C164 18.0101 164.167 25.3101 164.5 28.8101"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: 80,
                                            strokeDashoffset: 80,
                                            animation: 'drawArrowHead 0.4s cubic-bezier(0.4,0,0.2,1) 1.3s forwards',
                                        }}
                                    />
                                </svg>
                            </div>
                        </div>
                    )}


                    <style>{`
                        @keyframes eggFadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes drawArrowBody {
                            to { stroke-dashoffset: 0; }
                        }
                        @keyframes drawArrowHead {
                            to { stroke-dashoffset: 0; }
                        }
                        @keyframes fadeInText {
                            from { opacity: 0; transform: translateY(4px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @media (max-width: 900px) {
                            .hero-easter-egg { display: none; }
                        }
                    `}</style>

                    {/* Scroll cue — absolute inside hero so it moves up with Home like other content */}
                    {!showIntro && (
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [0, 14, 0] }}
                            transition={{
                                duration: 1.75,
                                repeat: Infinity,
                                repeatType: 'loop',
                                ease: 'easeInOut',
                                delay: 0.35,
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '2.4rem',
                                right: '4rem',
                                opacity: 0.9,
                                pointerEvents: 'none',
                                zIndex: 10,
                            }}
                        >
                            <svg width="36" height="110" viewBox="0 0 36 110" fill="none">
                                <line x1="18" y1="0" x2="18" y2="96" stroke="#FFFFFF" strokeWidth="2" />
                                <polyline points="8,88 18,98 28,88" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    )}
                </section>
            </motion.div>
        </div>
        </>
    );
};

export default Home;
