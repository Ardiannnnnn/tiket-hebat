// app/(dashboard)/layout.tsx
"use client";

import SideNav from '@/app/ui/dashboard/sidenav';
import { poppins } from '../ui/fonts';
import { Toaster } from "@/components/ui/sonner";
import { withRoleGuard } from "@/app/auth/withRoleGuard";
import { Suspense, useState } from 'react';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`${poppins.className} min-h-screen bg-gray-50`}>
      {/* ✅ DESKTOP: Side-by-side layout */}
      <div className="hidden md:flex h-screen">
        {/* Sidebar */}
        <div className="flex-none">
          <SideNav />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto">
            <div className="p-4 md:p-6 h-full">
              <Suspense fallback={<GlobalLoadingFallback />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {/* ✅ MOBILE: Stacked layout with proper spacing */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Mobile Sidebar Component */}
        <SideNav onToggle={setIsSidebarOpen} />
        
        {/* ✅ Main Content dengan proper top spacing */}
        <main className="flex-1 pt-20"> {/* pt-16 untuk memberikan ruang untuk header mobile */}
          <div className="p-4 min-h-full">
            <Suspense fallback={<MobileLoadingFallback />}>
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm pointer-events-none' : ''}`}>
                {children}
              </div>
            </Suspense>
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

// ✅ Desktop Loading Fallback
function GlobalLoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 grid grid-cols-6 gap-4 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
            
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-8 bg-gray-100 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Mobile Loading Fallback - Lebih compact
function MobileLoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)]">
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-8 bg-gray-200 rounded w-full sm:w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-full sm:w-48"></div>
            </div>
          </div>
          
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
          
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-b">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-6 bg-gray-100 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleGuard(AdminLayout, ["ADMIN"]);