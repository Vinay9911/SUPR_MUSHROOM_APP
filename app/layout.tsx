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
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SITE_URL } from '@/lib/config'

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
    url: SITE_URL,
    siteName: 'Supr Mushrooms - Premium Mushroom Farm Delhi NCR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Supr Mushrooms — Fresh organic mushrooms delivered across Delhi NCR'
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Mushrooms Delhi NCR | Organic Vertical Farm',
    description: 'Buy premium oyster & button mushrooms in Delhi. Farm-to-door delivery across NCR.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
        </ThemeProvider>
      </body>
    </html>
  )
}