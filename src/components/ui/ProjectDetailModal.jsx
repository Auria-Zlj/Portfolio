import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import x1 from '../../assets/images/X1.png';
import x12 from '../../assets/images/X1.2.png';
import x13 from '../../assets/images/X1.3.png';
import m2 from '../../assets/images/M2.png';
import m21 from '../../assets/images/M2.1.png';
import preloPreview from '../../assets/images/p1.png';
import './ProjectDetailModal.scss';

const getProjectKey = (project) => {
    if (!project) return null;
    const title = String(project.title || '').toLowerCase();
    if (project.id === 1 || title.includes('x-heal') || title.includes('xheal')) return 'x-heal';
    if (project.id === 3 || title.includes('mush')) return 'mushroommate';
    return 'prelo';
};

const getToneClass = (projectKey) => {
    if (projectKey === 'x-heal') return 'xheal';
    if (projectKey === 'mushroommate') return 'mushroommate';
    return 'prelo';
};

const TONE_STYLES = {
    xheal: {
        buttonColor: '#c62364',
        buttonBorder: '1px solid rgba(233, 30, 99, 0.28)',
        buttonBg: 'rgba(249, 239, 245, 0.96)',
        buttonShadow: '0 2px 10px rgba(233, 30, 99, 0.2)',
        progressTrack: 'rgba(233, 30, 99, 0.1)',
        progressFill: 'linear-gradient(180deg, rgba(233, 30, 99, 0.4) 0%, rgba(233, 30, 99, 0.7) 30%, rgba(233, 30, 99, 0.85) 50%, rgba(233, 30, 99, 0.7) 70%, rgba(233, 30, 99, 0.4) 100%)',
        progressShadow: '0 0 12px rgba(233, 30, 99, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)',
    },
    mushroommate: {
        buttonColor: '#4f8710',
        buttonBorder: '1px solid rgba(109, 174, 3, 0.28)',
        buttonBg: 'rgba(243, 248, 236, 0.96)',
        buttonShadow: '0 2px 10px rgba(109, 174, 3, 0.2)',
        progressTrack: 'rgba(109, 174, 3, 0.1)',
        progressFill: 'linear-gradient(180deg, rgba(109, 174, 3, 0.4) 0%, rgba(109, 174, 3, 0.7) 30%, rgba(109, 174, 3, 0.85) 50%, rgba(109, 174, 3, 0.7) 70%, rgba(109, 174, 3, 0.4) 100%)',
        progressShadow: '0 0 12px rgba(109, 174, 3, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)',
    },
    prelo: {
        buttonColor: '#d07a2e',
        buttonBorder: '1px solid rgba(208, 122, 46, 0.32)',
        buttonBg: 'rgba(248, 241, 233, 0.96)',
        buttonShadow: '0 2px 10px rgba(208, 122, 46, 0.18)',
        progressTrack: 'rgba(208, 122, 46, 0.1)',
        progressFill: 'linear-gradient(180deg, rgba(208, 122, 46, 0.4) 0%, rgba(208, 122, 46, 0.72) 30%, rgba(208, 122, 46, 0.9) 50%, rgba(208, 122, 46, 0.72) 70%, rgba(208, 122, 46, 0.4) 100%)',
        progressShadow: '0 0 12px rgba(208, 122, 46, 0.42), inset 0 0 8px rgba(255, 255, 255, 0.12)',
    },
};

