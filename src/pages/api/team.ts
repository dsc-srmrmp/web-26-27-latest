import type { APIRoute } from 'astro';
import { getTeamMembers, getTeamVersion } from '../../lib/turso';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const clientVersion =
      url?.searchParams?.get('v') ||
      (request?.headers && typeof request.headers.get === 'function'
        ? request.headers.get('if-none-match')?.replace(/^"|"$/g, '')
        : null);

    // 1. Lightweight DB change detection query: checks if DB state altered
    const currentVersion = await getTeamVersion();

    // 2. If client version matches DB version, avoid fetching entire dataset
    if (clientVersion && clientVersion === currentVersion) {
      return new Response(
        JSON.stringify({
          changed: false,
          version: currentVersion,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, must-revalidate',
            'ETag': `"${currentVersion}"`,
          },
        }
      );
    }

    // 3. Version changed or fresh load: fetch full members list from database
    const members = await getTeamMembers();
    return new Response(
      JSON.stringify({
        changed: true,
        version: currentVersion,
        members,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, must-revalidate',
          'ETag': `"${currentVersion}"`,
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch team members' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
