import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { poppins } from "../fonts";

const DataVerifikasi = {
  jumlah_kendaraan: [
    { id: 1, jenisKendaraan: "golongan II", nomor: "BL 2023 SE" },
    { id: 2, jenisKendaraan: "Golongan I", nomor: "BL 2024 SE" },
  ],
  jumlah_penumpang: [
    {
      id: 1,
      nama: "Ardian",
      kelas: "Ekonomi",
      jk: "Pria",
      jenisID: "KTP",
      noID: "123456789123456789",
      usia: 18,
      alamat: "Air Dingin",
    },
    {
      id: 2,
      nama: "Plut",
      kelas: "Bisnis",
      jk: "Wanita",
      jenisID: "KTP",
      noID: "123456789123456789",
      usia: 20,
      alamat: "Suka Jaya",
    },
    {
      id: 1,
      nama: "Kupi",
      kelas: "VIP",
      jk: "Pria",
      jenisID: "KTP",
      noID: "123456789123456789",
      usia: 21,
      alamat: "Suka Makmur",
    },
  ],
};

interface Passenger {
  nama: string;
  kelas: string;
  usia: number;
  jk: string;
  id: number;
  noID: string;
  alamat: string;
  jenisID: string;

}

const Detail = ({penumpang} : {penumpang: Passenger}) => {
    return (
      <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Detail</Button>
      </PopoverTrigger>
      <PopoverContent className={`${poppins.className} w-64 p-4 shadow-lg rounded-lg bg-[#F7FAFF]`}>
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
    )
}

const KelasBadge = ({ kelas }: { kelas: string }) => {
  const kelasStyles: Record<string, string> = {
    Ekonomi: "bg-gray-100 text-gray-700",
    Bisnis: "bg-yellow-300 text-black",
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

export default function Data() {
  return (
    <div className="space-y-8">
      <Card className={cn("py-0 gap-0")}>
        <CardHeader className="border-b p-4 text-center">
          <CardTitle>Detail Data Kendaraan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 gap-4">
          {/* kendaraan */}
          <div className="border rounded-lg">
            <Table>
              {DataVerifikasi.jumlah_kendaraan.map((kendaraan, index) => (
                <TableBody key={index} className="border-b">
                  <TableRow>
                    <TableCell className="font-medium px-4 py-4">
                      {kendaraan.jenisKendaraan}
                    </TableCell>
                    <TableCell className="text-right">
                      {kendaraan.nomor}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Penumpang */}

      <Card className={cn("py-0 gap-0")}>
        <CardHeader className="border-b p-4 text-center">
          <CardTitle>Detail Data Penumpang</CardTitle>
        </CardHeader>
        <CardContent className="p-4 gap-4">
          {/* kendaraan */}
          <div className="border rounded-lg">
            <Table className="w-full border">
              <TableBody>
                {DataVerifikasi.jumlah_penumpang.map((penumpang, index) => (
                  <TableRow key={index} className="border-b">
                    {/* Nama & ID */}
                    <TableCell className="px-8">
                      <div className="flex flex-col">
                        <span className="font-medium">{penumpang.nama}</span>
                        <span className="text-sm text-gray-500">
                          {penumpang.noID}
                        </span>
                      </div>
                    </TableCell>

                    {/* Tombol Detail */}
                    <TableCell className="px-12">
                      <Detail penumpang={penumpang}/>
                    </TableCell>

                    {/* Kelas Penumpang */}
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
      <div className=" bg-Blue p-2 rounded-xl text-center text-white hover:bg-teal-600 font-semibold">
        <Link href="/book/invoice">Pesan Tiket</Link>
      </div>
    </div>
  );
}
