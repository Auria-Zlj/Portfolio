// Vertex Shader for Glass Refraction
export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader for Glass Refraction with Edge Magnification
export const fragmentShader = `
  uniform sampler2D uBackground;
  uniform sampler2D uNoiseTexture;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uRefractionStrength;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    
    // ===== 1. Edge Distortion & Magnification =====
    // Calculate distance from center for lens effect
    float dist = distance(uv, center);
    float edgeFactor = smoothstep(0.25, 0.5, dist);
    
    // Radial distortion (magnifying glass effect)
    vec2 direction = uv - center;
    float distortion = edgeFactor * uRefractionStrength;
    vec2 refractedUV = uv + direction * distortion * 0.08;
    
    // Clamp to prevent sampling outside bounds
    refractedUV = clamp(refractedUV, 0.0, 1.0);
    
    // Sample background with refraction
    vec4 bgColor = texture2D(uBackground, refractedUV);
    
    // ===== 2. Fresnel Rim Lighting =====
    // Calculate view-dependent rim intensity
    vec3 normal = vec3(0.0, 0.0, 1.0);
    vec3 viewDir = normalize(vec3(uv - center, 1.0));
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.5);
    
    // Enhanced edge glow
    float edgeGlow = smoothstep(0.35, 0.5, dist) * fresnel;
    vec3 rimLight = vec3(1.0, 1.0, 1.0) * edgeGlow * 0.4;
    
    // ===== 3. Specular Highlight (Top-Left Light Source) =====
    vec2 lightPos = vec2(0.15, 0.85); // Top-left corner
    float lightDist = distance(uv, lightPos);
    float specular = pow(max(1.0 - lightDist * 2.0, 0.0), 8.0) * 0.35;
    
    // Falloff for crisp highlight
    specular *= smoothstep(0.6, 0.1, lightDist);
    
    vec3 specularLight = vec3(1.0) * specular;
    
    // ===== 4. Noise Integration =====
    // Sample film grain
    vec2 noiseUV = uv * 3.0 + uTime * 0.0001;
    float noise = texture2D(uNoiseTexture, noiseUV).r;
    
    // Blend noise into background (embedded in glass)
    bgColor.rgb = mix(bgColor.rgb, bgColor.rgb * (0.9 + noise * 0.2), 0.25);
    
    // ===== 5. Final Composition =====
    vec3 finalColor = bgColor.rgb + rimLight + specularLight;
    
    // Very subtle base tint
    finalColor = mix(finalColor, vec3(1.0), 0.03);
    
    // Output with slight transparency
    gl_FragColor = vec4(finalColor, 0.08);
  }
`;
