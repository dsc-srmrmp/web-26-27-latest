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
          padding: 110px 24px 130px;
          background: #0a0a0a;
          color: #fff;
          text-align: center;
          overflow: hidden;
        }

        .join-radial-bg {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(900px, 95vw);
          height: 480px;
          background: radial-gradient(circle, rgba(29, 209, 161, 0.12) 0%, rgba(0, 242, 254, 0.05) 50%, rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
          filter: blur(50px);
        }

        .join-card {
          max-width: 820px;
          margin: 0 auto;
          background: rgba(17, 23, 20, 0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 32px;
          padding: 56px 40px;
          position: relative;
          z-index: 2;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .join-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(29, 209, 161, 0.12);
          border: 1px solid rgba(29, 209, 161, 0.3);
          font-size: 12px;
          font-weight: 700;
          color: #1dd1a1;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .join-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 18px 0;
        }

        .join-subtext {
          font-size: clamp(14.5px, 1.25vw, 17px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          max-width: 580px;
          margin: 0 auto 36px auto;
        }

        .join-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 32px;
        }

        .join-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0b0f17;
          font-size: 14.5px;
          font-weight: 700;
          padding: 13px 28px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), 0 0 15px rgba(255, 255, 255, 0.25);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .join-btn-primary:hover {
          background: #f0fdf4;
          transform: translateY(-2px);
          box-shadow: 0 6px 26px rgba(29, 209, 161, 0.4);
        }

        .join-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 9999px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .join-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .join-location-bar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .join-location-bar strong {
          color: #1dd1a1;
        }

        @media (max-width: 640px) {
          .join-card {
            padding: 40px 20px;
          }
          .join-btn-primary, .join-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="join-radial-bg" />

      <div className="join-card">
        <div className="join-badge">
          <span>Drop-in &bull; Zero Fees &bull; Open To All</span>
        </div>

        <h2 className="join-headline">
          Ready to build with us this semester?
        </h2>

        <p className="join-subtext">
          No experience needed. Jump directly into our project channels, show up this Wednesday, and team up for DevSummit&apos;26.
        </p>

        <div className="join-cta-row">
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="join-btn-primary"
          >
            <span>Join WhatsApp Community</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        <div className="join-location-bar">
          <span>Weekly Sessions: <strong>Every Wednesday at MLCP LAB 1 (Cloud Computing LAB)</strong></span>
          <span>&bull;</span>
          <span>SRM IST Ramapuram, Chennai, TN, India</span>
        </div>
      </div>
    </section>
  );
}
