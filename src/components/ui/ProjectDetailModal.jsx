import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import x1 from '../../assets/images/X1.png';
import x12 from '../../assets/images/X1.2.png';
import x13 from '../../assets/images/X1.3.png';
import preloPreview from '../../assets/images/p1.png';
import integrationFlowImage from '../../assets/images/integrationFlow.png';
import fish1Image from '../../assets/images/fish1.png';
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

const ProgressiveImage = ({ src, alt, className = '', decoding = 'async', loading = 'lazy', fetchPriority = 'auto' }) => {
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
            loading={loading}
            // @ts-ignore
            fetchpriority={fetchPriority}
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
                        } ${
                            projectKey === 'mushroommate' ? 'modal-container-wildlife' : ''
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
                                <div
                                    className="modal-card"
                                    style={{
                                        background: '#0A3121',
                                        border: 'none',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <article style={{ width: '100%', padding: '2.5rem 4rem 3rem' }}>
                                        <div style={{ maxWidth: '1080px', margin: '0 auto 56px auto' }}>
                                            <div
                                                style={{
                                                    overflow: 'hidden',
                                                    borderRadius: '16px',
                                                    background: 'rgba(255, 255, 255, 0.94)',
                                                    backdropFilter: 'blur(10px)',
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                                    minHeight: '200px'
                                                }}
                                            >
                                                <ProgressiveImage src="/image/salmon_hero.png" alt="Context and Workflow" className="modal-card-wildlife-hero-image" loading="eager" fetchPriority="high" />
                                            </div>
                                        </div>

                                        <header className="wildlife-hero-editorial">
                                            <div className="wildlife-hero-editorial__container">
                                                <p className="wildlife-hero-editorial__eyebrow">Sponsored by the Washington Department of Fish &amp; Wildlife and AWS</p>
                                                <h2 className="wildlife-hero-editorial__title">
                                                    Designing a Faster Identification Workflow
                                                    <br />
                                                    for Washington Department of Fish &amp; Wildlife
                                                </h2>
                                                <p className="wildlife-hero-editorial__lead">
                                                    A field-to-lab verification system built on AWS infrastructure to connect field upload, model prediction, and lab validation in one shared workflow. Machine learning predictions and expert review work together to support reliable origin verification and faster field decision-making. Now deployed and in active internal use at the Washington Department of Fish &amp; Wildlife.
                                                </p>

                                                <div className="wildlife-hero-editorial__meta">
                                                    <div className="wildlife-hero-editorial__meta-item">
                                                        <p className="wildlife-hero-editorial__meta-label">ROLE</p>
                                                        <p className="wildlife-hero-editorial__meta-value">
                                                            Product Designer
                                                            <br />
                                                            (Workflow Design &amp; Decision Architecture)
                                                        </p>
                                                    </div>
                                                    <div className="wildlife-hero-editorial__meta-item">
                                                        <p className="wildlife-hero-editorial__meta-label">IMPACT</p>
                                                        <p className="wildlife-hero-editorial__meta-value">~50% faster turnaround time; confidence-based routing designed to reduce mandatory expert review for up to 70% of seasonal samples</p>
                                                    </div>
                                                    <div className="wildlife-hero-editorial__meta-item">
                                                        <p className="wildlife-hero-editorial__meta-label">AUTOMATION</p>
                                                        <p className="wildlife-hero-editorial__meta-value">Confidence-based routing designed to reduce mandatory expert review for up to 70% of seasonal samples</p>
                                                    </div>
                                                    <div className="wildlife-hero-editorial__meta-item">
                                                        <p className="wildlife-hero-editorial__meta-label">STATUS</p>
                                                        <p className="wildlife-hero-editorial__meta-value wildlife-hero-editorial__meta-value--status">🟢 Shipped: Adopted by WA DFW</p>
                                                    </div>
                                                </div>

                                                <p className="wildlife-hero-editorial__note">
                                                    <em>Detailed interfaces are not shown due to the system&apos;s use in internal government workflows. This case study focuses on workflow logic, system behavior, and decision architecture.</em>
                                                </p>
                                            </div>
                                        </header>

                                        {/* fish1 full-width image */}
                                        <div style={{
                                            marginLeft: '-4rem',
                                            marginRight: '-4rem',
                                            width: 'calc(100% + 8rem)',
                                            marginBottom: '80px',
                                            minHeight: '300px'
                                        }}>
                                            <ProgressiveImage
                                                src={fish1Image}
                                                alt="Washington Fish & Wildlife fieldwork"
                                                className="modal-card-wildlife-fieldwork"
                                                loading="eager"
                                                fetchPriority="high"
                                            />
                                        </div>

                                        <section style={{ marginBottom: '120px' }}>
                                            <div style={{ maxWidth: '1080px', margin: '0 auto 56px auto' }}>
                                                <div
                                                    style={{
                                                        overflow: 'hidden',
                                                        borderRadius: '16px',
                                                        background: 'rgba(255, 255, 255, 0.94)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                                        minHeight: '200px'
                                                    }}
                                                >
                                                    <ProgressiveImage src={integrationFlowImage} alt="End-to-End Architecture" className="modal-card-wildlife-flow" loading="eager" fetchPriority="high" />
                                                </div>
                                            </div>
                                            <div style={{ maxWidth: '896px', margin: '0 auto' }}>
                                                <h3 style={{ margin: '0 0 32px', fontFamily: '"Unbounded", sans-serif', fontSize: '1.75rem', fontWeight: 620, color: '#ffffff' }}>
                                                    System Overview — End-to-End Architecture
                                                </h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                                    <p style={{ margin: 0, fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.625, color: '#d1d5db' }}>
                                                        The system is structured into three integrated layers that coordinate field-to-lab workflows:
                                                    </p>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                        {[
                                                            { title: 'Frontend Layer', desc: 'React static site hosted on Amazon S3. Features role-based portals (Field / Lab), upload validation, and result visualization.' },
                                                            { title: 'Backend / API Layer', desc: 'REST API deployed on EC2. Handles ZIP validation, triggers inference, manages state transitions, and controls routing logic.' },
                                                            { title: 'ML & Data Layer', desc: 'ML inference running on EC2. S3 stores images/overlays while DynamoDB handles predictions, confidence scores, and metadata.' }
                                                        ].map((item, index) => (
                                                            <div key={index} style={{ paddingLeft: '20px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                                <h4 style={{ margin: '0 0 8px', fontFamily: '"Unbounded", sans-serif', fontSize: '1rem', color: '#ffffff' }}>{item.title}</h4>
                                                                <p style={{ margin: 0, fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.625, color: '#d1d5db' }}>{item.desc}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section style={{ marginBottom: '120px' }}>
                                            <div style={{ maxWidth: '896px', margin: '0 auto' }}>
                                                <h3 style={{ margin: '0 0 40px', fontFamily: '"Unbounded", sans-serif', fontSize: '1.75rem', fontWeight: 620, color: '#ffffff' }}>
                                                    Decision Architecture — Confidence as Workflow Logic
                                                </h3>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '48px 40px'
                                                }}>
                                                    {[
                                                        { step: '01', title: 'Model Inference', desc: 'The ML model generates a predicted origin and a confidence score for each salmon sample.' },
                                                        { step: '02', title: 'Confidence Routing', desc: '>= 90% confidence auto-commits to the final database, while lower scores route to lab review.' },
                                                        { step: '03', title: 'HITL Review', desc: 'Lab scientists confirm or override predictions based on probability heatmaps and expert knowledge.' },
                                                        { step: '04', title: 'Continuous Training', desc: 'All overrides are written back into a structured dataset used for future model retraining cycles.' }
                                                    ].map((item, index) => (
                                                        <div key={index} style={{ borderLeft: '2px solid rgba(34, 197, 94, 0.5)', paddingLeft: '24px' }}>
                                                            <div style={{ fontFamily: '"Unbounded", sans-serif', fontSize: '0.875rem', color: 'rgba(34, 197, 94, 0.8)', marginBottom: '8px', fontWeight: 600 }}>{item.step}</div>
                                                            <h4 style={{ margin: '0 0 12px', fontFamily: '"Unbounded", sans-serif', fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
                                                                {item.title}
                                                            </h4>
                                                            <p style={{ margin: 0, fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.625, color: '#9ca3af' }}>
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        <section style={{ marginBottom: '120px' }}>
                                            <div style={{ maxWidth: '1080px', margin: '0 auto 56px auto' }}>
                                                <div
                                                    style={{
                                                        overflow: 'hidden',
                                                        borderRadius: '16px',
                                                        background: 'rgba(255, 255, 255, 0.94)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                                        minHeight: '200px'
                                                    }}
                                                >
                                                    <ProgressiveImage src="/image/salmonPipline.png" alt="Production Pipeline Integration" className="modal-card-wildlife-pipeline" loading="eager" fetchPriority="high" />
                                                </div>
                                            </div>
                                            <div style={{ maxWidth: '896px', margin: '0 auto' }}>
                                                <h3 style={{ margin: '0 0 32px', fontFamily: '"Unbounded", sans-serif', fontSize: '1.75rem', fontWeight: 620, color: '#ffffff' }}>
                                                    Integration Reality — Production Pipeline
                                                </h3>
                                                <p style={{ marginBottom: '32px', fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.625, color: '#d1d5db' }}>
                                                    This system is not a concept; it is fully deployed within internal government workflows, supporting batch uploads and role-based review visibility.
                                                </p>
                                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '32px', borderLeft: '4px solid #4f8710' }}>
                                                    <strong style={{ display: 'block', marginBottom: '12px', fontFamily: '"Unbounded", sans-serif', fontSize: '1rem', color: '#ffffff' }}>
                                                        System Capabilities
                                                    </strong>
                                                    <p style={{ margin: 0, fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.625, color: '#d1d5db' }}>
                                                        Supports batch uploads, persistent run history, role-based review visibility, structured override logging, and stable reload behavior across the pipeline.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <section style={{ marginBottom: '120px' }}>
                                            <div style={{ maxWidth: '896px', margin: '0 auto' }}>
                                                <h3 style={{ margin: '0 0 48px', fontFamily: '"Unbounded", sans-serif', fontSize: '1.75rem', fontWeight: 620, color: '#ffffff' }}>
                                                    Impact &amp; What It Demonstrates
                                                </h3>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                                                    {[
                                                        { val: '~50%', label: 'Turnaround Time Reduction' },
                                                        { val: '~70%', label: 'Auto-Processed via Confidence' },
                                                        { val: '100%', label: 'Physical to Digital Transition' }
                                                    ].map((metric, i) => (
                                                        <div key={i}>
                                                            <div style={{ fontFamily: '"Unbounded", sans-serif', fontSize: '3.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                                                                {metric.val}
                                                            </div>
                                                            <div style={{ fontFamily: '"Unbounded", sans-serif', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', tracking: '0.1em', lineHeight: 1.4 }}>
                                                                {metric.label}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '16px', padding: '40px', marginTop: '64px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <h4 style={{ margin: '0 0 20px', fontFamily: '"Unbounded", sans-serif', fontSize: '1rem', color: '#ffffff', textTransform: 'uppercase', tracking: '0.05em' }}>
                                                        Core Competencies Demonstrated
                                                    </h4>
                                                    <p style={{ margin: 0, fontFamily: '"Cabin", sans-serif', fontSize: '1.125rem', lineHeight: 1.7, color: '#d1d5db' }}>
                                                        ML product design under severe data constraints, operationalizing model confidence into workflow control logic, full-stack deployment coordination, and building a continuous learning loop from day one.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                                            <blockquote
                                                style={{
                                                    margin: 0,
                                                    paddingLeft: '1rem',
                                                    borderLeft: '4px solid #A7F3D0',
                                                    fontFamily: '"Cabin", sans-serif',
                                                    fontSize: '1rem',
                                                    fontStyle: 'italic',
                                                    lineHeight: 1.8,
                                                    color: 'rgba(209, 213, 219, 1)'
                                                }}
                                            >
                                                "AI products do not fail because the model is imperfect. They fail because the surrounding system is poorly designed."
                                            </blockquote>
                                        </div>
                                    </article>
                                </div>
                            ) : (
                                <div className="modal-card modal-card-prelo-long">
                                    <ProgressiveImage
                                        src={preloPreview}
                                        alt="Prelo long case study"
                                        className="modal-card-prelo-long-image"
                                        loading="eager"
                                        fetchPriority="high"
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
