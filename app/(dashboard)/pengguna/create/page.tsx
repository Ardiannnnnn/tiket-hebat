"use client";

import { useEffect, useState } from "react";
import CreatePageDynamic from "@/app/ui/dashboard/createPage";
import { createUser } from "@/service/user";
import { getRoles, type Role } from "@/service/role";
import { toast } from "sonner";

interface RoleOption {
  value: number;
  label: string;
}


export default function CreatePage() {
 const [roles, setRoles] = useState<RoleOption[]>([]); // Add proper typing here

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        if (response.status) {
          const roleOptions: RoleOption[] = response.data.map((role) => ({
            value: role.id,
            label: role.role_name,
          }));
          setRoles(roleOptions);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Gagal memuat data role");
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      const success = await createUser(data);

      if (success) {
        toast.success("Pengguna berhasil dibuat");
      } else {
        toast.error("Gagal membuat pengguna");
      }

      return success;
    } catch (error) {
      console.error("Error saat membuat pengguna:", error);
      toast.error("Terjadi kesalahan saat membuat pengguna");
      return false;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Pengguna Baru</h1>
      <CreatePageDynamic
        type="pengguna"
        onSubmit={handleSubmit}
        options={{
          role_id: roles
        }}
      />
    </div>
  );
}
