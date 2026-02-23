import { useEffect, useRef } from 'react';

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map((c) => c + c).join('')
        : clean;
    const value = Number.parseInt(full, 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
}

function createParticle(width, height) {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        px: Math.random() * width,
        py: Math.random() * height,
        life: 80 + Math.random() * 260,
    };
}

export default function FlowFieldBackground({
    color = '#00A862',
    scale = 1,
    trailOpacity = 0.1,
    speed = 0.8,
    collapse = false,
}) {
    const canvasRef = useRef(null);
    const rafRef = useRef(0);
    const mouseRef = useRef({ x: -9999, y: -9999, active: false, lastMove: 0 });
    const collapseRef = useRef(false);
    const collapseStrengthRef = useRef(0);

    useEffect(() => {
        collapseRef.current = collapse;
    }, [collapse]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return undefined;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rgb = hexToRgb(color);
        let width = 0;
        let height = 0;
        let particles = [];

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round(Math.min(680, Math.max(300, (width * height) / 7200)));
            particles = Array.from({ length: count }, () => createParticle(width, height));

            ctx.fillStyle = '#F4F4F4';
            ctx.fillRect(0, 0, width, height);
        };

        const reset = (p) => {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
            p.px = p.x;
            p.py = p.y;
            p.life = 80 + Math.random() * 260;
        };

        const handlePointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

            if (inside) {
                mouseRef.current.x = x;
                mouseRef.current.y = y;
                mouseRef.current.active = true;
                mouseRef.current.lastMove = performance.now();
            } else {
                mouseRef.current.active = false;
            }
        };

        const handlePointerLeave = () => {
            mouseRef.current.active = false;
        };

        const loop = (time) => {
            const isCollapsing = collapseRef.current;
            const targetStrength = isCollapsing ? 1 : 0;
            collapseStrengthRef.current += (targetStrength - collapseStrengthRef.current) * 0.085;
            const collapseStrength = collapseStrengthRef.current;

            // Keep collapse strokes crisp by clearing more aggressively.
            const clearOpacity = isCollapsing ? Math.max(trailOpacity, 0.14) : trailOpacity;
            ctx.fillStyle = `rgba(244, 244, 244, ${clearOpacity})`;
            ctx.fillRect(0, 0, width, height);

            const t = time * 0.001 * speed;
            const flowScale = 0.0018 * scale;
            const step = 1.02 * speed;
            const mouse = mouseRef.current;
            const mouseActive = mouse.active || (time - mouse.lastMove < 140);
            const interactionRadius = Math.min(width, height) * 0.24;
            const cx = width * 0.5;
            const cy = height * 0.5;
            const collapseRadius = Math.min(width, height) * 0.52;

            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];
                p.px = p.x;
                p.py = p.y;

                const nx = p.x * flowScale;
                const ny = p.y * flowScale;

                const angle =
                    Math.sin(nx * 2.1 + t * 1.15) * 1.55 +
                    Math.cos(ny * 1.75 - t * 1.05) * 1.4 +
                    Math.sin((nx + ny) * 1.1 + t * 0.7) * 0.85;

                p.x += Math.cos(angle) * step;
                p.y += Math.sin(angle) * step;
                p.life -= 1;

                if (mouseActive) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist > 0.001 && dist < interactionRadius) {
                        const influence = 1 - dist / interactionRadius;
                        const inv = 1 / dist;
                        const attract = 0.28 * speed * influence;
                        const swirl = 0.9 * speed * influence;

                        p.x += dx * inv * attract + (-dy * inv) * swirl;
                        p.y += dy * inv * attract + (dx * inv) * swirl;
                    }
                }

                if (collapseStrength > 0.001) {
                    const dx = cx - p.x;
                    const dy = cy - p.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist > 0.001 && dist < collapseRadius) {
                        const influence = 1 - dist / collapseRadius;
                        const inv = 1 / dist;
                        const pull = (1.1 + 3.9 * influence) * speed * collapseStrength;
                        const swirl = (1.3 + 3.6 * influence) * speed * collapseStrength;

                        p.x += dx * inv * pull + (-dy * inv) * swirl * 0.42;
                        p.y += dy * inv * pull + (dx * inv) * swirl * 0.42;
                    }

                    if (dist < 10) {
                        // Re-seed near edges to create continuous "absorption stream".
                        const edge = Math.floor(Math.random() * 4);
                        if (edge === 0) {
                            p.x = Math.random() * width;
                            p.y = -10;
                        } else if (edge === 1) {
                            p.x = width + 10;
                            p.y = Math.random() * height;
                        } else if (edge === 2) {
                            p.x = Math.random() * width;
                            p.y = height + 10;
                        } else {
                            p.x = -10;
                            p.y = Math.random() * height;
                        }
                        p.px = p.x;
                        p.py = p.y;
                        p.life = 80 + Math.random() * 260;
                        continue;
                    }
                }

                if (p.x < -20 || p.y < -20 || p.x > width + 20 || p.y > height + 20 || p.life <= 0) {
                    reset(p);
                    continue;
                }

                const alpha = (0.22 + Math.random() * 0.16) + collapseStrength * (0.08 + Math.random() * 0.08);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                ctx.lineWidth = (0.9 + Math.random() * 0.8) + collapseStrength * 0.18;
                ctx.beginPath();
                ctx.moveTo(p.px, p.py);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }

            rafRef.current = window.requestAnimationFrame(loop);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave);
        rafRef.current = window.requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
            window.cancelAnimationFrame(rafRef.current);
        };
    }, [color, scale, speed, trailOpacity]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        />
    );
}
