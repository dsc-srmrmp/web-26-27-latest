import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DepthText from './DepthText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhotoCard {
  id: number;
  title: string;
  category: string;
  img: string;
}

const CARDS: PhotoCard[] = [
  {
    id: 1,
    title: 'Hackcelerate Hackathon',
    category: 'FLAGSHIP',
    img: '/gallery/hackathon.png',
  },
  {
    id: 2,
    title: 'Hands-on Workshops',
    category: 'TECHNICAL',
    img: '/gallery/workshop.png',
  },
  {
    id: 3,
    title: 'DSC Community & Culture',
    category: 'CORE',
    img: '/gallery/community.png',
  },
  {
    id: 4,
    title: 'DevSummit Awards & Laurels',
    category: 'EXCELLENCE',
    img: '/gallery/awards.png',
  },
  {
    id: 5,
    title: 'Creative UI/UX Design Jams',
    category: 'CREATIVES',
    img: '/gallery/design.png',
  },
  {
    id: 6,
    title: 'Industry Mentorship Sessions',
    category: 'CAREERS',
    img: '/gallery/networking.png',
  },
  {
    id: 7,
    title: '24h Hackathon Auditorium',
    category: 'SPRINTS',
    img: '/about/hackcelerate.jpg',
  },
  {
    id: 8,
    title: 'TechnoRally Keynote Stage',
    category: 'EVENTS',
    img: '/about/technorally.jpg',
  },
  {
    id: 9,
    title: 'IdeaTech Pitch Showcase',
    category: 'INNOVATION',
    img: '/about/ideatech.jpg',
  },
  {
    id: 10,
    title: 'CodeNites Night Hack',
    category: 'OPEN SOURCE',
    img: '/showcase/codenites_showcase.jpg',
  },
];

