"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQuotaByScheduleId } from "@/service/quota";
import { toast } from "sonner";
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
import { TicketForm } from "@/types/ticket";
import { useCreateTicket } from "@/app/hooks/useTickets";

interface TambahModalProps {
  scheduleId: number;
  scheduleData?: any;
}

interface ClassAvailability {
  class_id: number;
  class_name: string;
  available_capacity: number;
  price: number;
  currency: string;
  type: string;
}

export default function TambahModal({
  scheduleId,
  scheduleData,
}: TambahModalProps) {
  const [open, setOpen] = useState(false);
  const [quota, setQuota] = useState<ClassAvailability[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassAvailability | null>(
    null
  );
  const [formData, setFormData] = useState<TicketForm>({
    schedule_id: scheduleId,
    class_id: 0,
    type: "passenger",
    passenger_name: "",
    passenger_age: 0,
    passenger_gender: "",
    address: "",
    id_type: "",
    id_number: "",
    license_plate: "",
    price: 0,
  });

  const createTicketMutation = useCreateTicket(scheduleId);

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await getQuotaByScheduleId(scheduleId);
      setQuota(res);
    };
    fetchQuota();
  }, [scheduleId]);

  const handleClassChange = (value: string) => {
    const selected = quota.find((item) => item.class_id.toString() === value);
    if (selected) {
      setSelectedClass(selected);
      setFormData({
        class_id: selected.class_id,
        type: selected.type,
        passenger_name: "",
        license_plate: "",
        passenger_age: 0,
        passenger_gender: "",
        address: "",
        id_type: "",
        id_number: "",
        schedule_id: scheduleId,
        price: selected.price,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi berdasarkan type
    if (
      selectedClass?.type === "passenger" &&
      !formData.passenger_name?.trim()
    ) {
      toast.error("Nama penumpang harus diisi!");
      return;
    }

    if (selectedClass?.type === "vehicle" && !formData.license_plate?.trim()) {
      toast.error("Nomor kendaraan harus diisi!");
      return;
    }

    // Tampilkan konfirmasi dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    // Validasi
    if (!selectedClass) {
      toast.error("Jenis tiket harus dipilih!");
      return;
    }

    if (!selectedClass.class_id) {
      toast.error("ID kelas tiket tidak valid!");
      return;
    }

    if (!selectedClass.type) {
      toast.error("Tipe tiket tidak valid!");
      return;
    }

    // Prepare data untuk API
    const ticketData: TicketForm = {
      schedule_id: scheduleId,
      class_id: selectedClass.class_id,
      type: selectedClass.type,
      passenger_name: formData.passenger_name || "",
      passenger_age: Number(formData.passenger_age) || 0,
      passenger_gender: formData.passenger_gender,
      address: formData.address || "",
      id_type: formData.id_type || "",
      id_number: formData.id_number || "",
      license_plate: formData.license_plate || null,
      price: selectedClass.price,
    };

    console.log("Sending ticket data:", ticketData);

    // ✅ Simple mutation call - error handling sudah di hook
    createTicketMutation.mutate(ticketData, {
      onSuccess: () => {
        // ✅ Data akan auto-refresh via React Query invalidation!
        console.log("Ticket created successfully!");
        resetForm();
        setShowConfirmDialog(false);
        setOpen(false);
        // ✅ No need to call onTicketAdded() - React Query handles it!
      },
      // onError sudah dihandle di useCreateTicket hook
    });
  };

  const resetForm = () => {
    setFormData({
      schedule_id: scheduleId,
      class_id: 0,
      type: "passenger",
      passenger_name: "",
      passenger_gender: "",
      passenger_age: 0,
      address: "",
      id_type: "",
      id_number: "",
      license_plate: "",
      price: 0,
    });
    setSelectedClass(null);
  };

  // Helper function untuk format tanggal
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-Blue hover:bg-Blue/90">Tambah</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-center">Tambah Tiket</DialogTitle>
            {scheduleData ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-center space-y-2">
                  {/* Rute */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-blue-900">
                      {scheduleData.departure_harbor.harbor_name}
                    </span>
                    <span className="text-blue-600">→</span>
                    <span className="font-semibold text-blue-900">
                      {scheduleData.arrival_harbor.harbor_name}
                    </span>
                  </div>
                  {/* Nama Kapal */}
                  <div className="text-sm text-blue-600">
                    {scheduleData.ship.ship_name} -{" "}
                    <span> {formatDate(scheduleData.departure_datetime)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-500">
                  Informasi jadwal sedang dimuat...
                </p>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
              {/* Select Jenis Tiket */}
              <div className="space-y-2">
                <Label htmlFor="jenis-tiket">Jenis Tiket</Label>
                <Select
                  onValueChange={handleClassChange}
                  value={selectedClass?.class_id.toString() || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Tiket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Jenis Tiket</SelectLabel>
                      {quota.map((item) => (
                        <SelectItem
                          key={item.class_id}
                          value={item.class_id.toString()}
                          disabled={item.available_capacity === 0}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{item.class_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Tiket yang Dipilih */}
              {selectedClass && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {selectedClass.class_name}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedClass.type === "passenger"
                        ? "Penumpang"
                        : "Kendaraan"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      Harga: {selectedClass.currency}{" "}
                      {selectedClass.price.toLocaleString()}
                    </p>
                    <p>Tersedia: {selectedClass.available_capacity} tiket</p>
                  </div>
                </div>
              )}

              {/* Dynamic Form Fields */}
              {selectedClass?.type === "passenger" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nama-penumpang">
                      Nama Penumpang <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama-penumpang"
                      type="text"
                      placeholder="Masukkan nama penumpang"
                      value={formData.passenger_name || ""}
                      onChange={(e) =>
                        handleInputChange("passenger_name", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="umur">
                      Umur <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="umur"
                      type="number"
                      placeholder="Masukkan umur penumpang"
                      value={formData.passenger_age || ""}
                      onChange={(e) =>
                        handleInputChange("passenger_age", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenis-kelamin">Jenis Kelamin</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      value={formData.passenger_gender || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pria">Pria</SelectItem>
                          <SelectItem value="wanita">Wanita</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      type="text"
                      placeholder="Masukkan alamat penumpang"
                      value={formData.address || ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenis-identitas">Jenis Identitas</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("id_type", value)
                      }
                      value={formData.id_type || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis Identitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ktp">KTP</SelectItem>
                          <SelectItem value="sim">SIM</SelectItem>
                          <SelectItem value="paspor">Paspor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomor-identitas">
                      Nomor Identitas <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nomor-identitas"
                      type="text"
                      placeholder="Masukkan nomor identitas"
                      value={formData.id_number || ""}
                      onChange={(e) =>
                        handleInputChange("id_number", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {selectedClass?.type === "vehicle" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nomor-kendaraan">
                      Nomor Kendaraan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nomor-kendaraan"
                      type="text"
                      placeholder="Masukkan nomor kendaraan (contoh: B 1234 XYZ)"
                      value={formData.license_plate || ""}
                      onChange={(e) =>
                        handleInputChange("license_plate", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama-pemilik">
                      Nama Pemilik <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama-pemilik"
                      type="text"
                      placeholder="Masukkan Nama"
                      value={formData.passenger_name || ""}
                      onChange={(e) =>
                        handleInputChange("passenger_name", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="umur">
                      Umur <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="umur"
                      type="number"
                      placeholder="Masukkan umur"
                      value={formData.passenger_age || ""}
                      onChange={(e) =>
                        handleInputChange("passenger_age", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      type="text"
                      placeholder="Masukkan alamat"
                      value={formData.address || ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenis-identitas">Jenis Identitas</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("id_type", value)
                      }
                      value={formData.id_type || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis Identitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ktp">KTP</SelectItem>
                          <SelectItem value="sim">SIM</SelectItem>
                          <SelectItem value="paspor">Paspor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomor-identitas">
                      Nomor Identitas <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nomor-identitas"
                      type="text"
                      placeholder="Masukkan nomor identitas"
                      value={formData.id_number || ""}
                      onChange={(e) =>
                        handleInputChange("id_number", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons - di dalam form */}
              <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-Blue hover:bg-Blue/90"
                  disabled={!selectedClass}
                >
                  Tambah Tiket
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">📝</span>
              </div>
              Konfirmasi Tambah Tiket
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>
                Apakah Anda yakin ingin menambahkan tiket ini? Pastikan semua
                informasi sudah benar sebelum melanjutkan.
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Jenis Tiket:</dt>
                    <dd className="text-gray-900">
                      {selectedClass?.class_name}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Type:</dt>
                    <dd className="text-gray-900">
                      {selectedClass?.type === "passenger"
                        ? "Penumpang"
                        : "Kendaraan"}
                    </dd>
                  </div>

                  {selectedClass?.type === "passenger" ? (
                    <>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-700">Nama:</dt>
                        <dd className="text-gray-900">
                          {formData.passenger_name}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-700">Umur:</dt>
                        <dd className="text-gray-900">
                          {formData.passenger_age}
                        </dd>
                      </div>

                      {formData.passenger_gender && (
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-700">
                            Jenis Kelamin:
                          </dt>
                          <dd className="text-gray-900">{formData.passenger_gender}</dd>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-700">
                          Nomor Kendaraan:
                        </dt>
                        <dd className="text-gray-900">
                          {formData.license_plate}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-700">
                          Nama Pemilik:
                        </dt>
                        <dd className="text-gray-900">
                          {formData.passenger_name}
                        </dd>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <dt className="font-medium text-gray-700">Harga:</dt>
                    <dd className="text-gray-900 font-semibold">
                      {selectedClass?.currency}{" "}
                      {selectedClass?.price.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={createTicketMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={createTicketMutation.isPending}
              className="bg-Blue hover:bg-Blue/90"
            >
              {/* ✅ Use mutation loading state */}
              {createTicketMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                "Ya, Tambahkan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
