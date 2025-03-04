"use client";
import { useState, useRef, useEffect} from "react";
import { mouseMemoirs } from "@/app/ui/fonts";
import { montserrat } from "@/app/ui/fonts";


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
  return (
    <nav ref={navbarRef} className="bg-white border-Orange border-b-2 fixed w-full z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
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
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-Orange rounded-sm md:bg-transparent md:text-Orange md:p-0 "
                aria-current="page"
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-Orange md:hover:bg-transparent md:border-0 md:hover:text-Orange md:p-0 md:dark:hover:text-Orange dark:hover:bg-Orange dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Jadwal Kapal
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-Orange md:hover:bg-transparent md:border-0 md:hover:text-Orange md:p-0 md:dark:hover:text-Orange dark:hover:bg-Orange dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Tiket
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
