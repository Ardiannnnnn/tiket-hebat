import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Baseapi } from '@/service/api';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const callbackUrl = new URL(request.url).searchParams.get('callback') || '/';

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const response = await Baseapi.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;

    const redirectResponse = NextResponse.redirect(new URL(callbackUrl, request.url));

    redirectResponse.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15, // 15 menit
    });

    return redirectResponse;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}