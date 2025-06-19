// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Mapping role yang diizinkan per rute
const routeRoleMap: Record<string, string[]> = {
  '/beranda': ['admin'],
  '/petugas': ['operator'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  if (isExpired(token)) {
    return redirectToRefresh(request);
  }

  const role = getRoleFromToken(token);
  const currentPath = request.nextUrl.pathname;

  for (const path in routeRoleMap) {
    if (currentPath.startsWith(path)) {
      const allowed = routeRoleMap[path];
      if (!allowed.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rolename || '';
  } catch {
    return '';
  }
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}

function redirectToRefresh(request: NextRequest) {
  const refreshUrl = new URL('/auth/refresh', request.url);
  refreshUrl.searchParams.set('callback', request.nextUrl.pathname);
  return NextResponse.redirect(refreshUrl);
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
