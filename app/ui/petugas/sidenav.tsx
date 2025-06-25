// app/ui/petugas/sidenav.tsx
"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/petugas/navlink";
import { LuPower, LuMenu, LuX, LuLoader } from "react-icons/lu";
import { RiDashboardFill, RiHistoryFill } from "react-icons/ri";
import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import img from "@/public/image/ardian.png";
import { RiShipFill } from "react-icons/ri";
import { getCurrentUser, logoutUser } from "@/service/auth";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { User } from "@/types/user";
import { toast } from "sonner";

type LoadingState = 'idle' | 'fetching-user' | 'logging-out' | 'redirecting';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('fetching-user');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const navbarRef = useRef<HTMLDivElement>(null);

  const isLoading = loadingState !== 'idle';
  const isUserLoading = loadingState === 'fetching-user';
  const isLoggingOut = loadingState === 'logging-out' || loadingState === 'redirecting';

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
        console.error("Error fetching user:", error);
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

  // Enhanced click outside detection with loading state check
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLoggingOut) return; // Prevent closing during logout
      
      const target = event.target as Element;
      if (
        !target.closest(".mobile-sidebar") &&
        !target.closest(".hamburger-button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoggingOut]);

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

  // Enhanced toggle with loading state check
  const toggleNavbar = () => {
    if (!isLoggingOut) {
      setIsOpen(!isOpen);
    }
  };

  // Loading skeleton component
  const UserSkeleton = ({ isMobile = false }) => (
    <div className={`${isMobile ? "mt-4" : "mt-6"} flex items-center gap-4 animate-pulse`}>
      <div className="h-12 w-12 rounded-full bg-white/20"></div>
      <div className="space-y-2">
        <div className="h-3 w-16 bg-white/20 rounded"></div>
        <div className="h-4 w-24 bg-white/15 rounded"></div>
      </div>
    </div>
  );

  // Enhanced User Profile Component
  const UserProfile = ({ isMobile = false }) => {
    if (isUserLoading) {
      return <UserSkeleton isMobile={isMobile} />;
    }

    if (error) {
      return (
        <div className={`${isMobile ? "mt-4" : "mt-6"} flex items-center gap-4`}>
          <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-300 text-xs">!</span>
          </div>
          <div className="text-start">
            <p className="text-sm text-red-300">Error</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs text-blue-300 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className={`${isMobile ? "mt-4" : "mt-6"} flex items-center gap-4`}>
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-gray-400 text-sm">?</span>
          </div>
          <div className="text-start">
            <p className="text-sm text-gray-400">Guest</p>
            <p className="text-lg font-semibold">Unknown User</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${isMobile ? "mt-4" : "mt-6"} flex items-center gap-4`}>
        <div className="relative">
          <Image
            src={img}
            width={50}
            height={50}
            alt="User Profile"
            className="h-12 w-12 rounded-full bg-white"
          />
          {isLoggingOut && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <LuLoader className="w-4 h-4 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="text-start">
          <p className="text-sm text-gray-300">
            {user.role?.role_name || "Staff"}
          </p>
          <p className="text-lg font-semibold">{user.full_name || user.username || "User"}</p>
        </div>
      </div>
    );
  };

  // Enhanced Loading Message
  const getLoadingMessage = () => {
    switch (loadingState) {
      case 'fetching-user':
        return 'Loading...';
      case 'logging-out':
        return 'Signing out...';
      case 'redirecting':
        return 'Redirecting...';
      default:
        return 'Sign Out';
    }
  };

  return (
    <>
      {/* Enhanced Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 transition-opacity ${isLoggingOut ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <RiShipFill className="text-blue-600 text-xl" />
            <span className="text-lg font-bold text-gray-900">ASDP SINGKIL</span>
          </div>

          <button
            onClick={toggleNavbar}
            disabled={isLoggingOut}
            className={`
              hamburger-button p-2 rounded-lg transition-colors
              ${isLoggingOut 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-gray-100'
              }
            `}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <LuX className="w-6 h-6 text-gray-700" />
            ) : (
              <LuMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Sidebar */}
      <div
        ref={navbarRef}
        className={`
          mobile-sidebar fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 z-50 transform text-white transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isLoggingOut ? 'pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b border-blue-500/30 bg-blue-600/20 transition-opacity ${isLoggingOut ? 'opacity-70' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <RiShipFill className="text-white text-xl" />
              </div>
              <div>
                <span className="text-lg font-bold">ASDP SINGKIL</span>
                <p className="text-xs text-blue-200">Ferry Services</p>
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

          <div className="px-6">
            <UserProfile isMobile={true} />
          </div>

          {/* Enhanced Menu */}
          <div className={`px-6 mt-6 transition-opacity ${isLoggingOut ? 'opacity-50' : ''}`}>
            <p className="text-md font-semibold text-blue-100">Menu</p>
          </div>

          {/* Enhanced Navigation Links */}
          <div className={`px-6 mt-4 space-y-2 flex-1 transition-opacity ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}>
            <div onClick={() => !isLoggingOut && setIsOpen(false)}>
              <NavLinks disabled={isLoggingOut} />
            </div>
          </div>

          {/* Enhanced Logout Button */}
          <div className="px-6 pb-6">
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className={`
                  flex w-full items-center gap-3 rounded-lg px-4 py-3 text-white transition-all duration-200
                  ${isLoggingOut
                    ? 'bg-red-500/30 border-red-400/50 cursor-not-allowed opacity-70'
                    : 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30'
                  }
                  border
                `}
                disabled={isLoading}
              >
                {isLoggingOut ? (
                  <LuLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <LuPower className="h-5 w-5" />
                )}
                <span>{getLoadingMessage()}</span>
              </button>
            </form>

            {/* Progress indicator */}
            {isLoggingOut && (
              <div className="mt-2">
                <div className="w-full bg-red-200/20 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-red-300 text-center mt-1">
                  {loadingState === 'logging-out' ? 'Signing out...' : 'Redirecting...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Overlay */}
      {isOpen && (
        <div
          className={`
            fixed inset-0 z-40 md:hidden transition-all duration-300
            ${isLoggingOut 
              ? 'bg-black/30 backdrop-blur-sm pointer-events-none' 
              : 'bg-black/50 backdrop-blur-sm'
            }
          `}
          onClick={() => !isLoggingOut && setIsOpen(false)}
        />
      )}

      {/* Enhanced Desktop Sidebar */}
      <div className="hidden md:flex h-full w-[260px] flex-col bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 px-6 py-4 text-white shadow-xl">
        {/* Enhanced Logo */}
        <div className={`flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-opacity ${isLoggingOut ? 'opacity-70' : ''}`}>
          <div className="p-2 bg-blue-500 rounded-lg">
            <RiShipFill className="text-white text-xl" />
          </div>
          <div>
            <span className="text-lg font-bold">ASDP SINGKIL</span>
            <p className="text-xs text-gray-300">Ferry Services</p>
          </div>
        </div>

        <UserProfile />

        {/* Enhanced Menu */}
        <div className={`mt-8 transition-opacity ${isLoggingOut ? 'opacity-50' : ''}`}>
          <p className="text-md font-semibold text-gray-300">Menu</p>
        </div>

        {/* Enhanced Navigation */}
        <div className={`mt-4 space-y-2 transition-opacity ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}>
          <NavLinks disabled={isLoggingOut} />
        </div>

        <div className="flex-grow"></div>

        {/* Enhanced Desktop Logout Button */}
        <form onSubmit={handleLogout} className="mt-6">
          <button
            type="submit"
            className={`
              flex w-full items-center gap-2 rounded-md px-4 py-2 text-white transition-all duration-200
              ${isLoggingOut
                ? 'bg-red-500/30 border-red-400/50 cursor-not-allowed opacity-70'
                : 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30'
              }
              border
            `}
            disabled={isLoading}
          >
            {isLoggingOut ? (
              <LuLoader className="h-5 w-5 animate-spin" />
            ) : (
              <LuPower className="h-5 w-5" />
            )}
            <span>{getLoadingMessage()}</span>
          </button>
        </form>

        {/* Desktop Progress indicator */}
        {isLoggingOut && (
          <div className="mt-2">
            <div className="w-full bg-red-200/20 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-red-300 text-center mt-1">
              {loadingState === 'logging-out' ? 'Signing out...' : 'Redirecting...'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}