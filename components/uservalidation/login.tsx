'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { signIn } from 'next-auth/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('User not found. Please signup.')
        } else if (res.status === 401) {
          throw new Error('Incorrect password. Please try again.')
        }
        throw new Error(data.error || 'Login failed')
      }

      // Store user data in localStorage or state management
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
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
                  placeholder="Password"
                />
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-base text-gray-400 hover:text-white">
                  Forget Password?
                </Link>
              </div>

              {error && (
                <div className="text-red-500 text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button type="submit" className="w-[250px] h-12 text-base bg-orange-500 hover:bg-orange-600">
                  CONTINUE
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
                className="w-[250px] h-12 text-base border-gray-700 bg-transparent text-white hover:bg-gray-800"
                onClick={async () => {
                  try {
                    await signIn('google', {
                      callbackUrl: '/dashboard'
                    })
                  } catch (error) {
                    setError('Authentication failed')
                  }
                }}
              >
                <Image src="/images/google.png" alt="Google logo" width={24} height={24} className="mr-3" />
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
    </div>
  )
}