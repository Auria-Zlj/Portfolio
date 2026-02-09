import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const linkStyle = {
        color: '#FFFFFF',
        textDecoration: 'none',
        opacity: 0.6,
        transition: 'opacity 0.2s ease',
        fontSize: '14px',
        fontWeight: 400
    };

    const handleMouseEnter = (e) => e.target.style.opacity = '1';
    const handleMouseLeave = (e) => e.target.style.opacity = '0.6';

    const colHeaderStyle = {
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
        opacity: 0.3
    };

    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#0A0A0A', // Near-black
            color: '#FFFFFF',
            padding: '12vh 6vw 6vh 6vw',
            fontFamily: '"Inter", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '8vh'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr',
                gap: '4rem',
                alignItems: 'flex-start'
            }}>
                {/* Left Side: Editorial Headline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                fontWeight: 500,
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                margin: 0
                            }}
                        >
                            I’d love to hear from you.
                        </motion.h2>
                        <p style={{
                            fontSize: '18px',
                            fontWeight: 400,
                            opacity: 0.6,
                            margin: 0,
                            maxWidth: '430px', // Slightly wider for the new text
                            lineHeight: 1.5,
                            letterSpacing: '0.01em'
                        }}>
                            2026 Product Design graduate from the University of Washington, open to full-time UX / Product Designer roles.
                        </p>
                    </div>

                    <a
                        href="mailto:hello@auria.design"
                        style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: 400,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'opacity 0.3s ease',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            width: 'fit-content',
                            paddingBottom: '0.5rem'
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)'}
                        onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    >
                        hello@auria.design
                        <span style={{ fontSize: '0.8em', opacity: 0.5 }}>→</span>
                    </a>
                </div>

                {/* Right Side: Structured Columns */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem'
                }}>
                    {/* Location */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={colHeaderStyle}>Location</span>
                        <span style={{ ...linkStyle, opacity: 0.8 }}>Seattle / Vancouver</span>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <span style={colHeaderStyle}>Links</span>
                        <a href="mailto:hello@auria.design" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Email</a>
                        <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>LinkedIn</a>
                        <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Resume</a>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <span style={colHeaderStyle}>Navigation</span>
                        <a href="#home" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Home</a>
                        <a href="#work" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Work</a>
                        <a href="#about" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</a>
                    </div>
                </div>
            </div>

            {/* Bottom Line */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '4vh'
            }}>
                <span style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.05em' }}>
                    © 2026 AURIA ZHANG
                </span>

                {/* Back to Top Component */}
                <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)', // More subtle border
                        borderRadius: '50%',
                        width: '36px', // Slightly smaller
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.6)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <span style={{ fontSize: '14px', transform: 'translateY(-1px)' }}>↑</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
