import '@/index.css';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, locales } from '@/i18n/config';
import { getMessages } from 'next-intl/server';
import { ClientRoot } from './сlient-root';
import { notFound } from 'next/navigation';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientRoot>{children}</ClientRoot>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
