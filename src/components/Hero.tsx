import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import DepthText from './DepthText';
import FlexCarousel, { type FlexCarouselItem, type FlexCarouselHandle } from './FlexCarousel';
import SideRays from './SideRays';
import TechParticles from './TechParticles';

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
  const titleParallaxRef = useRef<HTMLDivElement | null>(null);
  const metaParallaxRef = useRef<HTMLDivElement | null>(null);
  const mouseTiltRef = useRef<HTMLDivElement | null>(null);
  const galleryStageRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<FlexCarouselHandle | null>(null);
  const scrollDownRef = useRef<HTMLAnchorElement | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Subtle interactive mouse tilt isolated to mouseTiltRef to avoid colliding with scroll tweens
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseTiltRef.current || window.innerWidth < 768) return;
    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / innerHeight - 0.5) * 2;

    gsap.to(mouseTiltRef.current, {
      x: xRatio * 14,
      y: yRatio * 10,
      rotateY: xRatio * 3,
      rotateX: -yRatio * 2.5,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Entrance "in" animation played right after splash intro sequence fades
  useEffect(() => {
    let triggered = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let tl: gsap.core.Timeline | null = null;

    const playEntranceAnimation = () => {
      if (triggered) return;
      triggered = true;

      if (fallbackTimer) clearTimeout(fallbackTimer);
      carouselRef.current?.wake();

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            galleryStageRef.current,
            '.hero-depth-title',
            '.hero-center-backdrop',
            '.hero-subtitle',
            '.hero-pill-btn',
            '.dsc-marquee-container',
            '.home-nav-header',
            '.mobile-glass-nav',
            scrollDownRef.current,
            '.hero-ambient-spot',
            '.hero-side-rays',
            '.hero-corner-graphic',
          ],
          { opacity: 1, x: 0, y: 0, scale: 1, filter: 'none', clearProps: 'all' }
        );
        return;
      }

      tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          gsap.set(['.hero-depth-title', '.hero-subtitle', '.hero-pill-btn'], {
            clearProps: 'filter',
          });
        },
      });

      // 1. Ambient lighting & decorative graphics
      tl.fromTo(
        '.hero-ambient-spot, .hero-corner-graphic',
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: 'power2.out' },
        0
      );

      tl.fromTo(
        '.hero-side-rays',
        { opacity: 0 },
        { opacity: 0.65, duration: 1.2, ease: 'power2.out' },
        0
      );

      // 2. Liquid WebGL Gallery Stage rises with depth and subtle expansion
      if (galleryStageRef.current) {
        tl.fromTo(
          galleryStageRef.current,
          { opacity: 0, scale: 0.93, y: 48, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1.25, ease: 'power3.out' },
          0.05
        );
      }

      // 3. Central 3D DEVELOPER STUDENTS CLUB title emerges with colossal depth
      tl.fromTo(
        '.hero-depth-title',
        { opacity: 0, y: 55, scale: 0.91, filter: 'blur(14px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
        0.12
      );

      // 4. Soft ambient glow behind 3D letters
      tl.fromTo(
        '.hero-center-backdrop',
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
        0.18
      );

      // 5. Campus location subtitle slides into crisp focus
      tl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 25, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power2.out' },
        0.38
      );

      // 6. Pill CTA buttons emerge with energetic spring stagger
      tl.fromTo(
        '.hero-pill-btn',
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(1.6)' },
        0.52
      );

      // 7. Top Marquee drops down from top
      tl.fromTo(
        '.dsc-marquee-container',
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        0.25
      );

      // 8. Desktop Header Navbar drops in from above
      tl.fromTo(
        '.home-nav-header',
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        0.32
      );

      // 9. Mobile nav glides up from bottom
      tl.fromTo(
        '.mobile-glass-nav',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        0.38
      );

      // 10. Down chevron indicator emerges
      if (scrollDownRef.current) {
        tl.fromTo(
          scrollDownRef.current,
          { opacity: 0, scale: 0.5, y: -10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' },
          0.68
        );
      }
    };

    if (typeof document !== 'undefined' && document.body.classList.contains('splash-active')) {
      // Immediately prime initial hidden state so nothing shows underneath before fade
      gsap.set(
        [
          galleryStageRef.current,
          '.hero-depth-title',
          '.hero-center-backdrop',
          '.hero-subtitle',
          '.hero-pill-btn',
          '.dsc-marquee-container',
          '.home-nav-header',
          '.mobile-glass-nav',
          scrollDownRef.current,
          '.hero-ambient-spot',
          '.hero-side-rays',
          '.hero-corner-graphic',
        ],
        { opacity: 0 }
      );

      const handleSplashFade = () => playEntranceAnimation();
      window.addEventListener('dsc:splash-fade', handleSplashFade, { once: true });
      window.addEventListener('dsc:splash-complete', handleSplashFade, { once: true });

      fallbackTimer = setTimeout(() => {
        playEntranceAnimation();
      }, 4000);

      return () => {
        window.removeEventListener('dsc:splash-fade', handleSplashFade);
        window.removeEventListener('dsc:splash-complete', handleSplashFade);
        if (fallbackTimer) clearTimeout(fallbackTimer);
        tl?.kill();
      };
    } else {
      playEntranceAnimation();
      return () => {
        tl?.kill();
      };
    }
  }, []);

  // Integrated Scroll Parallax for DEVELOPER STUDENTS CLUB & Liquid WebGL Gallery
  useEffect(() => {
    const container = heroContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. DEVELOPER STUDENTS CLUB Parallax Transition:
      // Elevates upwards, tilts in 3D perspective, contracts scale, and blurs into distance
      if (titleParallaxRef.current) {
        gsap.to(titleParallaxRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '85% top',
            scrub: 0.5,
          },
          y: isMobile ? -140 : -220,
          rotateX: 14,
          scale: 0.86,
          opacity: 0,
          filter: 'blur(14px)',
          ease: 'power1.out',
        });
      }

      // 2. Subtitle & Action buttons fade out earlier to keep focus on the receding 3D letters
      if (metaParallaxRef.current) {
        gsap.to(metaParallaxRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '45% top',
            scrub: 0.3,
          },
          y: -75,
          opacity: 0,
          filter: 'blur(8px)',
          ease: 'power1.out',
        });
      }

      // 3. Background liquid gallery stage parallax depth (smooth counter-movement)
      if (galleryStageRef.current) {
        gsap.to(galleryStageRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
          y: isMobile ? 60 : 110,
          scale: 1.05,
          ease: 'none',
        });
      }

      // 4. Drive carousel horizontal rotation smoothly on page scroll
      let lastProgress = 0;
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2,
        onUpdate: (self) => {
          const deltaProgress = self.progress - lastProgress;
          lastProgress = self.progress;

          const scrollDelta = deltaProgress * (isMobile ? 260 : 380);

          if (Math.abs(scrollDelta) > 0.05) {
            carouselRef.current?.scrollBy(scrollDelta);
          }
        },
      });

      // 5. Scroll down indicator fades away immediately upon scroll
      if (scrollDownRef.current) {
        gsap.to(scrollDownRef.current, {
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '20% top',
            scrub: 0.2,
          },
          opacity: 0,
          y: 20,
          ease: 'power1.out',
        });
      }
    }, container);

    return () => ctx.revert();
  }, [isMobile]);

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
          min-height: 640px;
          background: linear-gradient(to bottom, #080d0b 0%, #051310 50%, #030d0f 100%) no-repeat;
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
            radial-gradient(circle 900px at 80% 20%, rgba(29, 209, 161, 0.15) 0%, transparent 70%),
            radial-gradient(circle 750px at 20% 75%, rgba(0, 242, 254, 0.09) 0%, transparent 65%),
            radial-gradient(circle 600px at 50% 45%, rgba(26, 92, 69, 0.22) 0%, transparent 75%);
        }

        .hero-side-rays {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.65;
          overflow: hidden;
        }

        /* Decorative Corner Circuit Graphics (Consistent with About & Contact) */
        .hero-corner-graphic {
          position: absolute;
          pointer-events: none;
          opacity: 0.22;
          z-index: 1;
        }
        .hero-corner-top-left {
          top: 48px;
          left: 20px;
        }
        .hero-corner-top-right {
          top: 48px;
          right: 20px;
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
          padding: 0 24px;
        }

        /* Mouse Tilt Layer (Handles Cursor Parallax without colliding with Scroll) */
        .hero-mouse-tilt-layer {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform-style: preserve-3d;
          will-change: transform;
          pointer-events: auto;
        }

        /* Soft ambient radial backdrop behind text */
        .hero-center-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(1120px, 94vw);
          height: min(540px, 60vh);
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.44) 55%, transparent 100%);
          pointer-events: none;
          z-index: -1;
          filter: blur(20px);
        }

        /* DEVELOPER STUDENTS CLUB Parallax Box */
        .hero-title-parallax-box {
          transform-style: preserve-3d;
          perspective: 1200px;
          will-change: transform, opacity, filter;
        }

        .hero-depth-title {
          margin: 0;
          padding: 0;
          font-size: 0;
          line-height: 1;
        }

        /* Subtitle & Buttons Meta Box */
        .hero-meta-parallax-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: transform, opacity, filter;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.05rem, 1.8vw, 1.45rem);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 22px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.98);
        }

        .hero-btn-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .hero-pill-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(66, 133, 244, 0.6), rgba(234, 67, 53, 0.5), rgba(251, 188, 4, 0.5), rgba(52, 168, 83, 0.6));
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
          cursor: pointer;
        }

        .hero-pill-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 0 30px rgba(66, 133, 244, 0.55);
        }

        .hero-pill-btn-inner {
          padding: 12px 28px;
          border-radius: 9999px;
          background: rgba(10, 10, 14, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
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

        @media (max-width: 768px) {
          .hero-master-wrapper {
            height: 100svh;
            height: 100dvh;
          }
          .hero-ambient-spot {
            background:
              radial-gradient(circle 380px at 50% 36%, rgba(66, 133, 244, 0.18) 0%, transparent 70%),
              radial-gradient(circle 300px at 50% 54%, rgba(234, 67, 53, 0.14) 0%, transparent 68%);
          }
          .hero-center-overlay {
            padding-top: 56px;
            padding-left: 10px;
            padding-right: 10px;
          }
          .hero-center-backdrop {
            width: min(320px, 86vw);
            height: min(390px, 52vh);
            background: radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 0, 0, 0.76) 0%, rgba(0, 0, 0, 0.36) 55%, transparent 100%);
            filter: blur(20px);
          }
          .hero-subtitle {
            font-size: clamp(0.88rem, 3.5vw, 1.08rem);
            margin-top: 14px;
          }
          .hero-btn-row {
            gap: 8px;
            margin-top: 16px;
            max-width: 350px;
          }
          .hero-pill-btn-inner {
            padding: 8px 15px;
            font-size: 11.5px;
          }
          .hero-scroll-down {
            bottom: 14px;
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      {/* Ambient background glow */}
      <div className="hero-ambient-spot" />

      {/* WebGL Volumetric SideRays (Consistent with About & Contact) */}
      <div className="hero-side-rays">
        <SideRays
          speed={1.2}
          rayColor1="#1dd1a1"
          rayColor2="#00f2fe"
          intensity={1.2}
          spread={2.5}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={0.65}
        />
      </div>

      {/* Ambient Tech Particles (Consistent with About & Contact) */}
      <TechParticles />

      {/* Decorative Corner Circuit Graphics (Consistent with About & Contact) */}
      <svg className="hero-corner-graphic hero-corner-top-left" width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,50 L100,50 L150,100 L220,100" stroke="rgba(232, 237, 233, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60,0 L60,80 L100,120 L150,120" stroke="rgba(232, 237, 233, 0.25)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="220" cy="100" r="3" fill="#1dd1a1" />
        <circle cx="150" cy="120" r="2" fill="rgba(232, 237, 233, 0.6)" />
      </svg>

      <svg className="hero-corner-graphic hero-corner-top-right" width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M250,50 L150,50 L100,100 L30,100" stroke="rgba(232, 237, 233, 0.4)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M190,0 L190,80 L150,120 L100,120" stroke="rgba(232, 237, 233, 0.25)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="30" cy="100" r="3" fill="#1dd1a1" />
        <circle cx="100" cy="120" r="2" fill="rgba(232, 237, 233, 0.6)" />
      </svg>

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
              <div className="dsc-marquee-item">EMPOWERING STUDENT DEVELOPERS • SRM IST RAMAPURAM</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Site Navigation */}
      <Header active="home" />

      {/* Full-bleed Liquid WebGL Gallery Stage (Responsive mobile & desktop calibration) */}
      <div ref={galleryStageRef} className="hero-gallery-stage">
        <FlexCarousel
          ref={carouselRef}
          items={HERO_GALLERY_ITEMS}
          preset="liquid"
          intro="rise"
          fit={isMobile ? 'portrait' : 'natural'}
          cardHeight={isMobile ? 0.36 : 0.50}
          tilt={isMobile ? 0 : 54}
          lensWidth={isMobile ? 0.88 : 0.76}
          lensHeight={isMobile ? 1.25 : 1.15}
          bend={isMobile ? 0.40 : 0.34}
          reach={isMobile ? 0.34 : 0.38}
          dispersion={isMobile ? 0.32 : 0.45}
          gap={isMobile ? 12 : 16}
          radius={isMobile ? 16 : 16}
          squeeze={isMobile ? 0.15 : 0.2}
          focusOnClick={false}
          captions={false}
          autoplay={true}
          interval={3.8}
          captureWheel={false}
        />
      </div>

      {/* Foreground Centerpiece Overlay Layered Directly OVER Gallery */}
      <div className="hero-center-overlay">
        <div ref={mouseTiltRef} className="hero-mouse-tilt-layer">
          <div className="hero-center-backdrop" />

          {/* DEVELOPER STUDENTS CLUB with colossal font size and rich 3D perspective parallax scroll transition */}
          <div ref={titleParallaxRef} className="hero-title-parallax-box">
            <h1 className="hero-depth-title" aria-label="Developer Students Club">
              <DepthText
                lines={[
                  [{ text: 'DEVELOPER' }],
                  [
                    { text: 'STUDENTS' },
                    { text: 'CLUB', faceColor: '#2dd4bf', depthColor: '#0a4a45' },
                  ],
                ]}
                layers={isMobile ? 28 : 42}
                depth={isMobile ? 2.0 : 2.8}
                faceColor="#ffffff"
                depthColor="#262d3a"
                tilt={isMobile ? 5 : 7.5}
                pointerTracking
                smoothing={0.14}
                perspective={isMobile ? 850 : 1050}
                autoOrbit
                orbitSpeed={0.35}
                fontSize={isMobile ? 'clamp(3.3rem, 14.5vw, 5.2rem)' : 'clamp(5rem, 13.5vw, 11rem)'}
                fontWeight={400}
                fontFamily="'Bebas Neue', sans-serif"
                letterSpacing={isMobile ? '0.015em' : '0.025em'}
                shadow
              />
            </h1>
          </div>

          {/* Subtitle and CTA buttons with smooth early parallax fade */}
          <div ref={metaParallaxRef} className="hero-meta-parallax-box">
            <p className="hero-subtitle">SRM IST Ramapuram, Chennai, TN, India</p>

            <div className="hero-btn-row">
              <a
                href="https://forms.gle/PV8wbN27PVsFpUoz6"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-pill-btn"
              >
                <span className="hero-pill-btn-inner">Join Community</span>
              </a>
              <a href="/domains" className="hero-pill-btn">
                <span className="hero-pill-btn-inner">Explore Domains</span>
              </a>
              <a href="/gallery" className="hero-pill-btn">
                <span className="hero-pill-btn-inner">DevSummit&apos;26</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Down Chevron Indicator */}
      <a
        ref={scrollDownRef}
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="hero-scroll-down"
        aria-label="Scroll down to explore"
      >
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
