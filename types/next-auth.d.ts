import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
<<<<<<< HEAD
=======
      onboardingStatus: any;
      onboardingCompleted: any;
>>>>>>> origin/M-userauth-functionalities
      id: string;
      email: string;
      name: string;
      authProvider: 'local' | 'google';
    }
  }
}

