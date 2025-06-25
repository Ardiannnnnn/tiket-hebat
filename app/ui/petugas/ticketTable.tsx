// app/ui/petugas/ticketTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCheckInTicket } from "@/app/hooks/useTickets";
import {
  CheckCircle,
  Clock,
  Users,
  Car,
  UserCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface TicketTableProps {
  tickets: any[];
  showCheckInActions?: boolean; // ✅ NEW: untuk control apakah show check-in actions
}

export default function TicketTable({
  tickets,
  showCheckInActions = false,
}: TicketTableProps) {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [batchCheckInDialogOpen, setBatchCheckInDialogOpen] = useState(false); // ✅ Add batch dialog state
  const [ticketToCheckIn, setTicketToCheckIn] = useState<number | null>(null);

  const scheduleId = tickets[0]?.schedule?.id;
  const checkInMutation = useCheckInTicket(scheduleId);

  // ✅ Handle single check-in - show dialog first
  const handleSingleCheckIn = (ticketId: number) => {
    setTicketToCheckIn(ticketId);
    setCheckInDialogOpen(true);
  };

  // ✅ Handle batch check-in - show dialog first
  const handleBatchCheckIn = () => {
    if (selectedTickets.length === 0) {
      toast.error("Pilih tiket terlebih dahulu");
      return;
    }
    setBatchCheckInDialogOpen(true); // ✅ Show dialog instead of direct execution
  };

  // ✅ Confirm single check-in
  const confirmCheckIn = async () => {
    if (!ticketToCheckIn) return;

    try {
      console.log(`🔄 Starting check-in for ticket: ${ticketToCheckIn}`);
      await checkInMutation.mutateAsync(ticketToCheckIn);

      setCheckInDialogOpen(false);
      setTicketToCheckIn(null);

      console.log(`✅ Check-in process completed`);
    } catch (error) {
      console.error("❌ Check-in error:", error);
    }
  };

  // ✅ Confirm batch check-in
  const confirmBatchCheckIn = async () => {
    try {
      console.log(
        `🔄 Starting batch check-in for ${selectedTickets.length} tickets`
      );

      // Check-in selected tickets one by one
      for (const ticketId of selectedTickets) {
        await checkInMutation.mutateAsync(ticketId);
      }

      setBatchCheckInDialogOpen(false);
      setSelectedTickets([]);
      toast.success(`${selectedTickets.length} tiket berhasil di check-in!`);

      console.log(`✅ Batch check-in completed`);
    } catch (error) {
      console.error("❌ Batch check-in error:", error);
    }
  };

  // ✅ Handle checkbox selection
  const handleSelectTicket = (ticketId: number, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    }
  };

  // ✅ Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const checkableTickets = tickets
        .filter((ticket) => !ticket.is_checked_in)
        .map((ticket) => ticket.id);
      setSelectedTickets(checkableTickets);
    } else {
      setSelectedTickets([]);
    }
  };

  const getStatusBadge = (ticket: any) => {
    if (ticket.is_checked_in) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Check-in
        </Badge>
      );
    }

    switch (ticket.status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <UserCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        return <Badge variant="secondary">{ticket.status || "Pending"}</Badge>;
    }
  };

  const canCheckIn = (ticket: any) => {
    return ticket.status === "confirmed" && !ticket.is_checked_in;
  };

  // ✅ Enhanced debugging
  console.log(
    "🎫 Current tickets in table:",
    tickets.map((t) => ({
      id: t.id,
      is_checked_in: t.is_checked_in,
      status: t.status,
      passenger_name: t.passenger_name || t.license_plate,
    }))
  );

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Tidak ada tiket untuk jadwal ini.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* ✅ Batch Actions - Only show for check-in page */}
        {showCheckInActions && selectedTickets.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {selectedTickets.length} tiket dipilih
              </span>
            </div>
            <Button
              onClick={handleBatchCheckIn} // ✅ Now shows dialog first
              disabled={checkInMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {checkInMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Check-in...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check-in {selectedTickets.length} Tiket
                </>
              )}
            </Button>
          </div>
        )}

        {/* ✅ Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {showCheckInActions && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedTickets.length > 0 &&
                        selectedTickets.length ===
                          tickets.filter((t) => !t.is_checked_in).length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>No</TableHead>
                <TableHead>Nama/Kendaraan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket, index) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  {showCheckInActions && (
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTicket(ticket.id, checked as boolean)
                        }
                        disabled={ticket.is_checked_in}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {ticket.type === "passenger"
                          ? ticket.passenger_name
                          : ticket.license_plate}
                      </p>
                      {ticket.type === "passenger" && (
                        <p className="text-sm text-gray-500">
                          {ticket.id_number} • {ticket.passenger_age} tahun
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ticket.type === "passenger" ? (
                        <Users className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Car className="w-4 h-4 text-orange-600" />
                      )}
                      <span className="capitalize">{ticket.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">
                      {ticket.address || "N/A"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ticket.class?.class_name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket)}</TableCell>
                  <TableCell className="font-medium">
                    Rp{ticket.price?.toLocaleString() || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ✅ Single Check-in Confirmation Dialog */}
      <AlertDialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              Konfirmasi Verifikasi
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin untuk melakukan verifikasi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCheckInDialogOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCheckIn}
              disabled={checkInMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {checkInMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Ya, Verifikasi"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Batch Check-in Confirmation Dialog */}
      <AlertDialog
        open={batchCheckInDialogOpen}
        onOpenChange={setBatchCheckInDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              Konfirmasi Verifikasi Batch
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin untuk melakukan verifikasi{" "}
              {selectedTickets.length} tiket sekaligus?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBatchCheckInDialogOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBatchCheckIn}
              disabled={checkInMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {checkInMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Ya, Verifikasi ${selectedTickets.length} Tiket`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
