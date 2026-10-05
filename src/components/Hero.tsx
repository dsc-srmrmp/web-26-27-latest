import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import DepthText from './DepthText';
import FlexCarousel, { type FlexCarouselItem, type FlexCarouselHandle } from './FlexCarousel';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_GALLERY_ITEMS: FlexCarouselItem[] = [
  {
    src: '/gallery/hackathon.png',
    alt: 'Hackcelerate Flagship Hackathon',
    title: 'Hackcelerate',
    subtitle: '36H Flagship Hackathon',
  },
  {
    src: '/gallery/workshop.png',
    alt: 'Hands-on Technical Workshops',
    title: 'Tech Workshops',
    subtitle: 'Architecture & Sprints',
  },
  {
    src: '/gallery/community.png',
    alt: 'DSC Community & Culture',
    title: 'DSC Community',
    subtitle: 'SRM IST Ramapuram',
  },
  {
    src: '/gallery/awards.png',
    alt: 'DevSummit Awards and Laurels',
    title: 'DevSummit Laurels',
    subtitle: 'Annual Tech Summit',
  },
  {
    src: '/gallery/design.png',
    alt: 'Creative UI/UX Design Jam',
    title: 'Design Jam',
    subtitle: 'Creative UI/UX Sprints',
  },
  {
    src: '/gallery/networking.png',
    alt: 'Industry Mentorship Sessions',
    title: 'Industry Connect',
    subtitle: 'Mentorship & Careers',
  },
  {
    src: '/about/hackcelerate.jpg',
    alt: 'Hackathon Auditorium Building',
    title: 'Sprint Arena',
    subtitle: 'Overnight Building',
  },
  {
    src: '/about/technorally.jpg',
    alt: 'TechnoRally Keynote Stage',
    title: 'TechnoRally Stage',
    subtitle: 'Keynote & Demos',
  },
  {
    src: '/about/ideatech.jpg',
    alt: 'IdeaTech Pitch Showcase',
    title: 'IdeaTech Showcase',
    subtitle: 'Startup Incubation',
  },
  {
    src: '/showcase/codenites_showcase.jpg',
    alt: 'CodeNites Night Hackathon',
    title: 'CodeNites',
    subtitle: 'Open Source Night Hack',
  },
];

