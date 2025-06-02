// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refresh_token')?.value; // ganti 'token' sesuai nama cookie dari backend
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ["/beranda/:path*", 
    "/dataTiket/:path*",
    "/kapal/:path*",
    "/pelabuhan/:path*",
    "/dataRute/:path*",
    "/uploadJadwal/:path*",
    "/tiket-dashboard/:path*",
    "/pelabuhan/:path*",
    "/pengguna/:path*",  
  ],
};

