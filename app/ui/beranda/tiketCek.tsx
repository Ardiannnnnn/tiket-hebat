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
  RefreshCw,
  Download,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Share2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CekTiket() {
  const [orderId, setOrderId] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showPaymentGuide, setShowPaymentGuide] = useState(false);

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

  const handleRefundConfirm = () => {
    setShowRefundDialog(false);

    // ✅ Add null check for bookingData and order_id
    if (!bookingData?.order_id) {
      toast.error("Data booking tidak ditemukan");
      return;
    }

    // ✅ Copy booking number to clipboard for easy access
    navigator.clipboard
      .writeText(bookingData.order_id) // Now TypeScript knows it's not undefined
      .then(() => {
        toast.success(
          "Anda akan diarahkan ke form! Siap untuk mengisi formulir."
        );
      })
      .catch(() => {
        toast.info("Jangan lupa catat nomor booking: " + bookingData.order_id);
      });

    // ✅ Open Google Form in new tab
    setTimeout(() => {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLScDU0MmMh-DTVHcCy8yhm1Hk2O0gHipK891EYpuVctVFrjp9w/viewform?usp=dialog",
        "_blank"
      );
    }, 500); // Small delay to show toast first
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
                              {bookingData.schedule.arrival_harbor.harbor_name}
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

            {/* ✅ Enhanced Action Buttons Section */}
            <div className="mt-6 space-y-4">
              {/* ✅ Primary Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {/* ✅ Refund Button */}
                <AlertDialog
                  open={showRefundDialog}
                  onOpenChange={setShowRefundDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Ajukan Refund
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>

                {/* ✅ Payment Guide Button - Show only when payment is pending */}
                {paymentData?.status !== "PAID" && (
                  <Dialog
                    open={showPaymentGuide}
                    onOpenChange={setShowPaymentGuide}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-Orange/30 text-Orange hover:bg-Orange/5 hover:border-Orange/50"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Panduan Pembayaran
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-Orange/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-Orange" />
                          </div>
                          <div>
                            <p className="text-xl text-Orange">
                              Panduan Pembayaran
                            </p>
                            <p className="text-sm text-gray-500 font-normal">
                              Langkah mudah untuk menyelesaikan pembayaran
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6 mt-4">
                        {/* ✅ Payment Method Info */}

                        {/* ✅ Payment Instructions based on method */}
                        <div className="space-y-4">
                          {paymentData?.qr_url ? (
                            // QR Code Instructions
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-Orange/20 rounded-full flex items-center justify-center text-xs font-medium text-Orange">
                                    1
                                  </div>
                                  <h4 className="font-semibold text-gray-800">
                                    Pembayaran via QR Code
                                  </h4>
                                </div>
                              </div>
                              <div className="p-4">
                                <ol className="space-y-2">
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      1
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Buka aplikasi mobile banking atau e-wallet
                                      Anda
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      2
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Pilih menu "Scan QR Code" atau "Bayar
                                      dengan QR"
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      3
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Scan QR Code yang tersedia di tiket Anda
                                    </span>
                                  </li>

                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      4
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Konfirmasi pembayaran dan simpan bukti
                                      transaksi
                                    </span>
                                  </li>
                                </ol>
                              </div>
                            </div>
                          ) : paymentData?.pay_code ? (
                            // Virtual Account Instructions
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-Orange/20 rounded-full flex items-center justify-center text-xs font-medium text-Orange">
                                    1
                                  </div>
                                  <h4 className="font-semibold text-gray-800">
                                    Pembayaran via Virtual Account
                                  </h4>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                                  <div className="text-center">
                                    <p className="text-sm text-blue-700 mb-1">
                                      Nomor Virtual Account:
                                    </p>
                                    <p className="font-mono font-bold text-lg text-blue-800">
                                      {paymentData.pay_code}
                                    </p>
                                  </div>
                                </div>
                                <ol className="space-y-2">
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      1
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Buka aplikasi mobile banking atau ATM
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      2
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Pilih menu "Transfer" atau "Bayar"
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      3
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Masukkan nomor Virtual Account:{" "}
                                      <strong>{paymentData.pay_code}</strong>
                                    </span>
                                  </li>

                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      4
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Konfirmasi dan selesaikan transaksi
                                    </span>
                                  </li>
                                </ol>
                              </div>
                            </div>
                          ) : paymentData?.pay_url ? (
                            // Payment Link Instructions
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-Orange/20 rounded-full flex items-center justify-center text-xs font-medium text-Orange">
                                    1
                                  </div>
                                  <h4 className="font-semibold text-gray-800">
                                    Pembayaran via Payment Link
                                  </h4>
                                </div>
                              </div>
                              <div className="p-4">
                                <ol className="space-y-2">
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      1
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Klik tombol "Bayar" pada QR Code section
                                      di atas
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      2
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Anda akan diarahkan ke halaman pembayaran
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      3
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Pilih metode pembayaran yang tersedia
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      4
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      Ikuti instruksi untuk menyelesaikan
                                      pembayaran
                                    </span>
                                  </li>
                                </ol>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                              <p className="text-gray-500">
                                Panduan pembayaran akan tersedia setelah metode
                                pembayaran dipilih
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ✅ Important Notes */}
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-amber-800 mb-2">
                                Catatan Penting:
                              </h4>
                              <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                                <li>
                                  Pastikan nominal pembayaran sesuai dengan yang
                                  tertera
                                </li>
                                <li>
                                  Simpan bukti pembayaran untuk keperluan
                                  konfirmasi
                                </li>
                                <li>
                                  Pembayaran akan otomatis terkonfirmasi dalam
                                  1-5 menit
                                </li>
                                <li>
                                  Waktu pembayaran tersisa:{" "}
                                  <strong>{countdown}</strong>
                                </li>
                                <li>
                                  Hubungi customer service jika ada kendala
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* ✅ Customer Service Info */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-800 mb-2">
                                Butuh Bantuan?
                              </h4>
                              <div className="text-sm text-blue-700 space-y-1">
                                <p>
                                  Email:{" "}
                                  <span className="font-medium">
                                    TiketHebat2@gmail.com
                                  </span>
                                </p>
                                <p>
                                  WhatsApp:{" "}
                                  <span className="font-medium">
                                    +62 812-3456-7890
                                  </span>
                                </p>
                                <p>Jam Operasional: 08:00 - 22:00 WIB</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* ✅ Secondary Action Buttons */}
            </div>

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

        {/* Refund Dialog - Hidden by default */}
        <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xl">Konfirmasi Pengajuan Refund</p>
                  {bookingData && (
                    <p className="text-sm text-gray-500 font-normal">
                      Booking #{bookingData.order_id}
                    </p>
                  )}
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 leading-relaxed space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 mb-2">
                        Sebelum melanjutkan, pastikan Anda memahami:
                      </p>
                      <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                        <li>
                          Refund hanya dapat diajukan maksimal 24 jam sebelum
                          keberangkatan
                        </li>

                        <li>Proses refund membutuhkan waktu 3-7 hari kerja</li>
                        <li>Tiket akan dibatalkan setelah refund disetujui</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ✅ Updated description for Google Form */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 mb-2">
                        Proses Pengajuan Refund:
                      </p>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>
                          • Anda akan diarahkan ke formulir pengajuan refund
                        </p>
                        <p>• Isi data dengan lengkap dan benar</p>
                        <p>
                          • Tim customer service akan memproses dalam 1x24 jam
                        </p>
                        <p>• Konfirmasi akan dikirim via email atau WhatsApp</p>
                      </div>
                    </div>
                  </div>
                </div>

                {bookingData && (
                  <p className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <strong>Nomor Booking Anda: {bookingData.order_id}</strong>
                    <br />
                    Pastikan menyimpan nomor ini untuk pengajuan refund.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 sm:justify-center">
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRefundConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Lanjutkan ke Formulir Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
