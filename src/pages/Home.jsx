import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroShader from '../components/canvas/HeroShader';
import Gallery from '../components/layout/Gallery';

const Home = () => {
    return (
        <>
            {/* WebGL Background */}
            <div className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <HeroShader />
                    </Suspense>
                </Canvas>
            </div>

            <section className="hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5vw', position: 'relative' }}>
                <header style={{ position: 'absolute', top: '2rem', left: '5vw', right: '5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AURIA ZHANG</h1>
                    <nav>
                        <ul style={{ display: 'flex', gap: '2rem' }}>
                            <li><a href="#work">Work</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </header>

                <div className="hero-content" style={{ zIndex: 1 }}>
                    <p style={{ fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.7 }}>Product Designer / UX Designer</p>
                    <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.1, fontWeight: 300, maxWidth: '800px' }}>
                        Making <span style={{ fontWeight: 700 }}>complex</span> products<br />
                        feel <span style={{ fontWeight: 700 }}>simple</span>.
                    </h2>
                </div>
            </section>

            <Gallery />
        </>
    );
};

export default Home;
