"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PasswordInput } from "@/components/ui/password-input"
import { PasswordStrength } from "@/components/ui/password-strength"
import { validatePassword } from "@/lib/passwordValidation"

interface UserProfile {
  name: string;
  email: string;
  password: string;
  organization: string;
  role: string;
  domain: string;
  isVerified: boolean;
  authProvider: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resetError, setResetError] = useState("")
  const { data: session } = useSession()
  const [showPasswordSetupModal, setShowPasswordSetupModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showMainProfile, setShowMainProfile] = useState(true)
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: false,
    errors: [],
    strength: 'weak',
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    }
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  useEffect(() => {
    if (profile?.authProvider === 'google' && !profile?.password) {
      setShowMainProfile(false)
      setShowPasswordSetupModal(true)
    }
  }, [profile])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetStatus('loading')
    setResetError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link')
      
      setResetStatus('success')
    } catch (error) {
      setResetStatus('error')
      setResetError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const handleSaveChanges = async () => {
    try {
      const formData = {
        name: profile?.name,
        organization: profile?.organization,
        role: profile?.role,
        domain: profile?.domain,
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      const data = await response.json()
      setProfile(prev => ({
        ...prev!,
        ...formData,
        name: formData.name || '',
        organization: formData.organization || '',
        role: formData.role || '',
        domain: formData.domain || ''
      }))
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setNewPassword(newPassword)
    setPasswordValidation(validatePassword(newPassword))
  }

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (!passwordValidation.isValid) {
      setPasswordError("Please meet all password requirements")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match")
      return
    }

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })

      if (!response.ok) throw new Error('Failed to set password')

      const data = await response.json()
      setProfile(prev => ({
        ...prev!,
        password: '••••••••',
        authProvider: 'local and google'
      }))
      setShowPasswordSetupModal(false)
      setShowMainProfile(true)
      
      // Refresh profile data to get updated auth status
      const profileResponse = await fetch('/api/user/profile')
      const profileData = await profileResponse.json()
      setProfile(profileData)
    } catch (error) {
      setPasswordError('Failed to set password')
    }
  }

  return (
    <div className="container mx-auto p-8  ">
      {!showMainProfile ? (
      
        
        <Dialog open={showPasswordSetupModal} onOpenChange={() => {}} >
        <DialogContent className="bg-zinc-900 text-white border-gray-700 fixed left-[58%]" 
          hideClose 
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault()
          }}>
            <DialogHeader>
              <DialogTitle>Set Up Password</DialogTitle>
              <p className="text-sm text-gray-400">
                Please set up a secure password to access your profile
              </p>
            </DialogHeader>
            <form onSubmit={handlePasswordSetup} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <PasswordInput
                    id="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="bg-[#2A2A2A] border-none text-white mt-1.5"
                    placeholder="Enter new password"
                  />
                </div>
                
                <PasswordStrength
                  password={newPassword}
                  checks={passwordValidation.checks}
                  score={passwordValidation.score}
                  strength={passwordValidation.strength}
                />

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#2A2A2A] border-none text-white mt-1.5"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
                  {passwordError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#F05D23] hover:bg-[#F05D23]/80 h-11"
                disabled={!passwordValidation.isValid || !confirmPassword}
              >
                Set Password
              </Button>
            </form>
          </DialogContent>
        </Dialog>
     
      ) : (
        <div className="space-y-6">
          <Card className="border-[#F05D23]/20 bg-[#1E1E1E]">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      className="bg-[#2A2A2A] border-none text-white"
                      placeholder="Enter your name"
                      value={profile?.name || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev!, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="organization" className="text-white">Organization</Label>
                  <Input
                    id="organization"
                    className="bg-[#2A2A2A] border-none text-white"
                    placeholder="Your organization"
                    value={profile?.organization || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, organization: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-white">Role</Label>
                  <Input
                    id="role"
                    className="bg-[#2A2A2A] border-none text-white"
                    placeholder="Your role"
                    value={profile?.role || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev!, role: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                {(profile?.authProvider === 'local' || profile?.authProvider === 'google' || profile?.authProvider === 'local and google') && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      className="bg-[#F05D23] hover:bg-[#F05D23]/80 text-white h-9 px-4 text-sm font-medium transition-colors"
                      onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                    {isEditing && (
                      <Button 
                        variant="outline"
                        className="h-9 px-4 text-sm border-gray-700 text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#F05D23]/20 bg-[#1E1E1E]">
            <CardHeader>
              <CardTitle className="text-white">Login Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="bg-[#2A2A2A] border-none text-white"
                    value={profile?.email || ''}
                    disabled
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {profile?.isVerified && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {(profile?.authProvider === 'local' || profile?.authProvider === 'local and google') && (
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="bg-[#2A2A2A] border-none text-white pr-24"
                      value={profile?.password || ''}
                      disabled={true}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-[#F05D23] hover:text-[#F05D23]/80 text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
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
                className="w-full h-12 text-base bg-[#F05D23] hover:bg-[#F05D23]/80"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6 p-4">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm text-center">
                  We'll send you a link to reset your password.
                </p>
              </div>
              {resetError && (
                <p className="text-red-500 text-sm text-center">{resetError}</p>
              )}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-[#F05D23] hover:bg-[#F05D23]/80"
                disabled={resetStatus === 'loading'}
              >
                {resetStatus === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
