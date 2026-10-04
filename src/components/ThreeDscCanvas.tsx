import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  scrollProgress?: number; // 0 to 1
  className?: string;
}

export default function ThreeDscCanvas({ scrollProgress = 0, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL support
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) return;
    } catch {
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to show background SideRays gradient
    container.appendChild(renderer.domElement);

    // Particle Constellation Configuration
    const particleCount = window.innerWidth < 768 ? 900 : 1800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const mintColor = new THREE.Color('#1dd1a1');
    const cyanColor = new THREE.Color('#00f2fe');
    const deepTealColor = new THREE.Color('#10ac84');

    // Create 3D galaxy / constellation cluster
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Cylinder / disc distribution concentrated around center with depth
      const radius = 100 + Math.pow(Math.random(), 1.6) * 650;
      const angle = Math.random() * Math.PI * 2;
      const zSpread = (Math.random() - 0.5) * 600;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.sin(angle) * radius) * 0.65; // Slightly elliptical
      positions[i3 + 2] = zSpread;

      basePositions[i3] = positions[i3];
      basePositions[i3 + 1] = positions[i3 + 1];
      basePositions[i3 + 2] = positions[i3 + 2];

      // Color interpolation
      const mixRatio = Math.random();
      const pColor = mixRatio < 0.55 ? mintColor.clone().lerp(cyanColor, mixRatio * 2) : cyanColor.clone().lerp(deepTealColor, (mixRatio - 0.55) * 2);

      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;

      scales[i] = Math.random() * 2.5 + 1.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create circular glowing particle sprite via canvas
    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      if (!pCtx) return null;

      const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(29, 209, 161, 0.8)');
      gradient.addColorStop(0.65, 'rgba(0, 242, 254, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Dynamic Central 3D Cybernetic Rings (encircling the DSC centerpiece)
    const ringGroup = new THREE.Group();

    const ringGeo1 = new THREE.TorusGeometry(260, 1.2, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x1dd1a1,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.8;
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(320, 0.8, 12, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.2;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    scene.add(ringGroup);

    // Mouse Parallax & Gyro tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouse.targetX = (e.clientX - windowHalfX) * 0.0008;
      mouse.targetY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const scroll = scrollRef.current || 0;

      // Mouse Lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Ambient Rotation + Mouse Tilt
      particles.rotation.y = elapsedTime * 0.04 + mouse.x * 1.2;
      particles.rotation.x = elapsedTime * 0.02 + mouse.y * 1.2;

      ringGroup.rotation.z = elapsedTime * 0.08;
      ringGroup.rotation.y = elapsedTime * 0.06 + mouse.x * 0.8;
      ringGroup.rotation.x = Math.PI / 3 + mouse.y * 0.8;

      // Dynamic Scroll Warping & Camera Push-through:
      // As scroll increases (0 -> 1), camera moves forward into the constellation
      // and rings expand outward into deep space
      camera.position.z = 600 - scroll * 450;
      camera.position.y = -scroll * 120;

      const ringScale = 1 + scroll * 1.8;
      ringGroup.scale.set(ringScale, ringScale, ringScale);
      ringMat1.opacity = Math.max(0, 0.22 - scroll * 0.25);
      ringMat2.opacity = Math.max(0, 0.16 - scroll * 0.2);

      // Subtle breathing wave on particle positions
      const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = positionAttr.array as Float32Array;

      // Accelerate / scatter slightly on scroll
      for (let i = 0; i < particleCount; i += 4) {
        const i3 = i * 3;
        const wave = Math.sin(elapsedTime * 1.2 + basePositions[i3] * 0.01) * 4;
        posArray[i3 + 1] = basePositions[i3 + 1] + wave;
        
        // Scatter outward along radial vector on scroll
        if (scroll > 0.01) {
          const scatterFactor = 1 + scroll * 0.8;
          posArray[i3] = basePositions[i3] * scatterFactor;
          posArray[i3 + 2] = basePositions[i3 + 2] - scroll * 200;
        } else {
          posArray[i3] = basePositions[i3];
          posArray[i3 + 2] = basePositions[i3 + 2];
        }
      }
      positionAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      if (particleTexture) particleTexture.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ overflow: 'hidden', zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
