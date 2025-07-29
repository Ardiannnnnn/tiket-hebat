import { NextRequest, NextResponse } from 'next/server';

// Mapping role yang diizinkan per rute
const routeRoleMap: Record<string, string[]> = {
  '/beranda': ['ADMIN'],
  '/petugas': ['OPERATOR'],
};

export function middleware(request: NextRequest) {
  // ✅ MAINTENANCE MODE CHECK - Prioritas tertinggi
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // ✅ Skip maintenance check untuk maintenance page itu sendiri
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }
  
  // ✅ Skip untuk static files
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/api/_')
  ) {
    return NextResponse.next();
  }
  
  // ✅ Redirect ke maintenance page jika maintenance mode aktif
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // ✅ EXISTING AUTH LOGIC - Hanya jalankan jika tidak maintenance mode
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
    return payload.exp * 1000000 < Date.now();
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

// ✅ Update config untuk include semua routes (maintenance mode berlaku global)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};