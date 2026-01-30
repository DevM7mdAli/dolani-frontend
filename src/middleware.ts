import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse<unknown> | undefined {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/signin', request.url));
  }
}
