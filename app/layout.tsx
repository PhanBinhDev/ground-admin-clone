import { Toaster } from '@/components/ui/sonner'
import { ModalsProvider } from '@/components/providers/modals-provider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OS49 Ground Control',
  description: 'Super-admin dashboard — internal use only',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      className={cn(cinzel.variable, cormorant.variable, jetbrainsMono.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <NextTopLoader color="#BC7053" height={2} showSpinner={false} shadow="0 0 8px #BC7053" />
        {children}
        <ModalsProvider />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
