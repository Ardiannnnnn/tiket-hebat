"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { poppins } from "@/app/ui/fonts";

const schedules = [
  {
    id: 1,
    route: "Slnabang - Calang",
    departureDay: "Minggu",
    departureDate: "01 Desember 2024",
    departureTime: "17.00 WIB",
    arrivalDay: "Senin",
    arrivalDate: "02 Desember 2024",
    arrivalTime: "08.00 WIB",
    ship: "Aceh Hebat 1",
  },
  {
    id: 2,
    route: "Slnabang - Calang",
    departureDay: "Minggu",
    departureDate: "01 Desember 2024",
    departureTime: "17.00 WIB",
    arrivalDay: "Senin",
    arrivalDate: "02 Desember 2024",
    arrivalTime: "08.00 WIB",
    ship: "Aceh Hebat 1",
  },
  {
    id: 3,
    route: "Slnabang - Calang",
    departureDay: "Minggu",
    departureDate: "01 Desember 2024",
    departureTime: "17.00 WIB",
    arrivalDay: "Senin",
    arrivalDate: "02 Desember 2024",
    arrivalTime: "08.00 WIB",
    ship: "Aceh Hebat 1",
  },
  {
    id: 4,
    route: "Slnabang - Calang",
    departureDay: "Minggu",
    departureDate: "01 Desember 2024",
    departureTime: "17.00 WIB",
    arrivalDay: "Senin",
    arrivalDate: "02 Desember 2024",
    arrivalTime: "08.00 WIB",
    ship: "Aceh Hebat 1",
  },
];

export default function JadwalKapal() {
  return (
    <div className= {`${poppins.className } md:m-24 m-4 mt-10`}>
      <div className="p-4 bg-white border border-Orange rounded-lg">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 mt-4">
          <Input
            placeholder="Cari Jadwal..."
            className="mb-4 md:w-1/3 border-Blue border-2"
          />
          <h2 className="text-xl font-semibold text-gray-500 text-center">
            Jadwal Keberangkatan Kapal Feri PT ASDP Singkil
          </h2>
        </div>
        <Table className="mt-4 mb-4">
          <TableHeader>
            <TableRow className="bg-teal-200 ">
              <TableHead className="w-12">No</TableHead>
              <TableHead>Rute</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Kapal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow key={schedule.id}>
                <TableCell className="p-4">{index + 1}.</TableCell>
                <TableCell className="font-semibold">
                  {schedule.route}
                </TableCell>
                <TableCell>{schedule.departureDay}</TableCell>
                <TableCell>{schedule.departureDate}</TableCell>
                <TableCell>{schedule.departureTime}</TableCell>
                <TableCell>{schedule.arrivalDay}</TableCell>
                <TableCell>{schedule.arrivalDate}</TableCell>
                <TableCell>{schedule.arrivalTime}</TableCell>
                <TableCell>{schedule.ship}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
