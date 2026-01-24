import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { DataProvider } from '@/components/providers/DataProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { WishlistProvider } from '@/components/providers/WishlistProvider'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { Chatbot } from '@/components/ui/Chatbot'
import { OrganizationSchema } from '@/components/shared/SEO';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Supr Mushrooms | Premium Organic Fungi',
  description: 'Buy fresh Oyster and Shiitake mushrooms in Delhi NCR. Grown in sterile environments, chemical-free, and delivered farm-to-table in 24 hours.',
  keywords: ['mushrooms', 'organic', 'Delhi NCR', 'fresh produce', 'oyster mushrooms', 'shiitake'],
  authors: [{ name: 'Supr Mushrooms' }],
  openGraph: {
    title: 'Supr Mushrooms | Premium Organic Fungi',
    description: 'Fresh lab-grown mushrooms delivered to your door in Delhi NCR',
    url: 'https://supr-mushroom.vercel.app',
    siteName: 'Supr Mushrooms',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595503426955-d6c561491714',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supr Mushrooms | Premium Organic Fungi',
    description: 'Fresh lab-grown mushrooms delivered to your door',
    images: ['https://images.unsplash.com/photo-1595503426955-d6c561491714'],
  },
  metadataBase: new URL('https://supr-mushroom.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-brand-light text-brand-text">
        <OrganizationSchema />
        <AuthProvider>
          <DataProvider>
            <WishlistProvider>
              <CartProvider>
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
                <Chatbot />
              </CartProvider>
            </WishlistProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}