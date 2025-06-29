// app/(user)/(beranda)/book/[id]/verifikasi/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react"; // ✅ Add useRef
import Data from "@/app/ui/verifikasi/data";
import TotalBayar from "./totalBayar";
import PaymentSelection from "./pembayaran"; // ✅ Import PaymentSelection
import SessionTimer from "../sessionTimer";
import { getCookie } from "@/utils/cookies";
import { getSessionById } from "@/service/session";
import { submitPassengerData } from "@/service/passenger"; // ✅ Import submit service
import type { SessionData } from "@/types/session";
import { PassengerEntry, TicketEntryPayload } from "@/types/passenger"; // ✅ Import types
import { ClaimSessionResponse } from "@/types/responBook"; // ✅ Import response type
import { AxiosResponse } from "axios"; // ✅ Import axios type
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const bookId = params?.id;

  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>(""); // ✅ Payment state di verifikasi

  // ✅ Add all missing refs
  const sessionTimeRef = useRef<Date | null>(null);
  const isValidatingRef = useRef(false);
  const pageLoadedRef = useRef(false); // ✅ Add this missing ref

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

  // ✅ Enhanced session validation helper
  const isSessionStillValid = useCallback((expiresAt: string): boolean => {
    try {
      const expireTime = new Date(expiresAt);
      const currentTime = new Date();
      const timeLeft = expireTime.getTime() - currentTime.getTime();
      
      // ✅ Add 30 second buffer to account for network delays
      const bufferTime = 30 * 1000; // 30 seconds
      
      console.log("⏰ Session validation:", {
        expireTime: expireTime.toISOString(),
        currentTime: currentTime.toISOString(),
        timeLeft: timeLeft,
        timeLeftMinutes: Math.floor(timeLeft / 60000),
        isValid: timeLeft > bufferTime
      });
      
      return timeLeft > bufferTime;
    } catch (error) {
      console.error("❌ Error validating session time:", error);
      return false;
    }
  }, []);

  // ✅ Enhanced session fetch with validation + scroll control
  useEffect(() => {
    const fetchSessionData = async () => {
      // ✅ Prevent multiple simultaneous validations
      if (isValidatingRef.current) {
        console.log("🔄 Session validation already in progress...");
        return;
      }

      try {
        console.log("🔍 Fetching session data for verifikasi...");
        isValidatingRef.current = true;

        // ✅ Get session ID from cookie
        const cookieSessionId = getCookie("session_id");

        if (!cookieSessionId) {
          console.log("❌ No session ID found in cookie");
          setError("Session tidak ditemukan. Silakan booking ulang.");
          return;
        }

        console.log("🍪 Session ID from cookie:", cookieSessionId);
        setSessionId(cookieSessionId);

        // ✅ Check if we have cached session time for quick validation
        if (sessionTimeRef.current) {
          const isStillValid = isSessionStillValid(sessionTimeRef.current.toISOString());
          if (!isStillValid) {
            console.log("⏰ Session expired based on cached time");
            setSessionExpired(true);
            return;
          }
        }

        // ✅ Fetch session data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await getSessionById(cookieSessionId, {
          signal: controller.signal,
          timeout: 8000 // ✅ Add timeout parameter
        });

        clearTimeout(timeoutId);

        console.log("📡 Session response:", response);

        if (!response?.data) {
          throw new Error("No session data received");
        }

        // ✅ Validate session expiry time
        if (response.data.expires_at) {
          sessionTimeRef.current = new Date(response.data.expires_at);
          
          const isStillValid = isSessionStillValid(response.data.expires_at);
          if (!isStillValid) {
            console.log("⏰ Session expired according to server time");
            setSessionExpired(true);
            return;
          }
        }

        setSession(response.data);
        setError(null);
        console.log("✅ Session data loaded for verifikasi:", response.data);

      } catch (error: any) {
        console.error("❌ Failed to fetch session:", error);

        // ✅ Enhanced error handling
        if (error.name === 'AbortError') {
          console.log("⏱️ Request timed out");
          setError("Koneksi timeout. Silakan coba lagi.");
        } else if (error.response?.status === 404 || error.response?.status === 410) {
          console.log("⏰ Session expired or not found");
          setSessionExpired(true);
          return;
        } else if (error.response?.status === 422) {
          console.log("⏰ Session invalid or expired");
          setSessionExpired(true);
          return;
        } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
          setError("Masalah koneksi. Periksa internet dan coba lagi.");
        } else {
          setError(error.message || "Gagal memuat data session");
        }

        // ✅ Don't show error toast on session expired - user will be redirected
        if (!sessionExpired) {
          toast.error("Gagal memuat data session. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
        isValidatingRef.current = false;
        pageLoadedRef.current = true; // ✅ Mark page as loaded
      }
    };

    fetchSessionData();
  }, [isSessionStillValid]);

  // ✅ Add scroll to top effect after loading
  useEffect(() => {
    if (!loading && pageLoadedRef.current) {
      // ✅ Scroll to top after content is loaded
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [loading]);

  // ✅ Prevent scroll restoration on mount
  useEffect(() => {
    // ✅ Disable scroll restoration for this page
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // ✅ Force scroll to top on mount
    window.scrollTo(0, 0);

    // ✅ Cleanup - restore scroll behavior
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // ✅ Enhanced session expired handler
  const handleSessionExpired = useCallback(() => {
    console.log("⏰ Session expired - redirecting...");
    setSessionExpired(true);
    
    // ✅ Clear session data
    sessionTimeRef.current = null;
    pageLoadedRef.current = false; // ✅ Reset page loaded state
    
    // ✅ Clear any error states
    setError(null);
    
    // ✅ Show toast notification
    toast.error("Sesi telah berakhir. Mengarahkan ke halaman booking...");
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/book/${bookId}`);
    }, 2000);
  }, [router, bookId]);

  // ✅ Add refresh handler for manual retry
  const handleRetryLoadSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    pageLoadedRef.current = false; // ✅ Reset page loaded state
    
    // ✅ Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ Trigger session fetch again
    const cookieSessionId = getCookie("session_id");
    if (cookieSessionId) {
      try {
        const response = await getSessionById(cookieSessionId, { 
          timeout: 5000 // 5 second timeout for retry
        });
        
        if (response?.data) {
          if (response.data.expires_at) {
            const isStillValid = isSessionStillValid(response.data.expires_at);
            if (!isStillValid) {
              setSessionExpired(true);
              return;
            }
            sessionTimeRef.current = new Date(response.data.expires_at);
          }
          setSession(response.data);
          setError(null);
          pageLoadedRef.current = true; // ✅ Mark as loaded after retry success
          toast.success("Data session berhasil dimuat!");
        } else {
          setError("Data session tidak ditemukan");
        }
      } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 410 || error.response?.status === 422) {
          setSessionExpired(true);
        } else {
          setError(error.message || "Gagal memuat data session");
          toast.error("Gagal memuat data session. Coba lagi.");
        }
      }
    } else {
      setError("Session tidak ditemukan di browser");
    }
    
    setLoading(false);
  }, [isSessionStillValid]);

  // ✅ Load passenger/vehicle data on mount
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
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  // ✅ Handle form validation update from Data component
  const handleFormValidationChange = useCallback(
    (isValid: boolean, formData: any) => {
      console.log("📋 Form validation changed:", { isValid, formData }); // ✅ Add logging
      setIsPemesanDataValid(isValid);
      setPemesanData(formData);
    },
    []
  ); // ✅ Empty dependency array

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
  }, [isPemesanDataValid, selectedPayment]); // ✅ Only depend on what's needed

  // ✅ Submit handler
  const handleSubmitAndRedirect = async () => {
    setOpenConfirm(false);
    setIsProcessing(true);

    if (!sessionId) {
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
        session_id: sessionId,
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
        await submitPassengerData(bookingPayload);

      const referenceNumber = orderResponse.data.order_id;

      if (!referenceNumber) {
        throw new Error("Reference number tidak ditemukan dalam response");
      }

      console.log("✅ Order created with reference:", referenceNumber);

      setProcessingStep("redirecting");

      toast.success("Pesanan dan invoice berhasil dibuat!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        toast.error("Gagal memproses pesanan. Silakan coba lagi.");
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
          <p className="text-sm text-gray-500">Mengambil data pemesanan Anda</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !session || !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "Data session tidak ditemukan"}
          </p>
          
          {/* ✅ Enhanced action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetryLoadSession}
              disabled={loading}
              className="w-full bg-Blue text-white px-6 py-3 rounded-lg hover:bg-Blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mencoba lagi...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Coba Lagi
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push(`/book/${bookId}`)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kembali ke Booking
            </button>
          </div>
          
          {/* ✅ Help text */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-1">Tips mengatasi masalah:</p>
                <ul className="space-y-1">
                  <li>• Pastikan koneksi internet stabil</li>
                  <li>• Jika sesi berakhir, ulangi proses booking</li>
                  <li>• Hindari refresh halaman berulang kali</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Enhanced session expired state
  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Sesi Telah Berakhir
          </h2>
          <p className="text-gray-500 mb-4">
            Waktu sesi booking Anda telah habis.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Mengarahkan kembali ke halaman booking...
          </p>
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* ✅ Manual redirect button */}
          <button
            onClick={() => router.push(`/book/${bookId}`)}
            className="text-sm text-Blue hover:text-Blue/80 underline"
          >
            Langsung ke halaman booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ✅ Header section - Add scroll anchor */}
      <div id="page-top" className="">
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
                <p className="text-sm text-gray-600">
                  Periksa data dan pilih metode pembayaran
                </p>
              </div>
            </div>

            {/* ✅ Session Timer */}
            {session?.expires_at && ( // ✅ Add optional chaining
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
                sessionId={sessionId}
                selectedPayment={selectedPayment}
                onFormValidationChange={handleFormValidationChange}
                isProcessing={isProcessing}
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
