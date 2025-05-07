'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LogOut } from 'lucide-react';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface SessionLayoutProps {
  children: ReactNode;
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default function SessionLayout({ children }: SessionLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('access_token');
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.replace('/login');
  };

  if (checking || !authorized) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="w-full p-4 bg-gradient-to-r from-pink-200 to-teal-200 flex items-center justify-between">
        <img src="/assets/logo.png" alt="Logo" className="h-8" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-black hover:opacity-80 cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={20} className="cursor-pointer" /> Logout
        </button>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}




