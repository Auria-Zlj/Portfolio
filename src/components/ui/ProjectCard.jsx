import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import RevealFx from '../utils/RevealFx';
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
        glassBg: 'rgba(205, 214, 205, 0.24)',
        glassBorder: 'rgba(122, 145, 122, 0.46)',
        glassShadow: '0 14px 30px rgba(18, 28, 20, 0.14), inset 0 1px 0 rgba(255,255,255,0.3)',
        glow: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.04) 62%, rgba(255,255,255,0) 100%)',
        pillText: 'rgba(38, 43, 38, 0.9)',
        pillBg: 'rgba(240, 245, 240, 0.72)',
        pillBorder: 'rgba(124, 146, 124, 0.6)',
        indexText: 'rgba(88, 96, 88, 0.62)',
        titleText: '#1F241F',
        bodyText: 'rgba(66, 74, 66, 0.8)',
        frosted: true,
        edgeOnly: false,
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
                ? (tone.edgeOnly ? 'blur(9px) saturate(1.05)' : tone.frosted ? 'blur(16px) saturate(1.08) brightness(1.03)' : 'blur(3px) saturate(1.01)')
                : 'blur(10px) saturate(1.04)',
            WebkitBackdropFilter: rich
                ? (tone.edgeOnly ? 'blur(9px) saturate(1.05)' : tone.frosted ? 'blur(16px) saturate(1.08) brightness(1.03)' : 'blur(3px) saturate(1.01)')
                : 'blur(10px) saturate(1.04)',
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
            overflow: 'hidden',
            ...style
        }}
    >
        {rich && (
            <>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '8%',
                        width: '84%',
                        height: '22%',
                        background: tone.glow,
                        filter: 'blur(8px)',
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
                            opacity: 0.1,
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
                        pointerEvents: 'none'
                    }}
                />
            </>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
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
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '1.02rem',
                fontWeight: 900,
                letterSpacing: '0.105em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                textAlign: 'center',
                lineHeight: 1.2,
                textShadow: '0 3px 12px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.1)'
            }}>
                View<br />Project
            </div>
        </motion.div>
    );
}


const ProjectCard = ({ id, title, category, image, secondaryImage, index }) => {
    const infoTone = INFO_THEMES[ACTIVE_INFO_THEME];
    const infoContent = index === 1
        ? {
            title: 'Prelo',
            description: 'Turns unfamiliar menus into confident choices through visual previews and structured dish information.',
            tags: ['Decision UX', 'Information Structuring'],
            sponsor: '',
        }
        : index === 2
            ? {
                title: 'MushRoommate',
                description: 'A home growing service designed for post-pandemic food supply disruption.',
                tags: ['Process Design', 'Habit Support'],
                sponsor: '',
            }
            : {
                title: 'X-Heal',
                description: 'Real-time rehab system that turns physical motion into guided exercise feedback.',
                tags: ['Dual BLE Sensors', 'System Logic'],
                sponsor: 'In collaboration with T-Mobile',
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


    // Simplified hover effect for the image container - Reduced scale since Lens does the heavy lifting
    const imageHoverVariants = {
        rest: { scale: 1, filter: "brightness(1) contrast(1)" },
        hover: { scale: 1.02, filter: "brightness(0.9) contrast(1)" } // Dim slightly to make lens pop
    };

    // Scroll Animation Hooks
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"] // Robust offset: 0 (enter) -> 1 (exit)
    });

    // Debug logs removed

    // 1. Image Zoom & Blur & MASK
    // Scale: 0.8 -> 1.0 continuously as it moves up
    const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.0]);
    // Blur: Clears up by the time it hits center (0.5)
    const imageBlur = useTransform(scrollYProgress, [0, 0.5], ["blur(12px)", "blur(0px)"]);
    // Mask: Reveals by center
    const imageMask = useTransform(scrollYProgress, [0, 0.5], [
        "inset(15% 15% 15% 15% round 30px)",
        "inset(0% 0% 0% 0% round 0px)"
    ]);

    // 2. Synchronized Typography
    const titleSpacing = useTransform(scrollYProgress, [0, 0.5], ["-0.06em", "-0.04em"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);

    // 3. Scroll-Linked Card Appearance (Scrubbing)
    // Info Card: Starts entering at 0.1 (just visible), Done by 0.4 (before center)
    // This ensures it's visible when snapped to center (0.5)
    const infoOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
    const infoY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
    const infoScale = useTransform(scrollYProgress, [0.1, 0.4], [0.5, 1]);

    // Small Card: Starts a bit later (0.2), Done by 0.5 (center)
    const smallOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const smallY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
    const smallScale = useTransform(scrollYProgress, [0.2, 0.5], [0.5, 1]);
    const titleLength = title?.length ?? 0;
    const titleSize = isMobile
        ? (titleLength > 16 ? '1.6rem' : titleLength > 12 ? '1.8rem' : '2rem')
        : (titleLength > 20 ? '1.95rem' : titleLength > 14 ? '2.2rem' : '2.5rem');

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
            <Link
                to={`/project/${id}`}
                style={{
                    textDecoration: 'none',
                    display: 'flex',
                    width: '100%',
                    flexDirection: isMobile ? 'column' : (index % 2 === 1 ? 'row-reverse' : 'row'),
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '2rem' : '2rem',
                    padding: isMobile ? '0 1rem' : '0 4rem'
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
                        width: isMobile ? '100%' : 'auto',
                        flex: isMobile ? 'none' : '2.5',
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
                            height: 'auto', // Force fit
                            position: 'relative',
                            transform: 'translateZ(0)',
                            scale: imageScale,
                            filter: imageBlur,
                            clipPath: imageMask,
                            willChange: 'transform, filter, clip-path',
                            // Applied Glass Styles Here so they scale/mask with the image
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                            borderRadius: '24px',
                            padding: 0,
                            overflow: 'hidden',
                            cursor: 'none' // Hide default cursor for custom lens
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
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.2)',
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: '0.8rem',
                                letterSpacing: '0.1em'
                            }}>
                                NO IMAGE
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Right Side (or Left): Info Stack */}
                {/* Right Side (or Left): Info Stack - Organic/Misaligned */}
                <div style={{
                    width: isMobile ? '100%' : 'auto',
                    flex: isMobile ? 'none' : '1',
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
                            width: isMobile ? '100%' : '100%',
                            marginBottom: isMobile ? '1rem' : '1.4rem',
                            position: 'relative', // Fix for Framer Motion scroll warning
                            opacity: infoOpacity,
                            y: infoY,
                            scale: infoScale // Apply Zoom
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
                                        fontFamily: '"JetBrains Mono", monospace',
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
                                        fontFamily: '"JetBrains Mono", monospace',
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
                                        fontFamily: '"JetBrains Mono", monospace',
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
                                        fontFamily: '"JetBrains Mono", monospace',
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
                            scale: smallScale // Apply Zoom
                        }}
                    >
                        <GlassCard rich={false} style={{
                            padding: 0,
                            overflow: 'hidden',
                            border: '1px solid rgba(176, 242, 209, 0.3)',
                            width: isMobile ? '146px' : '198px',
                            height: isMobile ? '146px' : '198px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 22px rgba(8, 14, 11, 0.26), inset 0 1px 0 rgba(236,255,245,0.16)'
                        }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: `url(${secondaryImage || image || 'https://via.placeholder.com/600x400/eeeeee/00BB44?text='}) center/cover no-repeat`,
                                }}
                            />
                        </GlassCard>
                    </motion.div>
                </div>
            </Link>
        </div>
    );
};

export default ProjectCard;
