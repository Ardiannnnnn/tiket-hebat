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
import { useState } from "react";
import { loginUser } from "@/service/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import type { LoginResponse } from "@/types/login";
import { setCookie } from "nookies";

const formSchema = z.object({
  username: z.string().min(1, { message: "Email wajib diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function PageLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
 // npm install nookies

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await loginUser(values);
      const userRole = response.data.role.role_name;

      // Simpan role ke cookie agar bisa diakses middleware
      setCookie(null, "role", userRole, {
        path: "/",
        maxAge: 60 * 60, // 1 jam
      });

      if (userRole === "admin") {
        router.push("/beranda");
      } else if (userRole === "operator") {
        router.push("/petugas");
      }
    } catch (err) {
      console.error("Login gagal", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4 sm:mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gray-600">
          Masuk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="py-6 rounded-lg focus:ring-1 focus:ring-Blue"
                      placeholder="you@example.com"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-500">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="py-6 pr-12 rounded-lg focus:ring-1 focus:ring-Blue"
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        tabIndex={-1}
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

            <div className="flex items-center space-x-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-blue-600"
              />
              <label
                htmlFor="remember-me"
                className="text-sm text-gray-500 select-none"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-Blue hover:bg-teal-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Daftar
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
