import "./globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import CookieBanner from "@/components/CookieBanner";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors position="top-center"/>
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
