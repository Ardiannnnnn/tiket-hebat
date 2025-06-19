"use client";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { getScheduleAll } from "@/service/schedule";
import { getTickets } from "@/service/ticket";
import { Ticket, TicketMeta } from "@/types/ticket";
import { Button } from "@/components/ui/button";

export default function Tiket() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<TicketMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.id === selectedScheduleId);
  }, [schedules, selectedScheduleId]);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const data = await getScheduleAll();
        if (data) setSchedules(data.data);
      } catch (err) {
        console.error("Failed to fetch schedules", err);
      }
    }
    fetchSchedules();
  }, []);

  useEffect(() => {
    async function fetchTickets() {
      if (selectedScheduleId) {
        try {
          const ticketData = await getTickets(selectedScheduleId, currentPage);
          setTickets(ticketData.data);
          setMeta(ticketData.meta);
        } catch (err) {
          console.error("Failed to fetch tickets", err);
        }
      } else {
        setTickets([]);
        setMeta(null);
      }
    }
    fetchTickets();
  }, [selectedScheduleId, currentPage]);

  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (!debouncedSearch) return filtered;

    const searchLower = debouncedSearch.toLowerCase();
    return filtered.filter((item) =>
      [
        item.passenger_name,
        item.address,
        item.id_type,
        item.id_number,
        item.class.class_name,
        item.id.toString(),
        item.passenger_age.toString(),
      ].some((field) => field.toLowerCase().includes(searchLower))
    );
  }, [debouncedSearch, tickets, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <Toaster />
      <div>
        <h1 className="mb-2 font-semibold">
          Data Tiket {selectedSchedule ? `(${selectedSchedule.route_name || `${selectedSchedule.route?.departure_harbor?.harbor_name} - ${selectedSchedule.route?.arrival_harbor?.harbor_name}`} - ${formatDate(selectedSchedule.departure_datetime)})` : ""}
     
        </h1>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Select
              onValueChange={(val) => {
                setSelectedScheduleId(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jadwal" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.route_name || `${s.route?.departure_harbor?.harbor_name} - ${s.route?.arrival_harbor?.harbor_name}`} - {formatDate(s.departure_datetime)}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Cari Tiket..."
              className="mb-4 shadow-none focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Select
              onValueChange={(val) => setStatusFilter(val.trim() === "all" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="checkin">Checkin</SelectItem>
                <SelectItem value="pending_data_entry">Pending Data Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-Blue">Tambah</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Tipe ID</TableHead>
              <TableHead>Nomor ID</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket, index) => (
              <TableRow key={ticket.id}>
                <TableCell className="p-4">{(meta?.from || 0) + index}</TableCell>
                <TableCell>{ticket.passenger_name}</TableCell>
                <TableCell>{ticket.address}</TableCell>
                <TableCell>{ticket.passenger_age}</TableCell>
                <TableCell>{ticket.id_type}</TableCell>
                <TableCell>{ticket.id_number}</TableCell>
                <TableCell>{ticket.class.class_name}</TableCell>
                <TableCell>{ticket.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {meta.current_page} dari {meta.total_pages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={!meta.has_next_page}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
