import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const { db } = await connectDB()
    
    if (!db) {
      console.error('Database connection failed')
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const existingUser = await db.collection('users').findOne({ email })

    return NextResponse.json({
      exists: !!existingUser
    })
  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check user existence' },
      { status: 500 }
    )
  }
}