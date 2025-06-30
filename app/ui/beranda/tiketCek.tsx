// app/ui/beranda/tiketCek.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBookingById } from "@/service/invoice";
import { BookingData, BookingResponse } from "@/types/invoice";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import asdp from "@/public/image/asdp.png";
import { cn } from "@/lib/utils";
import { getPaymentTransactionDetail } from "@/service/payment";
import { PaymentTransactionDetail } from "@/types/paymentDetail";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  CreditCard,
  QrCode,
  Ship,
  Ticket,
  Timer,
  CheckCircle,
  AlertCircle,
  Hash,
} from "lucide-react";

export default function CekTiket() {
  const [orderId, setOrderId] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  const handleCekTiket = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const bookingResponse = await getBookingById(orderId);
      const bookingData: BookingData = bookingResponse.data;
      setBookingData(bookingData);

      const referenceNumber = bookingResponse.data.reference_number;
      if (referenceNumber) {
        const paymentResponse = await getPaymentTransactionDetail(
          referenceNumber
        );
        const paymentData: PaymentTransactionDetail = paymentResponse.data;
        setQrUrl(paymentData.qr_url);
        setPaymentData(paymentData);

        const interval = setInterval(() => {
          const now = Math.floor(Date.now() / 1000);
          const remainingTime = paymentData.expired_time - now;
          if (remainingTime <= 0) {
            clearInterval(interval);
            setCountdown("Waktu pembayaran telah habis");
          } else {
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;
            setCountdown(
              `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Tiket tidak ditemukan atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  function getTimeFromDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Timer className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Toaster />

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-400 mb-2">
            Cek Status Tiket
          </h1>
          <p className="text-gray-600">
            Masukkan nomor tiket untuk melihat detail pemesanan Anda
          </p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto mb-8">
          <div className="relative flex-1 w-full">
            <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Masukkan Nomor Order Pesanan Anda"
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-Orange focus:ring-Orange"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCekTiket()}
            />
          </div>
          <Button
            onClick={handleCekTiket}
            className="bg-Orange hover:bg-Orange/90 text-white px-8 h-12 text-lg font-medium"
            disabled={loading || !orderId.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengecek...
              </div>
            ) : (
              "Cek Tiket"
            )}
          </Button>
        </div>

        {/* Ticket Card */}
        {bookingData && (
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-md rounded-lg py-0 gap-0">
              {/* Header - Blue Theme */}
              <CardHeader className="border rounded-lg p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Ship className="w-8 h-8 text-Blue" />
                    </div>
                    <div>
                      <CardTitle className="md:text-2xl font-bold text-gray-600">
                        Tiket Hebat
                      </CardTitle>
                      <p className="text-Blue-100 text-sm mt-1">
                        Tiket Elektronik Resmi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={cn(
                        "px-3 py-1 text-sm font-medium border",
                        getStatusColor(paymentData?.status || "")
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(paymentData?.status || "")}
                        {paymentData?.status === "PAID"
                          ? "Sudah Dibayar"
                          : "Belum Dibayar"}
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Trip Information - Blue accent */}
                <div className="p-6 bg-Blue/10 border-b border-Blue/20">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Date & Order Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-Blue" />
                        <div>
                          <p className="text-sm text-Blue/80">
                            Tanggal Keberangkatan
                          </p>
                          <p className="font-semibold text-gray-600">
                            {new Date(
                              bookingData.schedule.departure_datetime
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-Blue" />
                        <div>
                          <p className="text-sm text-Blue/80">Nama Pemesan</p>
                          <p className="font-semibold text-gray-600">
                            {bookingData.customer_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Route & Time - Blue/Orange theme - RESPONSIVE FIX */}
                    <div className="lg:col-span-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4">
                        {/* Departure Section */}
                        <div className="flex-1 text-center">
                          <div className="flex items-center gap-2 mb-3 justify-center">
                            <MapPin className="w-4 h-4 text-Blue" />
                            <p className="text-sm text-Blue/80 font-medium">
                              Keberangkatan
                            </p>
                          </div>
                          <div className="bg-Blue/5 rounded-lg p-4 border border-Blue/20">
                            <p className="font-bold text-2xl md:text-xl text-Blue mb-2">
                              {getTimeFromDateTime(
                                bookingData.schedule.departure_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 text-sm md:text-base leading-tight">
                              {
                                bookingData.schedule.departure_harbor
                                  .harbor_name
                              }
                            </p>
                          </div>
                        </div>

                        {/* Ferry Connection - Hidden on mobile, show on md+ */}
                        <div className="hidden md:flex flex-col items-center mx-4 flex-shrink-0">
                          <Ship className="w-8 h-8 text-Blue mb-2" />
                          <div className="w-20 h-0.5 bg-Blue/50"></div>
                          <p className="text-xs text-Blue mt-2 font-medium">
                            Ferry
                          </p>
                        </div>

                        {/* Mobile Ferry Connection - Show only on mobile */}
                        <div className="flex md:hidden justify-center my-4">
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-8 bg-Blue/30"></div>
                            <Ship className="w-6 h-6 text-Blue my-2" />
                            <div className="w-0.5 h-8 bg-Orange/30"></div>
                          </div>
                        </div>

                        {/* Arrival Section */}
                        <div className="flex-1 text-center">
                          <div className="flex items-center gap-2 mb-3 justify-center">
                            <MapPin className="w-4 h-4 text-Orange" />
                            <p className="text-sm text-Orange/80 font-medium">
                              Kedatangan
                            </p>
                          </div>
                          <div className="bg-Orange/5 rounded-lg p-4 border border-Orange/20">
                            <p className="font-bold text-2xl md:text-xl text-Orange mb-2">
                              {getTimeFromDateTime(
                                bookingData.schedule.arrival_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 text-sm md:text-base leading-tight">
                              {
                                bookingData.schedule.arrival_harbor
                                  .harbor_name
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Passenger Tickets - Blue theme */}
                    {bookingData.tickets.some(
                      (item) => item.type === "passenger"
                    ) && (
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-Blue mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-Blue" />
                          Tiket Penumpang
                        </h3>
                        <div className="space-y-3">
                          {bookingData.tickets
                            .filter((item) => item.type === "passenger")
                            .map((ticket, index) => (
                              <div
                                key={index}
                                className="bg-Blue/10 border border-Blue/30 rounded-lg p-4"
                              >
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-Blue/80">
                                      Kelas
                                    </p>
                                    <p className="font-semibold text-gray-600">
                                      {ticket.class.class_name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-Blue/80">
                                      Kursi
                                    </p>
                                    <p className="font-semibold text-gray-600">
                                      {ticket.seat_number || "Tidak ada"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-Blue/80">
                                      Harga
                                    </p>
                                    <p className="font-semibold text-Orange">
                                      {formatPrice(ticket.price)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Vehicle Tickets - Orange theme */}
                    {bookingData.tickets.some(
                      (item) => item.type === "vehicle"
                    ) && (
                      <div
                        className={
                          bookingData.tickets.some(
                            (item) => item.type === "passenger"
                          )
                            ? ""
                            : "lg:col-span-2"
                        }
                      >
                        <h3 className="text-lg font-semibold text-Orange mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-Orange" />
                          Tiket Kendaraan
                        </h3>
                        <div className="space-y-3">
                          {bookingData.tickets
                            .filter((item) => item.type === "vehicle")
                            .map((ticket, index) => (
                              <div
                                key={index}
                                className="bg-Orange/10 border border-Orange/30 rounded-lg p-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-Orange/80">
                                      Jenis Kendaraan
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                      {ticket.class.class_name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-Orange/80">
                                      Harga
                                    </p>
                                    <p className="font-semibold text-Orange">
                                      {formatPrice(ticket.price)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* QR Code - Blue border */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-Blue/30">
                        <div className="text-center mb-4">
                          <QrCode className="w-6 h-6 text-Blue mx-auto mb-2" />
                          <p className="text-sm text-Blue font-medium">
                            {qrUrl
                              ? "QR Code Tiket"
                              : paymentData?.pay_url
                              ? "Checkout Link"
                              : "Nomor Virtual"}
                          </p>
                        </div>
                        {qrUrl ? (
                          <Image
                            width={150}
                            height={150}
                            src={qrUrl}
                            className="w-32 h-32 mx-auto"
                            alt="QR Code"
                          />
                        ) : paymentData?.pay_url ? (
                          <div className="w-32 h-32 bg-Orange/10 rounded-lg flex flex-col items-center justify-center p-3">
                            <div className="text-center space-y-2">
                              <div className="w-8 h-8 bg-Orange/20 rounded-full flex items-center justify-center mx-auto">
                                <CreditCard className="w-4 h-4 text-Orange" />
                              </div>
                              <p className="text-xs text-Orange/60">
                                Payment Link
                              </p>
                              <Button
                                onClick={() =>
                                  window.open(paymentData.pay_url, "_blank")
                                }
                                size="sm"
                                className="bg-Orange hover:bg-Orange/90 text-white text-xs px-2 py-1"
                              >
                                Bayar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-Blue/10 rounded-lg flex flex-col items-center justify-center p-3">
                            <div className="text-center space-y-2">
                              <div className="w-8 h-8 bg-Blue/20 rounded-full flex items-center justify-center mx-auto">
                                <Hash className="w-4 h-4 text-Blue" />
                              </div>
                              <p className="text-xs text-Blue/60">
                                Virtual Number
                              </p>
                              <p className="font-mono font-bold text-sm text-Blue leading-tight break-all">
                                {paymentData?.pay_code || bookingData.order_id}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Footer Information - Blue/Orange theme */}
                <div className="p-6 bg-gradient-to-r from-Blue/10 to-Orange/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Number - Blue theme */}
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        <Ticket className="w-4 h-4 text-Blue" />
                        <p className="text-sm text-Blue/80">Nomor Pemesanan</p>
                      </div>
                      <p className="font-mono font-bold text-lg text-Blue">
                        {bookingData.order_id}
                      </p>
                    </div>

                    {/* Payment Status */}
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <CreditCard className="w-4 h-4 text-Blue" />
                        <p className="text-sm text-Blue/80">
                          Status Pembayaran
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "px-4 py-2 text-sm font-medium border",
                          getStatusColor(paymentData?.status || "")
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(paymentData?.status || "")}
                          {paymentData?.status === "PAID"
                            ? "Sudah Dibayar"
                            : "Belum Dibayar"}
                        </div>
                      </Badge>
                    </div>

                    {/* Countdown - Orange theme */}
                    <div className="text-center md:text-right">
                      <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                        <Clock className="w-4 h-4 text-Orange" />
                        <p className="text-sm text-Orange/80">
                          Waktu Pembayaran
                        </p>
                      </div>
                      {paymentData?.status === "PAID" ? (
                        <p className="font-semibold text-green-600">
                          Sudah Dibayar
                        </p>
                      ) : (
                        <p className="font-mono font-bold text-Orange">
                          {countdown}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info - Blue/Orange gradient */}
            <div className="mt-6 text-center text-sm bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-lg p-4">
              <p className="text-Blue font-medium">
                Simpan tiket ini sebagai bukti sah perjalanan Anda
              </p>
              <p className="text-Orange font-medium">
                Tunjukkan QR Code saat boarding
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
