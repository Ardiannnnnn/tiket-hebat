"use client";

import SideNav from '@/app/ui/dashboard/sidenav';
import { poppins } from '../ui/fonts';
import { Toaster } from "@/components/ui/sonner";
import { withRoleGuard } from "@/app/auth/withRoleGuard";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} flex bg-gray-50`}>
      {/* Sidebar tetap (fixed height) */}
      <SideNav/>

      {/* Main scrollable area */}
      <main className=" my-6 mx-4 flex-grow overflow-y-auto h-screen p-4 bg-white shadow-sm rounded-lg">
        {children}
        <Toaster />
      </main>
    </div>
  );
}

export default withRoleGuard(AdminLayout, ["admin"]);
