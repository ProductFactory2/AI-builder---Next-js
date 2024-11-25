'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const router = useRouter()

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return 'This email is registered manually. Please use password to Sign In.'
      case 'Verification':
        return 'Please verify your email before logging in.'
      default:
        return 'An error occurred'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Access Denied</h1>
        <p className="text-gray-400 text-lg">{getErrorMessage()}</p>
        <Button 
          onClick={() => router.push('/login')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
        >
          Go to Login
        </Button>
      </div>
    </div>
  )
}