import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <Link href="/" className="bg-brand-brown text-white px-6 py-3 rounded-full font-bold inline-block">
          Go Home
        </Link>
      </div>
    </div>
  )
}