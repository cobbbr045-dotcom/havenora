import type { VercelRequest, VercelResponse } from '../_lib/types';
import { buildClearSessionCookie } from '../_lib/security';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear cookie with Max-Age=0 and expired date
  res.setHeader('Set-Cookie', buildClearSessionCookie());

  return res.status(200).json({
    success: true,
    message: 'Owner session terminated successfully.'
  });
}
