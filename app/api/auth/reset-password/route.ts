import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { validatePassword } from '@/lib/passwordValidation'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // Validate password
    const validation = validatePassword(password)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Password does not meet requirements' 
      }, { status: 400 })
    }

    await connectDB()

    // Find user with valid reset token and token not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid or expired reset token' 
      }, { status: 400 })
    }

    // Update password and clear reset token
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({ 
      message: 'Password reset successful' 
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ 
      error: 'Failed to reset password' 
    }, { status: 500 })
  }
}