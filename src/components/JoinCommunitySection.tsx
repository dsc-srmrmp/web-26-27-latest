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
          background: #0d0f0e url('/bg/renaissance_academy.jpg') center 40%/cover no-repeat;
          color: #f7f4ed;
          text-align: center;
          overflow: hidden;
          z-index: 2;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 80px, black calc(100% - 100px), transparent 100%);
        }

        /* Ambient Renaissance Chiaroscuro & Candlelight Glow */
        .join-chiaroscuro-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 1000px 650px at 50% 50%, rgba(220, 180, 70, 0.16) 0%, rgba(28, 22, 16, 0.72) 50%, rgba(10, 12, 11, 0.94) 100%),
            linear-gradient(180deg, rgba(8, 12, 10, 0.82) 0%, rgba(18, 15, 12, 0.5) 45%, rgba(10, 9, 8, 0.88) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Renaissance Classical Plinth / Gilded Guild Tablet */
        .join-card {
          max-width: 860px;
          margin: 0 auto;
          background: linear-gradient(160deg, rgba(28, 24, 20, 0.92) 0%, rgba(16, 14, 12, 0.96) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(212, 175, 55, 0.42);
          border-radius: 20px;
          padding: 64px 52px;
          position: relative;
          z-index: 3;
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.85),
            0 0 50px rgba(212, 175, 55, 0.1),
            inset 0 1px 2px rgba(250, 230, 155, 0.35),
            inset 0 0 0 1px rgba(212, 175, 55, 0.18);
        }

        /* Inner Classical Molding Inset Border */
        .join-card::before {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(212, 175, 55, 0.22);
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
          color: #d4af37;
          opacity: 0.75;
        }
        .join-corner-tl { top: 16px; left: 16px; }
        .join-corner-tr { top: 16px; right: 16px; transform: scaleX(-1); }
        .join-corner-bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
        .join-corner-br { bottom: 16px; right: 16px; transform: scale(-1); }

        /* Renaissance Guild Cartouche Badge */
        .join-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 22px;
          border-radius: 6px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.38);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 12px;
          font-weight: 600;
          color: #edd177;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 28px;
          box-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
        }

        .join-badge-glyph {
          font-size: 11px;
          color: #d4af37;
        }

        /* High Renaissance Editorial Headline */
        .join-headline {
          font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
          font-size: clamp(2.3rem, 4.2vw, 3.6rem);
          font-weight: 500;
          font-style: normal;
          letter-spacing: -0.015em;
          line-height: 1.2;
          color: #f7f4ed;
          margin: 0 0 22px 0;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.2);
        }

        .join-headline .renaissance-emphasis {
          font-style: italic;
          color: #eed688;
          font-weight: 400;
          white-space: nowrap;
        }

        /* Classical Warm Parchment Subtext */
        .join-subtext {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.25vw, 17.5px);
          line-height: 1.72;
          color: rgba(244, 240, 230, 0.84);
          max-width: 620px;
          margin: 0 auto 38px auto;
          font-weight: 400;
        }

        /* CTA Row */
        .join-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 36px;
        }

        /* Primary Gilded Gold Leaf Button */
        .join-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #f5e2a3 0%, #d4af37 45%, #b58d2e 100%);
          color: #1a1408;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 14px 30px;
          border-radius: 8px;
          text-decoration: none;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.45),
            0 0 25px rgba(212, 175, 55, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.55);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }

        .join-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.55),
            0 0 40px rgba(212, 175, 55, 0.6),
            inset 0 1px 1px rgba(255, 255, 255, 0.65);
          filter: brightness(1.06);
        }

        /* Secondary Florentine Bronze / Glass Button */
        .join-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(212, 175, 55, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #ede5d5;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 13px 28px;
          border-radius: 8px;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease, color 0.25s ease;
        }

        .join-btn-secondary:hover {
          background: rgba(212, 175, 55, 0.18);
          border-color: rgba(212, 175, 55, 0.7);
          color: #ffffff;
          transform: translateY(-2px);
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
          background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.38), transparent);
        }

        .join-divider-glyph {
          color: #d4af37;
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
          color: rgba(244, 240, 230, 0.7);
          line-height: 1.55;
        }

        .join-location-bar strong {
          color: #eed688;
          font-weight: 600;
        }

        .join-address-sub {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 13px;
          letter-spacing: 0.06em;
          color: rgba(212, 175, 55, 0.8);
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
          .join-badge {
            font-size: 10.5px;
            letter-spacing: 0.08em;
            padding: 6px 14px;
            gap: 6px;
          }
          .join-btn-primary, .join-btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .join-headline {
            font-size: 2.15rem;
          }
        }
      `}</style>

      {/* Atmospheric Chiaroscuro & Candlelight Veil */}
      <div className="join-chiaroscuro-overlay" />

      {/* Renaissance Plinth / Gilded Guild Tablet */}
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

        {/* Renaissance Guild Cartouche Badge */}
        <div className="join-badge">
          <span className="join-badge-glyph">❖</span>
          <span>L&apos;Accademia Dei Sviluppatori &bull; Zero Fees &bull; Open To All</span>
          <span className="join-badge-glyph">❖</span>
        </div>

        {/* Stately Renaissance Headline */}
        <h2 className="join-headline">
          Ready to <span className="renaissance-emphasis">build with us</span>
          <br />
          this semester?
        </h2>

        {/* Warm Scholarly Subtext */}
        <p className="join-subtext">
          No experience needed. Jump directly into our project channels, show up this Wednesday, and team up for DevSummit&apos;26.
        </p>

        {/* Call to Action Buttons */}
        <div className="join-cta-row">
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="join-btn-primary"
          >
            <span>Join WhatsApp Community</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="join-btn-secondary"
          >
            <span>Join Discord</span>
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
