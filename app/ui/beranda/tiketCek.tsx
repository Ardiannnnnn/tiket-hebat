// app/ui/beranda/tiketCek.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  HelpCircle,
  BookOpen,
  ChevronRight,
  Mail,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
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

// ✅ Add import for refund service
import {
  verifyRefundEligibility,
  RefundVerificationRequest,
} from "@/service/refund";

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

  // ✅ Add new states for verification
  const [verificationData, setVerificationData] = useState({
    orderId: "", // Will be auto-filled
    idNumber: "",
    email: "",
  });

  const [verificationErrors, setVerificationErrors] = useState({
    idNumber: false,
    email: false,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  // ✅ Replace the step state with tab state
  const [activeRefundTab, setActiveRefundTab] = useState("info");

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

  // ✅ Update getStatusColor function
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REFUND": // ✅ Add REFUND status
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  // ✅ Update getStatusIcon function
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Timer className="w-4 h-4" />;
      case "REFUND": // ✅ Add REFUND status icon
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // ✅ Update status display text
  <div className="flex items-center gap-1">
    {getStatusIcon(paymentData?.status || "")}
    {paymentData?.status === "PAID"
      ? "Sudah Dibayar"
      : paymentData?.status === "REFUND"
      ? "Sudah Direfund"
      : "Belum Dibayar"}
  </div>;

  // ✅ Update dialog change handler - Remove customerName
  const handleRefundDialogChange = (open: boolean) => {
    setShowRefundDialog(open);
    if (!open) {
      // Reset when closing
      setActiveRefundTab("info");
      setVerificationData({
        orderId: "",
        idNumber: "",
        email: "",
      });
      setVerificationErrors({
        idNumber: false,
        email: false,
      });
      setIsVerifying(false);
    } else {
      // Auto-fill order_id when opening
      if (bookingData?.order_id) {
        setVerificationData((prev) => ({
          ...prev,
          orderId: bookingData.order_id,
        }));
      }
    }
  };

  // ✅ Enhanced version with more detailed error handling
  const handleVerifyIdentity = async () => {
    if (!bookingData) return;

    setIsVerifying(true);

    // Reset errors
    setVerificationErrors({
      idNumber: false,
      email: false,
    });

    // Basic validation
    if (!verificationData.idNumber.trim()) {
      setVerificationErrors((prev) => ({ ...prev, idNumber: true }));
      setIsVerifying(false);
      toast.error("Nomor identitas harus diisi");
      return;
    }

    if (!verificationData.email.trim()) {
      setVerificationErrors((prev) => ({ ...prev, email: true }));
      setIsVerifying(false);
      toast.error("Email harus diisi");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(verificationData.email)) {
      setVerificationErrors((prev) => ({ ...prev, email: true }));
      setIsVerifying(false);
      toast.error("Format email tidak valid");
      return;
    }

    try {
      const requestData: RefundVerificationRequest = {
        order_id: bookingData.order_id,
        id_number: verificationData.idNumber.trim(),
        email: verificationData.email.trim().toLowerCase(),
      };

      console.log("🔄 Sending refund verification request:", requestData);

      const response = await verifyRefundEligibility(requestData);

      console.log("📥 Full API response:", response);

      // ✅ FIX: Check for success message in response
      const isSuccess =
        response.message &&
        (response.message.toLowerCase().includes("success") ||
          response.message.toLowerCase().includes("berhasil") ||
          response.message.toLowerCase().includes("refunded successfully"));

      if (isSuccess || (response.success && response.data?.eligible)) {
        console.log("✅ Detected success - proceeding with redirect");
        setIsVerifying(false);

        toast.success(
          "✅ Verifikasi berhasil! Anda akan diarahkan ke formulir refund."
        );
        handleRefundConfirm();
      } else {
        console.log("❌ Response indicates failure");
        setIsVerifying(false);

        const message = response.message || "Data verifikasi tidak sesuai";

        // Parse error message for specific field validation
        if (
          message.toLowerCase().includes("id_number") ||
          message.toLowerCase().includes("nomor identitas") ||
          message.toLowerCase().includes("identitas")
        ) {
          setVerificationErrors((prev) => ({ ...prev, idNumber: true }));
          toast.error("Nomor identitas tidak sesuai dengan data pemesanan");
        } else if (message.toLowerCase().includes("email")) {
          setVerificationErrors((prev) => ({ ...prev, email: true }));
          toast.error("Email tidak sesuai dengan data pemesanan");
        } else {
          toast.error(`❌ ${message}`);
        }
      }
    } catch (error: any) {
      console.error("💥 Refund verification error:", error);
      setIsVerifying(false);

      if (error.message?.includes("Network error")) {
        toast.error(
          "❌ Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        toast.error(
          "❌ Terjadi kesalahan saat memverifikasi data. Silakan coba lagi."
        );
      }
    }
  };

  const handleRefundConfirm = () => {
    setShowRefundDialog(false);

    if (!bookingData?.order_id) {
      toast.error("Data booking tidak ditemukan");
      return;
    }

    navigator.clipboard
      .writeText(bookingData.order_id)
      .then(() => {
        toast.success(
          "Anda akan diarahkan ke form! Siap untuk mengisi formulir."
        );
      })
      .catch(() => {
        toast.info("Jangan lupa catat nomor booking: " + bookingData.order_id);
      });

    setTimeout(() => {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLScDU0MmMh-DTVHcCy8yhm1Hk2O0gHipK891EYpuVctVFrjp9w/viewform?usp=dialog",
        "_blank"
      );
    }, 500);
  };

  // ✅ Add getPaymentStatus function ke tiketCek.tsx juga
  const getPaymentStatus = () => {
    // Prioritas: booking status dulu, baru payment status
    if (bookingData?.status === "REFUND") {
      return "REFUND";
    }
    return paymentData?.status || "PENDING";
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
                        getStatusColor(getPaymentStatus())
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(getPaymentStatus())}
                        {getPaymentStatus() === "PAID"
                          ? "Sudah Dibayar"
                          : getPaymentStatus() === "REFUND"
                          ? "Sudah Direfund"
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
                          getStatusColor(getPaymentStatus())
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(getPaymentStatus())}
                          {getPaymentStatus() === "PAID"
                            ? "Sudah Dibayar"
                            : getPaymentStatus() === "REFUND"
                            ? "Sudah Direfund"
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
              {/* ✅ Primary Action Buttons - Conditional Rendering */}
              <div
                className={cn(
                  "gap-3 max-w-lg mx-auto",
                  paymentData?.status === "PAID"
                    ? "grid grid-cols-1 md:grid-cols-2"
                    : "flex justify-center"
                )}
              >
                {/* ✅ Refund Button - Only show when PAID */}
                {getPaymentStatus() === "PAID" && (
                  <AlertDialog
                    open={showRefundDialog}
                    onOpenChange={handleRefundDialogChange}
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

                    <AlertDialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto p-0">
                      <AlertDialogHeader className="p-4">
                        <AlertDialogTitle className="flex items-start gap-2 md:gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-lg md:text-xl font-semibold">
                              Pengajuan Refund
                            </p>
                            {bookingData && (
                              <p className="text-xs md:text-sm text-gray-500 font-normal mt-1">
                                Booking #{bookingData.order_id}
                              </p>
                            )}
                          </div>
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-gray-600 p-4 md:p-6 pt-2">
                          {/* ✅ Tabs System for Organized Content */}
                          <Tabs
                            value={activeRefundTab}
                            onValueChange={setActiveRefundTab}
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                              <TabsTrigger
                                value="info"
                                className="flex items-center gap-1.5 md:gap-2 py-2 md:py-2.5 text-xs md:text-sm"
                              >
                                <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">
                                  Informasi
                                </span>
                                <span className="sm:hidden">Info</span>
                              </TabsTrigger>
                              <TabsTrigger
                                value="verify"
                                className="flex items-center gap-1.5 md:gap-2 py-2 md:py-2.5 text-xs md:text-sm"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">
                                  Verifikasi
                                </span>
                                <span className="sm:hidden">Verify</span>
                              </TabsTrigger>
                            </TabsList>

                            {/* ✅ Tab 1: Information - Responsive Updates */}
                            <TabsContent
                              value="info"
                              className="space-y-3 mt-4"
                            >
                              {/* Refund Policies */}
                              <div className="bg-amber-50 p-3 md:p-4 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-2 md:gap-3">
                                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-amber-800 mb-2 md:mb-3 text-sm md:text-base">
                                      Sebelum melanjutkan, pastikan Anda
                                      memahami:
                                    </p>
                                    <ul className="text-xs md:text-sm text-amber-700 space-y-1 md:space-y-2 list-disc pl-3 md:pl-4">
                                      <li>
                                        Refund hanya dapat diajukan maksimal 24
                                        jam sebelum keberangkatan
                                      </li>
                                      <li>
                                        Biaya administrasi 10% akan dipotong
                                        dari total pembayaran
                                      </li>
                                      <li>
                                        Proses refund membutuhkan waktu 3-7 hari
                                        kerja
                                      </li>
                                      <li>
                                        Tiket akan dibatalkan setelah refund
                                        disetujui
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Process Information */}
                              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-2 md:gap-3">
                                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-blue-800 mb-2 md:mb-3 text-sm md:text-base">
                                      Proses Pengajuan Refund:
                                    </p>
                                    <ol className="text-xs md:text-sm text-blue-700 space-y-1 md:space-y-2 list-decimal pl-5 md:pl-6">
                                      <li>
                                        Pastikan tiket Anda memenuhi syarat
                                        refund
                                      </li>
                                      <li>
                                        Klik tombol "Ajukan Refund" di bawah
                                      </li>
                                      <li>
                                        Isi formulir pengajuan refund dengan
                                        lengkap dan benar
                                      </li>
                                      <li>
                                        Kirimkan formulir dan tunggu konfirmasi
                                        dari kami
                                      </li>
                                    </ol>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            {/* ✅ Tab 2: Verification Form - Updated with only 3 fields */}
                            <TabsContent
                              value="verify"
                              className="space-y-3 md:space-y-4 mt-4"
                            >
                              {/* Security Notice */}
                              <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-200">
                                <div className="flex items-start gap-2 md:gap-3">
                                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-orange-800 mb-1 md:mb-2 text-sm md:text-base">
                                      Verifikasi Data Diperlukan
                                    </p>
                                    <p className="text-xs md:text-sm text-orange-700">
                                      Masukkan nomor identitas dan email yang
                                      sama dengan saat pemesanan tiket.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* ✅ FORM VERIFICATION INPUT - Only 3 fields */}
                              <div className="space-y-3 md:space-y-4">
                                {/* Order ID - Auto-filled & Read-only */}
                                <div className="space-y-1.5 md:space-y-2">
                                  <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-1.5 md:gap-2">
                                    <Ticket className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                                    <span>Nomor Booking</span>
                                  </label>
                                  <div className="relative">
                                    <Input
                                      type="text"
                                      value={verificationData.orderId}
                                      readOnly
                                      className="h-10 md:h-11 bg-gray-50 text-gray-600 text-sm  cursor-not-allowed"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                  </div>
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                                    <span>Nomor booking terisi otomatis</span>
                                  </p>
                                </div>

                                {/* ID Number & Email - Grid Layout */}
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                                  {/* ID Number Input */}
                                  <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-1.5 md:gap-2">
                                      <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                                      <span>
                                        Nomor Identitas{" "}
                                        <span className="text-red-500">*</span>
                                      </span>
                                    </label>
                                    <Input
                                      type="text"
                                      placeholder="Nomor KTP/SIM/Passport"
                                      value={verificationData.idNumber}
                                      onChange={(e) =>
                                        setVerificationData((prev) => ({
                                          ...prev,
                                          idNumber: e.target.value,
                                        }))
                                      }
                                      className={cn(
                                        "h-10 md:h-11 font-mono transition-colors text-sm",
                                        verificationErrors.idNumber &&
                                          "border-red-500 focus:border-red-500"
                                      )}
                                    />
                                    {verificationErrors.idNumber && (
                                      <p className="text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <span>
                                          Nomor identitas tidak sesuai dengan
                                          data pemesanan
                                        </span>
                                      </p>
                                    )}
                                  </div>

                                  {/* Email Input */}
                                  <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-1.5 md:gap-2">
                                      <Mail className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                                      <span>
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                      </span>
                                    </label>
                                    <Input
                                      type="email"
                                      placeholder="masukkan@email.com"
                                      value={verificationData.email}
                                      onChange={(e) =>
                                        setVerificationData((prev) => ({
                                          ...prev,
                                          email: e.target.value,
                                        }))
                                      }
                                      className={cn(
                                        "h-10 md:h-11 transition-colors text-sm",
                                        verificationErrors.email &&
                                          "border-red-500 focus:border-red-500"
                                      )}
                                    />
                                    {verificationErrors.email && (
                                      <p className="text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <span>
                                          Email tidak sesuai dengan data
                                          pemesanan
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Form Status - Updated for 2 fields only */}
                              {(verificationErrors.idNumber ||
                                verificationErrors.email) && (
                                <div className="bg-red-50 p-2.5 md:p-3 rounded-lg border border-red-200">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs md:text-sm text-red-700 font-medium">
                                      Data verifikasi tidak sesuai dengan data
                                      pemesanan
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Success Tips - Updated for 2 fields only */}
                              <div className="bg-blue-50 p-2.5 md:p-3 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-blue-700 font-medium mb-1">
                                      💡 Tips Verifikasi:
                                    </p>
                                    <ul className="text-xs text-blue-600 space-y-0.5 list-disc pl-3">
                                      <li>
                                        Masukkan nomor identitas tanpa spasi
                                        atau tanda baca
                                      </li>
                                      <li>
                                        Gunakan email yang sama dengan saat
                                        pemesanan
                                      </li>
                                      <li>
                                        Periksa kembali format email (contoh:
                                        nama@domain.com)
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className=" flex-col sm:flex-row sm:justify-center p-4">
                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 h-10 md:h-11 text-sm md:text-base order-2 sm:order-1">
                          Batal
                        </AlertDialogCancel>

                        {activeRefundTab === "info" ? (
                          <Button
                            onClick={() => setActiveRefundTab("verify")}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-10 md:h-11 text-sm md:text-base order-1 sm:order-2"
                          >
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="hidden sm:inline">
                                Lanjutkan Verifikasi
                              </span>
                              <span className="sm:hidden">Lanjutkan</span>
                            </div>
                          </Button>
                        ) : (
                          <Button
                            onClick={handleVerifyIdentity}
                            disabled={
                              isVerifying ||
                              !verificationData.idNumber.trim() ||
                              !verificationData.email.trim()
                            }
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed h-10 md:h-11 text-sm md:text-base order-1 sm:order-2"
                          >
                            {isVerifying ? (
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Memverifikasi...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">
                                  Verifikasi & Ajukan Refund
                                </span>
                                <span className="sm:hidden">
                                  Verifikasi & Ajukan
                                </span>
                              </div>
                            )}
                          </Button>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* ✅ Payment Guide Button - Show only when payment is pending */}
                {getPaymentStatus() !== "PAID" && getPaymentStatus() !== "REFUND" && (
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
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-amber-800 mb-2">
                                  Catatan Penting:
                                </h4>
                                <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                                  <li>
                                    Pastikan nominal pembayaran sesuai dengan
                                    yang tertera
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
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* ✅ Secondary Action Buttons */}
            </div>

            {/* Additional Info - Blue/Orange gradient */}
            <div className="mt-6 text-center text-sm bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-lg p-4">
              {paymentData?.status === "PAID" ? (
                <>
                  <p className="text-Blue font-medium">
                    Simpan tiket ini sebagai bukti sah perjalanan Anda
                  </p>
                  <p className="text-Orange font-medium">
                    Tunjukkan QR Code saat boarding
                  </p>
                </>
              ) : (
                <>
                  <p className="text-Orange font-medium">
                    Selesaikan pembayaran untuk mendapatkan tiket resmi
                  </p>
                  <p className="text-Blue font-medium">
                    Gunakan panduan pembayaran di atas untuk bantuan
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
