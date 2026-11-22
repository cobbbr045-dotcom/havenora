import type { VercelRequest, VercelResponse } from '../_lib/types';
import {
  SECURITY_CONFIG,
  parseCookies,
  verifySessionToken
} from '../_lib/security';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Prevent any caching of owner operational data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // Strict session check
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies[SECURITY_CONFIG.COOKIE_NAME];

  if (!sessionToken) {
    return res.status(401).json({ error: 'Unauthorized: Owner session required.' });
  }

  const { valid, payload } = verifySessionToken(sessionToken);
  if (!valid || !payload) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired owner session.' });
  }

  // Handle owner administrative queries and updates
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'authorized',
      owner: payload.sub,
      message: 'Secure owner data channel verified.'
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      status: 'updated',
      owner: payload.sub,
      message: 'Owner modification accepted.'
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
