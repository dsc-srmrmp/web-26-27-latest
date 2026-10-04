import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export default function ThreeDscCanvas({ className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

    const camera = new THREE.PerspectiveCamera(58, width / height, 1, 2000);
    camera.position.z = 580;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background to layer with SideRays
    container.appendChild(renderer.domElement);

    // 1. Particle Cloud (Glowing Dust)
    const particleCount = window.innerWidth < 768 ? 600 : 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);

    const mintColor = new THREE.Color('#1dd1a1');
    const cyanColor = new THREE.Color('#00f2fe');
    const deepTeal = new THREE.Color('#0f382c');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 120 + Math.pow(Math.random(), 1.5) * 650;
      const angle = Math.random() * Math.PI * 2;
      const zSpread = (Math.random() - 0.5) * 550;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius * 0.7;
      positions[i3 + 2] = zSpread;

      basePositions[i3] = positions[i3];
      basePositions[i3 + 1] = positions[i3 + 1];
      basePositions[i3 + 2] = positions[i3 + 2];

      const mix = Math.random();
      const pColor = mix < 0.6 ? mintColor.clone().lerp(cyanColor, mix * 1.6) : cyanColor.clone().lerp(deepTeal, (mix - 0.6) * 2.5);

      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glowing particle sprite texture
    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      if (!pCtx) return null;

      const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.25, 'rgba(29, 209, 161, 0.85)');
      gradient.addColorStop(0.6, 'rgba(0, 242, 254, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();

    const particleMaterial = new THREE.PointsMaterial({
      size: 4.2,
      vertexColors: true,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 2. 3D Constellation Network Nodes & Dynamic Connecting Lines
    const nodeCount = window.innerWidth < 768 ? 45 : 85;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      nodePositions[i3] = (Math.random() - 0.5) * 850;
      nodePositions[i3 + 1] = (Math.random() - 0.5) * 550;
      nodePositions[i3 + 2] = (Math.random() - 0.5) * 350;

      nodeVelocities[i3] = (Math.random() - 0.5) * 0.45;
      nodeVelocities[i3 + 1] = (Math.random() - 0.5) * 0.45;
      nodeVelocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      size: 6,
      color: 0x1dd1a1,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const networkNodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(networkNodes);

    // Dynamic Line Segments connecting close nodes
    const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Mouse Parallax tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouse.targetX = (e.clientX - windowHalfX) * 0.0006;
      mouse.targetY = (e.clientY - windowHalfY) * 0.0006;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Passive Scroll Tracking with smooth interpolation
    let targetScroll = 0;
    let smoothScroll = 0;

    const calcScroll = () => {
      const heroHeight = container ? container.clientHeight : (window.innerHeight || 800);
      return Math.min(1, Math.max(0, (window.scrollY || 0) / Math.max(heroHeight, 1)));
    };

    targetScroll = calcScroll();
    smoothScroll = targetScroll;

    const onScroll = () => {
      targetScroll = calcScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp (momentum in both directions)
      smoothScroll += (targetScroll - smoothScroll) * 0.08;

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Gentle ambient 3D rotation with mouse tilt
      particles.rotation.y = elapsedTime * 0.03 + mouse.x * 0.8;
      particles.rotation.x = elapsedTime * 0.015 + mouse.y * 0.8;

      networkNodes.rotation.y = elapsedTime * 0.025 + mouse.x * 0.9;
      networkNodes.rotation.x = elapsedTime * 0.012 + mouse.y * 0.9;

      lineSegments.rotation.y = networkNodes.rotation.y;
      lineSegments.rotation.x = networkNodes.rotation.x;

      // Camera push-through warp on scroll (smooth 3D depth)
      camera.position.z = 580 - smoothScroll * 380;
      camera.position.y = -smoothScroll * 80;

      // Update network node positions & connect nearby points with lines
      let lineIndex = 0;
      const maxDistance = window.innerWidth < 768 ? 120 : 150;

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        nodePositions[i3] += nodeVelocities[i3];
        nodePositions[i3 + 1] += nodeVelocities[i3 + 1];
        nodePositions[i3 + 2] += nodeVelocities[i3 + 2];

        // Soft boundary reflection
        if (Math.abs(nodePositions[i3]) > 420) nodeVelocities[i3] *= -1;
        if (Math.abs(nodePositions[i3 + 1]) > 270) nodeVelocities[i3 + 1] *= -1;
        if (Math.abs(nodePositions[i3 + 2]) > 200) nodeVelocities[i3 + 2] *= -1;

        for (let j = i + 1; j < nodeCount; j++) {
          const j3 = j * 3;
          const dx = nodePositions[i3] - nodePositions[j3];
          const dy = nodePositions[i3 + 1] - nodePositions[j3 + 1];
          const dz = nodePositions[i3 + 2] - nodePositions[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            const li = lineIndex * 6;

            linePositions[li] = nodePositions[i3];
            linePositions[li + 1] = nodePositions[i3 + 1];
            linePositions[li + 2] = nodePositions[i3 + 2];

            linePositions[li + 3] = nodePositions[j3];
            linePositions[li + 4] = nodePositions[j3 + 1];
            linePositions[li + 5] = nodePositions[j3 + 2];

            // Color gradient between mint and cyan
            lineColors[li] = 0.11 * alpha;     // mint r
            lineColors[li + 1] = 0.82 * alpha; // mint g
            lineColors[li + 2] = 0.63 * alpha; // mint b

            lineColors[li + 3] = 0.0 * alpha;  // cyan r
            lineColors[li + 4] = 0.95 * alpha; // cyan g
            lineColors[li + 5] = 1.0 * alpha;  // cyan b

            lineIndex++;
          }
        }
      }

      (nodeGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex * 2);
      (lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      // Particle scatter on scroll
      const particlePosAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const pArr = particlePosAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i += 4) {
        const i3 = i * 3;
        const wave = Math.sin(elapsedTime * 1.2 + basePositions[i3] * 0.01) * 3;
        pArr[i3 + 1] = basePositions[i3 + 1] + wave;

        if (scroll > 0.01) {
          const factor = 1 + scroll * 0.75;
          pArr[i3] = basePositions[i3] * factor;
          pArr[i3 + 2] = basePositions[i3 + 2] - scroll * 180;
        } else {
          pArr[i3] = basePositions[i3];
          pArr[i3 + 2] = basePositions[i3 + 2];
        }
      }
      particlePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);

      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      if (particleTexture) particleTexture.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
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
