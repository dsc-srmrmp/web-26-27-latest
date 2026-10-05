import SocialIconBtn from './SocialIconBtn';

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
          background: url('/bg/students_renaissance.jpg') center 35%/cover no-repeat;
          color: #e8ede9;
          text-align: center;
          overflow: hidden;
          z-index: 2;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
        }

        /* Atmospheric Renaissance Chiaroscuro & Emerald Obsidian Veil */
        .join-chiaroscuro-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 1100px 650px at 50% 50%, rgba(8, 13, 11, 0.62) 0%, rgba(5, 19, 16, 0.85) 60%, rgba(8, 13, 11, 0.96) 100%),
            linear-gradient(to bottom, rgba(8, 13, 11, 0.92) 0%, rgba(5, 19, 16, 0.45) 45%, rgba(3, 13, 15, 0.92) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Renaissance Classical Plinth / Emerald Obsidian Tablet */
        .join-card {
          max-width: 860px;
          margin: 0 auto;
          background: linear-gradient(155deg, rgba(14, 22, 18, 0.88) 0%, rgba(7, 13, 11, 0.95) 100%);
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

        /* Social Icons Row (Identical aesthetics to /contact page) */
        .contact-socials-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 38px;
          position: relative;
          z-index: 10;
        }

        .social-icon-btn {
          width: 46px;
          height: 46px;
          border-radius: 23px;
          background: rgba(17, 23, 20, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          color: #ffffff;
          text-decoration: none;
          padding: 0 12px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        .social-icon-btn:hover {
          transform: translateY(-2px);
        }

        .btn-icon-wrap {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .social-icon-btn svg {
          display: block;
          width: 20px;
          height: 20px;
          color: inherit;
        }

        .btn-text {
          display: none;
          opacity: 0;
          margin-left: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #ffffff;
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
          .contact-socials-row {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>

      {/* Atmospheric Chiaroscuro & Renaissance Art Veil */}
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

        {/* Accurate Subtext */}
        <p className="join-subtext">
          A student-driven community to learn, collaborate, and build impactful technology solutions together at SRM IST Ramapuram. Connect across our channels and grow with us.
        </p>

        {/* 3 Interactive Expanding Social Buttons: Instagram, WhatsApp, Discord */}
        <div className="contact-socials-row">
          <SocialIconBtn
            type="instagram"
            href="https://instagram.com/dscsrmrmp"
            value="Follow us on Insta"
            label="Instagram"
          />
          <SocialIconBtn
            type="whatsapp"
            href="https://whatsapp.com/channel/0029VbCeeKIBPzjgb6gesn26"
            value="Join our WhatsApp Community"
            label="WhatsApp Community"
          />
          <SocialIconBtn
            type="discord"
            href="https://discord.gg/W2hS5ka5T6"
            value="Join our Discord Server"
            label="Discord Server"
          />
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
