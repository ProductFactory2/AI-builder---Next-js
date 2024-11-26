'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { signIn } from 'next-auth/react'
<<<<<<< HEAD
=======
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
>>>>>>> origin/M-userauth-functionalities

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
<<<<<<< HEAD
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Attempt NextAuth signin directly
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        // Handle specific error cases
        if (result.error === 'Please verify your email before logging in') {
          setError('Please verify your email. Check your inbox for the verification link.')
          return
        }
        setError(result.error)
        return
      }

      // Successful login, redirect to dashboard
      router.push('/dashboard')

    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Check auth provider before Google sign-in
      const checkRes = await fetch('/api/auth/check-auth-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const { authProvider } = await checkRes.json()
      
      if (authProvider === 'local') {
        setError('This email is registered manually. Please use password to sign in.')
        return
      }
  
      const result = await signIn('google', { 
        redirect: false 
      })
      
      if (result?.error) {
        setError('Failed to sign in with Google')
        return
      }
  
      router.push('/dashboard')
    } catch (error) {
      setError('An error occurred during sign in')
=======
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resetError, setResetError] = useState('')

  const handleGoogleSignIn = async () => {
    try {
      setStatus('loading');
      
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        throw new Error('Google sign in failed');
      }

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // Check user's auth provider first
      const checkRes = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const userData = await checkRes.json();

      if (!userData.exists) {
        setError('No account found with this email');
        setStatus('error');
        return;
      }

      // Check if local auth is enabled
      if (!userData.authProvider.includes('local')) {
        setError('Please use Google to sign in');
        setStatus('error');
        return;
      }

      // Proceed with credentials login
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) {
        throw new Error('Invalid credentials');
      }

      setStatus('success');
      router.push('/dashboard');
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Failed to login');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetStatus('loading')
    setResetError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link')
      }

      setResetStatus('success')
    } catch (error) {
      setResetStatus('error')
      setResetError(error instanceof Error ? error.message : 'Something went wrong')
>>>>>>> origin/M-userauth-functionalities
    }
  }

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
=======
    <div 
      className="flex min-h-screen items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/SLbg.png")' }}
    >
>>>>>>> origin/M-userauth-functionalities
      <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[40px] bg-white/10 backdrop-blur-[20px] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image */}
          <div className="flex items-center justify-center bg-gray-100 p-12">
            <div className="relative h-96 w-96">
              <Image
                src="/images/cat.png"
                alt="Cat with headphones"
                width={600}
                height={600}
                className="object-contain"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-center space-y-8 bg-zinc-900 p-12 text-white">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold">Welcome back</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white h-12 text-base text-black"
                />
              </div>
              <div className="space-y-3">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white h-12 text-base text-black"
                  placeholder="Password"
                />
<<<<<<< HEAD
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-sm text-orange-500 hover:text-orange-400 p-0 h-auto"
                    onClick={() => router.push('/forgot-password')}
=======
                <div className="text-right">
                  <Button
                    variant="outline" 
                    className="text-base text-gray-400 hover:text-white p-0"
                    onClick={() => setShowForgotPasswordModal(true)}
>>>>>>> origin/M-userauth-functionalities
                  >
                    Forgot Password?
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-center">
                  <p className="text-red-500 text-sm">{error}</p>
<<<<<<< HEAD
                  {error.includes('verify your email') && (
                    <p className="text-gray-400 text-xs mt-1">
                      Didn't receive verification email?{' '}
                      <Link href="/signup" className="text-orange-500 hover:text-orange-400">
                        Sign up again
                      </Link>
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-center pt-4">
                <Button type="submit" className="w-[250px] h-12 text-base bg-orange-500 hover:bg-orange-600">
                  CONTINUE
=======
                </div>
              )}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="w-[250px] h-12 text-base bg-orange-500 hover:bg-orange-600"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Signing in...' : 'CONTINUE'}
>>>>>>> origin/M-userauth-functionalities
                </Button>
              </div>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="bg-zinc-900 px-4 text-gray-400">Or</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
<<<<<<< HEAD
                className="w-[250px] h-12 text-base border-gray-700 bg-transparent text-white hover:bg-gray-800"
                onClick={handleGoogleSignIn}
              >
                <Image src="/images/google.png" alt="Google logo" width={24} height={24} className="mr-3" />
=======
                className="w-[250px] h-12 text-base border-gray-700 bg-transparent text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={status === 'loading'}
              >
                <Image 
                  src="/images/google.png" 
                  alt="Google" 
                  width={24} 
                  height={24} 
                  className="mr-2"
                />
>>>>>>> origin/M-userauth-functionalities
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-base text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="bg-zinc-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Reset Password</DialogTitle>
          </DialogHeader>
          
          {resetStatus === 'success' ? (
            <div className="space-y-6 p-4 text-center">
              <p className="text-green-500">
                Reset link sent! Check your email for instructions.
              </p>
              <Button
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6 p-4">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <Input
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="bg-white h-12 text-base text-black"
                  required
                />
              </div>
              {resetError && (
                <p className="text-red-500 text-sm text-center">{resetError}</p>
              )}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
                disabled={resetStatus === 'loading'}
              >
                {resetStatus === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
>>>>>>> origin/M-userauth-functionalities
    </div>
  )
}