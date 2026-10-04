import MobileNav, { type NavKey } from './MobileNav';

interface Props {
  active?: NavKey;
}

export default function Header({ active }: Props) {
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
      {/* Desktop Navigation Header */}
      <header className="home-nav-header hidden md:grid">
        {/* Desktop Logo */}
        <a href="/" className="home-nav-logo">
          <img src="/logo/club-logo.webp" alt="DSC Logo" />
        </a>

        {/* Desktop Nav Pill */}
        <nav className="home-nav-pill">
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
        <div className="home-nav-cta">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTb-CX5O1emu3Nnl-by9FRGVlEOTIwyZBoVxsm2t46eZdbFg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="home-join-btn"
          >
            Join Us
          </a>
        </div>
      </header>

      {/* Mobile Liquid Glass Top Navigation Bar */}
      <MobileNav active={active} />
    </>
  );
}
