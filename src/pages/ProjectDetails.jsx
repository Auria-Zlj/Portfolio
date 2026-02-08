import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
    const { id } = useParams();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '5vw', paddingTop: '15vh', minHeight: '100vh', background: '#fff' }}
        >
            <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', opacity: 0.6 }}>&larr; Back to Home</Link>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Project {id}</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
                Detailed case study content will go here. This page would feature high-impact imagery,
                design process documentation, and interactive prototypes.
            </p>

            <div style={{ marginTop: '4rem', height: '50vh', background: '#f0f0f0', borderRadius: '20px' }} />
        </motion.div>
    );
};

export default ProjectDetails;
