import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProjectCard = ({ id, title, category, image, index }) => {
    return (
        <Link to={`/project/${id}`} style={{ textDecoration: 'none' }}>
            <motion.div
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    height: '600px',
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                }}
            >
                <div
                    className="card-image"
                    style={{
                        flex: 1,
                        background: `url(${image || 'https://via.placeholder.com/450x600'}) center/cover no-repeat`,
                        filter: 'grayscale(100%)',
                        transition: 'filter 0.5s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.filter = 'grayscale(0%)'}
                    onMouseLeave={(e) => e.target.style.filter = 'grayscale(100%)'}
                />
                <div className="card-info" style={{ padding: '2rem', color: 'var(--color-text)' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</h3>
                    <p style={{ fontSize: '1rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</p>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
