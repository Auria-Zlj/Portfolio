import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.08)', // Subtle tint
            // backdrop-filter removed - glass effect handled by parent shader layer
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: 0 }}>AURIA ZHANG</h2>
                    <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Product Designer based in San Francisco.</p>
                </div>

                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1rem' }}>Social</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="#" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>LinkedIn</a>
                            <a href="#" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Twitter</a>
                            <a href="#" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Instagram</a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="mailto:hello@auria.design" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>hello@auria.design</a>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.5 }}>
                <span>© {new Date().getFullYear()} Auria Zhang. All Rights Reserved.</span>
                <span>Liquid Logic Portfolio</span>
            </div>
        </footer>
    );
};

export default Footer;
