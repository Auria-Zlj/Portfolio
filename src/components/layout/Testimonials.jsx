import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
    {
        quote: "Auria has a rare ability to hold both the user's mental model and the system's constraints at the same time. The flows she designed were the clearest our product had ever been.",
        name: "Marcus Tran",
        role: "Head of Product",
        company: "Prelo",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        quote: "She pushed back on our assumptions early — in the best way. By the time we handed off to engineering, there were almost no open questions.",
        name: "Yuna Park",
        role: "Engineering Lead",
        company: "Xheat",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        quote: "Working with Auria felt collaborative from day one. She brought structure to ambiguous briefs and always grounded decisions in actual user behaviour.",
        name: "Daniel Osei",
        role: "Product Manager",
        company: "Freelance",
        img: "https://randomuser.me/api/portraits/men/61.jpg",
    },
    {
        quote: "The audit she ran surfaced three interaction gaps we'd missed in six months of iteration. Precise, thorough, and delivered without friction.",
        name: "Leila Nakamura",
        role: "Design Director",
        company: "Studio North",
        img: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    {
        quote: "Auria's strength is in operational complexity. She made a multi-step enterprise workflow feel obvious — no small feat.",
        name: "Chris Halvorsen",
        role: "CEO",
        company: "Salmon Says",
        img: "https://randomuser.me/api/portraits/men/8.jpg",
    },
    {
        quote: "She bridged the gap between design and development better than anyone I've worked with. Engineers actually trusted her specs.",
        name: "Sofia Reyes",
        role: "Frontend Engineer",
        company: "Prelo",
        img: "https://randomuser.me/api/portraits/women/29.jpg",
    },
];

const col1 = testimonials.slice(0, 2);
const col2 = testimonials.slice(2, 4);
const col3 = testimonials.slice(4, 6);

const Card = ({ quote, name, role, company, img }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    }}>
        <p style={{
            fontFamily: '"Outfit", system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
        }}>
            "{quote}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
                src={img}
                alt={name}
                style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    opacity: 0.85,
                    flexShrink: 0,
                }}
            />
            <div>
                <div style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '0.01em',
                }}>{name}</div>
                <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.05em',
                    marginTop: '2px',
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
                <Card key={i} {...t} />
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
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: '8vh', textAlign: 'center' }}
            >
                <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '1.2rem',
                }}>
                    Testimonials
                </div>
                <h2 style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: '#F5F5F5',
                    margin: '0 0 1rem',
                }}>
                    From people I've<br />worked with.
                </h2>
                <p style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                    letterSpacing: '0.01em',
                }}>
                    Perspectives across products, teams, and partnerships.
                </p>
            </motion.div>

            {/* Columns */}
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
                <ScrollColumn items={col1} duration={18} />
                <ScrollColumn items={col2} duration={22} reverse />
                <ScrollColumn items={col3} duration={20} />
            </motion.div>
        </section>
    );
};

export default Testimonials;
