import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const STATS: Stat[] = [
  { value: 300, suffix: '+', label: 'Active Members', description: 'Students across all three domains' },
  { value: 40,  suffix: '+', label: 'Events Hosted', description: 'Hackathons, workshops & meetups' },
  { value: 3,   suffix: '',  label: 'Expert Domains', description: 'Technical, Creatives, Operations' },
  { value: 15,  suffix: '+', label: 'Open-Source Projects', description: 'Real-world contributions by members' },
];

function useCountUp(target: number, duration = 1600, triggered: boolean) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!triggered) return;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, triggered]);

  return count;
}

function StatCard({ stat, triggered }: { stat: Stat; triggered: boolean }) {
  const count = useCountUp(stat.value, 1500, triggered);

  return (
    <div className="about-stat-card">
      <div className="about-stat-number">
        {count}{stat.suffix}
      </div>
      <div className="about-stat-label">{stat.label}</div>
      <p className="about-stat-desc">{stat.description}</p>
    </div>
  );
}

export default function AboutStats() {
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="about-stats-grid">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} triggered={triggered} />
      ))}

      <style>{`
        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
        }

        .about-stat-card {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
          background-color: rgba(17, 23, 20, 0.3);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 32px 24px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .about-stat-card:hover {
          border-color: rgba(29, 209, 161, 0.2);
          box-shadow: 0 8px 30px rgba(29, 209, 161, 0.06);
          transform: translateY(-3px);
        }

        .about-stat-number {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1dd1a1;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
          font-variant-numeric: tabular-nums;
        }

        .about-stat-label {
          font-size: 14px;
          font-weight: 600;
          color: #e8ede9;
          margin-bottom: 6px;
        }

        .about-stat-desc {
          font-size: 12.5px;
          color: #6b7b72;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 900px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .about-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .about-stat-card {
            padding: 24px 16px;
          }
          .about-stat-number {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
