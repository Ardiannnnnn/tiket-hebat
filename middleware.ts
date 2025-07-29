import { NextRequest, NextResponse } from 'next/server';

// Mapping role yang diizinkan per rute
const routeRoleMap: Record<string, string[]> = {
  '/beranda': ['ADMIN'],
  '/petugas': ['OPERATOR'],
};

// ✅ Routes yang tidak butuh authentication
const publicRoutes = [
  '/',
  '/login',
  '/register', 
  '/maintenance',
  '/unauthorized',
  '/auth',
  '/cek-tiket',
  '/invoice'
];

export function middleware(request: NextRequest) {
  // ✅ MAINTENANCE MODE CHECK
  const isMaintenanceMode = true; // Ubah ke true untuk enable
  
  // ✅ Skip untuk static files
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/images/') ||
    request.nextUrl.pathname.startsWith('/icons/')
  ) {
    return NextResponse.next();
  }
  
  // ✅ Skip maintenance check untuk maintenance page itu sendiri
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }
  
  // ✅ Redirect ke maintenance page jika maintenance mode aktif
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // ✅ Check if current path is public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  // ✅ Skip auth check untuk public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ✅ AUTH LOGIC - Hanya untuk protected routes
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  if (isExpired(token)) {
    return redirectToRefresh(request);
  }

  const role = getRoleFromToken(token);
  const currentPath = request.nextUrl.pathname;

  // ✅ Role-based access control
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};