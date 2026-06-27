'use client'

import React, { useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { DataContext } from '@/components/providers/DataProvider';
import { Skeleton } from '@/components/ui/Skeleton';

import { HeroSection } from './home/HeroSection';
import { FeaturesSection } from './home/FeaturesSection';
import { ShopSection } from './home/ShopSection';
import { DeliveryAreas } from './home/DeliveryAreas';
import { B2BSection } from './home/B2BSection';
import { ContactSection } from './home/ContactSection';
import { FAQSection } from './home/FAQSection';

interface HomePageProps {
  initialProducts: any[];
}

export const HomePage: React.FC<HomePageProps> = ({ initialProducts }) => {
  const dataContext = useContext(DataContext);
  const pathname = usePathname();

  const products = initialProducts.length > 0 ? initialProducts : (dataContext?.products || []);
  const loading = dataContext?.loading || false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading && initialProducts.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto">
        <Skeleton className="w-full h-96 mb-12 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="w-full aspect-square rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const visibleProducts = products.filter((p: any) => !p.is_deleted && p.status !== 'hidden');

  return (
    <div suppressHydrationWarning className="pb-0 bg-brand-light w-full overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <ShopSection visibleProducts={visibleProducts} />
      <DeliveryAreas />
      <B2BSection />
      <ContactSection />
      <FAQSection />
    </div>
  );
};