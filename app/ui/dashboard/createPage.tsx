"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createFieldConfigs } from "@/config/createFieldConfig";
import { schemas } from "@/lib/zodSchemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  type: string; // tipe fitur seperti 'kapal', 'tiket', dll
  endpoint?: string; // endpoint API untuk posting data
  onSubmit?: (data: any) => Promise<boolean> | boolean; // opsional agar bisa override aksi submit
}

export default function CreatePageDynamic({ type, endpoint, onSubmit }: Props) {
  const fields = createFieldConfigs[type];
  const schema = schemas[type];
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  if (!fields || !schema) {
    return (
      <div className="text-red-500">
        Fitur <strong>{type}</strong> tidak ditemukan
      </div>
    );
  }

  // Fungsi untuk menyimpan data form dan membuka dialog konfirmasi
  const handleOpenConfirmation = (data: any) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  // Fungsi untuk mengeksekusi submit setelah konfirmasi
  const handleConfirmedSubmit = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      let success = false;

      if (onSubmit) {
        // Gunakan custom onSubmit jika disediakan
        success = await onSubmit(formData);
      } else if (endpoint) {
        // Gunakan endpoint jika disediakan
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        success = response.ok;
        if (!success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Fallback default jika tidak ada onSubmit atau endpoint
        console.log("Default submit:", formData);
        success = true;
      }

      // Jika berhasil
      if (success) {
        reset(); // Reset form setelah berhasil
        router.push(`/${type}`);
      } else {
        toast.error("Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menyimpan data");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleOpenConfirmation)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="grid">
            <Label htmlFor={field.name} className="mb-4">
              {field.label}
            </Label>

            {field.type === "select" && field.options ? (
              <Select onValueChange={(value) => setValue(field.name, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder || "Pilih"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
            )}

            {errors[field.name] && (
              <p className="text-sm text-red-500">
                {(errors[field.name]?.message as string) || "Field tidak valid"}
              </p>
            )}
          </div>
        ))}

        <Button type="submit">
          Simpan
        </Button>
      </form>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menambahkan data ini?</p>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              onClick={handleConfirmedSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Ya, Tambahkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}