import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroShader from '../components/canvas/HeroShader';
import GlassNavBar from '../components/ui/GlassNavBar';

const Home = () => {
    // Force reload
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Z-axis displacement: Move letters "closer" to the user as they scroll
    // We'll use scale and a subtle y-offset to simulate Z-axis depth in a 2D plane
    // or use actual translateZ if perspective is set.
    const zTranslate = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* WebGL Background */}
            <div className="canvas-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -999,
                pointerEvents: 'none'
            }}>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <HeroShader />
                    </Suspense>
                </Canvas>
            </div>

            <section className="hero" style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 5vw',
                position: 'relative',
                background: 'transparent',
                perspective: '1000px' // For Z-axis effects
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
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        style={{
                            fontSize: '0.9rem', // Increased from 0.75rem
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#1A1A1A',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(26, 26, 26, 0.2)',
                            padding: '0.5rem 1.5rem', // Increased padding
                            borderRadius: '4px',
                            display: 'inline-block',
                            margin: 0,
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            fontFamily: '"JetBrains Mono", monospace'
                        }}
                    >
                        Product Designer / UX Designer
                    </motion.p>

                    {/* Masked Headline with Parallax */}
                    <div style={{ overflow: 'hidden', padding: '0.5em 2rem' }}>
                        <motion.h2
                            style={{
                                fontSize: '6.5vw',
                                lineHeight: 1.15,
                                fontWeight: 800,
                                letterSpacing: '-0.06em',
                                maxWidth: '100%',
                                margin: 0,
                                color: '#1A1A1A',
                                fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
                                transformStyle: 'preserve-3d',
                                zIndex: 10,
                                transform: `translateZ(${zTranslate}px)`,
                                scale: scale,
                                opacity: opacity,
                                textAlign: 'left', // Lines are left-aligned to each other
                                display: 'inline-block' // Makes the block width fit content
                            }}
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1], // Smooth organic entrance
                                delay: 0.2
                            }}
                        >
                            I make complex products <br />
                            feel simple — <br />
                            and work reliably
                        </motion.h2>
                    </div>
                </div>

                {/* Location - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '4rem',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        color: '#1A1A1A',
                        fontFamily: '"JetBrains Mono", monospace',
                        opacity: 0.6
                    }}
                >
                    Seattle / Vancouver
                </motion.div>

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
                        top: '6rem', // Below the nav bar
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
