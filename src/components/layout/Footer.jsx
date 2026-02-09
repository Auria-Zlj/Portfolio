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
        hour12: true,
        timeZone: 'America/Los_Angeles' // Seattle time as requested
    });

    return (
        <footer style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FBFBFB', // Grainy off-white paper texture
            color: '#1A1A1A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '200px 5vw 8vh 5vw', // Massive negative space at top
            fontFamily: '"Inter", "PP Neue Montreal", sans-serif',
            position: 'relative',
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 1fr) 2fr minmax(200px, 1fr)',
                alignItems: 'baseline', // Baseline aligned at the bottom
                width: '100%',
                gap: '4rem',
                borderTop: '1px solid rgba(0,0,0,0.05)', // Extremely subtle hint of a line
                paddingTop: '2rem'
            }}>

                {/* LEFT COLUMN: Academic Context */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    textAlign: 'left'
                }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 300,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        opacity: 0.5
                    }}>
                        2026 NEW GRAD / <br />
                        UNIVERSITY OF WASHINGTON
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        M.S. IN TECHNOLOGY INNOVATION (MSTI)
                    </div>
                </div>

                {/* CENTER COLUMN: Action (Visual Anchor) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '2.5rem'
                }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.04em',
                            margin: 0,
                            maxWidth: '550px',
                            textTransform: 'uppercase'
                        }}
                    >
                        Let’s build something <br />
                        simple yet complex.
                    </motion.h2>

                    <a href="mailto:HI@AURIAZHANG.COM" style={{
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        borderBottom: '0.5px solid rgba(26, 26, 26, 0.3)',
                        paddingBottom: '4px',
                        transition: 'opacity 0.2s ease',
                        textTransform: 'uppercase'
                    }}>
                        HI@AURIAZHANG.COM
                    </a>
                </div>

                {/* RIGHT COLUMN: Status */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.6rem',
                    textAlign: 'right'
                }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        opacity: 0.7
                    }}>
                        SEATTLE, WA / {formattedTime}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#00FF41', // Vibrant neon green
                            borderRadius: '50%',
                            boxShadow: '0 0 10px #00FF41',
                            display: 'inline-block'
                        }}></span>
                        <span>AVAILABLE FOR NEW OPPORTUNITIES</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
