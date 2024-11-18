import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.sub) {
        try {
          await connectDB();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user if doesn't exist
            await User.create({
              email: user.email,
              name: user.name,
              googleId: profile.sub,
              authProvider: 'google'
            });
          } else if (!existingUser.googleId) {
            // Update existing user with Google ID if they didn't have one
            existingUser.googleId = profile.sub;
            existingUser.authProvider = 'google';
            await existingUser.save();
          }
        } catch (error) {
          console.error('Error saving Google user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.authProvider = dbUser.authProvider;
          }
        } catch (error) {
          console.error('Session callback error:', error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
});

export { handler as GET, handler as POST }