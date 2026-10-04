import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  bgColor: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Joining DSC was the turning point in my college life. The workshops gave me hands-on experience that no classroom could, and the mentorship helped me land my first internship at a top tech company.',
    author: 'Arjun Raghav',
    role: 'Former Lead, DSC SRM IST Ramapuram',
    bgColor: '#c8dfd7',
  },
  {
    quote:
      'The collaborative environment at DSC pushed me to build real projects. From hackathons to open-source contributions, every experience here shaped me into a confident developer.',
    author: 'Priya Sharma',
    role: 'Full Stack Developer, Alumni',
    bgColor: '#b8c9a3',
  },
  {
    quote:
      'DSC connected me with a global network of developers. The study jams and code labs made complex Google technologies feel approachable and exciting to learn.',
    author: 'Karthik Venkat',
    role: 'Software Engineer, Alumni',
    bgColor: '#8b7d6b',
  },
];

export default function MemberTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      // If clicking the active card, advance to the next one
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      // If clicking a card behind, bring it to the front
      setActiveIndex(index);
    }
  };

  return (
    <section className="member-testimonials-section">
      <div className="mt-inner">
        {/* Left side — Heading & description */}
        <div className="mt-left">
          <h2 className="mt-heading">
            Trusted by students
            <br />
            and innovators.
          </h2>
          <p className="mt-description">
            Developer Students Club empowers students at SRM IST
            Ramapuram to learn, grow, and build impactful tech
            solutions together.
          </p>
        </div>

        {/* Right side — Stacked testimonial cards */}
        <div className="mt-right">
          <div className="mt-card-stack">
            {testimonials.map((t, i) => {
              const offset = (i - activeIndex + testimonials.length) % testimonials.length;
              return (
                <div
                  key={i}
                  className={`mt-card ${offset === 0 ? 'mt-card-active' : ''}`}
                  style={{
                    backgroundColor: t.bgColor,
                    zIndex: testimonials.length - offset,
                    ['--offset' as any]: offset,
                    opacity: offset > 2 ? 0 : 1 - offset * 0.15,
                    transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  onClick={() => handleCardClick(i)}
                >
                  <span className="mt-quote-mark mt-quote-open">&ldquo;</span>
                  <blockquote className="mt-card-quote">{t.quote}</blockquote>
                  <p className="mt-card-author">
                    — {t.author}, {t.role}
                  </p>
                  <span className="mt-quote-mark mt-quote-close">&rdquo;</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
