import { useState } from 'react';

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
                gap: hover ? 18 : 14,
                padding: '11px 4px 11px 0',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: weight,
                letterSpacing: '0.01em',
                fontFamily: '"JetBrains Mono", monospace',
                borderBottom: '1px solid rgba(255,255,255,0.55)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'gap 0.28s cubic-bezier(0.22,1,0.36,1)',
            }}
        >
            {/* Green accent dot */}
            <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00BB44',
                flexShrink: 0,
                boxShadow: hover
                    ? '0 0 12px rgba(0,187,68,0.75)'
                    : '0 0 6px rgba(0,187,68,0.35)',
                transition: 'box-shadow 0.28s cubic-bezier(0.22,1,0.36,1)',
            }} />

            {/* Label */}
            <span style={{
                marginRight: hover ? 6 : 0,
                transition: 'margin 0.28s cubic-bezier(0.22,1,0.36,1)',
            }}>
                {label}
            </span>

            {/* Arrow */}
            <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{
                    transform: hover ? 'translate(3px,-3px)' : 'none',
                    transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
                    flexShrink: 0,
                }}
            >
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </a>
    );
};

export default QuietCTA;
