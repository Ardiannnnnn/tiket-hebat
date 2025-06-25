// app/ui/petugas/riwayat.tsx
"use client";

import { useState, useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { RiShipFill } from "react-icons/ri";
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
  History,
  FileText,
  Download
} from "lucide-react";

export default function RiwayatPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
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
  } = useTickets(selectedSchedule);

  const handleScheduleChange = (scheduleId: string) => {
    const id = scheduleId === "all" ? null : Number(scheduleId);
    setSelectedSchedule(id);
    
    if (id) {
      const schedule = schedules.find((s: Schedule) => s.id === id);
      setSelectedScheduleData(schedule);
    } else {
      setSelectedScheduleData(null);
    }
  };

  // ✅ Filter hanya tiket yang sudah check-in (bukan verified)
  const checkedInTickets = tickets.filter((ticket) => ticket.is_checked_in === true);

  console.log('🎫 Riwayat Debug:', {
    totalTickets: tickets.length,
    checkedInTickets: checkedInTickets.length,
    ticketsData: tickets.map(t => ({
      id: t.id,
      is_checked_in: t.is_checked_in,
      status: t.status,
      name: t.passenger_name || t.license_plate
    }))
  });

  // ✅ Filter berdasarkan criteria
  const filteredTickets = checkedInTickets.filter((ticket) => {
    // Filter by type
    if (selectedType && selectedType !== "all" && ticket.type !== selectedType) {
      return false;
    }

    // Filter by search term
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

  // ✅ Statistics untuk dashboard mini - berdasarkan check-in
  const stats = useMemo(() => {
    const totalCheckedIn = checkedInTickets.length;
    const passengerCheckedIn = checkedInTickets.filter(t => t.type === 'passenger').length;
    const vehicleCheckedIn = checkedInTickets.filter(t => t.type === 'vehicle').length;
    
    return {
      total: totalCheckedIn,
      passenger: passengerCheckedIn,
      vehicle: vehicleCheckedIn
    };
  }, [checkedInTickets]);

  // ✅ Group schedules by date untuk better UX
  const groupedSchedules = useMemo(() => {
    const grouped: { [key: string]: Schedule[] } = {};
    
    schedules.forEach((schedule: Schedule) => {
      const date = new Date(schedule.departure_datetime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    
    return grouped;
  }, [schedules]);

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* ✅ Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Riwayat Check-in
                </h1>
                <p className="text-gray-600 text-sm">
                  {selectedSchedule 
                    ? `Riwayat tiket untuk jadwal yang dipilih (${stats.total} check-in)`
                    : "Lihat riwayat tiket yang telah di check-in"
                  }
                </p>
              </div>
            </div>

            {/* ✅ Quick Stats - Updated untuk check-in */}
            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg min-w-fit">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Check-in: {stats.total}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg min-w-fit">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Penumpang: {stats.passenger}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg min-w-fit">
                <Car className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Kendaraan: {stats.vehicle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full">
          <Card className="h-full flex flex-col shadow-lg border-0 py-0 gap-0">
            {/* ✅ Enhanced Header */}
            <CardHeader className="py-8 gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  Riwayat Tiket Check-in
                </CardTitle>
                
                {/* Export Button */}
                <Button variant="outline" className="w-fit">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* ✅ Schedule Info (jika dipilih) */}
              {selectedScheduleData && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
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
                          {selectedScheduleData.route.departure_harbor.harbor_name} → {selectedScheduleData.route.arrival_harbor.harbor_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(selectedScheduleData.departure_datetime)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(selectedScheduleData.departure_datetime)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>

            <Separator />

            {/* ✅ Filters */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="space-y-4">
                {/* Schedule Selection */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <Select
                    value={selectedSchedule ? String(selectedSchedule) : "all"}
                    onValueChange={handleScheduleChange}
                  >
                    <SelectTrigger className="min-w-[200px] max-w-full">
                      <SelectValue placeholder="Semua Jadwal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Semua Jadwal
                        </div>
                      </SelectItem>
                      {loadingSchedules ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
                              <span className="font-medium">{sch.ship.ship_name}</span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(sch.departure_datetime)}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type & Search Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={selectedType || "all"} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-[180px]">
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

                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Cari nama, nomor kendaraan, atau identitas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Content Area */}
            <CardContent className="flex-1 overflow-hidden p-4">
              {loadingTickets ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat riwayat tiket...</p>
                  </div>
                </div>
              ) : ticketError ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <Card className="max-w-md">
                    <CardContent className="text-center py-8">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-xl">⚠️</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Error Loading History</h3>
                      <p className="text-gray-600 mb-4">{ticketError.message}</p>
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <Card className="max-w-md">
                    <CardContent className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Belum Ada Riwayat Check-in
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {selectedSchedule 
                          ? "Belum ada tiket yang di check-in untuk jadwal ini."
                          : "Belum ada tiket yang di check-in. Riwayat akan muncul setelah tiket di check-in."
                        }
                      </p>
                      {checkedInTickets.length > 0 && selectedSchedule && (
                        <div className="text-sm text-gray-500">
                          Total check-in di sistem: <span className="font-medium">{checkedInTickets.length}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Stats Bar */}
                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Menampilkan <span className="font-semibold text-gray-900">{filteredTickets.length}</span> dari {checkedInTickets.length} tiket check-in
                      </div>
                      <div className="flex gap-2">
                        {selectedType && selectedType !== "all" && (
                          <Badge variant="secondary" className="text-xs">
                            Filter: {selectedType === "passenger" ? "Penumpang" : "Kendaraan"}
                          </Badge>
                        )}
                        {searchTerm && (
                          <Badge variant="secondary" className="text-xs">
                            Pencarian: "{searchTerm}"
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Status: Check-in
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* History Table */}
                  <div className="flex-1 overflow-y-auto">
                    {/* ✅ Disable check-in actions di riwayat */}
                    <TicketTable 
                      tickets={filteredTickets} 
                      showCheckInActions={false} 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}