export default function Hero() {
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const textWrapRef = useRef<HTMLDivElement | null>(null);
  const galleryStageRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<FlexCarouselHandle | null>(null);

  // Subtle interactive mouse tilt for floating text centerpiece
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!textWrapRef.current) return;
    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / innerHeight - 0.5) * 2;

    gsap.to(textWrapRef.current, {
      x: xRatio * 12,
      y: -34 + yRatio * 8,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Integrated Scroll Parallax for Text Centerpiece & Liquid WebGL Gallery
  useEffect(() => {
    const container = heroContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Hero text parallax departure (elevates, fades & blurs upward)
      if (textWrapRef.current) {
        gsap.to(textWrapRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '65% top',
            scrub: 0.35,
          },
          y: -170,
          opacity: 0,
          scale: 0.9,
          filter: 'blur(10px)',
          ease: 'power1.out',
        });
      }

      // 2. Background liquid gallery stage parallax depth (slower counter-movement)
      if (galleryStageRef.current) {
        gsap.to(galleryStageRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
          y: 90,
          scale: 1.05,
          ease: 'none',
        });
      }

      // 3. Drive carousel horizontal rotation dynamically on page scroll
      let lastProgress = 0;
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2,
        onUpdate: (self) => {
          const deltaProgress = self.progress - lastProgress;
          lastProgress = self.progress;

          const scrollDelta = deltaProgress * 420;
          const velocityDelta = self.getVelocity() * 0.04;
          const totalDelta = scrollDelta + velocityDelta;

          if (Math.abs(totalDelta) > 0.4) {
            carouselRef.current?.scrollBy(totalDelta);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div id="home" ref={heroContainerRef} className="hero-master-wrapper">
      <style>{`
        @keyframes dsc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dsc-marquee-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 38px;
          overflow: hidden;
          background: rgba(10, 15, 13, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          z-index: 150;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dsc-marquee-content {
          display: flex;
          animation: dsc-marquee 36s linear infinite;
        }
        .dsc-marquee-item {
          display: flex;
          align-items: center;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }
        .dsc-marquee-star {
          color: #1dd1a1;
          margin: 0 28px;
          font-size: 13px;
        }
        .hero-master-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          min-height: 680px;
          background: #000000;
          color: #fff;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .hero-ambient-spot {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(circle 650px at 50% 32%, rgba(66, 133, 244, 0.08) 0%, transparent 70%),
            radial-gradient(circle 520px at 50% 64%, rgba(234, 67, 53, 0.06) 0%, transparent 68%);
        }

        /* Full Hero Liquid Gallery Stage */
        .hero-gallery-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: auto;
          will-change: transform;
        }

        /* Foreground Centerpiece Overlay sitting directly OVER the gallery */
        .hero-center-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
          padding: 0 20px;
        }

        /* 3D Extruded Center Text Wrap */
        .hero-3d-text-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform: translateY(-34px);
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
          pointer-events: auto;
        }

        /* Soft ambient radial backdrop to ensure maximum contrast and legibility over photos */
        .hero-center-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(840px, 92vw);
          height: min(420px, 52vh);
          background: radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.38) 50%, transparent 100%);
          pointer-events: none;
          z-index: -1;
          filter: blur(16px);
        }

        .hero-depth-title {
          margin: 0;
          padding: 0;
          font-size: 0;
          line-height: 1;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.95rem, 1.8vw, 1.25rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 16px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.95);
        }

        .hero-btn-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .hero-pill-btn {
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

        .hero-pill-btn:hover {
          transform: translateY(-2.5px) scale(1.035);
          box-shadow: 0 0 26px rgba(66, 133, 244, 0.45);
        }

        .hero-pill-btn-inner {
          padding: 10px 24px;
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

        .hero-scroll-down {
          position: absolute;
          bottom: 20px;
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
          animation: hero-bounce 2s ease-in-out infinite;
        }

        .hero-scroll-down:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          transform: translateX(-50%) translateY(3px);
        }

        @keyframes hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (max-width: 640px) {
          .hero-3d-text-wrap {
            transform: translateY(-20px);
          }
          .hero-btn-row {
            gap: 8px;
            margin-top: 18px;
          }
          .hero-pill-btn-inner {
            padding: 8.5px 18px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* Ambient background glow */}
      <div className="hero-ambient-spot" />

      {/* Top Announcements Marquee */}
      <div className="dsc-marquee-container">
        <div className="dsc-marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="dsc-marquee-item">UPCOMING HACKATHON: DEVSUMMIT 2026</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">HANDS-ON WORKSHOPS EVERY WEDNESDAY</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">BUILDING REAL PRODUCTS • SRM IST RAMAPURAM</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">GOOGLE DEVELOPER GROUPS ON CAMPUS</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Site Navigation */}
      <Header active="home" />

      {/* Full-bleed Liquid WebGL Gallery Stage */}
      <div ref={galleryStageRef} className="hero-gallery-stage">
        <FlexCarousel
          ref={carouselRef}
          items={HERO_GALLERY_ITEMS}
          preset="liquid"
          intro="rise"
          fit="natural"
          cardHeight={0.44}
          gap={14}
          radius={16}
          squeeze={0.2}
          focusOnClick={true}
          captions={true}
          autoplay={true}
          interval={3.8}
          captureWheel={false}
        />
      </div>

      {/* Foreground Centerpiece Overlay Layered Directly OVER Gallery */}
      <div className="hero-center-overlay">
        <div ref={textWrapRef} className="hero-3d-text-wrap">
          <div className="hero-center-backdrop" />

          <h1 className="hero-depth-title" aria-label="Developer Students Club">
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
              fontSize="clamp(3.4rem, 9.6vw, 7.2rem)"
              fontWeight={400}
              fontFamily="'Bebas Neue', sans-serif"
              letterSpacing="0.025em"
              shadow
            />
          </h1>

          <p className="hero-subtitle">SRM IST Ramapuram, Chennai, TN, India</p>

          <div className="hero-btn-row">
            <a href="#contact" className="hero-pill-btn">
              <span className="hero-pill-btn-inner">Join Community &rarr;</span>
            </a>
            <a href="/domains" className="hero-pill-btn">
              <span className="hero-pill-btn-inner">Explore Domains &rarr;</span>
            </a>
            <a href="/gallery" className="hero-pill-btn">
              <span className="hero-pill-btn-inner">DevSummit&apos;26 &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Down Chevron Indicator */}
      <a href="#about" className="hero-scroll-down" aria-label="Scroll down to explore">
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
