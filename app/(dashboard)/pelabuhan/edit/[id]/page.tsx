"use client";

import UpdatePageDynamic from "@/app/ui/dashboard/updatePage";
import { getHarborById, updateHarbor } from "@/service/harborService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function UpdatePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHarborById(id as string);
        setData(res);
      } catch (err) {
        toast.error("Gagal memuat data pelabuhan");
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const success = await updateHarbor(id as string, data);
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
      <h1 className="text-2xl font-bold mb-6">Perbarui Data Pelabuhan</h1>
      <UpdatePageDynamic
        type="pelabuhan"
        initialData={data}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
