// app/ui/login/ForgetPasswordModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { forgetPassword } from "@/service/auth";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
});

type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>;

interface ForgetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgetPasswordModal({ 
  open, 
  onOpenChange 
}: ForgetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgetPasswordValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await forgetPassword(values.email);
      setIsSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim email reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    form.reset();
    onOpenChange(false);
  };

  const handleBackToForm = () => {
    setIsSuccess(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-Blue" />
            {isSuccess ? "Email Terkirim" : "Lupa Password"}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? "Kami telah mengirim link reset password ke email Anda"
              : "Masukkan email Anda untuk menerima link reset password"
            }
          </DialogDescription>
        </DialogHeader>

        {/* Success State */}
        {isSuccess ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Reset Terkirim!
              </h3>
              <p className="text-gray-600 text-sm">
                Silakan cek email Anda dan ikuti instruksi untuk mereset password.
              </p>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Tips:</strong> Jika email tidak terlihat di inbox, coba cek folder spam atau junk.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleBackToForm}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kirim Ulang
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-Blue hover:bg-blue-700"
              >
                Tutup
              </Button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 py-6 rounded-lg focus:ring-1 focus:ring-Blue"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-Blue hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Kirim Reset Link
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Info */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Ingat password Anda?{" "}
                <button
                  onClick={handleClose}
                  className="text-Blue hover:underline font-medium"
                >
                  Kembali ke Login
                </button>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}