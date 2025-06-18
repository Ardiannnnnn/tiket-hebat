"use client";

import CreatePage from "@/app/ui/dashboard/createPage";
import { getKelas } from "@/service/kelas";
import { getShips } from "@/service/shipService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createKapasitas } from "@/service/kapasitas";

interface SelectOption {
  value: number;
  label: string;
}

export default function createKapasitasTiket() {
  const [ship, setShip] = useState<SelectOption[]>([]);
  const [kelas, setKelas] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipRes, classRes] = await Promise.all([
          getShips(1, 100),
          getKelas(1, 100),
        ]);

        if (!shipRes?.data || !classRes?.data) {
          throw new Error("Failed to fetch data");
        }

        // Transform route data for select options
        const shipOption = shipRes.data.map((ship) => ({
          value: ship.id,
          label: `${ship.ship_name}`,
        }));

        // Transform manifest data for select options
        const classOption = classRes.data.map((kelas) => ({
          value: kelas.id,
          label: `${kelas.class_name}`,
        }));

        setShip(shipOption);
        setKelas(classOption);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      // Pastikan semua nilai dikonversi ke number
      const payload = {
        ship_id: parseInt(data.ship_id),
        class_id: parseInt(data.class_id),
        capacity: parseInt(data.capacity)
      };

      console.log(payload)

      // Validasi apakah nilai valid
      if (
        isNaN(payload.ship_id) ||
        isNaN(payload.class_id) ||
        isNaN(payload.capacity)
      ) {
        toast.error("Data tidak valid");
        return false;
      }

      const success = await createKapasitas(payload);

      if (success) {
        toast.success("Harga tiket berhasil dibuat");
      } else {
        toast.error("Gagal membuat harga tiket");
      }

      return success;
    } catch (error) {
      console.error("Error saat membuat harga tiket:", error);
      toast.error("Terjadi kesalahan saat membuat harga tiket");
      return false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CreatePage
      type="kapasitasTiket"
      onSubmit={handleSubmit}
      options={{
        ship_id: ship,
        class_id: kelas,
      }}
    />
  );
}
