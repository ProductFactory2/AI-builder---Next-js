import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please signup.' },
        { status: 404 }
      );
    }

    // Check if user is using Google auth
    if (user.authProvider === 'google') {
      return NextResponse.json(
        { error: 'Please login with Google' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}