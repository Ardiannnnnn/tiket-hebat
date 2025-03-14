"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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

const vehicleOptions = [
  { label: "Motor", value: "motor" },
  { label: "Mobil", value: "mobil" },
  { label: "Bus", value: "bus" },
];

// Data sisa tiket per jenis kendaraan
const ticketAvailability: Record<string, number> = {
  motor: 100,
  mobil: 50,
  bus: 20,
};

const FormSchema = z.object({
  vehicles: z.array(
    z.object({
      type: z.string().min(1, "Pilih jenis kendaraan"),
    })
  ),
});

interface TiketKendaraanProps {
  setTabValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TiketKendaraan({ setTabValue }: TiketKendaraanProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { vehicles: [{ type: "" }] },
  });

  const [availability, setAvailability] = useState<{ [key: number]: number }>({});

  const addVehicle = () => {
    form.setValue("vehicles", [...form.getValues("vehicles"), { type: "" }]);
  };

  const removeVehicle = (index: number) => {
    const vehicles = form.getValues("vehicles");
    if (vehicles.length > 1) {
      vehicles.splice(index, 1);
      form.setValue("vehicles", [...vehicles]);

      setAvailability((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  const handleVehicleChange = (index: number, value: string) => {
    form.setValue(`vehicles.${index}.type`, value);
    setAvailability((prev) => ({ ...prev, [index]: ticketAvailability[value] || 0 }));
  };

  return (
    <Form {...form}>
      <form className="space-y-4 mt-4 border shadow-md p-4 rounded-lg">
        <h1 className="text-red-400 text-sm md:text-base">
          Jika tidak membawa kendaraan lanjut saja ke tiket penumpang
        </h1>
        {form.watch("vehicles").map((_, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`vehicles.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Jenis Kendaraan {index + 1}</FormLabel>
                <div className="flex items-center gap-4">
                  <Select
                    onValueChange={(value) => handleVehicleChange(index, value)}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kendaraan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Menampilkan sisa tiket */}
                  <div className="border p-2 rounded-lg bg-gray-100 text-sm text-gray-700 min-w-[60px] text-center">
                    {availability[index] !== undefined ? availability[index] : "-"}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeVehicle(index)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="button" onClick={addVehicle} className="flex items-center bg-Orange w-10 md:w-fit">
          <Plus className="w-4 h-4x" />
        </Button>
        <div className="w-full flex justify-center md:justify-end mt-14 md:mt-0">
          <Button type="button" onClick={() => setTabValue("penumpang")} className="w-full md:w-fit bg-Blue text-white">
            Lanjut ke Tiket Penumpang
          </Button>
        </div>
      </form>
    </Form>
  );
}
