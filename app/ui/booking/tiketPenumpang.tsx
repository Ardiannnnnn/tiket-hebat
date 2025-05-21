"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { lockTickets } from "@/service/session";
import { LockTicketItem } from "@/types/lock";
import { ClassAvailability } from "@/types/classAvailability";

const FormSchema = z.object({
  passengers: z.array(
    z.object({
      classId: z.number(),
      className: z.string(),
      adults: z.number().min(0),
      children: z.number().min(0),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

interface TiketPenumpangProps {
  setTabValue: (value: string) => void;
  scheduleid: string;
  quota: ClassAvailability[];
}

export default function TiketPenumpang({
  setTabValue,
  scheduleid,
  quota,
}: TiketPenumpangProps) {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassAvailability[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      passengers: [],
    },
  });

  // Fetch quota data
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch(
          `https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1/schedule/${scheduleid}/quota`
        );
        const json = await res.json();
        const availability = json?.data?.classes_availability || [];
        setClasses(availability);

        // Set default values for each class
        const defaultPassengers = availability.map(
          (cls: ClassAvailability) => ({
            classId: cls.class_id,
            className: cls.class_name,
            adults: 0,
            children: 0,
          })
        );
        form.reset({ passengers: defaultPassengers });
      } catch (error) {
        console.error("Gagal mengambil data kuota:", error);
      }
    };

    if (scheduleid) {
      fetchQuota();
    }
  }, [scheduleid]);

  // Hitung total penumpang (dewasa + anak-anak)
  const getTotalPassengers = () => {
    const passengers = form.getValues("passengers");
    return passengers.reduce(
      (total, p) => total + (p.adults || 0) + (p.children || 0),
      0
    );
  };

  // Tambah penumpang dengan cek maksimal 5
  const increase = (index: number, type: "adults" | "children") => {
    const total = getTotalPassengers();
    if (total >= 5) {
      toast.error("Maksimal 5 tiket yang dapat dipesan.");
      return; // jangan tambah
    }
    const value = form.getValues(`passengers.${index}.${type}`);
    form.setValue(`passengers.${index}.${type}`, value + 1);
  };

  // Kurangi penumpang, minimal 0
  const decrease = (index: number, type: "adults" | "children") => {
    const value = form.getValues(`passengers.${index}.${type}`);
    form.setValue(`passengers.${index}.${type}`, value > 0 ? value - 1 : 0);
  };

  // Disable tombol "+" jika sudah mencapai batas 5
  const isIncreaseDisabled = () => {
    return getTotalPassengers() >= 5;
  };

  // Submit form
  const onSubmit = async (data: FormValues) => {
  const total = data.passengers.reduce(
    (total, p) => total + p.adults + p.children,
    0
  );
  if (total > 5) {
    alert("Jumlah tiket maksimal adalah 5.");
    return;
  }

  const items: LockTicketItem[] = data.passengers
    .filter((p) => p.adults + p.children > 0)
    .map((p) => ({
      class_id: p.classId,
      quantity: p.adults + p.children,
    }));

 const payload = {
  schedule_id: Number(scheduleid),
  items,
};

  if (!payload.items || payload.items.length === 0) {
    toast.warning("Pilih tiket terlebih dahulu");
    return;
  }

  try {
    const lockedData = await lockTickets(payload);
    const sessionId = lockedData.data.session_id;
    console.log("✅ Tiket berhasil dilock:", lockedData);
    router.push(`/book/${scheduleid}/form?session_id=${sessionId}`);
  } catch (error) {
    console.error("❌ Gagal mengunci tiket:", error);
    toast.error("Terjadi kesalahan saat mengunci tiket");
  }
};
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {classes.map((cls, index) => {
          const adultsId = `adults-${cls.class_id}`;
          const childrenId = `children-${cls.class_id}`;
          return (
            <Card key={cls.class_id}>
              <CardContent className="p-4 space-y-6">
                <div className="text-center">
                  <p className="text-lg">{cls.class_name}</p>
                  <p className="text-gray-500">
                    Sisa Tiket: {cls.available_capacity}
                  </p>
                  <p className="text-teal-600 font-semibold">
                    Harga: {cls.currency} {cls.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex justify-center gap-10">
                  <FormField
                    control={form.control}
                    name={`passengers.${index}.adults`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={adultsId}
                          className="flex justify-center"
                        >
                          Dewasa
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => decrease(index, "adults")}
                          >
                            -
                          </Button>
                          <Input
                            id={adultsId}
                            className="w-10 text-center"
                            {...field}
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => increase(index, "adults")}
                            disabled={isIncreaseDisabled()}
                          >
                            +
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`passengers.${index}.children`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={childrenId}
                          className="flex justify-center"
                        >
                          Anak-Anak
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => decrease(index, "children")}
                          >
                            -
                          </Button>
                          <Input
                            id={childrenId}
                            className="w-10 text-center"
                            {...field}
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => increase(index, "children")}
                            disabled={isIncreaseDisabled()}
                          >
                            +
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setTabValue("kendaraan")}
            className="bg-Orange text-white"
          >
            Sebelumnya
          </Button>
          <Button
            type="submit"
            className="bg-Blue text-white hover:bg-teal-600"
          >
            Lanjutkan
          </Button>
        </div>
      </form>
    </Form>
  );
}
