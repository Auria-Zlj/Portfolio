import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColorBg;
uniform vec3 uColorAccent;
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
  float noiseVal = snoise(vUv * 2.0 + uTime * 0.15);
  
  // Create fluid, organic shapes
  float alpha = smoothstep(0.2, 0.6, noiseVal * 0.5 + 0.5);
  
  vec3 color = mix(uColorBg, uColorAccent, alpha);
  
  // Add subtle grain
  float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233) * uTime)) * 43758.5453);
  color += grain * 0.03;

  gl_FragColor = vec4(color, 1.0);
}
`;

const HeroShader = () => {
    const meshRef = useRef();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorBg: { value: new THREE.Color('#F0F0F0') }, // Off-white
            uColorAccent: { value: new THREE.Color('#00FF88') }, // Lab Green
        }),
        []
    );

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} scale={[15, 15, 1]}>
            <planeGeometry args={[1, 1, 64, 64]} />
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
