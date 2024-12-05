import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const { pathname } = request.nextUrl

  // Special handling for reset password token URLs
  if (pathname.match(/^\/reset-password\/[a-zA-Z0-9]{64}$/)) {
    // Always allow access to valid reset password URLs
    return NextResponse.next()
  }

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }
  
  // Public pages
  const publicPages = ['/login', '/signup', '/reset-password']
  const isPublicPage = publicPages.includes(pathname)

  if (isPublicPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Fetch user data for onboarding checks
  const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
  })
  const userData = await userResponse.json()

  if (!userData.onboardingCompleted && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (userData.onboardingCompleted && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/reset-password/:path*',
    '/chatbot/:path*',
    '/community/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ]
}

// if (pathname === '/chatbot') {
//   if(store.getState().projects.localProjects.length === 0) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
//   return NextResponse.next()
// }
