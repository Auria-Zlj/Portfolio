"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TextShimmer } from './text-shimmer';
import FlowFieldBackground from './flow-field-background';

const FULL_ABS = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
};

export default function DemoOne({ collapse = false }) {
    const HOLD_MS = 1000;
    const TRANSITION_MS = 780;
    const SUBTITLE_TO_NAME_WAIT_MS = 420;
    const [phase, setPhase] = useState(0); // 0: boot, 1: subtitle, 2: subtitle+name

    useEffect(() => {
        const phase1At = HOLD_MS;
        const phase2At = HOLD_MS + TRANSITION_MS + SUBTITLE_TO_NAME_WAIT_MS;
        const timerA = window.setTimeout(() => setPhase(1), phase1At);
        const timerB = window.setTimeout(() => setPhase(2), phase2At);
        return () => {
            window.clearTimeout(timerA);
            window.clearTimeout(timerB);
        };
    }, [HOLD_MS, TRANSITION_MS, SUBTITLE_TO_NAME_WAIT_MS]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: '#F4F4F4',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <FlowFieldBackground color="#1B6B42" scale={1} trailOpacity={0.1} speed={0.8} collapse={collapse} />

            <motion.div
                initial={false}
                animate={
                    collapse
                        ? { opacity: 0.18, scale: 0.86, z: -120 }
                        : { opacity: 1, scale: 1, z: 0 }
                }
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    ...FULL_ABS,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                    transformPerspective: 1000,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className="intro-line-track">
                    <motion.div
                        className={`intro-boot-line ${phase === 0 ? 'is-active' : ''}`}
                        initial={{ y: '0%', opacity: 1 }}
                        animate={phase === 0 ? { y: '0%', opacity: 1 } : { y: '-30%', opacity: 0 }}
                        transition={{ duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className={`intro-line-shell ${phase === 0 ? 'is-glow' : ''}`}>
                            <TextShimmer
                                duration={1.2}
                                className="intro-line intro-line--base"
                                style={{ '--base-color': '#12392a', '--base-gradient-color': '#82cda7' }}
                            >
                                INITIALIZING SYSTEM
                            </TextShimmer>
                        </span>
                    </motion.div>

                    <motion.div
                        className="intro-signature-block"
                        initial={{ y: '24%', opacity: 0 }}
                        animate={phase >= 1 ? { y: '0%', opacity: 1 } : { y: '24%', opacity: 0 }}
                        transition={{ duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className={`intro-line-shell ${phase === 1 ? 'is-glow' : ''}`}>
                            <TextShimmer
                                duration={1.2}
                                className="intro-line intro-line--base"
                                style={{ '--base-color': '#1e3a30', '--base-gradient-color': '#98d6b7' }}
                            >
                                A Perspective by
                            </TextShimmer>
                        </span>

                        <motion.div
                            className="intro-name-row"
                            initial={{ y: '65%', opacity: 0 }}
                            animate={phase >= 2 ? { y: '0%', opacity: 1 } : { y: '65%', opacity: 0 }}
                            transition={{ duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className={`intro-line-shell ${phase === 2 ? 'is-glow' : ''}`}>
                                <TextShimmer
                                    duration={1.2}
                                    className="intro-line intro-line--base"
                                    style={{ '--base-color': '#861118', '--base-gradient-color': '#e58a90' }}
                                >
                                    AURIA Z
                                </TextShimmer>
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <style>{`
                .intro-line-track {
                    --intro-line-height: clamp(2.4rem, 8vw, 4.8rem);
                    position: relative;
                    width: min(80vw, 760px);
                    height: calc(var(--intro-line-height) * 1.68);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
                }

                .intro-boot-line,
                .intro-signature-block {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: calc(var(--intro-line-height) * 1.68);
                }

                .intro-name-row {
                    margin-top: clamp(0.06rem, 0.35vw, 0.2rem);
                }

                .intro-line {
                    display: inline-block;
                    white-space: nowrap;
                    text-align: center;
                }

                .intro-line-shell {
                    display: inline-block;
                    will-change: filter;
                }

                .intro-line-shell.is-glow {
                    animation: introGlowPulseOnce 1.2s ease-out 1 both;
                }

                .intro-line--base {
                    font-family: 'Inter', sans-serif;
                    font-size: clamp(1.08rem, 1.6vw, 1.28rem);
                    font-weight: 600;
                    letter-spacing: 0.11em;
                    text-transform: uppercase;
                }

                @keyframes introGlowPulseOnce {
                    0% {
                        filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
                    }
                    42% {
                        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.46));
                    }
                    100% {
                        filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
                    }
                }
            `}</style>
        </div>
    );
}
