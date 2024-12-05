import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password, authProvider, googleId } = await request.json();

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please signup.' },
        { status: 404 }
      );
    }

    // Handle local authentication
    if (authProvider === 'local' || authProvider === 'local and google') {
      // If the authProvider is 'local and google', hash the password
      if (authProvider === 'local and google') {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
      } else {
        // Validate the password for local authentication
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Incorrect password. Please try again.' },
            { status: 401 }
          );
        }
      }
    } 
    // Handle Google authentication
    else if (authProvider === 'google') {
      if (!googleId || user.googleId !== googleId) {
        return NextResponse.json(
          { error: 'Google ID does not match. Please try again.' },
          { status: 401 }
        );
      }
    } 
    // Handle unsupported auth providers
    else {
      return NextResponse.json(
        { error: 'Unsupported authentication provider.' },
        { status: 400 }
      );
    }

    // Successful login response
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}