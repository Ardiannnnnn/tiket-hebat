// app/ui/dashboard/sidenav.tsx
"use client";

import Link from "next/link";
import { LuPower, LuMenu, LuX, LuLoader} from "react-icons/lu";
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import NavLinks, { dashboardLinks, jadwalLinks, menuLinks } from "./navlink";
import logo from "@/public/image/asdp_2.png";
import adminImg from "@/public/image/ardian.png";
import { getCurrentUser, logoutUser } from "@/service/auth";
import { usePathname, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { User } from "@/types/user";
import { toast } from "sonner";

type LoadingState = 'idle' | 'fetching-user' | 'logging-out' | 'redirecting';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('fetching-user');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = loadingState !== 'idle';
  const isUserLoading = loadingState === 'fetching-user';
  const isLoggingOut = loadingState === 'logging-out' || loadingState === 'redirecting';

  const toggleNavbar = () => {
    if (!isLoggingOut) {
      setIsOpen(!isOpen);
    }
  };

  // Enhanced click outside detection with loading state check
  const handleClickOutside = (event: MouseEvent) => {
    if (isLoggingOut) return; // Prevent closing during logout
    
    const target = event.target as Element;
    if (!target.closest('.mobile-sidebar') && !target.closest('.hamburger-btn')) {
      setIsOpen(false);
    }
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoggingOut]);

  // Enhanced user fetching with proper loading states
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingState('fetching-user');
        setError(null);
        
        const data = await getCurrentUser();
        setUser(data.data);
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error: any) {
        console.error("Failed to fetch user:", error);
        setError("Gagal memuat profil pengguna");
        setUser(null);
        
        // If token is invalid, redirect to login
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          toast.error("Sesi telah berakhir", {
            description: "Silakan login kembali"
          });
          router.push("/login");
          return;
        }
      } finally {
        setLoadingState('idle');
      }
    };

    fetchProfile();
  }, [router]);

  // Enhanced logout with proper loading states
  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent double-click
    
    try {
      setLoadingState('logging-out');
      setError(null);
      
      // Step 1: Call logout API
      await logoutUser();
      
      // Step 2: Clear cookies
      destroyCookie(null, "role");
      destroyCookie(null, "refresh_token");
      destroyCookie(null, "access_token");
      
      // Step 3: Prepare redirect
      setLoadingState('redirecting');
      
      // Step 4: Show success message
      toast.success("Logout berhasil", {
        description: "Anda telah keluar dari sistem"
      });
      
      // Step 5: Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 6: Redirect
      router.push("/login");
      
    } catch (err: any) {
      console.error("Logout failed:", err);
      setLoadingState('idle');
      
      const errorMessage = err.message || "Gagal logout";
      setError(errorMessage);
      
      toast.error("Logout gagal", {
        description: errorMessage
      });
      
      // Force redirect on critical error
      if (err.message?.includes('network') || err.message?.includes('500')) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  };

  // Enhanced navigation click handler
  const handleNavClick = () => {
    if (!isLoggingOut) {
      setIsOpen(false);
    }
  };

  // Loading skeleton component
  const UserSkeleton = () => (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="space-y-1">
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
        <div className="h-2 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP: Enhanced Sidebar */}
      <div className="hidden md:flex h-full w-[270px] flex-col px-4 py-6 text-black overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <Image
            className="rounded-xl"
            src={logo}
            width={50}
            height={50}
            alt="ASDP Logo"
          />
          <div className="leading-tight">
            <p className="text-xs text-gray-600">PT ASDP Ferry Indonesia</p>
            <p className="text-sm font-semibold">Cabang Singkil</p>
          </div>
        </div>

        {/* Navigation with loading state */}
        <div className={`mt-4 bg-gray-100 p-3 rounded-lg shadow-sm transition-opacity ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="mt-4 p-3">
            <p className="text-sm font-semibold text-gray-700">Dashboard</p>
            <div className="mt-2 space-y-1">
              <NavLinks links={dashboardLinks} disabled={isLoggingOut} />
            </div>
          </div>

          <div className="p-3">
            <p className="text-sm font-semibold text-gray-700">Menu</p>
            <div className="mt-2 space-y-1">
              <NavLinks links={menuLinks} disabled={isLoggingOut} />
            </div>
          </div>

          <div className="p-3">
            <p className="text-sm font-semibold text-gray-700">Jadwal</p>
            <div className="mt-2">
              <NavLinks links={jadwalLinks} disabled={isLoggingOut} />
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* Enhanced Profile + Logout Section */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          {/* User Profile */}
          {isUserLoading ? (
            <UserSkeleton />
          ) : error ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xs">!</span>
              </div>
              <div className="text-xs text-red-600">
                <p>Error loading profile</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Image
                src={adminImg}
                width={45}
                height={45}
                alt="Admin Profile"
                className="rounded-full"
              />
              <div className="leading-tight">
                <p className="text-xs text-gray-500">{user?.role?.role_name || "User"}</p>
                <p className="text-sm font-semibold">{user?.username || "Loading..."}</p>
              </div>
            </div>
          )}

          {/* Enhanced Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className={`
              flex w-full items-center gap-3 p-2 rounded-lg mt-3 transition-all duration-200
              ${isLoggingOut 
                ? 'text-red-400 bg-red-50 cursor-not-allowed' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
              }
              ${isLoading ? 'opacity-70' : ''}
            `}
          >
            {isLoggingOut ? (
              <LuLoader className="h-5 w-5 animate-spin" />
            ) : (
              <LuPower className="h-5 w-5" />
            )}
            <span className="font-medium">
              {loadingState === 'logging-out' && 'Logging out...'}
              {loadingState === 'redirecting' && 'Redirecting...'}
              {!isLoggingOut && 'Keluar'}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE: Enhanced Top Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-30 border-b transition-opacity ${isLoggingOut ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Enhanced Hamburger Button */}
          <button
            onClick={toggleNavbar}
            disabled={isLoggingOut}
            className={`
              hamburger-btn p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isLoggingOut 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-gray-100 active:bg-gray-200'
              }
            `}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <LuX className="w-6 h-6 text-gray-700" />
            ) : (
              <LuMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Enhanced Logo & Brand */}
          <div className="flex items-center gap-2">
            <Image src={logo} width={24} height={24} alt="ASDP Logo" className="rounded" />
            <span className="text-sm font-semibold text-gray-900">ASDP Singkil</span>
          </div>

          {/* Enhanced User Avatar */}
          <div className="relative">
            {isUserLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
            ) : (
              <Image
                src={adminImg}
                width={32}
                height={32}
                alt="User"
                className="rounded-full"
              />
            )}
            {isLoggingOut && (
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                <LuLoader className="w-3 h-3 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE: Enhanced Slide-out Sidebar */}
      <div
        ref={navbarRef}
        className={`
          mobile-sidebar fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isLoggingOut ? 'pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className={`bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white transition-opacity ${isLoggingOut ? 'opacity-70' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image src={logo} width={40} height={40} alt="ASDP Logo" className="rounded-lg" />
                <div>
                  <p className="text-sm font-bold">ASDP Ferry</p>
                  <p className="text-xs opacity-90">Cabang Singkil</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isLoggingOut 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:bg-white/10'
                  }
                `}
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Enhanced User Info in Header */}
            {isUserLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-2 w-16 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-300 text-xs">!</span>
                </div>
                <div className="text-xs">
                  <p className="text-red-200">Error loading profile</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-white hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={adminImg}
                    width={40}
                    height={40}
                    alt="User Profile"
                    className="rounded-full border-2 border-white/20"
                  />
                  {isLoggingOut && (
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                      <LuLoader className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.username || "User"}</p>
                  <p className="text-xs opacity-75">{user?.role?.role_name || "Staff"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Navigation */}
          <div className={`flex-1 overflow-y-auto py-4 transition-opacity ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Dashboard Section */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Dashboard</h3>
              </div>
              <div className="space-y-1" onClick={handleNavClick}>
                <NavLinks links={dashboardLinks} disabled={isLoggingOut} />
              </div>
            </div>

            <hr className="mx-4 border-gray-200" />

            {/* Menu Section */}
            <div className="px-4 my-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Menu</h3>
              </div>
              <div className="space-y-1" onClick={handleNavClick}>
                <NavLinks links={menuLinks} disabled={isLoggingOut} />
              </div>
            </div>

            <hr className="mx-4 border-gray-200" />

            {/* Jadwal Section */}
            <div className="px-4 my-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Jadwal</h3>
              </div>
              <div className="space-y-1" onClick={handleNavClick}>
                <NavLinks links={jadwalLinks} disabled={isLoggingOut} />
              </div>
            </div>
          </div>

          {/* Enhanced Logout Section */}
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`
                flex w-full items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium
                ${isLoggingOut
                  ? 'text-red-400 bg-red-50 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }
                ${isLoading ? 'opacity-70' : ''}
              `}
            >
              <div className={`p-1 rounded-lg ${isLoggingOut ? 'bg-red-200' : 'bg-red-100'}`}>
                {isLoggingOut ? (
                  <LuLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <LuPower className="h-4 w-4" />
                )}
              </div>
              <span>
                {loadingState === 'logging-out' && 'Logging out...'}
                {loadingState === 'redirecting' && 'Redirecting...'}
                {!isLoggingOut && 'Keluar'}
              </span>
            </button>

            {/* Progress indicator */}
            {isLoggingOut && (
              <div className="mt-2">
                <div className="w-full bg-red-200 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-red-600 text-center mt-1">
                  {loadingState === 'logging-out' ? 'Signing out...' : 'Redirecting...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Overlay with loading state */}
      {isOpen && (
        <div 
          className={`
            fixed inset-0 z-30 md:hidden transition-all duration-300
            ${isLoggingOut 
              ? 'bg-black/30 backdrop-blur-sm pointer-events-none' 
              : 'bg-black/50 backdrop-blur-sm'
            }
          `}
          onClick={() => !isLoggingOut && setIsOpen(false)}
        />
      )}
    </>
  );
}