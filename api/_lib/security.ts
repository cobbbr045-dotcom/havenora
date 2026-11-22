import crypto from 'crypto';

// Configuration from Environment Variables with secure defaults
export const SECURITY_CONFIG = {
  OWNER_USERNAME: process.env.OWNER_USERNAME || 'anuj123457',
  OWNER_PASSWORD: process.env.OWNER_PASSWORD || 'havenora2026',
  SESSION_SECRET: process.env.SESSION_SECRET || 'hv_sec_984f8a3d7b2c1e6a5f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8',
  COOKIE_NAME: 'havenora_session',
  TOKEN_EXPIRY_SECONDS: 86400, // 24 hours
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000 // 15 minutes
};

// In-memory rate limiting store for brute-force mitigation
interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION_MS * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000).unref?.();

/**
 * Check if an IP address is currently rate-limited
 */
export function checkRateLimit(ip: string): { isLimited: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    return { isLimited: false, remainingAttempts: SECURITY_CONFIG.MAX_FAILED_ATTEMPTS };
  }

  // Check if locked out
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { isLimited: true, remainingAttempts: 0, retryAfterSeconds: retryAfter };
  }

  // If lockout expired, reset
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    rateLimitStore.delete(ip);
    return { isLimited: false, remainingAttempts: SECURITY_CONFIG.MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, SECURITY_CONFIG.MAX_FAILED_ATTEMPTS - entry.attempts);
  return { isLimited: false, remainingAttempts: remaining };
}

/**
 * Record a failed login attempt for an IP
 */
export function recordFailedAttempt(ip: string): { isLocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  if (!entry) {
    entry = { attempts: 1, lastAttempt: now };
  } else {
    // If last attempt was more than 15 minutes ago, reset
    if (now - entry.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION_MS) {
      entry.attempts = 1;
    } else {
      entry.attempts += 1;
    }
    entry.lastAttempt = now;
  }

  if (entry.attempts >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION_MS;
    rateLimitStore.set(ip, entry);
    return { isLocked: true, retryAfterSeconds: Math.ceil(SECURITY_CONFIG.LOCKOUT_DURATION_MS / 1000) };
  }

  rateLimitStore.set(ip, entry);
  return { isLocked: false };
}

/**
 * Reset failed attempts upon successful authentication
 */
export function resetFailedAttempts(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Timing-safe string comparison to prevent timing side-channel attacks
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Run constant-time compare against itself to consume same time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface SessionPayload {
  sub: string; // username
  role: 'owner';
  fullName: string;
  iat: number;
  exp: number;
}

/**
 * Create a cryptographically signed HMAC-SHA256 session token
 */
export function createSessionToken(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: username,
    role: 'owner',
    fullName: 'Tenzing Norbu',
    iat: now,
    exp: now + SECURITY_CONFIG.TOKEN_EXPIRY_SECONDS
  };

  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECURITY_CONFIG.SESSION_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 session token
 */
export function verifySessionToken(token: string): { valid: boolean; payload?: SessionPayload } {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [headerB64, payloadB64, signature] = parts;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SECURITY_CONFIG.SESSION_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  if (!safeCompare(signature, expectedSignature)) {
    return { valid: false };
  }

  try {
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false };
    }

    // Verify role and username
    if (payload.role !== 'owner' || payload.sub !== SECURITY_CONFIG.OWNER_USERNAME) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

/**
 * Extract client IP address from Vercel request headers
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return String(realIp).trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Parse cookies from request Cookie header
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  }
  return cookies;
}

/**
 * Build Set-Cookie header with HttpOnly, Secure, SameSite=Lax flags
 */
export function buildSessionCookie(token: string, maxAgeSeconds: number = SECURITY_CONFIG.TOKEN_EXPIRY_SECONDS): string {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  // Include Secure flag unless in explicit local test without HTTPS
  const secureFlag = isProd ? '; Secure' : '';
  return `${SECURITY_CONFIG.COOKIE_NAME}=${token}; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

/**
 * Build clear session cookie for logout
 */
export function buildClearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const secureFlag = isProd ? '; Secure' : '';
  return `${SECURITY_CONFIG.COOKIE_NAME}=; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
