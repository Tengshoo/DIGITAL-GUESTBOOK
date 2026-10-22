import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#181310',
};

export const metadata: Metadata = {
  title: 'Atif & Isma | Wedding Digital Guestbook & Live Wall',
  description:
    'Kongsi gambar, video, atau momen indah yang anda rakam bersama kami.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Atif & Isma',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💍</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms">
      <body className="min-h-screen min-h-[100dvh] text-warm-900 selection:bg-rose-200 selection:text-rose-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