const ProgressiveImage = ({ src, alt, className = '', decoding = 'async' }) => {
    const [loaded, setLoaded] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const imgRef = useRef(null);
    const revealTimerRef = useRef(null);

    useEffect(() => {
        setLoaded(false);
        setRevealed(false);
        if (revealTimerRef.current) {
            window.clearTimeout(revealTimerRef.current);
            revealTimerRef.current = null;
        }

        const tryReveal = () => {
            setLoaded(true);
            // Keep blur visible briefly even for cached images.
            revealTimerRef.current = window.setTimeout(() => {
                setRevealed(true);
            }, 180);
        };

        const node = imgRef.current;
        if (node && node.complete) {
            tryReveal();
        }

        return () => {
            if (revealTimerRef.current) {
                window.clearTimeout(revealTimerRef.current);
                revealTimerRef.current = null;
            }
        };
    }, [src]);

    const handleLoad = () => {
        setLoaded(true);
        if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = window.setTimeout(() => {
            setRevealed(true);
        }, 180);
    };

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            decoding={decoding}
            onLoad={handleLoad}
            onError={handleLoad}
            className={`${className} modal-media ${loaded ? 'is-loaded' : ''} ${revealed ? 'is-revealed' : ''}`.trim()}
        />
    );
};

const ProjectDetailModal = ({ project, onClose }) => {
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [progressBarStyle, setProgressBarStyle] = useState(null);
    const [closeButtonStyle, setCloseButtonStyle] = useState(null);
    const projectKey = useMemo(() => getProjectKey(project), [project]);
    const toneClass = useMemo(() => getToneClass(projectKey), [projectKey]);
    const toneStyle = TONE_STYLES[toneClass];

    useEffect(() => {
        if (!project) return undefined;
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const lenis = window.__portfolioLenis;

        if (lenis && typeof lenis.stop === 'function') {
            lenis.stop();
        }

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            if (lenis && typeof lenis.start === 'function') {
                lenis.start();
            }
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [project, onClose]);

    useEffect(() => {
        if (!projectKey) {
            setProgressBarStyle(null);
            setCloseButtonStyle(null);
            return undefined;
        }

        const updateFloatingControls = () => {
            if (!modalRef.current) return;
            const rect = modalRef.current.getBoundingClientRect();
            setProgressBarStyle({
                top: `${rect.top}px`,
                height: `${rect.height}px`,
                right: `${Math.max(10, window.innerWidth - rect.right - 12)}px`,
            });
            setCloseButtonStyle({
                top: `${rect.top + 20}px`,
                right: `${Math.max(10, window.innerWidth - rect.right + 20)}px`,
            });
        };

        updateFloatingControls();
        const timerA = window.setTimeout(updateFloatingControls, 50);
        const timerB = window.setTimeout(updateFloatingControls, 130);
        const timerC = window.setTimeout(updateFloatingControls, 260);

        const onResize = () => updateFloatingControls();
        const onScroll = () => updateFloatingControls();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, { passive: true });

        let resizeObserver = null;
        if (modalRef.current && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => updateFloatingControls());
            resizeObserver.observe(modalRef.current);
        }

        return () => {
            window.clearTimeout(timerA);
            window.clearTimeout(timerB);
            window.clearTimeout(timerC);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [projectKey]);

    useEffect(() => {
        if (!projectKey || !modalContentRef.current) return undefined;
        const node = modalContentRef.current;
        const handleScroll = () => {
            const totalScroll = node.scrollHeight - node.clientHeight;
            const progress = totalScroll > 0 ? node.scrollTop / totalScroll : 0;
            setScrollProgress(progress);
        };
        setScrollProgress(0);
        handleScroll();
        node.addEventListener('scroll', handleScroll, { passive: true });
        return () => node.removeEventListener('scroll', handleScroll);
    }, [projectKey]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {projectKey && (
                <>
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onClick={onClose}
                    />

                    <motion.button
                        className={`modal-close-button modal-close-button-${toneClass}`}
                        style={{
                            ...(closeButtonStyle || {}),
                            color: toneStyle.buttonColor,
                            border: toneStyle.buttonBorder,
                            backgroundColor: toneStyle.buttonBg,
                            boxShadow: toneStyle.buttonShadow,
                        }}
                        onClick={onClose}
                        aria-label="Close modal"
                        initial={{ opacity: 0, scale: 0.86 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.86 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', bounce: 0.42, duration: 0.45 }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.button>

                    {progressBarStyle && (
                        <motion.div
                            className={`modal-scroll-progress modal-scroll-progress-${toneClass}`}
                            style={{
                                ...(progressBarStyle || {}),
                                backgroundColor: toneStyle.progressTrack,
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 0, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                        >
                            <motion.div
                                className={`modal-scroll-progress-bar modal-scroll-progress-bar-${toneClass}`}
                                style={{
                                    transformOrigin: 'top',
                                    background: toneStyle.progressFill,
                                    boxShadow: toneStyle.progressShadow,
                                }}
                                animate={{ scaleY: scrollProgress }}
                                transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.82 }}
                            />
                        </motion.div>
                    )}

                    <motion.div
                        ref={modalRef}
                        className={`modal-container ${
                            projectKey === 'x-heal' ? 'modal-container-xheal' : ''
                        } ${
                            projectKey === 'prelo' ? 'modal-container-prelo' : ''
                        }`}
                        initial={{ opacity: 0, scale: 0.85, x: '-50%', y: '-48%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
                        transition={{ type: 'spring', bounce: 0.24, duration: 0.58, opacity: { duration: 0.28 } }}
                        style={{ position: 'fixed', top: '50%', left: '50%' }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${project.title} detail modal`}
                        data-lenis-prevent
                        data-lenis-prevent-wheel
                        data-lenis-prevent-touch
                    >
                        <div
                            className="modal-content"
                            ref={modalContentRef}
                            data-lenis-prevent
                            data-lenis-prevent-wheel
                            data-lenis-prevent-touch
                        >
                            {projectKey === 'x-heal' ? (
                                <div className="modal-card modal-card-xheal">
                                    <div className="modal-card-xheal-image-wrapper">
                                        <ProgressiveImage src={x1} alt="X-Heal" className="modal-card-xheal-image" />
                                    </div>
                                    <div className="modal-card-xheal-text">
                                        <div className="modal-card-xheal-header">
                                            <h1 className="modal-card-xheal-title">X-Heal | ACL Rehab System</h1>
                                        </div>
                                        <div className="modal-card-xheal-main-content">
                                            <p className="modal-card-xheal-description">
                                                A connected rehab system combining wearable sensors, real-time feedback,
                                                and clinician dashboards to improve post-surgery recovery.
                                            </p>
                                            <div className="modal-card-xheal-details">
                                                <div className="modal-card-xheal-section">
                                                    <h3 className="modal-card-xheal-section-title">My Role</h3>
                                                    <p className="modal-card-xheal-section-content">
                                                        Lead UX Designer & Full-Stack Developer
                                                    </p>
                                                </div>
                                                <div className="modal-card-xheal-section">
                                                    <h3 className="modal-card-xheal-section-title">Highlights</h3>
                                                    <ul className="modal-card-xheal-highlights">
                                                        <li>UX Design</li>
                                                        <li>React + Firebase</li>
                                                        <li>BLE Integration</li>
                                                        <li>IoT System Architecture</li>
                                                        <li>Sponsored by T-Mobile x UW GIX</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-card-xheal-images">
                                        <ProgressiveImage src={x12} alt="X-Heal detail 1" className="modal-card-xheal-additional-image" />
                                        <ProgressiveImage src={x13} alt="X-Heal detail 2" className="modal-card-xheal-additional-image" />
                                    </div>
                                </div>
                            ) : projectKey === 'mushroommate' ? (
                                <div className="modal-card modal-card-mushroommate">
                                    <div className="modal-card-mushroommate-images">
                                        <ProgressiveImage src={m2} alt="MushRoommate detail 1" className="modal-card-mushroommate-image" />
                                        <ProgressiveImage src={m21} alt="MushRoommate detail 2" className="modal-card-mushroommate-image" />
                                    </div>
                                </div>
                            ) : (
                                <div className="modal-card modal-card-prelo-long">
                                    <ProgressiveImage
                                        src={preloPreview}
                                        alt="Prelo long case study"
                                        className="modal-card-prelo-long-image"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProjectDetailModal;
