import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Supr Mushrooms — Fresh Organic Mushrooms Delhi NCR',
    short_name: 'Supr Mushrooms',
    description: 'Premium organic mushrooms delivered fresh across Delhi NCR within 24 hours.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fefae0',
    theme_color: '#bc6c25',
    categories: ['food', 'shopping'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}