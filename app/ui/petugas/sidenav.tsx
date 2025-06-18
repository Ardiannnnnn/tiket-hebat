"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/petugas/navlink";
import { LuPower } from "react-icons/lu";
import { RiDashboardFill, RiHistoryFill } from "react-icons/ri";
import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import img from "@/public/image/ardian.png";
import { RiShipFill } from "react-icons/ri";
import { getCurrentUser, logoutUser } from "@/service/auth";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { User } from "@/types/user";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const Router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = getCurrentUser();
        setUser((await data).data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()  
  }, [])

  if (loading) return <div className="p-4">Loading...</div>

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    console.log("handleLogout dipanggil");
    try {
      await logoutUser();
      destroyCookie(null, "role");
      destroyCookie(null, "refresh_token");
      console.log("logoutUser selesai");
      Router.push("/login");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  return (
    <>
      {/* Sidebar untuk Desktop */}
      <div
        className={`hidden md:flex h-full w-[260px] flex-col bg-black px-6 py-4 text-white`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4">
          <RiShipFill />
          <span className="text-lg font-bold">ASDP SINGKIL</span>
        </div>

        {/* Profil */}
        <div className="mt-6 flex items-center gap-4">
          <Image
            src={img} // Ganti dengan path gambar profil
            width={50}
            height={50}
            alt="User Profile"
            className="h-12 w-12 rounded-full bg-white"
          />
          <div className="text-start">
            <p className="text-sm text-gray-400">{user?.role.role_name}</p>
            <p className="text-lg font-semibold">{user?.full_name}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-8">
          <p className="text-md font-semibold">Menu</p>
        </div>

        {/* Navigasi */}
        <div className="mt-4 space-y-2">
          <NavLinks />
        </div>

        {/* Spacer untuk mengisi sisa space */}
        <div className="flex-grow"></div>

        {/* Tombol Logout */}
        <form onSubmit={handleLogout} className="mt-6">
          <button className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-white hover:bg-gray-700">
            <LuPower className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      {/* Bottom Navbar untuk Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md md:hidden">
        <div className="flex justify-around py-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-700"
          >
            <RiDashboardFill className="text-2xl" />
          </Link>
          <Link
            href="/dashboard/history"
            className="flex flex-col items-center text-gray-700"
          >
            <RiHistoryFill className="text-2xl" />
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
