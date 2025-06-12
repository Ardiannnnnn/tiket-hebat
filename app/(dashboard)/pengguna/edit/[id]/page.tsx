"use client";

import UpdatePageDynamic from "@/app/ui/dashboard/updatePage";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserById, updateUser } from "@/service/user";
import { getRoles } from "@/service/role";
import { User } from "@/types/user";

interface RoleOption {
  value: number;
  label: string;
}

export default function UpdatePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [data, setData] = useState<User | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        if (response.status) {
          const roleOptions = response.data.map((role) => ({
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

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await getUserById(Number(id));
        
        if (response.status) {
          // Transform the data to match the expected format
          const transformedData = {
            ...response.data,
            role_id: response.data.role.id // Extract role_id from nested role object
          };
          console.log("Transformed user data:", transformedData);
          setData(transformedData);
        } else {
          toast.error(response.message || "Gagal memuat data pengguna");
          router.push("/pengguna");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Gagal memuat data pengguna");
        router.push("/pengguna");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, router]);

  const handleSubmit = async (formData: Partial<User>) => {
    if (!id) return false;

    try {
      const response = await updateUser(Number(id), formData);
      if (response) {
        toast.success("Pengguna berhasil diperbarui");
        router.push("/pengguna");
        return true;
      } else {
        toast.error("Gagal memperbarui pengguna");
        return false;
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Terjadi kesalahan saat memperbarui");
      return false;
    }
  };

  if (isLoading) return <div>Memuat data...</div>;
  if (!data) return <div>Data tidak ditemukan</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Perbarui Data Pengguna</h1>
      <UpdatePageDynamic
        type="pengguna"
        initialData={data}
        onSubmit={handleSubmit}
        options={{
          role_id: roles
        }}
      />
    </div>
  );
}