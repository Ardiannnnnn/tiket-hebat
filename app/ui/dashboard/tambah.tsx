"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { poppins } from "../fonts";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface DynamicField {
  name: string;
  label: string;
  type?: string;
  options?: string[];
  required?: boolean;
}

interface TambahModalProps<T> {
  selectedSchedule?: any;
  requireSchedule?: boolean;
  onAdd?: (data: T) => Promise<{ success: boolean; message: string }>;
  fields: DynamicField[];
  formData: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  judul: string;
  onSuccess?: () => void;
}

export default function TambahModal<T>({
  selectedSchedule,
  requireSchedule = false,
  onAdd,
  fields,
  formData,
  onChange,
  onReset,
  judul,
  onSuccess,
}: TambahModalProps<T>) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = (): boolean => {
    const emptyFields = fields
      .filter((field) => field.required !== false)
      .filter((field) => {
        const value = formData[field.name as keyof T] as string;
        return !value || value.trim() === "";
      })
      .map((field) => field.label);

    if (emptyFields.length > 0) {
      toast.error(`Harap isi ${emptyFields.join(", ")} terlebih dahulu`);
      return false;
    }

    if (requireSchedule && !selectedSchedule) {
      toast.warning("Harap pilih jadwal terlebih dahulu");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true); // Set loading state to true immediately when submission starts
      
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (onAdd) {
        const result = await onAdd(formData);

        if (result.success) {
          toast.success(result.message);
          onReset();
          setOpen(false);

          if (onSuccess) {
            onSuccess();
          }
        } else {
          toast.error(result.message);
        }
      } else {
        toast.error("Fungsi onAdd tidak tersedia.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Terjadi kesalahan saat menambahkan data");
    } finally {
      setIsSubmitting(false); // Always set loading back to false when done
      setShowConfirmDialog(false);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    onChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={`${poppins.className}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={`${poppins.className} bg-Blue hover:bg-teal-600`}>
            Tambah {judul}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah {judul}</DialogTitle>
          </DialogHeader>

          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block mb-1">
                {field.label} {field.required !== false && <span className="text-red-500">*</span>}
              </label>
              {field.type === "select" ? (
                <Select
                  name={field.name}
                  value={formData[field.name as keyof T] as string}
                  onValueChange={(value) => handleSelectChange(field.name, value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Pilih ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name as keyof T] as string}
                  onChange={onChange}
                  placeholder={`Masukkan ${field.label}`}
                  disabled={isSubmitting}
                />
              )}
            </div>
          ))}

          <Button
            className="bg-Blue hover:bg-teal-600 w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </div>
            ) : (
              `Tambah ${judul}`
            )}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data yang akan ditambahkan sudah benar? Pastikan semua field terisi
              dengan benar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </div>
              ) : (
                "Lanjutkan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}