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
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const stored = sessionStorage.getItem("dataPenumpang");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        // DEBUG: cek hasil parsing
        console.log("DEBUG: dataPenumpang dari localStorage:", parsed);
        const transformed = parsed.map((p, idx) => {
          // DEBUG: cek setiap penumpang dan ticket_id
          console.log(`DEBUG: penumpang[${idx}]`, p);
          return {
            nama: p.nama,
            kelas: p.kelas,
            usia: p.usia,
            jk: p.jenis_kelamin ?? p.jk ?? "",
            id: p.id || 0,
            noID: p.nomor_identitas ?? p.noID ?? "",
            alamat: p.alamat,
            jenisID: p.jenis_id ?? p.jenisID ?? "",
            ticket_id: p.ticket_id,
            seat_number: p.seat_number ?? "",
          };
        });
        setPenumpangList(transformed);
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!sessionId) return console.error("Session ID tidak ditemukan.");

    // DEBUG: cek penumpangList sebelum submit
    console.log("DEBUG: penumpangList sebelum submit:", penumpangList);

    const payload = {
      session_id: sessionId,
      passenger_data: penumpangList.map((p, idx) => {
        // DEBUG: cek ticket_id sebelum submit
        console.log(`DEBUG: passenger_data[${idx}].ticket_id:`, p.ticket_id);
        return {
          ticket_id: p.ticket_id,
          passenger_name: p.nama,
          passenger_age: p.usia,
          address: p.alamat,
          id_type: p.jenisID,
          id_number: p.noID,
          seat_number: p.seat_number,
        };
      }),
    };

    // DEBUG: cek payload akhir
    console.log("Payload yang dikirim:", payload);

    try {
      await submitPassengerData(payload);
      router.push(`/book/${id}/invoice`);
    } catch (err) {
      console.error("Gagal mengirim data penumpang:", err);
    }
  };

  return (
    <div className="space-y-8">
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

      <div
        className="bg-Blue p-2 rounded-xl text-center text-white hover:bg-teal-600 font-semibold cursor-pointer"
        onClick={handleSubmit}
      >
        Pesan Tiket
      </div>
    </div>
  );
}