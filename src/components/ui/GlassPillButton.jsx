import { useState } from 'react';
import { motion } from 'framer-motion';

const GlassPillButton = ({ children = 'Get in Touch', href, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <>
            <motion.a
                href={href}
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => { setHovered(false); setPressed(false); }}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                animate={{
                    y: pressed ? 1 : hovered ? -2 : 0,
                    scale: pressed ? 0.97 : 1,
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 20px 10px 14px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: hovered ? 'blur(25px)' : 'blur(10px)',
                    WebkitBackdropFilter: hovered ? 'blur(25px)' : 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    userSelect: 'none',
                    transition: 'backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease',
                    flexShrink: 0,
                }}
            >
                {/* Pulse dot */}
                <span style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
                    <span style={{
                        display: 'block',
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        background: hovered ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'background 0.3s ease',
                    }} />
                    {hovered && (
                        <>
                            <span className="glass-pill-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="glass-pill-pulse" style={{ animationDelay: '300ms' }} />
                        </>
                    )}
                </span>

                {/* Label */}
                <span style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.03em',
                    color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.3s ease',
                }}>
                    {children}
                </span>

                {/* Arrow */}
                <motion.span
                    animate={hovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        opacity: hovered ? 1 : 0.6,
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                        <path d="M2 11L11 2M11 2H5M11 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.span>
            </motion.a>

            <style>{`
                .glass-pill-pulse {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.2);
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%);
                    animation: pillPulse 1.1s ease-out infinite;
                }
                @keyframes pillPulse {
                    0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
                }
            `}</style>
        </>
    );
};

export default GlassPillButton;
