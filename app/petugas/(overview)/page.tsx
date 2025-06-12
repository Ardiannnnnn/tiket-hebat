"use client";
import OrderTable from "@/app/ui/petugas/pesanan";
// import Keterangan from "@/app/ui/petugas/keterangan";
import Verifikasi from "@/app/ui/petugas/verifikasi";
import { getTickets } from "@/service/ticket";
import { use, useEffect, useState } from "react";
import type { Ticket } from "@/types/ticket";

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    const tiketData = async () => {
      try {
        const response = await getTickets();
        setTickets(response?.data || []);
        console.log("Tiket data:", response);
      } catch (error) {
        console.error("Error fetching tiket data:", error);
      }
    };
    tiketData();
  }, []);

  return (
    <div className="flex min-h-screen"> {/* Tambah min-h-screen */}
      <div className="flex w-full relative"> {/* Tambah relative */}
        <div className="w-1/2">
          <OrderTable tickets={tickets} />
        </div>
        {/* Update div pembatas */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -ml-[1px] bg-gray-300"></div>
        <div className="w-1/2">
          <Verifikasi tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
