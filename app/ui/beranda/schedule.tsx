// app/ui/beranda/schedule.tsx
"use client";

import { useEffect, useState } from "react";
import { poppins } from "@/app/ui/fonts";
import { getSchedule } from "@/service/schedule";
import type { Schedule } from "@/types/schedule";
import { Ship, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";

export default function Schedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await getSchedule();

        console.log("📅 Schedule response:", response);

        if (response?.data) {
          // ✅ Limit to first 5 schedules for clean display
          setSchedules(response.data.slice(0, 6));
        } else {
          setSchedules([]);
        }
      } catch (error: any) {
        console.error("❌ Failed to fetch schedules:", error);
        setError(error.message || "Gagal memuat jadwal");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // ✅ Format date helper - Indonesian format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // ✅ Format time helper
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  // ✅ Format route helper for desktop
  const formatRoute = (schedule: Schedule) => {
    const departure = schedule.departure_harbor?.harbor_name || "Unknown";
    const arrival = schedule.arrival_harbor?.harbor_name || "Unknown";
    return { departure, arrival };
  };

  // ✅ Format route helper for mobile (shorter) - Update untuk format yang lebih baik
  const formatRouteMobile = (schedule: Schedule) => {
    const departure =
      schedule.departure_harbor?.harbor_name?.replace("Pelabuhan ", "") ||
      "Unknown";
    const arrival =
      schedule.arrival_harbor?.harbor_name?.replace("Pelabuhan ", "") ||
      "Unknown";
    return { departure, arrival };
  };

  return (
    <section
      className={`${poppins.className} w-full flex flex-col-reverse xl:flex-row justify-center gap-4 xl:gap-16`}
    >
      <div className="lg:col-span-8">
        <div className="w-full">
          {/* Desktop Table View */}
          <div className="hidden md:block mx-24 xl:mx-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-Blue/5 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-gray-700">
                  <div className="col-span-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-Blue" />
                    Rute Perjalanan
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-Blue" />
                    Tanggal & Waktu
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Ship className="w-4 h-4 text-Blue" />
                    Kapal
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-Blue" />
                    Status
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  // Loading state
                  [...Array(5)].map((_, index) => (
                    <div key={`loading-${index}`} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-2">
                          <div className="h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  // Error state
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="font-medium text-red-600">
                      Gagal memuat jadwal
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{error}</p>
                  </div>
                ) : schedules.length === 0 ? (
                  // Empty state
                  <div className="p-8 text-center">
                    <Ship className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-600">
                      Belum ada jadwal tersedia
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Silakan coba lagi nanti
                    </p>
                  </div>
                ) : (
                  // Data rows
                  schedules.map((schedule, index) => {
                    const route = formatRoute(schedule);
                    return (
                      <div
                        key={schedule.id || index}
                        className="p-4 hover:bg-Blue/5 transition-colors cursor-pointer group"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Route */}
                          <div className="col-span-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-Blue/10 rounded-full flex items-center justify-center group-hover:bg-Blue/20 transition-colors">
                                <MapPin className="w-4 h-4 text-Blue" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {route.departure}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ke {route.arrival}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="col-span-3">
                            <p className="font-medium text-gray-800 text-sm">
                              {formatDate(schedule.departure_datetime)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(schedule.departure_datetime)}
                            </p>
                          </div>

                          {/* Ship */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-2">
                              <Ship className="w-4 h-4 text-Blue" />
                              <span className="font-medium text-gray-800 text-sm">
                                {schedule.ship?.ship_name || "Unknown Ship"}
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                schedule.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {schedule.status === "active"
                                ? "Aktif"
                                : "Tidak Aktif"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Mobile Table View */}
          <div className="md:hidden mx-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Table Header */}
              <div className="bg-Blue/5 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold text-gray-700">
                  <div className="col-span-4 text-left">Rute</div>
                  <div className="col-span-3 text-center">Tanggal</div>
                  <div className="col-span-3 text-center">Kapal</div>
                  <div className="col-span-2 text-center">Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {loading ? (
                  // Mobile Loading
                  [...Array(5)].map((_, index) => (
                    <div key={`mobile-loading-${index}`} className="p-3">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-3">
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-3">
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-2">
                          <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  // Mobile Error
                  <div className="p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-600">
                      Gagal memuat jadwal
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{error}</p>
                  </div>
                ) : schedules.length === 0 ? (
                  // Mobile Empty
                  <div className="p-6 text-center">
                    <Ship className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Belum ada jadwal tersedia
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Silakan coba lagi nanti
                    </p>
                  </div>
                ) : (
                  // Mobile Table Rows
                  schedules.map((schedule, index) => (
                    <div
                      key={schedule.id || index}
                      className="p-3 hover:bg-Blue/5 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center text-xs">
                        {/* Route - Update tampilan */}
                        <div className="col-span-4">
                          <div className="text-xs">
                            <p className="font-medium text-gray-800 truncate">
                              {formatRouteMobile(schedule).departure}
                            </p>
                            <p className="text-gray-500 truncate">
                              {formatRouteMobile(schedule).arrival}
                            </p>
                          </div>
                        </div>

                        {/* Date - Hilangkan waktu */}
                        <div className="col-span-3 text-center">
                          <div className="text-xs">
                            <p className="font-medium text-gray-800">
                              {formatDate(schedule.departure_datetime)}
                            </p>
                            <p className="text-gray-500">
                              {formatTime(schedule.departure_datetime)}
                            </p>
                          </div>
                        </div>

                        {/* Ship */}
                        <div className="col-span-3 text-center">
                          <p className="font-medium text-gray-800 text-xs truncate">
                            {schedule.ship?.ship_name?.split(" ")[0] ||
                              "Unknown"}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 text-center">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              schedule.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {schedule.status === "active" ? "✓" : "✗"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="flex flex-col justify-center items-center xl:items-end xl:justify-end xl:gap-6">
          {/* ✅ Decorative Elements - Gunakan styling asli dari itemDua.tsx */}
          <div className="relative flex h-14 xl:h-40 w-60 justify-center items-center xl:left-20">
            <div className="absolute xl:bottom-5 left-22 xl:left-6 w-6 h-6  xl:w-15 xl:h-15 bg-Blue rounded-full"></div>
            <div className="absolute xl:top-5 right-22 xl:right-10 w-6 h-6  xl:w-26 xl:h-26 bg-Orange rounded-full"></div>
          </div>

          {/* ✅ Main Content - Gunakan styling asli */}
          <div className="hidden xl:block xl:text-end text-center">
            <p className="font-semibold md:text-2xl">
              Persiapkan Keberangkatan
            </p>
            <p className="font-semibold md:text-xl">Dengan Menjadwalkannya</p>
          </div>

          <div className="xl:text-end text-center space-y-4">
            <div className="mr-4 text-sm md:text-base">
              <p>Informasi Jadwal</p>
              <p>Keberangkatan Minggu Ini</p>
            </div>
            <Link href="/jadwal">
              <div className=" p-2 xl:p-4 bg-Orange rounded-full flex items-center justify-center space-x-2 xlspace-x-6 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaArrowLeft className="xl:w-6 xl:h-6 text-white" />
                <p className="text-center text-sm xl:text-xl text-white font-semibold">
                  Lihat Lengkap
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
