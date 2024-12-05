'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    role: '',
    domain: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.onboardingStatus === 'completed') {
      router.push('/dashboard')
    } else if (session?.user?.name && session?.user?.authProvider === 'google') {
      setFormData(prev => ({
        ...prev,
        name: session.user.name
      }))
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      setError('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

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
                <Input
                  type="text"
                  placeholder="Organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  required
                  className="bg-white h-12 text-base text-black"
                />
                <Input
                  type="text"
                  placeholder="Role (e.g., Developer)"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  required
                  className="bg-white h-12 text-base text-black"
                />
                <Input
                  type="text"
                  placeholder="Domain (e.g., eCommerce)"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  required
                  className="bg-white h-12 text-base text-black"
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