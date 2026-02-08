import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ClarifierCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
        },
    };

    return (
        <motion.div
            className="cursor"
            variants={variants}
            animate="default"
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5,
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '32px',
                height: '32px',
                border: '1px solid black',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
            }}
        />
    );
};

export default ClarifierCursor;
