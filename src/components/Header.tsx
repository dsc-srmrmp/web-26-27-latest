import { useState, useEffect } from 'react';

interface Props {
  active?: 'home' | 'about' | 'domains' | 'gallery' | 'team' | 'contact';
}

export default function Header({ active }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', key: 'home' },
    { name: 'About', href: '/about', key: 'about' },
    { name: 'Domains', href: '/domains', key: 'domains' },
    { name: 'Gallery', href: '/gallery', key: 'gallery' },
    { name: 'Team', href: '/team', key: 'team' },
    { name: 'Contact', href: '/contact', key: 'contact' },
  ];


  return (
    <>
      {/* Navigation Header */}
      <header className="home-nav-header">
        {/* Desktop Logo */}
        <a href="/" className="home-nav-logo hidden md:flex">
          <img src="/logo/club-logo.webp" alt="DSC Logo" />
        </a>

        {/* Desktop Nav Pill */}
        <nav className="home-nav-pill hidden md:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={active === link.key ? 'active' : ''}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="home-nav-cta hidden md:flex">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTb-CX5O1emu3Nnl-by9FRGVlEOTIwyZBoVxsm2t46eZdbFg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="home-join-btn"
          >
            Join Us
          </a>
        </div>

        {/* Floating Mobile Top Navigation Bar (< 768px) */}
        <div className={`mobile-floating-nav-bar md:hidden ${menuOpen ? 'nav-active' : ''}`}>
          <a href="/" className="mobile-nav-logo-link" aria-label="DSC Home">
            <span className="mobile-nav-brand-text">DSC</span>
          </a>

          <div className="mobile-nav-actions">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfTb-CX5O1emu3Nnl-by9FRGVlEOTIwyZBoVxsm2t46eZdbFg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-join-pill"
            >
              Join Us
            </a>
            <button
              className={`mobile-nav-toggle-btn ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="7" />
                  <line x1="4" x2="20" y1="12" />
                  <line x1="4" x2="20" y1="17" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-menu-backdrop md:hidden ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Dropdown Modal Sheet */}
      <div
        className={`mobile-menu-sheet md:hidden ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="mobile-menu-sheet-inner">
          <div className="mobile-menu-sheet-header">
            <span className="mobile-menu-sheet-title">Navigation</span>
          </div>

          <div className="mobile-menu-links-list">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className={`mobile-menu-link-item ${active === link.key ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="mobile-link-name">{link.name}</span>
                {active === link.key ? (
                  <span className="mobile-active-dot" />
                ) : (
                  <svg className="mobile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <div className="mobile-menu-sheet-footer">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfTb-CX5O1emu3Nnl-by9FRGVlEOTIwyZBoVxsm2t46eZdbFg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-sheet-cta-btn"
              onClick={closeMenu}
            >
              <span>Join Us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
