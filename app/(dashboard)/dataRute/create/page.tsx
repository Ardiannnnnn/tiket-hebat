"use client";

import CreateRute from "@/app/ui/dashboard/createPage";
import { getHarbors } from "@/service/harborService";
import { createRute } from "@/service/rute";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SelectOption {
  value: number;
  label: string;
}

export default function CreatePage() {
  const [harbor, setHarbor] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHarbors();

        if (!data?.data) {
          throw new Error("failed to fecth data");
        }
        const harborOption = data.data.map((harbor) => ({
          value: harbor.id,
          label: `${harbor.harbor_name}`,
        }));

        setHarbor(harborOption);
      } catch (err) {
        console.error("gagal mendapatkan data", err);
        toast.error("gagal");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        departure_harbor_id: parseInt(data.departure_harbor_id),
        arrival_harbor_id: parseInt(data.arrival_harbor_id),
      };

      console.log(payload)

      if (
        isNaN(payload.departure_harbor_id) ||
        isNaN(payload.arrival_harbor_id)
      ) {
        toast.error("data tidak valid");
        return false;
      }

      const success = await createRute(payload);

      if (success) {
        toast.success("Berhasil Membuat Rute Baru");
      } else {
        toast.error("Gagal Membuat Rute Baru");
      }

      return success;
    } catch (error) {
      console.error("Error saat membuat rute:", error);
      toast.error("Terjadi kesalahan saat membuuat rute");
      return false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Rute Baru</h1>
      <CreateRute
        type="dataRute"
        onSubmit={handleSubmit}
        options={{
          departure_harbor_id: harbor,
          arrival_harbor_id: harbor,
        }}
      />
    </div>
  );
}
