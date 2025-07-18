// app/petugas/layout.tsx
"use client";

import SideNav from '@/app/ui/petugas/sidenav';
import { poppins } from '../ui/fonts';
import { withRoleGuard } from "@/app/auth/withRoleGuard";

function PetugasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} flex h-screen flex-col md:flex-row md:overflow-hidden`}>
      <div className="w-full flex-none md:w-64">
        <SideNav /> 
      </div>
      <main className="flex-grow md:overflow-y-auto pt-26 md:pt-0">{children}</main>
    </div>
  );
}

export default withRoleGuard(PetugasLayout, ["OPERATOR"]);
//  