import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Los_Angeles'
    });

    return (
        <footer style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FBFBFB',
            // Subtle green bleed from top
            backgroundImage: 'linear-gradient(to bottom, rgba(0, 255, 65, 0.02) 0%, transparent 40%)',
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12vh 5vw 4vh 5vw',
            fontFamily: '"Inter", -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Texture Overlay (Optional but adds to the 'paper' feel) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.03,
                pointerEvents: 'none',
                background: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
            }} />

            {/* Primary Anchor: Massive Center Headline */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontSize: 'clamp(2.5rem, 6.5vw, 6rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.05em', // Tight kerning
                        textAlign: 'center',
                        margin: 0,
                        maxWidth: '1200px',
                        textTransform: 'uppercase',
                        color: '#1A1A1A'
                    }}
                >
                    LET'S BUILD SOMETHING <br />
                    SIMPLE YET COMPLEX.
                </motion.h2>
            </div>

            {/* Bottom Metadata Layer */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                position: 'relative',
                zIndex: 2
            }}>

                {/* BOTTOM-LEFT: MSTI Signature (Technical Monospace) */}
                <div style={{
                    fontSize: '10px',
                    fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    opacity: 0.4,
                    textAlign: 'left'
                }}>
                    CLASS OF 2026 // UNIVERSITY OF WASHINGTON // <br />
                    M.S. TECHNOLOGY INNOVATION
                </div>

                {/* BOTTOM-RIGHT: Global Pulse */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        fontSize: '10px',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                        textAlign: 'right'
                    }}>
                        SEATTLE, WA / 47.6062° N / {formattedTime}
                    </div>

                    {/* The Connection: Pulsing Neon Dot */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '4px',
                                height: '4px',
                                backgroundColor: '#00FF41',
                                borderRadius: '50%',
                                boxShadow: '0 0 12px #00FF41',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Centered Email Link (Subtle) */}
            <div style={{
                position: 'absolute',
                bottom: '4vh',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1
            }}>
                <a href="mailto:HI@AURIAZHANG.COM" style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: '#000',
                    textDecoration: 'none',
                    opacity: 0.2,
                    textTransform: 'uppercase',
                    transition: 'opacity 0.3s ease'
                }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.2'}
                >
                    HI@AURIAZHANG.COM
                </a>
            </div>
        </footer>
    );
};

export default Footer;
