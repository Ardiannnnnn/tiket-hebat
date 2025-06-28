// app/ui/verifikasi/data.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { poppins } from "../fonts";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormPemesan from "./formPemesan";
import {
  Users,
  Car,
  Eye,
  User,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { pemesanSchema, type PemesanFormData } from "@/lib/pemesanSchema";

// ✅ Same interfaces...
interface Passenger {
  nama: string;
  kelas: string;
  usia: number;
  jk: string;
  id: number;
  noID: string;
  alamat: string;
  jenisID: string;
  class_id: number;
  seat_number?: string;
}

interface Vehicle {
  nomor_polisi: string;
  kelas: string;
  class_id: number;
  nama: string;
  usia: number;
  alamat: string;
}

// ✅ Simplified DataProps - Remove submit props
interface DataProps {
  sessionId: string;
  selectedPayment: string;
  onFormValidationChange: (isValid: boolean, formData: any) => void;
  isProcessing: boolean;
}

export default function Data({
  sessionId,
  selectedPayment,
  onFormValidationChange,
  isProcessing,
}: DataProps) {
  const [penumpangList, setPenumpangList] = useState<Passenger[]>([]);
  const [kendaraanList, setKendaraanList] = useState<Vehicle[]>([]);

  // ✅ Form setup - same as before
  const form = useForm<PemesanFormData>({
    resolver: zodResolver(pemesanSchema),
    mode: "onChange",
    defaultValues: {
      nama: "",
      nohp: "",
      email: "",
      jenisID: "nik",
      noID: "",
    },
  });

  // ✅ Form validation logic - same as before
  const formValues = form.watch();
  const formErrors = form.formState.errors;
  const isFormValid = form.formState.isValid;

  const validateFormData = () => {
    const requiredFields = ["nama", "nohp", "email", "jenisID", "noID"];
    const hasAllFields = requiredFields.every(
      (field) =>
        formValues[field as keyof PemesanFormData] &&
        String(formValues[field as keyof PemesanFormData]).trim() !== ""
    );

    const hasValidationErrors = Object.keys(formErrors).length > 0;

    const manualValidation = {
      namaValid: formValues.nama && formValues.nama.length >= 2,
      nohpValid: formValues.nohp && formValues.nohp.length >= 10,
      emailValid: formValues.email && formValues.email.includes("@"),
      jenisIDValid:
        formValues.jenisID &&
        ["nik", "sim", "pasport"].includes(formValues.jenisID),
      noIDValid: formValues.noID && formValues.noID.length > 0,
    };

    const isManuallyValid = Object.values(manualValidation).every(Boolean);

    return (
      hasAllFields && !hasValidationErrors && isFormValid && isManuallyValid
    );
  };

  const isPemesanDataValid = validateFormData();

  // ✅ Notify parent about form validation changes
  useEffect(() => {
    onFormValidationChange(isPemesanDataValid, form.getValues());
  }, [
    isPemesanDataValid,
    formValues.nama,
    formValues.nohp,
    formValues.email,
    formValues.jenisID,
    formValues.noID,
    onFormValidationChange,
  ]);

  // ✅ Load data useEffect - same as before
  useEffect(() => {
    const stored = sessionStorage.getItem("dataPenumpang");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const kendaraan = parsed.kendaraan || [];
        const penumpang = parsed.penumpang || [];

        const transformedPenumpang = penumpang.map((p: any) => ({
          nama: p.nama,
          kelas: p.kelas,
          usia: Number(p.usia),
          jk: p.jenis_kelamin ?? p.jk ?? "",
          id: p.id || 0,
          noID: p.nomor_identitas ?? p.noID ?? "",
          alamat: p.alamat,
          jenisID: p.jenis_id ?? p.jenisID ?? "",
          class_id: p.class_id,
          seat_number: p.seat_number,
        }));

        const transformedKendaraan = kendaraan.map((p: any) => ({
          nomor_polisi: p.nomor_polisi,
          kelas: p.kelas,
          class_id: p.class_id,
          nama: p.nama_kendaraan || p.nama,
          usia: p.umur || 21,
          alamat: p.alamat_kendaraan || p.alamat,
        }));

        setPenumpangList(transformedPenumpang);
        setKendaraanList(transformedKendaraan);
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  // ✅ Detail components - same as before...
  const Detail = ({ penumpang }: { penumpang: Passenger }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <Eye className="w-4 h-4 mr-1" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Detail Penumpang</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama:</span>
              <span className="font-medium">{penumpang.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usia:</span>
              <span className="font-medium">{penumpang.usia} tahun</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jenis Kelamin:</span>
              <span className="font-medium">
                {penumpang.jk === "L" ? "Laki-laki" : "Perempuan"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jenis ID:</span>
              <span className="font-medium uppercase">{penumpang.jenisID}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor ID:</span>
              <span className="font-medium">{penumpang.noID}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alamat:</span>
              <span className="font-medium text-right max-w-[150px]">
                {penumpang.alamat}
              </span>
            </div>
            {penumpang.seat_number && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kursi:</span>
                <span className="font-medium">{penumpang.seat_number}</span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const DetailKendaraan = ({ kendaraan }: { kendaraan: Vehicle }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 hover:bg-green-50"
        >
          <Eye className="w-4 h-4 mr-1" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Detail Kendaraan</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor Polisi:</span>
              <span className="font-medium font-mono">
                {kendaraan.nomor_polisi}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nama Kendaraan:</span>
              <span className="font-medium">{kendaraan.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kelas:</span>
              <span className="font-medium">{kendaraan.kelas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alamat:</span>
              <span className="font-medium text-right max-w-[150px]">
                {kendaraan.alamat}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const KelasBadge = ({ kelas }: { kelas: string }) => {
    const getKelasStyle = (kelas: string) => {
      switch (kelas?.toLowerCase()) {
        case "ekonomi":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "bisnis":
          return "bg-purple-100 text-purple-800 border-purple-200";
        case "vip":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "motor":
          return "bg-green-100 text-green-800 border-green-200";
        case "mobil":
          return "bg-orange-100 text-orange-800 border-orange-200";
        case "truk":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          getKelasStyle(kelas),
          poppins.className
        )}
      >
        {kelas}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ✅ Vehicle Data Card - same as before */}
      {kendaraanList.length > 0 && (
        <Card className="shadow-md py-0 gap-0">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-green-600" />
              </div>
              <span>Data Kendaraan</span>
              <span className="text-sm font-normal text-gray-500">
                ({kendaraanList.length} kendaraan)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {kendaraanList.map((kendaraan, index) => (
                    <TableRow key={index} className="border-b last:border-b-0">
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Car className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <div className="font-mono font-semibold">
                              {kendaraan.nomor_polisi}
                            </div>
                            <div className="text-sm text-gray-500">
                              {kendaraan.nama}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <KelasBadge kelas={kendaraan.kelas} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DetailKendaraan kendaraan={kendaraan} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Passenger Data Card - same as before */}
      {penumpangList.length > 0 && (
        <Card className="shadow-md py-0 gap-0">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span>Data Penumpang</span>
              <span className="text-sm font-normal text-gray-500">
                ({penumpangList.length} penumpang)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {penumpangList.map((penumpang, index) => (
                    <TableRow key={index} className="border-b last:border-b-0">
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {penumpang.nama}
                            </div>
                            <div className="text-sm text-gray-500">
                              {penumpang.noID}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <KelasBadge kelas={penumpang.kelas} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Detail penumpang={penumpang} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Form Pemesan - same as before */}
      <FormProvider {...form}>
        <FormPemesan />
      </FormProvider>

      {/* ✅ Submit Button REMOVED - Now in PaymentSelection */}
    </div>
  );
}
