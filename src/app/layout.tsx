import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MetalRateTicker } from '@/components/MetalRateTicker'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mahi Fashion Jewellery | Exquisite Gold & Silver',
  description: 'Premium gold and silver jewellery for the modern connoisseur.',
  icons: {
    icon: '/mahilogo.png',
  },
}

import { ToastProvider } from '@/context/ToastContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(playfair.variable, lato.variable)}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ToastProvider>
          <MetalRateTicker />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
