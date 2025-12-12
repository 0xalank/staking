import '@/public/styles/globals.css';

import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import { Chakra_Petch } from 'next/font/google';
import Providers from '@/lib/context/providers';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { StateProvider } from '../store';
import { APP_TITLE, APP_DESCRIPTION } from '@/lib/config';
import Header from '@/components/common/header';
import { RedirectModal } from '@/components/redirectModal/RedirectModal';
import { FooterSocials } from '@/components/common/FooterSocials';

const satoshiFont = localFont({
  src: [
    { path: '../fonts/Satoshi-Light.woff2', weight: '300' },
    { path: '../fonts/Satoshi-Regular.woff2', weight: '400' },
    { path: '../fonts/Satoshi-Medium.woff2', weight: '500' },
    { path: '../fonts/Satoshi-Bold.woff2', weight: '700' },
  ],
  variable: '--font-satoshi',
});

const chakraPetchFont = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-techno',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://soap.qu.ai'),
  icons: {
    icon: '/images/quai-logo.png',
    shortcut: '/images/quai-logo.png',
    apple: '/images/quai-logo.png',
  },
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: APP_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `bg-[#0C0C0C] text-white antialiased ${satoshiFont.variable} ${chakraPetchFont.variable} ${inter.className}`
        )}
      >
        <StateProvider>
          <Providers>
            <Header />
            <div className="relative">{children}</div>
            <FooterSocials />
            <RedirectModal />
            <Toaster />
            <Analytics />
          </Providers>
        </StateProvider>
      </body>
    </html>
  );
}
