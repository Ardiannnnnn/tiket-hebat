// app/petugas/(overview)/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OrderTable from "@/app/ui/petugas/pesanan";
import Verifikasi from "@/app/ui/petugas/verifikasi";
import { useAllSchedules } from "@/app/hooks/useSchedules";
import { useTickets } from "@/app/hooks/useTickets";
import {
  TicketPlus,
  CheckCircle,
  Ship,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("pesanan");
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  const { data: schedules = [], isLoading: loadingSchedules } =
    useAllSchedules();

  const {
    data: tickets = [],
    isLoading: loadingTickets,
    // ✅ Add dataUpdatedAt to track when data was last updated
    dataUpdatedAt,
  } = useTickets(selectedSchedule);

  // ✅ Enhanced real-time stats calculation
  const stats = useMemo(() => {
    console.log("🔄 Recalculating stats, tickets:", tickets.length);

    if (!tickets.length) {
      return {
        verified: 0,
        checkin: 0,
        pending: 0,
        confirmed: 0,
        total: 0,
        todaySchedules: 0,
      };
    }

    // ✅ Count by is_checked_in status
    const checkedInCount = tickets.filter(
      (ticket) => ticket.is_checked_in === true
    ).length;
    const notCheckedInCount = tickets.filter(
      (ticket) => ticket.is_checked_in === false
    ).length;

    // ✅ Count by ticket status
    const statusCounts = tickets.reduce((acc, ticket) => {
      const status = ticket.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const today = new Date().toDateString();
    const todaySchedules = schedules.filter(
      (schedule) =>
        new Date(schedule.departure_datetime).toDateString() === today
    ).length;

    const result = {
      checkin: checkedInCount, // ✅ Use actual is_checked_in count
      pending: notCheckedInCount, // ✅ Use actual not checked in count
      confirmed: statusCounts.confirmed || 0,
      total: tickets.length,
      todaySchedules,
    };

    console.log("📊 Updated stats:", result);
    return result;
  }, [tickets, schedules, dataUpdatedAt]); // ✅ Add dataUpdatedAt as dependency

  // ✅ Log when stats change for debugging
  useEffect(() => {
    console.log("📈 Stats updated:", stats);
  }, [stats]);

  return (
    <div className="">
      {/* ✅ Header Section - Enhanced real-time display */}
      <div className="shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-1xl font-semibold text-gray-900">
                  Dashboard Petugas
                </h1>
                <p className="text-gray-600 text-sm">
                  {selectedSchedule
                    ? `Kelola tiket untuk jadwal yang dipilih (${stats.total} tiket)`
                    : "Pilih jadwal untuk melihat statistik tiket"}
                  {/* ✅ Add last updated indicator */}
                  {dataUpdatedAt && (
                    <span className="ml-2 text-xs text-gray-400">
                      • Updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* ✅ Real-time Quick Stats with live updates */}
            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
              {loadingTickets ? (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg min-w-fit">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-gray-600">
                    Updating...
                  </span>
                </div>
              ) : selectedSchedule ? (
                <>
                  {/* ✅ Check-in Tickets - Using real count */}
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg min-w-fit">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Check-in:{" "}
                      <span className="font-bold">{stats.checkin}</span>
                    </span>
                  </div>

                  {/* ✅ Pending Tickets */}
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg min-w-fit">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">
                      Pending:{" "}
                      <span className="font-bold">{stats.pending}</span>
                    </span>
                  </div>

                  {/* ✅ Total Tickets */}
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg min-w-fit">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Total: <span className="font-bold">{stats.total}</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Today's Schedules */}
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg min-w-fit">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">
                      Hari ini: {stats.todaySchedules} jadwal
                    </span>
                  </div>

                  {/* Total Schedules */}
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg min-w-fit">
                    <Ship className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Total: {schedules.length} jadwal
                    </span>
                  </div>

                  {/* Loading Schedules */}
                  {loadingSchedules && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg min-w-fit">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Loading schedules...
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Main Content with updated badges */}
      <div className="container mx-auto px-4 py-6">
        {/* ✅ Desktop: Side by Side Layout */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-2 gap-6 ">
            {/* Pesanan Section */}
            <Card className="flex flex-col shadow-lg border py-0 gap-0 bg-white">
              <CardHeader className="py-8">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TicketPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  Pemesanan Tiket
                  <Badge variant="secondary" className="ml-auto">
                    {stats.pending} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full overflow-y-auto">
                  {/* ✅ Pass shared state sebagai props */}
                  <OrderTable
                    selectedSchedule={selectedSchedule}
                    setSelectedSchedule={setSelectedSchedule}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Verifikasi Section */}
            <Card className="flex flex-col shadow-lg border gap-0 py-0 bg-white">
              <CardHeader className="py-8">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  Verifikasi Tiket
                  <Badge variant="secondary" className="ml-auto">
                    {stats.checkin} check-in
                  </Badge>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full overflow-y-auto">
                  {/* ✅ Pass shared selectedSchedule */}
                  <Verifikasi selectedSchedule={selectedSchedule} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ✅ Mobile/Tablet: Tabs Layout with updated badges */}
        <div className="xl:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                    variant={
                      activeTab === "verifikasi" ? "secondary" : "outline"
                    }
                    className="ml-1 text-xs"
                  >
                    {stats.checkin}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pesanan" className="mt-0">
              <Card className="shadow-lg border py-0 gap-0 ">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TicketPlus className="w-5 h-5 text-blue-600" />
                      </div>
                      Pemesanan Tiket
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {stats.total} tiket
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <OrderTable
                    selectedSchedule={selectedSchedule}
                    setSelectedSchedule={setSelectedSchedule}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifikasi" className="mt-0">
              <Card className="shadow-lg border py-0 gap-0">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      Verifikasi Tiket
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {stats.checkin} check-in
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <Verifikasi selectedSchedule={selectedSchedule} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
