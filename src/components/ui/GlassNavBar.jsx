import React from 'react';
import LiquidGlassFilter from '../effects/LiquidGlassFilter';
import { motion } from 'framer-motion';

const GlassNavBar = () => {
    // New Link Structure
    const links = [
        { label: 'WORK', href: '#selected-works' },
        { label: 'ABOUT', href: '#about' },
        { label: 'RESUME', href: '/resume.pdf' },
    ];

    const scrollToHome = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: '1.5rem 4rem', // Spacious padding

                // Heavy Blur / Clear Glass Effect
                background: 'rgba(255, 255, 255, 0.02)', // Very clear
                backdropFilter: 'blur(20px)', // Heavy blur
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)', // Subtle edge

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
                    fontSize: '0.9rem', // Slightly smaller for technical feel
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: '#1A1A1A',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                }}
            >
                AURIA ZHANG
            </motion.a>

            {/* Right - Links with Hover Line */}
            <div style={{ display: 'flex', gap: '3rem' }}>
                {links.map((link) => (
                    <NavLink key={link.label} href={link.href} label={link.label} />
                ))}
            </div>
        </motion.nav>
    );
};

// Sub-component for Link with Hover Line
const NavLink = ({ href, label }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = (e) => {
        if (href.startsWith('#')) {
            e.preventDefault();
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                fontSize: '0.85rem', // Slightly smaller
                fontWeight: 500,
                color: '#1A1A1A', // Deep Charcoal
                textDecoration: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
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
                    background: '#1A1A1A', // Deep Charcoal
                    originX: 0
                }}
            />
        </motion.a>
    );
};

export default GlassNavBar;
