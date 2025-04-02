import Image from "next/image";
import { Home, FileText, MoreVertical } from "lucide-react";
import { poppins } from "../fonts";
import img from "@/public/image/ardian.png";
import { RiShipFill } from "react-icons/ri";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Beranda",
    url: "/petugas",
    icon: Home,
  },
  {
    title: "Riwayat",
    url: "/petugas/riwayat",
    icon: FileText,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar className={`${poppins.className} bg-black text-white p-4`}>
      {/* Logo */}
      <div className="flex items-center gap-4 mb-6">
        <RiShipFill />
        <span className="text-lg font-bold">ASDP SINGKIL</span>
      </div>

      {/* Profil User */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src={img} // Ganti dengan path gambar profil yang benar
          alt="Profile"
          className="rounded-full bg-white w-12 h-12"
        />
        <div className="flex-1">
          <p className="text-sm">Petugas Loket</p>
          <p className="font-semibold">Ardian</p>
        </div>
        <Link href="/petugas">
          <MoreVertical size={20} />
        </Link>
      </div>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 uppercase font-bold">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-2">
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
