import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      onboardingStatus: any;
      onboardingCompleted: any;
      id: string;
      email: string;
      name: string;
      authProvider: 'local' | 'google';
    }
  }
}

