'use client'

import { RiDashboardHorizontalFill } from "react-icons/ri";
import { RiHistoryFill } from "react-icons/ri";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Beranda', href: '/petugas', icon: RiDashboardHorizontalFill }, 
    { name: 'Riwayat', href: '/petugas/riwayat', icon: RiHistoryFill }, 
  ];
  

export default function NavLinks({ disabled }: { disabled: boolean }) {
  const pathname = usePathname()
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx( "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-white text-black' : pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
