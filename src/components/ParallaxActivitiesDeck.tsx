import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Activity {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  meta: string;
  image: string;
}

const activities: Activity[] = [
  {
    tag: 'LEAD ACTIVITY • WEEKLY',
    tagColor: '#1dd1a1',
    title: 'Data Structures & Algorithms Sprints',
    description: 'Master core algorithmic thinking, LeetCode patterns, and technical interview problem-solving with senior peers who have cracked tier-1 companies.',
    meta: 'Every Week • All Skill Levels • Peer Whiteboarding',
    image: '/assets/gallery/workshop.png',
  },
  {
    tag: 'EVERY WEDNESDAY • MLCP LAB 1',
    tagColor: '#00f2fe',
    title: 'Cloud Computing & Hardware Labs',
    description: 'Hands-on laboratory sessions in MLCP LAB 1. Spin up cloud infrastructure, deploy full-stack web applications, and experiment with IoT hardware.',
    meta: 'MLCP Lab 1 • Wednesdays 4:00 PM • Laptop Required',
    image: '/assets/gallery/community.png',
  },
  {
    tag: 'FLAGSHIP • OCT 16TH',
    tagColor: '#eab308',
    title: "DevSummit'26 & Hackathon Sprints",
    description: "SRM's flagship developer summit featuring intense 24-hour team hackathons, industry keynotes, project showcases, and prize tracks.",
    meta: "October 16, 2026 • Campus Wide • Mentored Sprints",
    image: '/assets/gallery/hackathon.png',
  },
  {
    tag: 'CREATIVES & PRODUCT',
    tagColor: '#c084fc',
    title: 'UI/UX Design & Brand Storytelling',
    description: 'Transform concepts into stunning Figma design systems, motion graphics, and user experiences that power DSC websites, apps, and events.',
    meta: 'Design Jams • Figma Systems • Portfolio Reviews',
    image: '/assets/gallery/design.png',
  },
];

export default function ParallaxActivitiesDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('.activities-header-anim', {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        immediateRender: false,
      });

      // Staggered parallax cards lift (responsive scrub in both directions)
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            y: 60,
            opacity: 0,
            scale: 0.97,
          },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.4,
              immediateRender: false,
            },
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="activities-section" id="activities">
      <style>{`
        .activities-section {
          position: relative;
          width: 100%;
          padding: 100px 24px 120px;
          background: #0a0a0a;
          color: #fff;
          z-index: 10;
          overflow: hidden;
        }

        /* Ambient glow backdrop */
        .activities-glow {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: min(800px, 90vw);
          height: 500px;
          background: radial-gradient(circle, rgba(29, 209, 161, 0.08) 0%, rgba(0, 242, 254, 0.04) 50%, rgba(0,0,0,0) 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
        }

        .activities-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .activities-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .activities-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1dd1a1;
          margin-bottom: 16px;
        }

        .activities-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.8vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .activities-subtitle {
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          max-width: 620px;
          margin: 0 auto;
        }

        /* 2x2 Grid with Parallax Depth */
        .activities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          width: 100%;
        }

        @media (max-width: 860px) {
          .activities-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .activity-card {
          background: rgba(17, 23, 20, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        }

        .activity-card:hover {
          border-color: rgba(29, 209, 161, 0.35);
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(29, 209, 161, 0.15);
        }

        .activity-card-top {
          margin-bottom: 24px;
        }

        .activity-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: inline-block;
        }

        .activity-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
          margin: 0 0 12px 0;
        }

        .activity-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          margin: 0;
        }

        .activity-card-bottom {
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .activity-meta {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
        }

        .activity-arrow-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: background 0.2s, transform 0.2s;
        }

        .activity-card:hover .activity-arrow-icon {
          background: #1dd1a1;
          color: #0b0f17;
          transform: translateX(3px);
        }
      `}</style>

      <div className="activities-glow" />

      <div className="activities-container">
        {/* Section Header */}
        <div className="activities-header">
          <div className="activities-pill activities-header-anim">
            <span>What We Actually Do</span>
          </div>
          <h2 className="activities-title activities-header-anim">
            Built for students who want to build real things.
          </h2>
          <p className="activities-subtitle activities-header-anim">
            No endless theory slides. Drop into our sessions, crack complex algorithmic problems, deploy production code, and collaborate in teams.
          </p>
        </div>

        {/* 2x2 Clean Parallax Card Deck (DSA leads on top) */}
        <div className="activities-grid">
          {activities.map((act, index) => (
            <div
              key={act.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="activity-card"
            >
              <div className="activity-card-top">
                <span className="activity-tag" style={{ color: act.tagColor }}>
                  {act.tag}
                </span>
                <h3 className="activity-title">{act.title}</h3>
                <p className="activity-desc">{act.description}</p>
              </div>

              <div className="activity-card-bottom">
                <span className="activity-meta">{act.meta}</span>
                <div className="activity-arrow-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
