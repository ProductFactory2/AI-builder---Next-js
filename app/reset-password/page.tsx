'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setStatus('success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-[20px] p-8 rounded-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="mt-2 text-gray-400">Enter your new password below.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center text-green-500">
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white h-12 text-base text-black"
              required
              minLength={6}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white h-12 text-base text-black"
              required
              minLength={6}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}