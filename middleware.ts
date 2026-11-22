// Vercel Edge Middleware for Havenora Owner Portal Protection
// Runs at the network edge before any page assets or static files are served.

export const config = {
  // Match all owner routes and root (for owner deployment routing)
  matcher: ['/owner/:path*', '/']
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const hostname = url.hostname.toLowerCase();

  // Exclude static assets and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Check for HTTP-only session cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((part) => {
    const [name, ...val] = part.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(val.join('='));
    }
  });

  const sessionToken = cookies['havenora_session'];
  const isAuthenticated = Boolean(sessionToken && isValidTokenStructure(sessionToken));

  // 1. DEDICATED OWNER DEPLOYMENT ROOT REDIRECT
  // If accessing the dedicated owner domain (havenora21owner.vercel.app) at root "/",
  // direct the user to the owner portal dashboard (or login if unauthenticated).
  if (pathname === '/' && (hostname.includes('owner') || hostname.includes('havenora21owner'))) {
    if (isAuthenticated) {
      return Response.redirect(new URL('/owner/dashboard', request.url), 307);
    } else {
      return Response.redirect(new URL('/owner/login', request.url), 307);
    }
  }

  // 2. OWNER PORTAL ROUTE PROTECTION
  // Allow unauthenticated visitors to reach /owner/login
  if (pathname === '/owner/login' || pathname === '/owner/login/') {
    // If already authenticated, redirect from login to dashboard
    if (isAuthenticated) {
      return Response.redirect(new URL('/owner/dashboard', request.url), 307);
    }
    return;
  }

  // Protect all other /owner/* routes
  if (pathname.startsWith('/owner')) {
    if (!isAuthenticated) {
      // Unauthenticated visitor attempting to access private owner routes:
      // Redirect to /owner/login immediately at the server edge!
      const loginUrl = new URL('/owner/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return Response.redirect(loginUrl, 307);
    }
  }

  // Allow all other requests through
  return;
}

/**
 * Basic structural & expiration validation at the edge
 */
function isValidTokenStructure(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode payload base64url
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }

    if (payload.role !== 'owner') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
