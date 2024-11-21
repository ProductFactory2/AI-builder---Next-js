'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const localProjects = useSelector((state: RootState) => state.projects.localProjects);

  useEffect(() => {
    if (pathname === '/chatbot' && localProjects.length === 0) {
      router.push('/dashboard');
    }
  }, [pathname, localProjects, router]);

  return <>{children}</>;
}