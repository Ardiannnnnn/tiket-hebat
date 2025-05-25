"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { poppins } from "../fonts";
import Data from "./data";
import Info from "./info";

interface BookingProps {
  scheduleid: string;
}

export default function Verifikasi({ scheduleid }: BookingProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") ?? "";

  return (
    <div className={`${poppins.className}`}>
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-1 w-10 text-white font-bold flex justify-center text-2xl">
          3
        </div>
        <p className="text-2xl font-semibold">Verifikasi Data </p>
      </div>
      <div className=" flex flex-col-reverse md:flex-row gap-8 justify-center mt-8 m-4">
        <Data sessionId={sessionId} />
        <Info />
      </div>
    </div>
  );
}