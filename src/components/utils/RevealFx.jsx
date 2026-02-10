import { motion } from 'framer-motion';

const RevealFx = ({
    children,
    delay = 0,
    duration = 0.8,
    blur = "10px",
    y = 20,
    immediate = false,
    style = {},
    className = ""
}) => {
    const isSafari =
        typeof navigator !== 'undefined' &&
        /Safari/i.test(navigator.userAgent) &&
        !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(navigator.userAgent);
    const shouldAnimateImmediately = immediate || isSafari;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: y,
                filter: `blur(${blur})`
            }}
            {...(shouldAnimateImmediately
                ? {
                    animate: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)"
                    }
                }
                : {
                    whileInView: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)"
                    },
                    viewport: { once: true, amount: 0.1 }
                })}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.16, 1, 0.3, 1] // Smooth "power2.out" style ease
            }}
            style={style}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default RevealFx;
