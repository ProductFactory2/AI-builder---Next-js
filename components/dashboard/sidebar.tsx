'use client'

import * as React from 'react'
import Image from "next/image"
import Link from "next/link"
import logo from '@/public/assets/images/logo.png'
import { LogOut, Settings, Users, FolderKanban, User } from 'lucide-react'

export default function Sidebar({ className = "" }: { className?: string }) {
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
          <li>
            <Link href="/projects" className="flex items-center gap-2 rounded-md bg-[#F05D23] px-3 py-2 text-white hover:bg-[#F05D23]/90">
              <FolderKanban className="h-5 w-5" />
              Projects
            </Link>
          </li>
          <li>
            <Link href="/community" className="flex items-center gap-2 rounded-md px-3 py-2 text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white">
              <Users className="h-5 w-5" />
              Community
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white">
              <User className="h-5 w-5" />
              Profile
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="border-t border-[#2A2A2A] p-3">
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[#F05D23] hover:bg-[#2A2A2A] hover:text-white">
          <LogOut className="h-5 w-5 text-[#F05D23]" />
          Sign out
        </button>
      </div>
    </div>
  )
}