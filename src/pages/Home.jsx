import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroShader from '../components/canvas/HeroShader';
import GlassNavBar from '../components/ui/GlassNavBar';

const Home = () => {
    return (
        <>
            {/* WebGL Background */}
            <div className="canvas-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -999,
                pointerEvents: 'none'
            }}>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <HeroShader />
                    </Suspense>
                </Canvas>
            </div>

            <section className="hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 5vw', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                {/* Glass Navigation Bar */}
                <GlassNavBar />

                <div className="hero-content" style={{ zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    {/* Slogan - moved from navbar */}
                    <p style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0,
                        filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4))'
                    }}>
                        Product Designer / UX Designer
                    </p>

                    <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1, fontWeight: 300, maxWidth: '800px', margin: 0 }}>
                        Making <span style={{ fontWeight: 700 }}>complex</span> products<br />
                        feel <span style={{ fontWeight: 700 }}>simple</span>.
                    </h2>
                </div>
            </section>
        </>
    );
};

export default Home;
