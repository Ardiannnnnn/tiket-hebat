// app/(dashboard)/layout.tsx - REMOVE QueryClient ✅
"use client";

import SideNav from '@/app/ui/dashboard/sidenav';
import { poppins } from '../ui/fonts';
import { Toaster } from "@/components/ui/sonner";
import { withRoleGuard } from "@/app/auth/withRoleGuard";
import { Suspense } from 'react';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} flex h-screen bg-gray-50`}>
      {/* ✅ Sidebar */}
      <div className="flex-none">
        <SideNav />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <div className="p-4 md:p-6 h-full">
            {/* ✅ Only Suspense, no QueryClient */}
            <Suspense fallback={<GlobalLoadingFallback />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

// ✅ Keep your existing GlobalLoadingFallback
function GlobalLoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Your existing skeleton code */}
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

export default withRoleGuard(AdminLayout, ["ADMIN"]);