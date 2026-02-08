import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';

const projects = [
    { id: 1, title: 'Prelo', category: 'Fintech / Data', image: '' },
    { id: 2, title: 'Aether', category: 'AI / Voice', image: '' },
    { id: 3, title: 'Lumina', category: 'Health / Wearable', image: '' },
    { id: 4, title: 'Chronos', category: 'Productivity', image: '' },
];

const Gallery = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    // Parallax effects for different columns
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <section
            id="work"
            ref={containerRef}
            className="gallery-grid"
            style={{ position: 'relative' }}
        >
            <div className="column-left">
                <motion.div style={{ y: y1 }}>
                    <ProjectCard {...projects[0]} index={0} />
                </motion.div>
                <motion.div style={{ y: y1 }}>
                    <ProjectCard {...projects[2]} index={2} />
                </motion.div>
            </div>

            <div className="column-right">
                <motion.div style={{ y: y2 }}>
                    <ProjectCard {...projects[1]} index={1} />
                </motion.div>
                <motion.div style={{ y: y2 }}>
                    <ProjectCard {...projects[3]} index={3} />
                </motion.div>
            </div>
        </section>
    );
};

export default Gallery;
