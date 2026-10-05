interface Props {
  className?: string;
}

export default function JoinCommunitySection({ className = '' }: Props) {
  return (
    <section className={`join-section ${className}`} id="join">
      <style>{`
        .join-section {
          position: relative;
          width: 100%;
          padding: 120px 24px 140px;
          margin-top: -60px;
          background: #080d0b;
          color: #e8ede9;
          text-align: center;
          overflow: hidden;
          z-index: 2;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
        }

        /* Ambient Renaissance Artwork & Emerald Obsidian Chiaroscuro */
        .join-art-backdrop {
          position: absolute;
          inset: 0;
          background: url('/bg/renaissance_academy.jpg') center 40%/cover no-repeat;
          opacity: 0.18;
          mix-blend-mode: luminosity;
          filter: grayscale(40%) contrast(1.15);
          pointer-events: none;
          z-index: 0;
        }

        .join-chiaroscuro-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 950px 550px at 50% 50%, rgba(29, 209, 161, 0.12) 0%, rgba(5, 19, 16, 0.75) 50%, rgba(8, 13, 11, 0.98) 100%),
            linear-gradient(to bottom, #080d0b 0%, rgba(5, 19, 16, 0.6) 45%, #030d0f 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Renaissance Classical Plinth / Emerald Obsidian Tablet */
        .join-card {
          max-width: 860px;
          margin: 0 auto;
          background: linear-gradient(155deg, rgba(14, 22, 18, 0.85) 0%, rgba(7, 13, 11, 0.95) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(29, 209, 161, 0.28);
          border-radius: 20px;
          padding: 64px 48px;
          position: relative;
          z-index: 3;
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.85),
            0 0 50px rgba(29, 209, 161, 0.08),
            inset 0 1px 2px rgba(255, 255, 255, 0.16),
            inset 0 0 0 1px rgba(29, 209, 161, 0.12);
        }

        /* Inner Classical Molding Inset Border */
        .join-card::before {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(29, 209, 161, 0.16);
          border-radius: 12px;
          pointer-events: none;
          z-index: 1;
        }

        /* Classical Florentine Ornate Corner Flourishes */
        .join-corner-flourish {
          position: absolute;
          width: 36px;
          height: 36px;
          pointer-events: none;
          z-index: 2;
          color: #1dd1a1;
          opacity: 0.65;
        }
        .join-corner-tl { top: 16px; left: 16px; }
        .join-corner-tr { top: 16px; right: 16px; transform: scaleX(-1); }
        .join-corner-bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
        .join-corner-br { bottom: 16px; right: 16px; transform: scale(-1); }

        /* High Renaissance Editorial Headline */
        .join-headline {
          font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
          font-size: clamp(2.3rem, 4.2vw, 3.6rem);
          font-weight: 500;
          font-style: normal;
          letter-spacing: -0.015em;
          line-height: 1.2;
          color: #ffffff;
          margin: 0 0 22px 0;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.7), 0 0 35px rgba(29, 209, 161, 0.15);
        }

        .join-headline .renaissance-emphasis {
          font-style: italic;
          color: #1dd1a1;
          font-weight: 400;
          white-space: nowrap;
          text-shadow: 0 0 25px rgba(29, 209, 161, 0.35);
        }

        /* Classical Warm Parchment / Alabaster Subtext */
        .join-subtext {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.25vw, 17.5px);
          line-height: 1.72;
          color: rgba(232, 237, 233, 0.78);
          max-width: 620px;
          margin: 0 auto 38px auto;
          font-weight: 400;
        }

        /* Social Interactive Row */
        .join-socials-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 38px;
        }

        /* Interactive Social Pill Button */
        .social-pill-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          padding: 0 18px;
          border-radius: 9999px;
          background: rgba(14, 23, 19, 0.85);
          border: 1px solid rgba(29, 209, 161, 0.28);
          color: #e8ede9;
          text-decoration: none;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-pill-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .social-pill-label {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          margin-left: 0;
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #ffffff;
          transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin-left 0.3s ease;
        }

        .social-pill-arrow {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          margin-left: 0;
          flex-shrink: 0;
          transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin-left 0.3s ease, transform 0.3s ease;
        }

        /* Hover Expansion on Desktop */
        .social-pill-btn:hover {
          padding: 0 24px;
          transform: translateY(-2px);
        }

        .social-pill-btn:hover .social-pill-label {
          max-width: 280px;
          opacity: 1;
          margin-left: 11px;
        }

        .social-pill-btn:hover .social-pill-arrow {
          max-width: 20px;
          opacity: 0.9;
          margin-left: 8px;
          transform: translateX(2px);
        }

        .social-pill-btn:hover .social-pill-icon {
          transform: scale(1.12);
        }

        /* Brand Colors on Hover */
        /* WhatsApp: Emerald / Mint Glow */
        .social-whatsapp .social-pill-icon {
          color: #1dd1a1;
        }
        .social-whatsapp:hover {
          background: rgba(29, 209, 161, 0.16);
          border-color: rgba(29, 209, 161, 0.7);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(29, 209, 161, 0.35);
        }

        /* Instagram: Radiant Sunset Gradient Glow */
        .social-insta .social-pill-icon {
          color: #f472b6;
        }
        .social-insta:hover {
          background: rgba(236, 72, 153, 0.14);
          border-color: rgba(244, 114, 182, 0.65);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
        }
        .social-insta:hover .social-pill-icon {
          color: #fb7185;
        }

        /* Discord: Blurple / Cyan Glow */
        .social-discord .social-pill-icon {
          color: #38bdf8;
        }
        .social-discord:hover {
          background: rgba(56, 189, 248, 0.14);
          border-color: rgba(56, 189, 248, 0.65);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.3);
        }
        .social-discord:hover .social-pill-icon {
          color: #7dd3fc;
        }

        /* Classical Ornamental Divider Rule */
        .join-divider-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 85%;
          max-width: 520px;
          margin: 0 auto 24px auto;
        }

        .join-divider-ornament::before,
        .join-divider-ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(29, 209, 161, 0.35), transparent);
        }

        .join-divider-glyph {
          color: #1dd1a1;
          font-size: 13px;
          opacity: 0.85;
        }

        /* Renaissance Scholarly Colophon Bar */
        .join-location-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: rgba(232, 237, 233, 0.7);
          line-height: 1.55;
        }

        .join-location-bar strong {
          color: #1dd1a1;
          font-weight: 600;
        }

        .join-address-sub {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 13px;
          letter-spacing: 0.06em;
          color: rgba(29, 209, 161, 0.85);
        }

        @media (max-width: 640px) {
          .join-section {
            padding: 80px 16px 100px;
            margin-top: -30px;
          }
          .join-card {
            padding: 44px 20px 36px;
            border-radius: 16px;
          }
          .join-card::before {
            inset: 7px;
          }
          .join-corner-flourish {
            width: 26px;
            height: 26px;
          }
          .join-corner-tl { top: 10px; left: 10px; }
          .join-corner-tr { top: 10px; right: 10px; }
          .join-corner-bl { bottom: 10px; left: 10px; }
          .join-corner-br { bottom: 10px; right: 10px; }
          .join-headline {
            font-size: 2.15rem;
          }
          .join-socials-row {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          .social-pill-btn {
            width: 100%;
            justify-content: flex-start;
            padding: 0 20px;
            height: 52px;
            border-radius: 12px;
          }
          .social-pill-label {
            max-width: none !important;
            opacity: 1 !important;
            margin-left: 12px !important;
          }
          .social-pill-arrow {
            max-width: none !important;
            opacity: 0.8 !important;
            margin-left: auto !important;
          }
        }
      `}</style>

      {/* Atmospheric Chiaroscuro & Emerald Obsidian Backdrop */}
      <div className="join-art-backdrop" />
      <div className="join-chiaroscuro-overlay" />

      {/* Renaissance Plinth / Emerald Obsidian Tablet */}
      <div className="join-card">
        {/* Classical Florentine Ornate Corner Flourishes */}
        <svg className="join-corner-flourish join-corner-tl" viewBox="0 0 40 40" fill="none">
          <path d="M4 36V12C4 7.58172 7.58172 4 12 4H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 36V16C10 12.6863 12.6863 10 16 10H36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.2" fill="currentColor" />
          <path d="M16 8C19 10 22 10 25 9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M8 16C10 19 10 22 9 25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
        </svg>
        <svg className="join-corner-flourish join-corner-tr" viewBox="0 0 40 40" fill="none">
          <path d="M4 36V12C4 7.58172 7.58172 4 12 4H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 36V16C10 12.6863 12.6863 10 16 10H36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.2" fill="currentColor" />
          <path d="M16 8C19 10 22 10 25 9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M8 16C10 19 10 22 9 25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
        </svg>
        <svg className="join-corner-flourish join-corner-bl" viewBox="0 0 40 40" fill="none">
          <path d="M4 36V12C4 7.58172 7.58172 4 12 4H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 36V16C10 12.6863 12.6863 10 16 10H36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.2" fill="currentColor" />
          <path d="M16 8C19 10 22 10 25 9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M8 16C10 19 10 22 9 25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
        </svg>
        <svg className="join-corner-flourish join-corner-br" viewBox="0 0 40 40" fill="none">
          <path d="M4 36V12C4 7.58172 7.58172 4 12 4H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 36V16C10 12.6863 12.6863 10 16 10H36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.2" fill="currentColor" />
          <path d="M16 8C19 10 22 10 25 9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
          <path d="M8 16C10 19 10 22 9 25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" />
        </svg>

        {/* Stately Renaissance Headline */}
        <h2 className="join-headline">
          Ready to <span className="renaissance-emphasis">build with us</span>
          <br />
          this semester?
        </h2>

        {/* Updated Accurate Subtext */}
        <p className="join-subtext">
          A student-driven community to learn, collaborate, and build impactful technology solutions together at SRM IST Ramapuram. Connect across our channels and grow with us.
        </p>

        {/* 3 Interactive Expanding Social Buttons: Instagram, WhatsApp, Discord */}
        <div className="join-socials-row">
          {/* Instagram */}
          <a
            href="https://instagram.com/dscsrmrmp"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn social-insta"
            aria-label="Follow us on Instagram"
          >
            <span className="social-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </span>
            <span className="social-pill-label">Follow us on Insta</span>
            <svg className="social-pill-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn social-whatsapp"
            aria-label="Join our WhatsApp Community"
          >
            <span className="social-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </span>
            <span className="social-pill-label">Join our WhatsApp Community</span>
            <svg className="social-pill-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn social-discord"
            aria-label="Join our Discord Server"
          >
            <span className="social-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </span>
            <span className="social-pill-label">Join our Discord Server</span>
            <svg className="social-pill-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Classical Ornamental Divider Rule */}
        <div className="join-divider-ornament">
          <span className="join-divider-glyph">✦</span>
        </div>

        {/* Renaissance Scholarly Colophon */}
        <div className="join-location-bar">
          <div>
            Weekly Assemblies: <strong>Every Wednesday at MLCP LAB 1 (Cloud Computing LAB)</strong>
          </div>
          <div className="join-address-sub">
            SRM IST Ramapuram, Chennai, TN, India
          </div>
        </div>
      </div>
    </section>
  );
}
