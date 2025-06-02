"use client";

import UpdatePageDynamic from "@/app/ui/dashboard/updatePage";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getShipById, updateShip } from "@/service/shipService";

export default function UpdatePage() {
 const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getShipById(id as string);
        setData(res);
      } catch (err) {
        toast.error("Gagal memuat data pelabuhan");
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const success = await updateShip(id as string, data);
      if (success) {
        toast.success("Pelabuhan berhasil diperbarui");
      } else {
        toast.error("Gagal memperbarui pelabuhan");
      }
      return success;
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Terjadi kesalahan saat memperbarui");
      return false;
    }
  };

  if (!data) return <p>Memuat data...</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Perbarui Data Kapal</h1>
      <UpdatePageDynamic
        type="kapal"
        initialData={data}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
