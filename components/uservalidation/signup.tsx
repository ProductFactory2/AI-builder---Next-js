'use client'
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
<<<<<<< HEAD
interface SignupProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
=======
import { PasswordStrength } from '@/components/ui/password-strength'
import { validatePassword } from '@/lib/utils/passwordValidation'

interface SignupProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

>>>>>>> origin/M-userauth-functionalities
export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
<<<<<<< HEAD
=======
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''))
  const [verifyStatus, setVerifyStatus] = useState('idle')

>>>>>>> origin/M-userauth-functionalities
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [timer, isTimerRunning])
<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
=======

  useEffect(() => {
    setPasswordValidation(validatePassword(password))
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

>>>>>>> origin/M-userauth-functionalities
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
    try {
      // Check if user exists first
      const checkUser = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
      const userData = await checkUser.json()
      if (userData?.exists) {
        setError('User already exists. Please use login instead.')
        return
      }
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
      // Proceed with signup only if user doesn't exist
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({
          email,
=======
        body: JSON.stringify({ 
          email, 
>>>>>>> origin/M-userauth-functionalities
          password,
          authProvider: 'local',
          isVerified: false
        }),
      })
<<<<<<< HEAD
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }
=======
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

>>>>>>> origin/M-userauth-functionalities
      // Show OTP modal and send initial OTP
      setShowOtpModal(true)
      await sendOTP()
    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
  const sendOTP = async () => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
<<<<<<< HEAD
      if (!res.ok) {
        throw new Error('Failed to send OTP')
      }
=======

      if (!res.ok) {
        throw new Error('Failed to send OTP')
      }

>>>>>>> origin/M-userauth-functionalities
      setTimer(60)
      setIsTimerRunning(true)
      setOtpError('')
    } catch (error) {
<<<<<<< HEAD
      console.log("error",error)
      setOtpError('Failed to send OTP. Please try again.')
    }
  }
  const verifyOTP = async () => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP')
      }
      setIsVerified(true)
      // Sign in the user automatically after verification
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (signInResult?.error) {
        throw new Error('Failed to sign in')
      }
      // Redirect to dashboard immediately
      router.push('/dashboard')
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Invalid OTP')
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      // First check if user exists and their auth provider
      const checkRes = await fetch('/api/auth/check-auth-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      const { authProvider } = await checkRes.json();
      if (authProvider === 'local') {
        router.push('/error?error=AccessDenied');
        return;
      }
=======
      setOtpError('Failed to send OTP. Please try again.')
    }
  }

  const handleVerifyOTP = async () => {
    try {
      setVerifyStatus('loading')
      setError('')

      // Validate OTP format
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP')
        setVerifyStatus('error')
        return
      }

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // If verification successful, sign in
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      setIsVerified(true)
      setShowOtpModal(false)
      router.push('/onboarding')
    } catch (error) {
      console.error('Verification Error:', error)
      setError(error instanceof Error ? error.message : 'Verification failed')
      setVerifyStatus('error')
    } finally {
      setVerifyStatus('idle')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
>>>>>>> origin/M-userauth-functionalities
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
<<<<<<< HEAD
      if (result?.error) {
        throw new Error(result.error);
      }
=======

      if (result?.error) {
        throw new Error(result.error);
      }
      
      // The actual provider linking will be handled in the OAuth callback API route
>>>>>>> origin/M-userauth-functionalities
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Google signup failed');
    }
  };
<<<<<<< HEAD
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
=======

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/SLbg.png")' }}
    >
>>>>>>> origin/M-userauth-functionalities
      <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[40px] bg-white/10 backdrop-blur-[20px] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Form */}
          <div className="flex flex-col justify-center space-y-8 bg-zinc-900 p-12 text-white">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold">Welcome Aboard !!!</h1>
            </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white h-12 text-base text-black"
                />
              </div>
              <div className="space-y-3">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white h-12 text-base text-black"
                  placeholder="Create Password"
                />
<<<<<<< HEAD
                {error && (
                  <p className="text-red-500 text-sm mt-1 text-center">{error} </p>
                )}
              </div>
=======
                <PasswordStrength 
                  password={password}
                  checks={passwordValidation.checks}
                  score={passwordValidation.score}
                  strength={passwordValidation.strength}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
                )}
              </div>

>>>>>>> origin/M-userauth-functionalities
              <div className="flex justify-center pt-4">
                <Button type="submit" className="w-[250px] h-12 text-base bg-orange-500 hover:bg-orange-600">
                  CONTINUE
                </Button>
              </div>
            </form>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="bg-zinc-900 px-4 text-gray-400">Or</span>
              </div>
            </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="w-[250px] h-12 text-base border-gray-700 bg-transparent text-white hover:bg-gray-800"
                onClick={handleGoogleSignIn}
              >
                <Image src="/images/google.png" alt="Google logo" width={24} height={24} className="mr-3" />
                Continue with Google
              </Button>
            </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
            <p className="text-center text-base text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-400">
                Login
              </Link>
            </p>
          </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
          {/* Right side - Image */}
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
        </div>
      </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="bg-zinc-900 text-white border-gray-700">
          <DialogHeader className="space-y-3 text-center">
            <DialogTitle className="text-2xl font-bold">Verify Your Email</DialogTitle>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to your email address
            </p>
          </DialogHeader>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
          <div className="space-y-6 p-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={!isTimerRunning || isVerified}
              className="bg-white h-12 text-base text-black"
            />
<<<<<<< HEAD
=======
            
>>>>>>> origin/M-userauth-functionalities
            {otpError && <p className="text-red-500 text-sm text-center">{otpError}</p>}
            {isVerified && (
              <p className="text-green-500 text-sm text-center">User Verified Successfully</p>
            )}
<<<<<<< HEAD
            <div className="flex flex-col space-y-4">
              <Button
                onClick={verifyOTP}
=======
            
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleVerifyOTP}
>>>>>>> origin/M-userauth-functionalities
                disabled={!isTimerRunning || !otp || isVerified}
                className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700"
              >
                Verify OTP
              </Button>
<<<<<<< HEAD
=======
              
>>>>>>> origin/M-userauth-functionalities
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="bg-zinc-900 px-4 text-gray-400">Or</span>
                </div>
              </div>
<<<<<<< HEAD
=======

>>>>>>> origin/M-userauth-functionalities
              <Button
                onClick={sendOTP}
                disabled={isTimerRunning || isVerified}
                variant="outline"
                className="w-full h-12 text-base border-gray-700 bg-transparent text-white hover:bg-gray-800 disabled:bg-transparent"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}