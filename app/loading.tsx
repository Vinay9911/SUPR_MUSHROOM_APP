import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-brand-brown" size={48} />
        <p className="text-brand-muted font-serif animate-pulse">Loading Supr Organic...</p>
      </div>
    </div>
  )
}