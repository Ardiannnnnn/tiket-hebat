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
import { IoIosPricetag } from "react-icons/io";
import { MdFlightClass } from "react-icons/md";
import { MdOutlineReduceCapacity } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// 🔹 Link untuk bagian Dashboard
export const dashboardLinks = [
  { name: "Beranda", href: "/beranda", icon: RiDashboardHorizontalFill },
  { name: "Tiket", href: "/tiket-dashboard", icon: RiTicketFill },
   { name: "Pengguna", href: "/pengguna", icon: RiUserFill },
];

// 🔹 Link untuk bagian Menu
export const menuLinks = [
  { name: "Kapal", href: "/kapal", icon: RiShipFill },
  { name: "Pelabuhan", href: "/pelabuhan", icon: RiAnchorFill },
  { name: "Rute Perjalanan", href: "/dataRute", icon: RiRoadMapFill },
  // { name: "Tiket Kapal", href: "/dataTiket", icon: RiFileListFill },
  { name: "Kelas Tiket", href: "/kelasTiket", icon: MdFlightClass },
  { name: "Harga Tiket", href: "/hargaTiket", icon: IoIosPricetag  },
  { name: "KapasitasTiket", href: "/kapasitasTiket", icon: MdOutlineReduceCapacity },
  
];

export const jadwalLinks = [
   { name: "Upload Jadwal", href: "/uploadJadwal", icon: RiCalendarFill },
];

export default function NavLinks({ links, disabled }: { links: typeof dashboardLinks, disabled?: boolean }) {
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
              pathname?.startsWith(link.href) ||
                (pathname?.includes("/dashboard") && link.href === "/dashboard")
                ? "bg-gray-200 text-black"
                : "text-gray-600"
            )}
          >
            <LinkIcon className="w-5" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
