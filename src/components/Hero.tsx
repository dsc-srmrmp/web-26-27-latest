import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import SideRays from './SideRays';
import ThreeDscCanvas from './ThreeDscCanvas';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const dscTitleRef = useRef<HTMLHeadingElement>(null);
  const dscCenterRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);

  // Mouse 3D tilt tracking for DSC centerpiece
  useEffect(() => {
    const dscCenter = dscCenterRef.current;
    if (!dscCenter) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      gsap.to(dscCenter, {
        rotationY: xPercent * 9,
        rotationX: -yPercent * 7,
        x: xPercent * 16,
        y: yPercent * 12,
        duration: 0.8,
        ease: 'power2.out',
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Entrance & ScrollTrigger Choreography (Unpinned Natural Parallax)
  useEffect(() => {
    const heroSection = heroSectionRef.current;
    const dscTitle = dscTitleRef.current;
    if (!heroSection || !dscTitle) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance animation (subtle and non-destructive)
      gsap.fromTo(
        dscTitle,
        { scale: 0.92, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.hero-fade-in',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
      );

      // 2. Responsive ScrollTrigger Parallax (Unpinned, buttery-smooth in both directions)
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        // Desktop smooth parallax scrub with explicit REST state (opacity: 1 on scroll up)
        gsap.fromTo(
          dscTitle,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          },
          {
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
              immediateRender: false,
            },
            y: 180,
            scale: 1.45,
            opacity: 0,
            filter: 'blur(14px)',
            ease: 'none',
          }
        );

        const sideBlocks = [leftBlockRef.current, rightBlockRef.current].filter(Boolean);
        if (sideBlocks.length > 0) {
          gsap.fromTo(
            sideBlocks,
            {
              y: 0,
              opacity: 1,
            },
            {
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom 35%',
                scrub: 0.3,
                immediateRender: false,
              },
              y: -80,
              opacity: 0,
              ease: 'none',
            }
          );
        }
      });

      mm.add('(max-width: 768px)', () => {
        // Mobile smooth parallax scrub
        gsap.fromTo(
          dscTitle,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          },
          {
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.3,
              immediateRender: false,
            },
            y: 70,
            scale: 1.25,
            opacity: 0,
            filter: 'blur(8px)',
            ease: 'none',
          }
        );

        if (leftBlockRef.current) {
          gsap.fromTo(
            leftBlockRef.current,
            {
              y: 0,
              opacity: 1,
            },
            {
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom 40%',
                scrub: 0.2,
                immediateRender: false,
              },
              y: -40,
              opacity: 0,
              ease: 'none',
            }
          );
        }
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="home" className="hero-master-wrapper">
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
          background: rgba(10, 15, 13, 0.9);
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

        /* Hero Container */
        .hero-master-wrapper {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          position: relative;
          font-family: 'Inter', sans-serif;
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 3D DSC Centerpiece */
        .hero-dsc-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .hero-dsc-title {
          font-family: 'Bebas Neue', 'Inter', sans-serif;
          font-weight: 400;
          font-size: clamp(10rem, 28vw, 25rem);
          line-height: 0.82;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0;
          text-shadow: 
            0 0 60px rgba(29, 209, 161, 0.28),
            0 0 120px rgba(0, 242, 254, 0.18),
            0 8px 40px rgba(0, 0, 0, 0.8);
          user-select: none;
          will-change: transform, opacity, filter;
        }

        /* Ambient Radial Backdrop Glow */
        .hero-dsc-ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(700px, 80vw);
          height: min(700px, 80vw);
          background: radial-gradient(circle at center, rgba(29, 209, 161, 0.16) 0%, rgba(0, 242, 254, 0.08) 45%, rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
          z-index: 2;
          filter: blur(40px);
        }

        /* Bottom-Left 5-Second Stranger Pitch */
        .hero-left-pitch {
          position: absolute;
          bottom: 48px;
          left: 48px;
          max-width: 480px;
          z-index: 30;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hero-pulse-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 9999px;
          background: rgba(29, 209, 161, 0.12);
          border: 1px solid rgba(29, 209, 161, 0.3);
          font-size: 12px;
          font-weight: 600;
          color: #1dd1a1;
          letter-spacing: 0.02em;
          width: fit-content;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1dd1a1;
          box-shadow: 0 0 8px #1dd1a1;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .hero-pitch-headline {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: clamp(1.2rem, 1.9vw, 1.65rem);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.015em;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.7);
        }

        .hero-pitch-support {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          margin: 0;
        }

        .hero-pitch-support strong {
          color: #1dd1a1;
          font-weight: 600;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 6px;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0b0f17;
          font-size: 13.5px;
          font-weight: 700;
          padding: 11px 22px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), 0 0 15px rgba(255, 255, 255, 0.2);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .hero-btn-primary:hover {
          background: #f0fdf4;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(29, 209, 161, 0.35);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 9999px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.35);
        }

        /* Bottom-Right Proof-It's-Alive Card */
        .hero-right-pulse {
          position: absolute;
          bottom: 48px;
          right: 48px;
          max-width: 320px;
          z-index: 30;
          pointer-events: auto;
          background: rgba(17, 23, 20, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        .pulse-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pulse-badge-flagship {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #00f2fe;
          background: rgba(0, 242, 254, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .pulse-event-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .pulse-event-meta {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          margin: 0 0 14px 0;
        }

        .pulse-stats-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 8px 14px;
        }

        .pulse-stat-item {
          display: flex;
          flex-direction: column;
        }

        .pulse-stat-num {
          font-size: 14px;
          font-weight: 700;
          color: #1dd1a1;
        }

        .pulse-stat-desc {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Mobile Layout (< 768px) */
        @media (max-width: 768px) {
          .hero-dsc-title {
            font-size: clamp(6.5rem, 24vw, 11rem);
          }
          .hero-left-pitch {
            position: absolute;
            bottom: 24px;
            left: 20px;
            right: 20px;
            max-width: 100%;
            gap: 12px;
            text-align: center;
            align-items: center;
          }
          .hero-pitch-headline {
            font-size: 1.15rem;
          }
          .hero-pitch-support {
            font-size: 12.5px;
          }
          .hero-cta-group {
            width: 100%;
            justify-content: center;
          }
          .hero-btn-primary {
            width: 100%;
            justify-content: center;
            padding: 12px 20px;
          }
          .hero-right-pulse {
            display: none; /* Keep mobile view clean and uncluttered */
          }
        }
      `}</style>

      {/* Top Ticker Marquee with DevSummit'26 & MLCP LAB 1 updates */}
      <div className="dsc-marquee-container">
        <div className="dsc-marquee-content">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="dsc-marquee-item">DEVSUMMIT&apos;26 • OCTOBER 16TH</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">EVERY WEDNESDAY SESSIONS • MLCP LAB 1</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">WEEKLY DSA &amp; PROBLEM SOLVING</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">SRM IST RAMAPURAM • CHENNAI</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      <Header active="home" />

      {/* ===== Hero Section ===== */}
      <section ref={heroSectionRef} className="hero-section">
        {/* Three.js 3D Interactive Particle Constellation */}
        <ThreeDscCanvas />

        {/* Ambient Side Rays Teal Lighting */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <SideRays
            speed={1.2}
            rayColor1="#1dd1a1"
            rayColor2="#00f2fe"
            intensity={1.1}
            spread={2.4}
            origin="top-right"
            tilt={0}
            saturation={1.4}
            blend={0.7}
            falloff={1.6}
            opacity={0.6}
          />
        </div>

        {/* Center-staged 3D DSC Letters (Primary Visual Anchor) */}
        <div ref={dscCenterRef} className="hero-dsc-center">
          <div className="hero-dsc-ambient-glow" />
          <h1 ref={dscTitleRef} className="hero-dsc-title">
            DSC
          </h1>
        </div>

        {/* Bottom-Left: 5-Second Stranger Test Headline & Primary CTA (Option A) */}
        <div ref={leftBlockRef} className="hero-left-pitch hero-fade-in hero-mobile-narrative">
          <div className="hero-pulse-pill">
            <span className="pulse-dot" />
            <span>DevSummit&apos;26 • OCT 16</span>
          </div>

          <h2 className="hero-pitch-headline">
            Stop coding alone. Build real projects, master DSA, and ship with SRM’s most active student devs.
          </h2>

          <p className="hero-pitch-support">
            No experience required. Drop in every Wednesday at <strong>MLCP LAB 1</strong> (Cloud Computing LAB).
          </p>

          <div className="hero-cta-group">
            <a href="#join" className="hero-btn-primary">
              <span>Join the Community</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="/gallery" className="hero-btn-secondary hidden sm:inline-flex">
              <span>Explore DevSummit</span>
            </a>
          </div>
        </div>

        {/* Bottom-Right: Proof It's Alive & Next Event Card (Desktop) */}
        <div ref={rightBlockRef} className="hero-right-pulse hero-fade-in hidden md:block">
          <div className="pulse-card-header">
            <span className="pulse-badge-flagship">Flagship Event</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>OCT 16</span>
          </div>

          <h3 className="pulse-event-title">DevSummit&apos;26</h3>
          <p className="pulse-event-meta">
            Keynotes, 24h project sprints, and networking with top engineers.
          </p>

          <div className="pulse-stats-row">
            <div className="pulse-stat-item">
              <span className="pulse-stat-num">WED</span>
              <span className="pulse-stat-desc">MLCP LAB 1</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
            <div className="pulse-stat-item">
              <span className="pulse-stat-num">27</span>
              <span className="pulse-stat-desc">Core Builders</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
            <div className="pulse-stat-item">
              <span className="pulse-stat-num">100%</span>
              <span className="pulse-stat-desc">Student Led</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
