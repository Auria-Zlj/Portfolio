import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import resumePdf from '../../assets/images/Auria Zhang_Resume_V2.pdf';

const GlassNavBar = () => {
    const [surface, setSurface] = useState('light');

    useLayoutEffect(() => {
        const el = document.getElementById('selected-works');
        if (!el) return;
        const bottom = el.getBoundingClientRect().bottom;
        setSurface(bottom < 72 ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        const onSurface = (e) => {
            setSurface(e.detail?.surface ?? 'light');
        };
        window.addEventListener('portfolio:nav-surface', onSurface);
        return () => window.removeEventListener('portfolio:nav-surface', onSurface);
    }, []);

    const onDark = surface === 'dark';
    const nameColor = onDark ? '#F5F5F5' : '#2A2A2A';
    const linkColor = onDark ? 'rgba(255,255,255,0.88)' : 'rgba(0, 0, 0, 0.6)';
    const linkLineColor = onDark ? 'rgba(255,255,255,0.85)' : 'rgba(0, 0, 0, 0.6)';
    const navBg = onDark ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.015)';
    const navBorder = onDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255, 255, 255, 0.04)';

    // New Link Structure
    const links = [
        { label: 'WORK', href: '#selected-works' },
        { label: 'LAB', href: '#lab' },
        { label: 'ABOUT', href: '#about' },
        { label: 'RESUME', href: resumePdf, newTab: true },
    ];

    const scrollToHome = (e) => {
        e.preventDefault();
        window.dispatchEvent(new Event('portfolio:reset-hero-shader'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navNode = (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                // Keep nav above project cards but below modal layers.
                zIndex: 950,
                padding: '1.5rem 4rem', // Spacious padding

                // Heavy Blur — bg/border follow scroll (light vs dark sections)
                background: navBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: navBorder,
                transition: 'background 0.28s ease, border-color 0.28s ease',

                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {/* Left - Name */}
            <motion.a
                href="#home"
                onClick={scrollToHome}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    color: nameColor,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'color 0.28s ease',
                }}
            >
                AURIA ZHANG
            </motion.a>

            {/* Right - Links with Hover Line */}
            <div style={{ display: 'flex', gap: '3rem' }}>
                {links.map((link) => (
                    <NavLink
                        key={link.label}
                        href={link.href}
                        label={link.label}
                        newTab={link.newTab}
                        linkColor={linkColor}
                        linkLineColor={linkLineColor}
                    />
                ))}
            </div>
        </motion.nav>
    );

    if (typeof document === 'undefined') {
        return navNode;
    }

    return createPortal(navNode, document.body);
};

// Sub-component for Link with Hover Line
const NavLink = ({ href, label, newTab = false, linkColor, linkLineColor }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = (e) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            if (href === '#home') {
                window.dispatchEvent(new Event('portfolio:reset-hero-shader'));
            }
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <motion.a
            href={href}
            onClick={handleClick}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                fontFamily: '"Inter", sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: linkColor,
                textDecoration: 'none',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'color 0.28s ease',
            }}
        >
            {label}

            {/* Horizontal Thin Line (1px) */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                    scaleX: isHovered ? 1 : 0,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: linkLineColor,
                    originX: 0,
                    transition: 'background 0.28s ease',
                }}
            />
        </motion.a>
    );
};

export default GlassNavBar;
