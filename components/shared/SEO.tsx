import Script from 'next/script';

interface ProductSEO {
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

interface LocalBusinessSEO {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  image: string;
  priceRange: string;
}

export function ProductSchema({ product }: { product: ProductSEO }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.name.toLowerCase().replace(/\s+/g, '-'),
    brand: {
      '@type': 'Brand',
      name: 'Supr Mushrooms',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://supr-mushroom.vercel.app/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      itemCondition: 'https://schema.org/NewCondition',
      areaServed: 'Delhi NCR', // Critical for Local SEO
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews || 0,
      bestRating: "5",
      worstRating: "1"
    } : undefined
  };

  return (
    <Script
      id={`product-schema-${product.name}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Supr Mushrooms',
    url: 'https://supr-mushroom.vercel.app',
    logo: 'https://supr-mushroom.vercel.app/logo.png',
    founder: 'Vinay Aggarwal',
    
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8826986127',
      contactType: 'customer service',
      areaServed: ['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Meerut'],
      availableLanguage: ['English', 'Hindi']
    }
  };

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}