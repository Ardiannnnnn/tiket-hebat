// app/(dashboard)/uploadJadwal/create/page.tsx
"use client";

import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getShips } from "@/service/shipService";
import { createSchedule } from "@/service/schedule";
import { getHarbors } from "@/service/harborService";

interface SelectOption {
  value: number;
  label: string;
}

export default function CreatePage() {
  const [harbors, setHarbors] = useState<SelectOption[]>([]);
  const [ships, setShips] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🚀 Fetching harbors and ships data...");
        
        const [harborRes, shipRes] = await Promise.all([
          getHarbors(1, 100),
          getShips(1, 100),
        ]);

        console.log("📊 Harbor response:", harborRes);
        console.log("🚢 Ship response:", shipRes);

        if (!harborRes?.data || !shipRes?.data) {
          throw new Error("Failed to fetch data");
        }

        // ✅ Transform harbor data for select options
        const harborOptions = harborRes.data.map((harbor) => ({
          value: harbor.id,
          label: harbor.harbor_name
        }));

        // ✅ Transform ship data for select options
        const shipOptions = shipRes.data.map((ship) => ({
          value: ship.id,
          label: ship.ship_name,
        }));

        console.log("🏰 Harbor options:", harborOptions);
        console.log("🚢 Ship options:", shipOptions);

        setHarbors(harborOptions);
        setShips(shipOptions);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Gagal memuat data pelabuhan dan kapal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      console.log("📝 Form data received:", data);
      
      // ✅ Parse dan validasi data
      const departure_harbor_id = parseInt(data.departure_harbor_id);
      const arrival_harbor_id = parseInt(data.arrival_harbor_id);
      const ship_id = parseInt(data.ship_id);
      const departureDate = new Date(data.departure_datetime);
      const arrivalDate = new Date(data.arrival_datetime);

      // Validasi data
      if (
        isNaN(departure_harbor_id) ||
        isNaN(arrival_harbor_id) ||
        isNaN(ship_id) ||
        isNaN(departureDate.getTime()) ||
        isNaN(arrivalDate.getTime())
      ) {
        toast.error("Data tidak valid. Pastikan semua field terisi dengan benar.");
        return false;
      }

      // Validasi pelabuhan asal dan tujuan tidak sama
      if (departure_harbor_id === arrival_harbor_id) {
        toast.error("Pelabuhan asal dan tujuan tidak boleh sama");
        return false;
      }

      // Validasi waktu keberangkatan tidak lebih awal dari sekarang
      if (departureDate <= new Date()) {
        toast.error("Waktu keberangkatan harus di masa depan");
        return false;
      }

      // Validasi waktu tiba setelah waktu keberangkatan
      if (arrivalDate <= departureDate) {
        toast.error("Waktu tiba harus setelah waktu keberangkatan");
        return false;
      }

      // ✅ Buat payload yang benar
      const payload = {
        departure_harbor_id,
        arrival_harbor_id,
        ship_id,
        departure_datetime: departureDate.toISOString(),
        arrival_datetime: arrivalDate.toISOString(),
        status: data.status || "SCHEDULED",
      };

      console.log("📤 Payload to send:", payload);

      const success = await createSchedule(payload);

      if (success) {
        toast.success("Jadwal berhasil dibuat!");
        // ✅ Optional: redirect or reset form
        // router.push('/uploadJadwal');
      } else {
        toast.error("Gagal membuat jadwal");
      }

      return success;
    } catch (error) {
      console.error("❌ Error saat membuat jadwal:", error);
      toast.error("Terjadi kesalahan saat membuat jadwal");
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pelabuhan dan kapal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Jadwal Baru</h1>
      <CreatePageDynamic
        type="uploadJadwal"
        onSubmit={handleSubmit}
        options={{
          departure_harbor_id: harbors, // ✅ Data pelabuhan untuk dropdown asal
          arrival_harbor_id: harbors,   // ✅ Data pelabuhan untuk dropdown tujuan
          ship_id: ships,               // ✅ Data kapal untuk dropdown
        }}
      />
    </div>
  );
}