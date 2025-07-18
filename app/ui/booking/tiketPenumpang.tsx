"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { setSessionCookie } from "@/utils/cookies";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { getQuotaByScheduleId } from "@/service/quota";

// ✅ Simplified schema - remove children
const FormSchema = z.object({
  passengers: z.array(
    z.object({
      classId: z.number(),
      className: z.string(),
      quantity: z.number().min(0).max(5), // ✅ Rename adults to quantity
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

interface TiketPenumpangProps {
  setTabValue: (value: string) => void;
  scheduleid: string;
  quota: ClassAvailability[];
  selectedVehicleClass: ClassAvailability | null;
}

export default function TiketPenumpang({
  setTabValue,
  scheduleid,
  quota,
  selectedVehicleClass,
}: TiketPenumpangProps) {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassAvailability[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<() => void>(() => () => {});
  const [dialogMessage, setDialogMessage] = useState(
    "Anda akan memasuki satu sesi pemesanan"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      passengers: [],
    },
  });

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        console.log(`🚀 Fetching quota for schedule ID: ${scheduleid}`);

        const availability = await getQuotaByScheduleId(scheduleid);

        console.log("📋 Kuota yang didapat:", {
          count: availability.length,
          data: availability,
        });

        if (availability.length === 0) {
          console.warn("⚠️ No availability data received");
          toast.warning("Tidak ada data kuota untuk jadwal ini");
          return;
        }

        setClasses(availability);

        // ✅ Simplified default passengers setup
        const defaultPassengers = availability
          .filter((cls) => cls.type === "passenger") // ✅ Filter hanya passenger
          .map((cls: ClassAvailability) => ({
            classId: cls.class_id,
            className: cls.class_name,
            quantity: 0, // ✅ Single field for passenger count
          }));

        console.log("👥 Default passengers setup:", defaultPassengers);

        form.reset({ passengers: defaultPassengers });
      } catch (error) {
        console.error("❌ Gagal mengambil data kuota:", error);
        toast.error("Gagal mengambil data kuota. Silakan coba lagi.");
      }
    };

    if (scheduleid) {
      fetchQuota();
    }
  }, [scheduleid, selectedVehicleClass, form]);

  // ✅ Simplified helper function untuk menghitung total tiket
  const getTotalTickets = () => {
    const passengers = form.getValues("passengers");
    return passengers.reduce((total, p) => total + (p.quantity || 0), 0);
  };

  // ✅ Simplified increase function
  const increase = (index: number) => {
    const totalTickets = getTotalTickets();

    // Batasi maksimal 5 tiket total
    if (totalTickets >= 5) {
      toast.error("Maksimal 5 tiket penumpang yang dapat dipesan.");
      return;
    }

    const value = form.getValues(`passengers.${index}.quantity`);
    form.setValue(`passengers.${index}.quantity`, value + 1);
  };

  // ✅ Simplified decrease function
  const decrease = (index: number) => {
    const value = form.getValues(`passengers.${index}.quantity`);
    if (value > 0) {
      form.setValue(`passengers.${index}.quantity`, value - 1);
    }
  };

  // ✅ Simplified validation functions
  const isIncreaseDisabled = (index: number) => {
    const passengers = form.getValues("passengers");
    const currentValue = passengers[index]?.quantity || 0;

    // Hitung total jika field ini dinaikkan 1
    const simulatedTotal = passengers.reduce((total, p, i) => {
      if (i === index) {
        return total + currentValue + 1;
      }
      return total + (p.quantity || 0);
    }, 0);

    // Cek kapasitas kelas
    const currentPassenger = passengers[index];
    const matchingClass = classes.find(
      (c) => c.class_id === currentPassenger?.classId
    );
    if (!matchingClass || matchingClass.available_capacity <= 0) {
      return true;
    }

    // Disable jika penambahan akan melebihi 5 tiket atau kapasitas kelas
    return (
      simulatedTotal > 5 || currentValue >= matchingClass.available_capacity
    );
  };

  const isDecreaseDisabled = (index: number) => {
    const value = form.getValues(`passengers.${index}.quantity`);
    return value <= 0;
  };

  const onSubmit = async (data: FormValues) => {
    const totalTickets = getTotalTickets();
    const kendaraanDipilih = selectedVehicleClass !== null;
    const penumpangDipilih = totalTickets > 0;

    // Cek: minimal harus ada salah satu tiket yang dipilih
    if (!kendaraanDipilih && !penumpangDipilih) {
      toast.warning("Pilih tiket terlebih dahulu");
      return;
    }

    // Validasi maksimal 5 tiket total
    if (totalTickets > 5) {
      toast.error("Maksimal 5 tiket penumpang yang dapat dipesan.");
      return;
    }

    // ✅ Simplified passenger items mapping
    const passengerItems: LockTicketItem[] = data.passengers
      .filter((p) => p.quantity > 0)
      .map((p) => ({
        class_id: p.classId,
        quantity: p.quantity,
        type: "passenger",
      }));

    const vehicleItem: LockTicketItem[] = selectedVehicleClass
      ? [
          {
            class_id: selectedVehicleClass.class_id,
            quantity: 1,
          },
        ]
      : [];

    const items: LockTicketItem[] = [...vehicleItem, ...passengerItems];

    if (items.length === 0) {
      toast.warning("Pilih tiket terlebih dahulu");
      return;
    }

    const hasQuotaIssue = items.some((item) => {
      const match = classes.find((c) => c.class_id === item.class_id);
      return !match || item.quantity > match.available_capacity;
    });

    if (hasQuotaIssue) {
      setDialogMessage("Maaf tiket penumpang atau kendaraan sudah habis.");
      setDialogAction(() => () => setOpenDialog(false));
      setOpenDialog(true);
      return;
    }

    setDialogMessage("Anda memiliki waktu 15 menit untuk mengisi data-data!!!");
    setDialogAction(() => async () => {
      setOpenDialog(false);
      const payload = {
        schedule_id: Number(scheduleid),
        items,
      };

      try {
        const lockedData = await lockTickets(payload);
        const sessionId = lockedData.data.session_id;
        sessionStorage.setItem("session_id", sessionId);
        router.push(`/book/${scheduleid}/form?session_id=${sessionId}`);
      } catch (error) {
        console.error("❌ Gagal mengunci tiket:", error);
        toast.error("Terjadi kesalahan saat mengunci tiket");
      }
    });
    setOpenDialog(true);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {classes
          .filter((item) => item.type === "passenger")
          .map((cls, index) => {
            const quantityId = `quantity-${cls.class_id}`;
            const passengers = form.getValues("passengers");
            const currentPassenger = passengers[index];

            return (
              <Card key={cls.class_id}>
                <CardContent className="p-4 space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-medium">{cls.class_name}</p>
                    <p className="text-gray-500">
                      Sisa Tiket: {cls.available_capacity}
                    </p>
                    <p className="text-teal-600 font-semibold">
                      Harga: {cls.currency} {cls.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* ✅ Single field for passenger quantity */}
                  <div className="flex justify-center">
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor={quantityId}
                            className="flex justify-center text-base font-medium"
                          >
                            Jumlah Penumpang
                          </FormLabel>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 rounded-full"
                              onClick={() => decrease(index)}
                              disabled={isDecreaseDisabled(index)}
                            >
                              -
                            </Button>
                            <Input
                              id={quantityId}
                              className="w-16 text-center text-lg font-medium"
                              {...field}
                              readOnly
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 rounded-full"
                              onClick={() => increase(index)}
                              disabled={isIncreaseDisabled(index)}
                            >
                              +
                            </Button>
                          </div>
                          <FormMessage />
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
            className="bg-Orange hover:bg-amber-600 text-white"
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

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium text-gray-600 text-center">
              {dialogMessage}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="md:mx-auto">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={dialogAction}
              className="bg-Blue hover:bg-teal-600 text-white"
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
