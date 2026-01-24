import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Supr Mushrooms',
    short_name: 'Supr Mushrooms',
    description: 'Premium organic mushrooms delivered fresh',
    start_url: '/',
    display: 'standalone',
    background_color: '#fefae0',
    theme_color: '#bc6c25',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}