'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { PasswordStrength } from '@/components/ui/password-strength'
import { validatePassword } from '@/lib/passwordValidation'
import logo from '@/public/assets/images/logo.png'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenExpired, setIsTokenExpired] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    score: 0,
    strength: "weak"
  })

  // Handle token verification on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${params.token}`)
        if (!response.ok) {
          setIsTokenExpired(true)
        }
      } catch (err) {
        setIsTokenExpired(true)
      }
    }
    verifyToken()
  }, [params.token])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value
    setPassword(newPass)
    setPasswordValidation(validatePassword(newPass))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!passwordValidation.isValid) {
      setError('Please meet all password requirements')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, password })
      })

      if (!response.ok) {
        const data = await response.json()
        if (data.error === 'Token expired' || data.error === 'Token already used') {
          setIsTokenExpired(true)
          return
        }
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 100000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isTokenExpired) {
    return (
      <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 animate-fade-in">
            <Image
              src={logo}
              alt="CatMod AI Logo"
              width={70}
              height={70}
              className="rounded-full mx-auto mb-6 shadow-lg"
            />
            <h2 className="text-3xl font-bold text-white">Link Expired</h2>
            <p className="text-gray-400 mt-2">
              Oops! Looks like you've hit a dead end
            </p>
          </div>

          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#232323] rounded-xl shadow-2xl p-8 border border-[#3A3A3A] animate-slide-up">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <svg 
                  className="w-8 h-8 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-red-500 mb-3">
                Password Reset Link Expired
              </h3>

              <div className="space-y-3 mb-6">
                <p className="text-gray-400">
                  This password reset link has expired or has already been used.
                </p>
              </div>

              <div className="w-full space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full h-11 bg-[#F05D23] hover:bg-[#F05D23]/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={() => router.push('/forgot-password')}
                  variant="outline"
                  className="w-full h-11 border-[#3A3A3A] text-gray-300 hover:bg-[#2A2A2A] transition-all"
                >
                  Request New Reset Link
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-gray-500 text-sm animate-fade-in">
            Need help?{' '}
            <a href="/contact" className="text-[#F05D23] hover:text-[#F05D23]/80 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={logo}
            alt="CatMod AI Logo"
            width={60}
            height={60}
            className="rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400 text-center">
            Please enter your new password below to secure your account
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[#2A2A2A] rounded-xl shadow-2xl p-8 border border-[#3A3A3A]">
          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-500/10 rounded-lg p-4">
                <p className="text-green-500 font-medium">
                  Password reset successful!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="bg-[#1E1E1E] border-[#3A3A3A] text-white"
                    placeholder="Enter your new password"
                  />
                </div>

                <PasswordStrength
                  password={password}
                  checks={passwordValidation.checks}
                  score={passwordValidation.score}
                  strength={passwordValidation.strength}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#1E1E1E] border-[#3A3A3A] text-white"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#F05D23] hover:bg-[#F05D23]/90 transition-colors"
                disabled={!passwordValidation.isValid || !confirmPassword || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-8">
          Remember your password?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-[#F05D23] hover:text-[#F05D23]/80 transition-colors"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  )
}