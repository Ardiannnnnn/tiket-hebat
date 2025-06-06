import SideNav from '@/app/ui/dashboard/sidenav';
import { poppins } from '../ui/fonts';
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} relative flex min-h-screen flex-col md:flex-row bg-gray-50`}>
      <SideNav />
      <main className="z-0 flex-grow md:overflow-y-auto p-2 bg-white md:my-6 mx-4 shadow-sm rounded-lg">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
