// app/ui/dashboard/sidenav.tsx
"use client";

import Link from "next/link";
import { LuPower, LuMenu, LuX, LuLoader, LuChrome, LuBell} from "react-icons/lu";
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

interface SideNavProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function SideNav({ onToggle }: SideNavProps) {
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

  // ✅ Notify parent component about sidebar state
  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const toggleNavbar = () => {
    if (!isLoggingOut) {
      setIsOpen(!isOpen);
    }
  };

  // Enhanced click outside detection
  const handleClickOutside = (event: MouseEvent) => {
    if (isLoggingOut) return;
    
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

  // User fetching (existing code)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingState('fetching-user');
        setError(null);
        
        const data = await getCurrentUser();
        setUser(data.data);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error: any) {
        console.error("Failed to fetch user:", error);
        setError("Gagal memuat profil pengguna");
        setUser(null);
        
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

  // Logout handler (existing code)
  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setLoadingState('logging-out');
      setError(null);
      
      await logoutUser();
      
      destroyCookie(null, "role");
      destroyCookie(null, "refresh_token");
      destroyCookie(null, "access_token");
      
      setLoadingState('redirecting');
      
      toast.success("Logout berhasil", {
        description: "Anda telah keluar dari sistem"
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push("/login");
      
    } catch (err: any) {
      console.error("Logout failed:", err);
      setLoadingState('idle');
      
      const errorMessage = err.message || "Gagal logout";
      setError(errorMessage);
      
      toast.error("Logout gagal", {
        description: errorMessage
      });
      
      if (err.message?.includes('network') || err.message?.includes('500')) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    }
  };

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

  // ✅ Get current page title for mobile header
  const getCurrentPageTitle = () => {
    if (pathname === '/beranda') return 'Dashboard';
    if (pathname?.includes('/kapal')) return 'Data Kapal';
    if (pathname?.includes('/pelabuhan')) return 'Data Pelabuhan';
    if (pathname?.includes('/uploadJadwal')) return 'Jadwal Kapal';
    if (pathname?.includes('/kapasitas')) return 'Kapasitas';
    if (pathname?.includes('/kelasTiket')) return 'Kelas Tiket';
    return 'Dashboard';
  };

  return (
    <>
      {/* ✅ DESKTOP: Sidebar (unchanged) */}
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

        {/* Navigation */}
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

        {/* Profile + Logout Section */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
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

      {/* ✅ MOBILE: Enhanced Fixed Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bg-white z-50 border-b transition-all duration-300 ${isLoggingOut ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* ✅ Enhanced Hamburger Button */}
          <button
            onClick={toggleNavbar}
            disabled={isLoggingOut}
            className={`
              hamburger-btn p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-Blue
              ${isLoggingOut 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 active:scale-95'
              }
            `}
            aria-label="Toggle navigation menu"
          >
            <div className="relative">
              {isOpen ? (
                <LuX className="w-6 h-6 text-gray-700 transition-transform duration-200" />
              ) : (
                <LuMenu className="w-6 h-6 text-gray-700 transition-transform duration-200" />
              )}
            </div>
          </button>

          {/* ✅ Enhanced Center Content */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Image src={logo} width={28} height={28} alt="ASDP Logo" className="rounded-lg" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ASDP
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {getCurrentPageTitle()}
            </span>
          </div>

          {/* ✅ Enhanced User Avatar */}
          <div className="relative">
            {isUserLoading ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            ) : (
              <div className="relative">
                <Image
                  src={adminImg}
                  width={40}
                  height={40}
                  alt="User"
                  className="rounded-full border-2 border-white shadow-lg"
                />
                {/* ✅ Online status indicator */}
                {!isLoggingOut && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
                {isLoggingOut && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <LuLoader className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Enhanced Progress Bar */}
        {isLoggingOut && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 animate-pulse"></div>
        )}
      </div>

      {/* ✅ MOBILE: Enhanced Slide-out Sidebar */}
      <div
        ref={navbarRef}
        className={`
          mobile-sidebar fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-all duration-300 ease-out md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isLoggingOut ? 'pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          {/* ✅ Enhanced Header dengan Gradient */}
          <div className={`bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white transition-opacity ${isLoggingOut ? 'opacity-70' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Image src={logo} width={32} height={32} alt="ASDP Logo" className="rounded-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold">ASDP Ferry Indonesia</p>
                  <p className="text-xs opacity-80">Cabang Singkil</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isLoggingOut 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:bg-white/10 active:scale-95'
                  }
                `}
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* ✅ Enhanced User Info */}
            {isUserLoading ? (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-2 w-20 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                  <span className="text-red-200 text-sm">!</span>
                </div>
                <div className="text-xs">
                  <p className="text-red-200">Error loading profile</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-white hover:underline font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={adminImg}
                      width={48}
                      height={48}
                      alt="User Profile"
                      className="rounded-full border-2 border-white/30"
                    />
                    {!isLoggingOut && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                    {isLoggingOut && (
                      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                        <LuLoader className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.username || "User"}</p>
                    <p className="text-xs opacity-80">{user?.role?.role_name || "Staff"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs opacity-75">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Enhanced Navigation */}
          <div className={`flex-1 overflow-y-auto py-6 bg-gray-50/50 transition-opacity ${isLoggingOut ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Dashboard Section */}
            <div className="px-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <LuChrome className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Dashboard</h3>
              </div>
              <div className="space-y-2" onClick={handleNavClick}>
                <NavLinks links={dashboardLinks} disabled={isLoggingOut} />
              </div>
            </div>

            <hr className="mx-6 border-gray-200" />

            {/* Menu Section */}
            <div className="px-6 my-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Menu Utama</h3>
              </div>
              <div className="space-y-2" onClick={handleNavClick}>
                <NavLinks links={menuLinks} disabled={isLoggingOut} />
              </div>
            </div>

            <hr className="mx-6 border-gray-200" />

            {/* Jadwal Section */}
            <div className="px-6 my-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Jadwal</h3>
              </div>
              <div className="space-y-2" onClick={handleNavClick}>
                <NavLinks links={jadwalLinks} disabled={isLoggingOut} />
              </div>
            </div>
          </div>

          {/* ✅ Enhanced Logout Section */}
          <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`
                flex w-full items-center gap-4 p-4 rounded-xl transition-all duration-300 font-semibold text-sm
                ${isLoggingOut
                  ? 'text-red-400 bg-red-50 cursor-not-allowed shadow-inner'
                  : 'text-red-600 hover:text-red-700 bg-white hover:bg-red-50 shadow-lg hover:shadow-xl active:scale-98'
                }
                ${isLoading ? 'opacity-70' : ''}
              `}
            >
              <div className={`p-2 rounded-lg transition-colors ${isLoggingOut ? 'bg-red-200' : 'bg-red-100'}`}>
                {isLoggingOut ? (
                  <LuLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <LuPower className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">
                  {loadingState === 'logging-out' && 'Logging out...'}
                  {loadingState === 'redirecting' && 'Redirecting...'}
                  {!isLoggingOut && 'Keluar'}
                </div>
                <div className="text-xs opacity-70">
                  {!isLoggingOut && 'Sign out from dashboard'}
                </div>
              </div>
            </button>

            {/* ✅ Enhanced Progress indicator */}
            {isLoggingOut && (
              <div className="mt-4">
                <div className="w-full bg-red-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse transition-all duration-500"></div>
                </div>
                <p className="text-xs text-red-600 text-center mt-2 font-medium">
                  {loadingState === 'logging-out' ? 'Signing out...' : 'Redirecting to login...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Enhanced Overlay */}
      {isOpen && (
        <div 
          className={`
            fixed inset-0 z-30 md:hidden transition-all duration-300
            ${isLoggingOut 
              ? 'bg-black/40 backdrop-blur-md pointer-events-none' 
              : 'bg-black/60 backdrop-blur-sm'
            }
          `}
          onClick={() => !isLoggingOut && setIsOpen(false)}
        />
      )}
    </>
  );
}