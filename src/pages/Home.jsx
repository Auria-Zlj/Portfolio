import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassNavBar from '../components/ui/GlassNavBar';
import DemoOne from '../components/ui/demo';
import QuietCTA from '../components/ui/QuietCTA';

const Home = () => {
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
            await new Promise(r => setTimeout(r, 2300)); // wait for intro to finish (~2000ms) + small buffer
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
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setShowIntro(false);
            return undefined;
        }

        const totalMs = 2000;
        const collapseDurationMs = 700;

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
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '0 6vw',
                    position: 'relative',
                    background: 'transparent',
                    zIndex: 1,
                    color: '#fff',
                    fontFamily: '"JetBrains Mono", monospace',
                }}>
                    {!showIntro && <GlassNavBar />}

                    {/* Top scrim — design system spec: rgba(10,24,38,0.26) → transparent over 55% height */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '55%',
                        background: 'linear-gradient(to bottom, rgba(10,24,38,0.10) 0%, rgba(10,24,38,0.04) 55%, rgba(10,24,38,0) 100%)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />

                    {/* V2 — editorial two-column layout */}
                    <div style={{
                        position: 'absolute',
                        top: 140,
                        left: 0,
                        right: 0,
                        padding: '0 6vw',
                        display: 'grid',
                        gridTemplateColumns: '1.8fr 1fr',
                        columnGap: 100,
                        alignItems: 'start',
                        zIndex: 1,
                        fontFamily: '"Outfit", system-ui, sans-serif',
                    }}>
                        {/* Left column */}
                        <div>

                            {/* Vol. header */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={showIntro ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                                style={{
                                    fontSize: 13,
                                    letterSpacing: '0.22em',
                                    color: 'rgba(255,255,255,0.60)',
                                    textTransform: 'uppercase',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    marginBottom: 16,
                                }}
                            >
                                Vol. 01 — Portfolio / 2026
                            </motion.div>

                            {/* Divider */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={showIntro ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                                style={{
                                    width: '95%',
                                    height: 1,
                                    background: 'rgba(255,255,255,0.25)',
                                    marginBottom: 48,
                                    transformOrigin: 'left',
                                }}
                            />

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={showIntro ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                                style={{
                                    margin: 0,
                                    fontFamily: '"Outfit", system-ui, sans-serif',
                                    fontSize: 72,
                                    fontWeight: 300,
                                    lineHeight: 1.05,
                                    letterSpacing: '-0.02em',
                                    color: 'rgba(255,255,255,0.98)',
                                }}
                            >
                                Designing clear products<br/>
                                for <span style={{ fontWeight: 600 }}>complex systems</span>.
                            </motion.h1>

                            {/* Subline */}
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={showIntro ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
                                style={{
                                    margin: '28px 0 0',
                                    fontFamily: '"Outfit", system-ui, sans-serif',
                                    fontSize: 18,
                                    fontWeight: 300,
                                    lineHeight: 1.5,
                                    color: 'rgba(255,255,255,0.92)',
                                    maxWidth: 760,
                                }}
                            >
                                I design AI-assisted and operational products where usability depends on getting the workflow, logic, and constraints right.
                            </motion.p>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={showIntro ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.58 }}
                                style={{ marginTop: 36 }}
                            >
                                <QuietCTA />
                            </motion.div>
                        </div>

                        {/* Right column — ambient scrolling capabilities */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={showIntro ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                            style={{ paddingTop: 95, paddingLeft: 0 }}
                        >
                            <div style={{
                                fontSize: 18,
                                letterSpacing: '0.18em',
                                color: 'rgba(255,255,255,0.90)',
                                textTransform: 'uppercase',
                                marginBottom: 32,
                                fontFamily: '"JetBrains Mono", monospace',
                            }}>
                                Capabilities
                            </div>

                            {/* Masked scrolling container */}
                            <div style={{
                                borderTop: '1px solid rgba(255,255,255,0.30)',
                                borderBottom: '1px solid rgba(255,255,255,0.30)',
                                paddingRight: '15%',
                            }}>
                            <div style={{
                                height: 260,
                                overflow: 'hidden',
                                maskImage: 'linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)',
                                cursor: 'default',
                                pointerEvents: 'none',
                            }}>
                                <div style={{
                                    animation: 'capScroll 20s linear infinite',
                                }}>
                                    {/* Render list twice for seamless loop */}
                                    {[...Array(2)].map((_, pass) =>
                                        ['Complex Workflows', 'System Logic', 'AI-Assisted Products', 'Operational Tools', 'Implementation-Aware Design', 'Constraint-Driven UX', 'Data-Heavy Interfaces'].map((t) => (
                                            <div key={`${pass}-${t}`} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 18,
                                                padding: '12px 0',
                                                userSelect: 'none',
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: 8,
                                                    height: 8,
                                                    border: '2px solid rgba(255,255,255,0.75)',
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{
                                                    fontSize: 15,
                                                    fontWeight: 300,
                                                    color: 'rgba(255,255,255,0.88)',
                                                    letterSpacing: '0.02em',
                                                    fontFamily: '"JetBrains Mono", monospace',
                                                }}>
                                                    {t}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            </div>
                        </motion.div>
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
                        @keyframes capScroll {
                            from { transform: translateY(0); }
                            to   { transform: translateY(-50%); }
                        }
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

                    {/* Based in Seattle — bottom left */}
                    {!showIntro && (
                        <div style={{
                            position: 'absolute',
                            bottom: '2.4rem',
                            left: '6vw',
                            fontSize: 12,
                            letterSpacing: '0.18em',
                            color: 'rgba(255,255,255,0.65)',
                            textTransform: 'uppercase',
                            fontFamily: '"JetBrains Mono", monospace',
                            pointerEvents: 'none',
                            zIndex: 10,
                        }}>
                            Based in Seattle
                        </div>
                    )}

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
                                opacity: 0.5,
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
