// app/layout.tsx
import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter, Roboto } from 'next/font/google'
import Footer from './components/Footer'
import './globals.css'
import NavbarWrapper from './components/NavbarWrapper'
import ClientWrapper from './components/ClientWrapper'
import ToastProvider from './components/ToastProvider'

// Configure Inter font for general text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Configure Roboto font for specific elements (like the navbar)
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

// Metadata for the application
export const metadata: Metadata = {
  title: 'つくるテレビ - クリエイターとファンをつなぐプラットフォーム',
  description:
    'つくるテレビは、クリエイターとファンをつなぐ全く新しいビデオとクラウドファンディングのプラットフォームです。',
  keywords: 'クリエイター, ファン, ビデオ, クラウドファンディング, プラットフォーム',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: { url: '/favicon.png', type: 'image/png' },
    apple: { url: '/favicon.png', type: 'image/png' },
  },
}

// ✅ FIX: viewport must be exported separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Root layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <div className="min-h-screen maw-w-[1440px] flex flex-col">
          <NavbarWrapper />
          <main className="pt-25 md:pt-20 bg-[#f5f7f9]">{children}</main>
          <ClientWrapper />
          <Footer />
          <ToastProvider />
        </div>
      </body>
    </html>
  )
}
