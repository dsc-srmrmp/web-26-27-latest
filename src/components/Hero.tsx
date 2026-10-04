import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import TechParticles from './TechParticles';
import SideRays from './SideRays';

const SPOTLIGHT_R = 260;


function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskUrl, setMaskUrl] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (cursorX === -999) return;

    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    setMaskUrl(canvas.toDataURL());
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: maskUrl ? `url(${maskUrl})` : 'none',
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat'
        }}
      />
    </>
  );
}

export default function Hero() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (smooth.current.x === -999) {
        smooth.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      if (smooth.current.x !== -999) {
        const dx = mouse.current.x - smooth.current.x;
        const dy = mouse.current.y - smooth.current.y;
        
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          smooth.current.x += dx * 0.1;
          smooth.current.y += dy * 0.1;
          setCursorPos({ x: smooth.current.x, y: smooth.current.y });
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div id="home" style={{ minHeight: '100vh', background: '#fff', letterSpacing: '-0.02em', fontFamily: "'Inter', sans-serif" }}>
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
          height: 40px;
          overflow: hidden;
          background: #111827;
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          z-index: 150;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .dsc-marquee-content {
          display: flex;
          animation: dsc-marquee 45s linear infinite;
        }
        .dsc-marquee-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .dsc-marquee-star {
          color: #14a3a3;
          margin: 0 32px;
          font-size: 14px;
        }
      `}</style>

      <div className="dsc-marquee-container">
        <div className="dsc-marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="dsc-marquee-item">UPCOMING HACKATHON: CODEFEST 2026</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">NEW WORKSHOPS EVERY WEEK</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">JOIN THE OPEN SOURCE REVOLUTION</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">EMPOWERING STUDENT DEVELOPERS</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      <Header active="home" />

      {/* ===== Hero Section ===== */}
      <section className="relative w-full overflow-hidden h-screen" style={{ height: '100dvh', background: '#0a0a0a' }}>

        {/* Background — SideRays teal gradient + TechParticles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0 }}>
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
          <TechParticles />
        </div>

        {/* Center-staged DSC heading */}
        <div className="hero-dsc-center">
          <h1 className="hero-anim hero-reveal hero-dsc-title">
            DSC
          </h1>
          <p className="hero-mobile-subtitle sm:hidden">
            Developer Students Club • SRM IST Ramapuram
          </p>
          <p className="hero-mobile-desc sm:hidden">
            Building a community of developers, designers, and innovators at SRM IST Ramapuram.
          </p>
        </div>

        {/* Layer 4 — Bottom-left paragraph (Desktop only) */}
        <div
          className="hidden sm:block hero-anim hero-fade"
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '40px',
            maxWidth: '260px',
            zIndex: 50,
            animationDelay: '0.22s',
          }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.625, fontFamily: "'Inter', sans-serif" }}>
            Developer Students Club at SRM IST Ramapuram — a community of passionate student developers building, innovating, and leading through technology.
          </p>
        </div>

        {/* Layer 5 — Bottom-right block (Desktop only) */}
        <div
          className="hidden sm:flex hero-anim hero-fade"
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            maxWidth: '260px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
            zIndex: 50,
            animationDelay: '0.3s',
          }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.625, fontFamily: "'Inter', sans-serif" }}>
            From hands-on workshops and intense hackathons to open-source contributions and industry collaborations — bridging the gap between classroom learning and real-world development.
          </p>
        </div>

        {/* Mobile Quick-Action Cards (< 640px) */}
        <div className="hero-mobile-actions sm:hidden hero-anim hero-fade">
          <a href="/domains" className="hero-mobile-card">
            <span className="hero-card-title">Explore Domains</span>
            <span className="hero-card-subtitle">Tech • Creatives • Ops</span>
          </a>
          <a href="/gallery" className="hero-mobile-card">
            <span className="hero-card-title">Upcoming Events</span>
            <span className="hero-card-subtitle">Hackathons & Sessions</span>
          </a>
        </div>
      </section>
    </div>
  );
}
