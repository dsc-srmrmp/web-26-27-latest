import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type SocialType = 'email' | 'instagram' | 'linkedin' | 'twitter' | 'whatsapp' | 'discord';

interface Props {
  type: SocialType;
  href: string;
  value: string;
  label: string;
  className?: string;
}

const TARGET_WIDTHS: Record<SocialType, number> = {
  email:     215,
  instagram: 195,
  linkedin:  205,
  twitter:   140,
  whatsapp:  295,
  discord:   235,
};

function Icon({ type }: { type: SocialType }) {
  if (type === 'email') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  if (type === 'instagram') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
  if (type === 'linkedin') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
  if (type === 'twitter') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (type === 'whatsapp') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512" fill="currentColor">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
  if (type === 'discord') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
  return null;
}

export default function SocialIconBtn({ type, href, value, label, className = '' }: Props) {
  const btnRef  = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn  = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    function onEnter() {
      gsap.killTweensOf([btn, text]);
      let targetWidth = TARGET_WIDTHS[type] || 160;
      if (text) {
        text.style.display = 'inline-block';
        const measured = text.scrollWidth + 56;
        if (measured > targetWidth) targetWidth = measured;
      }
      gsap.to(btn, {
        width: targetWidth,
        borderColor: 'var(--accent-glow, #1dd1a1)',
        color: 'var(--accent-glow, #1dd1a1)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(29, 209, 161, 0.25)',
        duration: 0.55,
        ease: 'power3.out',
      });
      gsap.fromTo(
        text,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.05, ease: 'power3.out' }
      );
    }

    function onLeave() {
      gsap.killTweensOf([btn, text]);
      gsap.to(text, {
        opacity: 0,
        x: -6,
        duration: 0.25,
        ease: 'power3.out',
        onComplete: () => { if (text) text.style.display = 'none'; },
      });
      gsap.to(btn, {
        width: 46,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        color: 'var(--text-color, #ffffff)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        duration: 0.5,
        ease: 'power3.out',
      });
    }

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, [type]);

  return (
    <a
      ref={btnRef}
      href={href}
      aria-label={label}
      className={`social-icon-btn ${className}`}
      data-type={type}
      target={type !== 'email' ? '_blank' : undefined}
      rel={type !== 'email' ? 'noopener noreferrer' : undefined}
    >
      <span className="btn-icon-wrap">
        <Icon type={type} />
      </span>
      <span ref={textRef} className="btn-text">{value}</span>
    </a>
  );
}
