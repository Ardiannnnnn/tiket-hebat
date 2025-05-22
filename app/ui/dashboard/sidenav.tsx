"use client";

import Link from "next/link";
import { LuPower } from "react-icons/lu";
import { RiDashboardFill, RiShipFill } from "react-icons/ri";
import { FaUser, FaShip, FaRoute, FaCalendarAlt } from "react-icons/fa";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import { FormEvent, useState } from "react";
import Image from "next/image";
import NavLinks from "./navlink";
import logo from "@/public/image/asdp_2.png";
import adminImg from "@/public/image/ardian.png";
import {dashboardLinks} from "./navlink";
import {menuLinks} from "./navlink";
import { logoutUser } from "@/service/auth";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

   const handleLogout = async (e: FormEvent) => {
    e.preventDefault(); // cegah reload
    try {
      await logoutUser();
      router.push("/login"); // redirect setelah logout
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex h-full w-[270px] flex-col px-4 py-6 text-black">
        {/* Logo + Nama Perusahaan */}
        <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <Image className="rounded-xl" src={logo} width={50} height={50} alt="ASDP Logo" />
          <div className="leading-tight">
            <p className="text-xs text-gray-600">PT ASDP Ferry Indonesia</p>
            <p className="text-sm font-semibold">Cabang Singkil</p>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="mt-4 bg-gray-100 p-3 rounded-lg shadow-sm">
          <div className="mt-4 p-3">
            <p className="text-sm font-semibold text-gray-700">Dashboard</p>
            <div className="mt-2 space-y-2">
              <NavLinks links={dashboardLinks} />
            </div>
          </div>

          {/* Menu Section */}
          <div className="p-3">
            <p className="text-sm font-semibold text-gray-700">Menu</p>
            <div className="mt-2 space-y-2">
              <NavLinks links={menuLinks} />
            </div>
          </div>
        </div>

        {/* Spacer untuk mengisi sisa space */}
        <div className="flex-grow"></div>

        {/* Profil Admin */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src={adminImg}
              width={45}
              height={45}
              alt="Admin Profile"
              className="h-12 w-12 rounded-full bg-gray-200"
            />
            <div className="leading-tight">
              <p className="text-xs text-gray-500">Administrator</p>
              <p className="text-sm font-semibold">Heriansyah</p>
            </div>
          </div>

          {/* Logout Button */}
          <form onSubmit={handleLogout} className="mt-4">
            <button className="flex w-full items-center gap-3 text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-100">
              <LuPower className="h-5 w-5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Navbar Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 shadow-md md:hidden">
        <div className="flex justify-around py-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-700"
          >
            <RiDashboardFill className="text-2xl" />
          </Link>
          <Link
            href="/dashboard/tiket"
            className="flex flex-col items-center text-gray-700"
          >
            <IoTicketOutline className="text-2xl" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-center text-gray-700"
          >
            <LuPower className="text-2xl" />
          </button>
        </div>
      </div>
    </>
  );
}
