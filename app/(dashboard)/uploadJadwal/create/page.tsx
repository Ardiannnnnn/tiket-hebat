"use client";

import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { createHarga } from "@/service/harga";
import { getRute } from "@/service/rute";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getShips } from "@/service/shipService";
import { createSchedule } from "@/service/schedule";

interface SelectOption {
  value: number;
  label: string;
}

export default function CreatePage() {
  const [routes, setRoutes] = useState<SelectOption[]>([]);
  const [ships, setShips] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, manifestRes] = await Promise.all([
          getRute(1, 100),
          getShips(1, 100),
        ]);

        if (!routeRes?.data || !manifestRes?.data) {
          throw new Error("Failed to fetch data");
        }

        // Transform route data for select options
        const routeOptions = routeRes.data.map((route) => ({
          value: route.id,
          label: `${route.departure_harbor.harbor_name} - ${route.arrival_harbor.harbor_name}`,
        }));

        // Transform manifest data for select options
        const manifestOptions = manifestRes.data.map((manifest) => ({
          value: manifest.id,
          label: manifest.ship_name,
        }));

        setRoutes(routeOptions);
        setShips(manifestOptions);
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
    const route_id = parseInt(data.route_id);
    const ship_id = parseInt(data.ship_id);
    const departureDate = new Date(data.departure_datetime);
    const arrivalDate = new Date(data.arrival_datetime);

    // Validasi angka dan tanggal
    if (
      isNaN(route_id) ||
      isNaN(ship_id) ||
      isNaN(departureDate.getTime()) ||
      isNaN(arrivalDate.getTime())
    ) {
      toast.error("Data tidak valid");
      return false;
    }

    // Buat payload dengan tanggal dalam ISO string
    const payload = {
      route_id,
      ship_id,
      departure_datetime: departureDate.toISOString(),
      arrival_datetime: arrivalDate.toISOString(),
      status: data.status,
    };

    console.log("Payload:", payload);

    const success = await createSchedule(payload);

    if (success) {
      toast.success("Jadwal berhasil dibuat");
    } else {
      toast.error("Gagal membuat jadwal");
    }

    return success;
  } catch (error) {
    console.error("Error saat membuat jadwal:", error);
    toast.error("Terjadi kesalahan saat membuat jadwal");
    return false;
  }
};


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Jadwal Baru</h1>
      <CreatePageDynamic
        type="uploadJadwal"
        onSubmit={handleSubmit}
        options={{
          route_id: routes,
          ship_id: ships,
        }}
      />
    </div>
  );
}
