// app/layout.tsx
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import Footer from './components/Footer';
import './globals.css';
import NavbarWrapper from './components/NavbarWrapper';
import ClientWrapper from './components/ClientWrapper';

// Configure Inter font for general text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configure Roboto font for specific elements (like the navbar)
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

// Metadata for the application
export const metadata: Metadata = {
  title: 'つくるテレビ - クリエイターとファンをつなぐプラットフォーム',
  description: 'つくるテレビは、クリエイターとファンをつなぐ全く新しいビデオとクラウドファンディングのプラットフォームです。',
  keywords: 'クリエイター, ファン, ビデオ, クラウドファンディング, プラットフォーム',
  icons: {
    icon: [
      { url: '/assets/common/favicon.png', type: 'image/png' },
    ],
    shortcut: '/assets/common/favicon.png',
    apple: '/assets/common/favicon.png',
  },
};

// ✅ FIX: viewport must be exported separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ja" className={`${inter.variable} ${roboto.variable}`}>
      <body >
        <div className="min-h-screen maw-w-[1440px] flex flex-col">
          <NavbarWrapper />
          <main className="flex-grow">
            {children}
          </main>
          <ClientWrapper />
          <Footer />
        </div>
      </body>
    </html>
  );
}