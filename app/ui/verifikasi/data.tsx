// app/ui/verifikasi/data.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { poppins } from "../fonts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitPassengerData } from "@/service/passenger";
import { useParams } from "next/navigation";
import { PassengerEntry, TicketEntryPayload } from "@/types/passenger";
import { useForm, FormProvider } from "react-hook-form";
import FormPemesan from "./formPemesan";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ClaimSessionResponse } from "@/types/responBook";
import { AxiosResponse } from "axios";
import {
  getPaymentChannels,
  createPaymentTransaction,
} from "@/service/payment";
import {
  Users,
  Car,
  Eye,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Wallet,
  Building2,
  Smartphone,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";

interface Passenger {
  nama: string;
  kelas: string;
  usia: number;
  jk: string;
  id: number;
  noID: string;
  alamat: string;
  jenisID: string;
  class_id: number;
  seat_number: string;
}

interface Vehicle {
  nomor_polisi: string;
  kelas: string;
  class_id: number;
  nama: string;
  usia: number;
  alamat: string;
}

const Detail = ({ penumpang }: { penumpang: Passenger }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${poppins.className} w-72 p-4 shadow-lg rounded-lg bg-white border`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Detail Penumpang</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Nama:</span>
              <span className="col-span-2">{penumpang.nama}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Alamat:</span>
              <span className="col-span-2">{penumpang.alamat}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Umur:</span>
              <span className="col-span-2">{penumpang.usia} tahun</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Kelamin:</span>
              <span className="col-span-2">{penumpang.jk}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">ID:</span>
              <span className="col-span-2">{penumpang.jenisID}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">No ID:</span>
              <span className="col-span-2">{penumpang.noID}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DetailKendaraan = ({ kendaraan }: { kendaraan: Vehicle }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Detail
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${poppins.className} w-72 p-4 shadow-lg rounded-lg bg-white border`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Car className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-800">Detail Kendaraan</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Pemilik:</span>
              <span className="col-span-2">{kendaraan.nama}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Alamat:</span>
              <span className="col-span-2">{kendaraan.alamat}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">No Polisi:</span>
              <span className="col-span-2 font-mono">
                {kendaraan.nomor_polisi}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-600">Kelas:</span>
              <span className="col-span-2">{kendaraan.kelas}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const KelasBadge = ({ kelas }: { kelas: string }) => {
  const kelasStyles: Record<string, string> = {
    ECONOMY: "bg-blue-100 text-blue-800 border-blue-200",
    BUSSINESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
    VIP: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium border",
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
  const [kendaraanList, setKendaraanList] = useState<Vehicle[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [paymentChannels, setPaymentChannels] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    'idle' | 'creating-order' | 'creating-invoice' | 'redirecting'
  >('idle');
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      nama: "",
      nohp: "",
      email: "",
      jenisID: "",
      noID: "",   
    },
  });

  // ✅ Load passenger and vehicle data
  useEffect(() => {
    const stored = sessionStorage.getItem("dataPenumpang");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const kendaraan = parsed.kendaraan || [];
        const penumpang = parsed.penumpang || [];

        const transformedPenumpang = penumpang.map((p: any) => ({
          nama: p.nama,
          kelas: p.kelas,
          usia: Number(p.usia),
          jk: p.jenis_kelamin ?? p.jk ?? "",
          id: p.id || 0,
          noID: p.nomor_identitas ?? p.noID ?? "",
          alamat: p.alamat,
          jenisID: p.jenis_id ?? p.jenisID ?? "",
          class_id: p.class_id,
          seat_number: p.seat_number,
        }));

        const transformedKendaraan = kendaraan.map((p: any) => ({
          nomor_polisi: p.nomor_polisi,
          kelas: p.kelas,
          class_id: p.class_id,
          nama: p.nama_kendaraan || p.nama,
          usia: p.umur || 21,
          alamat: p.alamat_kendaraan || p.alamat,
        }));

        setPenumpangList(transformedPenumpang);
        setKendaraanList(transformedKendaraan);
      } catch (err) {
        console.error("Gagal parsing data penumpang:", err);
      }
    }
  }, []);

  // ✅ Load payment channels
  useEffect(() => {
    const loadPaymentChannels = async () => {
      try {
        const channels = await getPaymentChannels();
        setPaymentChannels(channels);
      } catch (error) {
        console.error("Error loading payment channels:", error);
        toast.error("Gagal memuat metode pembayaran");
      }
    };

    loadPaymentChannels();
  }, []);

  const isFormValid = form.formState.isValid;

  const handleClickPesanTiket = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Isi data pemesan terlebih dahulu");
      return;
    }

    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    setOpenConfirm(true);
  };

  // ✅ Enhanced submit with two-step process
  const handleSubmitAndRedirect = async () => {
    setOpenConfirm(false);
    setIsProcessing(true);
    
    if (!sessionId) {
      toast.error("Session ID tidak ditemukan.");
      setIsProcessing(false);
      return;
    }

    try {
      // ✅ Step 1: Processing Order
      setProcessingStep('creating-order');
      const pemesan = form.getValues();

      const passengerData: PassengerEntry[] = penumpangList.map((p) => ({
        class_id: p.class_id,
        passenger_name: p.nama,
        passenger_gender: p.jk,
        passenger_age: p.usia,
        address: p.alamat,
        id_type: p.jenisID,
        id_number: p.noID,
        seat_number: p.seat_number,
      }));

      const vehicleData = kendaraanList.map((k) => ({
        class_id: k.class_id,
        license_plate: k.nomor_polisi,
        passenger_name: k.nama,
        passenger_age: k.usia,
        address: k.alamat,
      }));

      const ticketData = [...passengerData, ...vehicleData];

      // ✅ Simplified payload with payment_method included
      const bookingPayload: TicketEntryPayload = {
        session_id: sessionId,
        customer_name: pemesan.nama,
        payment_method: selectedPayment, // ✅ Added payment method
        phone_number: pemesan.nohp,
        email: pemesan.email,
        id_type: pemesan.jenisID,
        id_number: pemesan.noID,
        ticket_data: ticketData,
      };

      console.log("📤 Creating order with payload:", bookingPayload);

      // ✅ Step 2: Creating Invoice
      setProcessingStep('creating-invoice');
      
      const orderResponse: AxiosResponse<ClaimSessionResponse> =
        await submitPassengerData(bookingPayload);
      
      // ✅ Get reference number from response
      const referenceNumber = orderResponse.data.order_id;

      if (!referenceNumber) {
        throw new Error("Reference number tidak ditemukan dalam response");
      }

      console.log("✅ Order created with reference:", referenceNumber);
      console.log("📄 Full response:", orderResponse.data);

      // ✅ Step 3: Redirect to Invoice
      setProcessingStep('redirecting');
      
      toast.success("Pesanan dan invoice berhasil dibuat!");
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ Use reference number for invoice URL
      const invoiceUrl = `/invoice/${referenceNumber}`;
      console.log("🔗 Redirecting to:", invoiceUrl);
      
      router.push(invoiceUrl);

    } catch (err: any) {
      console.error("❌ Error in order process:", err);
      
      // ✅ Enhanced error handling
      if (err.response?.status === 400) {
        toast.error("Data tidak valid. Silakan periksa kembali informasi Anda.");
      } else if (err.response?.status === 422) {
        toast.error("Sesi telah berakhir atau tidak valid. Silakan coba lagi.");
      } else if (err.response?.status === 500) {
        toast.error("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
      } else if (err.message?.includes('network')) {
        toast.error("Koneksi bermasalah. Periksa internet Anda dan coba lagi.");
      } else {
        toast.error("Gagal memproses pesanan. Silakan coba lagi.");
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep('idle');
    }
  };

  // ✅ Processing Steps Component
  const ProcessingSteps = () => {
    const steps = [
      { 
        key: 'creating-order', 
        label: 'Memproses pesanan...', 
        icon: <CheckCircle className="w-4 h-4" />,
        description: 'Menyimpan data penumpang dan kendaraan'
      },
      { 
        key: 'creating-invoice', 
        label: 'Membuat invoice pembayaran...', 
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Memproses metode pembayaran yang dipilih'
      },
      { 
        key: 'redirecting', 
        label: 'Mengarahkan ke halaman invoice...', 
        icon: <ArrowRight className="w-4 h-4" />,
        description: 'Menyiapkan halaman pembayaran'
      },
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = processingStep === step.key;
          const isCompleted = steps.findIndex(s => s.key === processingStep) > index;
          
          return (
            <div
              key={step.key}
              className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-Blue/10 to-Blue/5 border-Blue/30 shadow-md' 
                  : isCompleted 
                    ? 'bg-gradient-to-r from-green-50 to-green-25 border-green-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* ✅ Progress bar for active step */}
              {isActive && (
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-Blue to-Orange animate-pulse"></div>
              )}
              
              <div className="flex items-center gap-4 p-4">
                <div className={`relative flex-shrink-0 transition-all duration-300 ${
                  isActive 
                    ? 'text-Blue scale-110' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`}>
                  {isActive ? (
                    <div className="relative">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <div className="absolute inset-0 w-5 h-5 border-2 border-Blue/20 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-Blue' 
                      : isCompleted 
                        ? 'text-green-700' 
                        : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    isActive 
                      ? 'text-Blue/70' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}>
                    {step.description}
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                {isActive && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-Blue/10 rounded-full flex items-center justify-center border-2 border-Blue/30">
                      <div className="w-2 h-2 bg-Blue rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Data Card - Same as before */}
      {kendaraanList.length > 0 && (
        <Card className="shadow-md py-0 gap-0">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-green-600" />
              </div>
              <span>Data Kendaraan</span>
              <span className="text-sm font-normal text-gray-500">
                ({kendaraanList.length} kendaraan)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {kendaraanList.map((kendaraan, index) => (
                    <TableRow key={index} className="border-b last:border-b-0">
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Car className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <div className="font-mono font-semibold">
                              {kendaraan.nomor_polisi}
                            </div>
                            <div className="text-sm text-gray-500">
                              {kendaraan.nama}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <KelasBadge kelas={kendaraan.kelas} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DetailKendaraan kendaraan={kendaraan} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passenger Data Card - Same as before */}
      {penumpangList.length > 0 && (
        <Card className="shadow-md py-0 gap-0">
          <CardHeader className="border-b p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span>Data Penumpang</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {penumpangList.map((penumpang, index) => (
                    <TableRow key={index} className="border-b last:border-b-0">
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {penumpang.nama}
                            </div>
                            <div className="text-sm text-gray-500">
                              {penumpang.noID}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <KelasBadge kelas={penumpang.kelas} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Detail penumpang={penumpang} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Pemesan - Same as before */}
      <FormProvider {...form}>
        <FormPemesan />
      </FormProvider>

      {/* ✅ NEW: Payment Method Selection */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden py-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-Blue/10 to-Orange/10 border-b border-Blue/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-Blue/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-Blue" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Metode Pembayaran</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Pilih metode pembayaran yang Anda inginkan
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <Select onValueChange={(value) => setSelectedPayment(value)} value={selectedPayment}>
              <SelectTrigger className="w-full h-14 text-left border-2 border-gray-200 hover:border-Blue/50 focus:border-Blue transition-colors">
                <SelectValue placeholder="Pilih metode pembayaran..." />
              </SelectTrigger>
              <SelectContent className="p-0 border-0 shadow-xl">
                
                {/* Virtual Account Section */}
                {paymentChannels.some((ch) => ch.group === "Virtual Account") && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Building2 className="w-4 h-4 text-Blue" />
                      <p className="text-sm font-semibold text-gray-700">Virtual Account</p>
                    </div>
                    <SelectGroup>
                      {paymentChannels
                        .filter((ch) => ch.group === "Virtual Account")
                        .map((ch) => (
                          <SelectItem key={ch.code} value={ch.code} className="p-3 cursor-pointer hover:bg-Blue/5">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{ch.name}</span>
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-10 h-6 object-contain"
                              />
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </div>
                )}

                {/* E-Wallet Section */}
                {paymentChannels.some((ch) => ch.group === "E-Wallet") && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Smartphone className="w-4 h-4 text-Orange" />
                      <p className="text-sm font-semibold text-gray-700">E-Wallet</p>
                    </div>
                    <SelectGroup>
                      {paymentChannels
                        .filter((ch) => ch.group === "E-Wallet")
                        .map((ch) => (
                          <SelectItem key={ch.code} value={ch.code} className="p-3 cursor-pointer hover:bg-Orange/5">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{ch.name}</span>
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-10 h-6 object-contain"
                              />
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </div>
                )}
              </SelectContent>
            </Select>

            {/* Security & Time Notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Pembayaran Aman</p>
                  <p className="text-xs text-green-600">Dilindungi enkripsi SSL</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Batas Waktu</p>
                  <p className="text-xs text-orange-600">Dalam kurun waktu yang ditentukan</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Enhanced Submit Button */}
      <Button
        onClick={handleClickPesanTiket}
        disabled={isProcessing || !isFormValid || !selectedPayment}
        className={`w-full h-12 font-semibold flex items-center justify-center gap-2 transition-all ${
          isProcessing || !isFormValid || !selectedPayment
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-gradient-to-r from-Blue to-Blue/90 hover:from-Blue/90 hover:to-Blue text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses Pesanan...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Buat Pesanan & Invoice</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {/* ✅ Enhanced Confirmation Dialog with Progress */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">Konfirmasi Pemesanan</AlertDialogTitle>
                <p className="text-sm text-gray-600 mt-1">Pastikan semua data sudah benar</p>
              </div>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <p><strong>Sistem akan:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Membuat pesanan tiket untuk {penumpangList.length + kendaraanList.length} item</li>
                  <li>Memproses pembayaran via <strong>{paymentChannels.find(ch => ch.code === selectedPayment)?.name}</strong></li>
                  <li>Mengarahkan Anda ke halaman invoice untuk pembayaran</li>
                </ul>
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ Setelah konfirmasi, pesanan tidak dapat dibatalkan
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel disabled={isProcessing} className="flex-1">
              Periksa Lagi
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitAndRedirect}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-Blue to-Blue/90 text-white hover:from-Blue/90 hover:to-Blue flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Ya, Buat Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Processing Dialog */}
      <AlertDialog open={isProcessing} onOpenChange={() => {}}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-Blue animate-spin" />
              </div>
              <div>
                <span>Memproses Pesanan</span>
                <p className="text-sm font-normal text-gray-600 mt-1">
                  Sedang membuat pesanan dan invoice pembayaran...
                </p>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="py-6">
            <ProcessingSteps />
          </div>
          
          {/* ✅ Enhanced footer with tips */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mx-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Tips</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Jangan tutup atau refresh halaman ini</li>
                  <li>• Proses ini biasanya memakan waktu 30-60 detik</li>
                  <li>• Anda akan diarahkan ke halaman pembayaran setelah selesai</li>
                </ul>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}