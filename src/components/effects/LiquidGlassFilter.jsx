/**
 * LiquidGlassFilter
 * 
 * SVG filter component that creates a liquid glass displacement effect with:
 * - Refraction/displacement mapping
 * - Chromatic aberration (color fringing)
 * - Frosted glass blur
 * 
 * Inspired by: https://codepen.io/jh3y/pen/EajLxJV
 */

export const LiquidGlassFilter = ({
    id = 'liquid-glass',
    displacementScale = 20,
    turbulenceFrequency = 0.01,
    blurStrength = 8,
    aberrationOffset = 2
}) => {
    return (
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            {/* Generate procedural noise for displacement */}
            <feTurbulence
                type="fractalNoise"
                baseFrequency={turbulenceFrequency}
                numOctaves={3}
                seed={1}
                result="turbulence"
            />

            {/* Create displacement map channels */}
            <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale={displacementScale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
            />

            {/* Chromatic Aberration - Red Channel */}
            <feOffset
                in="displaced"
                dx={aberrationOffset}
                dy={0}
                result="redShift"
            />
            <feColorMatrix
                in="redShift"
                type="matrix"
                values="1 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="redChannel"
            />

            {/* Chromatic Aberration - Green Channel (no shift) */}
            <feColorMatrix
                in="displaced"
                type="matrix"
                values="0 0 0 0 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
                result="greenChannel"
            />

            {/* Chromatic Aberration - Blue Channel */}
            <feOffset
                in="displaced"
                dx={-aberrationOffset}
                dy={0}
                result="blueShift"
            />
            <feColorMatrix
                in="blueShift"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="blueChannel"
            />

            {/* Combine RGB channels */}
            <feBlend in="redChannel" in2="greenChannel" mode="screen" result="rg" />
            <feBlend in="rg" in2="blueChannel" mode="screen" result="chromatic" />

            {/* Add frosted glass blur */}
            <feGaussianBlur
                in="chromatic"
                stdDeviation={blurStrength}
                result="blurred"
            />

            {/* Composite everything together */}
            <feComposite
                in="blurred"
                in2="SourceAlpha"
                operator="in"
                result="final"
            />
        </filter>
    );
};

export default LiquidGlassFilter;
