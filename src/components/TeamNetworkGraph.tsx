import { useEffect, useRef, useState } from 'react';
import type { Member } from './TeamShowcase';

interface Node {
  id: string;
  label: string;
  role: string;
  domain: 'presidency' | 'technical' | 'creatives' | 'operations' | 'core';
  type: 'president' | 'lead' | 'member';
  parentId?: string;
  visible: boolean;
  expanded?: boolean;

  // Physics properties
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;

  // Member reference
  memberRef: Member;
}

interface Link {
  source: string;
  target: string;
  visible: boolean;
}

interface GraphProps {
  members?: Member[];
  onSelectMember: (member: Member | null) => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  presidency: '#1dd1a1', // Mint Green
  technical: '#eab308',   // Gold
  operations: '#00f2fe',  // Cyan
  creatives: '#c084fc',   // Purple
  core: '#1dd1a1',        // Mint Green
};

function buildGraphData(members: Member[], width: number, height: number): { nodes: Node[]; links: Link[] } {
  if (!members || members.length === 0) {
    return { nodes: [], links: [] };
  }

  // 1. Identify President (Khushal Mittal)
  const president =
    members.find(
      (m) =>
        m.domain === 'presidency' ||
        (m.team && m.team.toUpperCase().includes('PRESIDENT')) ||
        m.role.toLowerCase().includes('president')
    ) || members[0];

  // 2. Identify Domain Leads
  const techLead = members.find((m) => m.domain === 'technical' && m.lead);
  const opsLead = members.find((m) => m.domain === 'operations' && m.lead);
  const creativesLead = members.find((m) => m.domain === 'creatives' && m.lead);

  // 3. Domain Members (excluding leads and president)
  const techMembers = members.filter((m) => m.domain === 'technical' && !m.lead && m !== president);
  const opsMembers = members.filter((m) => m.domain === 'operations' && !m.lead && m !== president);
  const creativesMembers = members.filter((m) => m.domain === 'creatives' && !m.lead && m !== president);
  const coreMembers = members.filter(
    (m) => m.domain === 'core' && m !== president && !m.lead
  );

  const nodes: Node[] = [];
  const links: Link[] = [];

  const cx = width / 2;
  const cy = height / 2;

  // Root Node: President
  nodes.push({
    id: 'president',
    label: president.name,
    role: president.role || 'President',
    domain: 'presidency',
    type: 'president',
    visible: true,
    expanded: true,
    x: cx,
    y: cy - 40,
    vx: 0,
    vy: 0,
    radius: 42,
    color: DOMAIN_COLORS.presidency,
    memberRef: president,
  });

  // Leads configurations: arranged around President
  const leadConfigs = [
    {
      lead: creativesLead,
      domain: 'creatives' as const,
      id: 'lead_creatives',
      members: creativesMembers,
      x: cx,
      y: cy - 145,
      color: DOMAIN_COLORS.creatives,
      baseAngle: -Math.PI / 2,
    },
    {
      lead: techLead,
      domain: 'technical' as const,
      id: 'lead_technical',
      members: techMembers,
      x: cx - 160,
      y: cy + 85,
      color: DOMAIN_COLORS.technical,
      baseAngle: Math.PI * 0.75,
    },
    {
      lead: opsLead,
      domain: 'operations' as const,
      id: 'lead_operations',
      members: opsMembers,
      x: cx + 160,
      y: cy + 85,
      color: DOMAIN_COLORS.operations,
      baseAngle: Math.PI * 0.25,
    },
  ];

  leadConfigs.forEach((cfg) => {
    if (!cfg.lead) return;

    // Add Lead Node (starts closed by default)
    nodes.push({
      id: cfg.id,
      label: cfg.lead.name,
      role: cfg.lead.role,
      domain: cfg.domain,
      type: 'lead',
      parentId: 'president',
      visible: true,
      expanded: false,
      x: cfg.x,
      y: cfg.y,
      vx: 0,
      vy: 0,
      radius: 34,
      color: cfg.color,
      memberRef: cfg.lead,
    });

    // President -> Lead Link
    links.push({
      source: 'president',
      target: cfg.id,
      visible: true,
    });

    // Add Domain Members (start closed/hidden by default)
    const count = cfg.members.length;
    cfg.members.forEach((m, idx) => {
      const memberId = `member_${m.id || idx}_${cfg.domain}`;
      const spread = count > 1 ? (idx / (count - 1) - 0.5) * Math.PI * 1.15 : 0;
      const angle = cfg.baseAngle + spread;
      const dist = 95 + (idx % 2) * 25;

      nodes.push({
        id: memberId,
        label: m.name,
        role: m.role,
        domain: cfg.domain,
        type: 'member',
        parentId: cfg.id,
        visible: false,
        x: cfg.x + Math.cos(angle) * dist,
        y: cfg.y + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 24,
        color: cfg.color,
        memberRef: m,
      });

      // Lead -> Member Link (hidden until lead clicked)
      links.push({
        source: cfg.id,
        target: memberId,
        visible: false,
      });
    });
  });

  // Core / Unassigned members connect directly to President (hidden by default)
  if (coreMembers.length > 0) {
    coreMembers.forEach((m, idx) => {
      const memberId = `member_${m.id || idx}_core`;
      const angle = Math.PI * 0.5 + (idx / Math.max(1, coreMembers.length) - 0.5) * 0.9;
      const dist = 120 + (idx % 2) * 20;

      nodes.push({
        id: memberId,
        label: m.name,
        role: m.role,
        domain: 'core',
        type: 'member',
        parentId: 'president',
        visible: false,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 22,
        color: DOMAIN_COLORS.core,
        memberRef: m,
      });

      links.push({
        source: 'president',
        target: memberId,
        visible: false,
      });
    });
  }

  return { nodes, links };
}

