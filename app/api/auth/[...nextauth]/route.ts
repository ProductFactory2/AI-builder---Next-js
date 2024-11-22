import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (user && user.authProvider === 'google') {
          throw new Error('This email is registered with Google. Please use Google Sign In.');
        }

        if (!user || !(await user.comparePassword(credentials.password))) {
          throw new Error('Invalid email or password');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email before logging in');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          authProvider: user.authProvider,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          let dbUser = await User.findOne({ email: user.email });
          
          if (dbUser && dbUser.authProvider === 'local') {
            throw new Error('This email is registered manually. Please use password to Sign In.');
          }

          if (dbUser) {
            if (!dbUser.googleId) {
              await User.findByIdAndUpdate(dbUser._id, {
                googleId: user.id,
                authProvider: 'google',
                isVerified: true
              });
            }
          } else {
            dbUser = await User.create({
              email: user.email,
              googleId: user.id,
              authProvider: 'google',
              isVerified: true
            });
          }
          return true;
        } catch (error) {
          return '/error?error=AccessDenied';
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await User.findOne({ email: session.user.email });
        session.user.id = dbUser?._id.toString();
        session.user.authProvider = dbUser?.authProvider;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }