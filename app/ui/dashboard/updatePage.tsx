"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  type: string;
  endpoint?: string;
  initialData: any;
  onSubmit?: (data: any) => Promise<boolean> | boolean;
}

export default function UpdatePageDynamic({ type, endpoint, initialData, onSubmit }: Props) {
  const fields = createFieldConfigs[type];
  const schema = schemas[type];
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      fields.forEach((field) => {
        setValue(field.name, initialData[field.name]);
      });
    }
  }, [initialData, setValue]);

  const handleOpenConfirmation = (data: any) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      let success = false;

      if (onSubmit) {
        success = await onSubmit(formData);
      } else if (endpoint) {
        const response = await fetch(endpoint, {
          method: "PUT",
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
        console.log("Default update:", formData);
        success = true;
      }

      if (success) {
        router.push(`/${type}`);
      } else {
        toast.error("Gagal memperbarui data");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Gagal memperbarui data");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  if (!fields || !schema) {
    return (
      <div className="text-red-500">
        Fitur <strong>{type}</strong> tidak ditemukan
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleOpenConfirmation)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="grid">
            <Label htmlFor={field.name} className="mb-4">
              {field.label}
            </Label>

            {field.type === "select" && field.options ? (
              <Select
                value={watch(field.name)}
                onValueChange={(value) => setValue(field.name, value)}
              >
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

        <Button type="submit">Simpan Perubahan</Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menyimpan perubahan ini?</p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button onClick={handleConfirmedSubmit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Ya, Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
