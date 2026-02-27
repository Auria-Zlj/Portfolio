import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPos;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vPos = pos;
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColorBg;
uniform vec3 uColorAccent;
uniform vec3 uColorDim;
uniform vec3 uColorCoreDark;
uniform vec3 uGrainTint;
uniform float uGrainAmount;
uniform float uGrainTintStrength;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Keep lens center stable across section transitions to avoid scroll-triggered jumps.
  vec2 mouse = vec2(0.56, 0.54);
  float dist = distance(vUv, mouse);

  // --- LENS LOGIC ---
  // If close to mouse, we want SHARPNESS. If far, we want BLUR/DISTORTION.
  // In a shader, we can simulate "blur" by lowering contrast or mixing noise layers more chaotically.
  // We can simulate "sharpness" by high contrast and defined shapes.

  float lensRadius = 0.35;
  float focus = 1.0 - smoothstep(0.0, lensRadius, dist); // 1.0 at center, 0.0 at edge

  // --- ORGANIC MESH ---
  // Layer 1: Base Flow - LOW FREQUENCY for LARGE, FEWER shapes
  float n1 = snoise(vUv * 0.85 + uTime * 0.05); // Lower frequency = Fewer blobs
  // Layer 2: Detail
  float n2 = snoise(vUv * 2.0 - uTime * 0.1); // Reduced detail freq

  // Mix noise based on focus
  // Focused: Crisp, defined shapes. Unfocused: Washed out, blended.
  float finalNoise = mix(n1 * 0.5 + 0.5, n1 * 0.7 + n2 * 0.3 + 0.2, focus);
  
  // Contrast adjustment
  // Unfocused: Low contrast (foggy). Focused: High contrast (sharp).
  float contrast = mix(0.8, 2.5, focus);
  finalNoise = (finalNoise - 0.5) * contrast + 0.5;
  
  // Color Mixing
  // Background is White. Shapes are Green.
  vec3 greenGrad = mix(uColorDim, uColorAccent, n1); // two-tone base

  // Third green tone: a small darker core that keeps drifting over time.
  vec2 coreCenter = vec2(
    0.59 + 0.08 * sin(uTime * 0.11),
    0.66 + 0.07 * cos(uTime * 0.09)
  );
  float coreDist = distance(vUv, coreCenter);
  float edgeWarp = snoise(vUv * 3.0 + uTime * 0.12) * 0.03;
  float coreMask = 1.0 - smoothstep(0.06 + edgeWarp, 0.20 + edgeWarp, coreDist);
  vec3 greenTriTone = mix(greenGrad, uColorCoreDark, coreMask * 0.68);
  
  // Alpha/Intensity
  // We want the green to appear as "clouds" or "liquid" on white.
  // Reduced edgeSharpness range to 0.2 (from 0.4) for cleaner edges
  float edgeSharpness = mix(0.2, 0.01, focus); 
  // INCREASED THRESHOLD to 0.72 to make the blobs smaller and sparser
  float shapeAlpha = smoothstep(0.72, 0.72 + edgeSharpness, finalNoise);

  // Add Grain/Noise (Static) for texture - COARSER / ROUGHER
  // We pixelate the UVs for the grain to make the "dots" bigger
  vec2 grainUv = floor(vUv * 1500.0) / 1500.0; // higher value = finer grain
  float grainNode = fract(sin(dot(grainUv + uTime * 10.0, vec2(12.9898, 78.233))) * 43758.5453);
  
  // Apply grain ONLY to the green shapes
  // We mix the grain into the green gradient BEFORE blending with the background
  vec3 noisyGreen = greenTriTone - vec3(grainNode * 0.1); // slightly softer grain contrast
  
  vec3 finalColor = mix(uColorBg, noisyGreen, shapeAlpha);

  // Tinted grain: user-controllable color and amount, keeps same flow/layout.
  float grainBase = fract(sin(dot(grainUv + uTime * 2.8, vec2(61.73, 29.47))) * 91823.71) - 0.5;
  vec3 neutralGrain = vec3(grainBase);
  vec3 tintedGrain = neutralGrain * uGrainTint;
  vec3 grainColor = mix(neutralGrain, tintedGrain, uGrainTintStrength);
  finalColor += grainColor * (uGrainAmount * shapeAlpha);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const HeroShader = () => {
    const meshRef = useRef();
    const { viewport } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uColorBg: { value: new THREE.Color('#F4F4F4') }, // Off-White
            uColorAccent: { value: new THREE.Color('#00A862') }, // Lighter Forest Green
            uColorDim: { value: new THREE.Color('#5AEE90') }, // Light Green
            uColorCoreDark: { value: new THREE.Color('#1B6B42') }, // Darker inner green core
            uGrainTint: { value: new THREE.Color('#6fcf97') }, // set grain hue here
            uGrainAmount: { value: 0.05 }, // overall grain intensity
            uGrainTintStrength: { value: 0.9 }, // 0=gray grain, 1=full tint
        }),
        []
    );

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
            meshRef.current.material.uniforms.uMouse.value.set(0.12, 0.08);
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 128, 128]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
            />
        </mesh>
    );
};

export default HeroShader;
