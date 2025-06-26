// app/(dashboard)/kapasitasTiket/create/page.tsx
"use client";

import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { getKelas } from "@/service/kelas";
import { getScheduleAll } from "@/service/schedule";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createKapasitas } from "@/service/kapasitas";

interface SelectOption {
  value: number;
  label: string;
}

export default function CreateKapasitasTiket() {
  const [schedules, setSchedules] = useState<SelectOption[]>([]);
  const [kelas, setKelas] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching schedules and classes...");
        
        const [scheduleRes, classRes] = await Promise.all([
          getScheduleAll(1, 100), // Get all schedules
          getKelas(1, 100),       // Get all classes
        ]);

        console.log("📊 Schedule response:", scheduleRes);
        console.log("📊 Class response:", classRes);

        if (!scheduleRes?.data || !classRes?.data) {
          throw new Error("Failed to fetch data");
        }

        // ✅ Transform schedule data sesuai response structure
        const scheduleOptions = scheduleRes.data.map((schedule: any) => ({
          value: schedule.id,
          label: `${schedule.ship?.ship_name || 'Unknown Ship'} - ${schedule.departure_harbor?.harbor_name || 'Unknown'} - ${schedule.arrival_harbor?.harbor_name || 'Unknown'}`,
        }));

        // ✅ Transform class data sesuai response structure
        const classOptions = classRes.data.map((kelas: any) => ({
          value: kelas.id,
          label: `${kelas.class_name} - ${kelas.type}`,
        }));

        console.log("🚢 Schedule options:", scheduleOptions);
        console.log("🎫 Class options:", classOptions);

        setSchedules(scheduleOptions);
        setKelas(classOptions);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Gagal memuat data jadwal dan kelas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      console.log("📝 Form data received:", data);

      // ✅ Parse data sesuai response structure
      const payload = {
        schedule_id: parseInt(data.schedule_id),
        class_id: parseInt(data.class_id), // Assuming ship_id is part of the form data
        quota: parseInt(data.quota),
        price: parseInt(data.price)
      };

      console.log("📤 Payload to send:", payload);

      // ✅ Validasi data
      if (
        isNaN(payload.schedule_id) ||
        isNaN(payload.class_id) ||
        isNaN(payload.quota) ||
        isNaN(payload.price)
      ) {
        toast.error("Semua field harus diisi dengan benar");
        return false;
      }

      if (payload.quota <= 0) {
        toast.error("Kuota harus lebih dari 0");
        return false;
      }

      if (payload.price <= 0) {
        toast.error("Harga harus lebih dari 0");
        return false;
      }

      const success = await createKapasitas(payload);

      if (success) {
        toast.success("Kapasitas tiket berhasil dibuat!");
        // Optional: redirect to list page
        // setTimeout(() => {
        //   window.location.href = "/kapasitas";
        // }, 1500);
      } else {
        toast.error("Gagal membuat kapasitas tiket");
      }

      return success;
    } catch (error) {
      console.error("❌ Error saat membuat kapasitas tiket:", error);
      toast.error("Terjadi kesalahan saat membuat kapasitas tiket");
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data jadwal dan kelas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Kapasitas Tiket</h1>
      <CreatePageDynamic
        type="kapasitasTiket"
        onSubmit={handleSubmit}
        options={{
          schedule_id: schedules, // ✅ Data jadwal untuk dropdown
          class_id: kelas,       // ✅ Data kelas untuk dropdown
        }}
      />
    </div>
  );
}