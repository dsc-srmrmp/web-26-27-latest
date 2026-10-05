import React from 'react';
import Header from './Header';
import DepthText from './DepthText';
import FlexCarousel, { type FlexCarouselItem } from './FlexCarousel';

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
          min-height: 100vh;
          background: #000000;
          color: #fff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
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

        .hero-body {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 108px;
          padding-bottom: 24px;
        }

        .hero-centerpiece {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px 20px 0;
          max-width: 1200px;
          margin: 0 auto;
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
          color: rgba(255, 255, 255, 0.75);
          margin-top: 18px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }

        .hero-btn-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 26px;
          margin-bottom: 24px;
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

        .hero-carousel-stage {
          position: relative;
          width: 100%;
          height: clamp(380px, 46vh, 520px);
          margin-top: 4px;
        }

        .hero-scroll-down {
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
          margin-top: 14px;
        }

        .hero-scroll-down:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          transform: translateY(3px);
        }

        @keyframes hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (max-width: 640px) {
          .hero-body {
            padding-top: 96px;
          }
          .hero-btn-row {
            gap: 8px;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .hero-pill-btn-inner {
            padding: 8.5px 18px;
            font-size: 12px;
          }
          .hero-carousel-stage {
            height: 360px;
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

      {/* Hero Body Content */}
      <div className="hero-body">
        {/* Centerpiece 3D DepthText */}
        <div className="hero-centerpiece">
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

        {/* Liquid Refraction FlexCarousel */}
        <div className="hero-carousel-stage">
          <FlexCarousel
            items={HERO_GALLERY_ITEMS}
            preset="liquid"
            intro="rise"
            fit="natural"
            cardHeight={0.52}
            gap={14}
            radius={14}
            squeeze={0.2}
            focusOnClick={true}
            captions={true}
            autoplay={true}
            interval={3.8}
            captureWheel={false}
          />
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
    </div>
  );
}
