"use client";

import FormDataUI from "@/app/ui/form/form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FormData() {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
    };

    const handlePopState = (e: PopStateEvent) => {
      const confirmLeave = window.confirm(
        "Jika Anda keluar, progres Anda akan dihapus. Lanjutkan?"
      );

      if (confirmLeave) {
        router.replace("/");
      } else {
        history.pushState({ fromForm: true }, "", window.location.href);
      }
    };

    // Tambahkan state hanya jika belum ada
    if (!history.state?.fromForm) {
      history.pushState({ fromForm: true }, "", window.location.href);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return <FormDataUI />;
}
