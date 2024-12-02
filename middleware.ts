import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const { pathname } = request.nextUrl

  // Allow access to the reset password route without authentication
  if (pathname.startsWith('/reset-password')) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  const isAuthPage = ['/login', '/signup'].includes(pathname)
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  } else {
    // Get user data from your API
    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });
    const userData = await userResponse.json();
    
    // If onboarding is not completed and user is trying to access dashboard
    if (!userData.onboardingCompleted && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (userData.onboardingCompleted && request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/reset-password/:path*', // Allow access to reset password
    '/chatbot/:path*',
    '/community/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ]
}
