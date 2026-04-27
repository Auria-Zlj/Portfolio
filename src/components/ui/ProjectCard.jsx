import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView } from 'framer-motion';

/** Matches description line length so thumbnails align with copy above */
const COPY_MAX_WIDTH = '42ch';

/** Feather: solid zone a bit wider so blur + scrim hold longer before fading into hero. */
const GLASS_MASK =
    'linear-gradient(to right, #000 0%, #000 36%, rgba(0,0,0,0.94) 44%, rgba(0,0,0,0.78) 54%, rgba(0,0,0,0.52) 64%, rgba(0,0,0,0.28) 74%, rgba(0,0,0,0.12) 84%, rgba(0,0,0,0.04) 92%, rgba(0,0,0,0.01) 97%, transparent 100%)';

/** Lighter than the old heavy glass — frosts enough for type, stays fairly see-through. */
const GLASS_BLUR_SOFT = 'blur(16px) saturate(1.28) brightness(1.04)';

/** Wash: dark horizontal scrim (legibility) + frost + diagonal — scrim pulls wider under copy. */
const GLASS_PANEL_WASH =
    'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.28) 22%, rgba(0,0,0,0.16) 42%, rgba(0,0,0,0.07) 62%, rgba(0,0,0,0.02) 82%, transparent 96%), linear-gradient(to right, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.015) 58%, rgba(255,255,255,0.004) 78%, rgba(255,255,255,0) 94%), linear-gradient(168deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.08) 26%, rgba(0,0,0,0.04) 48%, rgba(0,0,0,0.018) 66%, transparent 84%)';

/** Dark halo so white type stays legible on bright hero frames */
const TEXT_SHADOW_BODY = '0 1px 2px rgba(0,0,0,0.65), 0 2px 14px rgba(0,0,0,0.35)';
const TEXT_SHADOW_TITLE = '0 2px 4px rgba(0,0,0,0.65), 0 4px 28px rgba(0,0,0,0.4)';

// Typography / chips / divider. Glass “frost” is shared (GLASS_PANEL_WASH), not per-project tint.
const PROJECT_THEMES = {
    3: {
        tagBg: 'rgba(0, 0, 0, 0.32)',
        tagText: '#FFFFFF',
        metaColor: 'rgba(255, 255, 255, 0.92)',
        titleColor: '#FFFFFF',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        divider: 'rgba(255, 255, 255, 0.35)',
    },
    1: {
        tagBg: 'rgba(0, 0, 0, 0.32)',
        tagText: '#FFFFFF',
        metaColor: 'rgba(255, 255, 255, 0.92)',
        titleColor: '#FFFFFF',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        divider: 'rgba(255, 255, 255, 0.35)',
    },
    2: {
        tagBg: 'rgba(0, 0, 0, 0.32)',
        tagText: '#FFFFFF',
        metaColor: 'rgba(255, 255, 255, 0.92)',
        titleColor: '#FFFFFF',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        divider: 'rgba(255, 255, 255, 0.35)',
    },
};

/**
 * Fresh full embed each time: strip loop/playlist from preview URL, force start=0 so
 * opening the modal always plays from the beginning (not mid-preview).
 */
function youtubeUrlForLightbox(embedUrl) {
    try {
        const u = new URL(embedUrl);
        const parts = u.pathname.split('/').filter(Boolean);
        const videoId = parts[parts.length - 1] === 'embed' ? null : parts[parts.length - 1];
        if (!videoId) {
            const v = u.searchParams.get('v');
            if (!v) return embedUrl;
            const out = new URL(`https://www.youtube.com/embed/${v}`);
            out.searchParams.set('autoplay', '1');
            out.searchParams.set('mute', '0');
            out.searchParams.set('controls', '1');
            out.searchParams.set('start', '0');
            out.searchParams.set('modestbranding', '1');
            out.searchParams.set('rel', '0');
            return out.toString();
        }
        const out = new URL(`https://www.youtube.com/embed/${videoId}`);
        out.searchParams.set('autoplay', '1');
        out.searchParams.set('mute', '0');
        out.searchParams.set('controls', '1');
        out.searchParams.set('start', '0');
        out.searchParams.set('modestbranding', '1');
        out.searchParams.set('rel', '0');
        return out.toString();
    } catch {
        return embedUrl
            .replace(/mute=1/g, 'mute=0')
            .replace(/controls=0/g, 'controls=1')
            .replace(/[?&]loop=\d+/g, '')
            .replace(/[?&]playlist=[^&]*/g, '');
    }
}

