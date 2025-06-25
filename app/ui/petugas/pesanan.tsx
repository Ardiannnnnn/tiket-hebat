// app/ui/petugas/pesanan.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiShipFill } from "react-icons/ri";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import TambahModal from "./tambahModal";
import TicketTable from "./ticketTable";
import { useAllSchedules } from "@/app/hooks/useSchedules";
import { useTickets } from "@/app/hooks/useTickets";
import { Schedule } from "@/types/invoice";
import {
  Calendar,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Car,
  CheckCircle,
} from "lucide-react";

interface OrderTableProps {
  selectedSchedule: number | null;
  setSelectedSchedule: (scheduleId: number | null) => void;
}

export default function OrderTable({
  selectedSchedule,
  setSelectedSchedule,
}: OrderTableProps) {
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

  // ✅ Auto-refetch when returning to tab
  useEffect(() => {
    if (selectedSchedule) {
      refetchTickets();
    }
  }, [selectedSchedule, refetchTickets]);

  const handleScheduleChange = (scheduleId: number | null) => {
    if (!scheduleId) {
      toast.error("Jadwal tidak valid. Harap pilih jadwal terlebih dahulu.");
      return;
    }

    // ✅ Update parent state juga
    setSelectedSchedule(scheduleId);
    const schedule = schedules.find((s: Schedule) => s.id === scheduleId);
    setSelectedScheduleData(schedule);
  };

  const filteredTickets = tickets.filter((ticket) => {
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

  // ✅ Debug tickets data
  console.log(
    "📊 All tickets from API:",
    tickets.map((t) => ({
      id: t.id,
      is_checked_in: t.is_checked_in,
      status: t.status,
      passenger_name: t.passenger_name,
    }))
  );

  // ✅ Filter tickets yang belum check-in untuk halaman pesanan
  const filteredTicketsForOrder = filteredTickets.filter((ticket) => {
    const shouldShow = !ticket.is_checked_in;
    console.log(
      `🔍 Ticket ${ticket.id}: is_checked_in=${ticket.is_checked_in}, shouldShow=${shouldShow}`
    );
    return shouldShow;
  });

  console.log(
    "📋 Filtered tickets for Pesanan (not checked in):",
    filteredTicketsForOrder.length
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

      {/* ✅ Enhanced Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        {selectedScheduleData ? (
          <div className="space-y-3">
            {/* Route Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <RiShipFill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedScheduleData.ship.ship_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedScheduleData.route.departure_harbor.harbor_name} →{" "}
                    {selectedScheduleData.route.arrival_harbor.harbor_name}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {tickets.filter((t) => t.type === "passenger").length}{" "}
                  Penumpang
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Car className="w-3 h-3 mr-1" />
                  {tickets.filter((t) => t.type === "vehicle").length} Kendaraan
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RiShipFill className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Pilih Jadwal</h3>
            <p className="text-sm text-gray-500">
              Pilih jadwal untuk mulai mengelola tiket
            </p>
          </div>
        )}
      </div>

      {/* ✅ Enhanced Filters */}
      <div className="p-4 border-b bg-white">
        <div className="space-y-4">
          {/* Schedule Selection */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            {/* Schedule Selection with controlled value */}
            <Select
              value={selectedSchedule ? String(selectedSchedule) : ""}
              onValueChange={(value) =>
                handleScheduleChange(value ? Number(value) : null)
              }
            >
              <SelectTrigger className="min-w-[200px] max-w-full">
                {selectedSchedule && selectedScheduleData ? (
                  <span className="font-medium text-left">
                    {selectedScheduleData.ship.ship_name}
                  </span>
                ) : (
                  <SelectValue placeholder="Pilih Jadwal Keberangkatan" />
                )}
              </SelectTrigger>
              <SelectContent>
                {loadingSchedules ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading schedules...
                    </div>
                  </SelectItem>
                ) : scheduleError ? (
                  <SelectItem value="error" disabled>
                    Error loading schedules
                  </SelectItem>
                ) : (
                  schedules.map((sch: Schedule) => (
                    <SelectItem key={sch.id} value={String(sch.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {sch.ship.ship_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(sch.departure_datetime)} •{" "}
                          {formatTime(sch.departure_datetime)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Filters & Search */}
          {selectedSchedule && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2 flex-1">
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

                <TambahModal
                  scheduleId={selectedSchedule}
                  scheduleData={selectedScheduleData}
                />
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

      {/* ✅ Content Area */}
      <div className="flex-1 overflow-hidden">
        {selectedSchedule !== null && typeof selectedSchedule === "number" ? (
          <div className="h-full flex flex-col">
            {/* Loading State */}
            {loadingTickets && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data tiket...</p>
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
                {/* ✅ Empty State - No tickets to check-in */}
                {filteredTicketsForOrder.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <Card className="max-w-md">
                      <CardContent className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Semua tiket sudah check-in
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tidak ada tiket yang perlu di check-in untuk jadwal
                          ini.
                        </p>
                        {tickets.length > 0 && (
                          <div className="text-sm text-gray-500">
                            Total tiket: {tickets.length} • Check-in:{" "}
                            {tickets.filter((t) => t.is_checked_in).length}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ✅ Ticket Table with Check-in Actions */}
                {filteredTicketsForOrder.length > 0 && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <TicketTable
                      tickets={filteredTicketsForOrder}
                      showCheckInActions={true} // ✅ Enable check-in actions
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="max-w-md">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pilih Jadwal Keberangkatan
                </h3>
                <p className="text-gray-600 mb-6">
                  Mulai dengan memilih jadwal untuk melihat dan mengelola tiket
                  penumpang.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>Tersedia {schedules.length} jadwal</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
