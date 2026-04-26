import { useState } from 'react';

const NEON = '#E3FE7A';

const QuietCTA = ({ label = 'Get in Touch', href = 'mailto:zlinjun1@gmail.com', weight = 400 }) => {
    const [hover, setHover] = useState(false);

    return (
        <a
            href={href}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '11px 4px 11px 0',
                color: hover ? NEON : '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: weight,
                letterSpacing: '0.04em',
                fontFamily: '"JetBrains Mono", monospace',
                borderBottom: `1px solid ${hover ? NEON : 'rgba(255,255,255,0.55)'}`,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'color 0.28s, border-color 0.28s',
            }}
        >
            {/* Neon dot */}
            <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: NEON,
                flexShrink: 0,
                boxShadow: hover ? `0 0 14px ${NEON}` : `0 0 8px ${NEON}aa`,
                transition: 'box-shadow 0.28s',
            }} />

            <span>Get in Touch</span>

            {/* Diagonal arrow */}
            <svg
                width="13" height="13" viewBox="0 0 14 14" fill="none"
                style={{
                    transform: hover ? 'translate(3px,-3px)' : 'none',
                    transition: 'transform 0.28s',
                    flexShrink: 0,
                }}
            >
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </a>
    );
};

export default QuietCTA;
