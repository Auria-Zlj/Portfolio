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
        timeZone: 'Asia/Shanghai'
    });

    return (
        <footer style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F9F9F9', // Grainy off-white 
            color: '#1A1A1A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '8vh 5vw',
            fontFamily: '"Inter", "PP Neue Montreal", sans-serif',
            position: 'relative',
        }}>
            {/* Massive White Space Above is handled by the container/Gallery section */}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 1.2fr',
                alignItems: 'flex-end',
                width: '100%',
                gap: '2rem'
            }}>

                {/* LEFT COLUMN: Metadata */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '12px',
                    fontWeight: 300,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    opacity: 0.6
                }}>
                    <span>AURIA ZHANG © 2026</span>
                    <span>BUILT WITH REACT / VITE</span>
                </div>

                {/* CENTER COLUMN: Visual Anchor */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '2rem'
                }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                            fontWeight: 500,
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                            margin: 0,
                            maxWidth: '500px'
                        }}
                    >
                        Let’s build something <br /> simple yet complex.
                    </motion.h2>

                    <a href="mailto:HI@AURIAZHANG.COM" style={{
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        borderBottom: '0.5px solid rgba(26, 26, 26, 0.4)',
                        paddingBottom: '4px',
                        transition: 'opacity 0.2s ease'
                    }}>
                        HI@AURIAZHANG.COM
                    </a>
                </div>

                {/* RIGHT COLUMN: Status & Socials */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2rem'
                }}>
                    {/* Status & Time */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '0.5rem',
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        textAlign: 'right'
                    }}>
                        <div style={{ opacity: 0.6 }}>SHANGHAI / {formattedTime}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: '#00FF41',
                                borderRadius: '50%',
                                boxShadow: '0 0 8px #00FF41',
                                display: 'inline-block'
                            }}></span>
                            <span style={{ textTransform: 'uppercase' }}>OPEN FOR COLLABORATIONS</span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        opacity: 0.6
                    }}>
                        <a href="https://linkedin.com" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>LINKEDIN</a>
                        <span>/</span>
                        <a href="https://github.com" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>GITHUB</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
