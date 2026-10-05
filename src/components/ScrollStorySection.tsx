import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Chapter {
  id: string;
  label: string;
  headline: string;
  sub: string;
  accent: string;
  stat?: { value: string; unit: string };
  badges?: string[];
  icon: string;
}

const chapters: Chapter[] = [
  {
    id: 'chapter-build',
    label: 'WHO WE ARE',
    headline: "SRM\u2019s most active builder community.",
    sub: 'Developer Students Club at SRM IST Ramapuram — 27 students across Technical, Creatives, and Operations building real products every semester.',
    accent: '#1dd1a1',
    stat: { value: '27', unit: 'active members' },
    badges: ['Technical', 'Creatives', 'Operations'],
    icon: '⚙️',
  },
  {
    id: 'chapter-weekly',
    label: 'EVERY WEDNESDAY',
    headline: 'Weekly DSA sprints that actually get you hired.',
    sub: 'LeetCode patterns, whiteboard sessions, and mock interviews led by seniors who cracked tier-1 companies. No theory slides. Just problems, solutions, and peers.',
    accent: '#00f2fe',
    stat: { value: '52', unit: 'sessions per year' },
    badges: ['DSA Sprints', 'MLCP LAB 1', '4:00 PM'],
    icon: '🧠',
  },
  {
    id: 'chapter-build2',
    label: 'BUILD REAL THINGS',
    headline: 'Ship production code alongside your coursework.',
    sub: 'From cloud deployments on real GCP infrastructure to IoT hardware labs — you\'ll graduate with a portfolio that speaks louder than your GPA.',
    accent: '#c084fc',
    stat: { value: '100%', unit: 'student-led projects' },
    badges: ['Cloud Labs', 'Open Source', 'IoT Hardware'],
    icon: '🚀',
  },
  {
    id: 'chapter-event',
    label: 'FLAGSHIP EVENT',
    headline: "DevSummit'26 — October 16th.",
    sub: "SRM's biggest developer summit. A 24-hour hackathon, keynote speakers from industry, project showcases, and prize tracks across all domains.",
    accent: '#eab308',
    stat: { value: 'OCT 16', unit: '2026' },
    badges: ['24h Hackathon', 'Industry Mentors', 'Prize Tracks'],
    icon: '⚡',
  },
  {
    id: 'chapter-alumni',
    label: 'WHERE WE END UP',
    headline: 'Our alumni build at the companies you admire.',
    sub: 'Google. Microsoft. Amazon. TCS. JP Morgan. DSC alumni have gone on to work at some of the most impactful companies in tech. You could be next.',
    accent: '#1dd1a1',
    badges: ['Google', 'Microsoft', 'Amazon', 'JP Morgan'],
    icon: '🏆',
  },
];

