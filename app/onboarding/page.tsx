'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { PasswordStrength } from '@/components/ui/password-strength'
import { validatePassword } from '@/lib/utils/passwordValidation'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    organizationSize: '',
    role: '',
    domain: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.authProvider === 'google') {
      setFormData(prev => ({
        ...prev,
        name: session.user.name ?? ''
      }))
      setIsGoogleUser(true)
      setShowPasswordField(true)
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        password: isGoogleUser ? password : undefined,
        updateAuthProvider: isGoogleUser
      }

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Onboarding failed')
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      setError('Failed to complete onboarding')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: 'url("/images/SLbg.png")' }}>
      <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[40px] bg-white/10 backdrop-blur-[20px] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Form */}
          <div className="flex flex-col justify-center space-y-8 bg-zinc-900 p-12 text-white">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold">Complete Your Profile</h1>
              <p className="text-gray-400">Please provide some additional details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={session?.user?.authProvider === 'google'}
                  className={`bg-white h-12 text-base text-black ${
                    session?.user?.authProvider === 'google' ? 'opacity-70' : ''
                  }`}
                />
                
                {showPasswordField && (
                  <div className="relative">
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create Password for Email Login"
                      className="bg-white/90 h-12 text-base text-gray-800 w-full rounded-md border border-gray-200 px-3
                      focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent
                      hover:border-orange-200 hover:bg-white transition-all duration-200
                      shadow-sm hover:shadow-md"
                    />
                    <PasswordStrength 
                      password={password}
                      checks={validatePassword(password).checks}
                      score={validatePassword(password).score}
                      strength={validatePassword(password).strength}
                    />
                  </div>
                )}

                <Input
                  type="text"
                  placeholder="Organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  required
                  className="bg-white/90 h-12 text-base text-gray-800 w-full rounded-md border border-gray-200 px-3
                  focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent
                  hover:border-orange-200 hover:bg-white transition-all duration-200
                  shadow-sm hover:shadow-md placeholder:text-gray-400"
                />
                <div className="relative">
                  <select
                    value={formData.organizationSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationSize: e.target.value }))}
                    required
                    className="appearance-none bg-white/90 h-12 text-base text-gray-800 w-full rounded-md border border-gray-200 px-3 
                    focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent
                    hover:border-orange-200 hover:bg-white transition-all duration-200 cursor-pointer
                    shadow-sm hover:shadow-md"
                  >
                    <option value="" className="text-gray-400">Select Organization Size</option>
                    <option value="ME">Just Me</option>
                    <option value="10-50">10-50 employees</option>
                    <option value="50-100">50-100 employees</option>
                    <option value="100-500">100-500 employees</option>
                    <option value="500-1000">500-1000 employees</option>
                    <option value="MORE THAN 1000">More than 1000 employees</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-400">
                    <svg className="fill-current h-4 w-4 transition-transform group-hover:translate-y-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                    className="appearance-none bg-white/90 h-12 text-base text-gray-800 w-full rounded-md border border-gray-200 px-3
                    focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent
                    hover:border-orange-200 hover:bg-white transition-all duration-200 cursor-pointer
                    shadow-sm hover:shadow-md"
                  >
                    <option value="" className="text-gray-400">Select Your Role</option>
                    <option value="Owner">Owner</option>
                    <option value="Finance / Accounting">Finance / Accounting</option>
                    <option value="Operations">Operations</option>
                    <option value="Product">Product</option>
                    <option value="CEO">CEO</option>
                    <option value="HR / Recruiting">HR / Recruiting</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Customer Success / Support">Customer Success / Support</option>
                    <option value="Legal">Legal</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-400">
                    <svg className="fill-current h-4 w-4 transition-transform group-hover:translate-y-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="Your domain (e.g., portfolio, eCommerce,  restaurants, consultants)"
                  className="bg-white/90 h-12 text-base text-gray-800 w-full rounded-md border border-gray-200 px-3
                  focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent
                  hover:border-orange-200 hover:bg-white transition-all duration-200
                  shadow-sm hover:shadow-md placeholder:text-gray-400"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="w-[250px] h-12 text-base bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Continue to Dashboard'}
                </Button>
              </div>
            </form>
          </div>

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
    </div>
  )
}