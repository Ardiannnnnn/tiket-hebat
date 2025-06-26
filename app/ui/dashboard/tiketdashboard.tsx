// app/petugas/(overview)/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllSchedules } from "@/app/hooks/useSchedules";
import { useTickets } from "@/app/hooks/useTickets";
import {
  TicketPlus,
  CheckCircle,
  Ship,
  Users,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCheck,
  X,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("pesanan");
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: schedules = [], isLoading: loadingSchedules } = useAllSchedules();
  const { data: tickets = [], isLoading: loadingTickets, refetch } = useTickets(selectedSchedule);

  // Enhanced stats calculation
  const stats = useMemo(() => {
    if (!tickets.length) {
      return {
        checkin: 0,
        pending: 0,
        confirmed: 0,
        total: 0,
        todaySchedules: 0,
      };
    }

    const checkedInCount = tickets.filter(ticket => ticket.is_checked_in === true).length;
    const pendingCount = tickets.filter(ticket => ticket.is_checked_in === false).length;
    const confirmedCount = tickets.filter(ticket => ticket.status === "confirmed").length;

    const today = new Date().toDateString();
    const todaySchedules = schedules.filter(
      schedule => new Date(schedule.departure_datetime).toDateString() === today
    ).length;

    return {
      checkin: checkedInCount,
      pending: pendingCount,
      confirmed: confirmedCount,
      total: tickets.length,
      todaySchedules,
    };
  }, [tickets, schedules]);

  // Filter and search tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) 

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "checkin" && ticket.is_checked_in) ||
        (statusFilter === "pending" && !ticket.is_checked_in) ||
        (statusFilter === "confirmed" && ticket.status === "confirmed");

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, statusFilter]);

  // Pagination
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTickets.slice(startIndex, startIndex + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  // Handle check-in action
  const handleCheckIn = async (ticketId: number) => {
    try {
      // Call your check-in API here
      console.log("Check-in ticket:", ticketId);
      // After successful check-in, refetch data
      refetch();
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  // Get selected schedule info
  const selectedScheduleInfo = schedules.find(s => s.id === selectedSchedule);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Dashboard Petugas
                </h1>
                <p className="text-blue-100 text-lg">
                  {selectedSchedule
                    ? `Kelola tiket untuk jadwal yang dipilih`
                    : "Pilih jadwal untuk melihat dan kelola tiket"}
                </p>
              </div>
            </div>

            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-300" />
                  <div>
                    <p className="text-green-200 text-sm">Check-in</p>
                    <p className="text-2xl font-bold text-white">{stats.checkin}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-300" />
                  <div>
                    <p className="text-yellow-200 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-300" />
                  <div>
                    <p className="text-purple-200 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-300" />
                  <div>
                    <p className="text-orange-200 text-sm">Confirmed</p>
                    <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Selector */}
          {selectedScheduleInfo && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-blue-200" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {selectedScheduleInfo.departure_harbor.harbor_name} 
                    <ArrowRight className="w-4 h-4 inline mx-2" />
                    {selectedScheduleInfo.arrival_harbor.harbor_name}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {new Date(selectedScheduleInfo.departure_datetime).toLocaleString('id-ID')} • 
                    {selectedScheduleInfo.ship.ship_name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSchedule(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Desktop: Side by Side Layout */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-2 gap-8">
            {/* Pesanan Section */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <TicketPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-900">Pemesanan Tiket</h3>
                    <p className="text-sm text-blue-600 font-normal">Kelola pesanan masuk</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
                    {stats.pending} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Schedule Selector for Orders */}
                <div className="mb-6">
                  <Select
                    value={selectedSchedule?.toString() || ""}
                    onValueChange={(value) => setSelectedSchedule(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jadwal untuk melihat tiket..." />
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Ship className="w-4 h-4" />
                            <span>
                              {schedule.departure_harbor.harbor_name} → {schedule.arrival_harbor.harbor_name}
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {new Date(schedule.departure_datetime).toLocaleDateString('id-ID')}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSchedule ? (
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Cari tiket, nama, atau telepon..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tickets List */}
                    {loadingTickets ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-20" />
                        ))}
                      </div>
                    ) : paginatedTickets.length > 0 ? (
                      <div className="space-y-3">
                        {paginatedTickets.map((ticket) => (
                          <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{ticket.passenger_name}</p>
                                    <p className="text-sm text-gray-600">{ticket.seat_number}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant={ticket.status === "confirmed" ? "default" : "secondary"}
                                  className={ticket.status === "confirmed" ? "bg-green-500" : ""}
                                >
                                  {ticket.status || "pending"}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TicketPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada tiket ditemukan</p>
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pilih jadwal untuk melihat tiket</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verifikasi Section */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-green-900">Verifikasi Tiket</h3>
                    <p className="text-sm text-green-600 font-normal">Check-in penumpang</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                    {stats.checkin} check-in
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedSchedule ? (
                  <div className="space-y-4">
                    {/* Check-in Actions */}
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Scan QR atau cari tiket..."
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Check-in List */}
                    {loadingTickets ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-20" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tickets
                          .filter(ticket => !ticket.is_checked_in)
                          .slice(0, 10)
                          .map((ticket) => (
                          <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{ticket.passenger_name}</p>
                                    <p className="text-sm text-gray-600">{ticket.schedule.departure_datetime}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                                  Belum Check-in
                                </Badge>
                                <Button 
                                  onClick={() => handleCheckIn(ticket.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                  size="sm"
                                >
                                  <CheckCheck className="w-4 h-4 mr-1" />
                                  Check-in
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Checked-in List */}
                    {tickets.some(t => t.is_checked_in) && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sudah Check-in</h4>
                        <div className="space-y-3">
                          {tickets
                            .filter(ticket => ticket.is_checked_in)
                            .slice(0, 5)
                            .map((ticket) => (
                            <div key={ticket.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCheck className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{ticket.passenger_name}</p>
                                    <p className="text-sm text-gray-600">{ticket.seat_number}</p>
                                  </div>
                                </div>
                                <Badge className="bg-green-500">
                                  ✓ Check-in
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pilih jadwal untuk verifikasi tiket</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile/Tablet: Tabs Layout */}
        <div className="xl:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 z-10 bg-white border rounded-lg shadow-sm mb-6">
              <TabsList className="grid w-full grid-cols-2 p-1">
                <TabsTrigger
                  value="pesanan"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <TicketPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Pemesanan</span>
                  <span className="sm:hidden">Order</span>
                  <Badge
                    variant={activeTab === "pesanan" ? "secondary" : "outline"}
                    className="ml-1 text-xs"
                  >
                    {stats.pending}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="verifikasi"
                  className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Verifikasi</span>
                  <span className="sm:hidden">Verify</span>
                  <Badge
                    variant={activeTab === "verifikasi" ? "secondary" : "outline"}
                    className="ml-1 text-xs"
                  >
                    {stats.checkin}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pesanan" className="mt-0">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <TicketPlus className="w-5 h-5 text-white" />
                    </div>
                    Pemesanan Tiket
                    <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700">
                      <Calendar className="w-3 h-3 mr-1" />
                      {stats.total} tiket
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Mobile content for orders - same as desktop but simplified */}
                  <div className="space-y-4">
                    <Select
                      value={selectedSchedule?.toString() || ""}
                      onValueChange={(value) => setSelectedSchedule(value ? parseInt(value) : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jadwal..." />
                      </SelectTrigger>
                      <SelectContent>
                        {schedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id.toString()}>
                            {schedule.departure_harbor.harbor_name} → {schedule.arrival_harbor.harbor_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedSchedule && (
                      <>
                        <Input
                          placeholder="Cari tiket..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {paginatedTickets.map((ticket) => (
                          <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{ticket.passenger_name}</p>
                                <p className="text-sm text-gray-600">{ticket.seat_number}</p>
                              </div>
                              <Badge variant={ticket.status === "confirmed" ? "default" : "secondary"}>
                                {ticket.status || "pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifikasi" className="mt-0">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Verifikasi Tiket
                    <Badge variant="outline" className="ml-auto bg-green-50 text-green-700">
                      <Users className="w-3 h-3 mr-1" />
                      {stats.checkin} check-in
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedSchedule ? (
                    <div className="space-y-4">
                      <Input placeholder="Scan QR atau cari tiket..." />
                      
                      {tickets
                        .filter(ticket => !ticket.is_checked_in)
                        .map((ticket) => (
                        <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{ticket.passenger_name}</p>
                              <p className="text-sm text-gray-600">{ticket.seat_number}</p>
                            </div>
                            <Button 
                              onClick={() => handleCheckIn(ticket.id)}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              Check-in
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Pilih jadwal untuk verifikasi</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}