function isYoutubeThumbnailVideo(src) {
    return typeof src === 'string' && (src.includes('youtube.com') || src.includes('youtu.be'));
}

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
    /** YouTube embed URL or bundled file URL (.mov / .mp4) — replaces bottom thumbnails when set. */
    thumbnailVideo,
    highlights = [],
    onOpenProject,
}) => {
    const theme = PROJECT_THEMES[id] ?? PROJECT_THEMES[3];
    const isSalmon = id === 3;
    const isXHeal = id === 1;
    const [isMobile, setIsMobile] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const heroRef = useRef(null);
    const glassRef = useRef(null);
    const [heroAnimDone, setHeroAnimDone] = useState(false);
    const [videoLightboxOpen, setVideoLightboxOpen] = useState(false);
    const [videoLightboxKey, setVideoLightboxKey] = useState(0);

    const openVideoLightbox = () => {
        setVideoLightboxKey((k) => k + 1);
        setVideoLightboxOpen(true);
    };

    const heroInView = useInView(heroRef, { once: true, amount: 0.1 });
    const glassInView = useInView(glassRef, { once: true, amount: 0.08 });

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (!videoLightboxOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') setVideoLightboxOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [videoLightboxOpen]);

    const handleOpen = () => onOpenProject?.(id);

    const glassColumnW = isMobile ? '100%' : 'min(42%, 480px)';

    /** X-Heal: desktop hero scale vs 100vw — tuned so 27" (often ~1920 logical or ~2560 CSS px) feels smaller, not only ultrawide. */
    const heroObjectPosition = isXHeal
        ? 'min(105%, max(79%, calc(62% + clamp(16px, 5.2vw, 96px)))) center'
        : 'center center';
    const xHealHeroScale = isMobile
        ? 'scale(1.04)'
        : 'scale(max(0.92, min(1.03, calc(1.03 - 0.00011 * max(0px, 100vw - 1400px)))))';

    const showThumbRow = thumbnails.length > 0 || Boolean(thumbnailVideo);
    const singleThumb = thumbnails.length === 1 || Boolean(thumbnailVideo);

    // Stagger delays for content items inside the panel
    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                isolation: 'isolate',
            }}
        >
            {/* ── Full-bleed background image (wrapper keeps translateZ + scale in one transform to avoid hover repaint seams vs glass) ── */}
            <motion.div
                ref={heroRef}
                initial={{ scale: 1.06 }}
                animate={heroInView ? { scale: 1 } : { scale: 1.06 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => {
                    if (heroInView) setHeroAnimDone(true);
                }}
                transformTemplate={(t) => `translateZ(0) scale(${t.scale ?? 1})`}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    willChange: heroAnimDone ? undefined : heroInView ? 'transform' : undefined,
                }}
            >
                <img
                    src={image}
                    alt={title}
                    loading="eager"
                    decoding="async"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: heroObjectPosition,
                        display: 'block',
                        ...(isXHeal
                            ? {
                                  transform: xHealHeroScale,
                                  transformOrigin: '0% 0%',
                              }
                            : {}),
                    }}
                />
            </motion.div>

            {/* ── Vignette: wider + darker on the left so white type reads on bright heroes (e.g. X-Heal). ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background:
                    'linear-gradient(to right, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.26) 12%, rgba(0,0,0,0.18) 26%, rgba(0,0,0,0.11) 42%, rgba(0,0,0,0.055) 58%, rgba(0,0,0,0.022) 74%, rgba(0,0,0,0.006) 88%, rgba(0,0,0,0) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
            }} />

            {/* ── Glass panel ── */}
            <motion.div
                ref={glassRef}
                initial={{ opacity: 0, x: -28 }}
                animate={glassInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                transformTemplate={(_t, gen) =>
                    gen && String(gen).trim() ? `translateZ(0) ${String(gen).trim()}` : 'translateZ(0)'
                }
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: glassColumnW,
                    height: '100%',
                    border: 'none',
                    boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backfaceVisibility: 'hidden',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: isMobile ? '100px 7% 40px 4rem' : '140px clamp(2.75rem, 6vw, 5rem) 52px 4rem',
                    boxSizing: 'border-box',
                    /* Shell ignores pointer: only real copy/controls capture events (avoids hover at masked “empty” glass). */
                    pointerEvents: 'none',
                }}
            >
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        backdropFilter: GLASS_BLUR_SOFT,
                        WebkitBackdropFilter: GLASS_BLUR_SOFT,
                        WebkitMaskImage: GLASS_MASK,
                        maskImage: GLASS_MASK,
                        pointerEvents: 'none',
                    }}
                />
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        background: GLASS_PANEL_WASH,
                        WebkitMaskImage: GLASS_MASK,
                        maskImage: GLASS_MASK,
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        minWidth: 0,
                        width: '100%',
                        pointerEvents: 'auto',
                    }}
                >
                {/* Main content — fills space above thumbnails */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, width: '100%' }}>

                    {/* Eyebrow */}
                    <motion.span {...fadeUp(0)} style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: isMobile ? '0.65rem' : '0.7rem',
                        fontWeight: 400,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '1.4rem',
                        display: 'block',
                        textShadow: TEXT_SHADOW_BODY,
                    }}>
                        {eyebrow}
                    </motion.span>

                    {/* Massive title */}
                    <motion.h2 {...fadeUp(0.07)} style={{
                        fontFamily: '"Outfit", system-ui, sans-serif',
                        fontSize: isSalmon
                            ? (isMobile
                                ? 'clamp(1.95rem, 8vw, 3.05rem)'
                                : 'clamp(2.3rem, 3.65vw, 3.85rem)')
                            : (isMobile
                                ? 'clamp(2.2rem, 9vw, 3.35rem)'
                                : 'clamp(2.55rem, 4.1vw, 4.35rem)'),
                        fontWeight: 650,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.0,
                        color: theme.titleColor,
                        margin: '0 0 1.8rem 0',
                        textShadow: TEXT_SHADOW_TITLE,
                    }}>
                        {title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p {...fadeUp(0.13)} style={{
                        fontFamily: '"Outfit", system-ui, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '0.98rem',
                        lineHeight: 1.76,
                        color: theme.bodyColor,
                        margin: '0 0 1.5rem 0',
                        maxWidth: COPY_MAX_WIDTH,
                        fontWeight: 400,
                        whiteSpace: 'pre-line',
                        /* Reduce single-word last lines (Chrome 114+, Safari 17.5+) */
                        textWrap: 'pretty',
                        textShadow: TEXT_SHADOW_BODY,
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
                                fontFamily: '"Outfit", system-ui, sans-serif',
                                fontSize: isMobile ? '0.7rem' : '0.76rem',
                                fontWeight: 600,
                                letterSpacing: '0.01em',
                                textShadow: '0 1px 2px rgba(0,0,0,0.45)',
                            }}>
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* Sponsor */}
                    {sponsor && (
                        <motion.p {...fadeUp(0.22)} style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                            fontWeight: 400,
                            letterSpacing: '0.04em',
                            lineHeight: 1.55,
                            color: 'rgba(255,255,255,0.55)',
                            marginBottom: highlights.length > 0 ? '1rem' : '2.2rem',
                            maxWidth: '100%',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            textShadow: TEXT_SHADOW_BODY,
                        }}>
                            {sponsor}
                        </motion.p>
                    )}

                    {/* Highlights */}
                    {highlights.length > 0 && (
                        <motion.div {...fadeUp(0.22)} style={{
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                            paddingTop: '0.75rem',
                            marginBottom: '1.2rem',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {highlights.map((h) => (
                                <div key={h} style={{ padding: '5px 0' }}>
                                    <span style={{
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: isMobile ? '0.65rem' : '0.7rem',
                                        fontWeight: 400,
                                        color: 'rgba(255,255,255,0.55)',
                                        letterSpacing: '0.04em',
                                        textShadow: TEXT_SHADOW_BODY,
                                    }}>{h}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* QuietCTA */}
                    <motion.div {...fadeUp(0.26)}>
                        <button
                            onClick={handleOpen}
                            onMouseEnter={() => setBtnHovered(true)}
                            onMouseLeave={() => setBtnHovered(false)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: '11px 4px 11px 0',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: `1px solid ${btnHovered ? '#E3FE7A' : 'rgba(255,255,255,0.55)'}`,
                                color: btnHovered ? '#E3FE7A' : '#fff',
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: isMobile ? '0.7rem' : '0.76rem',
                                fontWeight: 400,
                                letterSpacing: '0.04em',
                                cursor: 'pointer',
                                transition: 'color 0.28s, border-color 0.28s',
                                textShadow: TEXT_SHADOW_BODY,
                            }}
                        >
                            {/* Neon dot */}
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: '#E3FE7A', flexShrink: 0,
                                boxShadow: btnHovered ? '0 0 14px #E3FE7A' : '0 0 8px #E3FE7Aaa',
                                transition: 'box-shadow 0.28s',
                            }} />
                            <span>View Project</span>
                            {/* Diagonal arrow */}
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                                style={{
                                    transform: btnHovered ? 'translate(3px,-3px)' : 'none',
                                    transition: 'transform 0.28s',
                                    flexShrink: 0,
                                }}>
                                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </motion.div>
                </div>

                {/* ── Bottom thumbnails or embedded preview video ── */}
                {showThumbRow && (
                    <motion.div
                        {...fadeUp(0.3)}
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            minWidth: 0,
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: theme.divider,
                            margin: '2rem 0 1.4rem',
                        }} />
                        {thumbnailVideo ? (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={openVideoLightbox}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        openVideoLightbox();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    margin: 0,
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'block',
                                    background: 'transparent',
                                    borderRadius: '12px',
                                    textAlign: 'left',
                                    outline: 'none',
                                }}
                                aria-label={`Expand ${title} video`}
                            >
                                {isYoutubeThumbnailVideo(thumbnailVideo) ? (
                                    <div
                                        style={{
                                            width: '100%',
                                            aspectRatio: '16 / 9',
                                            position: 'relative',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#0a0a0a',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                        }}
                                    >
                                        <iframe
                                            src={thumbnailVideo}
                                            title={`${title} preview (muted)`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            loading="lazy"
                                            tabIndex={-1}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                display: 'block',
                                                pointerEvents: 'none',
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#0a0a0a',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                            lineHeight: 0,
                                        }}
                                    >
                                        <video
                                            src={thumbnailVideo}
                                            muted
                                            playsInline
                                            autoPlay
                                            loop
                                            preload="metadata"
                                            tabIndex={-1}
                                            aria-label={`${title} preview (muted)`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                verticalAlign: 'top',
                                                pointerEvents: 'none',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                        <div style={{
                            display: 'flex',
                            gap: singleThumb ? 0 : '0.75rem',
                            width: '100%',
                        }}>
                            {thumbnails.map((thumb, i) => (
                                <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '16 / 9',
                                        borderRadius: singleThumb ? '12px' : '10px',
                                        overflow: 'hidden',
                                        background: 'rgba(0,0,0,0.12)',
                                        border: 'none',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                    }}>
                                        <img
                                            src={thumb}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center center',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </motion.div>
                )}
                </div>
            </motion.div>

            {thumbnailVideo && videoLightboxOpen && typeof document !== 'undefined'
                ? createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${title} video`}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 10050,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'clamp(12px, 4vw, 32px)',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            role="presentation"
                            onClick={() => setVideoLightboxOpen(false)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.72)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                            }}
                        />
                        {isYoutubeThumbnailVideo(thumbnailVideo) ? (
                            <div
                                style={{
                                    position: 'relative',
                                    width: 'min(96vw, 1120px)',
                                    maxHeight: '90vh',
                                    aspectRatio: '16 / 9',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
                                    background: '#000',
                                }}
                            >
                                <iframe
                                    key={videoLightboxKey}
                                    src={youtubeUrlForLightbox(thumbnailVideo)}
                                    title={`${title} — full playback`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVideoLightboxOpen(false)}
                                    aria-label="Close video"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'rgba(0,0,0,0.55)',
                                        color: '#fff',
                                        fontSize: '1.35rem',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    position: 'relative',
                                    width: 'fit-content',
                                    maxWidth: 'min(96vw, 1120px)',
                                    maxHeight: '90vh',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
                                    background: '#000',
                                    lineHeight: 0,
                                }}
                            >
                                <video
                                    key={videoLightboxKey}
                                    src={thumbnailVideo}
                                    controls
                                    playsInline
                                    autoPlay
                                    aria-label={`${title} — full playback`}
                                    style={{
                                        display: 'block',
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: 'min(96vw, 1120px)',
                                        maxHeight: '90vh',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVideoLightboxOpen(false)}
                                    aria-label="Close video"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'rgba(0,0,0,0.55)',
                                        color: '#fff',
                                        fontSize: '1.35rem',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>,
                    document.body
                )
                : null}
        </div>
    );
};

export default ProjectCard;
