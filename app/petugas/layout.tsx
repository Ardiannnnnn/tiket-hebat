import SideNav from '@/app/ui/petugas/sidenav';
import { poppins } from '../ui/fonts';


// export const experimental_prr = true;
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} flex h-screen flex-col md:flex-row md:overflow-hidden`}>
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <main className="flex-grow md:overflow-y-auto pl-2">{children}</main>
    </div>
  );
}