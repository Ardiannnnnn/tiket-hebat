"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { poppins } from "@/app/ui/fonts";
import { toast } from "sonner";

import CardPrice from "./cardPrice";
import FormData from "./formData";
import SessionTimer from "../sessionTimer";
import { getSessionById } from "@/service/session";
import { clearSessionCookie, getCookie, setSessionCookie } from "@/utils/cookies";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { SessionData } from "@/types/session";

export default function Form() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const bookId = params?.id;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Validate session and fetch data
  useEffect(() => {
    const validateAndFetchSession = async () => {
      if (!sessionId) {
        toast.error("Session ID tidak ditemukan");
        router.push(`/`);
        return;
      }

      const cookie = getCookie("session_id");
      
      if (!cookie) {
        setSessionCookie(sessionId);
      } else if (cookie !== sessionId) {
        toast.error("Sesi Anda telah berakhir");
        router.push(`/`);
        return;
      }

      try {
        const res = await getSessionById(sessionId);
        setSession(res?.data ?? null);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast.error("Gagal memuat data sesi");
      } finally {
        setLoading(false);
      }
    };

    validateAndFetchSession();
  }, [sessionId, bookId, router]);

  const handleSessionExpired = () => {
    setSessionExpired(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Session tidak ditemukan</h2>
          <p className="text-gray-500">Silakan booking ulang</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className={`${poppins.className} container mx-auto px-4`}>
        <div className="flex flex-col items-center gap-6 py-8">
          {/* ✅ Header with Timer */}
          <header className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-Blue rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h1 className="text-2xl font-semibold">Isi Data Diri</h1>
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

          <div className="flex flex-col-reverse justify-center md:items-start md:flex-row gap-8 w-full">
            <FormData session={session} />
            <CardPrice session={session} />
          </div>
        </div>
      </main>

      <AlertDialog open={sessionExpired}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h2 className="text-lg font-semibold">Maaf, sesi anda telah berakhir</h2>
            <p className="text-gray-500">
              Silakan booking ulang untuk melanjutkan pemesanan tiket.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              className="bg-Blue hover:bg-Blue/90"
              onClick={() => {
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