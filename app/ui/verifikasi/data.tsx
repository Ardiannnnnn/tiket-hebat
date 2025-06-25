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
import { useRouter } from "next/navigation";
import { submitPassengerData } from "@/service/passenger";
import { useParams } from "next/navigation";
import { PassengerEntry, TicketEntryPayload } from "@/types/passenger";
import { useForm, FormProvider } from "react-hook-form";
import FormPemesan from "./formPemesan";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ClaimSessionResponse } from "@/types/responBook";
import { AxiosResponse } from "axios";
import {
  Users,
  Car,
  Eye,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
} from "lucide-react";

interface Passenger {
  nama: string;
  kelas: string;
  usia: number;
  jk: string;
  id: number;
  noID: string;
  alamat: string;
  jenisID: string;
  ticket_id: number;
  seat_number: string;
}

interface Vehicle {
  nomor_polisi: string;
  kelas: string;
  ticket_id: number;
  nama: string; // Nama pemilik kendaraan
  usia: number; // Usia kendaraan tidak relevan
  alamat: string; // Alamat pemilik kendaraan
}

const Detail = ({ penumpang }: { penumpang: Passenger }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${poppins.className} w-72 p-4 shadow-lg rounded-lg bg-white border`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Detail Penumpang</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Nama:</span>
              <span className="col-span-2">{penumpang.nama}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Alamat:</span>
              <span className="col-span-2">{penumpang.alamat}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Umur:</span>
              <span className="col-span-2">{penumpang.usia} tahun</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Kelamin:</span>
              <span className="col-span-2">{penumpang.jk}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">ID:</span>
              <span className="col-span-2">{penumpang.jenisID}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">No ID:</span>
              <span className="col-span-2">{penumpang.noID}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DetailKendaraan = ({ kendaraan }: { kendaraan: Vehicle }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${poppins.className} w-72 p-4 shadow-lg rounded-lg bg-white border`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Car className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-800">Detail Kendaraan</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Pemilik:</span>
              <span className="col-span-2">{kendaraan.nama}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Alamat:</span>
              <span className="col-span-2">{kendaraan.alamat}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">No Polisi:</span>
              <span className="col-span-2 font-mono">
                {kendaraan.nomor_polisi}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Kelas:</span>
              <span className="col-span-2">{kendaraan.kelas}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const KelasBadge = ({ kelas }: { kelas: string }) => {
  const kelasStyles: Record<string, string> = {
    ECONOMY: "bg-blue-100 text-blue-800 border-blue-200",
    BUSSINESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
    VIP: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium border",
        kelasStyles[kelas]
      )}
    >
      {kelas}
    </span>
  );
};

interface DataProps {
  sessionId: string;
}

export default function Data({ sessionId }: DataProps) {
  const [penumpangList, setPenumpangList] = useState<Passenger[]>([]);
  const [kendaraanList, setKendaraanList] = useState<Vehicle[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const form = useForm({
    mode: "onChange", // validasi realtime
    defaultValues: {
      nama: "",
      nohp: "",
      email: "",
      jenisID: "", // Default jenis ID
      noID: "",
    },
  });

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
          ticket_id: p.ticket_id,
          seat_number: p.seat_number,
        }));

        const transformedKendaraan = kendaraan.map((p: any) => ({
          nomor_polisi: p.nomor_polisi,
          kelas: p.kelas,
          ticket_id: p.ticket_id,
          nama: p.nama_kendaraan || p.nama, // Nama kendaraan atau pemilik
          usia: p.umur || 21, // Usia kendaraan tidak relevan
          alamat: p.alamat_kendaraan || p.alamat, // Alamat pemilik kendaraan
        }));

        setPenumpangList(transformedPenumpang);
        setKendaraanList(transformedKendaraan);
        console.log(
          "ini data semuanya",
          transformedPenumpang,
          transformedKendaraan
        );
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  // Cek validitas form
  const isFormValid = form.formState.isValid;

  const handleClickPesanTiket = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Isi data pemesan terlebih dahulu");
      return;
    }
    setOpenConfirm(true);
  };

  // Ubah handleSubmit: hanya POST, dapatkan order_id, tampilkan dialog pembayaran
  const handleSubmitAndRedirect = async () => {
    if (!sessionId) {
      console.error("Session ID tidak ditemukan.");
      return;
    }

    const pemesan = form.getValues(); // { nama, nohp, email }

    const passengerData: PassengerEntry[] = penumpangList.map((p) => ({
      ticket_id: p.ticket_id,
      passenger_name: p.nama,
      passenger_age: p.usia,
      address: p.alamat,
      id_type: p.jenisID,
      id_number: p.noID,
      seat_number: p.seat_number,
    }));

    const vehicleData = kendaraanList.map((k) => ({
      ticket_id: k.ticket_id,
      license_plate: k.nomor_polisi,
      passenger_name: k.nama,
      passenger_age: k.usia, // Pastikan usia disertakan
      address: k.alamat,
    }));

    console.log("DEBUG: datadatakendaraan:", vehicleData);

    const ticketData = [...passengerData, ...vehicleData];

    const payload: TicketEntryPayload = {
      session_id: sessionId,
      customer_name: pemesan.nama,
      phone_number: pemesan.nohp,
      email: pemesan.email,
      id_type: pemesan.jenisID,
      id_number: pemesan.noID,
      ticket_data: ticketData,
    };

    console.log("DEBUG: payload:", payload);

    try {
      const response: AxiosResponse<ClaimSessionResponse> =
        await submitPassengerData(payload);
      const order_id = response.data.order_id;

      if (order_id) {
        setOrderId(order_id);
        router.push(`/book/${id}/bayar?order_id=${order_id}`);
      } else {
        toast.error("Gagal mendapatkan order id.");
      }
    } catch (err) {
      console.error("Gagal mengirim data penumpang:", err);
      toast.error("Gagal memproses data. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Data Card */}
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

      {/* Passenger Data Card */}
      {penumpangList.length > 0 && (
        <Card className="shadow-md py-0 gap-0">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span>Data Penumpang</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
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

      {/* Form Pemesan */}
      <FormProvider {...form}>
        <FormPemesan />
      </FormProvider>

      {/* Enhanced Submit Button */}
      <Button
        onClick={handleClickPesanTiket}
        className="w-full h-12 bg-Blue hover:bg-teal-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Pesan Tiket</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* Enhanced Confirmation Dialog */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Pastikan data yang Anda masukkan sudah benar. Setelah konfirmasi,
              Anda akan diarahkan ke halaman pembayaran dan tidak bisa kembali
              ke halaman verifikasi lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitAndRedirect}
              className="flex-1 bg-Blue text-white hover:bg-teal-600 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Ya, Lanjutkan Bayar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
