import { NextRequest, NextResponse } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // Apply i18n middleware
  const response = intlMiddleware(request);

  // Get auth tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasSession = !!accessToken || !!refreshToken;
  const pathname = request.nextUrl.pathname;

  // Extract locale and route from pathname
  const locales = ['en', 'ar'];
  const locale = locales.find((l) => pathname.startsWith(`/${l}`)) || 'ar';
  const route = pathname.replace(`/${locale}`, '') || '/';

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some((p) => route.startsWith(p));

  // If accessing protected route without any token, redirect to signin
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
  }

  // Validate role-based dashboard access
  if (isProtectedRoute && hasSession) {
    const userRole = request.cookies.get('userRole')?.value || 'FACULTY';

    // Check dashboard access by role
    const isAdminDashboard = route.startsWith('/dashboard/admin');
    const isITDashboard = route.startsWith('/dashboard/it');
    const isSecurityDashboard = route.startsWith('/dashboard/security');
    const isFacultyDashboard = route.startsWith('/dashboard/doctors');

    // Validate role matches dashboard
    if (isAdminDashboard && userRole !== 'ADMIN') {
      const correctPath =
        userRole === 'IT'
          ? '/dashboard/it'
          : userRole === 'SECURITY'
            ? '/dashboard/security'
            : '/dashboard/doctors';
      return NextResponse.redirect(new URL(`/${locale}${correctPath}`, request.url));
    }

    if (isITDashboard && userRole !== 'IT') {
      const correctPath =
        userRole === 'ADMIN'
          ? '/dashboard/admin'
          : userRole === 'SECURITY'
            ? '/dashboard/security'
            : '/dashboard/doctors';
      return NextResponse.redirect(new URL(`/${locale}${correctPath}`, request.url));
    }

    if (isSecurityDashboard && userRole !== 'SECURITY') {
      const correctPath =
        userRole === 'ADMIN'
          ? '/dashboard/admin'
          : userRole === 'IT'
            ? '/dashboard/it'
            : '/dashboard/doctors';
      return NextResponse.redirect(new URL(`/${locale}${correctPath}`, request.url));
    }

    if (isFacultyDashboard && userRole !== 'FACULTY') {
      const correctPath =
        userRole === 'ADMIN'
          ? '/dashboard/admin'
          : userRole === 'IT'
            ? '/dashboard/it'
            : '/dashboard/security';
      return NextResponse.redirect(new URL(`/${locale}${correctPath}`, request.url));
    }
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*'],
};
