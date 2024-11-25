import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (token) {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};