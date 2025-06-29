// app/(user)/(beranda)/book/[id]/verifikasi/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Data from "@/app/ui/verifikasi/data";
import TotalBayar from "./totalBayar";
import PaymentSelection from "./pembayaran";
import SessionTimer from "../sessionTimer";
import { getSessionById } from "@/service/session";
import { submitPassengerData } from "@/service/passenger";
import type { SessionData } from "@/types/session";
import { PassengerEntry, TicketEntryPayload } from "@/types/passenger";
import { ClaimSessionResponse } from "@/types/responBook";
import { AxiosResponse } from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation"; // ✅ Add useSearchParams
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Receipt,
  Eye,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Clock,
} from "lucide-react";

export default function VerifikasiPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams(); // ✅ Add useSearchParams hook
  const bookId = params?.id;

  // ✅ Extract session ID dari query parameter + sessionStorage
  const sessionIdFromQuery = searchParams?.get("session_id");
  const sessionIdFromStorage =
    typeof window !== "undefined" ? sessionStorage.getItem("session_id") : null;
  const finalSessionId = sessionIdFromQuery || sessionIdFromStorage;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  // ✅ Add submit states
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "idle" | "creating-order" | "creating-invoice" | "redirecting"
  >("idle");

  // ✅ States for form validation
  const [isPemesanDataValid, setIsPemesanDataValid] = useState(false);
  const [pemesanData, setPemesanData] = useState<any>(null);
  const [penumpangList, setPenumpangList] = useState<any[]>([]);
  const [kendaraanList, setKendaraanList] = useState<any[]>([]);

  // ✅ Fetch session data using getSessionById
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!finalSessionId) {
        console.error("❌ Session ID tidak ditemukan");
        setError("Session tidak ditemukan. Silakan booking ulang.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching session data with ID:", finalSessionId);
        setLoading(true);

        const response = await getSessionById(finalSessionId);

        if (response?.status && response?.data) {
          console.log("✅ Session data berhasil dimuat:", response?.data);
          setSession(response?.data);
          setError(null);

          // ✅ Update sessionStorage with latest session_id if from query
          if (sessionIdFromQuery && !sessionIdFromStorage) {
            sessionStorage.setItem("session_id", finalSessionId);
          }
        } else {
          throw new Error(response?.message || "Gagal mengambil data session");
        }
      } catch (error: any) {
        console.error("❌ Error fetching session:", error);

        if (
          error.message?.includes("Session expired") ||
          error.message?.includes("tidak ditemukan")
        ) {
          setSessionExpired(true);
          setError("Session telah berakhir atau tidak valid");
        } else {
          setError("Terjadi kesalahan saat memuat data session");
          toast.error("Gagal memuat data session");
        }
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [finalSessionId, sessionIdFromQuery, sessionIdFromStorage]);

  // ✅ Load passenger and vehicle data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("dataPenumpang");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const kendaraan = parsed.kendaraan || [];
        const penumpang = parsed.penumpang || [];

        const transformedPenumpang = penumpang.map((p: any) => ({
          nama: p.nama,
          kelas: p.kelas,
          usia: Number(p.usia),
          jk: p.jenis_kelamin ?? p.jk ?? "",
          id: p.id || 0,
          noID: p.nomor_identitas ?? p.noID ?? "",
          alamat: p.alamat,
          jenisID: p.jenis_id ?? p.jenisID ?? "",
          class_id: p.class_id,
          seat_number: p.seat_number,
        }));

        const transformedKendaraan = kendaraan.map((p: any) => ({
          nomor_polisi: p.nomor_polisi,
          kelas: p.kelas,
          class_id: p.class_id,
          nama: p.nama_kendaraan || p.nama,
          usia: p.umur || 21,
          alamat: p.alamat_kendaraan || p.alamat,
        }));

        setPenumpangList(transformedPenumpang);
        setKendaraanList(transformedKendaraan);

        console.log("📋 Data penumpang dan kendaraan dimuat:", {
          penumpang: transformedPenumpang.length,
          kendaraan: transformedKendaraan.length,
        });
      } catch (err) {
        console.error("❌ Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  // ✅ Handle session expiration
  useEffect(() => {
    if (session?.expires_at) {
      const expirationTime = new Date(session.expires_at).getTime();
      const now = Date.now();

      if (expirationTime <= now) {
        console.warn("⏰ Session sudah expired");
        setSessionExpired(true);
      }
    }
  }, [session]);

  const handleSessionExpired = () => {
    setSessionExpired(true);
    // ✅ Clear session storage saat expired
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("dataPenumpang");
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/book/${bookId}`);
    }, 2000);
  };

  // ✅ Handle form validation update from Data component
  const handleFormValidationChange = useCallback(
    (isValid: boolean, formData: any) => {
      console.log("📋 Form validation changed:", { isValid, formData });
      setIsPemesanDataValid(isValid);
      setPemesanData(formData);
    },
    []
  );

  // ✅ Handle submit trigger from Data component
  const handleSubmitTrigger = useCallback(() => {
    console.log("🎯 Submit triggered from Data component");

    if (!isPemesanDataValid) {
      toast.error("Lengkapi dan perbaiki data pemesan terlebih dahulu");
      return;
    }

    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    console.log("✅ All validations passed, opening confirmation");
    setOpenConfirm(true);
  }, [isPemesanDataValid, selectedPayment]);

  // ✅ Submit handler
  const handleSubmitAndRedirect = async () => {
    setOpenConfirm(false);
    setIsProcessing(true);

    if (!finalSessionId) {
      toast.error("Session ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    if (!pemesanData) {
      toast.error("Data pemesan tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    try {
      setProcessingStep("creating-order");

      const passengerData: PassengerEntry[] = penumpangList.map((p) => ({
        class_id: p.class_id,
        passenger_name: p.nama,
        passenger_gender: p.jk,
        passenger_age: p.usia,
        address: p.alamat,
        id_type: p.jenisID,
        id_number: p.noID,
        seat_number: p.seat_number,
      }));

      const vehicleData = kendaraanList.map((k) => ({
        class_id: k.class_id,
        license_plate: k.nomor_polisi,
        passenger_name: k.nama,
        passenger_age: k.usia,
        address: k.alamat,
      }));

      const ticketData = [...passengerData, ...vehicleData];

      const bookingPayload: TicketEntryPayload = {
        session_id: finalSessionId,
        customer_name: pemesanData.nama,
        payment_method: selectedPayment,
        phone_number: pemesanData.nohp,
        email: pemesanData.email,
        id_type: pemesanData.jenisID,
        id_number: pemesanData.noID,
        ticket_data: ticketData,
      };

      console.log("📤 Creating order with payload:", bookingPayload);

      setProcessingStep("creating-invoice");

      const orderResponse: AxiosResponse<ClaimSessionResponse> =
        await submitPassengerData(finalSessionId, bookingPayload);

      const referenceNumber = orderResponse.data.order_id;

      if (!referenceNumber) {
        throw new Error("Reference number tidak ditemukan dalam response");
      }

      console.log("✅ Order created with reference:", referenceNumber);

      setProcessingStep("redirecting");

      toast.success("Pesanan dan invoice berhasil dibuat!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ✅ Clear session storage setelah sukses
      sessionStorage.removeItem("session_id");
      sessionStorage.removeItem("dataPenumpang");

      const invoiceUrl = `/invoice/${referenceNumber}`;
      console.log("🔗 Redirecting to:", invoiceUrl);

      router.push(invoiceUrl);
    } catch (err: any) {
      console.error("❌ Error in order process:", err);

      if (err.response?.status === 400) {
        toast.error(
          "Data tidak valid. Silakan periksa kembali informasi Anda."
        );
      } else if (err.response?.status === 422) {
        toast.error("Sesi telah berakhir atau tidak valid. Silakan coba lagi.");
      } else if (err.response?.status === 500) {
        toast.error(
          "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi."
        );
      } else if (err.message?.includes("network")) {
        toast.error("Koneksi bermasalah. Periksa internet Anda dan coba lagi.");
      } else {
        toast.error("Terjadi kesalahan saat memproses pesanan.");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep("idle");
    }
  };

  // ✅ ProcessingSteps component
  const ProcessingSteps = () => {
    const steps = [
      {
        key: "creating-order",
        label: "Memproses pesanan...",
        icon: <CheckCircle className="w-4 h-4" />,
        description: "Menyimpan data penumpang dan kendaraan",
      },
      {
        key: "creating-invoice",
        label: "Membuat invoice pembayaran...",
        icon: <CreditCard className="w-4 h-4" />,
        description: "Memproses metode pembayaran yang dipilih",
      },
      {
        key: "redirecting",
        label: "Mengarahkan ke halaman invoice...",
        icon: <ArrowRight className="w-4 h-4" />,
        description: "Menyiapkan halaman pembayaran",
      },
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = processingStep === step.key;
          const isCompleted =
            steps.findIndex((s) => s.key === processingStep) > index;

          return (
            <div
              key={step.key}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-Blue/10 to-Blue/5 border-Blue/30 shadow-md"
                  : isCompleted
                  ? "bg-gradient-to-r from-green-50 to-green-25 border-green-200 shadow-sm"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-Blue to-Orange animate-pulse"></div>
              )}

              <div className="flex items-center gap-4 p-4">
                <div
                  className={`relative flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "text-Blue scale-110"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {isActive ? (
                    <div className="relative">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <div className="absolute inset-0 w-5 h-5 border-2 border-Blue/20 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-Blue"
                        : isCompleted
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-xs mt-1 transition-colors duration-300 ${
                      isActive
                        ? "text-Blue/70"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </div>
                </div>

                {isCompleted && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {isActive && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-Blue/10 rounded-full flex items-center justify-center border-2 border-Blue/30">
                      <div className="w-2 h-2 bg-Blue rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data verifikasi...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {error || "Session tidak ditemukan"}
          </h2>
          <p className="text-gray-500 mb-4">
            {sessionExpired
              ? "Session pemesanan Anda telah berakhir. Silakan mulai booking ulang."
              : "Terjadi kesalahan dalam memuat data session. Silakan coba lagi."}
          </p>
          <button
            onClick={() => router.push(`/book/${bookId}`)}
            className="bg-Blue text-white px-6 py-2 rounded-lg hover:bg-Blue/90 transition-colors"
          >
            Kembali ke Booking
          </button>
        </div>
      </div>
    );
  }

  // ✅ Session expired state
  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Session Berakhir
          </h2>
          <p className="text-gray-500 mb-4">
            Mengarahkan kembali ke halaman booking...
          </p>
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ✅ Header section */}
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-Blue to-Blue/90 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-semibold text-gray-900">
                  Verifikasi & Pembayaran
                </h1>
              </div>
            </div>

            {/* ✅ Session Timer */}
            {session.expires_at && (
              <SessionTimer
                expiresAt={session.expires_at}
                onExpired={handleSessionExpired}
                redirectTo={`/book/${bookId}`}
                className="shadow-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* ✅ Main Content with 3-column layout */}
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* ✅ Desktop Summary Section - Hidden on mobile */}
            <div className="xl:col-span-1 hidden xl:block">
              <div className="sticky top-8">
                <TotalBayar session={session} />
              </div>
            </div>

            {/* ✅ Data & Payment Section - 2 columns on desktop, full width on mobile */}
            <div className="xl:col-span-2 space-y-6">
              {/* ✅ Data Component */}
              <Data
                onFormValidationChange={handleFormValidationChange}
                // ✅ Pass session ID as prop
              />

              {/* ✅ Payment Selection Component */}
              <PaymentSelection
                selectedPayment={selectedPayment}
                onPaymentChange={setSelectedPayment}
                disabled={isProcessing}
                onSubmitTrigger={handleSubmitTrigger}
                isProcessing={isProcessing}
                isPemesanDataValid={isPemesanDataValid}
                session={session}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Dialog */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">
                  Konfirmasi Pemesanan
                </AlertDialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Pastikan semua data sudah benar
                </p>
              </div>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <p>
                  <strong>Sistem akan:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Membuat pesanan tiket untuk{" "}
                    {penumpangList.length + kendaraanList.length} item
                  </li>
                  <li>
                    Memproses pembayaran via <strong>{selectedPayment}</strong>
                  </li>
                  <li>Mengarahkan Anda ke halaman invoice untuk pembayaran</li>
                </ul>
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Setelah konfirmasi, pesanan tidak dapat dibatalkan
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel disabled={isProcessing} className="flex-1">
              Periksa Lagi
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitAndRedirect}
              disabled={isProcessing || !isPemesanDataValid || !selectedPayment}
              className={`flex-1 flex items-center gap-2 ${
                isProcessing || !isPemesanDataValid || !selectedPayment
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-Blue to-Blue/90 text-white hover:from-Blue/90 hover:to-Blue"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Ya, Buat Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Processing Dialog */}
      <AlertDialog open={isProcessing} onOpenChange={() => {}}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-Blue animate-spin" />
              </div>
              <div>
                <span>Memproses Pesanan</span>
                <p className="text-sm font-normal text-gray-600 mt-1">
                  Sedang membuat pesanan dan invoice pembayaran...
                </p>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-6">
            <ProcessingSteps />
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mx-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Tips</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Jangan tutup atau refresh halaman ini</li>
                  <li>• Proses ini biasanya memakan waktu 30-60 detik</li>
                  <li>
                    • Anda akan diarahkan ke halaman pembayaran setelah selesai
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
