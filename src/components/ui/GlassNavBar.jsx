import LiquidGlassFilter from '../effects/LiquidGlassFilter';

const GlassNavBar = () => {
    const navLinks = [
        { label: 'Projects', href: '#work' },
        { label: 'About', href: '#about' },
    ];

    const socialLinks = [
        { label: 'Contact', href: '#contact' },
        { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    ];

    return (
        <>
            {/* Glass Navigation Bar */}
            <nav
                style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    padding: '1.2rem 3rem',
                    borderRadius: '50px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(25px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '3rem',
                    minWidth: 'fit-content'
                }}
            >
                {/* Left Navigation */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {navLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.href}
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                textDecoration: 'none',
                                transition: 'opacity 0.2s',
                                opacity: 0.7
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '1'}
                            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Center - Name */}
                <h1
                    style={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: '0.05em',
                        color: '#000000',
                        textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    AURIA ZHANG
                </h1>

                {/* Right Navigation */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {socialLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                textDecoration: 'none',
                                transition: 'opacity 0.2s',
                                opacity: 0.7
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '1'}
                            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default GlassNavBar;
