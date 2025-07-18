"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  penumpangSchema,
  penumpangSubmissionSchema,
  type PenumpangFormData,
  type PenumpangSubmissionData,
  type PenumpangSchemaInput,
  getIdentityFormat,
  validateIdentityInput,
} from "@/lib/penumpangSchema";
import type { SessionData } from "@/types/session";
import { toast } from "sonner";
import {
  Car,
  Users,
  Info,
  ArrowRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";

interface FormPenumpangProps {
  session: SessionData;
}

// ✅ Define proper types for ticket data
interface TicketInfo {
  class_id: number;
  class_name: string;
  original_item: {
    class_id: number;
    quantity: number;
    class: {
      class_name: string;
      type: "passenger" | "vehicle";
    };
  };
  form_index: number;
  quantity_index: number;
}

const STORAGE_KEY = "dataPenumpang";

export default function FormPenumpang({ session }: FormPenumpangProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const sessionIdFromStorage = sessionStorage.getItem('session_id');

  // ✅ Generate expanded tickets with proper types using session prop
  const generateExpandedTickets = (): {
    passengerTickets: TicketInfo[];
    vehicleTickets: TicketInfo[];
  } => {
    const passengerTickets: TicketInfo[] = [];
    const vehicleTickets: TicketInfo[] = [];

    session.claim_items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const ticketData: TicketInfo = {
          class_id: item.class_id,
          class_name: item.class.class_name,
          original_item: item,
          form_index:
            item.class.type === "passenger"
              ? passengerTickets.length
              : vehicleTickets.length,
          quantity_index: i + 1,
        };

        if (item.class.type === "passenger") {
          passengerTickets.push(ticketData);
        } else if (item.class.type === "vehicle") {
          vehicleTickets.push(ticketData);
        }
      }
    });

    return { passengerTickets, vehicleTickets };
  };

  // ✅ Memoize tickets to prevent regeneration
  const { passengerTickets, vehicleTickets } = useMemo(
    () => generateExpandedTickets(),
    [session.claim_items] // Only depend on claim_items
  );

  const [initialized, setInitialized] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PenumpangFormData>({
    resolver: zodResolver(penumpangSchema),
    defaultValues: {
      penumpang: [],
      kendaraan: [],
    },
  });

  const { fields: passengerFields, replace: replacePassenger } = useFieldArray({
    control,
    name: "penumpang",
  });

  const { fields: kendaraanFields, replace: replaceKendaraan } = useFieldArray({
    control,
    name: "kendaraan",
  });

  // ✅ Initialize form data with proper dependency array
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounted
    
    const initializeForm = () => {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed.penumpang?.length === passengerTickets.length &&
            parsed.kendaraan?.length === vehicleTickets.length
          ) {
            // ✅ Format existing data with proper types
            const formattedPenumpang = parsed.penumpang.map((p: any, index: number) => ({
              nama: p.nama || "",
              jenis_kelamin: (p.jenis_kelamin === "wanita" ? "wanita" : "pria") as "pria" | "wanita",
              jenis_id: (p.jenis_id || "nik") as "nik" | "sim" | "paspor",
              nomor_identitas: p.nomor_identitas || "",
              usia: String(p.usia || ""),
              alamat: p.alamat || "",
              ticket_id: `passenger_${passengerTickets[index]?.class_id}_${passengerTickets[index]?.quantity_index}`,
              class_name: passengerTickets[index]?.class_name || "",
              class_id: passengerTickets[index]?.class_id || 0,
            }));

            const formattedKendaraan = parsed.kendaraan.map((k: any, index: number) => ({
              nomor_polisi: k.nomor_polisi || "",
              nama: k.nama || "",
              alamat: k.alamat || "",
              usia: String(k.usia || ""),
              ticket_id: `vehicle_${vehicleTickets[index]?.class_id}_${vehicleTickets[index]?.quantity_index}`,
              class_name: vehicleTickets[index]?.class_name || "",
              class_id: vehicleTickets[index]?.class_id || 0,
            }));

            console.log("🔄 Restoring saved data:", {
              formattedPenumpang: formattedPenumpang.length,
              formattedKendaraan: formattedKendaraan.length,
            });

            if (isMounted) {
              replacePassenger(formattedPenumpang);
              replaceKendaraan(formattedKendaraan);
              reset({
                penumpang: formattedPenumpang,
                kendaraan: formattedKendaraan,
              });
              setInitialized(true);
            }
            return;
          }
        } catch (error) {
          console.error("❌ Error parsing saved data:", error);
          // Continue to create new form if parsing fails
        }
      }

      // ✅ Create new form with proper types
      const defaultPenumpang = passengerTickets.map((ticket) => ({
        nama: "",
        jenis_kelamin: "pria" as const,
        jenis_id: "nik" as const,
        nomor_identitas: "",
        usia: "",
        alamat: "",
        ticket_id: `passenger_${ticket.class_id}_${ticket.quantity_index}`,
        class_name: ticket.class_name,
        class_id: ticket.class_id,
      }));

      const defaultKendaraan = vehicleTickets.map((ticket) => ({
        nomor_polisi: "",
        nama: "",
        alamat: "",
        usia: "",
        ticket_id: `vehicle_${ticket.class_id}_${ticket.quantity_index}`,
        class_name: ticket.class_name,
        class_id: ticket.class_id,
      }));

      console.log("🔧 Initializing forms:", {
        defaultPenumpang: defaultPenumpang.length,
        defaultKendaraan: defaultKendaraan.length,
      });

      if (isMounted) {
        replacePassenger(defaultPenumpang);
        replaceKendaraan(defaultKendaraan);
        reset({
          penumpang: defaultPenumpang,
          kendaraan: defaultKendaraan,
        });
        setInitialized(true);
      }
    };

    // ✅ Only initialize if we have tickets and not already initialized
    if ((passengerTickets.length > 0 || vehicleTickets.length > 0) && !initialized) {
      initializeForm();
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [
    passengerTickets.length, // Only length, not the array itself
    vehicleTickets.length,   // Only length, not the array itself
    initialized,             // Track initialization state
  ]);

  // ✅ Separate effect for saving form data (debounced)
  const watchedData = watch();
  useEffect(() => {
    if (initialized) {
      const timeoutId = setTimeout(() => {
        const formData = {
          penumpang: watchedData.penumpang,
          kendaraan: watchedData.kendaraan,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }, 500); // Debounce saves by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedData, initialized]);

  const onSubmit = async (data: PenumpangFormData) => {
    if (passengerTickets.length === 0 && vehicleTickets.length === 0) {
      toast.error("Pilih tiket terlebih dahulu");
      return;
    }

    try {
      console.log("📝 Form submission data (string usia):", data);

      const submissionData = penumpangSubmissionSchema.parse(data);
      console.log(
        "🔄 Transformed submission data (number usia):",
        submissionData
      );

      // ✅ Add class information with proper mapping and type safety
      const penumpangDenganKelas = submissionData.penumpang?.map(
        (item, index: number) => {
          const ticketInfo = passengerTickets[index];
          return {
            ...item,
            kelas: ticketInfo?.class_name || "Tidak diketahui",
            class_id: ticketInfo?.class_id || 0,
            original_class_id: ticketInfo?.original_item?.class_id || 0,
            quantity_index: ticketInfo?.quantity_index || 1,
          };
        }
      ) || [];

      const kendaraanDenganKelas = submissionData.kendaraan?.map(
        (item, index: number) => {
          const ticketInfo = vehicleTickets[index];
          return {
            ...item,
            kelas: ticketInfo?.class_name || "Tidak diketahui",
            class_id: ticketInfo?.class_id || 0,
            original_class_id: ticketInfo?.original_item?.class_id || 0,
            quantity_index: ticketInfo?.quantity_index || 1,
          };
        }
      ) || [];

      const savedData = {
        penumpang: penumpangDenganKelas,
        kendaraan: kendaraanDenganKelas,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
      console.log("✅ Data saved successfully:", savedData);

      const finalSessionId = sessionId || sessionIdFromStorage || session.session_id;

      if (!finalSessionId) {
        toast.error("Session ID tidak ditemukan. Silakan booking ulang.");
        router.push(`/book/${id}`);
        return;
      }

      router.push(`/book/${id}/form/verifikasi?session_id=${finalSessionId}`);
    } catch (error) {
      console.error("❌ Form submission error:", error);
      toast.error(
        "Terjadi kesalahan saat memproses data. Silakan periksa input Anda."
      );
    }
  };

  // ✅ Loading state
  if (!initialized) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-Blue border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Memuat form...</span>
      </div>
    );
  }

  // ✅ Empty state
  if (passengerFields.length === 0 && kendaraanFields.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Tidak Ada Form Yang Perlu Diisi
        </h3>
        <p className="text-gray-500">
          Belum ada tiket yang dipilih atau data tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Forms */}
        {kendaraanFields.map((field, index) => {
          const ticketInfo = vehicleTickets[index];
          return (
            <Card key={field.id} className="shadow-md py-0 gap-0">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Data Kendaraan {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ticketInfo?.class_name}
                      {ticketInfo && ticketInfo.original_item.quantity > 1 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                          {ticketInfo.quantity_index} dari{" "}
                          {ticketInfo.original_item.quantity}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Info Notice */}
              <div className="p-4 bg-amber-50">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Perhatian:</p>
                    <ul className="space-y-1">
                      <li>• Isi Nomor Polisi sesuai dengan STNK</li>
                      <li>
                        • Golongan tidak sesuai akan dikenakan biaya tambahan
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Nomor Polisi */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <CreditCard className="w-4 h-4" />
                      Nomor Polisi
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      placeholder="Contoh: B 1234 XYZ"
                      maxLength={15}
                      {...register(`kendaraan.${index}.nomor_polisi`)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, "");
                      }}
                    />
                    {errors.kendaraan?.[index]?.nomor_polisi && (
                      <p className="text-xs text-red-500">
                        {errors.kendaraan[index]?.nomor_polisi?.message}
                      </p>
                    )}
                  </div>

                  {/* Golongan Kendaraan */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <Car className="w-4 h-4" />
                      Golongan Kendaraan
                    </Label>
                    <Input
                      className="h-11 bg-gray-50 text-gray-500 text-sm"
                      value={ticketInfo?.class_name || ""}
                      readOnly
                    />
                  </div>

                  {/* Nama Pemilik */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <User className="w-4 h-4" />
                      Nama Pemilik
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      placeholder="Nama sesuai STNK"
                      maxLength={24}
                      {...register(`kendaraan.${index}.nama`)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
                      }}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Sesuai STNK (huruf saja)
                      </span>
                      <span
                        className={`${
                          (watch(`kendaraan.${index}.nama`)?.length || 0) > 20
                            ? "text-amber-600"
                            : "text-gray-400"
                        }`}
                      >
                        {watch(`kendaraan.${index}.nama`)?.length || 0}/24
                      </span>
                    </div>
                    {errors.kendaraan?.[index]?.nama && (
                      <p className="text-xs text-red-500">
                        {errors.kendaraan[index]?.nama?.message}
                      </p>
                    )}
                  </div>

                  {/* Usia Pemilik */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <Calendar className="w-4 h-4" />
                      Usia Pemilik
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan usia pemilik"
                      {...register(`kendaraan.${index}.usia`)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                    <p className="text-xs text-gray-500">Contoh: 35 (tahun)</p>
                    {errors.kendaraan?.[index]?.usia && (
                      <p className="text-xs text-red-500">
                        {errors.kendaraan[index]?.usia?.message}
                      </p>
                    )}
                  </div>

                  {/* Alamat Kendaraan */}
                  <div className="space-y-2 xl:col-span-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <MapPin className="w-4 h-4" />
                      Alamat
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      placeholder="Alamat pemilik kendaraan"
                      maxLength={100}
                      {...register(`kendaraan.${index}.alamat`)}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Alamat pemilik kendaraan
                      </span>
                      <span
                        className={`${
                          (watch(`kendaraan.${index}.alamat`)?.length || 0) > 80
                            ? "text-amber-600"
                            : "text-gray-400"
                        }`}
                      >
                        {watch(`kendaraan.${index}.alamat`)?.length || 0}/100
                      </span>
                    </div>
                    {errors.kendaraan?.[index]?.alamat && (
                      <p className="text-xs text-red-500">
                        {errors.kendaraan[index]?.alamat?.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Passenger Forms */}
        {passengerFields.map((field, index) => {
          const ticketInfo = passengerTickets[index];
          return (
            <Card key={field.id} className="shadow-md py-0 gap-0">
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Data Penumpang {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ticketInfo?.class_name}
                      {ticketInfo && ticketInfo.original_item.quantity > 1 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {ticketInfo.quantity_index} dari{" "}
                          {ticketInfo.original_item.quantity}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {/* Jenis Kelamin */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <User className="w-4 h-4" />
                      Jenis Kelamin
                    </Label>
                    <Select
                      value={watch(`penumpang.${index}.jenis_kelamin`) || ""}
                      onValueChange={(val) =>
                        setValue(
                          `penumpang.${index}.jenis_kelamin`,
                          val as "pria" | "wanita"
                        )
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pria">Pria</SelectItem>
                        <SelectItem value="wanita">Wanita</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.penumpang?.[index]?.jenis_kelamin && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.jenis_kelamin?.message}
                      </p>
                    )}
                  </div>

                  {/* Nama Lengkap */}
                  <div className="space-y-2 xl:col-span-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <User className="w-4 h-4" />
                      Nama Lengkap
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      placeholder="Nama sesuai identitas"
                      maxLength={24}
                      {...register(`penumpang.${index}.nama`)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
                      }}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Sesuai KTP/SIM/Paspor (tanpa gelar, huruf saja)
                      </span>
                      <span
                        className={`${
                          (watch(`penumpang.${index}.nama`)?.length || 0) > 20
                            ? "text-amber-600"
                            : "text-gray-400"
                        }`}
                      >
                        {watch(`penumpang.${index}.nama`)?.length || 0}/24
                      </span>
                    </div>
                    {errors.penumpang?.[index]?.nama && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.nama?.message}
                      </p>
                    )}
                  </div>

                  {/* Jenis ID */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <CreditCard className="w-4 h-4" />
                      Jenis Identitas
                    </Label>
                    <Select
                      value={watch(`penumpang.${index}.jenis_id`) || ""}
                      onValueChange={(val) =>
                        setValue(
                          `penumpang.${index}.jenis_id`,
                          val as "nik" | "sim" | "paspor"
                        )
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Pilih jenis ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nik">NIK (KTP)</SelectItem>
                        <SelectItem value="sim">SIM</SelectItem>
                        <SelectItem value="paspor">Paspor</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.penumpang?.[index]?.jenis_id && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.jenis_id?.message}
                      </p>
                    )}
                  </div>

                  {/* Nomor Identitas */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <CreditCard className="w-4 h-4" />
                      Nomor Identitas
                    </Label>
                    {(() => {
                      const currentJenisId = watch(
                        `penumpang.${index}.jenis_id`
                      );
                      const currentNomor =
                        watch(`penumpang.${index}.nomor_identitas`) || "";
                      const format = getIdentityFormat(currentJenisId);
                      const validation = validateIdentityInput(
                        currentJenisId,
                        currentNomor
                      );

                      return (
                        <>
                          <Input
                            className={`h-11 placeholder:text-sm text-sm ${
                              !validation.isValid
                                ? "border-red-300 focus:border-red-500"
                                : ""
                            }`}
                            placeholder={format.placeholder}
                            maxLength={format.digits}
                            inputMode="numeric"
                            {...register(`penumpang.${index}.nomor_identitas`)}
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement;
                              target.value = target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                          />
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">
                              {format.description}
                            </span>
                            <span
                              className={`${
                                !validation.isValid
                                  ? "text-red-500"
                                  : currentNomor.length === format.digits
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {currentNomor.length}/{format.digits}
                            </span>
                          </div>
                          {!validation.isValid && validation.message && (
                            <p className="text-xs text-amber-600">
                              {validation.message}
                            </p>
                          )}
                        </>
                      );
                    })()}
                    {errors.penumpang?.[index]?.nomor_identitas && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.nomor_identitas?.message}
                      </p>
                    )}
                  </div>

                  {/* Usia */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <Calendar className="w-4 h-4" />
                      Usia
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan usia"
                      {...register(`penumpang.${index}.usia`)}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                    <p className="text-xs text-gray-500">Contoh: 25 (tahun)</p>
                    {errors.penumpang?.[index]?.usia && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.usia?.message}
                      </p>
                    )}
                  </div>

                  {/* Alamat */}
                  <div className="space-y-2 xl:col-span-3">
                    <Label className="flex items-center gap-2 text-gray-700 text-sm">
                      <MapPin className="w-4 h-4" />
                      Alamat
                    </Label>
                    <Input
                      className="h-11 placeholder:text-sm text-sm"
                      placeholder="Alamat lengkap tempat tinggal"
                      maxLength={100}
                      {...register(`penumpang.${index}.alamat`)}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Contoh: Jl. Merdeka No. 123, Kelurahan Air Dingin,
                        Kecamatan Johan Pahlawan
                      </span>
                      <span
                        className={`${
                          (watch(`penumpang.${index}.alamat`)?.length || 0) > 80
                            ? "text-amber-600"
                            : "text-gray-400"
                        }`}
                      >
                        {watch(`penumpang.${index}.alamat`)?.length || 0}/100
                      </span>
                    </div>
                    {errors.penumpang?.[index]?.alamat && (
                      <p className="text-xs text-red-500">
                        {errors.penumpang[index]?.alamat?.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-12 bg-Blue text-white hover:bg-teal-600 font-medium flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <span>Lanjutkan ke Verifikasi</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