export default function TeamNetworkGraph({ members = [], onSelectMember }: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const nodesRef = useRef<Node[] | null>(null);
  const linksRef = useRef<Link[] | null>(null);

  // Pre-load images to draw on canvas
  const imagesCache = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    members.forEach((m) => {
      if (m.image && !imagesCache.current[m.image]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = m.image;
        img.onload = () => {
          imagesCache.current[m.image] = img;
          imagesCache.current[m.name] = img;
        };
      }
    });
  }, [members]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 900);
    let height = (canvas.height = 620);

    // Initialize or reset nodes & links based on DB members
    const graphData = buildGraphData(members, width, height);
    nodesRef.current = graphData.nodes;
    linksRef.current = graphData.links;

    const nodes = nodesRef.current;
    const links = linksRef.current;

    let draggedNode: Node | null = null;
    let mouseOffset = { x: 0, y: 0 };
    let startDragX = 0;
    let startDragY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    let hoverNode: Node | null = null;
    let pulseProgress = 0;

    const resizeCanvas = () => {
      if (!containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = 620;
    };

    window.addEventListener('resize', resizeCanvas);

    // Expand/Collapse lead branches
    const toggleNode = (node: Node) => {
      if (node.type === 'lead') {
        const isExpanding = !node.expanded;
        node.expanded = isExpanding;

        nodes.forEach((n) => {
          if (n.parentId === node.id) {
            n.visible = isExpanding;
            if (isExpanding) {
              n.x = node.x + (Math.random() - 0.5) * 40;
              n.y = node.y + (Math.random() - 0.5) * 40;
              n.vx = (Math.random() - 0.5) * 6;
              n.vy = (Math.random() - 0.5) * 6;
            }
          }
        });

        // Sync links visibility
        links.forEach((l) => {
          const srcNode = nodes.find((n) => n.id === l.source);
          const tgtNode = nodes.find((n) => n.id === l.target);
          if (srcNode && tgtNode) {
            l.visible = srcNode.visible && tgtNode.visible;
          }
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const clicked = nodes.find((n) => {
        if (!n.visible) return false;
        const dx = mx - n.x;
        const dy = my - n.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius;
      });

      if (clicked) {
        draggedNode = clicked;
        mouseOffset = { x: clicked.x - mx, y: clicked.y - my };
        startDragX = mx;
        startDragY = my;
        prevMouseX = mx;
        prevMouseY = my;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (draggedNode) {
        draggedNode.x = mx + mouseOffset.x;
        draggedNode.y = my + mouseOffset.y;

        draggedNode.vx = mx - prevMouseX;
        draggedNode.vy = my - prevMouseY;

        prevMouseX = mx;
        prevMouseY = my;
      } else {
        const match = nodes.find((n) => {
          if (!n.visible) return false;
          const dx = mx - n.x;
          const dy = my - n.y;
          return Math.sqrt(dx * dx + dy * dy) < n.radius;
        });

        if (match !== hoverNode) {
          hoverNode = match || null;
          setHoveredNode(hoverNode);
          canvas.style.cursor = match ? 'pointer' : 'default';
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (draggedNode) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const dx = mx - startDragX;
        const dy = my - startDragY;
        const dragDist = Math.sqrt(dx * dx + dy * dy);

        if (dragDist < 6) {
          if (draggedNode.type === 'lead') {
            toggleNode(draggedNode);
          }
          if (draggedNode.memberRef) {
            onSelectMember(draggedNode.memberRef);
          } else {
            onSelectMember(null);
          }
        }
        draggedNode = null;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Spring constants tuned for ~21 nodes
    const restLengthMap: Record<string, number> = {
      president_lead: 140,
      lead_member: 90,
      president_member: 110,
    };
    const stiffness = 0.022;
    const repulsionStrength = 2200;
    const damping = 0.86;

    const updatePhysics = () => {
      const activeNodes = nodes.filter((n) => n.visible);

      // Repulsion force
      for (let i = 0; i < activeNodes.length; i++) {
        const n1 = activeNodes[i];
        for (let j = i + 1; j < activeNodes.length; j++) {
          const n2 = activeNodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = repulsionStrength / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== draggedNode) {
            n1.vx += fx;
            n1.vy += fy;
          }
          if (n2 !== draggedNode) {
            n2.vx -= fx;
            n2.vy -= fy;
          }
        }
      }

      // Spring attraction force along visible links
      links.forEach((link) => {
        if (!link.visible) return;
        const n1 = nodes.find((n) => n.id === link.source);
        const n2 = nodes.find((n) => n.id === link.target);
        if (!n1 || !n2) return;

        let restLen = restLengthMap.lead_member;
        if (n1.type === 'president' && n2.type === 'lead') {
          restLen = restLengthMap.president_lead;
        } else if (n1.type === 'president' && n2.type === 'member') {
          restLen = restLengthMap.president_member;
        }

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const extension = dist - restLen;
        const force = extension * stiffness;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1 !== draggedNode) {
          n1.vx -= fx;
          n1.vy -= fy;
        }
        if (n2 !== draggedNode) {
          n2.vx += fx;
          n2.vy += fy;
        }
      });

      // Gravity and bounds limits
      activeNodes.forEach((n) => {
        if (n === draggedNode) return;

        const cx = width / 2;
        const cy = height / 2;
        const targetY = n.type === 'president' ? cy - 30 : cy;
        const dx = cx - n.x;
        const dy = targetY - n.y;

        // President anchored more firmly near center
        const gravityWeight = n.type === 'president' ? 0.0018 : 0.0006;
        n.vx += dx * gravityWeight;
        n.vy += dy * gravityWeight;

        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;

        const margin = n.radius + 15;
        if (n.x < margin) {
          n.x = margin;
          n.vx *= -0.2;
        }
        if (n.x > width - margin) {
          n.x = width - margin;
          n.vx *= -0.2;
        }
        if (n.y < margin) {
          n.y = margin;
          n.vy *= -0.2;
        }
        if (n.y > height - margin) {
          n.y = height - margin;
          n.vy *= -0.2;
        }
      });
    };

    const render = () => {
      updatePhysics();
      ctx.clearRect(0, 0, width, height);

      pulseProgress = (pulseProgress + 0.007) % 1;

      // 1. Draw Links
      links.forEach((l) => {
        if (!l.visible) return;
        const n1 = nodes.find((n) => n.id === l.source);
        const n2 = nodes.find((n) => n.id === l.target);
        if (!n1 || !n2) return;

        const isLeadBranch = n1.type === 'president' && n2.type === 'lead';

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isLeadBranch ? 'rgba(232, 237, 233, 0.12)' : 'rgba(232, 237, 233, 0.05)';
        ctx.lineWidth = isLeadBranch ? 2.5 : 1.5;
        ctx.stroke();

        // Animated flow signal pulses along links
        const px = n1.x + (n2.x - n1.x) * pulseProgress;
        const py = n1.y + (n2.y - n1.y) * pulseProgress;

        ctx.beginPath();
        ctx.arc(px, py, isLeadBranch ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = n2.color;
        ctx.shadowColor = n2.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Nodes
      nodes.forEach((n) => {
        if (!n.visible) return;

        ctx.save();

        const isHovered = hoverNode?.id === n.id;
        const scale = isHovered ? 1.08 : 1.0;
        const r = n.radius * scale;

        // Shadow circle glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(8, 13, 11, 0.95)';
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isHovered ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer ring border outline
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = n.type === 'president' ? 3.5 : n.type === 'lead' ? 3 : 2;
        ctx.stroke();

        // Clipped profile photo node from database
        const img =
          imagesCache.current[n.memberRef?.image || ''] ||
          imagesCache.current[n.label] ||
          imagesCache.current[n.memberRef?.name || ''];

        if (img && img.complete && img.naturalWidth > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r - 1.5, 0, Math.PI * 2);
          ctx.clip();

          // Calculate center-crop square to preserve aspect ratio without stretching
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          const size = Math.min(nw, nh);
          const sx = (nw - size) / 2;
          // Crop portrait images with face bias (22% from top)
          const sy = nh > nw ? (nh - size) * 0.22 : (nh - size) / 2;

          ctx.drawImage(img, sx, sy, size, size, n.x - r, n.y - r, r * 2, r * 2);
        } else {
          // Fallback circular badge with clean initials if image loading
          ctx.beginPath();
          ctx.arc(n.x, n.y, r - 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(17, 23, 20, 0.95)';
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = `600 ${Math.max(10, Math.round(r * 0.42))}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = n.label
            .split(' ')
            .filter(Boolean)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          ctx.fillText(initials, n.x, n.y);
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [members, onSelectMember]);

  return (
    <div ref={containerRef} className="network-graph-container">
      {/* Tooltip detail element */}
      {hoveredNode && (
        <div
          className="graph-node-tooltip"
          style={{
            position: 'absolute',
            left: `${hoveredNode.x}px`,
            top: `${hoveredNode.y - hoveredNode.radius - 42}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="tooltip-inner" style={{ borderColor: hoveredNode.color }}>
            <div className="tooltip-name">{hoveredNode.label}</div>
            <div className="tooltip-role" style={{ color: hoveredNode.color }}>
              {hoveredNode.role}
              {hoveredNode.type === 'lead' &&
                ` (${hoveredNode.expanded ? 'Click to Collapse Members' : 'Click to Expand Members'})`}
              {hoveredNode.type !== 'lead' && ' (Click to Inspect)'}
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="network-graph-canvas" />

      <style>{`
        .network-graph-container {
          position: relative;
          width: 100%;
          background: rgba(17, 23, 20, 0.45);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          margin-bottom: 40px;
          box-shadow: inset 0 4px 30px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(16px);
        }

        .network-graph-canvas {
          display: block;
          width: 100%;
          height: 620px;
          background: transparent;
        }

        /* Node Tooltips */
        .graph-node-tooltip {
          z-index: 100;
          animation: tooltipFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .tooltip-inner {
          background: rgba(8, 13, 11, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 14px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          text-align: center;
          white-space: nowrap;
        }

        .tooltip-name {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #e8ede9;
          margin-bottom: 2px;
        }

        .tooltip-role {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes tooltipFadeIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(8px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
