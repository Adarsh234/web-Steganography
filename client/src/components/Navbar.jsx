"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      setUser(localStorage.getItem('username'));
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('_id');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-[#FAF8F5]/90 border-b border-[#5A2E25]/15 text-[#5A2E25] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="text-lg font-black tracking-tight uppercase font-display">
          zero<span className="text-[#B5543A]">~</span>trace
        </Link>

        <nav className="flex items-center gap-6">
          <ul className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            <li>
              <Link href="/" className="hover:text-[#B5543A] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/encode" className="hover:text-[#B5543A] transition">
                Encode
              </Link>
            </li>
            <li>
              <Link href="/decode" className="hover:text-[#B5543A] transition">
                Decode
              </Link>
            </li>
            <li>
              <Link
                href="/upload-image"
                className="px-4 py-2 rounded-full bg-[#5A2E25] text-[#FAF8F5] hover:bg-[#5A2E25]/90 transition"
              >
                Upload
              </Link>
            </li>
          </ul>

          <div className="h-4 w-[1px] bg-[#5A2E25]/20 hidden sm:block" />

          {/* User Session State */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0E6D8]/80 border border-[#5A2E25]/10 text-xs font-medium text-[#5A2E25]">
                <span className="h-2 w-2 rounded-full bg-[#6F7F5F]" />
                <span className="max-w-[120px] truncate">{user}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold uppercase tracking-wider text-[#B5543A] hover:text-[#5A2E25] transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-[#5A2E25] hover:text-[#B5543A] transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;