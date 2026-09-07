"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

// Define strictly protected operational routes
const PROTECTED_ROUTES = ['/encode', '/decode', '/upload-image'];

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('username');
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtected && !isAuthenticated) {
      // Redirect to login if attempting to access protected actions
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  // Only hide chrome on dedicated authentication screens
  const hideNavbarFooter = ['/login', '/register'].includes(pathname);

  // Guard against flashing protected UI prior to auth resolution
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-[#6F7F5F]">
          <span className="h-2 w-2 rounded-full bg-[#6F7F5F] animate-ping" />
          Verifying Access Permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}