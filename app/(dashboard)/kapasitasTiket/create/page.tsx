// app/(dashboard)/kapasitasTiket/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getKelas } from "@/service/kelas";
import { getScheduleAll } from "@/service/schedule";
import { createBulkKapasitas } from "@/service/kapasitas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Ship, Calendar, Users, DollarSign } from "lucide-react";

interface SelectOption {
  value: number;
  label: string;
}

interface KapasitasItem {
  id: string; // temporary ID for form management
  class_id: number;
  capacity: number;
  price: number;
  class_name?: string; // for display
}

interface BulkKapasitasPayload {
  schedule_id: number;
  class_id: number;
  capacity: number;
  price: number;
}

export default function CreateKapasitasTiket() {
  const [schedules, setSchedules] = useState<SelectOption[]>([]);
  const [kelas, setKelas] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(0);
  const [kapasitasItems, setKapasitasItems] = useState<KapasitasItem[]>([]);
  
  // Dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedScheduleInfo, setSelectedScheduleInfo] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching schedules and classes...");
        
        const [scheduleRes, classRes] = await Promise.all([
          getScheduleAll(1, 100),
          getKelas(1, 100),
        ]);

        console.log("📊 Schedule response:", scheduleRes);
        console.log("📊 Class response:", classRes);

        if (!scheduleRes?.data || !classRes?.data) {
          throw new Error("Failed to fetch data");
        }

        const scheduleOptions = scheduleRes.data.map((schedule: any) => ({
          value: schedule.id,
          label: `${schedule.ship?.ship_name || 'Unknown Ship'} - ${schedule.departure_harbor?.harbor_name || 'Unknown'} → ${schedule.arrival_harbor?.harbor_name || 'Unknown'}`,
        }));

        const classOptions = classRes.data.map((kelas: any) => ({
          value: kelas.id,
          label: `${kelas.class_name} (${kelas.type})`,
        }));

        console.log("🚢 Schedule options:", scheduleOptions);
        console.log("🎫 Class options:", classOptions);

        setSchedules(scheduleOptions);
        setKelas(classOptions);
        
        // Initialize with one empty item
        addKapasitasItem();
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Gagal memuat data jadwal dan kelas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add new kapasitas item
  const addKapasitasItem = () => {
    const newItem: KapasitasItem = {
      id: `item_${Date.now()}_${Math.random()}`,
      class_id: 0,
      capacity: 0,
      price: 0,
    };
    setKapasitasItems(prev => [...prev, newItem]);
  };

  // Remove kapasitas item
  const removeKapasitasItem = (id: string) => {
    if (kapasitasItems.length <= 1) {
      toast.error("Minimal harus ada satu item kapasitas");
      return;
    }
    setKapasitasItems(prev => prev.filter(item => item.id !== id));
  };

  // Update kapasitas item
  const updateKapasitasItem = (id: string, field: keyof KapasitasItem, value: any) => {
    setKapasitasItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              [field]: value,
              ...(field === 'class_id' && { 
                class_name: kelas.find(k => k.value === parseInt(value))?.label 
              })
            }
          : item
      )
    );
  };

  // Get class name for display
  const getClassName = (classId: number) => {
    return kelas.find(k => k.value === classId)?.label || "Pilih Kelas";
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedScheduleId || selectedScheduleId === 0) {
      toast.error("Pilih jadwal terlebih dahulu");
      return false;
    }

    if (kapasitasItems.length === 0) {
      toast.error("Tambahkan minimal satu item kapasitas");
      return false;
    }

    // Check for duplicate classes
    const classIds = kapasitasItems.map(item => item.class_id);
    const uniqueClassIds = new Set(classIds);
    if (classIds.length !== uniqueClassIds.size) {
      toast.error("Tidak boleh ada kelas yang duplikat");
      return false;
    }

    // Validate each item
    for (let i = 0; i < kapasitasItems.length; i++) {
      const item = kapasitasItems[i];
      
      if (!item.class_id || item.class_id === 0) {
        toast.error(`Item ${i + 1}: Pilih kelas`);
        return false;
      }
      
      if (!item.capacity || item.capacity <= 0) {
        toast.error(`Item ${i + 1}: Kapasitas harus lebih dari 0`);
        return false;
      }
      
      if (!item.price || item.price <= 0) {
        toast.error(`Item ${i + 1}: Harga harus lebih dari 0`);
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const scheduleInfo = schedules.find(s => s.value === selectedScheduleId)?.label || "Schedule";
    setSelectedScheduleInfo(scheduleInfo);
    setShowConfirmDialog(true);
  };

  // Confirm and submit
  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      const payload: BulkKapasitasPayload[] = kapasitasItems.map(item => ({
        schedule_id: selectedScheduleId,
        class_id: item.class_id,
        capacity: item.capacity,
        price: item.price,
      }));

      console.log("📤 Bulk payload to send:", payload);

      const success = await createBulkKapasitas(payload);

      if (success) {
        toast.success(`Berhasil membuat ${payload.length} kapasitas tiket!`);
        
        // Reset form
        setSelectedScheduleId(0);
        setKapasitasItems([]);
        addKapasitasItem(); // Add one empty item
        
        // Optional: redirect
        // setTimeout(() => {
        //   window.location.href = "/kapasitasTiket";
        // }, 2000);
      } else {
        toast.error("Gagal membuat kapasitas tiket");
      }
    } catch (error) {
      console.error("❌ Error saat membuat kapasitas tiket:", error);
      toast.error("Terjadi kesalahan saat membuat kapasitas tiket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data jadwal dan kelas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Ship className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tambah Kapasitas Tiket (Bulk)</h1>
          <p className="text-gray-600">Tambahkan beberapa kelas sekaligus untuk satu jadwal</p>
        </div>
      </div>

      {/* Schedule Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pilih Jadwal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Jadwal Keberangkatan</Label>
            <Select 
              value={selectedScheduleId ? String(selectedScheduleId) : ""} 
              onValueChange={(value) => setSelectedScheduleId(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jadwal keberangkatan" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((schedule) => (
                  <SelectItem key={schedule.value} value={String(schedule.value)}>
                    {schedule.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kapasitas Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Kapasitas per Kelas ({kapasitasItems.length} item)
            </CardTitle>
            <Button
              onClick={addKapasitasItem}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Kelas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kapasitasItems.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Kelas {index + 1}</h4>
                  {kapasitasItems.length > 1 && (
                    <Button
                      onClick={() => removeKapasitasItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Class Selection */}
                  <div className="space-y-2">
                    <Label>Kelas</Label>
                    <Select 
                      value={item.class_id ? String(item.class_id) : ""} 
                      onValueChange={(value) => updateKapasitasItem(item.id, 'class_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {kelas
                          .filter(k => !kapasitasItems.some(ki => ki.class_id === k.value && ki.id !== item.id))
                          .map((kelasOption) => (
                          <SelectItem key={kelasOption.value} value={String(kelasOption.value)}>
                            {kelasOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Capacity Input */}
                  <div className="space-y-2">
                    <Label>Kapasitas</Label>
                    <Input
                      type="number"
                      placeholder="Jumlah kursi"
                      value={item.capacity || ""}
                      onChange={(e) => updateKapasitasItem(item.id, 'capacity', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="Harga tiket"
                      value={item.price || ""}
                      onChange={(e) => updateKapasitasItem(item.id, 'price', parseInt(e.target.value) || 0)}
                      min="1000"
                      step="1000"
                    />
                  </div>
                </div>

                {/* Preview */}
                {item.class_id && item.capacity && item.price && (
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <strong>{getClassName(item.class_id)}</strong> - {item.capacity} kursi - Rp {item.price.toLocaleString("id-ID")}
                  </div>
                )}
              </div>
            ))}

            {kapasitasItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada item kapasitas</p>
                <Button onClick={addKapasitasItem} className="mt-2">
                  Tambah Item Pertama
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary & Submit */}
      {selectedScheduleId && kapasitasItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Ringkasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong>Jadwal:</strong> {schedules.find(s => s.value === selectedScheduleId)?.label}
              </div>
              <div>
                <strong>Total Kelas:</strong> {kapasitasItems.filter(item => item.class_id).length}
              </div>
              <div>
                <strong>Total Kapasitas:</strong> {kapasitasItems.reduce((sum, item) => sum + (item.capacity || 0), 0)} kursi
              </div>
              <div>
                <strong>Total Harga Terendah:</strong> Rp {Math.min(...kapasitasItems.map(item => item.price || Infinity)).toLocaleString("id-ID")}
              </div>
              <div>
                <strong>Total Harga Tertinggi:</strong> Rp {Math.max(...kapasitasItems.map(item => item.price || 0)).toLocaleString("id-ID")}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedScheduleId(0);
            setKapasitasItems([]);
            addKapasitasItem();
          }}
        >
          Reset Form
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedScheduleId || kapasitasItems.length === 0 || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? "Menyimpan..." : `Simpan ${kapasitasItems.length} Item`}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembuatan Kapasitas</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <strong>Jadwal:</strong>
              <p className="text-sm text-gray-600">{selectedScheduleInfo}</p>
            </div>
            
            <div>
              <strong>Items yang akan dibuat ({kapasitasItems.length}):</strong>
              <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
                {kapasitasItems.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded text-sm">
                    <div><strong>Kelas:</strong> {getClassName(item.class_id)}</div>
                    <div><strong>Kapasitas:</strong> {item.capacity} kursi</div>
                    <div><strong>Harga:</strong> Rp {item.price.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800">
                ⚠️ Setelah disimpan, data tidak dapat diubah. Pastikan semua informasi sudah benar.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmedSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Ya, Simpan Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}