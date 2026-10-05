import Header from './Header';
import CylinderGallery3D from './CylinderGallery3D';

export default function Hero() {
  return (
    <div id="home" className="hero-master-wrapper">
      <style>{`
        @keyframes dsc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dsc-marquee-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 38px;
          overflow: hidden;
          background: rgba(10, 15, 13, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          z-index: 150;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dsc-marquee-content {
          display: flex;
          animation: dsc-marquee 36s linear infinite;
        }
        .dsc-marquee-item {
          display: flex;
          align-items: center;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }
        .dsc-marquee-star {
          color: #1dd1a1;
          margin: 0 28px;
          font-size: 13px;
        }
        .hero-master-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #000000;
          color: #fff;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Top Announcements Marquee */}
      <div className="dsc-marquee-container">
        <div className="dsc-marquee-content">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="dsc-marquee-item">UPCOMING HACKATHON: DEVSUMMIT 2026</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">HANDS-ON WORKSHOPS EVERY WEDNESDAY</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">BUILDING REAL PRODUCTS • SRM IST RAMAPURAM</div>
              <div className="dsc-marquee-star">★</div>
              <div className="dsc-marquee-item">GOOGLE DEVELOPER GROUPS ON CAMPUS</div>
              <div className="dsc-marquee-star">★</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Site Navigation */}
      <Header active="home" />

      {/* 3D Cylindrical Curved Photo Gallery & 3D Extruded Centerpiece */}
      <CylinderGallery3D />
    </div>
  );
}
