"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { User, CreditCard, Plus, Trash, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CiCircleMinus } from "react-icons/ci";

const classes = [
  { id: "1", label: "Ekonomi", value: "ekonomi", jumlahtiket: 200 },
  { id: "2", label: "Bisnis", value: "bisnis", jumlahtiket: 100 },
  { id: "3", label: "VIP", value: "vip", jumlahtiket: 50 },
];

interface TiketPenumpangProps {
  setTabValue: (value: string) => void;
}

interface FormValues {
  passengers: { quantity: number }[];
}

// const ticketAvailability: Record<string, number> = { ekonomi: 200, bisnis: 100, vip: 50 };

const FormSchema = z.object({
  passengers: z.array(
    z.object({
      class: z.string().min(1, "Pilih kelas"),
      adults: z.string().min(1, "Pilih jumlah penumpang dewasa"),
      children: z.string(),
    })
  ),
});

export default function TiketPenumpang({ setTabValue }: TiketPenumpangProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      passengers: classes.map(() => ({ adults: 0, children: 0 })),
    },
  });

  const increase = (index: number, type: "adults" | "children") => {
    const currentValue = form.getValues(`passengers.${index}.${type}`);
    form.setValue(`passengers.${index}.${type}`, currentValue + 1);
  };

  const decrease = (index: number, type: "adults" | "children") => {
    const currentValue = form.getValues(`passengers.${index}.${type}`);
    form.setValue(
      `passengers.${index}.${type}`,
      currentValue > 0 ? currentValue - 1 : 0
    );
  };

  const onSubmit = (data: {
    passengers: { adults: number; children: number }[];
  }) => {
    console.log(data);
    router.push("/book/form");
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {classes.map((field, index) => {
          const adultsId = useId();
          const childrenId = useId();
          return (
            <Card key={field.id}>
              <CardContent className="p-4 space-y-10">
                <div className="flex justify-center items-center">
                  {/* Kelas */}
                  <div className="flex flex-col items-center">
                    <p className="font-semibold">{field.label}</p>
                    <span className="text-gray-500">Sisa Tiket</span>
                    <div className="flex items-center gap-2 mt-2">
                      <CreditCard className="text-teal-500" />
                      <span className="text-lg font-semibold">
                        {field.jumlahtiket}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Jumlah Penumpang */}
                <div className="md:gap-34 justify-center gap-8 flex items-center">
                  <FormField
                    control={form.control}
                    name={`passengers.${index}.adults`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={adultsId}
                          className="text-center flex justify-center"
                        >
                          Dewasa
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <button
                            className="border-2 border-Blue text-Orange flex items-center justify-center px-2 rounded-full"
                            type="button"
                            onClick={() => decrease(index, "adults")}
                          >
                            -
                          </button>
                          <Input
                            id={adultsId}
                            className="w-10 text-center"
                            type="number"
                            {...field}
                            readOnly
                          />
                          <button
                            onClick={() => increase(index, "adults")}
                            type="button"
                            className="px-1.5 border-2 rounded-full border-Blue flex items-center justify-center text-Orange"
                          >
                            +
                          </button>
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
                          className="text-center flex justify-center"
                        >
                          Anak-Anak
                        </FormLabel>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => decrease(index, "children")}
                            type="button"
                            className="border-2 border-Blue text-Orange flex items-center justify-center px-2 rounded-full"
                          >
                            -
                          </button>
                          <Input
                            id={childrenId}
                            className="w-10 text-center"
                            type="text"
                            {...field}
                            readOnly
                          />
                          <button
                            onClick={() => increase(index, "children")}
                            type="button"
                            className="px-1.5 border-2 rounded-full border-Blue flex items-center justify-center text-Orange"
                          >
                            +
                          </button>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        {/* Tombol Navigasi */}
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setTabValue("kendaraan")}
            className="bg-Orange text-white"
          >
            Sebelumnya
          </Button>
          <Button type="submit" className="bg-Blue text-white hover:bg-teal-600">
            Lanjutkan
          </Button>
        </div>
      </form>
    </Form>
  );
}
