import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/** Matches description line length so thumbnails align with copy above */
const COPY_MAX_WIDTH = '40ch';

// Each project gets a subtle colour tint baked into the glass.
// The rest is transparent so the hero image bleeds through the blur.
const PROJECT_THEMES = {
    3: {
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(152,210,172,0.20) 100%)',
        // Frosted light chips + neutral ink (readable, not heavy)
        tagBg: 'rgba(20, 48, 32, 0.14)',
        tagText: '#142018',
        metaColor: '#142018',
        titleColor: '#0E1A10',
        bodyColor: 'rgba(18, 32, 22, 0.88)',
        divider: 'rgba(26, 80, 53, 0.18)',
    },
    1: {
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(148,178,235,0.20) 100%)',
        tagBg: 'rgba(18, 36, 72, 0.14)',
        tagText: '#0F1728',
        metaColor: '#0F1728',
        titleColor: '#0B1220',
        bodyColor: 'rgba(16, 26, 44, 0.88)',
        divider: 'rgba(26, 58, 107, 0.18)',
    },
    2: {
        panelBg: 'linear-gradient(158deg, rgba(255,255,255,0.26) 0%, rgba(235,205,148,0.20) 100%)',
        tagBg: 'rgba(72, 48, 18, 0.14)',
        tagText: '#1C1408',
        metaColor: '#1C1408',
        titleColor: '#1E1006',
        bodyColor: 'rgba(40, 28, 12, 0.88)',
        divider: 'rgba(90, 62, 24, 0.18)',
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
                    // Wider glass than the old ~46%; copy keeps right breathing room via padding below
                    width: isMobile ? '100%' : '56%',
                    height: '100%',
                    background: theme.panelBg,
                    backdropFilter: 'blur(38px) saturate(1.7) brightness(1.05)',
                    WebkitBackdropFilter: 'blur(38px) saturate(1.7) brightness(1.05)',
                    border: 'none',
                    boxShadow: 'none',
                    // Gradient mask fades the glass panel (blur + bg) softly into the image
                    WebkitMaskImage: 'linear-gradient(to right, black 76%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, black 76%, transparent 100%)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    // Left 4rem matches nav; wider right padding so copy doesn’t feel edge-to-edge
                    padding: isMobile ? '100px 7% 40px 4rem' : '140px clamp(2.75rem, 6vw, 5rem) 52px 4rem',
                    boxSizing: 'border-box',
                }}
            >
                {/* Main content — fills space above thumbnails */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, width: '100%' }}>

                    {/* Eyebrow */}
                    <motion.span {...fadeUp(0)} style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: isMobile ? '0.72rem' : '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: theme.metaColor,
                        marginBottom: '1.4rem',
                        display: 'block',
                    }}>
                        {eyebrow}
                    </motion.span>

                    {/* Massive title */}
                    <motion.h2 {...fadeUp(0.07)} style={{
                        fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
                        fontSize: isMobile
                            ? 'clamp(2.75rem, 11vw, 4rem)'
                            : 'clamp(3.15rem, 4.8vw, 5.25rem)',
                        fontWeight: 650,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.0,
                        color: theme.titleColor,
                        margin: '0 0 1.8rem 0',
                        textShadow: '0 1px 2px rgba(255,255,255,0.35)',
                    }}>
                        {title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p {...fadeUp(0.13)} style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: isMobile ? '1rem' : '1.125rem',
                        lineHeight: 1.76,
                        color: theme.bodyColor,
                        margin: '0 0 1.5rem 0',
                        maxWidth: COPY_MAX_WIDTH,
                        fontWeight: 400,
                        whiteSpace: 'pre-line',
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
                                padding: '0.4rem 1rem',
                                borderRadius: '999px',
                                border: 'none',
                                background: theme.tagBg,
                                color: theme.tagText,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: isMobile ? '0.78rem' : '0.84rem',
                                fontWeight: 600,
                                letterSpacing: '0.01em',
                            }}>
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* Sponsor */}
                    {sponsor && (
                        <motion.p {...fadeUp(0.22)} style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: isMobile ? '0.78rem' : '0.84rem',
                            fontWeight: 600,
                            letterSpacing: '0.03em',
                            lineHeight: 1.55,
                            textTransform: 'none',
                            color: theme.metaColor,
                            marginBottom: '2.2rem',
                            maxWidth: '100%',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
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
                                padding: '0.95rem 2.25rem',
                                borderRadius: '999px',
                                background: btnHovered ? '#111111' : '#1A1A1A',
                                border: 'none',
                                color: '#F5F5F5',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: isMobile ? '0.92rem' : '1rem',
                                fontWeight: 600,
                                letterSpacing: '0.02em',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.22s ease, transform 0.22s ease',
                            }}
                        >
                            View Project
                            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>→</span>
                        </button>
                    </motion.div>
                </div>

                {/* ── Bottom thumbnails ── */}
                {thumbnails.length > 0 && (
                    <motion.div
                        {...fadeUp(0.3)}
                        style={{
                            width: '100%',
                            maxWidth: isMobile ? '100%' : COPY_MAX_WIDTH,
                            minWidth: 0,
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: theme.divider,
                            margin: '2rem 0 1.4rem',
                        }} />
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            {thumbnails.map((thumb, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{
                                        height: isMobile ? '64px' : '88px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        background: 'rgba(0,0,0,0.12)',
                                        border: 'none',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
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
                                            fontSize: isMobile ? '0.72rem' : '0.78rem',
                                            fontWeight: 500,
                                            color: theme.bodyColor,
                                            opacity: 0.92,
                                            letterSpacing: '0.01em',
                                            lineHeight: 1.35,
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
