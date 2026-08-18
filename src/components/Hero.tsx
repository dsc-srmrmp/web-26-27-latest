import { useEffect, useRef, useState } from 'react';

const BG_IMAGE_1 = '/creative-ai/hero_bg1.webp';
const BG_IMAGE_2 = '/creative-ai/hero_bg2.webp';

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
    /* Hero visual area only — marquee and header are rendered by the Astro page template */
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '100vh' }}
      aria-label="Hero"
    >
      {/* Layer 1 — Base image with Ken Burns zoom */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat hero-zoom z-10"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* Layer 2 — Cursor spotlight reveal */}
      <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Layer 3 — Heading */}
      <div className="absolute top-[19%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
        <h1 style={{ color: '#fff', lineHeight: 0.95, fontWeight: 400 }}>
          <span
            className="hero-anim hero-reveal"
            style={{
              display: 'block',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              letterSpacing: '-0.05em',
              animationDelay: '0.05s',
            }}
          >
            Building the
          </span>
          <span
            className="hero-anim hero-reveal"
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              letterSpacing: '-0.08em',
              animationDelay: '0.12s',
              marginTop: '-4px',
            }}
          >
            developers of tomorrow
          </span>
        </h1>
      </div>

      {/* Layer 4 — Bottom-left paragraph */}
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
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.625 }}>
          Developer Students Club at SRM IST Ramapuram — a community of passionate student developers building, innovating, and leading through technology.
        </p>
      </div>

      {/* Layer 5 — Bottom-right paragraph */}
      <div
        className="hero-anim hero-fade"
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          maxWidth: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          zIndex: 50,
          animationDelay: '0.3s',
        }}
      >
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.625 }}>
          From hands-on workshops and intense hackathons to open-source contributions and industry collaborations — bridging the gap between classroom learning and real-world development.
        </p>
      </div>
    </section>
  );
}
