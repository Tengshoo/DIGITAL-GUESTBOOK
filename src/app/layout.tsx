import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arman & Farah | Wedding Digital Guestbook & Live Wall',
  description:
    'Kongsi gambar, video, atau momen indah yang anda rakam bersama kami.',
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
      <body className="min-h-screen text-warm-900 selection:bg-rose-200 selection:text-rose-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