export default function ScrollStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const ctx = gsap.context(() => {
      const totalChapters = chapters.length;

      // Main pinned scrolltrigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${totalChapters * 100}%`,
        pin: sticky,
        pinSpacing: true,
        scrub: false,
        onUpdate: (self) => {
          // Update progress bar
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: self.progress });
          }

          // Active chapter
          const activeIdx = Math.min(
            Math.floor(self.progress * totalChapters),
            totalChapters - 1
          );

          // Sync nav dots
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            if (i === activeIdx) {
              dot.style.background = chapters[activeIdx].accent;
              dot.style.transform = 'scale(1.4)';
            } else {
              dot.style.background = 'rgba(255,255,255,0.3)';
              dot.style.transform = 'scale(1)';
            }
          });
        },
      });

      // Chapter-level transitions
      chapterRefs.current.forEach((chapter, idx) => {
        if (!chapter) return;

        const chapterStart = idx / totalChapters;
        const chapterEnd = (idx + 1) / totalChapters;
        const chapterMid = (chapterStart + chapterEnd) / 2;

        // Enter: chapter slides in from below
        ScrollTrigger.create({
          trigger: section,
          start: `${chapterStart * totalChapters * 100}% top`,
          end: `${chapterMid * totalChapters * 100}% top`,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(chapter, {
              opacity: p,
              y: (1 - p) * 60,
              visibility: 'visible',
              filter: `blur(${(1 - p) * 4}px)`,
            });
          },
        });

        // Exit: chapter slides out upward
        if (idx < totalChapters - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: `${chapterMid * totalChapters * 100}% top`,
            end: `${chapterEnd * totalChapters * 100}% top`,
            scrub: 0.8,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(chapter, {
                opacity: 1 - p,
                y: -p * 60,
                filter: `blur(${p * 4}px)`,
              });
            },
          });
        }

        // Stat counter animation (one-shot on enter)
        const statEl = chapter.querySelector('.ss-stat-value') as HTMLElement | null;
        if (statEl && statEl.dataset.target) {
          const target = statEl.dataset.target;
          let animated = false;
          ScrollTrigger.create({
            trigger: section,
            start: `${(chapterStart + 0.02) * totalChapters * 100}% top`,
            onEnter: () => {
              if (animated) return;
              animated = true;
              const isNumeric = /^\d+$/.test(target);
              if (!isNumeric) {
                // Non-numeric: just reveal
                gsap.fromTo(statEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
                return;
              }
              const end = parseInt(target, 10);
              const start = 0;
              const duration = 1.2;
              const startTime = performance.now();
              const tick = (now: number) => {
                const elapsed = (now - startTime) / 1000;
                const t = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                statEl.textContent = Math.round(start + eased * (end - start)).toString();
                if (t < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            },
          });
        }

        // Badge stagger on enter
        const badges = chapter.querySelectorAll('.ss-badge');
        if (badges.length > 0) {
          gsap.set(badges, { opacity: 0, y: 20, scale: 0.9 });
          ScrollTrigger.create({
            trigger: section,
            start: `${(chapterStart + 0.05) * totalChapters * 100}% top`,
            onEnter: () => {
              gsap.to(badges, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.09,
                ease: 'back.out(1.2)',
              });
            },
            onLeaveBack: () => {
              gsap.set(badges, { opacity: 0, y: 20, scale: 0.9 });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ss-outer"
      style={{ height: `${chapters.length * 100 + 100}vh` }}
    >
      <style>{`
        .ss-outer {
          position: relative;
          width: 100%;
          background: #0a0a0a;
        }

        .ss-sticky {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Ambient mesh background */
        .ss-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(29, 209, 161, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(0, 242, 254, 0.05) 0%, transparent 60%);
        }

        /* Dot grid overlay */
        .ss-dot-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* Progress bar at top */
        .ss-progress-bar-wrap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.08);
          z-index: 100;
        }

        .ss-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #1dd1a1, #00f2fe);
          transform-origin: left;
          transform: scaleX(0);
          will-change: transform;
        }

        /* Nav dots */
        .ss-nav-dots {
          position: absolute;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 100;
        }

        .ss-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: default;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        /* Chapter label top */
        .ss-section-label {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          z-index: 10;
        }

        /* Chapter stack */
        .ss-chapters-stack {
          position: relative;
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          padding: 0 24px;
          z-index: 10;
        }

        .ss-chapter {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 0 24px;
          opacity: 0;
          visibility: hidden;
          will-change: transform, opacity, filter;
          transform: translateY(60px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        /* First chapter starts slightly visible */
        .ss-chapter:first-child {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .ss-chapter-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .ss-chapter-label::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: currentColor;
          border-radius: 2px;
        }

        .ss-icon {
          font-size: 2.8rem;
          line-height: 1;
          margin-bottom: 4px;
          display: block;
        }

        .ss-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.1rem, 4.5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.08;
          color: #ffffff;
          margin: 0;
        }

        .ss-sub {
          font-size: clamp(14px, 1.3vw, 17px);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.72);
          max-width: 600px;
          margin: 0;
        }

        /* Stat block */
        .ss-stat {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .ss-stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .ss-stat-unit {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Badges */
        .ss-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }

        .ss-badge {
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: background 0.2s ease;
        }

        .ss-badge:hover {
          background: rgba(255,255,255,0.12);
        }

        /* Scroll hint at bottom */
        .ss-scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 10;
          pointer-events: none;
        }

        .ss-scroll-hint-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.4));
          animation: ssScrollPulse 2s ease-in-out infinite;
        }

        .ss-scroll-hint-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          animation: ssScrollPulse 2s ease-in-out infinite;
        }

        @keyframes ssScrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .ss-nav-dots {
            right: 14px;
            gap: 8px;
          }

          .ss-chapter {
            padding: 0 4px;
          }

          .ss-headline {
            font-size: clamp(1.9rem, 8vw, 2.8rem);
          }

          .ss-stat-value {
            font-size: clamp(2.4rem, 10vw, 3.5rem);
          }

          .ss-icon {
            font-size: 2rem;
          }
        }
      `}</style>

      <div ref={stickyRef} className="ss-sticky">
        {/* Ambient */}
        <div className="ss-ambient" />
        <div className="ss-dot-grid" />

        {/* Progress bar */}
        <div className="ss-progress-bar-wrap">
          <div ref={progressBarRef} className="ss-progress-bar" />
        </div>

        {/* Nav dots */}
        <div className="ss-nav-dots">
          {chapters.map((ch, i) => (
            <div
              key={ch.id}
              ref={(el) => (dotRefs.current[i] = el)}
              className="ss-dot"
              style={i === 0 ? { background: ch.accent, transform: 'scale(1.4)' } : {}}
            />
          ))}
        </div>

        {/* Chapter stack (absolutely positioned, z-stacked) */}
        <div className="ss-chapters-stack" style={{ height: '460px' }}>
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              ref={(el) => (chapterRefs.current[idx] = el)}
              className="ss-chapter"
            >
              {/* Label */}
              <div className="ss-chapter-label" style={{ color: ch.accent }}>
                {ch.label}
              </div>

              {/* Icon */}
              <span className="ss-icon" role="img" aria-label={ch.label}>
                {ch.icon}
              </span>

              {/* Headline */}
              <h2 className="ss-headline">{ch.headline}</h2>

              {/* Sub */}
              <p className="ss-sub">{ch.sub}</p>

              {/* Stat */}
              {ch.stat && (
                <div className="ss-stat">
                  <span
                    className="ss-stat-value"
                    style={{ color: ch.accent }}
                    data-target={ch.stat.value.replace(/[^0-9]/g, '') || ch.stat.value}
                  >
                    {ch.stat.value}
                  </span>
                  <span className="ss-stat-unit">{ch.stat.unit}</span>
                </div>
              )}

              {/* Badges */}
              {ch.badges && ch.badges.length > 0 && (
                <div className="ss-badges">
                  {ch.badges.map((b) => (
                    <span
                      key={b}
                      className="ss-badge"
                      style={{ borderColor: `${ch.accent}30`, color: ch.accent }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="ss-scroll-hint">
          <div className="ss-scroll-hint-text">scroll to explore</div>
          <div className="ss-scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}
