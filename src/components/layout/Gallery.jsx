import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import Footer from './Footer';
import Home from '../../pages/Home';

import preloPreview from '../../assets/images/prelo_preview.png';

const projects = [
    { id: 1, title: 'Prelo', category: 'Fintech / Data', image: preloPreview },
    { id: 2, title: 'Aether', category: 'AI / Voice', image: '' },
    { id: 3, title: 'Lumina', category: 'Health / Wearable', image: '' },
    { id: 4, title: 'Chronos', category: 'Productivity', image: '' },
];

const StickyCardWrapper = ({ children, index, total }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start start', 'end start']
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

    const isLast = index === total - 1;

    return (
        <motion.div
            ref={cardRef}
            style={{
                position: 'relative',
                width: '100vw',
                height: '100dvh',
                background: 'rgba(255, 255, 255, 0.05)', // Subtle base tint
                // Removed backdrop-filter - now handled by shader
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 -10px 50px rgba(0,0,0,0.02)',
                zIndex: index + 1,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                overflow: 'hidden' // Prevent shader overflow
            }}
        >
            {/* Content Layer */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {children}
            </div>
        </motion.div>
    );
};

const Gallery = () => {
    const containerRef = useRef(null);
    const [currentCard, setCurrentCard] = useState(0);
    const isScrolling = useRef(false);
    const totalCards = 1 + 1 + projects.length + 1; // Home + Selected Works + project cards + footer

    useEffect(() => {
        const handleWheel = (e) => {
            // Intercept all scrolling since Home is now inside Gallery
            const scrollY = window.scrollY;
            const galleryStart = 0; // Gallery starts at top
            const galleryEnd = totalCards * window.innerHeight;

            // If not in gallery area, allow normal scroll
            if (scrollY < galleryStart - 100 || scrollY > galleryEnd) {
                return;
            }

            // Prevent default scroll
            e.preventDefault();

            // If already scrolling, ignore
            if (isScrolling.current) return;

            // Determine direction
            const delta = e.deltaY;
            if (Math.abs(delta) < 5) return; // Ignore tiny scrolls

            const direction = delta > 0 ? 1 : -1;

            // Calculate current card based on scroll position (Gallery starts at 0)
            const calculatedCard = Math.round(scrollY / window.innerHeight);
            const nextCard = Math.max(0, Math.min(totalCards - 1, calculatedCard + direction));

            // If no change, return
            if (nextCard === calculatedCard) return;

            // Lock scrolling
            isScrolling.current = true;
            setCurrentCard(nextCard);

            // Scroll to the card (scroll to card index * viewport height)
            window.scrollTo({
                top: nextCard * window.innerHeight,
                behavior: 'smooth'
            });

            // Unlock after animation
            setTimeout(() => {
                isScrolling.current = false;
            }, 800);
        };

        // Add to window with passive: false
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [currentCard, totalCards]);

    return (
        <section
            id="work-gallery"
            ref={containerRef}
            style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 0,
                scrollSnapType: 'y mandatory',
                overscrollBehavior: 'contain',
                scrollPadding: 0
            }}
        >
            {/* Home - First snap point */}
            <div style={{
                width: '100vw',
                height: '100dvh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always'
            }}>
                <Home />
            </div>

            {/* Selected Works - Second snap point */}
            <div
                id="selected-works"
                style={{
                    width: '100vw',
                    height: '100dvh',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'transparent'
                }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    letterSpacing: '-0.03em',
                    marginBottom: '1rem'
                }}>
                    Selected Works <span style={{ color: 'var(--color-accent)', fontSize: '1rem', verticalAlign: 'middle' }}>●</span>
                </h2>
            </div>

            {projects.map((project, index) => (
                <StickyCardWrapper key={project.id} index={index} total={projects.length}>
                    <ProjectCard {...project} index={index} />
                </StickyCardWrapper>
            ))}

            {/* Footer - Final snap point */}
            <div style={{
                width: '100vw',
                minHeight: '60dvh', // Natural ending height
                position: 'relative',
                display: 'flex',
                background: '#0A0A0A', // Dark background to match new footer
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                zIndex: projects.length + 3
            }}>
                <Footer />
            </div>
        </section>
    );
};

export default Gallery;
