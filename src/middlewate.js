import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;

  // Public paths
  const publicPaths = ['/login', '/admin/admin-login'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token → redirect
  if (!token) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/admin-login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Token exists → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/product/:path*',   // protects all product pages
  ],
};
