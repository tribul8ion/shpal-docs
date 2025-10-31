import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Shpal Docs - Документация по настройке принтеров',
    template: '%s | Shpal Docs',
  },
  description: 'Полное руководство по настройке и обслуживанию принтеров GoDEX, Zebra, Brother для системы регистрации EXPOFORUM',
  keywords: ['принтеры', 'GoDEX', 'Zebra', 'Brother', 'настройка', 'документация', 'руководство', 'калибровка'],
  authors: [{ name: 'Shpal Team' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'Shpal Docs - Документация по принтерам',
    description: 'Руководства по настройке принтеров для системы регистрации',
    siteName: 'Shpal Docs',
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
      </body>
    </html>
  );
}
