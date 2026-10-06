import React, { useState, useEffect, useRef } from 'react';
import '../../styles/about.css';
import {
  Lightbulb,
  Users,
  Compass,
  Briefcase,
  Award,
  BookOpen,
  Code2,
  Cpu,
  Globe2,
  Target,
  Sparkles
} from 'lucide-react';

interface EventData {
  id: number;
  num: string;
  title: string;
  date: string;
  tag: string;
  isUpcoming?: boolean;
  description: string;
  badges: string[];
  image: string;
}

const RECENT_EVENTS: EventData[] = [
  {
    id: 1,
    num: '01',
    title: 'Hackcelerate 2026',
    date: 'February 2026',
    tag: 'HACKATHON',
    description:
      'A national-level 24-hour innovation hackathon that brought together students to build solutions across healthcare, blockchain, sustainability, and fintech.',
    badges: ['4000+ Registrations', '30 Shortlisted Teams', '₹1,00,000+ Prize Pool'],
    image: '/about/hackcelerate.jpg'
  },
  {
    id: 2,
    num: '02',
    title: 'IdeaTech Innovation Challenge',
    date: '28 February 2026',
    tag: 'INNOVATION',
    description:
      'A three-hour innovation challenge where teams tackled randomly assigned problem statements and pitched their solutions under time constraints.',
    badges: ['27 Teams', 'Live Pitching', 'Rapid Ideation'],
    image: '/about/ideatech.jpg'
  },
  {
    id: 3,
    num: '03',
    title: 'Technorally 2.0',
    date: '30 September 2026',
    tag: 'TECHNICAL COMPETITION',
    description:
      'A four-round relay-style technical tournament combining UI/UX design, SQL challenges, competitive debugging, and algorithmic problem-solving.',
    badges: ['4 Relay Stages', 'Multi-Domain', 'Competitive Debugging'],
    image: '/about/technorally.jpg'
  },
  {
    id: 4,
    num: '04',
    title: "DevSummit'26",
    date: '15 October 2026',
    tag: 'UPCOMING EVENT',
    isUpcoming: true,
    description:
      'Our flagship annual developer summit bringing industry leaders, student innovators, and creators together for keynotes, live tech demonstrations, and community laurels.',
    badges: ['Upcoming', 'Flagship Summit', 'Keynotes & Demos'],
    image: '/gallery/awards.png'
  }
];

const STORY_TIMELINE = [
  {
    year: '2018',
    title: 'The Beginning',
    description:
      'DSC at SRM IST Ramapuram was established under the Google Developer Students Club initiative. Early initiatives included Google Study Jams and participation in the Google Solution Challenge.',
    badge: '~130 attendees'
  },
  {
    year: '2019',
    title: 'Community Expansion',
    description:
      'The club expanded its developer community through collaborative learning sessions and technical discussions.'
  },
  {
    year: '2020',
    title: 'Going Virtual',
    description:
      'During the COVID-19 pandemic, DSC transitioned its technical learning activities to online platforms.',
    tag: 'ONLINE COMMUNITY'
  },
  {
    year: '2021',
    title: 'Technical Learning',
    description:
      'The club expanded structured technical learning through Android Study Jams, Hello World, Machine Learning workshops, and Google Cloud initiatives.'
  },
  {
    year: '2022',
    title: 'Collaboration & Outreach',
    description:
      'DSC strengthened collaborative and community-oriented initiatives through programs such as Flutter Festival, Google for Namma Workers, Google CloudReady, and Compose Camp.'
  },
  {
    year: '2023',
    title: 'Skill Development',
    description:
      'Technical learning continued through initiatives such as the three-day Web Development Workshop and Tech Trivia Competition.'
  },
  {
    year: '2024',
    title: 'Innovation & Security',
    description:
      'The club expanded its focus through InnovAIte, IdeaForge, StealthCraft, Chennai Summit Up, and Google Solution Challenge preparation initiatives.'
  },
  {
    year: '2025',
    title: 'Multi-Domain Challenges',
    description:
      'D³ and Technorally brought together creativity, design, SQL, debugging, and technical problem-solving.'
  },
  {
    year: '2026',
    title: 'A Major Milestone',
    description:
      "Hackcelerate 2026, IdeaTech, Technorally 2.0, and DevSummit'26 marked a major milestone of high-impact hackathons, innovation challenges, and flagship developer summits.",
    badge: '₹1L+ Prize Pool'
  }
];

