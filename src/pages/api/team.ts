import type { APIRoute } from 'astro';
import { getTeamMembers } from '../../lib/turso';

export const GET: APIRoute = async () => {
  try {
    const members = await getTeamMembers();
    return new Response(JSON.stringify({ members }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch team members' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
