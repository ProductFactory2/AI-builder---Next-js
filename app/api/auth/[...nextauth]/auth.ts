import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser) {
          session.user.id = dbUser._id.toString()
          session.user.onboardingCompleted = dbUser.onboardingCompleted
          session.user.authProvider = dbUser.authProvider
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser && await existingUser.comparePassword(user.password)) {
            return true; // Successful login
          }
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Error during sign in:', error);
          return false; // Login failed
        }
      }
      return true;
    },
  }
}