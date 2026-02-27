import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const INFO_THEMES = {
    deepGreen: {
        glassBg: 'linear-gradient(160deg, rgba(230,232,228,0.86) 0%, rgba(224,227,223,0.84) 58%, rgba(216,220,215,0.88) 100%)',
        glassBorder: 'rgba(190, 197, 189, 0.75)',
        glassShadow: '0 12px 24px rgba(34, 42, 34, 0.1), inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(178,187,177,0.28)',
        glow: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 68%, rgba(255,255,255,0) 100%)',
        pillText: 'rgba(38, 47, 40, 0.94)',
        pillBg: 'rgba(241, 244, 240, 0.82)',
        pillBorder: 'rgba(178, 188, 178, 0.65)',
        indexText: 'rgba(85, 97, 85, 0.58)',
        titleText: '#1A231D',
        bodyText: 'rgba(60, 72, 61, 0.82)',
    },
    softLavender: {
        glassBg: 'rgba(224, 229, 223, 0.86)',
        glassBorder: 'rgba(122, 145, 122, 0.46)',
        glassShadow: '0 14px 30px rgba(18, 28, 20, 0.14), inset 0 1px 0 rgba(255,255,255,0.3)',
        glow: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.04) 62%, rgba(255,255,255,0) 100%)',
        pillText: 'rgba(38, 43, 38, 0.9)',
        pillBg: 'rgba(240, 245, 240, 0.72)',
        pillBorder: 'rgba(124, 146, 124, 0.6)',
        indexText: 'rgba(88, 96, 88, 0.62)',
        titleText: '#1F241F',
        bodyText: 'rgba(52, 60, 52, 0.9)',
        frosted: false,
        edgeOnly: false,
        noBackdrop: true,
        noOverlay: true,
    },
    slateBlue: {
        glassBg: 'linear-gradient(150deg, rgba(42,50,66,0.56) 0%, rgba(33,39,54,0.5) 46%, rgba(24,29,42,0.66) 100%)',
        glassBorder: 'rgba(185, 210, 255, 0.3)',
        glassShadow: '0 18px 42px rgba(8, 12, 18, 0.38), inset 0 1px 0 rgba(235,242,255,0.26), inset 0 -1px 0 rgba(144,178,240,0.14), inset 0 0 32px rgba(120,155,226,0.1)',
        glow: 'radial-gradient(ellipse at center, rgba(228,240,255,0.3) 0%, rgba(228,240,255,0.09) 45%, rgba(228,240,255,0) 74%)',
        pillText: 'rgba(238, 245, 255, 0.95)',
        pillBg: 'rgba(180, 205, 255, 0.14)',
        pillBorder: 'rgba(185, 210, 255, 0.38)',
        indexText: 'rgba(215, 227, 250, 0.58)',
        titleText: '#F3F7FF',
        bodyText: 'rgba(226, 232, 244, 0.84)',
    },
    plumSmoke: {
        glassBg: 'linear-gradient(152deg, rgba(59,43,59,0.56) 0%, rgba(47,35,49,0.5) 46%, rgba(35,27,38,0.66) 100%)',
        glassBorder: 'rgba(240, 185, 255, 0.28)',
        glassShadow: '0 18px 42px rgba(16, 8, 18, 0.4), inset 0 1px 0 rgba(253,234,255,0.24), inset 0 -1px 0 rgba(220,150,235,0.12), inset 0 0 32px rgba(206,132,223,0.1)',
        glow: 'radial-gradient(ellipse at center, rgba(252,236,255,0.28) 0%, rgba(252,236,255,0.08) 45%, rgba(252,236,255,0) 74%)',
        pillText: 'rgba(255, 241, 255, 0.95)',
        pillBg: 'rgba(240, 185, 255, 0.14)',
        pillBorder: 'rgba(240, 185, 255, 0.34)',
        indexText: 'rgba(236, 209, 241, 0.58)',
        titleText: '#FFF5FF',
        bodyText: 'rgba(238, 220, 241, 0.84)',
    },
};

const ACTIVE_INFO_THEME = 'softLavender';

const preventOrphan = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length < 3) return text;
    const head = words.slice(0, -2).join(' ');
    const tail = `${words[words.length - 2]}\u00A0${words[words.length - 1]}`;
    return head ? `${head} ${tail}` : tail;
};

const GlassCard = ({ children, className = "", style = {}, rich = true, tone = INFO_THEMES.deepGreen }) => (
    <div
        className={`glass-card ${className}`}
        style={{
            background: rich
                ? tone.glassBg
                : 'rgba(255, 255, 255, 0.18)',
            backdropFilter: rich
                ? (tone.noBackdrop ? 'none' : tone.edgeOnly ? 'blur(4px) saturate(1.03)' : tone.frosted ? 'blur(3px) saturate(1.02)' : 'blur(1.2px) saturate(1.01)')
                : 'blur(3px) saturate(1.02)',
            WebkitBackdropFilter: rich
                ? (tone.noBackdrop ? 'none' : tone.edgeOnly ? 'blur(4px) saturate(1.03)' : tone.frosted ? 'blur(3px) saturate(1.02)' : 'blur(1.2px) saturate(1.01)')
                : 'blur(3px) saturate(1.02)',
            border: rich ? `1px solid ${tone.glassBorder}` : '1px solid rgba(255,255,255,0.35)',
            boxShadow: rich
                ? tone.glassShadow
                : '0 8px 20px rgba(0,0,0,0.14)',
            borderRadius: '24px',
            padding: '2.5rem',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            isolation: 'isolate',
            overflow: 'hidden',
            ...style
        }}
    >
        {rich && !tone.noOverlay && (
            <>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '8%',
                        width: '84%',
                        height: '22%',
                        background: tone.glow,
                        filter: 'blur(2px)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                />
                {tone.frosted && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27 viewBox=%270 0 120 120%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%271.1%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27120%27 height=%27120%27 filter=%27url(%23n)%27 opacity=%270.22%27/%3E%3C/svg%3E")',
                            mixBlendMode: 'soft-light',
                            opacity: 0.03,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />
                )}
                {tone.edgeOnly && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            padding: '1.5px',
                            borderRadius: '24px',
                            background: 'linear-gradient(130deg, rgba(200,220,255,0.96) 0%, rgba(56,88,255,0.9) 46%, rgba(200,220,255,0.96) 100%)',
                            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            opacity: 0.8,
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}
                    />
                )}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '24px',
                        border: tone.edgeOnly ? '1px solid rgba(226,236,255,0.26)' : '1px solid rgba(255,255,255,0.42)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />
            </>
        )}
        <div style={{ position: 'relative', zIndex: 2, textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' }}>
            {children}
        </div>
    </div>
);

const Lens = ({ x, y }) => {
    // Lens Physics with Spring for "Liquid" lag
    const smoothX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.8 });
    const smoothY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.8 });

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: smoothX,
                top: smoothY,
                x: '-50%', // Center the lens on the cursor
                y: '-50%',
                width: '150px', // Slightly larger for presence
                height: '150px',
                borderRadius: '50%',
                border: '1px solid rgba(160, 255, 210, 0.4)',
                zIndex: 20,
                background: 'transparent',
                backdropFilter: 'blur(3px) saturate(1.04)',
                WebkitBackdropFilter: 'blur(3px) saturate(1.04)',
                boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
                pointerEvents: 'none', // Let clicks pass through
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 120deg, rgba(120,255,200,0), rgba(130,255,205,0.26), rgba(88,234,168,0.34), rgba(184,255,224,0.2), rgba(120,255,200,0))',
                    WebkitMask: 'radial-gradient(circle, transparent 76%, #000 80%)',
                    mask: 'radial-gradient(circle, transparent 76%, #000 80%)',
                    opacity: 0.42
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '18%',
                    width: '64%',
                    height: '18%',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.62), rgba(255,255,255,0))',
                    filter: 'blur(1px)',
                    opacity: 0.78
                }}
            />
            {/* Text Overlay */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                color: '#FFFFFF',
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                padding: 0,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1.16rem',
                fontWeight: 600,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                textAlign: 'center',
                lineHeight: 1.14,
                textShadow: '0 2px 9px rgba(0,0,0,0.42), 0 0 6px rgba(255,255,255,0.08)'
            }}>
                View<br />Project
            </div>
        </motion.div>
    );
}


const ProjectCard = ({ id, title, category, description, tags, sponsor, image, secondaryImage, secondaryVideo, index, onOpenProject }) => {
    const infoTone = INFO_THEMES[ACTIVE_INFO_THEME];
    const infoContent = {
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        sponsor,
    };
    const descriptionText = preventOrphan(infoContent.description);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse Tracking for Lens
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Lens visibility state
    const [lensVisible, setLensVisible] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };


    // Hover accent stays subtle; primary motion comes from scroll-linked zoom.
    const imageHoverVariants = {
        rest: { scale: 1, filter: "brightness(1) contrast(1)" },
        hover: { scale: 1.02, filter: "brightness(0.93) contrast(1)" }
    };

    // Scroll Animation Hooks
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"] // Robust offset: 0 (enter) -> 1 (exit)
    });

    // Debug logs removed

    // Reintroduce scroll-linked zoom/reveal while keeping visuals crisp (no blur).
    const fullStateDelay = -0.06;
    const imageScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.0]);
    const imageY = useTransform(scrollYProgress, [0, 1], [12, 0]);
    const imageOpacity = 1;
    const imageMask = useTransform(scrollYProgress, [0 + fullStateDelay, 0.5 + fullStateDelay], [
        "inset(12% 12% 12% 12% round 30px)",
        "inset(0% 0% 0% 0% round 0px)"
    ]);

    // 2. Synchronized Typography
    const titleSpacing = useTransform(scrollYProgress, [0 + fullStateDelay, 0.5 + fullStateDelay], ["-0.06em", "-0.04em"]);
    const titleOpacity = useTransform(scrollYProgress, [0 + fullStateDelay, 0.4 + fullStateDelay], [0.6, 1]);

    // 3. Scroll-Linked Card Appearance (Scrubbing)
    // Info Card: Starts entering at 0.1 (just visible), Done by 0.4 (before center)
    // This ensures it's visible when snapped to center (0.5)
    const infoOpacity = useTransform(scrollYProgress, [0.1 + fullStateDelay, 0.4 + fullStateDelay], [0, 1]);
    const infoY = useTransform(scrollYProgress, [0.1 + fullStateDelay, 0.4 + fullStateDelay], [100, 0]);
    const infoScale = useTransform(scrollYProgress, [0.1 + fullStateDelay, 0.4 + fullStateDelay], [0.5, 1]);

    // Small Card: Starts a bit later (0.2), Done by 0.5 (center)
    const smallOpacity = useTransform(scrollYProgress, [0.2 + fullStateDelay, 0.5 + fullStateDelay], [0, 1]);
    const smallY = useTransform(scrollYProgress, [0.2 + fullStateDelay, 0.5 + fullStateDelay], [100, 0]);
    const smallScale = useTransform(scrollYProgress, [0.2 + fullStateDelay, 0.5 + fullStateDelay], [0.5, 1]);
    const titleLength = title?.length ?? 0;
    const titleSize = isMobile
        ? (titleLength > 16 ? '1.6rem' : titleLength > 12 ? '1.8rem' : '2rem')
        : (titleLength > 20 ? '1.95rem' : titleLength > 14 ? '2.2rem' : '2.5rem');
    const heroAspectRatio = isMobile ? '4 / 3' : '16 / 10';
    const heroDesktopMaxWidth = 'min(62vw, 980px)';
    const heroDesktopHeight = 'min(58vh, 600px)';
    const infoDesktopWidth = 'clamp(340px, 28vw, 430px)';

    const handleOpenProject = () => {
        if (typeof onOpenProject === 'function') {
            onOpenProject(id);
        }
    };

    const handleCardKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpenProject();
        }
    };

    const supportingMediaSrc = secondaryVideo || secondaryImage || image || 'https://via.placeholder.com/600x400/eeeeee/00BB44?text=';
    const supportingMediaIsVideo = Boolean(secondaryVideo) || /\.(mp4|webm|mov)$/i.test(supportingMediaSrc);
    const supportingCardWidth = supportingMediaIsVideo
        ? (isMobile ? '176px' : '248px')
        : (isMobile ? '146px' : '198px');
    const supportingCardHeight = supportingMediaIsVideo ? 'auto' : supportingCardWidth;

    return (
        <div
            ref={cardRef} // Attach Scroll Ref to a real DOM element
            style={{
                width: '100%',
                minWidth: isMobile ? 'auto' : '90vw',
                maxWidth: isMobile ? '100%' : '90vw',
                margin: '0 auto',
                position: 'relative'
            }}
        >
            <div
                role="button"
                tabIndex={0}
                aria-label={`Open ${title} project details`}
                onClick={handleOpenProject}
                onKeyDown={handleCardKeyDown}
                style={{
                    textDecoration: 'none',
                    display: 'flex',
                    width: '100%',
                    flexDirection: isMobile ? 'column' : (index % 2 === 1 ? 'row-reverse' : 'row'),
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '2rem' : '2rem',
                    padding: isMobile ? '0 1rem' : '0 4rem',
                    cursor: 'pointer'
                }}
            >
                {/* Image Card - Wraps the visual - APPEARS SECOND */}
                {/* Image Card - Wraps the visual - APPEARS SECOND (via Mask/Scale, not Slide) */}
                {/* Image Card - Wraps the visual - APPEARS SECOND (via Opacity Fade + Zoom/Mask) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="project-card-visual-wrapper"
                    style={{
                        width: isMobile ? '100%' : heroDesktopMaxWidth,
                        flex: isMobile ? 'none' : '0 0 auto',
                        position: 'relative'
                    }}
                >
                    <motion.div
                        className="project-card-visual"
                        initial="rest"
                        whileHover="hover"
                        onHoverStart={() => { setIsHovered(true); setLensVisible(true); }}
                        onHoverEnd={() => { setIsHovered(false); setLensVisible(false); }}
                        onMouseMove={handleMouseMove}
                        ref={containerRef}
                        style={{
                            width: '100%',
                            height: isMobile ? 'auto' : heroDesktopHeight,
                            aspectRatio: isMobile ? heroAspectRatio : 'auto',
                            position: 'relative',
                            transform: 'translateZ(0)',
                            scale: imageScale,
                            y: imageY,
                            opacity: imageOpacity,
                            clipPath: imageMask,
                            willChange: 'transform, opacity, clip-path',
                            // Scale the whole hero block (image + frame) together
                            background: '#f3f4f2',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                            borderRadius: '24px',
                            padding: 0,
                            overflow: 'hidden',
                            cursor: 'none' // Hide default cursor for custom lens
                        }}
                    >
                        <motion.div
                            style={{
                                width: '100%',
                                height: isMobile ? 'auto' : '100%',
                                position: 'relative',
                                transform: 'translateZ(0)',
                            }}
                        >
                            {/* THE LENS */}
                            {!isMobile && lensVisible && (
                                <Lens x={mouseX} y={mouseY} />
                            )}

                            {image ? (
                                <motion.img
                                    src={image}
                                    alt={title}
                                    variants={imageHoverVariants}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        width: '100%',
                                        height: isMobile ? 'auto' : '100%',
                                        display: 'block',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: isMobile ? '300px' : '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.2)',
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    NO IMAGE
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Right Side (or Left): Info Stack */}
                {/* Right Side (or Left): Info Stack - Organic/Misaligned */}
                <div style={{
                    width: isMobile ? '100%' : infoDesktopWidth,
                    flex: isMobile ? 'none' : '0 0 auto',
                    height: isMobile ? 'auto' : '80vh', // More vertical space for organic arrangement
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Center the cluster vertically
                    alignItems: isMobile ? 'flex-start' : (index % 2 === 0 ? 'flex-start' : 'flex-end'), // Align towards the Main Image
                    position: 'relative',
                    textTextAlign: 'left', // Keep text inside cards left-aligned
                    // PADDING REMOVED to tighten gap to Main Image
                }}>
                    {/* Info Card - Top & Taller - APPEARS AFTER IMAGE */}
                    <motion.div
                        style={{
                            width: '100%',
                            marginBottom: isMobile ? '1rem' : '1.4rem',
                            position: 'relative', // Fix for Framer Motion scroll warning
                            opacity: infoOpacity,
                            y: infoY,
                            scale: infoScale
                        }}
                    >
                        <GlassCard tone={infoTone} style={{
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            padding: isMobile ? '1.7rem 1.55rem' : '2.25rem 2.7rem',
                            minHeight: isMobile ? 'auto' : '46vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: isMobile ? 'auto' : '31vh'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.62rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.07em',
                                        color: infoTone.indexText,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        0{index + 1} /
                                    </span>
                                </div>

                                <motion.h3
                                    style={{
                                        fontSize: isMobile ? '1.72rem' : '2.16rem',
                                        fontWeight: 520,
                                        fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
                                        letterSpacing: '-0.032em',
                                        margin: '0 0 1.2rem 0',
                                        lineHeight: 1.12,
                                        color: infoTone.titleText,
                                        opacity: titleOpacity,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {infoContent.title}
                                </motion.h3>

                                <p style={{
                                    fontSize: isMobile ? '0.92rem' : '0.98rem',
                                    lineHeight: '1.72',
                                    color: infoTone.bodyText,
                                    margin: '0 0 1.25rem 0',
                                    maxWidth: isMobile ? '34ch' : '40ch',
                                    fontWeight: 400
                                }}>
                                    {descriptionText}
                                </p>
                                <div style={{
                                    margin: '1.3rem 0 1rem',
                                    width: '100%',
                                    borderTop: `1px dashed ${infoTone.pillBorder}`,
                                    opacity: 0.72
                                }} />
                                <div style={{
                                    display: 'flex',
                                    gap: '0.34rem',
                                    flexWrap: 'nowrap',
                                    alignItems: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.18rem 0.45rem',
                                        borderRadius: '999px',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.56rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.03em',
                                            color: infoTone.pillText,
                                            backgroundColor: infoTone.pillBg,
                                            border: `1px solid ${infoTone.pillBorder}`
                                        }}>
                                            {infoContent.tags[0]}
                                        </span>
                                        <span style={{
                                        display: 'inline-block',
                                        padding: '0.18rem 0.45rem',
                                        borderRadius: '999px',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.56rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.03em',
                                            color: infoTone.pillText,
                                            backgroundColor: infoTone.pillBg,
                                            border: `1px solid ${infoTone.pillBorder}`
                                        }}>
                                            {infoContent.tags[1]}
                                        </span>
                                </div>
                                {infoContent.sponsor && (
                                    <p style={{
                                        margin: 'auto 0 0',
                                        paddingTop: '1rem',
                                        fontSize: '0.58rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        fontFamily: '"Inter", sans-serif',
                                        color: '#1F2420',
                                        opacity: 0.96,
                                        textShadow: '0 1px 0 rgba(255,255,255,0.35)'
                                    }}>
                                        {infoContent.sponsor}
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>


                    {/* Secondary Image Card - Bottom & Square & Offset */}
                    <motion.div
                        style={{
                            marginTop: isMobile ? '1rem' : '2rem',
                            position: 'relative', // Fix for Framer Motion scroll warning
                            opacity: smallOpacity,
                            y: smallY,
                            scale: smallScale
                        }}
                    >
                        <GlassCard rich={false} style={{
                            padding: 0,
                            overflow: 'hidden',
                            border: '1px solid rgba(176, 242, 209, 0.3)',
                            width: supportingCardWidth,
                            height: supportingCardHeight,
                            borderRadius: '16px',
                            boxShadow: '0 10px 22px rgba(8, 14, 11, 0.26), inset 0 1px 0 rgba(236,255,245,0.16)'
                        }}>
                            <motion.div
                                whileHover={supportingMediaIsVideo ? undefined : { scale: 1.02 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    width: '100%',
                                    height: supportingMediaIsVideo ? 'auto' : '100%',
                                    backgroundColor: supportingMediaIsVideo || id === 3 ? '#0a0f0c' : 'transparent',
                                }}
                            >
                                {supportingMediaIsVideo ? (
                                    <video
                                        src={supportingMediaSrc}
                                        poster={image}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        aria-label={`${title} supporting video`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            objectFit: 'contain',
                                            objectPosition: 'center center',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={supportingMediaSrc}
                                        alt={`${title} supporting visual`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'block',
                                            objectFit: id === 3 ? 'contain' : 'cover',
                                        }}
                                    />
                                )}
                            </motion.div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
