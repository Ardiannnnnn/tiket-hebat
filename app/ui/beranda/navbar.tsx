"use client";
import { useState, useRef, useEffect} from "react";

import { mouseMemoirs } from "@/app/ui/fonts";
import { montserrat } from "@/app/ui/fonts";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  {
    name: "Beranda",
    href: "/",
  },
  {
    name: "Jadwal Kapal",
    href: "/jadwal",
  },

  {
    name: "Tiket",
    href: "/tiket",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null); 
  const toggleNavbar = () => {
    setIsOpen(!isOpen)
  }
  
  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)){
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside );
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  },[])
  const pathname = usePathname();

  return (
    <nav ref={navbarRef} className="bg-white border-Orange border-b-2 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-1 rtl:space-x-reverse"
        >
          <span
            className={`${mouseMemoirs.className} self-center text-4xl whitespace-nowrap text-Orange`}
          >
            Tiket
          </span>
          <span
            className={`${mouseMemoirs.className} self-center text-4xl whitespace-nowrap text-Blue`}
          >
            Hebat
          </span>
        </a>
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
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto ${montserrat.className}`}
          id="navbar-default"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-whit font-semibold">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block py-2 px-3 rounded-sm md:p-0 transition-colors",
                    pathname.includes(link.href)
                      ? "bg-Orange text-white md:bg-transparent md:text-Orange  "
                      : "text-gray-900  md:hover:bg-transparent hover:text-Orange "
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
