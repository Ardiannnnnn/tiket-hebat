"use client";

import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { createKelas } from "@/service/kelas";
import { toast } from "sonner";

export default function CreatePage() {
  const handleSubmit = async (data: any) => {
    try {
      const success = await createKelas(data);

      if (success) {
        toast.success("Kapal berhasil dibuat");
      } else {
        toast.error("Gagal membuat kapal");
      }

      return success;
    } catch (error) {
      console.error("Error saat membuat pelabuhan:", error);
      toast.error("Terjadi kesalahan saat membuat kapal");
      return false;
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Kapal Baru</h1>
      <CreatePageDynamic type="kelas" onSubmit={handleSubmit} />
    </div>
  );
}
