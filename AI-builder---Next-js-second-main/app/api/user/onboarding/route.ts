// Import necessary modules from NextAuth and other libraries
import NextAuth from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// Create the NextAuth handler for authentication
const handler = NextAuth(authOptions);
export { handler as GET };

// Define the POST function for onboarding users
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const { password, updateAuthProvider, ...formData } = await req.json()

    // Validate required fields
    if (!formData.name || !formData.organization || !formData.organizationSize || !formData.role || !formData.domain) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user data
    Object.assign(user, formData)
    user.onboardingCompleted = true

    // Handle Google user setting up password
    if (updateAuthProvider && password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      }
      
      user.password = password // Will be hashed by pre-save hook
      await user.updateAuthProvider('local') // This method is already defined in User model
    }

    await user.save()

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        organization: user.organization,
        organizationSize: user.organizationSize,
        role: user.role,
        domain: user.domain
      }
    })

  } catch (error) {
    console.error('Onboarding Error:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}