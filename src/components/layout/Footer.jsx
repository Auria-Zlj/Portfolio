import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const [isEmailHovered, setIsEmailHovered] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const linkStyle = {
        color: '#FFFFFF',
        textDecoration: 'none',
        opacity: 0.45, // Lighter weight/low contrast for items
        transition: 'opacity 0.2s ease',
        fontSize: '14px',
        fontWeight: 300, // Light weight
        fontFamily: '"Inter", sans-serif'
    };

    const colHeaderStyle = {
        fontSize: '11px',
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '2rem',
        opacity: 0.3,
        display: 'block'
    };

    const handleMouseEnter = (e) => e.currentTarget.style.opacity = '1';
    const handleMouseLeave = (e) => e.currentTarget.style.opacity = '0.45';

    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#0A0A0A',
            color: '#FFFFFF',
            padding: '15vh 6vw 6vh 6vw', // Generous breathing room
            fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '12vh' // Plenty of negative space
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(400px, 1.6fr) 1fr',
                gap: '8rem',
                alignItems: 'flex-start'
            }}>
                {/* Left Side: Editorial Headline & Identity */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* CONFIDENT MINIMAL HEADLINE */}
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                            fontWeight: 500,
                            lineHeight: 1.05,
                            letterSpacing: '-0.03em',
                            margin: '0 0 32px 0' // Spacing headline to identity
                        }}
                    >
                        Let’s connect.
                    </motion.h2>

                    {/* IDENTITY & CONTEXTUAL INFO */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '40px' // Spacing identity to email CTA
                    }}>
                        <p style={{
                            fontSize: '17px',
                            fontWeight: 400,
                            opacity: 0.75, // Increased contrast (+15%)
                            margin: 0,
                            lineHeight: 1.4,
                            letterSpacing: '0.01em',
                            fontFamily: '"PP Neue Montreal", "Inter", sans-serif'
                        }}>
                            Product Designer · University of Washington · Class of 2026
                        </p>
                        <p style={{
                            fontSize: '17px',
                            fontWeight: 400,
                            opacity: 0.75, // Increased contrast
                            margin: 0,
                            lineHeight: 1.4,
                            letterSpacing: '0.01em',
                            fontFamily: '"PP Neue Montreal", "Inter", sans-serif'
                        }}>
                            Open to full-time UX / Product Designer roles
                        </p>
                    </div>

                    {/* EDITORIAL EMAIL CTA */}
                    <a
                        href="mailto:zlinjun1@gmail.com"
                        onMouseEnter={() => setIsEmailHovered(true)}
                        onMouseLeave={() => setIsEmailHovered(false)}
                        style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', // Visually larger than supporting text
                            color: '#FFFFFF',
                            textDecoration: isEmailHovered ? 'underline' : 'none', // Underline only on hover
                            textUnderlineOffset: '12px',
                            textDecorationThickness: '1px',
                            fontWeight: 400,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            width: 'fit-content',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        zlinjun1@gmail.com
                        <motion.span
                            animate={{ x: isEmailHovered ? 5 : 0 }}
                            style={{ fontSize: '0.7em', opacity: 0.4 }}
                        >
                            →
                        </motion.span>
                    </a>
                </div>

                {/* Right Side: Structured Columns */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4rem'
                }}>
                    {/* Location */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={colHeaderStyle}>Location</span>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 300,
                            opacity: 0.7,
                            fontFamily: '"JetBrains Mono", monospace'
                        }}>Seattle / Vancouver</span>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span style={colHeaderStyle}>Links</span>
                        <a href="https://www.linkedin.com/in/linjun-zhang/" target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>LinkedIn</a>
                        <a href="/resume.pdf" target="_blank" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Resume</a>
                    </div>

                    {/* Navigation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '5vh'
            }}>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    opacity: 0.25,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: '"JetBrains Mono", monospace'
                }}>
                    © 2026 AURIA ZHANG
                </span>

                {/* Back to Top - Quiet & Minimal */}
                <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <span style={{ fontSize: '15px', transform: 'translateY(-1px)' }}>↑</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
