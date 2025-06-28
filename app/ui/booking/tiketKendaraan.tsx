"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassAvailability } from "@/types/classAvailability";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { getQuotaByScheduleId } from "@/service/quota";

interface TiketKendaraanProps {
  setTabValue: React.Dispatch<React.SetStateAction<string>>;
  scheduleid: string;
  setSelectedVehicleClass: React.Dispatch<
    React.SetStateAction<ClassAvailability | null>
  >;
}

const FormSchema = z.object({
  vehicle: z.string().min(1, "Pilih jenis kendaraan"),
});

export default function TiketKendaraan({
  setTabValue,
  scheduleid,
  setSelectedVehicleClass,
}: TiketKendaraanProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { vehicle: "" },
  });

  const [vehicleOptions, setVehicleOptions] = useState<ClassAvailability[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<ClassAvailability | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const allClasses = await getQuotaByScheduleId(scheduleid);
        const vehiclesOnly = allClasses.filter(
          (item) => item.type === "vehicle"
        );
        setVehicleOptions(vehiclesOnly);
      } catch (error) {
        console.error("Gagal mengambil data kendaraan:", error);
      }
    };

    if (scheduleid) {
      fetchVehicleData();
    }
  }, [scheduleid]);

  console.log("Vehicle Options:", vehicleOptions);

  const getVehicleName = (className: string): string => {
    const map: Record<string, string> = {
      "Golongan I": "Motor",
      "Golongan II": "Mobil",
      // Tambahkan mapping lain jika ada
    };
    return map[className] || className; // fallback: pakai className asli kalau tidak ditemukan
  };

  // ✅ Simplified handleVehicleChange tanpa bonus notification
  const handleVehicleChange = (value: string) => {
    form.setValue("vehicle", value);
    const selected = vehicleOptions.find(
      (v) => v.class_id.toString() === value
    );
    setSelectedVehicle(selected || null);
    setSelectedVehicleClass(selected || null);

    // ✅ Optional: Simple selection confirmation
    if (selected) {
      toast.success(`${getVehicleName(selected.class_name)} dipilih`, {
        style: {
          backgroundColor: "#f0f9ff",
          color: "#0369a1",
        },
      });
    }
  };

  const handleCancelSelection = () => {
    form.setValue("vehicle", ""); // ini akan trigger placeholder muncul lagi
    setSelectedVehicle(null);
    setSelectedVehicleClass(null);
    toast.error("Tiket kendaraan dibatalkan.");
  };

  return (
    <Form {...form}>
      <form className="space-y-4 mt-4 border shadow-md p-4 rounded-lg">
        <h1 className="text-red-400 text-sm md:text-base">
          Jika tidak membawa kendaraan lanjut saja ke tiket penumpang
        </h1>

        <FormField
          control={form.control}
          name="vehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Jenis Kendaraan</FormLabel>
              <div className="flex items-center gap-4">
                <Select
                  onValueChange={(value) => handleVehicleChange(value)}
                  value={field.value} // ganti dari defaultValue ke value
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleOptions.map((item) => (
                      <SelectItem
                        key={item.class_id}
                        value={item.class_id.toString()}
                      >
                        {getVehicleName(item.class_name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Batalkan tiket yang dipilih */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelSelection}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Sisa:{" "}
                  {selectedVehicle ? selectedVehicle.available_capacity : "-"}
                </p>
                {/* Harga */}
                <p className="text-sm text-gray-500">
                  Harga:{" "}
                  {selectedVehicle
                    ? `${
                        selectedVehicle.currency
                      } ${selectedVehicle.price.toLocaleString("id-ID")}`
                    : "-"}
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-center md:justify-end mt-14 md:mt-0">
          <Button
            type="button"
            onClick={() => setTabValue("penumpang")}
            className="w-full md:w-fit bg-Blue text-white hover:bg-teal-600"
          >
            Lanjut ke Tiket Penumpang
          </Button>
        </div>
      </form>
    </Form>
  );
}