const IDENTITY_CARDS = [
  {
    id: 'empower',
    icon: Sparkles,
    label: 'EMPOWER',
    title: 'Empower',
    desc: 'Build confidence through practical learning, mentorship, and meaningful opportunities.'
  },
  {
    id: 'collaborate',
    icon: Users,
    label: 'COLLABORATE',
    title: 'Collaborate',
    desc: 'Grow stronger together by sharing ideas, solving problems, and crossing boundaries.'
  },
  {
    id: 'experiment',
    icon: Code2,
    label: 'EXPERIMENT',
    title: 'Experiment',
    desc: 'Test boundaries with hands-on projects, new frameworks, and emerging technologies.'
  },
  {
    id: 'impact',
    icon: Target,
    label: 'IMPACT',
    title: 'Impact',
    desc: 'Create solutions that generate real social and technological value for the community.'
  }
];

const WHAT_WE_AIM_FOR = [
  {
    icon: Lightbulb,
    label: '01',
    title: 'Technical Innovation',
    desc: 'Empower students to push boundaries and build creative technical solutions.'
  },
  {
    icon: Users,
    label: '02',
    title: 'Collaborative Learning',
    desc: 'Foster an environment where peer-to-peer knowledge sharing accelerates growth.'
  },
  {
    icon: Cpu,
    label: '03',
    title: 'Technical Exposure',
    desc: 'Bridge the gap between theoretical knowledge and modern industry practices.'
  },
  {
    icon: Globe2,
    label: '04',
    title: 'Industry Exposure',
    desc: 'Connect members with professional networks, mentors, and global developer communities.'
  },
  {
    icon: Compass,
    label: '05',
    title: 'Leadership',
    desc: 'Cultivate strong communicators who can lead teams and manage complex projects.'
  },
  {
    icon: Briefcase,
    label: '06',
    title: 'Practical Experience',
    desc: 'Transform ideas into tangible, portfolio-ready projects that demonstrate real capability.'
  }
];

const BEYOND_TECHNICAL = [
  {
    label: 'APPLICATION',
    title: 'Hands-on Experience',
    desc: 'Mastering modern tech stacks through direct, practical application rather than passive study.'
  },
  {
    label: 'CHALLENGES',
    title: 'Problem Solving',
    desc: 'Developing the critical thinking required to architect solutions for complex, real-world challenges.'
  },
  {
    label: 'COMPETITION',
    title: 'Competitive Edge',
    desc: 'Testing limits and refining skills through high-stakes hackathons and innovation challenges.'
  },
  {
    label: 'COMMUNITY',
    title: 'Networking',
    desc: 'Building meaningful connections with seasoned mentors and active developer communities.'
  },
  {
    label: 'SYNERGY',
    title: 'Team Dynamics',
    desc: 'Learning to communicate effectively, resolve conflicts, and drive collaborative success.'
  },
  {
    label: 'FUTURE',
    title: 'Career Readiness',
    desc: 'Translating club experience into the professional confidence needed to excel in the industry.'
  }
];

