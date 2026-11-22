import type { VercelRequest, VercelResponse } from '../_lib/types';
import {
  SECURITY_CONFIG,
  parseCookies,
  verifySessionToken
} from '../_lib/security';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Disable caching for sensitive session verification
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies[SECURITY_CONFIG.COOKIE_NAME];

  if (!sessionToken) {
    return res.status(401).json({ authenticated: false, error: 'No active owner session.' });
  }

  const { valid, payload } = verifySessionToken(sessionToken);

  if (!valid || !payload) {
    return res.status(401).json({ authenticated: false, error: 'Invalid or expired owner session.' });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      username: payload.sub,
      fullName: payload.fullName,
      role: payload.role
    }
  });
}
