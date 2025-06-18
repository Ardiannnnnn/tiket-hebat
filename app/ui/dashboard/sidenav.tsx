"use client";

import Link from "next/link";
import { LuPower, LuMenu } from "react-icons/lu";
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import NavLinks, { dashboardLinks, jadwalLinks, menuLinks } from "./navlink";
import logo from "@/public/image/asdp_2.png";
import adminImg from "@/public/image/ardian.png";
import { getCurrentUser, logoutUser } from "@/service/auth";
import { usePathname, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { User } from "@/types/user";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Toggle sidebar for mobile view
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pathname = usePathname();

  console.log(pathname?.includes("/"));

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    console.log("handleLogout dipanggil");
    try {
      await logoutUser();
      destroyCookie(null, "role");
      destroyCookie(null, "refresh_token");
      console.log("logoutUser selesai");
      router.push("/login");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  return (
    <>
      {/* DESKTOP: Sidebar */}
      <div className="hidden md:flex h-full w-[270px] flex-col px-4 py-6 text-black">
        {/* Logo */}
        <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <Image
            className="rounded-xl"
            src={logo}
            width={50}
            height={50}
            alt="ASDP Logo"
          />
          <div className="leading-tight">
            <p className="text-xs text-gray-600">PT ASDP Ferry Indonesia</p>
            <p className="text-sm font-semibold">Cabang Singkil</p>
          </div>
        </div>

        {/* Dashboard & Menu */}
        <div className="mt-4 bg-gray-100 p-3 rounded-lg shadow-sm">
          <div className="mt-4 p-3">
            <p className="text-sm font-semibold text-gray-700">Dashboard</p>
            <div className="mt-2 space-y-1">
              <NavLinks links={dashboardLinks} />
            </div>
          </div>

          <div className="p-3">
            <p className="text-sm font-semibold text-gray-700">Menu</p>
            <div className="mt-2 space-y-1">
              <NavLinks links={menuLinks} />
            </div>
          </div>

          <div className="p-3">
            <p className="text-sm font-semibold text-gray-700">Jadwal</p>
            <div className="mt-2">
              <NavLinks links={jadwalLinks} />
            </div>
          </div>

          
        </div>

        <div className="flex-grow"></div>

        {/* Profil Admin + Logout */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src={adminImg}
              width={45}
              height={45}
              alt="Admin Profile"
              className="rounded-full"
            />
            <div className="leading-tight">
              <p className="text-xs text-gray-500">{user?.role.role_name}</p>
              <p className="text-sm font-semibold">{user?.username}</p>
            </div>
          </div>
          <button
            type="button" // penting!
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-100"
          >
            <LuPower className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* MOBILE: Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 w-full top-0 z-40">
        <button
          onClick={toggleNavbar}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <p className="text-sm font-semibold">ASDP Cabang Singkil</p>
      </div>
      <div
        ref={navbarRef}
        className={`${
          isOpen ? "block" : "hidden"
        } fixed left-0 top-0 z-50 h-full w-[250px] bg-white shadow-md p-4 space-y-3`}
      >
        <div className="flex items-center gap-4 mb-6">
          <Image src={logo} width={40} height={40} alt="ASDP Logo" />
          <p className="text-sm font-semibold">Cabang Singkil</p>
        </div>
        <NavLinks links={dashboardLinks} />
        <hr className="my-4" />
        <NavLinks links={menuLinks} />

        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src={adminImg}
              width={45}
              height={45}
              alt="Admin Profile"
              className="rounded-full"
            />
            <div className="leading-tight">
              <p className="text-xs text-gray-500">{user?.role.role_name}</p>
              <p className="text-sm font-semibold">{user?.username}</p>
            </div>
          </div>

          <button
            type="button" // penting!
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-100"
          >
            <LuPower className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}
