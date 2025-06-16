'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getSessionById } from '@/service/session';
import { SessionData } from '@/types/session';
import { submitPassengerData } from '@/service/passenger';
import { TicketEntryPayload, PassengerEntry, VehicleEntry } from '@/types/passenger';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface IsiDataTabProps {
  sessionId: string;
  onClose: () => void;
}

export default function IsiDataTab({ sessionId, onClose }: IsiDataTabProps) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [formData, setFormData] = useState<any>({
    penumpang: [],
    kendaraan: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSessionById(sessionId);

        if (!res || !res.data) {
          throw new Error('Data sesi tidak ditemukan.');
        }

        setSessionData(res.data);

        // Initialize form data
        const defaultPenumpang = res.data.tickets
          .filter((ticket) => ticket.class.type === 'passenger')
          .map((ticket) => ({
            ticket_id: ticket.ticket_id,
            nama: '',
            jenisID: 'nik',
            noID: '',
            usia: 0,
            alamat: '',
            seat_number:'',
          }));

        const defaultKendaraan = res.data.tickets
          .filter((ticket) => ticket.class.type === 'vehicle')
          .map((ticket) => ({
            ticket_id: ticket.ticket_id,
            nomor_polisi: '',
            nama: '',
            alamat: '',
            usia: 0,
          }));

        setFormData({
          penumpang: defaultPenumpang,
          kendaraan: defaultKendaraan,
        });
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchData();
  }, [sessionId]);

  const handleChange = (
    type: 'penumpang' | 'kendaraan',
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: prev[type].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!sessionData) {
      console.error('Session data tidak tersedia.');
      return;
    }

    const passengerData: PassengerEntry[] = formData.penumpang.map((p: any) => ({
      ticket_id: p.ticket_id,
      passenger_name: p.nama,
      passenger_age: p.usia,
      address: p.alamat,
      id_type: p.jenisID,
      id_number: p.noID,
      seat_number: p.seat_number,
    }));

    const vehicleData: VehicleEntry[] = formData.kendaraan.map((k: any) => ({
      ticket_id: k.ticket_id,
      license_plate: k.nomor_polisi,
      passenger_name: k.nama,
      passenger_age: k.usia,
      address: k.alamat,
    }));

    const payload: TicketEntryPayload = {
      session_id: sessionId,
      customer_name: "petugas",
      phone_number: "petugas",
      email: "petugas",
      id_type: "petugas",
      id_number: "petugas",
      ticket_data: [...passengerData, ...vehicleData],
    };

    try {
      await submitPassengerData(payload);
      toast.success('Data berhasil ditambahkan!');
      onClose();
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Gagal menambahkan data.');
    }
  };

  if (!sessionData) return <p>Memuat data...</p>;

  return (
    <form className="space-y-6">
      {/* Data Penumpang */}
      {formData.penumpang.map((penumpang: any, index: number) => (
        <Card key={index} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Penumpang{" "}
              <span className="font-bold">
                ({sessionData.tickets.filter(
                  (ticket) => ticket.class.type === 'passenger'
                )[index]?.class.class_name || 'Penumpang'})
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              <div className="col-span-2">
                <Label className="text-gray-600">Nama Lengkap</Label>
                <Input
                  className="h-10 text-sm placeholder:text-sm"
                  placeholder="Masukkan Nama"
                  value={penumpang.nama}
                  onChange={(e) =>
                    handleChange('penumpang', index, 'nama', e.target.value)
                  }
                />
              </div>
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select
                  value={penumpang.jenisID}
                  onValueChange={(val) =>
                    handleChange('penumpang', index, 'jenisID', val)
                  }
                >
                  <SelectTrigger className="w-full h-10 placeholder:text-sm">
                    <SelectValue placeholder="NIK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nik">NIK</SelectItem>
                    <SelectItem value="sim">SIM</SelectItem>
                    <SelectItem value="paspor">Paspor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Nomor Identitas</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Masukkan Nomor"
                  value={penumpang.noID}
                  onChange={(e) =>
                    handleChange('penumpang', index, 'noID', e.target.value)
                  }
                />
              </div>
              <div className="col-span-1">
                <Label className="text-gray-600">Usia</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  type="number"
                  placeholder="0"
                  value={penumpang.usia}
                  onChange={(e) =>
                    handleChange('penumpang', index, 'usia', Number(e.target.value))
                  }
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Alamat</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Masukkan alamat"
                  value={penumpang.alamat}
                  onChange={(e) =>
                    handleChange('penumpang', index, 'alamat', e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Data Kendaraan */}
      {formData.kendaraan.map((kendaraan: any, index: number) => (
        <Card key={index} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Kendaraan{" "}
              <span className="font-bold">
                ({sessionData.tickets.filter(
                  (ticket) => ticket.class.type === 'vehicle'
                )[index]?.class.class_name || 'Kendaraan'})
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-2 gap-6 md:text-sm">
              <div className="w-full">
                <Label className="text-gray-600">Nomor Polisi</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nomor Polisi"
                  value={kendaraan.nomor_polisi}
                  onChange={(e) =>
                    handleChange('kendaraan', index, 'nomor_polisi', e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Label className="text-gray-600">Nama</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nama"
                  value={kendaraan.nama}
                  onChange={(e) =>
                    handleChange('kendaraan', index, 'nama', e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Label className="text-gray-600">Alamat</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Alamat"
                  value={kendaraan.alamat}
                  onChange={(e) =>
                    handleChange('kendaraan', index, 'alamat', e.target.value)
                  }
                />
              </div>
              <div className="w-full">
                <Label className="text-gray-600">Usia</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  type="number"
                  placeholder=""
                  value={kendaraan.usia}
                  onChange={(e) =>
                    handleChange('kendaraan', index, 'usia', Number(e.target.value))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" className="w-full bg-Blue text-white hover:bg-teal-600">
            Simpan Data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menambahkan data ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Ya, Tambahkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}