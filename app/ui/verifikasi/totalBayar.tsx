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
  session: SessionData;
  isModal?: boolean; // ✅ Add modal prop
}

export default function TotalBayar({ session, isModal = false }: TotalBayarProps) {
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
    <Card className={`${
      isModal 
        ? 'shadow-none border-0 bg-transparent p-4' // ✅ Remove card styling in modal
        : 'shadow-lg border gap-0 py-0 bg-white overflow-hidden'
    }`}>
      <CardHeader className={`${
        isModal 
          ? 'p-0 border-0 mb-4' // ✅ Minimal padding in modal
          : 'border-b p-4 sm:p-6'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`${
            isModal ? 'w-6 h-6' : 'w-8 h-8'
          } bg-green-100 rounded-full flex items-center justify-center`}>
            <Receipt className={`${
              isModal ? 'w-3 h-3' : 'w-4 h-4'
            } text-green-600`} />
          </div>
          <h2 className={`font-semibold text-gray-800 ${
            isModal ? 'text-lg' : 'text-lg'
          }`}>
            Ringkasan Pemesanan Anda
          </h2>
        </div>
      </CardHeader>

      <CardContent className={`${
        isModal ? 'p-0 space-y-4' : 'p-4 py-0 sm:p-6 space-y-4'
      }`}>
        {/* ✅ Enhanced Route Information - Better mobile spacing */}
        <div className={`bg-Blue/5 rounded-lg border border-Blue/20 ${
          isModal ? 'p-3' : 'p-4'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Ship className="w-4 h-4 text-Blue" />
            <span className={`font-medium text-Blue ${
              isModal ? 'text-sm' : 'text-sm'
            }`}>
              Rute Perjalanan
            </span>
          </div>

          <div className={`flex items-center justify-between ${
            isModal ? 'text-xs' : 'text-sm'
          }`}>
            <div className="text-center flex-1">
              <p className="font-medium text-gray-900 truncate">
                {keberangkatan.asal}
              </p>
              <p className="text-xs text-gray-500">Asal</p>
            </div>

            <div className="flex-1 mx-2 sm:mx-4">
              <div className="h-0.5 bg-Blue/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-Blue to-Orange"></div>
              </div>
            </div>

            <div className="text-center flex-1">
              <p className="font-medium text-gray-900 truncate">
                {keberangkatan.tujuan}
              </p>
              <p className="text-xs text-gray-500">Tujuan</p>
            </div>
          </div>
        </div>

        {/* ✅ Enhanced Schedule Information - Compact mobile layout */}
        <div className={`bg-gray-50 rounded-lg border ${
          isModal ? 'p-3' : 'p-4'
        }`}>
          <div className="flex items-start gap-3">
            <Calendar className={`${
              isModal ? 'w-4 h-4' : 'w-5 h-5'
            } text-Orange mt-0.5 flex-shrink-0`} />
            <div className="min-w-0 flex-1">
              <p className={`text-gray-600 ${
                isModal ? 'text-xs' : 'text-sm'
              }`}>
                Jadwal Keberangkatan
              </p>
              <p className={`font-medium text-gray-900 ${
                isModal ? 'text-sm' : 'text-base'
              }`}>
                {keberangkatan.jadwal}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className={`${
                  isModal ? 'w-3 h-3' : 'w-4 h-4'
                } text-Orange`} />
                <p className={`font-bold text-Orange ${
                  isModal ? 'text-base' : 'text-lg'
                }`}>
                  {keberangkatan.jam} WIB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Show message if no claim items - Better mobile */}
        {claimItems.length === 0 && (
          <div className={`text-center text-gray-500 ${
            isModal ? 'py-6' : 'py-8'
          }`}>
            <Receipt className={`mx-auto mb-3 opacity-30 ${
              isModal ? 'w-8 h-8' : 'w-12 h-12'
            }`} />
            <p className={isModal ? 'text-sm' : 'text-base'}>
              Tidak ada tiket yang ditemukan
            </p>
            <p className="text-xs">Belum ada tiket yang dipilih</p>
          </div>
        )}

        {/* ✅ Enhanced Ticket Details - Better mobile spacing */}
        <div className="space-y-3">
          {/* Passenger Tickets */}
          {penumpangItems.length > 0 && (
            <div className={`border border-Blue/20 rounded-lg bg-Blue/5 ${
              isModal ? 'p-3' : 'p-4'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-Blue" />
                <span className={`font-medium text-Blue ${
                  isModal ? 'text-sm' : 'text-sm'
                }`}>
                  Tiket Penumpang
                </span>
              </div>
              <div className="space-y-2">
                {/* ✅ Show breakdown by class - Better mobile text */}
                <div className="space-y-1 mb-3">
                  {penumpangItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center text-gray-600 ${
                        isModal ? 'text-xs' : 'text-sm'
                      }`}
                    >
                      <span className="flex-1 truncate pr-2">
                        {item.class.class_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {item.subtotal ? (
                          `Rp${item.subtotal.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">
                            Belum tersedia
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-Blue/10 pt-2">
                  <p className={`font-medium text-gray-900 ${
                    isModal ? 'text-sm' : 'text-base'
                  }`}>
                    Total Penumpang
                  </p>
                  <p className={`font-bold text-Blue ${
                    isModal ? 'text-sm' : 'text-sm'
                  }`}>
                    {totalHargaPenumpang > 0 ? (
                      `Rp${totalHargaPenumpang.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">
                        Belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Tickets */}
          {kendaraanItems.length > 0 && (
            <div className={`border border-Orange/20 rounded-lg bg-Orange/5 ${
              isModal ? 'p-3' : 'p-4'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-Orange" />
                <span className={`font-medium text-Orange ${
                  isModal ? 'text-sm' : 'text-sm'
                }`}>
                  Tiket Kendaraan
                </span>
              </div>
              <div className="space-y-2">
                {/* ✅ Show breakdown by class - Better mobile text */}
                <div className="space-y-1 mb-3">
                  {kendaraanItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center text-gray-600 ${
                        isModal ? 'text-xs' : 'text-sm'
                      }`}
                    >
                      <span className="flex-1 truncate pr-2">
                        {item.class.class_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {item.subtotal ? (
                          `Rp${item.subtotal.toLocaleString()}`
                        ) : (
                          <span className="text-gray-400">
                            Belum tersedia
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-Orange/10 pt-2">
                  <p className={`font-medium text-gray-900 ${
                    isModal ? 'text-sm' : 'text-base'
                  }`}>
                    Total Kendaraan
                  </p>
                  <p className={`font-bold text-Orange ${
                    isModal ? 'text-sm' : 'text-sm'
                  }`}>
                    {totalHargaKendaraan > 0 ? (
                      `Rp${totalHargaKendaraan.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">
                        Belum tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* ✅ Enhanced Footer - Better mobile layout */}
      {claimItems.length > 0 && (
        <CardFooter className={`${
          isModal 
            ? 'bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6'
        }`}>
          <div className="w-full space-y-3">
            {/* ✅ Subtotals - Compact for mobile */}
            <div className={`space-y-1 ${
              isModal ? 'text-xs' : 'text-sm'
            }`}>
              {totalHargaPenumpang > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Penumpang:</span>
                  <span className="font-medium">
                    Rp{totalHargaPenumpang.toLocaleString()}
                  </span>
                </div>
              )}
              {totalHargaKendaraan > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Kendaraan:</span>
                  <span className="font-medium">
                    Rp{totalHargaKendaraan.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ Grand Total - Responsive sizing */}
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between items-center">
                <span className={`font-bold text-gray-900 ${
                  isModal ? 'text-sm' : 'text-base'
                }`}>
                  Total Pembayaran:
                </span>
                <div className="text-right">
                  <span className={`font-bold text-blue-600 ${
                    isModal ? 'text-base' : 'text-lg'
                  }`}>
                    {totalHargaPenumpang + totalHargaKendaraan > 0 ? (
                      `Rp${(
                        totalHargaPenumpang + totalHargaKendaraan
                      ).toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">
                        Belum tersedia
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <p className={`text-gray-500 text-right mt-1 ${
                isModal ? 'text-xs' : 'text-xs'
              }`}>
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
