"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTickets } from "@/service/ticket";
import { Ticket } from "@/types/ticket";

interface TicketTableProps {
  scheduleId: number;
  selectedType: string | null;
  searchTerm: string;
}

export default function TicketTable({
  scheduleId,
  selectedType,
  searchTerm,
}: TicketTableProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scheduleId) return; // hindari fetch jika scheduleId tidak valid

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await getTickets(scheduleId);
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast.error("Gagal memuat data tiket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [scheduleId]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchType =
      !selectedType || selectedType === "all"
        ? true
        : ticket.type === selectedType;

    const matchSearch =
      searchTerm.trim() === "" ||
      (ticket.passenger_name &&
        ticket.passenger_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (ticket.address &&
        ticket.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.class?.class_name &&
        ticket.class.class_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    return matchType && matchSearch;
  });

  if (loading) return <p>Memuat data tiket...</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="border-collapse border border-gray-200 w-full">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold">
            <th className="border px-4 py-2">Aksi</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Alamat</th>
            <th className="border px-4 py-2">Umur</th>
            <th className="border px-4 py-2">Jenis ID</th>
            <th className="border px-4 py-2">NO ID</th>
            <th className="border px-4 py-2">Kelas</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((order) => (
            <tr key={order.id} className="text-sm">
              <td className="border px-4 py-2">
                <Button
                  className="bg-yellow-300 text-black hover:bg-yellow-400"
                  onClick={() =>
                    toast.success(`Order ${order.id} berhasil diverifikasi!`)
                  }
                >
                  Verifikasi
                </Button>
              </td>
              <td className="border px-4 py-2">{order.passenger_name}</td>
              <td className="border px-4 py-2">{order.address}</td>
              <td className="border px-4 py-2">{order.passenger_age}</td>
              <td className="border px-4 py-2">{order.id_type}</td>
              <td className="border px-4 py-2">{order.id_number}</td>
              <td className="border px-4 py-2">{order.class?.class_name}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.seat_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
