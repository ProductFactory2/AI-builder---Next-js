'use client'

import * as React from 'react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import logo from '@/public/assets/images/logo.png'
import { LogOut, Settings, Users, FolderKanban, User, Menu, X } from 'lucide-react'
import { signOut } from "next-auth/react"

export default function Sidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
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
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        flex h-screen w-64 flex-col bg-[#1E1E1E] transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-[60px] items-center justify-between border-b border-[#2A2A2A] px-6">
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
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-[#F05D23]"
          >
            <X className="h-6 w-6" />
          </button>
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
                    onClick={() => setIsOpen(false)}
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
    </>
  )
}