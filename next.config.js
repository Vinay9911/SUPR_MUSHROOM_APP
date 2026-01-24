/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pyegdthsxfmsgdoaqsuu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig