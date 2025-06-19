"use client";

import TiketSesi from "@/app/ui/verifikasi/tiketSection";
import Total from "@/app/ui/verifikasi/totalBayar";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BayarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("order_id");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
    };
    const handlePopState = (e: PopStateEvent) => {
      const confirmLeave = window.confirm(
        "Apakah Anda yakin ingin keluar dari halaman pembayaran? Progres Anda akan hilang."
      );

      if (confirmLeave) {
        router.replace("/");
      } else {
        history.pushState({ fromPayment: true }, "", window.location.href);
      }
    };

    // Tambahkan state hanya jika belum ada
    if (!history.state?.fromPayment) {
      history.pushState({ fromPayment: true }, "", window.location.href);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div>
      <div className="m-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-2 w-12 text-white font-bold flex justify-center items-center text-2xl">
          4
        </div>
        <div className="text-2xl font-semibold">Pembayaran</div>
      </div>
      <div className="flex justify-center flex-col-reverse md:flex-row items-start m-4 md:m-8 gap-4 reverse">
        <TiketSesi orderId={orderId || ""} />
        <Total orderId={orderId || ""} />
      </div>
    </div>
  );
}
