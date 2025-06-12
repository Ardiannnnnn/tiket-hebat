// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const role = request.cookies.get("role")?.value;

  // Kalau tidak ada role, redirect ke login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access
  const adminRoutes = [
    "/beranda",
    "/dataTiket",
    "/kapal",
    "/pelabuhan",
    "/dataRute",
    "/uploadJadwal",
    "/tiket-dashboard",
    "/pengguna",
  ];

  const petugasRoutes = ["/petugas"];

  // Cek akses admin
  if (adminRoutes.some((route) => pathname.startsWith(route)) && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Cek akses petugas
  if (petugasRoutes.some((route) => pathname.startsWith(route)) && role !== "operator") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next(); // izinkan akses
}

// Tentukan rute yang perlu dicek
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
