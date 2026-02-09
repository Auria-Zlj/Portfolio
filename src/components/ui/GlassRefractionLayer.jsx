import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../../shaders/glassRefraction';
import { generateNoiseTexture } from '../../utils/textureUtils';

const GlassRefractionLayer = ({
    refractionStrength = 0.8,
    style = {},
    className = ''
}) => {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const materialRef = useRef(null);
    const animationFrameRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });

    // Generate noise texture once
    const noiseTexture = useMemo(() => {
        const canvas = generateNoiseTexture(512);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initialize Three.js renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Setup scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Setup orthographic camera
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        cameraRef.current = camera;

        // Create background render target to capture what's behind
        const bgTexture = new THREE.Texture();
        bgTexture.needsUpdate = true;

        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uBackground: { value: bgTexture },
                uNoiseTexture: { value: noiseTexture },
                uResolution: { value: new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uTime: { value: 0 },
                uRefractionStrength: { value: refractionStrength }
            },
            transparent: true,
            side: THREE.DoubleSide
        });
        materialRef.current = material;

        // Create plane mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Capture background content
        const captureBackground = () => {
            // For now, create a simple gradient texture as background
            // In production, this would capture the actual background via readPixels or render target
            const gradientCanvas = document.createElement('canvas');
            gradientCanvas.width = 512;
            gradientCanvas.height = 512;
            const ctx = gradientCanvas.getContext('2d');

            const gradient = ctx.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, '#e8f5e9');
            gradient.addColorStop(1, '#c8e6c9');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);

            const texture = new THREE.CanvasTexture(gradientCanvas);
            material.uniforms.uBackground.value = texture;
        };

        captureBackground();

        // Mouse tracking
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: 1.0 - (e.clientY - rect.top) / rect.height
            };
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            material.uniforms.uTime.value += 0.01;
            material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            renderer.setSize(width, height);
            material.uniforms.uResolution.value.set(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            noiseTexture.dispose();
        };
    }, [noiseTexture, refractionStrength]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                ...style
            }}
        />
    );
};

export default GlassRefractionLayer;
