export function TextShimmer({ children, className = '', duration = 1.2, style = {} }) {
    return (
        <span
            className={`text-shimmer ${className}`.trim()}
            style={{
                '--ts-duration': `${duration}s`,
                ...style,
            }}
        >
            {children}
        </span>
    );
}

