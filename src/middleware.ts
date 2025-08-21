import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (!request.cookies.has('theme')) {
    response.cookies.set('theme', 'light', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/(ru|en)/:path*'],
};
