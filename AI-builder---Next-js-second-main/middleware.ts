import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const referer = request.headers.get('referer');
  const isComingFromChatbot = referer?.includes('/chatbot');

  // Redirect to /chatbot if coming from /chatbot and not already on /chatbot or /dashboard
  if (isComingFromChatbot && pathname !== '/chatbot' && pathname !== '/dashboard') {
    return NextResponse.redirect(new URL('/chatbot', request.url));
  }

  // Handle root path
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for login, signup, and reset-password pages
  const publicPages = ['/login', '/signup', '/reset-password', '/forgot-password'];
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));
  if (isPublicPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Get user data from your API if token exists
  const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
  });

  // Check if the user data was successfully retrieved
  if (!userResponse.ok) {
    console.error('Failed to fetch user data');
    return NextResponse.next(); // Proceed without user data
  }

  const userData = await userResponse.json();

  // If onboarding is not completed and user is trying to access dashboard
  if (!userData.onboardingCompleted && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/reset-password/:path*',
    '/forgot-password',
    '/chatbot/:path*',
    '/community/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};