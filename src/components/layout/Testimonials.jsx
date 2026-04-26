import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const NEON = '#E3FE7A';

const testimonials = [
    {
        quote: "Working with Auria on the Salmon Says project brought a level of professionalism, organization, and clear communication that was critical to the project's success. Her ability to navigate complexity and solve problems thoughtfully made her a valuable contributor throughout the development of a complex, AI-assisted product.",
        name: 'Andrew Claiborne',
        role: 'Fish Ageing Lab, Science Division',
        company: 'Washington Department of Fish and Wildlife',
        initials: 'AC',
    },
    {
        quote: 'Auria was an excellent collaborator throughout the product development process. She was responsive to feedback, thoughtful in her contributions, and helped shape a high-quality product that we are actively using in our workflow.',
        name: 'Austin J. Anderson',
        role: 'Biologist',
        company: 'Washington Department of Fish and Wildlife',
        initials: 'AA',
    },
    {
        quote: 'Auria made a meaningful contribution to a product that has already proven valuable for our fisheries program. Her collaborative approach and responsiveness helped move the work forward in a smooth and effective way.',
        name: 'Caleb Jetter',
        role: 'Research Scientist',
        company: 'Washington Department of Fish and Wildlife',
        initials: 'CJ',
    },
    {
        quote: 'Auria brought strong product thinking to our AI-assisted salmon identification project. She was especially good at bringing clarity to a complicated workflow and shaping practical solutions the team could realistically build.',
        name: 'Mubina Raza',
        role: 'Senior Manager, Infrastructure & Operations',
        company: 'Washington Department of Fish and Wildlife',
        initials: 'MR',
    },
];

const col1 = [testimonials[0], testimonials[1]];
const col2 = [testimonials[2], testimonials[3]];
const col3 = [testimonials[1], testimonials[2]];

const InitialsAvatar = ({ initials }) => (
    <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.75)',
        flexShrink: 0,
    }}>{initials}</div>
);

const NeonMarker = () => (
    <span style={{
        display: 'inline-block', width: 8, height: 8, flexShrink: 0,
        border: `2px solid ${NEON}`,
        background: NEON,
        boxShadow: `0 0 10px ${NEON}88`,
    }} />
);

const Card = ({ quote, name, role, company, initials, index }) => (
    <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderTop: `2px solid ${NEON}`,
        borderRadius: '0 0 14px 14px',
        padding: '28px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: NEON,
            }}>Reference 0{index + 1} / 0{testimonials.length}</span>
            <NeonMarker />
        </div>

        <p style={{
            margin: 0,
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.80)',
        }}>
            "{quote}"
        </p>

        <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        }}>
            <InitialsAvatar initials={initials} />
            <div>
                <div style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.95)',
                    letterSpacing: '0.01em',
                }}>{name}</div>
                <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10.5px',
                    color: 'rgba(255,255,255,0.40)',
                    letterSpacing: '0.05em',
                    marginTop: '3px',
                    lineHeight: 1.55,
                }}>{role} · {company}</div>
            </div>
        </div>
    </div>
);

const ScrollColumn = ({ items, duration, reverse = false }) => (
    <div style={{ overflow: 'hidden', flex: 1 }}>
        <motion.div
            animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
            transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.25rem' }}
        >
            {[...items, ...items].map((t, i) => (
                <Card key={i} index={testimonials.indexOf(t)} {...t} />
            ))}
        </motion.div>
    </div>
);

const Testimonials = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-10% 0px' });

    return (
        <section ref={ref} style={{
            background: '#0A0A0A',
            width: '100%',
            padding: '14vh 6vw 12vh',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Subtle neon radial wash */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${NEON}08, transparent 60%)`,
            }} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: '8vh', position: 'relative' }}
            >
                {/* Eyebrow */}
                <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 13,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: 16,
                }}>
                    Vol. 02 — Testimonials{' '}
                    <span style={{ color: NEON }}>/ 2026</span>
                </div>

                {/* Hairline */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    style={{
                        width: '95%', height: 1,
                        background: 'rgba(255,255,255,0.25)',
                        marginBottom: 48, transformOrigin: 'left',
                    }}
                />

                {/* Two-col: headline + meta */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2.2fr 1fr',
                    columnGap: 72,
                    alignItems: 'end',
                }}>
                    <h2 style={{
                        margin: 0,
                        fontFamily: '"Outfit", system-ui, sans-serif',
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: 300,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        color: 'rgba(255,255,255,0.98)',
                    }}>
                        In the words of<br />
                        <span style={{
                            fontWeight: 600, color: NEON,
                            textShadow: `0 0 32px ${NEON}40`,
                        }}>those who shipped with me.</span>
                    </h2>
                    <div style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 12,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        paddingBottom: 8,
                    }}>
                        <span style={{ color: NEON }}>●</span> Archive · {testimonials.length} references
                    </div>
                </div>
            </motion.div>

            {/* Scrolling columns */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.25rem',
                    maxHeight: '600px',
                    overflow: 'hidden',
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                }}
            >
                <ScrollColumn items={col1} duration={20} />
                <ScrollColumn items={col2} duration={24} reverse />
                <ScrollColumn items={col3} duration={22} />
            </motion.div>
        </section>
    );
};

export default Testimonials;
