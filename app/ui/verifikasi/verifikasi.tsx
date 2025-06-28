// app/(user)/(beranda)/book/[id]/verifikasi/page.tsx
"use client";

import { useEffect, useState } from "react";
import Data from "@/app/ui/verifikasi/data";
import TotalBayar from "./totalBayar";
import SessionTimer from "../sessionTimer";
import { getCookie } from "@/utils/cookies";
import { getSessionById } from "@/service/session";
import type { SessionData } from "@/types/session";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifikasiPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id;
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // ✅ Get session data from cookie (same as form.tsx)
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        console.log("🔍 Fetching session data for verifikasi...");

        // ✅ Get session ID from cookie
        const cookieSessionId = getCookie("session_id");

        if (!cookieSessionId) {
          console.log("❌ No session ID found in cookie");
          setError("Session tidak ditemukan. Silakan booking ulang.");
          toast.error("Session tidak ditemukan. Silakan booking ulang.");
          return;
        }

        console.log("🍪 Session ID from cookie:", cookieSessionId);
        setSessionId(cookieSessionId);

        // ✅ Fetch session data
        const response = await getSessionById(cookieSessionId);

        console.log("📡 Session response:", response);

        if (!response?.data) {
          throw new Error("No session data received");
        }

        setSession(response.data);
        console.log("✅ Session data loaded for verifikasi:", response.data);
      } catch (error: any) {
        console.error("❌ Failed to fetch session:", error);
        setError(error.message || "Gagal memuat data session");
        toast.error("Gagal memuat data session. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  const handleSessionExpired = () => {
    setSessionExpired(true);
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/book/${bookId}`);
    }, 2000);
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
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-500 mb-4">
            {error || "Data session tidak ditemukan"}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-Blue text-white px-6 py-2 rounded-lg hover:bg-Blue/90 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ✅ Enhanced Header with Timer */}
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-4">
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

      {/* ✅ Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Summary Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <TotalBayar session={session} />
              </div>
            </div>
            
            {/* Data & Payment Section */}
            <div className="xl:col-span-2">
              <Data sessionId={sessionId} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Session Expired Modal/Alert could be added here if needed */}
    </div>
  );
}