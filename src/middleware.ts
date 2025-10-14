import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling subdomain-based store routing
 *
 * Extracts subdomain from hostname and rewrites URL to store page
 * Example: omega.downxtown.com → /store/omega
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Skip middleware for Vercel deployment URLs
  if (isVercelDeployment(hostname)) {
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  const subdomain = getSubdomain(hostname);

  // If subdomain exists and it's not 'www', treat it as a store
  if (subdomain && subdomain !== 'www') {
    // IMPORTANT: Don't rewrite if path already starts with /product, /api, /checkout, /address, etc.
    // These are application routes that should work across all subdomains
    const path = url.pathname;
    if (
      path.startsWith('/product') ||
      path.startsWith('/api') ||
      path.startsWith('/checkout') ||
      path.startsWith('/address') ||
      path.startsWith('/login') ||
      path.startsWith('/signup') ||
      path.startsWith('/_next') ||
      path.startsWith('/favicon')
    ) {
      // Let these routes pass through without rewriting
      return NextResponse.next();
    }

    // Only rewrite root path or /store paths to the subdomain store page
    // Example: sigma.downxtown.com/ → /store/sigma
    url.pathname = `/store/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

/**
 * Check if the hostname is a Vercel deployment URL
 *
 * Examples:
 * - "webstore-lac.vercel.app" → true
 * - "webstore-oci1ldoyk-mufaases-projects.vercel.app" → true
 * - "omega.downxtown.com" → false
 */
function isVercelDeployment(hostname: string): boolean {
  return hostname.includes('.vercel.app') ||
         hostname.includes('vercel.app') ||
         hostname === 'localhost' ||
         hostname.startsWith('localhost:');
}

/**
 * Extract subdomain from hostname
 * 
 * Examples:
 * - "omega.downxtown.com" → "omega"
 * - "www.downxtown.com" → "www"
 * - "downxtown.com" → null
 * - "localhost:3000" → null
 */
function getSubdomain(hostname: string): string | null {
  // Remove port if present (for localhost:3000)
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // For localhost or IP addresses, no subdomain
  if (parts.length < 2 || host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return null;
  }
  
  // For production: omega.downxtown.com → ["omega", "downxtown", "com"]
  // Return first part if there are 3+ parts
  if (parts.length >= 3) {
    return parts[0];
  }
  
  // For 2 parts (e.g., downxtown.com), no subdomain
  return null;
}

/**
 * Configure which routes the middleware runs on
 * 
 * Excludes:
 * - Static files (_next/static)
 * - Image optimization (_next/image)
 * - Favicon
 * - Public files with extensions
 * - API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (e.g., .png, .jpg, .css, .js)
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
