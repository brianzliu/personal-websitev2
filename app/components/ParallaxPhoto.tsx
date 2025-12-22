'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const IMAGE_URL = '/me.png';
const DEPTH_URL = '/me_depth.png';
const PARALLAX_INTENSITY = 0.01;
const DITHER_SCALE = 4.0;

const ParallaxPhoto: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const targetMouseRef = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. SETUP SCENE
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 2. LOAD TEXTURES
        const loader = new THREE.TextureLoader();
        const texture = loader.load(IMAGE_URL, (tex) => {
            if (materialRef.current) {
                materialRef.current.uniforms.uImageSize.value.set(tex.image.width, tex.image.height);
            }
        });
        const depthMap = loader.load(DEPTH_URL);

        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        depthMap.minFilter = THREE.NearestFilter;
        depthMap.magFilter = THREE.NearestFilter;

        // 3. THE MAGIC SHADER
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uDepthMap: { value: depthMap },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uIntensity: { value: PARALLAX_INTENSITY },
                uResolution: { value: new THREE.Vector2(width, height) },
                uImageSize: { value: new THREE.Vector2(1, 1) }, // Default to 1x1 until loaded
                uDitherScale: { value: DITHER_SCALE }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform sampler2D uDepthMap;
                uniform vec2 uMouse;
                uniform float uIntensity;
                uniform vec2 uResolution;
                uniform vec2 uImageSize;
                uniform float uDitherScale;
                varying vec2 vUv;

                float bayer(vec2 pos) {
                    vec2 coord = floor(pos);
                    int x = int(mod(coord.x, 4.0));
                    int y = int(mod(coord.y, 4.0));
                    int index = x + y * 4;
                    
                    if(index == 0) return 0.0/16.0;  if(index == 1) return 8.0/16.0;  if(index == 2) return 2.0/16.0;  if(index == 3) return 10.0/16.0;
                    if(index == 4) return 12.0/16.0; if(index == 5) return 4.0/16.0;  if(index == 6) return 14.0/16.0; if(index == 7) return 6.0/16.0;
                    if(index == 8) return 3.0/16.0;  if(index == 9) return 11.0/16.0; if(index == 10) return 1.0/16.0; if(index == 11) return 9.0/16.0;
                    if(index == 12) return 15.0/16.0;if(index == 13) return 7.0/16.0; if(index == 14) return 13.0/16.0;if(index == 15) return 5.0/16.0;
                    return 0.0;
                }

                void main() {
                    float zoom = 0.9;

                    // Aspect Ratio Correction (Cover)
                    vec2 s = uResolution;
                    vec2 i = uImageSize;
                    float rs = s.x / s.y;
                    float ri = i.x / i.y;
                    vec2 newUv = (vUv - 0.5) * vec2(min(rs/ri, 1.0), min(ri/rs, 1.0)) * zoom + 0.5;

                    // Parallax
                    float depth = texture2D(uDepthMap, newUv).r;
                    vec2 parallaxUv = newUv - (uMouse * depth * uIntensity);
                    
                    // Boundary check to prevent streaking at edges (optional but good for 'cover')
                    if (parallaxUv.x < 0.0 || parallaxUv.x > 1.0 || parallaxUv.y < 0.0 || parallaxUv.y > 1.0) {
                        discard;
                    }

                    vec4 color = texture2D(uTexture, parallaxUv);
                    
                    // Alpha threshold: maintain transparency from original image
                    if (color.a < 0.1) {
                         gl_FragColor = vec4(0.0);
                         return;
                    }

                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    float threshold = bayer(gl_FragCoord.xy / uDitherScale);
                    
                    // Inverted Dither:
                    // If Bright (gray > threshold) -> Transparent (Alpha 0)
                    // If Dark (gray <= threshold) -> Black (Alpha 1)
                    vec4 finalColor = (gray > threshold) ? vec4(0.0) : vec4(0.0, 0.0, 0.0, 1.0);

                    gl_FragColor = finalColor;
                }
            `
        });
        materialRef.current = material;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4. INTERACTION
        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            targetMouseRef.current.set(x, y);
        };

        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            renderer.setSize(newWidth, newHeight);
            material.uniforms.uResolution.value.set(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // 5. ANIMATION LOOP
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Smooth ease-in (Lerp)
            material.uniforms.uMouse.value.x += (targetMouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
            material.uniforms.uMouse.value.y += (targetMouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // CLEANUP
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            texture.dispose();
            depthMap.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-transparent overflow-hidden" />
    );
};

export default ParallaxPhoto;
