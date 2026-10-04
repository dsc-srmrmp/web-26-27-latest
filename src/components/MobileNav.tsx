import { useState, useEffect } from 'react';

export type NavKey = 'home' | 'about' | 'domains' | 'gallery' | 'team' | 'contact';

interface Props {
  active?: NavKey;
}

interface NavItem {
  key: NavKey;
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { key: 'home', name: 'Home', href: '/' },
  { key: 'about', name: 'About', href: '/about' },
  { key: 'domains', name: 'Domains', href: '/domains' },
  { key: 'gallery', name: 'Gallery', href: '/gallery' },
  { key: 'team', name: 'Team', href: '/team' },
  { key: 'contact', name: 'Contact', href: '/contact' },
];

export default function MobileNav({ active = 'home' }: Props) {
  const [selected, setSelected] = useState<NavKey>(active);

  useEffect(() => {
    if (active) {
      setSelected(active);
    }
  }, [active]);

  const renderIcon = (key: NavKey, isActive: boolean) => {
    switch (key) {
      case 'home':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? '1.5' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
          </svg>
        );
      case 'about':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={isActive ? 'currentColor' : 'none'} />
          </svg>
        );
      case 'domains':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? '1.5' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        );
      case 'gallery':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill={isActive ? 'currentColor' : 'none'} />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      case 'team':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" fill={isActive ? 'currentColor' : 'none'} />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'contact':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="mobile-glass-nav md:hidden" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const isActive = selected === item.key;
        return (
          <a
            key={item.key}
            href={item.href}
            className={`mobile-glass-tab ${isActive ? 'active' : ''}`}
            onClick={() => setSelected(item.key)}
            aria-label={item.name}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tab-icon">
              {renderIcon(item.key, isActive)}
            </span>
            <span className="tab-label">
              {item.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
