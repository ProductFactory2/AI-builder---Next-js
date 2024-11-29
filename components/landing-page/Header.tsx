'use client'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '@/public/landing-page/assets/Logo-header.png'

export default function Header() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const router = useRouter();
    return (
        <>
            <header className='fixed top-0 left-0 w-full bg-primary px-10 py-5 flex justify-between items-center border-b-[0.1px] border-[#E2E8F0] border-opacity-20 z-50'>
                <Link href="#">
                    <Image 
                        src={logo} 
                        alt="Catmod Logo"
                        width={150}
                        height={40}
                        priority
                    />
                </Link>
                
                <nav className='w-2/3 hidden lg:flex'>
                    <nav className='text-white'>
                        <ul className='flex gap-20 items-center'>
                            <li><Link href="#">Framework & Libraries</Link></li>
                            <li><Link href="#">UI Library</Link></li>
                            <li><Link href="#">Blog</Link></li>
                        </ul>
                    </nav>                                                              
                    <nav className='text-white ml-auto'>
                        <p className='btn' onClick={() => router.push('/signup')}>Sign-Up</p>
                        
                    </nav>
                </nav>
                <button onClick={() => setToggleMenu(!toggleMenu)} className='block lg:hidden' >
                    <Bars3Icon className='text-white h-12'/>
                </button>
            </header>

            {toggleMenu && ( 
                <nav className='block lg:hidden text-white mobile-nav'>
                    <ul className='flex flex-col gap-10 items-center'>
                        <li><Link href="#">Framework & Libraries</Link></li>
                        <li><Link href="#">UI Library</Link></li>
                        <li><Link href="#">Blog</Link></li>
                        <li><p className='text-button'>Sign-Up</p></li>
                </ul>
            </nav>)}
        </>
    );
}