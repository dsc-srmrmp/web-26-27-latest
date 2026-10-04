import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';

const TeamNetworkGraph = lazy(() => import('./TeamNetworkGraph'));

export interface Member {
  id?: number;
  name: string;
  role: string;
  domain: 'presidency' | 'technical' | 'creatives' | 'operations' | 'core';
  team?: string | null;
  image: string;
  github?: string;
  linkedin?: string;
  insta?: string;
  x?: string;
  email?: string;
  skills?: string[];
  lead?: boolean;
}

export interface TeamShowcaseProps {
  initialMembers?: Member[];
}

// Auto-capitalize domain key for tab labels — no hardcoded label map needed
const domainLabel = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

export default function TeamShowcase({ initialMembers }: TeamShowcaseProps) {
  // DB is the ONLY source of truth — no fallback fake data
  const members: Member[] = initialMembers ?? [];
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'graph'>('grid');


  // Selected node profile display inside Graph view
  const [selectedGraphMember, setSelectedGraphMember] = useState<Member | null>(null);

  const handleSelectMember = useCallback((member: Member | null) => {
    setSelectedGraphMember(member);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode !== 'grid' || !containerRef.current) return;

    // Parallax card tilt on mouse move — listen on static wrapper to prevent jitter feedback loop
    const wrappers = containerRef.current.querySelectorAll<HTMLDivElement>('.team-card-wrapper');
    const cleanups: (() => void)[] = [];

    wrappers.forEach((wrapper) => {
      const card = wrapper.querySelector<HTMLDivElement>('.team-member-card');
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = rect.width / 2;
        const yc = rect.height / 2;

        const tiltX = (yc - y) / 16;
        const tiltY = (x - xc) / 16;

        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          scale: 1.025,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      wrapper.addEventListener('mousemove', handleMouseMove);
      wrapper.addEventListener('mouseleave', handleMouseLeave);
      cleanups.push(() => {
        wrapper.removeEventListener('mousemove', handleMouseMove);
        wrapper.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [activeTab, viewMode, members]);

  useEffect(() => {
    if (viewMode !== 'grid' || !containerRef.current) return;

    // Staggered reveal entrance animation when tab changes
    const targets = containerRef.current.querySelectorAll('.team-card-wrapper');
    if (targets.length > 0) {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.025, ease: 'power2.out', clearProps: 'transform' }
      );
    }
  }, [activeTab, viewMode, members]);

  // Tab counts — derived from data, not hardcoded
  const getTabCount = (key: string) => {
    if (key === 'all') return members.length;
    if (key === 'core') return members.filter((m) => m.lead === true).length;
    return members.filter((m) => m.domain === key).length;
  };

  // Tabs derived dynamically from DB data — no hardcoded domain list
  const tabs = useMemo(() => {
    const domainOrder = ['technical', 'operations', 'creatives'];
    const presentDomains = new Set(
      members
        .map((m) => m.domain)
        .filter((d) => d !== 'core' && d !== 'presidency')
    );
    const sortedDomains = [
      ...domainOrder.filter((d) => presentDomains.has(d as any)),
      ...[...presentDomains].filter((d) => !domainOrder.includes(d)).sort(),
    ];
    return [
      { key: 'all', label: 'All' },
      ...(members.some((m) => m.lead) ? [{ key: 'core', label: 'Core Team' }] : []),
      ...sortedDomains.map((d) => ({ key: d, label: domainLabel(d) })),
    ];
  }, [members]);

  // Sections configuration: In 'All', separate Core Team first then each domain with spacing
  const sections = useMemo(() => {
    if (activeTab !== 'all') {
      let tabMembers: Member[] = [];
      let title = '';
      if (activeTab === 'core') {
        tabMembers = members.filter((m) => m.lead === true);
        title = 'Core Team';
      } else {
        tabMembers = members.filter((m) => m.domain === activeTab);
        title = `${domainLabel(activeTab)} Domain`;
      }
      return [{ key: activeTab, title, members: tabMembers }];
    }

    // In 'All' view:
    // Section 1: Core Team (all leads: President + Leads)
    // Section 2: Technical (non-lead technical members)
    // Section 3: Operations (non-lead operations members)
    // Section 4: Creatives (non-lead creatives members)
    // Section 5: General Members (unassigned members if any)
    const result: { key: string; title: string; members: Member[] }[] = [];

    const coreMembers = members.filter((m) => m.lead === true);
    if (coreMembers.length > 0) {
      result.push({
        key: 'core',
        title: 'Core Team',
        members: coreMembers,
      });
    }

    const domainOrder = ['technical', 'operations', 'creatives'];
    const otherDomains = Array.from(
      new Set(
        members
          .filter((m) => !m.lead && m.domain !== 'presidency')
          .map((m) => m.domain)
      )
    );

    const sortedDomains = [
      ...domainOrder.filter((d) => otherDomains.includes(d as any)),
      ...otherDomains.filter((d) => !domainOrder.includes(d)).sort(),
    ];

    for (const domain of sortedDomains) {
      const domainMembers = members.filter((m) => !m.lead && m.domain === domain);
      if (domainMembers.length > 0) {
        result.push({
          key: domain,
          title: domain === 'core' ? 'Members' : `${domainLabel(domain)} Domain`,
          members: domainMembers,
        });
      }
    }

    return result;
  }, [activeTab, members]);

  const getImageStyle = (member: Member): React.CSSProperties | undefined => {
    const name = member.name.toUpperCase();
    if (name.includes('DHANYA')) {
      return { objectPosition: 'center 12%' };
    }
    return undefined;
  };

  // Uniform card renderer used across ALL sections
  const renderCard = (m: Member, key: string | number) => (
    <div key={key} className="team-card-wrapper">
      {/* Dynamic domain glow spotlight behind card */}
      <div className={`card-hover-glow-spotlight spotlight-${m.domain}`} />

      {/* Card Body */}
      <div className="team-member-card">
        {/* Image Container */}
        <div className="team-image-container">
          <img
            src={m.image}
            alt={m.name}
            className="team-member-image"
            style={getImageStyle(m)}
            loading="lazy"
          />
          <div className="team-image-overlay" />

          {/* Overlay Social Icons Row */}
          {(m.github || m.linkedin || m.insta || m.x || m.email) && (
            <div className="team-social-overlay-row">
              {m.github && (
                <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {m.insta && (
                <a href={m.insta} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {m.x && (
                <a href={m.x} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {m.email && (
                <a href={m.email} className="team-social-circle-btn" aria-label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="team-member-info">
          <h3>{m.name}</h3>
          <p className="team-member-role">{m.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-component-wrapper">
      {/* Toolbar view selectors */}
      <div className="team-toolbar-controls">
        <div className="view-mode-toggles">
          <button
            className={`toolbar-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid Cards View
          </button>
          <button
            className={`toolbar-view-btn ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('graph');
              setSelectedGraphMember(null);
            }}
          >
            Graph View
          </button>
        </div>

        {/* Display Category Filter tabs only when in Grid View */}
        {viewMode === 'grid' && (
          <div className="team-filter-tabs">
            {tabs.map(tab => {
              const count = getTabCount(tab.key);
              if (count === 0 && tab.key !== 'all') return null;
              return (
                <button
                  key={tab.key}
                  className={`team-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label} <span className="tab-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Render selected View Mode content */}
      {viewMode === 'grid' ? (
        <div ref={containerRef} className="team-showcase-container">
          {sections.map((section) => (
            <section key={section.key} className="team-domain-section">
              {activeTab === 'all' && (
                <div className="domain-section-header">
                  <div className="domain-section-title-wrap">
                    <span className={`domain-section-indicator indicator-${section.key}`} />
                    <h3 className="domain-section-title">{section.title}</h3>
                    <span className="domain-section-badge">{section.members.length}</span>
                  </div>
                  <div className="domain-section-line" />
                </div>
              )}
              <div className="team-showcase-grid">
                {section.members.map((m, idx) =>
                  renderCard(m, `${section.key}-${m.id || idx}`)
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Render Interactive Network Canvas Graph view */
        <div className="graph-view-wrapper">
          <Suspense fallback={<div className="graph-loading-placeholder" style={{ padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>Loading network physics graph...</div>}>
            <TeamNetworkGraph members={members} onSelectMember={handleSelectMember} />
          </Suspense>

          {/* Highlight card detail panel when clicking graph node */}
          {selectedGraphMember ? (
            <div className="graph-detail-card-panel">
              <div className="panel-card-inner">
                <button className="panel-close-btn" onClick={() => setSelectedGraphMember(null)}>×</button>
                <div className="panel-header-row">
                  <img src={selectedGraphMember.image} alt={selectedGraphMember.name} className="panel-avatar" />
                  <div>
                    <h4>{selectedGraphMember.name}</h4>
                    <p className="panel-role">{selectedGraphMember.role}</p>
                  </div>
                </div>
                {selectedGraphMember.skills && selectedGraphMember.skills.length > 0 && (
                  <div className="panel-skills-section">
                    <h5>Core Skills</h5>
                    <div className="panel-skills-list">
                      {selectedGraphMember.skills.map((s) => (
                        <span key={s} className="panel-skill-pill">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="panel-actions-row">
                  {selectedGraphMember.github && (
                    <a href={selectedGraphMember.github} target="_blank" rel="noopener noreferrer" className="panel-action-icon" aria-label="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                  )}
                  {selectedGraphMember.linkedin && (
                    <a href={selectedGraphMember.linkedin} target="_blank" rel="noopener noreferrer" className="panel-action-icon" aria-label="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {selectedGraphMember.insta && (
                    <a href={selectedGraphMember.insta} target="_blank" rel="noopener noreferrer" className="panel-action-icon" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  {selectedGraphMember.x && (
                    <a href={selectedGraphMember.x} target="_blank" rel="noopener noreferrer" className="panel-action-icon" aria-label="X">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {selectedGraphMember.email && (
                    <a href={selectedGraphMember.email} className="panel-action-icon" aria-label="Email">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="graph-instructions-card">
              💡 **Interactive Network Tip:** Click and drag members to fling them! Click **Domain Leads** (Technical, Creatives, Operations) to expand/collapse their members, and click any node to inspect their details.
            </div>
          )}
        </div>
      )}
      
      <style>{`
        .team-component-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        /* View Mode Controls Toolbar */
        .team-toolbar-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 32px;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 24px;
        }

        .view-mode-toggles {
          display: flex;
          background: rgba(17, 23, 20, 0.4);
          padding: 5px;
          border-radius: 10px;
          border: 1px solid rgba(232, 237, 233, 0.05);
          backdrop-filter: blur(10px);
        }

        .toolbar-view-btn {
          padding: 8px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toolbar-view-btn:hover {
          color: #e8ede9;
        }

        .toolbar-view-btn.active {
          color: #080d0b;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .team-toolbar-controls {
            flex-direction: column;
            align-items: center;
          }
        }

        /* 2. Interactive Graph Layout overlays */
        .graph-view-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        .graph-instructions-card {
          background: rgba(17, 23, 20, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 11.5px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }

        .graph-detail-card-panel {
          animation: panelSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
        }

        .panel-card-inner {
          background: rgba(8, 13, 11, 0.95);
          border: 1px solid rgba(29, 209, 161, 0.2);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          text-align: left;
        }

        .panel-close-btn {
          position: absolute;
          top: 12px;
          right: 16px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 24px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .panel-close-btn:hover {
          color: #e8ede9;
        }

        .panel-header-row {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
        }

        .panel-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          background-color: #0b110f;
        }

        .panel-header-row h4 {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #e8ede9;
          margin-bottom: 3px;
        }

        .panel-role {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #1dd1a1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .panel-skills-section h5 {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 8px;
        }

        .panel-skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .panel-skill-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 10px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #e8ede9;
        }

        .panel-actions-row {
          display: flex;
          gap: 12px;
        }

        .panel-action-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8ede9;
          transition: all 0.25s;
        }

        .panel-action-icon:hover {
          border-color: #1dd1a1;
          color: #1dd1a1;
          background: rgba(29, 209, 161, 0.08);
          transform: scale(1.06);
        }

        @keyframes panelSlideIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* 3. Grid View elements */
        .team-filter-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          background: rgba(17, 23, 20, 0.4);
          padding: 5px;
          border-radius: 10px;
          border: 1px solid rgba(232, 237, 233, 0.05);
          backdrop-filter: blur(10px);
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .team-filter-tabs {
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px;
            padding: 4px;
            width: 100%;
          }
        }

        .team-tab-btn {
          padding: 8px 18px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 6px;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .team-tab-btn {
            padding: 6px 12px;
            font-size: 11.5px;
          }
        }

        .team-tab-btn:hover {
          color: #e8ede9;
        }

        .team-tab-btn.active {
          color: #080d0b;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .tab-count-badge {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 600;
          margin-left: 5px;
          padding: 1px 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          vertical-align: middle;
        }

        .team-tab-btn.active .tab-count-badge {
          background: rgba(8, 13, 11, 0.15);
          color: #080d0b;
        }

        /* Team Showcase Layouts */
        .team-showcase-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }

        /* Domain Sections in All View */
        .team-domain-section {
          width: 100%;
          margin-bottom: 56px;
        }

        .team-domain-section:last-child {
          margin-bottom: 0;
        }

        .domain-section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .domain-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .domain-section-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .indicator-core,
        .indicator-presidency {
          background: #1dd1a1;
          box-shadow: 0 0 10px #1dd1a1;
        }

        .indicator-technical {
          background: #eab308;
          box-shadow: 0 0 10px #eab308;
        }

        .indicator-operations {
          background: #00f2fe;
          box-shadow: 0 0 10px #00f2fe;
        }

        .indicator-creatives {
          background: #a855f7;
          box-shadow: 0 0 10px #a855f7;
        }

        .domain-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .domain-section-badge {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
        }

        .domain-section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.01) 100%);
        }

        /* Team Showcase Grid: Max 4, Min 2 */
        .team-showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
          perspective: 1000px;
          align-items: stretch;
        }

        @media (max-width: 1100px) {
          .team-showcase-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .team-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            width: 100%;
          }
          .team-domain-section {
            margin-bottom: 36px;
          }
          .domain-section-title {
            font-size: 1.15rem;
          }
        }

        @media (max-width: 380px) {
          .team-showcase-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .team-card-wrapper {
          position: relative;
          transform-style: preserve-3d;
          perspective: 1000px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Dynamic Domain Glow Spotlights */
        .card-hover-glow-spotlight {
          position: absolute;
          inset: -30px;
          opacity: 0;
          filter: blur(40px);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
          pointer-events: none;
          border-radius: 40px;
          transform: scale(0.85);
        }

        .team-card-wrapper:hover .card-hover-glow-spotlight {
          opacity: 1.0;
          transform: scale(1.15) translateZ(-15px);
        }

        .spotlight-presidency {
          background: radial-gradient(circle, rgba(29, 209, 161, 0.4) 0%, rgba(29, 209, 161, 0) 70%);
        }
        .spotlight-technical {
          background: radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, rgba(234, 179, 8, 0) 70%);
        }
        .spotlight-creatives {
          background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%);
        }
        .spotlight-operations {
          background: radial-gradient(circle, rgba(0, 242, 254, 0.4) 0%, rgba(0, 242, 254, 0) 70%);
        }
        .spotlight-core {
          background: radial-gradient(circle, rgba(29, 209, 161, 0.3) 0%, rgba(29, 209, 161, 0) 70%);
        }

        /* The Member Card */
        .team-member-card {
          background-image: 
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
          background-color: var(--card-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
          position: relative;
          z-index: 2;
          will-change: transform;
        }

        .team-card-wrapper:hover .team-member-card,
        .team-member-card:hover {
          border-color: rgba(29, 209, 161, 0.28);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }

        /* 3D Parallax layers */
        .team-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.15;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
          transform: translateZ(28px);
          transform-style: preserve-3d;
          background-color: #0b110f;
          border: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .team-member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) brightness(0.7) contrast(1.15);
          transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center center;
          transform: translateZ(5px);
          
          /* Soft gradient mask for cutout look */
          mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12%);
          -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12%);
        }

        .team-card-wrapper:hover .team-member-image,
        .team-member-card:hover .team-member-image {
          filter: grayscale(0%) brightness(1) contrast(1);
          transform: scale(1.05) translateZ(8px);
        }

        .team-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 13, 11, 0.8) 0%, rgba(8, 13, 11, 0) 40%);
          pointer-events: none;
          z-index: 1;
          transform: translateZ(1px);
        }

        .team-social-overlay-row {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(14px);
          opacity: 0;
          pointer-events: none;
          display: flex;
          gap: 10px;
          z-index: 20;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card-wrapper:hover .team-social-overlay-row,
        .team-member-card:hover .team-social-overlay-row {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .team-social-circle-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(11, 17, 15, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8ede9;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .team-social-circle-btn:hover {
          border-color: #1dd1a1;
          color: #1dd1a1;
          background-color: rgba(29, 209, 161, 0.2);
          transform: translateY(-2px) scale(1.12);
          box-shadow: 0 4px 12px rgba(29, 209, 161, 0.25);
        }

        .team-member-info {
          transform: translateZ(36px);
          transform-style: preserve-3d;
          text-align: left;
          padding: 0 4px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .team-member-info h3 {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(0.85rem, 2.2vw, 1.05rem);
          color: var(--text-color);
          margin-bottom: 4px;
          letter-spacing: -0.01em;
          transform: translateZ(8px);
          line-height: 1.25;
          min-height: 2.5em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .team-member-role {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: clamp(0.68rem, 1.5vw, 0.78rem);
          color: #1dd1a1; /* Neon mint-green */
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          transform: translateZ(14px);
          line-height: 1.3;
          min-height: 2.6em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
