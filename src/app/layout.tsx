import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shpaldocs.ru'),
  title: {
    default: 'Shpal Docs - Документация по настройке принтеров',
    template: '%s | Shpal Docs',
  },
  description: 'Полное руководство по настройке и обслуживанию принтеров GoDEX, Zebra, Brother для системы регистрации EXPOFORUM',
  keywords: ['принтеры', 'GoDEX', 'Zebra', 'Brother', 'настройка', 'документация', 'руководство', 'калибровка'],
  authors: [{ name: 'Shpal Team' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://shpaldocs.ru',
    title: 'Shpal Docs - Документация по принтерам EXPOFORUM',
    description: 'Добро пожаловать в документацию - все руководства и инструкции в одном месте',
    siteName: 'www.shpaldocs.ru',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shpal Docs - Документация EXPOFORUM',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shpal Docs - Документация по принтерам EXPOFORUM',
    description: 'Добро пожаловать в документацию - все руководства и инструкции в одном месте',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e40af',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html 
      lang="ru" 
      className={`${inter.className} ${inter.variable} ${mono.variable}`} 
      suppressHydrationWarning 
      data-theme="dark"
    >
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