export default function CylinderGallery3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const text3DRef = useRef<HTMLDivElement>(null);

  // Interaction physics state
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Mouse tilt
  const tiltXRef = useRef<number>(0);
  const tiltYRef = useRef<number>(0);

  // Responsive radius & dimensions
  const [radius, setRadius] = useState<number>(860);
  const [cardDim, setCardDim] = useState<{ w: number; h: number }>({ w: 380, h: 255 });

  const totalCards = CARDS.length;
  const angleStep = 360 / totalCards;

  // Window resize calculation
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(Math.max(420, w * 0.95));
        setCardDim({ w: 230, h: 160 });
      } else if (w < 1024) {
        setRadius(Math.max(620, w * 0.75));
        setCardDim({ w: 300, h: 205 });
      } else {
        setRadius(Math.min(960, Math.max(800, w * 0.54)));
        setCardDim({ w: 380, h: 255 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main 3D loop for inertia, auto-drift & rendering
  useEffect(() => {
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    const cards = cylinder.children;

    const renderLoop = () => {
      if (!isDraggingRef.current) {
        // Friction damping
        velocityRef.current *= 0.93;
        // Subtle ambient drift
        rotationRef.current += velocityRef.current + 0.04;
      } else {
        rotationRef.current += velocityRef.current;
        velocityRef.current = 0;
      }

      const rot = rotationRef.current;
      const currentRadius = radius;

      // Update each card's 3D transform around cylinder
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        if (!card) continue;

        // Angle in degrees
        const cardAngle = (i * angleStep + rot) % 360;
        const normalizedAngle = ((cardAngle % 360) + 360) % 360;

        // Concurrently rotateY and translateZ inwards
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${-currentRadius}px)`;

        // Depth dimming & visibility: Cards facing camera are brighter, back cards dimmer
        const rad = (normalizedAngle * Math.PI) / 180;
        const cosAngle = Math.cos(rad); // 1 = directly behind text, -1 = right in front

        // When facing viewer (cosAngle close to 1), opacity is high
        // When wrapping around front (cosAngle < 0), fade so they don't occlude center text
        if (cosAngle > 0.05) {
          const brightness = 0.55 + 0.45 * cosAngle;
          card.style.opacity = `${Math.min(1, 0.4 + 0.6 * cosAngle)}`;
          card.style.filter = `brightness(${brightness})`;
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.08';
          card.style.filter = 'brightness(0.3) blur(2px)';
          card.style.pointerEvents = 'none';
        }
      }

      // Apply subtle mouse tilt to the whole 3D stage
      cylinder.style.transform = `rotateX(${tiltXRef.current}deg) rotateY(${tiltYRef.current}deg)`;

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [radius, angleStep]);

  // Pointer drag interactions
  const handlePointerDown = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    lastXRef.current = clientX;
    velocityRef.current = 0;
  }, []);

  const handlePointerMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - lastXRef.current;
    lastXRef.current = clientX;
    // Map pixels to rotation degrees
    const degDelta = delta * 0.22;
    rotationRef.current += degDelta;
    velocityRef.current = degDelta;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Mouse tilt tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const yRatio = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

    tiltYRef.current = xRatio * 6; // Max 6 deg
    tiltXRef.current = -yRatio * 5; // Max 5 deg

    if (text3DRef.current) {
      gsap.to(text3DRef.current, {
        x: xRatio * 12,
        y: yRatio * 8,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Scroll parallax scrub (smooth unpinned rotation acceleration on scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          // Additional scroll rotation
          rotationRef.current += self.getVelocity() * 0.003;
        },
      });

      // Smooth parallax fade for center text when scrolling into next section
      if (text3DRef.current) {
        gsap.to(text3DRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '60% top',
            scrub: 0.3,
          },
          scale: 0.9,
          opacity: 0,
          y: -60,
          filter: 'blur(10px)',
          ease: 'power1.out',
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="cyl-hero-container"
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
    >
      <style>{`
        .cyl-hero-container {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          background: #000000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          cursor: grab;
          perspective: 1100px;
          perspective-origin: 50% 50%;
        }

        .cyl-hero-container:active {
          cursor: grabbing;
        }

        /* Ambient spotlight behind center */
        .cyl-ambient-spot {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background:
            radial-gradient(circle 500px at 50% 50%, rgba(66, 133, 244, 0.08) 0%, transparent 65%),
            radial-gradient(circle 400px at 50% 60%, rgba(234, 67, 53, 0.06) 0%, transparent 60%);
        }

        /* 3D Cylinder Stage */
        .cyl-stage {
          position: absolute;
          width: 0;
          height: 0;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          will-change: transform;
          z-index: 2;
        }

        /* 3D Curved Photo Card */
        .cyl-card {
          position: absolute;
          top: 0;
          left: 0;
          margin-top: calc(-1 * var(--card-h) / 2);
          margin-left: calc(-1 * var(--card-w) / 2);
          width: var(--card-w);
          height: var(--card-h);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 
            0 24px 60px rgba(0, 0, 0, 0.9),
            0 0 20px rgba(255, 255, 255, 0.04);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          background: #0d0d0d;
        }

        .cyl-card:hover {
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: 
            0 30px 70px rgba(0, 0, 0, 0.95),
            0 0 35px rgba(66, 133, 244, 0.35);
        }

        .cyl-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .cyl-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
          pointer-events: none;
        }

        .cyl-card-meta {
          position: absolute;
          bottom: 14px;
          left: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          pointer-events: none;
        }

        .cyl-card-category {
          font-family: 'Inter', sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1dd1a1;
        }

        .cyl-card-title {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 6px rgba(0,0,0,0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Center Content Layer */
        .cyl-center-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 10;
          padding: 0 20px;
        }

        /* 3D Extruded Heading Block */
        .cyl-3d-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform-style: preserve-3d;
          will-change: transform;
          pointer-events: auto;
        }

        /* Top Tag */
        .cyl-top-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 20px;
        }

        .cyl-blue-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4285f4;
          box-shadow: 0 0 10px #4285f4;
        }

        /* 3D Extruded DepthText Heading */
        .cyl-depth-title {
          margin: 0;
          padding: 0;
          font-size: 0;
          line-height: 1;
        }

        /* Subtitle */
        .cyl-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.95rem, 1.8vw, 1.25rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 18px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }

        /* Three Pill CTA Buttons */
        .cyl-btn-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
          pointer-events: auto;
        }

        .cyl-pill-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(66, 133, 244, 0.5), rgba(234, 67, 53, 0.4), rgba(251, 188, 4, 0.4), rgba(52, 168, 83, 0.5));
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
          cursor: pointer;
        }

        .cyl-pill-btn:hover {
          transform: translateY(-2.5px) scale(1.035);
          box-shadow: 0 0 26px rgba(66, 133, 244, 0.45);
        }

        .cyl-pill-btn-inner {
          padding: 11px 26px;
          border-radius: 9999px;
          background: rgba(10, 10, 12, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          white-space: nowrap;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Scroll down arrow */
        .cyl-scroll-down {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          animation: cyl-bounce 2s ease-in-out infinite;
        }

        .cyl-scroll-down:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          transform: translateX(-50%) translateY(3px);
        }

        @keyframes cyl-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @media (max-width: 640px) {
          .cyl-btn-row {
            gap: 8px;
            margin-top: 24px;
          }
          .cyl-pill-btn-inner {
            padding: 8.5px 18px;
            font-size: 12px;
          }
          .cyl-top-pill {
            padding: 4px 12px;
            font-size: 9.5px;
            margin-bottom: 14px;
          }
        }
      `}</style>

      {/* Ambient background glow */}
      <div className="cyl-ambient-spot" />

      {/* 3D Curved Cylindrical Photo Amphitheater */}
      <div
        ref={cylinderRef}
        className="cyl-stage"
        style={
          {
            '--card-w': `${cardDim.w}px`,
            '--card-h': `${cardDim.h}px`,
          } as React.CSSProperties
        }
      >
        {CARDS.map((card) => (
          <div key={card.id} className="cyl-card">
            <img src={card.img} alt={card.title} className="cyl-card-img" loading="eager" />
            <div className="cyl-card-gradient" />
            <div className="cyl-card-meta">
              <span className="cyl-card-category">{card.category}</span>
              <p className="cyl-card-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Center 3D Text & Controls */}
      <div className="cyl-center-overlay">
        <div ref={text3DRef} className="cyl-3d-text-wrap">
          <h1 className="cyl-depth-title" aria-label="Developer Students Club">
            <DepthText
              lines={[
                [{ text: 'DEVELOPER' }],
                [
                  { text: 'STUDENTS' },
                  { text: 'CLUB', faceColor: '#ea4335', depthColor: '#701313' },
                ],
              ]}
              layers={34}
              depth={2.4}
              faceColor="#ffffff"
              depthColor="#262d3a"
              tilt={7.5}
              pointerTracking
              smoothing={0.14}
              perspective={950}
              autoOrbit
              orbitSpeed={0.35}
              fontSize="clamp(3.4rem, 9.6vw, 7.4rem)"
              fontWeight={400}
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="0.025em"
              shadow
            />
          </h1>

          <p className="cyl-subtitle">SRM IST Ramapuram &bull; Chennai, TN, India</p>

          <div className="cyl-btn-row">
            <a href="#contact" className="cyl-pill-btn">
              <span className="cyl-pill-btn-inner">Join Community &rarr;</span>
            </a>
            <a href="/domains" className="cyl-pill-btn">
              <span className="cyl-pill-btn-inner">Explore Domains &rarr;</span>
            </a>
            <a href="/gallery" className="cyl-pill-btn">
              <span className="cyl-pill-btn-inner">DevSummit&apos;26 &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Down Chevron Indicator */}
      <a href="#about" className="cyl-scroll-down" aria-label="Scroll down to explore">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </div>
  );
}
