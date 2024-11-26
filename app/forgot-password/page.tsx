'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-[20px] p-8 rounded-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6">
            <p className="text-green-500">
              Reset link sent! Check your email for instructions.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white h-12 text-base text-black"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-gray-700 text-white hover:bg-gray-800"
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}