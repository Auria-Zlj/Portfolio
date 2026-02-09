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
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#FFFFFF', // Ultra-clean white background
            color: '#1A1A1A', // Sharp black typography
            overflow: 'hidden',
            display: 'flex',
            fontFamily: '"PP Neue Montreal", "Inter", sans-serif'
        }}>
            {/* Left Section: Massive Vertical Typography */}
            <div style={{
                position: 'relative',
                height: '100%',
                width: '30%',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <h2 style={{
                    fontSize: '32vh', // Massive size
                    fontWeight: 900,
                    lineHeight: 0.8,
                    letterSpacing: '-0.05em',
                    margin: 0,
                    textTransform: 'uppercase',
                    writingMode: 'vertical-lr',
                    transform: 'rotate(180deg)',
                    whiteSpace: 'nowrap',
                    marginLeft: '-5vh', // Cropped slightly for tension
                    opacity: 1,
                    userSelect: 'none'
                }}>
                    LET'S CONNECT
                </h2>
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                position: 'relative',
                padding: '8vh 8vw 8vh 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {/* Center-Right Headline */}
                <div style={{ marginTop: '15vh', maxWidth: '600px' }}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                            lineHeight: 1.1,
                            fontWeight: 500,
                            letterSpacing: '-0.03em',
                            margin: 0
                        }}
                    >
                        Say Hello — <br />
                        Let’s build something <br />
                        <span style={{ fontStyle: 'italic', fontWeight: 400 }}>simple</span> yet <br />
                        complex.
                    </motion.h3>
                </div>

                {/* Bottom Meta-data and Socials */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    alignItems: 'flex-end',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    gap: '2rem'
                }}>
                    {/* Meta 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ opacity: 0.4 }}>Location</span>
                        <span>BASED IN SHANGHAI</span>
                    </div>

                    {/* Meta 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ opacity: 0.4 }}>Current Time</span>
                        <span>{formattedTime} SHI</span>
                    </div>

                    {/* Meta 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ opacity: 0.4 }}>Status</span>
                        <span>AVAILABLE FOR PROJECTS</span>
                    </div>
                </div>

                {/* Far Right Social Links */}
                <div style={{
                    position: 'absolute',
                    top: '8vh',
                    right: '8vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    textAlign: 'right'
                }}>
                    <SocialLink href="https://linkedin.com" label="LINKEDIN" />
                    <SocialLink href="https://read.cv" label="READ.CV" />
                    <SocialLink href="https://github.com" label="GITHUB" />
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            color: '#1A1A1A',
            textDecoration: 'none',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            fontFamily: '"JetBrains Mono", monospace',
            display: 'inline-block',
            paddingBottom: '2px',
            borderBottom: '1px solid transparent'
        }}
        whileHover={{ borderBottom: '1px solid #1A1A1A' }}
    >
        {label}
    </motion.a>
);

export default Footer;
