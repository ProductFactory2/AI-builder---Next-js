'use client'

import * as React from 'react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import logo from '@/public/assets/images/logo.png'
import { LogOut, Settings, Users, FolderKanban, User } from 'lucide-react'
import { signOut } from "next-auth/react"

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    {
      href: '/dashboard',
      icon: FolderKanban,
      label: 'Projects'
    },
    {
      href: '/dashboard/community',
      icon: Users,
      label: 'Community'
    },
    {
      href: '/dashboard/profile',
      icon: User,
      label: 'Profile'
    },
    // {
    //   href: '/dashboard/settings',
    //   icon: Settings,
    //   label: 'Settings'
    // }
  ];

  return (
    <div className={`flex h-screen w-64 flex-col bg-[#1E1E1E] ${className}`}>
      <div className="flex h-[60px] items-center justify-center border-b border-[#2A2A2A] px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={logo} 
            alt="CatMod AI Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-white">
            CatMod <span className="text-[#F05D23]">AI</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 
                    ${isActive 
                      ? 'bg-[#F05D23] text-white' 
                      : 'text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-[#2A2A2A] p-3">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white"
        >
          <LogOut className="h-5 w-5 text-[#F05D23]"/>
          Sign out
        </button>
      </div>
    </div>
  )
}