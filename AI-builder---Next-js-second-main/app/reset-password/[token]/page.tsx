'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { PasswordStrength } from '@/components/ui/password-strength'
import Link from 'next/link'
import { validatePassword } from '@/lib/utils/passwordValidation'

export default function ResetPassword({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'expired'>('idle')
  const [error, setError] = useState('')
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const router = useRouter()

  // Verify token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: params.token }),
        })

        const data = await res.json()

        if (!res.ok || !data.isValid) {
          setStatus('expired')
        }
      } catch (error) {
        setStatus('expired')
      }
    }

    verifyToken()
  }, [params.token])

  // Redirect after status change
  useEffect(() => {
    if (status === 'expired') {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  // Add password validation effect
  useEffect(() => {
    setPasswordValidation(validatePassword(password))
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setStatus('error')
      return
    }

    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError(validation.errors[0])
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          newPassword: password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setStatus('success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setError(error instanceof Error ? error.message : 'Failed to reset password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-[20px] p-8 rounded-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          {status !== 'expired' && (
            <p className="mt-2 text-gray-400">
              Please enter your new password below.
            </p>
          )}
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6">
            <p className="text-green-500">
              Password reset successful! Redirecting to login...
            </p>
          </div>
        ) : status === 'expired' ? (
          <div className="text-center space-y-6">
            <p className="text-red-500">
              Reset link has expired or is invalid.
            </p>
            <p className="text-gray-400">
              Redirecting to login page...
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <PasswordInput
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white h-12 text-base text-black pr-10"
                required
              />
              <PasswordStrength 
                password={password}
                checks={passwordValidation.checks}
                score={passwordValidation.score}
                strength={passwordValidation.strength}
              />
              <PasswordInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white h-12 text-base text-black pr-10"
                required
              />
            </div>
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