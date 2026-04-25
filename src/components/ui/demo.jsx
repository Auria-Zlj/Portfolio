"use client";

import { motion } from 'framer-motion';
import FlowFieldBackground from './flow-field-background';

const FULL_ABS = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
};

export default function DemoOne({ collapse = false }) {
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
            <FlowFieldBackground color="#7BA4B8" scale={1} trailOpacity={0.1} speed={0.8} collapse={collapse} />

            <motion.div
                initial={false}
                animate={
                    collapse
                        ? { opacity: 0, scale: 0.9, filter: 'blur(6px)' }
                        : { opacity: 1, scale: 1, filter: 'blur(0px)' }
                }
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    ...FULL_ABS,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                        style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: 'clamp(0.72rem, 1.1vw, 0.88rem)',
                            fontWeight: 500,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#8A9BAA',
                            margin: 0,
                            marginBottom: '0.6rem',
                        }}
                    >
                        A Perspective of
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            letterSpacing: '-0.01em',
                            color: '#1B3A4B',
                            margin: 0,
                            lineHeight: 1.05,
                        }}
                    >
                        Auria Z
                    </motion.h1>
                </div>
            </motion.div>
        </div>
    );
}
