import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { store } from "@/store/store";
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const { pathname } = request.nextUrl
  const referer = request.headers.get('referer')
  const isComingFromChatbot = referer?.includes('/chatbot')
  // If user is in chatbot and tries to navigate elsewhere (except dashboard)
  if (isComingFromChatbot && pathname !== '/chatbot' && pathname !== '/dashboard') {
    return NextResponse.redirect(new URL('/chatbot', request.url))
  }
  // Get the pathname of the request
  // Check if the pathname is root
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }
  // if (pathname === '/chatbot') {
  //   if(store.getState().projects.localProjects.length === 0) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url))
  //   }
  //   return NextResponse.next()
  // }
  // Check if it's an auth page (login or signup)
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
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/chatbot/:path*',
    '/community/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ]
}