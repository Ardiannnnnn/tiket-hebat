"use client";
import CardPrice from "./cardPrice";
import FormData from "./formData";
import { poppins } from "@/app/ui/fonts";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { getSessionById, cancelSession } from "@/service/session";
import type { SessionData } from "@/types/session";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clearSessionCookie, getCookie, setSessionCookie } from "@/utils/cookies";
import { toast } from "sonner";

export default function Form() {
   const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const triggeredRef = useRef(false);
  const router = useRouter();
  const hasShownDialogRef = useRef(false);
  const params = useParams();
  const bookId = params?.id;

   // Validasi cookie dan ambil session
  useEffect(() => {
    if (!sessionId) {
      alert("Session ID tidak ditemukan.");
      router.push(`/book/${bookId}`);
      return;
    }

    const cookie = getCookie("session_id");

    // Set cookie jika belum ada
    if (!cookie) {
      setSessionCookie(sessionId);
    }

    // Jika cookie berbeda → redirect
    if (cookie && cookie !== sessionId) {
      toast("Sesi Anda telah berakhir, silakan mulai booking ulang.");
      router.push(`/book/${bookId}`);
      return;
    }

    // Ambil data sesi
    const fetchSession = async () => {
      try {
        const res = await getSessionById(sessionId);
        setSession(res?.data ?? null);
      } catch (error) {
        console.error("Gagal fetch session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    // Timer 5 menit
    const timer = setTimeout(() => {
      toast("Sesi habis, silakan booking ulang.");
      clearSessionCookie();
      router.push(`/book/${bookId}`);
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [sessionId, router, bookId]);

  // Handle tombol back
  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => {
      if (!hasShownDialogRef.current) {
        setShowDialog(true);
        hasShownDialogRef.current = true;
        history.pushState(null, "", location.href);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Batalkan sesi saat unload (tanpa hapus cookie)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session) {
        navigator.sendBeacon(
          "/api/cancel-session",
          JSON.stringify({ id: session.id })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  // Jika user tekan tombol "Keluar"
  const handleLeave = async () => {
    setShowDialog(false);
    if (session) {
      try {
        await cancelSession(session.id);
        clearSessionCookie();
      } catch (error) {
        console.error("Gagal membatalkan sesi:", error);
      }
    }
    if (bookId) {
      router.push(`/book/${bookId}`);
    } else {
      router.push("/");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Session tidak ditemukan.</p>;

  return (
    <>
      <div className={`${poppins.className} flex flex-col items-center gap-6`}>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="bg-Blue rounded-full p-1 w-10 text-white font-bold flex justify-center text-2xl">
            2
          </div>
          <p className="text-2xl font-semibold">Isi Data Diri</p>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-4 justify-center">
          <div className="flex justify-center m-2">
            <FormData session={session} />
          </div>
          <div className="flex justify-center m-2">
            <CardPrice session={session} />
          </div>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah yakin untuk keluar? Jika keluar maka sesi anda berakhir!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => (triggeredRef.current = false)}>
              Batal
            </AlertDialogCancel>
            <Button onClick={handleLeave}>Kembali ke halaman sebelumnya</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