export default function AboutSection() {
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      const vh = window.innerHeight;

      // Event image parallax - Static scroll effect
      imageInnerRefs.current.forEach((ref) => {
        if (!ref) return;
        const rect = ref.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (elementCenter - vh / 2) / (vh / 2);
        const clampedOffset = Math.max(-1, Math.min(1, offset));
        
        // Move image inside its static frame by +/- 50px based on scroll position
        ref.style.transform = `translateY(${clampedOffset * 50}px)`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    // Intersection Observer for Chronology & Events Timeline Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -50px 0px' }
    );

    storyRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    eventRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ab-container">
      {/* SECTION 1: HERO */}
      <section className="ab-card ab-hero-card" aria-label="Who We Are">
        <div className="ab-card-glow-ring" aria-hidden="true" />
        
        <div className="ab-hero-content">
          <h1 className="ab-hero-title">
            Who We <span className="ab-text-emerald">Are.</span>
          </h1>
          <p className="ab-hero-description">
            Developer Students Club (DSC) is a student-driven technology community at SRM Institute of Science and Technology, Ramapuram Campus.
          </p>
          <p className="ab-hero-sub-description">
            The club brings together students from diverse domains, including software development, data science, design, and operations. Through workshops, hackathons, competitions, technical sessions, and collaborative projects, DSC creates opportunities for students to explore emerging technologies, gain hands-on experience, and solve real-world problems.
          </p>
          <p className="ab-hero-heritage-note">
            The club was originally established as the Google Developer Students Club (GDSC) and later evolved into the Developer Students Club (DSC) while continuing its focus on technical learning, collaboration, and innovation.
          </p>
        </div>

        <div className="ab-hero-image-wrap">
          <img
            src="/about/Screenshot 2026-08-09 224723.png"
            alt="Developer Students Club Community"
            className="ab-hero-img"
            loading="lazy"
            decoding="async"
          />
          <div className="ab-hero-image-overlay" aria-hidden="true" />
        </div>
      </section>

      {/* SECTION 2: MISSION & STATS GRID */}
      <section className="ab-grid-mission-stats" aria-label="Mission and Statistics">
        <div className="ab-card ab-mission-card">
          <div className="ab-card-glow-ring" aria-hidden="true" />
          <div className="ab-card-header">
            <span className="ab-pill">OUR MISSION</span>
          </div>
          <h2 className="ab-card-heading">
            Empowering students with skills, knowledge, and network.
          </h2>
          <p className="ab-card-body">
            To empower students with the skills, knowledge, and network needed to excel in the
            rapidly evolving industry. We believe in hands-on learning, collaborative growth, and
            building solutions that make a real impact.
          </p>
        </div>

        <div className="ab-stats-grid">
          <div className="ab-card ab-stat-card">
            <div className="ab-card-glow-ring" aria-hidden="true" />
            <span className="ab-stat-number">1100+</span>
            <span className="ab-stat-label">Community Members</span>
          </div>
          <div className="ab-card ab-stat-card">
            <div className="ab-card-glow-ring" aria-hidden="true" />
            <span className="ab-stat-number">2400+</span>
            <span className="ab-stat-label">Unique Attendees</span>
          </div>
          <div className="ab-card ab-stat-card">
            <div className="ab-card-glow-ring" aria-hidden="true" />
            <span className="ab-stat-number">60+</span>
            <span className="ab-stat-label">Technical Events</span>
          </div>
          <div className="ab-card ab-stat-card">
            <div className="ab-card-glow-ring" aria-hidden="true" />
            <span className="ab-stat-number">20+</span>
            <span className="ab-stat-label">Community Support</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW WE STARTED (OUR STORY TIMELINE) */}
      <section className="ab-story-section" aria-label="How We Started">
        <div className="ab-section-header">
          <span className="ab-pill">CHRONOLOGY</span>
          <h2 className="ab-section-heading">
            How we <span className="ab-text-emerald">started.</span>
          </h2>
          <p className="ab-section-sub">
            A timeline of our community journey from founding initiatives to national hackathons.
          </p>
        </div>

        <div className="ab-story-timeline">
          <div className="ab-story-line" />
          {STORY_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className={`ab-story-item ${idx % 2 === 0 ? 'ab-story-left' : 'ab-story-right'}`}
              ref={(el) => {
                storyRefs.current[idx] = el;
              }}
            >
              <div className="ab-story-dot">{item.year}</div>
              <div className="ab-card ab-story-card">
                <div className="ab-card-glow-ring" aria-hidden="true" />
                <div className="ab-story-card-head">
                  <span className="ab-story-year-tag">{item.year}</span>
                  {item.tag && <span className="ab-tag">{item.tag}</span>}
                </div>
                <h3 className="ab-story-card-title">{item.title}</h3>
                <p className="ab-story-card-desc">{item.description}</p>
                {item.badge && (
                  <div className="ab-badges-wrap">
                    <span className="ab-event-badge">{item.badge}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: RECENT EVENTS (LEFT-SPINE TRACK WITH SCROLL PARALLAX) */}
      <section className="ab-events-section" aria-label="Recent Events">
        <div className="ab-section-header">
          <span className="ab-pill">RECENT EVENTS</span>
          <h2 className="ab-section-heading">
            Moments that <span className="ab-text-emerald">shaped us.</span>
          </h2>
          <p className="ab-section-sub">
            A glimpse into the flagship hackathons and technical competitions from our community.
          </p>
        </div>

        <div className="ab-events-timeline-wrap">
          <div className="ab-events-spine" />

          {RECENT_EVENTS.map((event, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={event.id}
                className={`ab-event-timeline-row ${event.isUpcoming ? 'ab-event-row-upcoming' : ''}`}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
              >
                <div
                  className={`ab-event-left-marker ${
                    event.isUpcoming ? 'ab-marker-upcoming' : ''
                  }`}
                >
                  <span>{event.num}</span>
                </div>

                <div
                  className={`ab-card ab-event-card ${isReversed ? 'ab-event-card-rev' : ''} ${
                    event.isUpcoming ? 'ab-event-card-upcoming' : ''
                  }`}
                >
                  <div className="ab-card-glow-ring" aria-hidden="true" />

                  <div className="ab-event-image-frame">
                    <div
                      className="ab-event-image-inner"
                      ref={(el) => {
                        imageInnerRefs.current[index] = el;
                      }}
                    >
                      <img src={event.image} alt={event.title} className="ab-event-img" />
                    </div>
                    <div className="ab-event-image-overlay" />
                  </div>

                  <div className="ab-event-details">
                    <div className="ab-event-meta">
                      <span
                        className={`ab-tag ${
                          event.isUpcoming ? 'ab-tag-upcoming' : ''
                        }`}
                      >
                        {event.tag}
                      </span>
                      <span className="ab-date">{event.date}</span>
                    </div>

                    <h3 className="ab-event-title">{event.title}</h3>
                    <p className="ab-event-desc">{event.description}</p>

                    <div className="ab-badges-wrap">
                      {event.badges.map((badge, bIdx) => (
                        <span key={bIdx} className="ab-event-badge">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: VISION & IDENTITY */}
      <section className="ab-vision-identity-section" aria-label="Vision and Identity">
        <div className="ab-card ab-vision-featured-block">
          <div className="ab-card-glow-ring" aria-hidden="true" />
          <span className="ab-pill">VISION</span>
          <h2 className="ab-vision-headline">
            To build a vibrant student community where everyone has the opportunity to learn, create, collaborate, and lead.
          </h2>
          <p className="ab-vision-subtext">
            A space to explore ideas, build skills, and grow together beyond the classroom.
          </p>
        </div>

        <div className="ab-identity-grid">
          {IDENTITY_CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="ab-card ab-identity-card">
                <div className="ab-card-glow-ring" aria-hidden="true" />
                <div className="ab-identity-icon-box">
                  <Icon color="#1dd1a1" size={20} />
                </div>
                <div className="ab-identity-content">
                  <span className="ab-identity-label">{item.label}</span>
                  <h3 className="ab-identity-title">{item.title}</h3>
                  <p className="ab-identity-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ATMOSPHERIC TRANSITION */}
      <div className="ab-atmospheric-divider" aria-hidden="true">
        <div className="ab-glow-orb" />
      </div>

      {/* SECTION 6: WHAT WE AIM FOR */}
      <section className="ab-features-section" aria-label="What We Aim For">
        <div className="ab-section-header ab-chapter-header">
          <span className="ab-pill">CORE GOALS</span>
          <h2 className="ab-section-heading">What We Aim For</h2>
          <p className="ab-section-sub">
            The foundational principles that drive our community initiatives and technical programs.
          </p>
        </div>
        <div className="ab-aim-grid">
          {WHAT_WE_AIM_FOR.map((aim, idx) => {
            const Icon = aim.icon;
            return (
              <div key={idx} className="ab-card ab-aim-card">
                <div className="ab-card-glow-ring" aria-hidden="true" />
                <div className="ab-aim-card-top">
                  <div className="ab-aim-icon-box">
                    <Icon color="#1dd1a1" size={20} />
                  </div>
                  <span className="ab-aim-num">{aim.label}</span>
                </div>
                <h3 className="ab-aim-title">{aim.title}</h3>
                <p className="ab-aim-desc">{aim.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: MORE THAN TECHNICAL SKILLS */}
      <section className="ab-features-section" aria-label="More Than Technical Skills">
        <div className="ab-section-header">
          <span className="ab-pill">HOLISTIC DEVELOPMENT</span>
          <h2 className="ab-section-heading">More Than Technical Skills</h2>
          <p className="ab-section-sub">
            Building the communication, leadership, and professional confidence needed to excel in the industry.
          </p>
        </div>
        <div className="ab-beyond-grid">
          {BEYOND_TECHNICAL.map((item, idx) => (
            <div key={idx} className="ab-card ab-beyond-card">
              <div className="ab-card-glow-ring" aria-hidden="true" />
              <span className="ab-beyond-label">{item.label}</span>
              <h3 className="ab-beyond-title">{item.title}</h3>
              <p className="ab-beyond-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL ATMOSPHERIC TRANSITION BEFORE FOOTER */}
      <div className="ab-atmospheric-divider" aria-hidden="true" style={{ marginBottom: 0, marginTop: '24px' }}>
        <div className="ab-glow-orb" style={{ opacity: 0.6 }} />
      </div>
    </div>
  );
}
