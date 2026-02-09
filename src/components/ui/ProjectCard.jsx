import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProjectCard = ({ id, title, category, image, index }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Zoom Out Effect for the Image Card
    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 1.3,
            filter: "blur(10px)"
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 60,
                damping: 20,
                duration: 1.2
            }
        }
    };

    // Text Slide/Fade Variants
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
        }
    };

    return (
        <Link
            to={`/project/${id}`}
            style={{
                textDecoration: 'none',
                width: '100%',
                minWidth: isMobile ? 'auto' : '90vw',  // Force expansion on desktop
                maxWidth: isMobile ? '100%' : '90vw',  // Use more screen width on desktop
                margin: '0 auto',
                display: 'flex',
                flexDirection: isMobile ? 'column' : (index % 2 === 1 ? 'row-reverse' : 'row'), // Stack on mobile
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '2rem' : '8%',
                padding: isMobile ? '0 1rem' : '0 4rem'  // More horizontal padding
            }}
        >
            <motion.div
                className="project-card-visual"
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ scale: 1.02 }}
                style={{
                    width: isMobile ? '100%' : 'auto',
                    flex: isMobile ? 'none' : '1.8',  // Increase from 1.4 to 1.8 for more emphasis
                    height: isMobile ? '40vh' : '60vh', // Increase from 55vh to 60vh
                    maxHeight: '650px',  // Increase from 600px
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: `url(${image || 'https://via.placeholder.com/800x600/e0e0e0/00BB44?text=' + title}) center/cover no-repeat`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                />
            </motion.div>

            {/* Text Information Section */}
            <motion.div
                className="project-info"
                initial="hidden"
                whileInView="visible"
                variants={textVariants}
                viewport={{ once: false, amount: 0.3 }}
                style={{
                    width: isMobile ? '100%' : 'auto',
                    flex: isMobile ? 'none' : '1',
                    textAlign: isMobile ? 'left' : 'left',
                    color: 'var(--color-text)'
                }}
            >
                <h3 style={{
                    fontSize: isMobile ? '2.5rem' : '3.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                    margin: '0 0 1rem 0',
                    lineHeight: 1
                }}>
                    {title}
                </h3>
                <div style={{
                    display: 'inline-block',
                    padding: '0.4rem 0.8rem',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '50px',
                    color: 'var(--color-accent)',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    {category}
                </div>
                <p style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    lineHeight: '1.6',
                    opacity: 0.7,
                    maxWidth: isMobile ? '100%' : '400px',
                    margin: '0'
                }}>
                    A strategic exploration of user-centric design principles, focusing on intuitive navigation and visual hierarchy to enhance engagement.
                </p>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
