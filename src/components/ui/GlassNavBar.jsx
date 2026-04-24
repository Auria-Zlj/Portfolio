import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
const GlassNavBar = () => {
    const [surface, setSurface] = useState('dark');

    useLayoutEffect(() => {
        const el = document.getElementById('selected-works');
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        // Only switch to light if selected-works has scrolled past the nav (top < 72)
        if (top < 72) setSurface('light');
    }, []);

    useEffect(() => {
        const onSurface = (e) => {
            setSurface(e.detail?.surface ?? 'dark');
        };
        window.addEventListener('portfolio:nav-surface', onSurface);
        return () => window.removeEventListener('portfolio:nav-surface', onSurface);
    }, []);

    // Always white text — hero has photo bg, dark sections also need white
    const nameColor = '#F5F5F5';
    const linkColor = 'rgba(255,255,255,0.88)';
    const linkLineColor = 'rgba(255,255,255,0.85)';
    const navBg = 'rgba(255,255,255,0.04)';
    const navBorder = '1px solid transparent';

    // New Link Structure
    const links = [
        { label: 'WORK', href: '#selected-works' },
        { label: 'LAB', href: '#lab' },
        { label: 'ABOUT', href: '#about' },
        { label: 'RESUME', href: '/Linjun_Portfolio.pdf', newTab: true },
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

                background: navBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
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
                    fontFamily: '"Outfit", system-ui, sans-serif',
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
                fontFamily: '"Outfit", system-ui, sans-serif',
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
