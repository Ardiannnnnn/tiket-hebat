"use client";

import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { createHarga } from "@/service/harga";
import { getRute } from "@/service/rute";
import { getManifest } from "@/service/kapasitas";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SelectOption {
  value: number;
  label: string;
}

export default function CreatePage() {
  const [routes, setRoutes] = useState<SelectOption[]>([]);
  const [manifests, setManifests] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, manifestRes] = await Promise.all([
          getRute(1, 100),
          getManifest(1, 100),
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
          label: `${manifest.schedule.ship_name} - ${manifest.class.class_name}`,
        }));

        setRoutes(routeOptions);
        setManifests(manifestOptions);
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
        route_id: parseInt(data.route_id),
        manifest_id: parseInt(data.manifest_id),
        ticket_price: parseInt(data.ticket_price),
      };

      // Validasi apakah nilai valid
      if (
        isNaN(payload.route_id) ||
        isNaN(payload.manifest_id) ||
        isNaN(payload.ticket_price)
      ) {
        toast.error("Data tidak valid");
        return false;
      }

      const success = await createHarga(payload);

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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Harga Tiket Baru</h1>
      <CreatePageDynamic
        type="hargaTiket"
        onSubmit={handleSubmit}
        options={{
          route_id: routes,
          manifest_id: manifests,
        }}
      />
    </div>
  );
}
