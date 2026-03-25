import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Each project gets a subtle colour tint baked into the glass.
// The rest is transparent so the hero image bleeds through the blur.
const PROJECT_THEMES = {
    3: {
        // Salmon Says — forest green tint
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(152,210,172,0.20) 100%)',
        accent: '#1A5035',
        tagBg: 'rgba(26,80,53,0.10)',
        tagBorder: 'rgba(26,80,53,0.28)',
        tagText: '#1A5035',
        eyebrowColor: 'rgba(26,80,53,0.72)',
        titleColor: '#0E1A10',
        bodyColor: 'rgba(18,35,22,0.76)',
        divider: 'rgba(26,80,53,0.15)',
    },
    1: {
        // X-Heal — clinical blue tint
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(148,178,235,0.20) 100%)',
        accent: '#1A3A6B',
        tagBg: 'rgba(26,58,107,0.10)',
        tagBorder: 'rgba(26,58,107,0.28)',
        tagText: '#1A3A6B',
        eyebrowColor: 'rgba(26,58,107,0.72)',
        titleColor: '#0B1220',
        bodyColor: 'rgba(16,26,48,0.76)',
        divider: 'rgba(26,58,107,0.15)',
    },
    2: {
        // Prelo — warm amber tint
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(235,205,148,0.20) 100%)',
        accent: '#6B4A1E',
        tagBg: 'rgba(107,74,30,0.10)',
        tagBorder: 'rgba(107,74,30,0.28)',
        tagText: '#6B4A1E',
        eyebrowColor: 'rgba(107,74,30,0.72)',
        titleColor: '#1E1006',
        bodyColor: 'rgba(45,30,12,0.76)',
        divider: 'rgba(107,74,30,0.15)',
    },
};

const ProjectCard = ({
    id,
    title,
    eyebrow,
    description,
    tags = [],
    sponsor,
    image,
    thumbnails = [],
    thumbnailLabels = [],
    onOpenProject,
}) => {
    const theme = PROJECT_THEMES[id] ?? PROJECT_THEMES[3];
    const [isMobile, setIsMobile] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleOpen = () => onOpenProject?.(id);

    // Stagger delays for content items inside the panel
    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <div
            ref={cardRef}
            style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
        >
            {/* ── Full-bleed background image ── */}
            <motion.img
                src={image}
                alt={title}
                loading="eager"
                decoding="async"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    zIndex: 0,
                    pointerEvents: 'none',
                    willChange: 'transform',
                }}
            />

            {/* ── Vignette to separate image from glass edge ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.04) 48%, rgba(0,0,0,0) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
            }} />

            {/* ── Glass panel ── */}
            <motion.div
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: isMobile ? '100%' : '46%',
                    height: '100%',
                    background: theme.panelBg,
                    backdropFilter: 'blur(38px) saturate(1.7) brightness(1.05)',
                    WebkitBackdropFilter: 'blur(38px) saturate(1.7) brightness(1.05)',
                    // Only left/top/bottom border — no hard right edge
                    borderTop: '1px solid rgba(255,255,255,0.52)',
                    borderLeft: '1px solid rgba(255,255,255,0.52)',
                    borderBottom: '1px solid rgba(255,255,255,0.32)',
                    borderRight: 'none',
                    // Inner top highlight; no right-side shadow that creates a line
                    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.78)',
                    // Gradient mask fades the glass panel (blur + bg) softly into the image
                    WebkitMaskImage: 'linear-gradient(to right, black 78%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, black 78%, transparent 100%)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: isMobile ? '80px 7% 40px' : '110px 9% 52px',
                    boxSizing: 'border-box',
                }}
            >
                {/* Main content — fills space above thumbnails */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                    {/* Eyebrow */}
                    <motion.span {...fadeUp(0)} style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.68rem',
                        fontWeight: 500,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: theme.eyebrowColor,
                        marginBottom: '1.4rem',
                        display: 'block',
                    }}>
                        {eyebrow}
                    </motion.span>

                    {/* Massive title */}
                    <motion.h2 {...fadeUp(0.07)} style={{
                        fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
                        fontSize: isMobile
                            ? 'clamp(2.6rem, 11vw, 3.8rem)'
                            : 'clamp(3rem, 4.6vw, 5rem)',
                        fontWeight: 650,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.0,
                        color: theme.titleColor,
                        margin: '0 0 1.8rem 0',
                        // Slight white halo so the text pops off any dark bg bleed
                        textShadow: '0 1px 3px rgba(255,255,255,0.45)',
                    }}>
                        {title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p {...fadeUp(0.13)} style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: isMobile ? '0.93rem' : '1.03rem',
                        lineHeight: 1.76,
                        color: theme.bodyColor,
                        margin: '0 0 1.5rem 0',
                        maxWidth: '40ch',
                        fontWeight: 400,
                    }}>
                        {description}
                    </motion.p>

                    {/* Tags */}
                    <motion.div {...fadeUp(0.18)} style={{
                        display: 'flex',
                        gap: '0.42rem',
                        flexWrap: 'wrap',
                        marginBottom: sponsor ? '1rem' : '2.2rem',
                    }}>
                        {tags.map((tag) => (
                            <span key={tag} style={{
                                padding: '0.28rem 0.80rem',
                                borderRadius: '999px',
                                border: `1px solid ${theme.tagBorder}`,
                                background: theme.tagBg,
                                color: theme.tagText,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                letterSpacing: '0.02em',
                            }}>
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* Sponsor */}
                    {sponsor && (
                        <motion.p {...fadeUp(0.22)} style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.67rem',
                            fontWeight: 600,
                            letterSpacing: '0.09em',
                            textTransform: 'uppercase',
                            color: theme.eyebrowColor,
                            marginBottom: '2.2rem',
                        }}>
                            {sponsor}
                        </motion.p>
                    )}

                    {/* Pill CTA */}
                    <motion.div {...fadeUp(0.26)}>
                        <button
                            onClick={handleOpen}
                            onMouseEnter={() => setBtnHovered(true)}
                            onMouseLeave={() => setBtnHovered(false)}
                            style={{
                                padding: '0.80rem 2.0rem',
                                borderRadius: '999px',
                                background: btnHovered ? 'rgba(20,20,20,0.88)' : 'rgba(255,255,255,0.82)',
                                // Frosted button with its own glass look
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.65)',
                                color: btnHovered ? '#FFFFFF' : '#1A1A1A',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.86rem',
                                fontWeight: 600,
                                letterSpacing: '0.02em',
                                cursor: 'pointer',
                                boxShadow: '0 2px 18px rgba(0,0,0,0.10)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.22s ease, color 0.22s ease',
                            }}
                        >
                            View Project
                            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>→</span>
                        </button>
                    </motion.div>
                </div>

                {/* ── Bottom thumbnails ── */}
                {thumbnails.length > 0 && (
                    <motion.div {...fadeUp(0.3)}>
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: theme.divider,
                            margin: '2rem 0 1.4rem',
                        }} />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {thumbnails.map((thumb, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{
                                        height: isMobile ? '58px' : '76px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.18)',
                                        border: '1px solid rgba(255,255,255,0.50)',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
                                    }}>
                                        <img
                                            src={thumb}
                                            alt={thumbnailLabels[i] || ''}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    {thumbnailLabels[i] && (
                                        <span style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: '0.65rem',
                                            fontWeight: 500,
                                            color: theme.bodyColor,
                                            opacity: 0.65,
                                            letterSpacing: '0.01em',
                                            lineHeight: 1.3,
                                            fontStyle: 'italic',
                                        }}>
                                            {thumbnailLabels[i]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ProjectCard;
