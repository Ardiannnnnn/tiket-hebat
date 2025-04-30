import SideNav from '@/app/ui/dashboard/sidenav';
import { poppins } from '../ui/fonts';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  console.log(poppins.className);
  return (
    <div className={`${poppins.className} bg-gray-50 flex h-screen flex-col md:flex-row md:overflow-hidden`}>
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <main className="flex-grow md:overflow-y-auto p-2 bg-white my-6 mx-4 shadow-sm rounded-lg">{children}</main>
    </div>
  );
}