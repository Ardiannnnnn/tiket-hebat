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

const formSchema = z.object({
  username: z.string().min(1, { message: "Email wajib diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function PageLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Ganti ini dengan API login kamu
      const data = await loginUser(values);
        console.log("Login berhasil", data);
      // await loginUser(values)
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
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="py-6 rounded-lg focus:ring-1 focus:ring-Blue"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center mt-2">
                    <input
                      id="show-password"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((v) => !v)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="show-password"
                      className="text-sm text-gray-500 select-none"
                    >
                      Lihat Password
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
