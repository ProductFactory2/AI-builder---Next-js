import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signIn } from 'next-auth/react';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please signup.' },
        { status: 404 }
      );
    }

    if (user.authProvider === 'google') {
      return NextResponse.json(
        { error: 'Please login with Google' },
        { status: 400 }
      );
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // await signIn('credentials', {
    //   redirect: false,
    //   email: user.email,
    //   password,
    // });

    return NextResponse.json({ message: 'Login successful', data: user });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}