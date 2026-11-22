import type { VercelRequest, VercelResponse } from '../_lib/types';
import {
  SECURITY_CONFIG,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
  safeCompare,
  createSessionToken,
  buildSessionCookie,
  getClientIp
} from '../_lib/security';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);

  // 1. Check Rate Limiting / Brute-force protection
  const rateLimit = checkRateLimit(clientIp);
  if (rateLimit.isLimited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds || 900));
    return res.status(429).json({
      error: 'Too many failed login attempts. Your IP has been temporarily locked.',
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Constant-time check on username and password
    const isUsernameMatch = safeCompare(cleanUsername, SECURITY_CONFIG.OWNER_USERNAME.toLowerCase());
    const isPasswordMatch = safeCompare(cleanPassword, SECURITY_CONFIG.OWNER_PASSWORD);

    if (!isUsernameMatch || !isPasswordMatch) {
      const attemptResult = recordFailedAttempt(clientIp);
      if (attemptResult.isLocked) {
        res.setHeader('Retry-After', String(attemptResult.retryAfterSeconds || 900));
        return res.status(429).json({
          error: 'Maximum login attempts exceeded. Account access locked for 15 minutes.',
          retryAfterSeconds: attemptResult.retryAfterSeconds
        });
      }

      const remaining = Math.max(0, rateLimit.remainingAttempts - 1);
      return res.status(401).json({
        error: 'Invalid owner credentials.',
        remainingAttempts: remaining
      });
    }

    // Authentication successful: reset failed attempt counter
    resetFailedAttempts(clientIp);

    // Create cryptographically signed token
    const token = createSessionToken(cleanUsername);

    // Set secure HTTP-only cookie
    const cookieHeader = buildSessionCookie(token);
    res.setHeader('Set-Cookie', cookieHeader);

    return res.status(200).json({
      success: true,
      user: {
        username: SECURITY_CONFIG.OWNER_USERNAME,
        fullName: 'Tenzing Norbu',
        role: 'owner'
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal authentication server error.' });
  }
}
