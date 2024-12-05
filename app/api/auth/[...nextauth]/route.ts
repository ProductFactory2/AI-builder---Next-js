import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials?.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found');
          }

          if (!user.authProvider.includes('local')) {
            throw new Error('Please use Google to sign in');
          }

          const isValid = await bcrypt.compare(credentials?.password || '', user.password);
          
          console.log('Password Check:', {
            hasPassword: !!user.password,
            isValid,
            authProvider: user.authProvider
          });

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            authProvider: user.authProvider
          };
        } catch (error) {
          console.error('Auth Error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            await User.create({
              email: user.email,
              googleId: user.id,
              authProvider: 'google',
              isVerified: true,
              name: user.name
            });
          }
          return true;
        } catch (error) {
          console.error('Sign In Error:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
          session.user.authProvider = user.authProvider;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }