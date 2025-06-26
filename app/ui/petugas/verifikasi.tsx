// app/ui/petugas/verifikasi.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiShipFill } from "react-icons/ri";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import TicketTable from "./ticketTable";
import { useAllSchedules } from "@/app/hooks/useSchedules";
import { useTickets } from "@/app/hooks/useTickets";
import { Schedule } from "@/types/schedule";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Users,
  Car,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface VerifikasiProps {
  selectedSchedule: number | null;
}

export default function VerifikasiPage({ selectedSchedule }: VerifikasiProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheduleData, setSelectedScheduleData] = useState<any>(null);

  const {
    data: schedules = [],
    isLoading: loadingSchedules,
    error: scheduleError,
  } = useAllSchedules();

  const {
    data: tickets = [],
    isLoading: loadingTickets,
    error: ticketError,
    refetch: refetchTickets, // ✅ Add refetch function
  } = useTickets(selectedSchedule);

  // ✅ Update selectedScheduleData when selectedSchedule changes
  useEffect(() => {
    if (selectedSchedule && schedules.length > 0) {
      const schedule = schedules.find(
        (s: Schedule) => s.id === selectedSchedule
      );
      setSelectedScheduleData(schedule || null);
    }
  }, [selectedSchedule, schedules]);

  // ✅ Auto-refetch when schedule changes
  useEffect(() => {
    if (selectedSchedule) {
      refetchTickets();
    }
  }, [selectedSchedule, refetchTickets]);

  // ✅ Debug tickets data
  console.log(
    "📊 All tickets in Verifikasi:",
    tickets.map((t) => ({
      id: t.id,
      is_checked_in: t.is_checked_in,
      status: t.status,
      passenger_name: t.passenger_name,
    }))
  );

  // ✅ Filter hanya tiket yang sudah check-in dengan debug
  const filteredTickets = tickets.filter((ticket) => {
    // ✅ Debug setiap ticket
    console.log(`🔍 Verifikasi - Ticket ${ticket.id}:`, {
      is_checked_in: ticket.is_checked_in,
      status: ticket.status,
      shouldShow: ticket.is_checked_in === true,
    });

    // ✅ HANYA tampilkan tiket yang sudah check-in
    if (!ticket.is_checked_in) {
      return false;
    }

    if (
      selectedType &&
      selectedType !== "all" &&
      ticket.type !== selectedType
    ) {
      return false;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        ticket.passenger_name?.toLowerCase().includes(search) ||
        ticket.license_plate?.toLowerCase().includes(search) ||
        ticket.id_number?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  console.log(
    "📋 Filtered tickets for Verifikasi (checked in):",
    filteredTickets.length
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Toaster />

      {/* ✅ Enhanced Header - Same as Pesanan Page */}
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
        {selectedScheduleData ? (
          <div className="space-y-2">
            {/* Route Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 text-white rounded-lg">
                  <RiShipFill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedScheduleData.ship.ship_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedScheduleData.departure_harbor.harbor_name} →{" "}
                    {selectedScheduleData.arrival_harbor.harbor_name}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(selectedScheduleData.departure_datetime)}
              </Badge>
            </div>

            {/* Date & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedScheduleData.departure_datetime)}
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-800"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {
                    filteredTickets.filter((t) => t.type === "passenger").length
                  }{" "}
                  Penumpang
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-50 text-purple-800"
                >
                  <Car className="w-3 h-3 mr-1" />
                  {
                    filteredTickets.filter((t) => t.type === "vehicle").length
                  }{" "}
                  Kendaraan
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Verifikasi Tiket</h3>
            <p className="text-sm text-gray-500">
              Pilih jadwal di tab Pemesanan untuk melihat tiket check-in
            </p>
          </div>
        )}
      </div>

      {/* ✅ Enhanced Filters - Same as Pesanan Page but without Schedule Selection */}
      <div className="p-4 border-b bg-white">
        <div className="space-y-4">
          {/* Filters & Search - Only when schedule is selected */}
          {selectedSchedule && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select
                  value={selectedType || "all"}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="passenger">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Penumpang
                      </div>
                    </SelectItem>
                    <SelectItem value="vehicle">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Kendaraan
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 min-w-[250px]">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Cari nama, nomor kendaraan, atau identitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Content Area - Updated stats */}
      <div className="flex-1 overflow-hidden">
        {selectedSchedule !== null && typeof selectedSchedule === "number" ? (
          <div className="h-full flex flex-col">
            {/* Loading State */}
            {loadingTickets && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data tiket check-in...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {ticketError && (
              <div className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md">
                  <CardContent className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-600 text-xl">⚠️</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Error Loading Tickets
                    </h3>
                    <p className="text-gray-600 mb-4">{ticketError.message}</p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Success State */}
            {!loadingTickets && !ticketError && (
              <div className="flex-1 overflow-hidden">
                {/* ✅ Stats Bar - Update untuk show check-in status */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-800"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Check-in:{" "}
                        {tickets.filter((t) => t.is_checked_in).length}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* ✅ Empty State - No checked-in tickets */}
                {filteredTickets.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <Card className="max-w-md">
                      <CardContent className="text-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Belum ada tiket yang check-in
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tiket akan muncul di sini setelah penumpang melakukan
                          check-in di halaman pemesanan.
                        </p>
                        {tickets.length > 0 && (
                          <div className="text-sm text-gray-500">
                            Total tiket: {tickets.length} • Belum check-in:{" "}
                            {tickets.filter((t) => !t.is_checked_in).length}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ✅ Ticket Table - Only show tickets, no check-in actions */}
                {filteredTickets.length > 0 && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="border rounded-lg overflow-hidden">
                      <TicketTable
                        tickets={filteredTickets}
                        showCheckInActions={false} // ✅ No check-in actions for verified page
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="max-w-md">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verifikasi Tiket
                </h3>
                <p className="text-gray-600 mb-4">
                  Pilih jadwal di tab <strong>Pemesanan</strong> untuk melihat
                  tiket yang sudah check-in dan siap diverifikasi.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    💡 Jadwal dikontrol dari tab Pemesanan untuk sinkronisasi
                    data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
