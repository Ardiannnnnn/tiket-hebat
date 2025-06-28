// app/ui/form/cardPrice.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Ship,
  Calendar,
  Clock,
  Users,
  Car,
  MapPin,
} from "lucide-react";
import type { SessionData } from "@/types/session";

interface CardPriceProps {
  session: SessionData;
}

export default function CardPrice({ session }: CardPriceProps) {
  // ✅ Simple sticky state for positioning only
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 200;
      setIsSticky(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const kapal = session.schedule?.ship?.ship_name ?? "Tidak diketahui";
  const keberangkatan = {
    asal: session.schedule?.departure_harbor?.harbor_name ?? "-",
    tujuan: session.schedule?.arrival_harbor?.harbor_name ?? "-",
    jadwal: new Date(
      session.schedule?.departure_datetime ?? ""
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    jam: new Date(
      session.schedule?.departure_datetime ?? ""
    ).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const claimItems = session.claim_items ?? [];
  const tickets = session.tickets ?? [];

  console.log("📊 CardPrice data analysis:", {
    claimItems,
    hasClaimItems: claimItems.length > 0,
    claimItemsStructure: claimItems.map((item) => ({
      class_id: item.class_id,
      className: item.class.class_name,
      type: item.class.type,
      quantity: item.quantity,
      hasSubtotal: "subtotal" in item,
    })),
  });

  const totalHargaPenumpang = claimItems
    .filter((item) => item.class.type === "passenger")
    .reduce((acc, item) => {
      const subtotal = item.subtotal ?? 0;
      return acc + subtotal;
    }, 0);

  const totalHargaKendaraan = claimItems
    .filter((item) => item.class.type === "vehicle")
    .reduce((acc, item) => {
      const subtotal = item.subtotal ?? 0;
      return acc + subtotal;
    }, 0);

  const getItemPrice = (item: (typeof claimItems)[0]) => {
    if (item.subtotal && item.quantity > 0) {
      return item.subtotal / item.quantity;
    }
    return 0;
  };

  return (
    <div className={cn(
      // ✅ Only sticky positioning, no visual changes
      "lg:sticky lg:top-4"
    )}>
      <Card className="text-sm shadow-lg py-0 gap-0">
        {/* ✅ Simple header without transitions */}
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between border-b p-4 sm:p-6 space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2 font-semibold text-gray-800">
            <MapPin className="w-5 h-5 text-blue-600" />
            Detail Keberangkatan
          </CardTitle>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Ship className="w-5 h-5" />
            {kapal}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {/* Route and Schedule Section */}
          <div className="bg-Orange/10 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Route Info */}
              <div className="space-y-3 mb-3">
                <label className="flex items-center gap-2 text-Orange font-medium text-sm">
                  <MapPin className="w-4 h-4" />
                  Rute Keberangkatan
                </label>
                <div className="flex items-center gap-2 justify-start text-base font-semibold">
                  <span className="text-gray-800 flex-1 text-center text-sm md:text-base md:px-4">
                    {keberangkatan.asal}
                  </span>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-Orange/20 rounded-full flex items-center justify-center">
                      <Ship className="w-4 h-4 text-Orange" />
                    </div>
                  </div>
                  <span className="text-gray-800 flex-1 text-center text-sm md:text-base">
                    {keberangkatan.tujuan}
                  </span>
                </div>
              </div>

              {/* Right Column - Schedule Info */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-Orange font-medium text-sm lg:justify-end">
                  <Calendar className="w-4 h-4" />
                  Jadwal Keberangkatan
                </label>
                <div className="space-y-2 lg:text-right">
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">
                      {keberangkatan.jadwal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 lg:justify-end">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">
                      {keberangkatan.jam}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Show message if no claim items */}
          {claimItems.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Belum ada tiket yang dipilih</p>
            </div>
          )}

          {/* Ticket Details Section */}
          {claimItems.length > 0 && (
            <div className="space-y-6">
              {/* Tiket Penumpang */}
              {claimItems.filter((item) => item.class.type === "passenger")
                .length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    Tiket Penumpang
                  </label>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                    {claimItems
                      .filter((item) => item.class.type === "passenger")
                      .map((tiket, index) => (
                        <div key={index} className="space-y-2">
                          {/* Kelas dan Harga */}
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">
                              {tiket.class.class_name}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {tiket.subtotal && tiket.quantity > 0
                                ? `Rp ${getItemPrice(tiket).toLocaleString()}`
                                : "Rp 0"}
                            </span>
                          </div>
                          {/* Jumlah */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Jumlah</span>
                            <span className="text-sm text-gray-500">
                              x{tiket.quantity}
                            </span>
                          </div>
                          {/* Divider if not last item */}
                          {index <
                            claimItems.filter((item) => item.class.type === "passenger")
                              .length - 1 && (
                            <hr className="border-blue-200" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tiket Kendaraan */}
              {claimItems.filter((item) => item.class.type === "vehicle")
                .length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3">
                    <Car className="w-4 h-4 text-green-600" />
                    Tiket Kendaraan
                  </label>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-3">
                    {claimItems
                      .filter((item) => item.class.type === "vehicle")
                      .map((tiket, index) => (
                        <div key={index} className="space-y-2">
                          {/* Kelas dan Harga */}
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">
                              {tiket.class.class_name}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {tiket.subtotal && tiket.quantity > 0
                                ? `Rp ${getItemPrice(tiket).toLocaleString()}`
                                : "Rp 0"}
                            </span>
                          </div>
                          {/* Jumlah */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Jumlah</span>
                            <span className="text-sm text-gray-500">
                              x{tiket.quantity}
                            </span>
                          </div>
                          {/* Divider if not last item */}
                          {index <
                            claimItems.filter((item) => item.class.type === "vehicle")
                              .length - 1 && (
                            <hr className="border-green-200" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer - Only show if there are claim items */}
        {claimItems.length > 0 && (
          <CardFooter className="border-t bg-gray-50 rounded-b-lg p-4 sm:p-6">
            <div className="w-full">
              {/* Mobile: Stack vertically */}
              <div className="flex flex-col sm:hidden space-y-3">
                {totalHargaPenumpang > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Harga Total Tiket Penumpang:</span>
                    <span className="font-medium">
                      Rp{totalHargaPenumpang.toLocaleString()}
                    </span>
                  </div>
                )}
                {totalHargaKendaraan > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Harga Total Kendaraan:
                    </span>
                    <span className="font-medium">
                      Rp{totalHargaKendaraan.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-sm">Total:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {totalHargaPenumpang + totalHargaKendaraan > 0 ? (
                      `Rp${(
                        totalHargaPenumpang + totalHargaKendaraan
                      ).toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">
                        Harga belum tersedia
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Desktop: Side by side */}
              <div className="hidden sm:flex justify-between">
                <div className="space-y-2">
                  {totalHargaPenumpang > 0 && (
                    <p className="text-gray-600">Harga Total Tiket Penumpang:</p>
                  )}
                  {totalHargaKendaraan > 0 && (
                    <p className="text-gray-600">Harga Total Kendaraan:</p>
                  )}
                  <p className="font-bold text-sm pt-2 border-t border-gray-200">
                    Total:
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  {totalHargaPenumpang > 0 && (
                    <p className="font-medium">
                      Rp{totalHargaPenumpang.toLocaleString()}
                    </p>
                  )}
                  {totalHargaKendaraan > 0 && (
                    <p className="font-medium">
                      Rp{totalHargaKendaraan.toLocaleString()}
                    </p>
                  )}
                  <p className="font-bold text-sm text-blue-600 pt-2 border-t border-gray-200">
                    {totalHargaPenumpang + totalHargaKendaraan > 0 ? (
                      `Rp${(
                        totalHargaPenumpang + totalHargaKendaraan
                      ).toLocaleString()}`
                    ) : (
                      <span className="text-gray-400 text-base">
                        Harga belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
