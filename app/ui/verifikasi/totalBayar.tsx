// app/ui/verifikasi/totalBayar.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Ship,
  Calendar,
  MapPin,
  Users,
  Car,
  Receipt,
  Clock,
} from "lucide-react";
import type { SessionData } from "@/types/session";

interface TotalBayarProps {
  session: SessionData; // ✅ Use same props as cardPrice
}

export default function TotalBayar({ session }: TotalBayarProps) {
  // ✅ Use same data structure as cardPrice
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

  // ✅ Use claim_items same as cardPrice
  const claimItems = session.claim_items ?? [];

  console.log("📊 TotalBayar data analysis:", {
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

  // ✅ Same calculation logic as cardPrice
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

  // ✅ Same helper function as cardPrice
  const getItemPrice = (item: (typeof claimItems)[0]) => {
    if (item.subtotal && item.quantity > 0) {
      return item.subtotal / item.quantity;
    }
    return 0;
  };

  // ✅ Filter items by type
  const penumpangItems = claimItems.filter(
    (item) => item.class.type === "passenger"
  );
  const kendaraanItems = claimItems.filter(
    (item) => item.class.type === "vehicle"
  );

  return (
    <Card className="border-0 bg-white overflow-hidden py-0 gap-0">
      {/* ✅ Enhanced Header */}
      <CardHeader className="bg-gradient-to-r from-Orange/10 to-Blue/10 border-b border-Orange/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-Orange/20 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-Orange" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Ringkasan Pesanan
              </CardTitle>
              <p className="text-sm text-gray-600">{kapal}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Route Information */}
        <div className="bg-Blue/5 rounded-lg p-4 border border-Blue/20">
          <div className="flex items-center gap-2 mb-3">
            <Ship className="w-4 h-4 text-Blue" />
            <span className="text-sm font-medium text-Blue">
              Rute Perjalanan
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-900">{keberangkatan.asal}</p>
              <p className="text-xs text-gray-500">Keberangkatan</p>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-Blue/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-Blue to-Orange"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-medium text-gray-900">
                {keberangkatan.tujuan}
              </p>
              <p className="text-xs text-gray-500">Kedatangan</p>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-Orange mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600">Jadwal Keberangkatan</p>
              <p className="font-medium text-gray-900">
                {keberangkatan.jadwal}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-Orange" />
                <p className="text-lg font-bold text-Orange">
                  {keberangkatan.jam}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Show message if no claim items */}
        {claimItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada tiket yang ditemukan</p>
            <p className="text-sm">Belum ada tiket yang dipilih</p>
          </div>
        )}

        {/* ✅ Enhanced Ticket Details using claim_items */}
        <div className="space-y-4">
          {/* Passenger Tickets */}
          {penumpangItems.length > 0 && (
            <div className="border border-Blue/20 rounded-lg p-4 bg-Blue/5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-Blue" />
                <span className="text-sm font-medium text-Blue">
                  Tiket Penumpang
                </span>
              </div>
              <div className="space-y-2">
                {/* ✅ Show breakdown by class */}
                <div className="space-y-1 mb-3">
                  {penumpangItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.class.class_name} × {item.quantity}
                      </span>
                      <span>
                        {item.subtotal ? (
                          `Rp${item.subtotal.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">
                            Harga belum tersedia
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-Blue/10 pt-2">
                  <div>
                    <p className="font-medium text-gray-900">Total Penumpang</p>
                  </div>
                  <p className="font-bold text-Blue text-sm">
                    {totalHargaPenumpang > 0 ? (
                      `Rp${totalHargaPenumpang.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Harga belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Tickets */}
          {kendaraanItems.length > 0 && (
            <div className="border border-Orange/20 rounded-lg p-4 bg-Orange/5">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-Orange" />
                <span className="text-sm font-medium text-Orange">
                  Tiket Kendaraan
                </span>
              </div>
              <div className="space-y-2">
                {/* ✅ Show breakdown by class */}
                <div className="space-y-1 mb-3">
                  {kendaraanItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.class.class_name} × {item.quantity}
                      </span>
                      <span>
                        {item.subtotal ? (
                          `Rp${item.subtotal.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">
                            Harga belum tersedia
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-Orange/10 pt-2">
                  <div>
                    <p className="font-medium text-gray-900">Total Kendaraan</p>
                  </div>
                  <p className="font-bold text-Orange text-sm">
                    {totalHargaKendaraan > 0 ? (
                      `Rp${totalHargaKendaraan.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Harga belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Enhanced Footer with Total - Only show if there are items */}
      {claimItems.length > 0 && (
        <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6">
          <div className="w-full space-y-3">
            {/* Subtotals */}
            <div className="space-y-2 text-sm">
              {totalHargaPenumpang > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Penumpang:</span>
                  <span>Rp{totalHargaPenumpang.toLocaleString()}</span>
                </div>
              )}
              {totalHargaKendaraan > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Kendaraan:</span>
                  <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">
                  Total Pembayaran:
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {totalHargaPenumpang + totalHargaKendaraan > 0 ? (
                    `Rp${(
                      totalHargaPenumpang + totalHargaKendaraan
                    ).toLocaleString()}`
                  ) : (
                    <span className="text-gray-400 text-lg">
                      Harga belum tersedia
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">
                {claimItems.reduce((total, item) => total + item.quantity, 0)}{" "}
                item total
              </p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
