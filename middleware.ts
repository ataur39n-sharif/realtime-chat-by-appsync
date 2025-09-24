import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define protected routes
const protectedRoutes = ['/boards', '/board'];
const authRoutes = ['/login'];

// Function to check if a path is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Function to check if a path is an auth route
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

// Function to verify JWT token
function verifyToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return false;
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const idToken = request.cookies.get('idToken')?.value;
  
  // Check if user is authenticated
  const isAuthenticated = accessToken && idToken && verifyToken(idToken);
  
  // If user is authenticated and trying to access auth routes, redirect to boards
  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL('/boards', request.url));
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is not authenticated and accessing root, redirect to login
  if (!isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and accessing root, redirect to boards
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/boards', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};