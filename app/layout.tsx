import type { Metadata, Viewport } from 'next'
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
import { OrganizationSchema, LocalBusinessSchema, FAQSchema } from '@/components/shared/SEO'
// 1. Import the Capacitor Client logic
import CapacitorClient from '@/components/providers/CapacitorClient'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
})

// 2. Add Viewport export for Safe Area (Notch) handling
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // This extends the app under the status bar
}

export const metadata: Metadata = {
  title: 'Fresh Mushrooms in Delhi NCR | Premium Organic Mushroom Farm | Buy Oyster & Button Mushrooms',
  description: 'Buy fresh organic mushrooms in Delhi NCR - Oyster, Button, Cremini & King Oyster mushrooms. Climate-controlled vertical farming. Farm-to-door delivery in Delhi, Noida, Gurugram, Ghaziabad. Wholesale & retail.',
  keywords: [
    'mushrooms in Delhi',
    'buy mushrooms Delhi NCR',
    'fresh oyster mushrooms Delhi',
    'button mushrooms Noida',
    'organic mushrooms Gurugram',
    'mushroom supplier Delhi',
    'wholesale mushrooms NCR',
    'vertical farm mushrooms',
    'aeroponic mushrooms Delhi',
    'fresh mushrooms Ghaziabad',
    'premium mushrooms Delhi',
    'mushroom delivery NCR'
  ],
  authors: [{ name: 'Supr Mushrooms Delhi' }],
  openGraph: {
    title: 'Fresh Organic Mushrooms Delhi NCR | Climate-Controlled Vertical Farm',
    description: 'Premium oyster, button, cremini & king oyster mushrooms grown in Delhi. Farm-fresh delivery across NCR. Wholesale & restaurant supply available.',
    url: 'https://supr-mushroom.vercel.app',
    siteName: 'Supr Mushrooms - Premium Mushroom Farm Delhi NCR',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595503426955-d6c561491714',
        width: 1200,
        height: 630,
        alt: 'Fresh organic mushrooms grown in vertical farm in Delhi NCR'
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Mushrooms Delhi NCR | Organic Vertical Farm',
    description: 'Buy premium oyster & button mushrooms in Delhi. Farm-to-door delivery across NCR.',
    images: ['https://images.unsplash.com/photo-1595503426955-d6c561491714'],
  },
  metadataBase: new URL('https://supr-mushroom.vercel.app'),
  alternates: {
    canonical: 'https://supr-mushroom.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="IN-DL" />
        <meta name="geo.placename" content="Delhi NCR" />
        <meta name="geo.position" content="28.6139;77.2090" />
        <meta name="ICBM" content="28.6139, 77.2090" />
        <meta name="google-site-verification" content="CCCueTxJCGAaxLU62l5QMYY2ihSB1h4WaCV5bOYzTVg" />
      </head>
      <body className="font-sans bg-brand-light text-brand-text" suppressHydrationWarning>
        <OrganizationSchema />
        <LocalBusinessSchema />
        <FAQSchema />
        <AuthProvider>
          <DataProvider>
            <WishlistProvider>
              <CartProvider>
                {/* 3. Add the Capacitor Client component here */}
                <CapacitorClient />
                
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                <Navbar />
                
                {/* 4. Add padding-top/bottom using env() so content isn't hidden by the notch */}
                <main className="min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
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