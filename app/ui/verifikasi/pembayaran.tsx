// app/ui/verifikasi/pembayaran.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPaymentChannels } from "@/service/payment";
import { toast } from "sonner";
import {
  CreditCard,
  Building2,
  Smartphone,
  Clock,
  Shield,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Receipt,
  Eye,
} from "lucide-react";
import TotalBayar from "./totalBayar"; // ✅ Import TotalBayar
import type { SessionData } from "@/types/session"; // ✅ Import SessionData type

interface PaymentChannel {
  code: string;
  name: string;
  group: string;
  icon_url: string;
}

interface PaymentSelectionProps {
  selectedPayment: string;
  onPaymentChange: (value: string) => void;
  disabled?: boolean;
  onSubmitTrigger: () => void;
  isProcessing: boolean;
  isPemesanDataValid: boolean;
  session: SessionData; // ✅ Add session prop
}

export default function PaymentSelection({
  selectedPayment,
  onPaymentChange,
  disabled = false,
  onSubmitTrigger,
  isProcessing,
  isPemesanDataValid,
  session, // ✅ Destructure session
}: PaymentSelectionProps) {
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTotalSheet, setShowTotalSheet] = useState(false); // ✅ Local sheet state

  // ✅ Load payment channels
  useEffect(() => {
    const loadPaymentChannels = async () => {
      try {
        setLoading(true);
        const channels = await getPaymentChannels();
        setPaymentChannels(channels);
        console.log("✅ Payment channels loaded:", channels);
      } catch (error) {
        console.error("❌ Error loading payment channels:", error);
        toast.error("Gagal memuat metode pembayaran");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentChannels();
  }, []);

  // ✅ Get selected payment info
  const selectedPaymentInfo = paymentChannels.find(
    (ch) => ch.code === selectedPayment
  );

  return (
    <div className="space-y-6">
      {/* ✅ Mobile Summary Sheet - Positioned above payment selection */}
      <div className="xl:hidden mb-4">
        <Sheet open={showTotalSheet} onOpenChange={setShowTotalSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-between bg-white border-2 border-Blue hover:bg-Blue/5 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-Blue" />
                <span className="font-medium text-gray-900">
                  Klik Disini Ringkasan Pembayaran
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-Blue" />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto p-0">
            <SheetTitle className="sr-only">Ringkasan Pembayaran</SheetTitle>
            <div className="p-4">
              <TotalBayar session={session} isModal={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ✅ Payment Selection Card */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden py-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-Blue/10 to-Orange/10 border-b border-Blue/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-Blue/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-Blue" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">
                Metode Pembayaran
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Pilih metode pembayaran yang Anda inginkan
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* ✅ Payment Method Selector */}
            <Select
              onValueChange={(value) => {
                console.log("💳 Payment changed to:", value);
                onPaymentChange(value);
              }}
              value={selectedPayment}
              disabled={disabled || loading}
            >
              <SelectTrigger className="w-full h-14 text-left border-2 border-gray-200 hover:border-Blue/50 focus:border-Blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue
                  placeholder={
                    loading
                      ? "Memuat metode pembayaran..."
                      : "Pilih metode pembayaran..."
                  }
                />
              </SelectTrigger>
              <SelectContent className="p-0 border-0 shadow-xl">
                {/* ✅ Virtual Account Section */}
                {paymentChannels.some(
                  (ch) => ch.group === "Virtual Account"
                ) && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Building2 className="w-4 h-4 text-Blue" />
                      <p className="text-sm font-semibold text-gray-700">
                        Virtual Account
                      </p>
                    </div>
                    <SelectGroup>
                      {paymentChannels
                        .filter((ch) => ch.group === "Virtual Account")
                        .map((ch) => (
                          <SelectItem
                            key={ch.code}
                            value={ch.code}
                            className="p-3 cursor-pointer hover:bg-Blue/5"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{ch.name}</span>
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-10 h-6 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </div>
                )}

                {/* ✅ E-Wallet Section */}
                {paymentChannels.some((ch) => ch.group === "E-Wallet") && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Smartphone className="w-4 h-4 text-Orange" />
                      <p className="text-sm font-semibold text-gray-700">
                        E-Wallet
                      </p>
                    </div>
                    <SelectGroup>
                      {paymentChannels
                        .filter((ch) => ch.group === "E-Wallet")
                        .map((ch) => (
                          <SelectItem
                            key={ch.code}
                            value={ch.code}
                            className="p-3 cursor-pointer hover:bg-Orange/5"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{ch.name}</span>
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-10 h-6 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </div>
                )}

                {/* ✅ Empty state */}
                {!loading && paymentChannels.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">
                      Tidak ada metode pembayaran tersedia
                    </p>
                  </div>
                )}
              </SelectContent>
            </Select>

            {/* ✅ Security & Time Notice */}

            <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-orange-800">
                  Batas Waktu
                </p>
                <p className="text-xs text-orange-600">
                  Pembayaran dalam kurun waktu yang ditentukan
                </p>
              </div>
            </div>

            {/* ✅ Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-Blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">
                    Memuat metode pembayaran...
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Submit Button */}
      <Button
        onClick={() => {
          console.log("🎯 Submit button clicked with state:", {
            selectedPayment,
            isPemesanDataValid,
            isProcessing,
          });
          onSubmitTrigger();
        }}
        disabled={isProcessing || !isPemesanDataValid || !selectedPayment}
        className={`w-full h-14 font-semibold flex items-center justify-center gap-3 transition-all text-base ${
          isProcessing || !isPemesanDataValid || !selectedPayment
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gradient-to-r from-Blue to-Blue/90 hover:from-Blue/90 hover:to-Blue text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memproses Pesanan...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Buat Pesanan & Invoice</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>

      {/* ✅ Validation help text */}
      {(!isPemesanDataValid || !selectedPayment) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Lengkapi data untuk melanjutkan:
              </p>
              <ul className="text-xs text-amber-700 mt-2 space-y-1">
                {!isPemesanDataValid && (
                  <li>• Lengkapi dan perbaiki data pemesan (scroll ke atas)</li>
                )}
                {!selectedPayment && <li>• Pilih metode pembayaran di atas</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
