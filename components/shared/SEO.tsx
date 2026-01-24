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
      seller: {
        '@type': 'Organization',
        name: 'Supr Mushrooms',
      },
      areaServed: {
        '@type': 'City',
        name: 'Delhi NCR',
      },
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews || 0,
      bestRating: '5',
      worstRating: '1'
    } : undefined
  };

  return (
    <Script
      id={`product-schema-${product.name}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Supr Mushrooms',
    alternateName: 'Supr Mushrooms Delhi NCR',
    url: 'https://supr-mushroom.vercel.app',
    logo: 'https://supr-mushroom.vercel.app/logo.png',
    description: 'Premium organic mushroom farm in Delhi NCR using climate-controlled vertical farming and aeroponics. Fresh oyster, button, cremini and king oyster mushrooms delivered across Delhi, Noida, Gurugram, Ghaziabad.',
    founder: {
      '@type': 'Person',
      name: 'Vinay Aggarwal'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8826986127',
      contactType: 'customer service',
      email: 'vinayaggarwal271@gmail.com',
      areaServed: ['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad', 'NCR'],
      availableLanguage: ['English', 'Hindi']
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi NCR',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://wa.me/918826986127'
    ]
  };

  return (
    <Script
      id="org-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://supr-mushroom.vercel.app',
    name: 'Supr Mushrooms - Premium Mushroom Farm Delhi NCR',
    image: 'https://supr-mushroom.vercel.app/logo.png',
    description: 'Fresh organic mushrooms grown using climate-controlled vertical farming in Delhi. We deliver premium oyster mushrooms, button mushrooms, cremini and king oyster mushrooms across Delhi NCR including Noida, Gurugram, Ghaziabad and Faridabad.',
    url: 'https://supr-mushroom.vercel.app',
    telephone: '+91-8826986127',
    email: 'vinayaggarwal271@gmail.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vertical Farm',
      addressLocality: 'Delhi',
      addressRegion: 'NCR',
      postalCode: '110001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.6139,
      longitude: 77.2090
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Delhi'
      },
      {
        '@type': 'City',
        name: 'Noida'
      },
      {
        '@type': 'City',
        name: 'Gurugram'
      },
      {
        '@type': 'City',
        name: 'Ghaziabad'
      },
      {
        '@type': 'City',
        name: 'Faridabad'
      }
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '09:00',
      closes: '21:00'
    },
    paymentAccepted: ['Cash', 'UPI'],
    currenciesAccepted: 'INR',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Premium Organic Mushrooms',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Fresh Oyster Mushrooms',
            description: 'Premium organic oyster mushrooms grown in climate-controlled vertical farm'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Button Mushrooms',
            description: 'Fresh button mushrooms delivered across Delhi NCR'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Cremini Mushrooms',
            description: 'Organic cremini mushrooms for restaurants and bulk buyers'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'King Oyster Mushrooms',
            description: 'Premium king oyster mushrooms grown using aeroponic farming'
          }
        }
      ]
    }
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you deliver mushrooms in Delhi NCR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we deliver fresh organic mushrooms across Delhi NCR including Delhi, Noida, Gurugram, Ghaziabad, and Faridabad within 24-48 hours of harvest.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are your mushrooms organically grown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our mushrooms are 100% organic, grown in climate-controlled vertical farms using aeroponic technology. No pesticides, no heavy metals, no soil contamination.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you supply mushrooms to restaurants and wholesalers in Delhi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we supply bulk quantities to restaurants, hotels, and wholesale buyers across Delhi NCR. Contact us at +91-8826986127 for wholesale pricing and regular supply arrangements.'
        }
      },
      {
        '@type': 'Question',
        name: 'What farming method do you use to grow mushrooms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We use advanced climate-controlled vertical farming combined with aeroponic technology. This ensures consistent quality, zero contamination, and year-round fresh mushroom supply.'
        }
      },
      {
        '@type': 'Question',
        name: 'What types of mushrooms do you sell in Delhi NCR?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We grow and deliver fresh oyster mushrooms, button mushrooms, cremini mushrooms, and king oyster mushrooms across Delhi NCR. All varieties are organically grown and pesticide-free.'
        }
      },
      {
        '@type': 'Question',
        name: 'How fresh are the mushrooms delivered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our mushrooms are harvested fresh and delivered within 24-48 hours to Delhi, Noida, Gurugram, and Ghaziabad. We ensure farm-to-door freshness with climate-controlled packaging.'
        }
      }
    ]
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}