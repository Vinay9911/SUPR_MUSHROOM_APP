import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-light pt-24 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="aspect-square bg-brand-cream/20 rounded-3xl animate-pulse flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-brown/30" size={48} />
        </div>
        
        {/* Text Skeleton */}
        <div className="space-y-6 pt-8">
          <div className="h-8 w-32 bg-brand-cream/40 rounded animate-pulse" />
          <div className="h-16 w-3/4 bg-brand-cream/40 rounded animate-pulse" />
          <div className="h-24 w-full bg-brand-cream/20 rounded animate-pulse" />
          <div className="flex gap-4 pt-8">
             <div className="h-14 flex-1 bg-brand-cream/40 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}