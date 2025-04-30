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
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { poppins } from "../fonts";

export interface DynamicField {
  name: string;
  label: string;
  type?: string;
  options?: string[]; // Menambahkan opsi untuk select
}

interface TambahModalProps<T> {
  selectedSchedule?: any;
  onAdd: (data: T) => void;
  fields: DynamicField[];
  formData: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function TambahModal<T>({
  selectedSchedule,
  onAdd,
  fields,
  formData,
  onChange,
  onReset,
}: TambahModalProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!selectedSchedule) return;

    onAdd(formData);
    onReset();
    setOpen(false);
  };

  // Fungsi untuk menangani perubahan nilai select
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
            Tambah
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah</DialogTitle>
          </DialogHeader>

          {/* Looping fields untuk render form input */}
          {fields.map((field) => {
            const isSelect = field.type === "select";

            return (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                {isSelect ? (
                  <Select
                    name={field.name}
                    value={formData[field.name as keyof T] as string}
                    onValueChange={(value) =>
                      handleSelectChange(field.name, value)
                    }
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
                  />
                )}
              </div>
            );
          })}

          <Button className="bg-Blue hover:bg-teal-600" onClick={handleSubmit}>Tambah</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
