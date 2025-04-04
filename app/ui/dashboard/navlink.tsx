"use client";

import { RiDashboardHorizontalFill, RiTicketFill } from "react-icons/ri";
import {
  RiUserFill,
  RiShipFill,
  RiAnchorFill,
  RiRoadMapFill,
  RiCalendarFill,
  RiFileListFill,
} from "react-icons/ri";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// 🔹 Link untuk bagian Dashboard
export const dashboardLinks = [
  { name: "Beranda", href: "/beranda", icon: RiDashboardHorizontalFill },
  { name: "Tiket", href: "/beranda/tiket", icon: RiTicketFill },
];

// 🔹 Link untuk bagian Menu
export const menuLinks = [
  { name: "Pengguna", href: "/beranda/pengguna", icon: RiUserFill },
  { name: "Kapal", href: "/beranda/kapal", icon: RiShipFill },
  { name: "Pelabuhan", href: "/beranda/pelabuhan", icon: RiAnchorFill },
  { name: "Rute Perjalanan", href: "/beranda/rute", icon: RiRoadMapFill },
  { name: "Upload Jadwal", href: "/beranda/upload-jadwal", icon: RiCalendarFill },
  { name: "Tiket Kapal", href: "/beranda/tiket-kapal", icon: RiFileListFill },
];

export default function NavLinks({ links }: { links: typeof dashboardLinks }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-gray-200",
              {
                "bg-gray-200 text-black": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-5 text-gray-600" />
            <p className="">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
