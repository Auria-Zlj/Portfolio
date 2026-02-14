import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import HeroShader from '../components/canvas/HeroShader';
import GlassNavBar from '../components/ui/GlassNavBar';
import RevealFx from '../components/utils/RevealFx';

const rotatingWords = [
    { text: 'reliably', color: '#A81415' },
    { text: 'clearly', color: '#A81415' },
    { text: 'intuitively', color: '#A81415' },
];

const Home = () => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setWordIndex((current) => (current + 1) % rotatingWords.length);
        }, 3200);

        return () => window.clearInterval(interval);
    }, []);

    // Force reload
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Keep headline motion in 2D to avoid Chrome text rasterization blur.
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -24]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    // Keep fluid visible across sections; do not fade out at Selected Works.
    const fluidOpacity = 1;

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* WebGL Background */}
            <motion.div className="canvas-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: fluidOpacity
            }}>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <HeroShader />
                    </Suspense>
                </Canvas>
            </motion.div>

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
                {/* Glass Navigation Bar */}
                <GlassNavBar />

                <div className="hero-content" style={{
                    zIndex: 1,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2.5rem',
                    marginTop: '0' // Changed from 8vh to 0 for true center
                }}>
                    {/* Role Label - "Engineering Detail" Outline Style */}
                    <RevealFx delay={0.8} y={50} blur="0px" duration={1.2}>
                        <p className="hero-role-badge">
                            <span className="hero-role-badge-text">Product Designer / UX Designer</span>
                        </p>
                    </RevealFx>

                    {/* Masked Headline with Parallax */}
                    <div style={{ overflow: 'hidden', padding: '0.5em 2rem' }}>
                        <motion.div
                            style={{
                                zIndex: 10,
                                y: yParallax,
                                opacity: opacity,
                                textAlign: 'left',
                                display: 'inline-block',
                                position: 'relative'
                            }}
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1], // Smooth organic entrance
                                delay: 0.2
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
                                I make complex products <br />
                                feel simple — <br />
                                and work{' '}
                                <span className="hero-rotating-word-wrap" style={{ display: 'inline-block', marginLeft: '0.08em' }}>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={rotatingWords[wordIndex].text}
                                            initial={{ opacity: 0, y: '0.2em' }}
                                            animate={{ opacity: 1, y: '0em' }}
                                            exit={{ opacity: 0, y: '-0.15em' }}
                                            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                                            className="hero-rotating-word"
                                            style={{ display: 'inline-block', fontSize: '0.92em' }}
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

                {/* Location - Bottom Left */}
                <RevealFx delay={1.0} y={50} blur="0px" duration={1.2} style={{ position: 'absolute', bottom: '3rem', left: '4rem' }}>
                    <div
                        style={{
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
                </RevealFx>

                {/* Scroll Arrow - Right Side */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        y: [0, 10, 0] // Bounce animation
                    }}
                    transition={{
                        opacity: { delay: 1.2, duration: 0.6 },
                        y: {
                            delay: 2,
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '3rem', // Symmetrical with location text
                        right: '4rem', // Aligned with nav padding
                        opacity: 0.6
                    }}
                >
                    <svg width="24" height="80" viewBox="0 0 24 80" fill="none">
                        <line x1="12" y1="0" x2="12" y2="70" stroke="#1A1A1A" strokeWidth="1.5" />
                        <polyline points="6,64 12,70 18,64" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
