"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { poppins } from "@/app/ui/fonts";
import { toast } from "sonner";

import CardPrice from "./cardPrice";
import FormData from "./formData";
import SessionTimer from "../sessionTimer";
import { getSessionById } from "@/service/session";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Receipt, Eye, Ship, Calendar, Clock, MapPin } from "lucide-react";
import type { SessionData } from "@/types/session";

export default function Form() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params?.id;

  // ✅ Get session ID dari multiple sources dengan fallback
  const sessionIdFromQuery = searchParams?.get("session_id");
  const sessionIdFromStorage =
    typeof window !== "undefined" ? sessionStorage.getItem("session_id") : null;
  const finalSessionId = sessionIdFromQuery || sessionIdFromStorage;

  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch session data using getSessionById
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!finalSessionId) {
        console.error("❌ Session ID tidak ditemukan");
        setError("Session ID tidak ditemukan. Silakan booking ulang.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching session data with ID:", finalSessionId);
        setLoading(true);

        const response = await getSessionById(finalSessionId);

        if (response?.status && response.data) {
          console.log("✅ Session data berhasil dimuat:", response.data);
          setSession(response.data);
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

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-gray-600">Memuat data session...</span>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {error || "Session tidak ditemukan"}
          </h2>
          <p className="text-gray-500 mb-4">
            {sessionExpired
              ? "Session pemesanan Anda telah berakhir. Silakan mulai booking ulang."
              : "Terjadi kesalahan dalam memuat data session. Silakan coba lagi."}
          </p>
          <Button
            onClick={() => router.push(`/book/${bookId}`)}
            className="bg-Blue hover:bg-Blue/90 text-white"
          >
            Kembali ke Booking
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Calculate total untuk mobile summary
  const claimItems = session.claim_items ?? [];
  const totalAmount = claimItems.reduce(
    (acc, item) => acc + (item.subtotal ?? 0),
    0
  );

  return (
    <>
      <main className={`${poppins.className} container mx-auto px-4`}>
        <div className="flex flex-col items-center gap-6 py-8">
          {/* ✅ Header with Timer */}
          <header className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-Blue rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Isi Data Diri</h1>
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
          </header>

          {/* ✅ Mobile Detail Sheet Trigger */}
          <div className="md:hidden w-full">
            <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-between bg-white border-2 border-Blue hover:bg-teal-600 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Ship className="text-Blue" />
                    <span className="font-medium text-gray-900">
                      Klik Untuk Detail Keberangkatan
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-Blue" />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[85vh] overflow-y-auto p-0"
              >
                <SheetTitle className="sr-only">
                  Detail Keberangkatan
                </SheetTitle>
                <div className="p-6">
                  <CardPrice session={session} isModal={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col-reverse justify-center md:items-start md:flex-row gap-8 w-full">
            {/* ✅ Pass session data sebagai props ke FormData */}
            <FormData session={session} />

            {/* ✅ Hide CardPrice on mobile, show only on desktop */}
            <div className="hidden md:block">
              <CardPrice session={session} />
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Session Expired Dialog */}
      <AlertDialog open={sessionExpired}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h2 className="text-lg font-semibold">
              Maaf, sesi Anda telah berakhir
            </h2>
            <p className="text-gray-500">
              Session pemesanan telah habis waktu. Silakan booking ulang untuk
              melanjutkan pemesanan tiket.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              className="bg-Blue hover:bg-Blue/90"
              onClick={() => {
                // ✅ Clear session storage saat expired
                sessionStorage.removeItem("session_id");
                sessionStorage.removeItem("dataPenumpang");
                setSessionExpired(false);
                router.push(`/book/${bookId}`);
              }}
            >
              Kembali ke Halaman Booking
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
