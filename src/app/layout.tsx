import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import './globals.css'
import Header from '@/components/block/header'
import { env } from '@/env.mjs'
import { Footer } from '@/components/block/footer'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_BRAND_SHORT} - ${env.NEXT_PUBLIC_BRAND_SLOGAN}`,
  description:
    'Tra cứu văn bản pháp luật về giao thông đường bộ, biển báo giao thông, vạch kẻ đường, thuật ngữ giao thông đường bộ...',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'flex flex-col min-h-full bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Analytics />
        <SpeedInsights />
        <div style={{ minHeight: 72 }}>
          <Header />
        </div>
        {children}
        <div className="grow" />
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
