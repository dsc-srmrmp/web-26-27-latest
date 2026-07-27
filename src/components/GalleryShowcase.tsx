import { useState, useEffect, useRef, useCallback } from 'react';

// ── Gallery Data ──────────────────────────────────────────────
interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
  featured?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: '/gallery/hackathon.png',
    title: 'TechHack 2025',
    category: 'Hackathons',
    description: '36-hour hackathon with 200+ participants',
    featured: true,
  },
  {
    id: 2,
    src: '/gallery/workshop.png',
    title: 'AI/ML Workshop',
    category: 'Workshops',
    description: 'Hands-on deep learning with TensorFlow',
  },
  {
    id: 3,
    src: '/gallery/design.png',
    title: 'Design Sprint',
    category: 'Design',
    description: 'Weekend UI/UX design thinking session',
  },
  {
    id: 4,
    src: '/gallery/community.png',
    title: 'Community Meetup',
    category: 'Community',
    description: 'Monthly chapter meetup & networking',
    featured: true,
  },
  {
    id: 5,
    src: '/gallery/awards.png',
    title: 'Awards Ceremony',
    category: 'Community',
    description: 'Celebrating excellence and innovation',
  },
  {
    id: 6,
    src: '/gallery/networking.png',
    title: 'Dev Networking Night',
    category: 'Community',
    description: 'Connect with developers across chapters',
  },
];

const CATEGORIES = ['All', 'Hackathons', 'Workshops', 'Design', 'Community'];

const VIDEO_REELS = [
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4',
    label: 'Hackfest Highlights',
  },
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260429_171347_f640c30d-ec21-426a-98bc-77e07c2c60cb.mp4',
    label: 'Workshop Moments',
  },
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4',
    label: 'Team Building',
  },
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4',
    label: 'CodeSprint Recap',
  },
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4',
    label: 'Community Day',
  },
  {
    src: 'https://cdn.developerstudents.club/gallery/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4',
    label: 'Launch Event',
  },
];

// ── Component ─────────────────────────────────────────────────
export default function GalleryShowcase() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });
  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRefsMap = useRef<Map<number, HTMLVideoElement>>(new Map());

  // Filtered items
  const filteredItems =
    activeFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  // Staggered reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox({ open: false, index: 0 });
      if (lightbox.open && e.key === 'ArrowRight') navigateLightbox(1);
      if (lightbox.open && e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox]);

  // Intersection observer for video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '50px', threshold: 0.3 }
    );

    videoRefsMap.current.forEach((video) => {
      observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  const navigateLightbox = useCallback(
    (direction: number) => {
      setLightbox((prev) => {
        const newIndex =
          (prev.index + direction + filteredItems.length) % filteredItems.length;
        return { ...prev, index: newIndex };
      });
    },
    [filteredItems.length]
  );

  const openLightbox = (index: number) => {
    setLightbox({ open: true, index });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, index: lightbox.index });
  };

  const currentLightboxItem = filteredItems[lightbox.index];

  return (
    <>
      {/* ── Filter Pills ── */}
      <div
        className="gallery-filters"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Masonry Grid ── */}
      <div
        ref={gridRef}
        className="gallery-masonry"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
        }}
      >
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className="gallery-masonry-item"
            onClick={() => openLightbox(idx)}
            style={{
              animationDelay: `${idx * 80}ms`,
            }}
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              decoding="async"
            />
            <div className="gallery-masonry-caption">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats Strip ── */}
      <div
        className="gallery-stats-strip"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
        }}
      >
        <div className="gallery-stat">
          <span className="gallery-stat-number">20+</span>
          <span className="gallery-stat-label">Events Held</span>
        </div>
        <div className="gallery-stat">
          <span className="gallery-stat-number">500+</span>
          <span className="gallery-stat-label">Participants</span>
        </div>
        <div className="gallery-stat">
          <span className="gallery-stat-number">50+</span>
          <span className="gallery-stat-label">Workshops</span>
        </div>
        <div className="gallery-stat">
          <span className="gallery-stat-number">5</span>
          <span className="gallery-stat-label">Hackathons</span>
        </div>
      </div>

      {/* ── Video Reel ── */}
      <div
        className="video-reel-header"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
        }}
      >
        <h3 className="video-reel-title">Event Reels</h3>
        <span className="video-reel-subtitle">
          Scroll to explore our recent highlights →
        </span>
      </div>

      <div
        className="video-reel-scroll"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
        }}
      >
        {VIDEO_REELS.map((reel, idx) => (
          <div key={idx} className="video-reel-card">
            <video
              ref={(el) => {
                if (el) videoRefsMap.current.set(idx, el);
              }}
              src={reel.src}
              loop
              muted
              playsInline
              preload="metadata"
            />
            <span className="video-reel-label">{reel.label}</span>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <div
        className={`gallery-lightbox ${lightbox.open ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        {currentLightboxItem && (
          <div className="lightbox-inner">
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <img
              src={currentLightboxItem.src}
              alt={currentLightboxItem.title}
            />

            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="lightbox-caption">
              <h3>{currentLightboxItem.title}</h3>
              <p>{currentLightboxItem.description}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
