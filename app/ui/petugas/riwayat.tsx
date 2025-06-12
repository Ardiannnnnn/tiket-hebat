"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiShipFill } from "react-icons/ri";
import { Toaster } from "@/components/ui/sonner";
import { getTickets } from "@/service/ticket";
import type { Ticket } from "@/types/ticket";

export default function RiwayatTable() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ordersTiket, setOrdersTiket] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const uniqueSchedules = Array.from(
    new Map(tickets.map((t) => [t.schedule.id, t.schedule])).values()
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheduleData, setSelectedScheduleData] = useState<any>(null);

  // Fetch tickets data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTickets();
        setTickets(response?.data || []);
        console.log("Tiket data:", response);
      } catch (error) {
        console.error("Error fetching tiket data:", error);
        // toast.error("Gagal memuat data tiket");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Handler untuk select jadwal
  const handleScheduleChange = (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    const schedule = uniqueSchedules.find((s) => String(s.id) === scheduleId);
    setSelectedScheduleData(schedule);

    // Filter tickets berdasarkan jadwal yang dipilih
    const filteredTickets = tickets.filter(
      (ticket) => String(ticket.schedule.id) === scheduleId
    );
    setOrdersTiket(filteredTickets);
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4">
      <Toaster />

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          Loading...
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">Riwayat</h2>
              <p>
                {selectedScheduleData ? (
                  `${selectedScheduleData.route.departure_harbor.harbor_name} - ${selectedScheduleData.route.arrival_harbor.harbor_name}`
                ) : (
                  "Pilih Jadwal"
                )}
              </p>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <RiShipFill />
                <h2 className="text-lg font-semibold">
                  {selectedScheduleData ? (
                    `Pelabuhan ${selectedScheduleData.route.departure_harbor.harbor_name}`
                  ) : (
                    "Pilih Jadwal"
                  )}
                </h2>
              </div>
              <p className="text-end">
                {selectedScheduleData ? (
                  formatDate(selectedScheduleData.departure_datetime)
                ) : (
                  "Pilih Jadwal"
                )}
              </p>
            </div>
          </div>

          {/* Filter dan Search */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Select onValueChange={handleScheduleChange}>
                <SelectTrigger className="min-w-[200px]">
                  <SelectValue placeholder="Pilih Jadwal Terlebih Dahulu" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSchedules.map((sch) => (
                    <SelectItem key={sch.id} value={String(sch.id)}>
                      {sch.ship.ship_name} - {formatDate(sch.departure_datetime)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSchedule && (
                <Select onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tiket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="passenger">Penumpang</SelectItem>
                    <SelectItem value="vehicle">Kendaraan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedSchedule && (
              <div className="flex gap-2">
                <Input
                  placeholder="Cari"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Tabel */}
          {selectedSchedule ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-semibold">
                    <th className="border border-gray-200 px-4 py-2">Order ID</th>
                    <th className="border border-gray-200 px-4 py-2">Status</th>
                    <th className="border border-gray-200 px-4 py-2">Nama</th>
                    <th className="border border-gray-200 px-4 py-2">Alamat</th>
                    <th className="border border-gray-200 px-4 py-2">Umur</th>
                    <th className="border border-gray-200 px-4 py-2">Jenis ID</th>
                    <th className="border border-gray-200 px-4 py-2">NO ID</th>
                    <th className="border border-gray-200 px-4 py-2">Kelas</th>
                    <th className="border border-gray-200 px-4 py-2">Kapal</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersTiket
                    .filter((order) => {
                      const matchSchedule = selectedSchedule
                        ? String(order.schedule.id) === selectedSchedule
                        : true;
                      const matchType =
                        !selectedType || selectedType === "all"
                          ? true
                          : order.type === selectedType;
                      const matchSearch =
                        searchTerm.trim() === "" ||
                        (order.passenger_name &&
                          order.passenger_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                        (order.address &&
                          order.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (order.class?.class_name &&
                          order.class.class_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()));
                      return matchSchedule && matchType && matchSearch;
                    })
                    .map((order) => (
                      <tr key={order.id} className="text-sm">
                        <td className="border border-gray-200 px-4 py-2">{order.id}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-lg ${
                              order.status === "verified"
                                ? "bg-green-500 text-white"
                                : order.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-400 text-black"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.passenger_name}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.address}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.passenger_age}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.id_type}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.id_number}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.class.class_name}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {order.schedule.ship.ship_name}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 text-center text-gray-500">
              Pilih jadwal untuk melihat data tiket
            </div>
          )}
        </>
      )}
    </div>
  );
}
