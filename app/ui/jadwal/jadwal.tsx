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
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Schedule } from "@/types/schedule";
import { toast } from "sonner";
import { getSchedule } from "@/service/schedule";

// Helper functions for date formatting
const getFormattedDate = (datetime: string) => {
  const date = new Date(datetime);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getFormattedTime = (datetime: string) => {
  const date = new Date(datetime);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFormattedDay = (datetime: string) => {
  const date = new Date(datetime);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
  });
};

export default function JadwalKapal() {
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 1000);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSchedule();
      if (response && response.status) {
        setScheduleData(response.data || []);
      } else {
        toast.error("Gagal memuat data");
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
  const search = debouncedSearch.toLowerCase();
  return scheduleData.filter((item) =>
    [
      item.departure_harbor.harbor_name,
      item.arrival_harbor.harbor_name,
      item.ship.ship_name,
      getFormattedDate(item.departure_datetime),
      getFormattedTime(item.departure_datetime),
      getFormattedDay(item.departure_datetime),
      getFormattedDate(item.arrival_datetime),
      getFormattedTime(item.arrival_datetime),
      getFormattedDay(item.arrival_datetime),
    ].some((field) => String(field).toLowerCase().includes(search))
  );
}, [debouncedSearch, scheduleData]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

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
            <TableRow className="bg-teal-200">
              <TableHead className="w-12">No</TableHead>
              <TableHead>Rute</TableHead>
              <TableHead>Hari Berangkat</TableHead>
              <TableHead>Tanggal Berangkat</TableHead>
              <TableHead>Jam Berangkat</TableHead>
              <TableHead>Hari Tiba</TableHead>
              <TableHead>Tanggal Tiba</TableHead>
              <TableHead>Jam Tiba</TableHead>
              <TableHead>Kapal</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((schedule, index) => (
              <TableRow key={schedule.id}>
                <TableCell className="p-4">{index + 1}.</TableCell>
                <TableCell className="font-semibold">
                  {schedule.departure_harbor.harbor_name} -{" "}
                  {schedule.arrival_harbor.harbor_name}
                </TableCell>
                <TableCell>{getFormattedDay(schedule.departure_datetime)}</TableCell>
                <TableCell>{getFormattedDate(schedule.departure_datetime)}</TableCell>
                <TableCell>{getFormattedTime(schedule.departure_datetime)}</TableCell>
                <TableCell>{getFormattedDay(schedule.arrival_datetime)}</TableCell>
                <TableCell>{getFormattedDate(schedule.arrival_datetime)}</TableCell>
                <TableCell>{getFormattedTime(schedule.arrival_datetime)}</TableCell>
                <TableCell>{schedule.ship.ship_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
