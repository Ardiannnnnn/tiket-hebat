"use client";

import Invoices from "@/app/ui/invoice/invoice";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const rawOrderId = params?.orderid; // Ambil orderId dari URL
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Jika Anda keluar, progress Anda akan terhapus.";
    };

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Jika Anda keluar, progress Anda akan terhapus. Apakah Anda yakin?"
      );
      if (confirmLeave) {
        router.push("/"); // Redirect ke halaman utama
      } else {
        router.push(`/invoice/${orderId}`); // Tetap di halaman ini
      }
    };

    // Tambahkan event listener untuk sebelum keluar dari halaman
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Hapus event listener saat komponen dilepas
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, orderId]);

  return <Invoices orderId={orderId} />;
}