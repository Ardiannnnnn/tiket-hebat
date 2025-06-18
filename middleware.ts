// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Cek apakah token ada (login check)
  const token = request.cookies.get("refresh_token")?.value;

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Middleware hanya mengecek autentikasi, bukan role.
  // Role check dilakukan di komponen dengan fetch ke /me

  return NextResponse.next();
}

// Konfigurasi rute yang perlu login
export const config = {
  matcher: [
    "/beranda/:path*",
    "/dataTiket/:path*",
    "/kapal/:path*",
    "/pelabuhan/:path*",
    "/dataRute/:path*",
    "/uploadJadwal/:path*",
    "/tiket-dashboard/:path*",
    "/pengguna/:path*",
    "/petugas/:path*",
  ],
};
