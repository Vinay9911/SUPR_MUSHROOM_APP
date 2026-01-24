import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailPage } from '@/components/pages/ProductDetailPage'
import { ProductSchema } from '@/components/shared/SEO';
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const revalidate = 1800 

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Buy Fresh Organic Mushrooms | Supr Mushrooms`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

export async function generateStaticParams() {

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('is_deleted', false)

  return (products || []).map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  const seoData = {
    name: product.name,
    description: product.description,
    images: product.images,
    price: product.price,
    currency: 'INR',
    stock: product.stock,
    rating: product.rating || 5,
    reviews: product.reviews_count || 120
  };

  return (
    <>
      <ProductSchema product={seoData} /> {/* Inject Schema */}
      <ProductDetailPage product={product} />
    </>
  )
}