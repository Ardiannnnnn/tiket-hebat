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
  isModal?: boolean; // ✅ Add modal prop
}

export default function CardPrice({ session, isModal = false }: CardPriceProps) {
  // ✅ Simple sticky state for positioning only (disable if modal)
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (isModal) return; // ✅ Skip sticky behavior in modal

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 200;
      setIsSticky(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isModal]);

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
      // ✅ Conditional sticky positioning - disable if modal
      !isModal && "lg:sticky lg:top-4"
    )}>
      <Card className={cn(
        "text-sm py-0 gap-0",
        isModal ? "shadow-none border-0" : "shadow-lg" // ✅ Conditional styling
      )}>
        {/* ✅ Enhanced header for modal */}
        <CardHeader className={cn(
          "flex flex-col sm:flex-row sm:justify-between border-b p-4 sm:p-6 space-y-2 sm:space-y-0",
          isModal && "bg-gradient-to-r from-Blue/10 to-Orange/10 border-Blue/20 rounded-lg"
        )}>
          <CardTitle className="flex items-center gap-2 font-semibold text-gray-800">
            <MapPin className="w-5 h-5 text-blue-600" />
            Detail Keberangkatan
          </CardTitle>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Ship className="w-5 h-5" />
            <span className={cn(
              isModal && "text-sm md:text-base"
            )}>{kapal}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className={cn(
          "p-4 sm:p-6",
          isModal && "space-y-4"
        )}>
          {/* ✅ Enhanced Route and Schedule Section for modal */}
          <div className={cn(
            "bg-Orange/10 rounded-lg p-4 mb-6",
            isModal && "bg-gradient-to-r from-Blue/5 to-Orange/5 border border-Blue/10"
          )}>
            <div className={cn(
              "grid grid-cols-1",
              isModal ? "lg:grid-cols-1 space-y-4" : "lg:grid-cols-2"
            )}>
              {/* Route Info */}
              <div className="space-y-3 mb-3">
                <label className="flex items-center gap-2 text-Orange font-medium text-sm">
                  <MapPin className="w-4 h-4" />
                  Rute Keberangkatan
                </label>
                <div className="flex items-center gap-2 justify-start text-base font-semibold">
                  <span className={cn(
                    "text-gray-800 flex-1 text-center",
                    isModal ? "text-sm md:text-lg px-2" : "text-sm md:text-base md:px-4"
                  )}>
                    {keberangkatan.asal}
                  </span>
                  <div className={cn(
                    "flex items-center justify-center",
                    isModal && "mx-2"
                  )}>
                    <div className={cn(
                      "bg-Orange/20 rounded-full flex items-center justify-center",
                      isModal ? "w-10 h-10" : "w-8 h-8"
                    )}>
                      <Ship className={cn(
                        "text-Orange",
                        isModal ? "w-5 h-5" : "w-4 h-4"
                      )} />
                    </div>
                  </div>
                  <span className={cn(
                    "text-gray-800 flex-1 text-center",
                    isModal ? "text-sm md:text-lg px-2" : "text-sm md:text-base"
                  )}>
                    {keberangkatan.tujuan}
                  </span>
                </div>
              </div>

              {/* Schedule Info */}
              <div className={cn(
                "space-y-3",
                isModal ? "" : "lg:text-right"
              )}>
                <label className={cn(
                  "flex items-center gap-2 text-Orange font-medium text-sm",
                  !isModal && "lg:justify-end"
                )}>
                  <Calendar className="w-4 h-4" />
                  Jadwal Keberangkatan
                </label>
                <div className={cn(
                  "space-y-2",
                  !isModal && "lg:text-right"
                )}>
                  <div className={cn(
                    "flex items-center gap-2",
                    !isModal && "lg:justify-end"
                  )}>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={cn(
                      "font-semibold text-gray-800",
                      isModal && "text-sm md:text-base"
                    )}>
                      {keberangkatan.jadwal}
                    </span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-2",
                    !isModal && "lg:justify-end"
                  )}>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={cn(
                      "font-semibold text-gray-800",
                      isModal && "text-sm md:text-base"
                    )}>
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
              <div className={cn(
                "bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
                isModal ? "w-20 h-20" : "w-16 h-16"
              )}>
                <Users className={cn(
                  "text-gray-400",
                  isModal ? "w-10 h-10" : "w-8 h-8"
                )} />
              </div>
              <p className={cn(
                "text-gray-500",
                isModal && "text-base"
              )}>
                Belum ada tiket yang dipilih
              </p>
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
                  <div className={cn(
                    "bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3",
                    isModal && "bg-gradient-to-r from-blue-50 to-blue-25"
                  )}>
                    {claimItems
                      .filter((item) => item.class.type === "passenger")
                      .map((tiket, index) => (
                        <div key={index} className="space-y-2">
                          {/* Kelas dan Harga */}
                          <div className="flex justify-between items-center">
                            <span className={cn(
                              "font-semibold text-gray-800",
                              isModal && "text-sm md:text-base"
                            )}>
                              {tiket.class.class_name}
                            </span>
                            <span className={cn(
                              "font-semibold text-gray-800",
                              isModal && "text-sm md:text-base"
                            )}>
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
                  <div className={cn(
                    "bg-green-50 border border-green-100 rounded-lg p-4 space-y-3",
                    isModal && "bg-gradient-to-r from-green-50 to-green-25"
                  )}>
                    {claimItems
                      .filter((item) => item.class.type === "vehicle")
                      .map((tiket, index) => (
                        <div key={index} className="space-y-2">
                          {/* Kelas dan Harga */}
                          <div className="flex justify-between items-center">
                            <span className={cn(
                              "font-semibold text-gray-800",
                              isModal && "text-sm md:text-base"
                            )}>
                              {tiket.class.class_name}
                            </span>
                            <span className={cn(
                              "font-semibold text-gray-800",
                              isModal && "text-sm md:text-base"
                            )}>
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
          <CardFooter className={cn(
            "border-t bg-gray-50 rounded-b-lg p-4 sm:p-6",
            isModal && "bg-gradient-to-r from-Blue/5 to-Orange/5 border-Blue/10"
          )}>
            <div className="w-full">
              {/* Mobile: Stack vertically */}
              <div className={cn(
                "flex flex-col space-y-3",
                !isModal && "sm:hidden"
              )}>
                {totalHargaPenumpang > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Harga Total Tiket Penumpang:</span>
                    <span className={cn(
                      "font-medium",
                      isModal && "text-sm md:text-base"
                    )}>
                      Rp{totalHargaPenumpang.toLocaleString()}
                    </span>
                  </div>
                )}
                {totalHargaKendaraan > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Harga Total Kendaraan:
                    </span>
                    <span className={cn(
                      "font-medium",
                      isModal && "text-sm md:text-base"
                    )}>
                      Rp{totalHargaKendaraan.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className={cn(
                    "font-bold text-sm",
                    isModal && "text-base"
                  )}>Total:</span>
                  <span className={cn(
                    "font-bold text-lg text-blue-600",
                    isModal && "text-xl"
                  )}>
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

              {/* Desktop: Side by side - Only show if not modal */}
              {!isModal && (
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
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
