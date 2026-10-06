import { createClient } from '@libsql/client/web';

const DEFAULT_URL = 'https://dsc-dscsrmrmp.aws-ap-south-1.turso.io';
const DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk0MDcxNTEsImlkIjoiMDFhMGEwZjktYjYwMS03ZGJlLTkzMTQtZmNkMDVhNDVlNDhhIiwia2lkIjoiWFpUMjFKc1dfaVNic1pLYnJXMUZJbFZMS3FIdEQxVGpiUnctbWJtZTNjVSIsInJpZCI6IjkwMjliZjdlLTZiYTMtNDc2ZC1hMGY4LWZhNTFlNjk5Y2E0NSJ9.MJNEDy8E20dSCd1FeFKjRDHeSxVfI45Qe8Od9NTlYopqBU_jNgROhYUtNDynUX_OQG5UNszjm4cqheC2hmKtBQ';

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const rawUrl =
  env.PUBLIC_TURSO_DATABASE_URL ||
  env.TURSO_DATABASE_URL ||
  (typeof process !== 'undefined' && (process.env?.PUBLIC_TURSO_DATABASE_URL || process.env?.TURSO_DATABASE_URL)) ||
  DEFAULT_URL;

// Ensure HTTPS scheme for browser fetch compatibility with Turso HTTP pipeline
export const url = rawUrl.startsWith('libsql://') ? rawUrl.replace('libsql://', 'https://') : rawUrl;
export const authToken =
  env.PUBLIC_TURSO_AUTH_TOKEN ||
  env.TURSO_AUTH_TOKEN ||
  (typeof process !== 'undefined' && (process.env?.PUBLIC_TURSO_AUTH_TOKEN || process.env?.TURSO_AUTH_TOKEN)) ||
  DEFAULT_TOKEN;

export const turso = createClient({
  url,
  authToken,
});

export interface DbTeamMember {
  id: number;
  name: string;
  img: string;
  team: string | null;
  insta: string | null;
  linkedin: string | null;
  x: string | null;
  lead: number | boolean;
  github: string | null;
}

export interface FormattedTeamMember {
  id: number;
  name: string;
  role: string;
  domain: 'presidency' | 'technical' | 'creatives' | 'operations' | 'core';
  team: string | null;
  image: string;
  github?: string;
  linkedin?: string;
  insta?: string;
  x?: string;
  email?: string;
  lead: boolean;
  skills?: string[];
}

export function formatMember(row: DbTeamMember): FormattedTeamMember {
  const isLead = Boolean(row.lead);
  const teamRaw = (row.team || '').toUpperCase().trim();

  // Domain derived purely from team string in DB
  // 1 = Technical, 2 = Operations, 3 = Creatives, 4 = President (unique)
  let domain: 'presidency' | 'technical' | 'creatives' | 'operations' | 'core';
  let role: string;

  if (teamRaw.includes('PRESIDENT')) {
    // Domain 4 — President; always displayed with LEAD tag
    domain = 'presidency';
    role = 'President';
  } else if (teamRaw.includes('TECHNICAL') || teamRaw.includes('HARDWARE')) {
    // Domain 1 — Technical (includes HARDWARE domain)
    domain = 'technical';
    role = isLead ? 'Technical Lead' : (teamRaw.includes('HARDWARE') ? 'Hardware Member' : 'Technical Member');
  } else if (teamRaw.includes('OPERATIONS')) {
    // Domain 2
    domain = 'operations';
    role = isLead ? 'Operations Lead' : 'Operations Member';
  } else if (teamRaw.includes('CREATIVES')) {
    // Domain 3
    domain = 'creatives';
    role = isLead ? 'Creatives Lead' : 'Creatives Member';
  } else {
    // No team assigned — only visible in "All" tab
    domain = 'core';
    role = 'Member';
  }

  const isPresident = teamRaw.includes('PRESIDENT');

  return {
    id: row.id,
    name: row.name,
    role,
    domain,
    team: row.team,
    image: row.img || '',
    github: row.github || (isPresident ? 'https://github.com/developer-students-club' : undefined),
    linkedin: row.linkedin || (isPresident ? 'https://www.linkedin.com/company/dscsrm/' : undefined),
    insta: row.insta || (isPresident ? 'https://www.instagram.com/dscsrmrmp/' : undefined),
    x: row.x || undefined,
    email: isPresident ? 'mailto:dsc.srmrmp@gmail.com' : undefined,
    lead: isLead,
  };
}

export async function getTeamMembers(): Promise<FormattedTeamMember[]> {
  const client = createClient({ url, authToken });
  try {
    // Sort order: President(0) → Tech Lead(1) → Ops Lead(2) → Creatives Lead(3)
    //           → Tech Members(4) → Ops Members(5) → Creatives Members(6) → unassigned(7)
    const sql = `
      SELECT * FROM team_members
      ORDER BY
        CASE
          WHEN team LIKE '%PRESIDENT%' THEN 0
          WHEN lead = 1 AND team LIKE '%TECHNICAL%' THEN 1
          WHEN lead = 1 AND team LIKE '%OPERATIONS%' THEN 2
          WHEN lead = 1 AND team LIKE '%CREATIVES%' THEN 3
          WHEN team LIKE '%TECHNICAL%' OR team LIKE '%HARDWARE%' THEN 4
          WHEN team LIKE '%OPERATIONS%' THEN 5
          WHEN team LIKE '%CREATIVES%' THEN 6
          ELSE 7
        END,
        id ASC
    `;
    const result = await client.execute(sql);
    const rows = result.rows as unknown as DbTeamMember[];
    return rows.map(formatMember);
  } catch (err) {
    console.error('Failed to fetch team members from Turso:', err);
    return [];
  } finally {
    try {
      client.close();
    } catch {}
  }
}
