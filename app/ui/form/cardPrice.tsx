// app/ui/form/cardPrice.tsx
import React from "react";
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
  const kapal = session.schedule?.ship?.ship_name ?? "Tidak diketahui";
  const keberangkatan = {
    asal: session.schedule?.route?.departure_harbor?.harbor_name ?? "-",
    tujuan: session.schedule?.route?.arrival_harbor?.harbor_name ?? "-",
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

  const prices = session.prices ?? [];
  const tickets = session.tickets ?? [];

  const totalHargaPenumpang = prices
    .filter((item) => item.class.type === "passenger")
    .reduce((acc, item) => acc + item.subtotal, 0);
  const totalHargaKendaraan = prices
    .filter((item) => item.class.type === "vehicle")
    .reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div>
      <Card className={cn("text-sm shadow-l py-0 gap-0")}>
        {/* Enhanced Header */}
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
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-Orange font-medium text-sm">
                  <MapPin className="w-4 h-4" />
                  Rute Keberangkatan
                </label>
                <div className="flex items-center justify-start text-base font-semibold">
                  <span className="text-gray-800 flex-1 text-start">
                    {keberangkatan.asal}
                  </span>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-Orange/20 rounded-full flex items-center justify-center">
                      <Ship className="w-4 h-4 text-Orange" />
                    </div>
                  </div>
                  <span className="text-gray-800 flex-1 text-end">
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

          {/* Ticket Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Ticket Classes */}
            <div className="space-y-6">
              {/* Kelas Tiket Penumpang */}
              {prices.filter((item) => item.class.type === "passenger").length >
                0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    Kelas Tiket Penumpang
                  </label>
                  <div className="space-y-2">
                    {prices
                      .filter((item) => item.class.type === "passenger")
                      .map((tiket, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 block">
                                {tiket.class.class_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                Jumlah: {tiket.quantity} orang
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Kelas Tiket Kendaraan */}
              {prices.filter((item) => item.class.type === "vehicle").length >
                0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3">
                    <Car className="w-4 h-4 text-green-600" />
                    Kelas Tiket Kendaraan
                  </label>
                  <div className="space-y-2">
                    {prices
                      .filter((item) => item.class.type === "vehicle")
                      .map((tiket, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Car className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 block">
                                {tiket.class.class_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                Jumlah: {tiket.quantity} unit
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Prices */}
            <div className="space-y-6">
              {/* Harga Penumpang */}
              {prices.filter((item) => item.class.type === "passenger").length >
                0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3 lg:justify-end">
                    <span>Harga Tiket Penumpang</span>
                  </label>
                  <div className="space-y-2">
                    {prices
                      .filter((item) => item.class.type === "passenger")
                      .map((tiket, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-100 rounded-lg p-3"
                        >
                          <div className="text-right">
                            <div className="font-bold  text-blue-700">
                              Rp{tiket.subtotal.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              x{tiket.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Harga Kendaraan */}
              {prices.filter((item) => item.class.type === "vehicle").length >
                0 && (
                <div>
                  <label className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3 lg:justify-end">
                    <span>Harga Tiket Kendaraan</span>
                  </label>
                  <div className="space-y-2">
                    {prices
                      .filter((item) => item.class.type === "vehicle")
                      .map((tiket, index) => (
                        <div
                          key={index}
                          className="bg-green-50 border border-green-100 rounded-lg p-3"
                        >
                          <div className="text-right">
                            <div className="font-bold text-lg text-green-700">
                              Rp{tiket.subtotal.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              @ Rp{tiket.class.class_name.toLocaleString()} x{" "}
                              {tiket.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Enhanced Footer */}
        <CardFooter className="border-t bg-gray-50 rounded-b-lg p-4 sm:p-6">
          <div className="w-full">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col sm:hidden space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Harga Total Tiket:</span>
                <span className="font-medium">
                  Rp{totalHargaPenumpang.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Harga Total Kendaraan:</span>
                <span className="font-medium">
                  Rp{totalHargaKendaraan.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg text-blue-600">
                  Rp
                  {(totalHargaPenumpang + totalHargaKendaraan).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Desktop: Side by side */}
            <div className="hidden sm:flex justify-between">
              <div className="space-y-2">
                <p className="text-gray-600">Harga Total Tiket:</p>
                <p className="text-gray-600">Harga Total Kendaraan:</p>
                <p className="font-bold text-lg pt-2 border-t border-gray-200">
                  Total:
                </p>
              </div>
              <div className="space-y-2 text-right">
                <p className="font-medium">
                  Rp{totalHargaPenumpang.toLocaleString()}
                </p>
                <p className="font-medium">
                  Rp{totalHargaKendaraan.toLocaleString()}
                </p>
                <p className="font-bold text-lg text-blue-600 pt-2 border-t border-gray-200">
                  Rp
                  {(totalHargaPenumpang + totalHargaKendaraan).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
