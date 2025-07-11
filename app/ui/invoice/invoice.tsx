"use client";

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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingData } from "@/types/invoice";
import { getBookingById } from "@/service/invoice";
import { getPaymentTransactionDetail } from "@/service/payment";
import { PaymentTransactionDetail } from "@/types/paymentDetail";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Ship,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  QrCode,
  CheckCircle,
  Timer,
  AlertCircle,
  XCircle,
  Hash,
  Copy,
  Ticket,
  Loader2,
  RefreshCw,
  Download,
  Share2,
  HelpCircle,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export default function Invoice({
  orderId: propOrderId,
}: {
  orderId?: string;
}) {
  const params = useParams();
  const rawOrderId = propOrderId || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showPaymentGuide, setShowPaymentGuide] = useState(false);

  const fetchPaymentStatus = async (referenceNumber: string) => {
    try {
      const paymentResponse = await getPaymentTransactionDetail(
        referenceNumber
      );
      const paymentData: PaymentTransactionDetail = paymentResponse.data;
      setQrUrl(paymentData.qr_url);
      setPaymentData(paymentData);
      return paymentData;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      return null;
    }
  };

  const handleManualRefresh = async () => {
    if (!booking?.reference_number) return;

    setIsRefreshing(true);
    try {
      const updatedPaymentData = await fetchPaymentStatus(
        booking.reference_number
      );
      if (updatedPaymentData?.status === "PAID") {
        toast.success("Pembayaran berhasil dikonfirmasi!");
      } else {
        toast.info("Status pembayaran diperbarui");
      }
    } catch (error) {
      toast.error("Gagal memperbarui status pembayaran");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      if (orderId) {
        try {
          const bookingResponse = await getBookingById(orderId);
          const bookingData: BookingData = bookingResponse.data;
          setBooking(bookingData);

          const referenceNumber = bookingResponse.data.reference_number;
          if (referenceNumber) {
            const paymentData = await fetchPaymentStatus(referenceNumber);

            if (paymentData) {
              // Auto-polling hanya jika belum dibayar
              if (paymentData.status !== "PAID") {
                pollInterval = setInterval(async () => {
                  const updatedPaymentData = await fetchPaymentStatus(
                    referenceNumber
                  );
                  if (updatedPaymentData?.status === "PAID") {
                    if (pollInterval) clearInterval(pollInterval);
                    toast.success(
                      "Pembayaran berhasil! Status otomatis diperbarui."
                    );
                  }
                }, 30000); // Check setiap 30 detik
              }

              // Setup countdown timer
              countdownInterval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000);
                const remainingTime = paymentData.expired_time - now;

                if (remainingTime <= 0) {
                  if (countdownInterval) clearInterval(countdownInterval);
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
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function yang benar
    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "UNPAID":
        return <Timer className="w-4 h-4" />;
      case "EXPIRED":
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleRefundConfirm = () => {
    setShowRefundDialog(false);
    // Navigate to refund page
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScDU0MmMh-DTVHcCy8yhm1Hk2O0gHipK891EYpuVctVFrjp9w/viewform?usp=dialog',
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-Blue font-medium">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Tidak Ditemukan
            </h3>
            <p className="text-gray-600">
              Data invoice tidak dapat dimuat. Silakan periksa kembali nomor
              pesanan Anda.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center m-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-Blue rounded-full flex items-center justify-center text-white font-bold text-xl">
              4
            </div>
            <h1 className="text-2xl font-semibold text-gray-600">
              Bukti Booking
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Invoice Card */}
            <div className="xl:col-span-2">
              <Card className="overflow-hidden bg-white py-0 gap-0 border">
                {/* Header - Blue Theme */}
                <CardHeader className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Ship className="w-8 h-8 text-Blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-600">
                          Tiket Hebat
                        </CardTitle>
                        <p className="text-Blue-100 text-sm">
                          Invoice Pembayaran Resmi
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
                  {/* Trip Information */}
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
                                booking.schedule.departure_datetime
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
                              {booking.customer_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Route & Time */}
                      {/* Route & Time */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                              <MapPin className="w-4 h-4 text-Blue" />
                              <p className="text-sm text-Blue/80">
                                Keberangkatan
                              </p>
                            </div>
                            <p className="font-bold text-xl text-Blue">
                              {getTimeFromDateTime(
                                booking.schedule.departure_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 mt-1">
                              {booking.schedule.departure_harbor.harbor_name}
                            </p>
                          </div>

                          <div className="flex flex-col items-center mx-4">
                            <Ship className="w-8 h-8 text-Blue mb-2" />
                            <div className=" w-0.5 h-8 lg:w-20 lg:h-0.5 bg-Blue/50"></div>
                            <p className="text-xs text-Blue mt-2 font-medium">
                              Ferry
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                              <MapPin className="w-4 h-4 text-Orange" />
                              <p className="text-sm text-Orange/80">
                                Kedatangan
                              </p>
                            </div>
                            <p className="font-bold text-xl text-Orange">
                              {getTimeFromDateTime(
                                booking.schedule.arrival_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 mt-1">
                              {booking.schedule.arrival_harbor.harbor_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Passenger Tickets */}
                      {booking.tickets.some(
                        (item) => item.type === "passenger"
                      ) && (
                        <div>
                          <h3 className="text-lg font-semibold text-Blue mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-Blue" />
                            Tiket Penumpang
                          </h3>
                          <div className="space-y-3">
                            {booking.tickets
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
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.class.class_name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Blue/80">
                                        Kursi
                                      </p>
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.seat_number || "Tidak ada"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Blue/80">
                                        Harga
                                      </p>
                                      <p className="font-semibold text-Orange text-sm md:text-base">
                                        {formatPrice(ticket.price)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Vehicle Tickets */}
                      {booking.tickets.some(
                        (item) => item.type === "vehicle"
                      ) && (
                        <div>
                          <h3 className="text-lg font-semibold text-Orange mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-Orange" />
                            Tiket Kendaraan
                          </h3>
                          <div className="space-y-3">
                            {booking.tickets
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
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.class.class_name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Orange/80">
                                        Harga
                                      </p>
                                      <p className="font-semibold text-Orange text-sm md:text-base">
                                        {formatPrice(ticket.price)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Footer Information */}
                  <div className="p-6 bg-gradient-to-r from-Blue/10 to-Orange/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Number */}
                      <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                          <Ticket className="w-4 h-4 text-Blue" />
                          <p className="text-sm text-Blue/80">
                            Nomor Pemesanan
                          </p>
                        </div>
                        <p className="font-mono font-bold text-lg text-Blue">
                          {booking.order_id}
                        </p>
                      </div>

                      {/* Countdown */}
                      <div className="text-center md:text-right">
                        <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                          <Clock className="w-4 h-4 text-Orange" />
                          <p className="text-sm text-Orange/80">
                            Status Pembayaran
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
              <div className="space-y-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* ✅ Download/Print Button */}
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    size="lg"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>

                  {/* ✅ Share Button */}
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Invoice ${booking.order_id}`,
                          text: `Invoice tiket kapal ferry - ${booking.order_id}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link invoice disalin ke clipboard!");
                      }
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan Invoice
                  </Button>
                </div>
                {/* Payment Guide Dialog - Only show when unpaid */}
              </div>
            </div>

            {/* Payment & Instructions Sidebar */}
            <div className="space-y-6">
              {/* ✅ Enhanced Payment Method Card */}
              <Card
                className={cn(
                  "overflow-hidden border-2",
                  paymentData?.status === "PAID"
                    ? "border-green-300 bg-green-50/50"
                    : "border-Blue/30"
                )}
              >
                <CardHeader
                  className={cn(
                    "border-b p-4",
                    paymentData?.status === "PAID"
                      ? "bg-green-100 border-green-200"
                      : "bg-Blue/10 border-Blue/20"
                  )}
                >
                  <CardTitle
                    className={cn(
                      "text-lg flex items-center gap-2",
                      paymentData?.status === "PAID"
                        ? "text-green-700"
                        : "text-Blue"
                    )}
                  >
                    {paymentData?.status === "PAID" ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Pembayaran Selesai
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5" />
                        Metode Pembayaran
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {(() => {
                    // ✅ Prioritas pertama: Cek status PAID
                    if (paymentData?.status === "PAID") {
                      return (
                        <div className="text-center space-y-4">
                          {/* ✅ Success Icon and Message */}
                          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-green-800 text-lg mb-1">
                                  Pembayaran Berhasil
                                </h3>
                                <p className="text-sm text-green-600">
                                  Transaksi telah dikonfirmasi dan tiket Anda
                                  siap digunakan
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* ✅ Payment Confirmation Details */}
                          <div className="bg-white rounded-lg p-4 border border-green-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Status:
                              </span>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-700">
                                  Lunas
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // ✅ Status belum bayar - tampilkan metode pembayaran
                    const isQRPayment = paymentData?.qr_url;
                    const isVAPayment =
                      paymentData?.pay_code && !paymentData?.qr_url;
                    const isRedirectPayment =
                      paymentData?.pay_url &&
                      !paymentData?.qr_url &&
                      !paymentData?.pay_code;

                    if (isQRPayment && paymentData?.qr_url) {
                      return (
                        <div className="text-center space-y-4">
                          <div className="bg-white p-4 rounded-lg border-2 border-Blue/20 mb-4">
                            <Image
                              width={200}
                              height={200}
                              src={paymentData.qr_url}
                              className="w-40 h-40 mx-auto"
                              alt="QR Code untuk Pembayaran"
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Scan dengan aplikasi mobile banking atau e-wallet
                          </p>

                          {/* ✅ Refresh Status Button */}
                          <Button
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="w-full bg-Blue hover:bg-Blue/90 text-white"
                            size="sm"
                          >
                            {isRefreshing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memperbarui Status...
                              </>
                            ) : (
                              <>
                                <Timer className="w-4 h-4 mr-2" />
                                Perbarui Status Pembayaran
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    } else if (isVAPayment) {
                      return (
                        <div className="text-center space-y-4">
                          <div className="bg-Blue/5 rounded-lg p-4 border border-Blue/20">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-Blue" />
                              <p className="text-sm text-Blue/80">
                                Nomor Virtual Account
                              </p>
                            </div>
                            <p className="font-mono font-bold text-lg text-Blue tracking-wider">
                              {paymentData.pay_code}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  paymentData.pay_code
                                );
                                toast.success("Nomor Virtual Account disalin!");
                              }}
                              className="w-full bg-Orange hover:bg-Orange/90 text-white"
                              size="sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Salin Nomor
                            </Button>

                            {/* ✅ Refresh Status Button */}
                            <Button
                              onClick={handleManualRefresh}
                              disabled={isRefreshing}
                              variant="outline"
                              className="w-full border-Blue text-Blue hover:bg-Blue/5"
                              size="sm"
                            >
                              {isRefreshing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Memperbarui Status...
                                </>
                              ) : (
                                <>
                                  <Timer className="w-4 h-4 mr-2" />
                                  Perbarui Status Pembayaran
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    } else if (isRedirectPayment) {
                      return (
                        <div className="text-center space-y-4">
                          <div className="bg-Orange/5 rounded-lg p-4 border border-Orange/20">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-Orange" />
                              <p className="text-sm text-Orange/80">
                                Halaman Checkout
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Klik tombol di bawah untuk melanjutkan pembayaran
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Button
                              onClick={() => {
                                window.open(paymentData.pay_url, "_blank");
                              }}
                              className="w-full bg-gradient-to-r from-Orange to-Orange/90 hover:from-Orange/90 hover:to-Orange text-white"
                              size="lg"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Lanjutkan Pembayaran
                            </Button>

                            <p className="text-xs text-gray-500 mb-2">
                              Anda akan diarahkan ke halaman pembayaran
                            </p>

                            {/* ✅ Refresh Status Button */}
                            <Button
                              onClick={handleManualRefresh}
                              disabled={isRefreshing}
                              variant="outline"
                              className="w-full border-Orange text-Orange hover:bg-Orange/5"
                              size="sm"
                            >
                              {isRefreshing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Memperbarui Status...
                                </>
                              ) : (
                                <>
                                  <Timer className="w-4 h-4 mr-2" />
                                  Perbarui Status Pembayaran
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center text-gray-500 py-8">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>Informasi pembayaran sedang dimuat...</p>
                        </div>
                      );
                    }
                  })()}
                </CardContent>
              </Card>

              {/* ✅ Add Payment Guide Button in sidebar - Only show when unpaid */}
              {paymentData?.status !== "PAID" && (
                <Dialog
                  open={showPaymentGuide}
                  onOpenChange={setShowPaymentGuide}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-Orange/30 text-Orange hover:bg-Orange/5 hover:border-Orange/50"
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
                      <div className="bg-Orange/10 rounded-lg p-4 border border-Orange/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-Orange/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-Orange" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-Orange">
                              Metode Pembayaran Anda
                            </h3>
                            <p className="text-sm text-Orange/80">
                              {paymentData?.qr_url
                                ? "QR Code Payment"
                                : paymentData?.pay_code
                                ? "Virtual Account"
                                : "Redirect Payment"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ✅ Payment Instructions */}
                      <div className="space-y-4">
                        {paymentData?.instructions.map((instruction, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-Orange/20 rounded-full flex items-center justify-center text-xs font-medium text-Orange">
                                  {index + 1}
                                </div>
                                <h4 className="font-semibold text-gray-800">
                                  {instruction.title}
                                </h4>
                              </div>
                            </div>
                            <div className="p-4">
                              <ol className="space-y-2">
                                {instruction.steps.map((step, stepIndex) => (
                                  <li
                                    key={stepIndex}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="flex-shrink-0 w-5 h-5 bg-Orange/10 rounded-full flex items-center justify-center text-xs font-medium text-Orange mt-0.5">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      {step}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
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
                                Pembayaran akan otomatis terkonfirmasi dalam 1-5
                                menit
                              </li>
                              <li>Hubungi customer service jika ada kendala</li>
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

              {/* ✅ MOVED: Refund Button - Now above payment guide */}
              <AlertDialog
                open={showRefundDialog}
                onOpenChange={setShowRefundDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ajukan Refund
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[500px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xl">Konfirmasi Pengajuan Refund</p>
                        <p className="text-sm text-gray-500 font-normal">
                          Booking #{booking.order_id}
                        </p>
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
                                Refund hanya dapat diajukan maksimal 24 jam
                                sebelum keberangkatan
                              </li>
                             
                              <li>
                                Proses refund membutuhkan waktu 3-7 hari kerja
                              </li>
                              <li>
                                Tiket akan dibatalkan setelah refund disetujui
                              </li>
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
                              <p>• Anda akan diarahkan ke formulir pengajuan refund</p>
                              <p>• Isi data dengan lengkap dan benar</p>
                              <p>• Tim customer service akan memproses dalam 1x24 jam</p>
                              <p>• Konfirmasi akan dikirim via email atau WhatsApp</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Nomor Booking Anda: {booking.order_id}</strong>
                        <br />
                        Pastikan menyimpan nomor ini untuk pengajuan refund.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3">
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

              {/* ✅ Enhanced Status Notice */}
              {paymentData?.status === "PAID" ? (
                // Success Notice for Paid Status
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-800">
                        Transaksi Berhasil
                      </p>
                    </div>
                    <p className="text-sm text-green-700">
                      Invoice ini adalah bukti pembayaran resmi yang sah.
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Simpan dan tunjukkan saat check-in di pelabuhan.
                    </p>
                  </div>
                </div>
              ) : (
                // Pending Payment Notice
                <div className="bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-lg p-4">
                  <div className="text-center text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer className="w-4 h-4 text-Orange" />
                      <p className="font-medium text-Blue">
                        Menunggu Pembayaran
                      </p>
                    </div>
                    <p className="text-Blue font-medium">
                      Selesaikan pembayaran untuk mengaktifkan tiket
                    </p>
                    <p className="text-Orange font-medium">
                      Waktu tersisa: {countdown}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
