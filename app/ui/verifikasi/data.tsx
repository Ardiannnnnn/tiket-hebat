"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
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
import FormPemesan from "./formPemesan"; // Pastikan path ini benar
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ClaimSessionResponse } from "@/types/responBook";
import { AxiosResponse } from "axios";

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
  nama : string; // Nama pemilik kendaraan
  usia: number; // Usia kendaraan tidak relevan
  alamat: string; // Alamat pemilik kendaraan
}

const Detail = ({ penumpang }: { penumpang: Passenger }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Detail</Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${poppins.className} w-64 p-4 shadow-lg rounded-lg bg-[#F7FAFF]`}
      >
        <div className="space-y-2 text-sm">
          <table>
            <tbody>
              <tr>
                <td className="pr-4 font-semibold">Nama</td>
                <td>: {penumpang.nama}</td>
              </tr>
              <tr>
                <td className="font-semibold">Alamat</td>
                <td>: {penumpang.alamat}</td>
              </tr>
              <tr>
                <td className="font-semibold">Umur</td>
                <td>: {penumpang.usia}</td>
              </tr>
              <tr>
                <td className="font-semibold">JK</td>
                <td>: {penumpang.jk}</td>
              </tr>
              <tr>
                <td className="font-semibold">ID</td>
                <td>: {penumpang.jenisID}</td>
              </tr>
              <tr>
                <td className="font-semibold">NoID</td>
                <td>: {penumpang.noID}</td>
              </tr>
              <tr>
                <td className="font-semibold">Kelas</td>
                <td>: {penumpang.kelas}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const KelasBadge = ({ kelas }: { kelas: string }) => {
  const kelasStyles: Record<string, string> = {
    ECONOMY: "bg-teal-400 text-white",
    BUSSINESS: "bg-yellow-300 text-black",
    VIP: "bg-orange-500 text-white",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-semibold",
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

        setPenumpangList(transformedPenumpang);
        setKendaraanList(kendaraan);
        console.log("ini data", parsed.penumpang, parsed.kendaraan);
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  console.log("DEBUG: kendaraan:", kendaraanList);

  // Cek validitas form
  const isFormValid = form.formState.isValid;

  const handleClickPesanTiket = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Isi data pemesan terlebih dahulu");
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmPesanTiket = async () => {
    setOpenDialog(false);
    await handleSubmit();
  };

  const handleSubmit = async () => {
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
      passenger_age: k.usia, // Usia kendaraan tidak relevan
      address: k.alamat 
    }));

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

    console.log("Payload yang dikirim:", payload);

    try {
      // atau beri type
      const response: AxiosResponse<ClaimSessionResponse> =
        await submitPassengerData(payload);
      console.log("RESPONSE:", response.data);

      // Perbaikan akses
      const invoiceUrl = response.data.xendit.invoice_url;
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
      } else {
        toast.error("Gagal mendapatkan link pembayaran.");
        console.error("Isi response:", response.data);
      }
    } catch (err) {
      console.error("Gagal mengirim data penumpang:", err);
      toast.error("Gagal memproses data. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-8">
      {kendaraanList.length > 0 && (
        <Card className={cn("py-0 gap-0")}>
          <CardHeader className="border-b p-4 text-center">
            <CardTitle>Detail Data Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="p-4 gap-4">
            <div className="border rounded-lg">
              <Table>
                {kendaraanList.map((kendaraan, index) => (
                  <TableBody key={index} className="border-b">
                    <TableRow>
                      <TableCell className="font-medium py-2 text-center">
                        {kendaraan.nomor_polisi}
                      </TableCell>
                      <TableCell className="text-center">
                        {kendaraan.kelas}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {penumpangList.length > 0 && (
        <Card className={cn("py-0 gap-0")}>
          <CardHeader className="border-b p-4 text-center">
            <CardTitle>Detail Data Penumpang</CardTitle>
          </CardHeader>
          <CardContent className="p-4 gap-4">
            <div className="border rounded-lg">
              <Table className="w-full border">
                <TableBody>
                  {penumpangList.map((penumpang, index) => (
                    <TableRow key={index} className="border-b">
                      <TableCell className="px-8">
                        <div className="flex flex-col">
                          <span className="font-medium">{penumpang.nama}</span>
                          <span className="text-sm text-gray-500">
                            {penumpang.noID}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-12">
                        <Detail penumpang={penumpang} />
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <KelasBadge kelas={penumpang.kelas} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tambahkan form pemesan di sini */}
      <FormProvider {...form}>
        <FormPemesan />
      </FormProvider>

      {/* Alert Dialog Konfirmasi */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <div
          className={cn(
            "bg-Blue p-2 rounded-xl text-center text-white font-semibold cursor-pointer",
            "hover:bg-teal-600"
          )}
          onClick={async () => {
            const valid = await form.trigger();
            if (!valid) {
              toast.error("Isi data pemesan terlebih dahulu");
              return;
            }
            setOpenDialog(true);
          }}
          tabIndex={0}
          role="button"
        >
          Pesan Tiket
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pemesanan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda hanya memiliki waktu <span className="font-bold">2 jam</span>{" "}
              untuk menyelesaikan pembayaran. Lanjutkan pesan tiket?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPesanTiket}
              className="bg-Blue text-white hover:bg-teal-600"
            >
              Ya, Pesan Tiket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
