import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassNavBar from '../components/ui/GlassNavBar';
import QuietCTA from '../components/ui/QuietCTA';

const Home = () => {
    const [heroVisible, setHeroVisible] = useState(false);
    const [eggBottom,   setEggBottom]   = useState('10%');
    const [eggKey,      setEggKey]      = useState(0);
    const [eggShowing,  setEggShowing]  = useState(false);
    const cancelRef = useRef(false);

    /* ── egg position ── */
    useEffect(() => {
        const update = () => {
            const ratio = window.innerWidth / window.innerHeight;
            const pct = Math.min(28, Math.max(10, 10 + (1.54 - ratio) * 22));
            setEggBottom(`${pct.toFixed(1)}%`);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    /* ── egg cycling ── */
    useEffect(() => {
        let alive = true;
        (async () => {
            await new Promise(r => setTimeout(r, 4800));
            while (alive) {
                setEggKey(k => k + 1); setEggShowing(true);
                await new Promise(r => setTimeout(r, 4000));
                setEggShowing(false);
                await new Promise(r => setTimeout(r, 1500));
            }
        })();
        return () => { alive = false; };
    }, []);

    /* ── main intro — driven entirely through the #page-intro-overlay DOM element ── */
    useEffect(() => {
        cancelRef.current = false;
        const overlay = document.getElementById('page-intro-overlay');

        /* reduced motion: skip straight to hero */
        if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (overlay) overlay.style.display = 'none';
            setHeroVisible(true);
            return;
        }

        /* ── inject text nodes ── */
        // Wrapper: shift the centered block upward
        const textWrap = document.createElement('div');
        Object.assign(textWrap.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
            marginTop: '-20vh',
        });
        overlay.appendChild(textWrap);

        // Overflow-hidden mask reveal — text slides up from below clip boundary
        const wrappers = [];
        const makeText = (text, size, weight, letterSpacing, targetOpacity) => {
            const clip = document.createElement('div');
            Object.assign(clip.style, {
                overflow: 'hidden',
                lineHeight: '1.25',
                padding: '0.08em 0', // small vertical breathing room so descenders aren't cut
            });

            const p = document.createElement('p');
            p.textContent = text;
            Object.assign(p.style, {
                fontFamily:    '"Outfit", system-ui, sans-serif',
                fontSize:      size,
                fontWeight:    weight,
                color:         '#0A0A0A',
                margin:        '0',
                letterSpacing: letterSpacing,
                textTransform: 'uppercase',
                opacity:       '0',
                transform:     'translateY(110%)',
                transition:    'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
                willChange:    'transform',
            });
            p.dataset.targetOpacity = targetOpacity;

            clip.appendChild(p);
            textWrap.appendChild(clip);
            wrappers.push(clip);
            return p;
        };

        const animateTextIn = (p) => {
            p.style.transform = 'translateY(0)';
            p.style.opacity   = p.dataset.targetOpacity;
        };

        const line1 = makeText('Auria Zhang',           'clamp(1rem,1.5vw,1.4rem)',    '300', '0.28em', '1');
        const line2 = makeText('Product & UX Designer', 'clamp(0.65rem,0.8vw,0.82rem)', '300', '0.22em', '0.45');

        const ids = [];
        const t = (fn, ms) => { const id = setTimeout(fn, ms); ids.push(id); };

        t(() => animateTextIn(line1), 180);
        t(() => animateTextIn(line2), 480);
        t(() => startCircleReveal(overlay), 1100);

        return () => {
            cancelRef.current = true;
            ids.forEach(clearTimeout);
            wrappers.forEach(w => { if (w.parentNode === textWrap) textWrap.removeChild(w); });
            if (textWrap.parentNode === overlay) overlay.removeChild(textWrap);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── circle reveal — single continuous rAF, no inter-phase gaps ── */
    const startCircleReveal = (overlay) => {
        const maxR   = Math.hypot(window.innerWidth, window.innerHeight) * 1.15;
        const smallR = Math.min(window.innerWidth, window.innerHeight) * 0.17;

        // Timeline (ms): punch in → hold → expand
        const P1  = 700;   // phase 1 end: 0 → smallR
        const P2  = 1200;  // pause end / phase 2 start
        const END = 2300;  // phase 2 end: smallR → maxR

        const easeOut   = t => Math.sin(t * Math.PI / 2);
        const easeInOut = t => -(Math.cos(Math.PI * t) - 1) / 2;

        // Promote to compositor layer for smoother per-frame mask updates
        overlay.style.willChange = 'mask-image, -webkit-mask-image';
        overlay.style.transform  = 'translateZ(0)';

        const start = performance.now();

        const tick = (now) => {
            if (cancelRef.current) return;
            const elapsed = Math.min(now - start, END);

            let r;
            if (elapsed <= P1) {
                r = easeOut(elapsed / P1) * smallR;
            } else if (elapsed <= P2) {
                r = smallR;
            } else {
                r = smallR + easeInOut((elapsed - P2) / (END - P2)) * (maxR - smallR);
            }

            const feather = Math.min(4, r * 0.08);
            const m = `radial-gradient(circle ${r}px at 50% 78%, transparent ${Math.max(0, r - feather)}px, white ${r + feather}px)`;
            overlay.style.maskImage       = m;
            overlay.style.webkitMaskImage = m;

            // Trigger hero content 250ms before circle fully done so they overlap
            if (!cancelRef._heroFired && elapsed >= END - 250) {
                cancelRef._heroFired = true;
                if (!cancelRef.current) setHeroVisible(true);
            }

            if (elapsed < END) {
                requestAnimationFrame(tick);
            } else {
                cancelRef._heroFired = false;
                overlay.style.willChange = 'auto';
                overlay.style.display    = 'none';
                window.scrollTo({ top: 0, behavior: 'auto' });
                window.__portfolioLenis?.scrollTo(0, { immediate: true, force: true });
            }
        };

        requestAnimationFrame(tick);
    };

    return (
        <>
            <div style={{ position: 'relative' }}>

                {/* ── Hero content ── */}
                {/* Overlay is in index.html, controlled via plain DOM in useEffect above */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <section id="home" className="hero" style={{
                        height: '100vh',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'flex-start', alignItems: 'flex-start',
                        padding: '0 6vw',
                        position: 'relative', background: 'transparent',
                        zIndex: 1, color: '#fff',
                        fontFamily: '"JetBrains Mono", monospace',
                    }}>
                        <GlassNavBar visible={heroVisible} />

                        {/* Top scrim */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
                            background: 'linear-gradient(to bottom, rgba(10,24,38,0.10) 0%, rgba(10,24,38,0.04) 55%, rgba(10,24,38,0) 100%)',
                            pointerEvents: 'none', zIndex: 0,
                            opacity: heroVisible ? 1 : 0,
                        }} />

                        {/* Two-column layout — CSS opacity:0 guarantees invisible before heroVisible,
                            no JS frame delay unlike conditional rendering */}
                        <div style={{
                            position: 'absolute', top: 140, left: 0, right: 0,
                            padding: '0 6vw',
                            display: 'grid', gridTemplateColumns: '1.8fr 1fr',
                            columnGap: 100, alignItems: 'start',
                            zIndex: 1, fontFamily: '"Outfit", system-ui, sans-serif',
                            opacity: heroVisible ? 1 : 0,
                            pointerEvents: heroVisible ? 'auto' : 'none',
                        }}>
                            {/* Left column */}
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                    transition={{ type: 'spring', damping: 22, stiffness: 90, delay: heroVisible ? 0.0 : 0 }}
                                    style={{
                                        fontSize: 13, letterSpacing: '0.22em',
                                        color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase',
                                        fontFamily: '"JetBrains Mono", monospace', marginBottom: 16,
                                    }}
                                >
                                    Vol. 01 — Portfolio{' '}
                                    <span style={{ color: '#E3FE7A' }}>/ 2026</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={heroVisible ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: heroVisible ? 0.15 : 0 }}
                                    style={{
                                        width: '95%', height: 1,
                                        background: 'rgba(255,255,255,0.25)',
                                        marginBottom: 48, transformOrigin: 'left',
                                    }}
                                />

                                <h1 style={{
                                    margin: 0, fontFamily: '"Outfit", system-ui, sans-serif',
                                    fontSize: 72, fontWeight: 300, lineHeight: 1.15,
                                    letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.98)',
                                    perspective: '1000px',
                                }}>
                                    {[
                                        { text: 'Designing', bold: false },
                                        { text: 'clear', bold: false },
                                        { text: 'products', bold: false },
                                    ].map((w, i) => (
                                        <motion.span
                                            key={w.text}
                                            initial={{ opacity: 0, y: 28, rotateX: 80 }}
                                            animate={heroVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 28, rotateX: 80 }}
                                            transition={{ type: 'spring', damping: 14, stiffness: 70, delay: heroVisible ? 0.2 + i * 0.07 : 0 }}
                                            style={{ display: 'inline-block', marginRight: '0.25em', fontWeight: 300, transformOrigin: 'bottom center' }}
                                        >{w.text}</motion.span>
                                    ))}
                                    <br />
                                    {[
                                        { text: 'for', bold: false, neon: false },
                                        { text: 'complex', bold: true, neon: true },
                                        { text: 'systems.', bold: true, neon: true },
                                    ].map((w, i) => (
                                        <motion.span
                                            key={w.text}
                                            initial={{ opacity: 0, y: 28, rotateX: 80 }}
                                            animate={heroVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 28, rotateX: 80 }}
                                            transition={{ type: 'spring', damping: 14, stiffness: 70, delay: heroVisible ? 0.41 + i * 0.07 : 0 }}
                                            style={{
                                                display: 'inline-block', marginRight: '0.25em',
                                                fontWeight: w.bold ? 600 : 300,
                                                color: w.neon ? '#E3FE7A' : 'rgba(255,255,255,0.98)',
                                                textShadow: w.neon ? '0 0 32px #E3FE7A40' : 'none',
                                                transformOrigin: 'bottom center',
                                            }}
                                        >{w.text}</motion.span>
                                    ))}
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ type: 'spring', damping: 22, stiffness: 90, delay: heroVisible ? 0.7 : 0 }}
                                    style={{
                                        margin: '28px 0 0', fontFamily: '"Outfit", system-ui, sans-serif',
                                        fontSize: 18, fontWeight: 300, lineHeight: 1.5,
                                        color: 'rgba(255,255,255,0.92)', maxWidth: 760,
                                    }}
                                >
                                    I design AI-assisted and operational products where usability depends on getting the workflow, logic, and constraints right.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ type: 'spring', damping: 22, stiffness: 90, delay: heroVisible ? 0.8 : 0 }}
                                    style={{ marginTop: 36 }}
                                >
                                    <QuietCTA />
                                </motion.div>
                            </div>

                            {/* Right column — capabilities */}
                            <motion.div
                                initial={{ opacity: 0, y: 32 }}
                                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 80, delay: heroVisible ? 1.1 : 0 }}
                                style={{ paddingTop: 95, paddingLeft: 0 }}
                            >
                                <div style={{
                                    fontSize: 18, letterSpacing: '0.18em',
                                    color: '#E3FE7A', textTransform: 'uppercase',
                                    marginBottom: 32, fontFamily: '"JetBrains Mono", monospace',
                                }}>
                                    Capabilities
                                </div>

                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.30)',
                                    borderBottom: '1px solid rgba(255,255,255,0.30)',
                                    paddingRight: '15%',
                                }}>
                                    <div style={{
                                        height: 260, overflow: 'hidden',
                                        maskImage: 'linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)',
                                        cursor: 'default', pointerEvents: 'none',
                                    }}>
                                        <div style={{ animation: 'capScroll 20s linear infinite' }}>
                                            {[...Array(2)].map((_, pass) =>
                                                ['Complex Workflows', 'System Logic', 'AI-Assisted Products', 'Operational Tools', 'Implementation-Aware Design', 'Constraint-Driven UX', 'Data-Heavy Interfaces'].map((item) => (
                                                    <div key={`${pass}-${item}`} style={{
                                                        display: 'flex', alignItems: 'center',
                                                        gap: 18, padding: '12px 0', userSelect: 'none',
                                                    }}>
                                                        <span style={{
                                                            display: 'inline-block', width: 8, height: 8,
                                                            border: '2px solid #E3FE7A',
                                                            background: '#E3FE7A',
                                                            boxShadow: '0 0 10px #E3FE7A88',
                                                            flexShrink: 0,
                                                        }} />
                                                        <span style={{
                                                            fontSize: 15, fontWeight: 300,
                                                            color: 'rgba(255,255,255,0.88)',
                                                            letterSpacing: '0.02em',
                                                            fontFamily: '"JetBrains Mono", monospace',
                                                        }}>
                                                            {item}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Easter egg */}
                        {eggShowing && (
                            <div key={eggKey} className="hero-easter-egg" style={{
                                position: 'absolute', bottom: eggBottom, left: '47%',
                                display: 'inline-block', pointerEvents: 'none',
                                animation: 'eggFadeIn 0.4s ease forwards',
                            }}>
                                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{
                                        display: 'block', color: '#FFFFFF',
                                        fontFamily: '"Outfit", system-ui, sans-serif',
                                        fontWeight: 400, fontSize: '18px', letterSpacing: '0.05em',
                                        opacity: 0, animation: 'fadeInText 0.35s ease 0.9s forwards',
                                        whiteSpace: 'nowrap', marginBottom: '0.7vw', marginLeft: '8vw',
                                    }}>
                                        👋 Hello, I&apos;m Auria.
                                    </span>
                                    <svg width="11vw" height="8.2vw" viewBox="0 0 166 123" fill="none"
                                        style={{ overflow: 'visible', flexShrink: 0 }}
                                    >
                                        <path d="M1.00024 112.81C16.1669 119.143 55.6002 128.01 92.0002 112.81C128.4 97.6101 149.167 39.1434 155 11.8101"
                                            stroke="white" strokeWidth="2" strokeLinecap="round"
                                            style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'drawArrowBody 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s forwards' }}
                                        />
                                        <path d="M141 25.8101C142.167 20.1434 145.6 7.71009 150 3.31009C151.5 1.97676 155.1 -0.189911 157.5 1.81009C159.9 3.81009 161.834 9.1434 162 10.8101C164 18.0101 164.167 25.3101 164.5 28.8101"
                                            stroke="white" strokeWidth="2" strokeLinecap="round"
                                            style={{ strokeDasharray: 80, strokeDashoffset: 80, animation: 'drawArrowHead 0.25s cubic-bezier(0.4,0,0.2,1) 0.6s forwards' }}
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        <style>{`
                            @keyframes capScroll {
                                from { transform: translateY(0); }
                                to   { transform: translateY(-50%); }
                            }
                            @keyframes eggFadeIn { from { opacity:0; } to { opacity:1; } }
                            @keyframes drawArrowBody { to { stroke-dashoffset: 0; } }
                            @keyframes drawArrowHead { to { stroke-dashoffset: 0; } }
                            @keyframes fadeInText {
                                from { opacity:0; transform:translateY(4px); }
                                to   { opacity:1; transform:translateY(0); }
                            }
                            @media (max-width: 900px) { .hero-easter-egg { display: none; } }
                        `}</style>

                        {/* Based in Seattle */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 90, delay: heroVisible ? 0.1 : 0 }}
                            style={{
                                position: 'absolute', bottom: '2.4rem', left: '6vw',
                                fontSize: 12, letterSpacing: '0.18em',
                                color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase',
                                fontFamily: '"JetBrains Mono", monospace',
                                pointerEvents: 'none', zIndex: 10,
                                opacity: 0, // CSS initial — sync guarantee
                            }}
                        >
                            Based in Seattle
                        </motion.div>

                        {/* Scroll cue */}
                        <motion.div
                            animate={heroVisible
                                ? { opacity: 0.5, y: [0, 14, 0] }
                                : { opacity: 0, y: 0 }}
                            transition={{ duration: 1.75, repeat: heroVisible ? Infinity : 0, repeatType: 'loop', ease: 'easeInOut', delay: heroVisible ? 0.1 : 0 }}
                            style={{
                                position: 'absolute', bottom: '2.4rem', right: '4rem',
                                opacity: 0, // CSS initial — sync guarantee
                                pointerEvents: 'none', zIndex: 10,
                            }}
                        >
                            <svg width="36" height="110" viewBox="0 0 36 110" fill="none">
                                <line x1="18" y1="0" x2="18" y2="96" stroke="#FFFFFF" strokeWidth="2" />
                                <polyline points="8,88 18,98 28,88" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Home;
