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
import { useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import schedules from "@/lib/data/schedule.json";

export default function JadwalKapal() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  
    const handleSearch = useDebouncedCallback((term: string) => {
        setDebouncedSearch(term);
      }, 1000);
  
      const filteredSchedules = useMemo(() => {
        return schedules.filter((schedule) => {
          const searchLower = debouncedSearch.toLowerCase();
          return (
            schedule.route.toLowerCase().includes(searchLower) ||
            schedule.departureDay.toLowerCase().includes(searchLower) ||
            schedule.departureDate.toLowerCase().includes(searchLower) ||
            schedule.departureTime.toLowerCase().includes(searchLower) ||
            schedule.arrivalDay.toLowerCase().includes(searchLower) ||
            schedule.arrivalDate.toLowerCase().includes(searchLower) ||
            schedule.arrivalTime.toLowerCase().includes(searchLower) ||
            schedule.ship.toLowerCase().includes(searchLower)
          );
        });
      }, [debouncedSearch]);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        },
        [handleSearch]
      );

      console.log(filteredSchedules);

  return (
    <div className={`${poppins.className} md:m-24 m-4 mt-10`}>
      <div className="p-4 bg-white border border-Orange rounded-lg">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 mt-4">
          <Input
            placeholder="Cari Jadwal..."
            className="mb-4 md:w-1/3 h-10 border-Blue border-2 shadow-none focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
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
            {filteredSchedules.map((schedule, index) => (
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
