import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RevealFx from '../utils/RevealFx';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';

const GlassCard = ({ children, className = "", style = {} }) => (
    <div
        className={`glass-card ${className}`}
        style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            borderRadius: '24px',
            padding: '2.5rem',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            ...style
        }}
    >
        {children}
    </div>
);

const ProjectCard = ({ id, title, category, image, secondaryImage, index }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simplified hover effect for the image container
    const imageHoverVariants = {
        rest: { scale: 1, filter: "brightness(1) contrast(1)" },
        hover: { scale: 1.05, filter: "brightness(1.1) contrast(1.05)" }
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
                            overflow: 'hidden'
                        }}
                    >
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
                            width: isMobile ? '100%' : '95%', // Increased width as requested
                            marginBottom: isMobile ? '1rem' : '2rem', // Gap between cards
                            position: 'relative', // Fix for Framer Motion scroll warning
                            opacity: infoOpacity,
                            y: infoY,
                            scale: infoScale // Apply Zoom
                        }}
                    >
                        <GlassCard style={{
                            alignItems: 'flex-start',
                            justifyContent: 'center', // Changed to center for better balance
                            padding: isMobile ? '2rem' : '3rem', 
                            minHeight: isMobile ? 'auto' : '40vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                             <div style={{ width: '100%' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '2rem',
                                    width: '100%',
                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    paddingBottom: '1rem'
                                }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '100px',
                                        color: '#1A1A1A',
                                        fontSize: '0.75rem', 
                                        fontWeight: 500,
                                        letterSpacing: '0.02em',
                                        fontFamily: '"JetBrains Mono", monospace',
                                        backgroundColor: '#F2F2F2', // Solid clean pill
                                        border: 'none'
                                    }}>
                                        {category}
                                    </div>
                                    <div style={{
                                        fontFamily: '"JetBrains Mono", monospace',
                                        fontSize: '0.75rem',
                                        color: 'rgba(26, 26, 26, 0.4)',
                                        fontWeight: 500
                                    }}>
                                        0{index + 1} /
                                    </div>
                                </div>

                                <motion.h3
                                    style={{
                                        fontSize: isMobile ? '2rem' : '2.5rem', // Smaller than 3.5, but impactful
                                        fontWeight: 500, // Lighter weight
                                        fontFamily: '"PP Neue Montreal", "Inter", sans-serif',
                                        letterSpacing: '-0.03em',
                                        margin: '0 0 1.5rem 0',
                                        lineHeight: 1.1,
                                        color: '#1A1A1A',
                                        opacity: titleOpacity
                                    }}
                                >
                                    {title}
                                </motion.h3>

                                <p style={{
                                    fontSize: isMobile ? '0.95rem' : '1rem',
                                    lineHeight: '1.6',
                                    color: '#555', // Softer text
                                    margin: '0',
                                    maxWidth: '95%',
                                    fontWeight: 400
                                }}>
                                    A strategic exploration of user-centric design principles, focusing on intuitive navigation and seamless interactions.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>


                    {/* Secondary Image Card - Bottom & Square & Offset */}
                    <motion.div
                        style={{
                            // alignSelf: REMOVED to allow parent alignItems: flex-start to work
                            // transform: REMOVED to remove offset/stagger
                            marginTop: '1rem', // Ensure positive gap
                            position: 'relative', // Fix for Framer Motion scroll warning
                            opacity: smallOpacity,
                            y: smallY,
                            scale: smallScale // Apply Zoom
                        }}
                    >
                        <GlassCard style={{
                            padding: 0,
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            width: isMobile ? '150px' : '220px', // Fixed square size
                            height: isMobile ? '150px' : '220px', // Fixed square size
                            borderRadius: '20px'
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
