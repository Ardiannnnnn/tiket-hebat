"use client";

import { useEffect } from "react";

export default function BookingTestClient() {
  useEffect(() => {
    const storedId = sessionStorage.getItem("selectedid");
    console.log("📦 ID dari sessionStorage:", storedId);
  }, []);

  return <div>Silakan lihat console.</div>;
}
