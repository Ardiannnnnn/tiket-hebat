// app/ui/login/login.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { getCurrentUser, loginUser } from "@/service/auth";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight 
} from "lucide-react";
import { toast } from "sonner";
import ForgetPasswordModal from "./forgetPasswordModal";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username wajib diisi" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(50, { message: "Password maksimal 50 karakter" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

type LoginState = 'idle' | 'logging-in' | 'fetching-user' | 'redirecting' | 'success' | 'error';

export default function PageLogin() {
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = loginState !== 'idle' && loginState !== 'error';

  const getLoadingMessage = () => {
    switch (loginState) {
      case 'logging-in':
        return 'Memverifikasi kredensial...';
      case 'fetching-user':
        return 'Mengambil data pengguna...';
      case 'redirecting':
        return 'Mengarahkan ke dashboard...';
      case 'success':
        return 'Login berhasil!';
      default:
        return 'Masuk';
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    
    try {
      // Step 1: Login dan simpan cookie
      setLoginState('logging-in');
      await loginUser(values);
      
      // Brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Ambil data user dari endpoint /me
      setLoginState('fetching-user');
      const me = await getCurrentUser();
      const userRole = me.data.role.role_name;

      // Step 3: Prepare redirect
      setLoginState('redirecting');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 4: Success state
      setLoginState('success');
      toast.success('Login berhasil!', {
        description: `Selamat datang kembali!`
      });

      // Step 5: Navigate based on role
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (userRole === "ADMIN") {
        router.push("/beranda");
      } else if (userRole === "OPERATOR") {
        router.push("/petugas");
      } else {
        throw new Error(`Peran tidak dikenali: ${userRole}`);
      }

    } catch (err: any) {
      setLoginState('error');
      console.error("Login gagal:", err);
      
      // Enhanced error handling
      let errorMessage = "Terjadi kesalahan saat login";
      
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        errorMessage = "Email atau password salah";
      } else if (err.message?.includes('404')) {
        errorMessage = "Akun tidak ditemukan";
      } else if (err.message?.includes('403')) {
        errorMessage = "Akun Anda tidak memiliki akses";
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = "Masalah koneksi internet";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Login gagal", {
        description: errorMessage
      });

      // Reset state after error
      setTimeout(() => {
        setLoginState('idle');
      }, 3000);
    }
  };

  // Reset error when user starts typing
  const handleInputChange = (onChange: any) => (e: any) => {
    if (error) {
      setError(null);
      setLoginState('idle');
    }
    onChange(e);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-4 sm:mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="w-16 h-16 bg-Blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Selamat Datang
          </CardTitle>
          <p className="text-center text-gray-600 text-sm">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {loginState === 'success' && (
            <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Login berhasil! Mengarahkan ke dashboard...
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          className="pl-10 py-6 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Username"
                          disabled={isLoading}
                          {...field}
                          onChange={handleInputChange(field.onChange)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-12 py-6 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                          onChange={handleInputChange(field.onChange)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forget Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm text-gray-600 select-none cursor-pointer"
                  >
                    Ingat saya
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgetPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  disabled={isLoading}
                >
                  Lupa Password?
                </button>
              </div>

              {/* Enhanced Login Button */}
              <Button
                type="submit"
                className="w-full bg-Blue hover:bg-teal-600  text-white py-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getLoadingMessage()}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Loading Progress Bar */}
          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-Blue to-teal-600 transition-all duration-1000 ease-out"
                  style={{
                    width: 
                      loginState === 'logging-in' ? '30%' :
                      loginState === 'fetching-user' ? '60%' :
                      loginState === 'redirecting' ? '90%' :
                      loginState === 'success' ? '100%' : '0%'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                {getLoadingMessage()}
              </p>
            </div>
          )}

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Forget Password Modal */}
      <ForgetPasswordModal 
        open={showForgetPassword} 
        onOpenChange={setShowForgetPassword} 
      />
    </>
  );
}