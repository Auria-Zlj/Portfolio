import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
    {
        quote: "Working with Auria on the Salmon Says project brought a level of professionalism, organization, and clear communication that was critical to the project's success. Her ability to navigate complexity and solve problems thoughtfully made her a valuable contributor throughout the development of a complex, AI-assisted product.",
        name: "Andrew Claiborne",
        role: "Fish Ageing Lab, Science Division",
        company: "Washington Department of Fish and Wildlife",
    },
    {
        quote: "Auria was an excellent collaborator throughout the product development process. She was responsive to feedback, thoughtful in her contributions, and helped shape a high-quality product that we are actively using in our workflow.",
        name: "Austin J. Anderson",
        role: "Biologist",
        company: "Washington Department of Fish and Wildlife",
    },
    {
        quote: "Auria made a meaningful contribution to a product that has already proven valuable for our fisheries program. Her collaborative approach and responsiveness helped move the work forward in a smooth and effective way.",
        name: "Caleb Jetter",
        role: "Research Scientist",
        company: "Washington Department of Fish and Wildlife",
    },
    {
        quote: "Auria brought strong product thinking to our AI-assisted salmon identification project. She was especially good at bringing clarity to a complicated workflow and shaping practical solutions the team could realistically build.",
        name: "Mubina Raza",
        role: "Senior Manager, Infrastructure & Operations",
        company: "Washington Department of Fish and Wildlife",
    },
];

const col1 = testimonials.slice(0, 2);
const col2 = testimonials.slice(2, 4);
const col3 = [];

const Card = ({ quote, name, role, company }) => (
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
                <h2 style={{
                    fontFamily: '"Outfit", system-ui, sans-serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: '#F5F5F5',
                    margin: '0 0 1rem',
                }}>
                    From people I've worked with.
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
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.25rem',
                    maxHeight: '600px',
                    overflow: 'hidden',
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                }}
            >
                <ScrollColumn items={col1} duration={20} />
                <ScrollColumn items={col2} duration={24} reverse />
            </motion.div>
        </section>
    );
};

export default Testimonials;
