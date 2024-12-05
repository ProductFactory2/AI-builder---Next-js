import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'
import { validatePassword } from '@/lib/passwordValidation'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await req.json()

    // Validate password
    const validation = validatePassword(password)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Password does not meet requirements',
        validationErrors: validation.errors 
      }, { status: 400 })
    }

    await connectDB()
    
    // Find user
    const user = await User.findOne({ email: session.user.email }).select('+password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Set password
    user.password = password // This will trigger the pre-save middleware

    // Update auth provider based on existing providers
    if (user.googleId) {
      user.authProvider = 'local and google' // Keep both providers if Google exists
    } else {
      user.authProvider = 'local' // Otherwise just local
    }

    // Save will trigger the pre-save hook which handles password hashing
    await user.save()

    // Log the update
    console.log('Password Setup:', {
      email: user.email,
      authProvider: user.authProvider,
      hasPassword: !!user.password,
      hasGoogleId: !!user.googleId
    })

    return NextResponse.json({ 
      message: 'Password set successfully',
      authProvider: user.authProvider 
    }, { status: 200 })

  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to set up password' 
    }, { status: 500 })
  }
}