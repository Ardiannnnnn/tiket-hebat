"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiShipFill } from "react-icons/ri";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getSchedules } from "@/service/schedule";
import TicketTable from "./ticketTable";

export default function VerifikasiPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleData, setSelectedScheduleData] = useState<any>(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  // Fetch schedules saat halaman diload
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoadingSchedules(true);
      try {
        const response = await getSchedules();
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast.error("Gagal memuat data jadwal.");
      } finally {
        setLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleScheduleChange = (scheduleId: number | null) => {
    if (!scheduleId) {
      toast.error("Jadwal tidak valid. Harap pilih jadwal terlebih dahulu.");
      return;
    }

    setSelectedSchedule(scheduleId);
    const schedule = schedules.find((s) => s.id === scheduleId);
    setSelectedScheduleData(schedule);
  };

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

      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Verifikasi</h2>
          <p>
            {selectedScheduleData
              ? `${selectedScheduleData.route.departure_harbor.harbor_name} - ${selectedScheduleData.route.arrival_harbor.harbor_name}`
              : "Pilih Jadwal"}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <RiShipFill />
            <h2 className="text-lg font-semibold">
              {selectedScheduleData
                ? `Pelabuhan ${selectedScheduleData.route.departure_harbor.harbor_name}`
                : "Pilih Jadwal"}
            </h2>
          </div>
          <p className="text-end">
            {selectedScheduleData
              ? formatDate(selectedScheduleData.departure_datetime)
              : "Pilih Jadwal"}
          </p>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select
            onValueChange={(value) =>
              handleScheduleChange(value ? Number(value) : null)
            }
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Pilih Jadwal Terlebih Dahulu" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((sch) => (
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
      {selectedSchedule !== null && typeof selectedSchedule === "number" ? (
        <TicketTable
          scheduleId={selectedSchedule}
          selectedType={selectedType}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="mt-4 text-center text-gray-500">
          Pilih jadwal untuk melihat data tiket
        </div>
      )}
    </div>
  );
}