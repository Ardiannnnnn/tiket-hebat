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
  const [dialogMessage, setDialogMessage] = useState("Anda akan memasuki satu sesi pemesanan");

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      passengers: [],
    },
  });

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch(
          `https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1/schedule/${scheduleid}/quota`
        );
        const json = await res.json();
        const availability = json?.data?.classes_availability || [];
        setClasses(availability);

        const defaultPassengers = availability.map((cls: ClassAvailability) => {
          let adults = 0;

          if (cls.type === "passenger" && selectedVehicleClass) {
            if (selectedVehicleClass.class_name === "Golongan I") {
              if (cls.class_name === "ECONOMY") adults = 1;
            } else if (selectedVehicleClass.class_name === "Golongan II") {
              if (cls.class_name === "ECONOMY") adults = 5;
            }
          }

          return {
            classId: cls.class_id,
            className: cls.class_name,
            adults,
            children: 0,
          };
        });

        form.reset({ passengers: defaultPassengers });
      } catch (error) {
        console.error("Gagal mengambil data kuota:", error);
      }
    };

    if (scheduleid) {
      fetchQuota();
    }
  }, [scheduleid, selectedVehicleClass]);

  const getTotalPassengers = () => {
    const passengers = form.getValues("passengers");
    return passengers.reduce(
      (total, p) => total + (p.adults || 0) + (p.children || 0),
      0
    );
  };

  const increase = (index: number, type: "adults" | "children") => {
    const total = getTotalPassengers();
    if (total >= 5) {
      toast.error("Maksimal 5 tiket yang dapat dipesan.");
      return;
    }
    const value = form.getValues(`passengers.${index}.${type}`);
    form.setValue(`passengers.${index}.${type}`, value + 1);
  };

  const decrease = (index: number, type: "adults" | "children") => {
    const value = form.getValues(`passengers.${index}.${type}`);
    form.setValue(`passengers.${index}.${type}`, value > 0 ? value - 1 : 0);
  };

  const isIncreaseDisabled = () => {
    return getTotalPassengers() >= 5;
  };

  const onSubmit = async (data: FormValues) => {
    const total = data.passengers.reduce(
      (total, p) => total + p.adults + p.children,
      0
    );

    if (total > 5) {
      toast.error("Jumlah tiket maksimal adalah 5.");
      return;
    }

    const passengerItems: LockTicketItem[] = data.passengers
      .filter((p) => p.adults + p.children > 0)
      .map((p) => ({
        class_id: p.classId,
        quantity: p.adults + p.children,
        type: "passenger",
      }));

    const vehicleItem: LockTicketItem[] = selectedVehicleClass
      ? [{ class_id: selectedVehicleClass.class_id, quantity: 1, type: "vehicle" }]
      : [];

    const items: LockTicketItem[] = [...vehicleItem, ...passengerItems];

    if (items.length === 0) {
      toast.warning("Pilih tiket terlebih dahulu");
      return;
    }

    const hasQuotaIssue = items.some(item => {
      const match = classes.find(c => c.class_id === item.class_id);
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
        setSessionCookie(sessionId);
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
        {classes.filter(item => item.type === "passenger").map((cls, index) => {
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
                        <FormLabel htmlFor={adultsId} className="flex justify-center">
                          Dewasa
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <Button type="button" variant="outline" onClick={() => decrease(index, "adults")}>-</Button>
                          <Input id={adultsId} className="w-10 text-center" {...field} readOnly />
                          <Button type="button" variant="outline" onClick={() => increase(index, "adults")} disabled={isIncreaseDisabled()}>+</Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`passengers.${index}.children`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={childrenId} className="flex justify-center">
                          Anak-Anak
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <Button type="button" variant="outline" onClick={() => decrease(index, "children")}>-</Button>
                          <Input id={childrenId} className="w-10 text-center" {...field} readOnly />
                          <Button type="button" variant="outline" onClick={() => increase(index, "children")} disabled={isIncreaseDisabled()}>+</Button>
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
          <Button type="button" onClick={() => setTabValue("kendaraan")} className="bg-Orange text-white">
            Sebelumnya
          </Button>
          <Button type="submit" className="bg-Blue text-white hover:bg-teal-600">
            Lanjutkan
          </Button>
        </div>
      </form>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium text-gray-600 text-center">{dialogMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="md:mx-auto">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={dialogAction} className="bg-Blue">Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
