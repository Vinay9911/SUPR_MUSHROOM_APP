import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailPage } from '@/components/pages/ProductDetailPage'

export const revalidate = 1800 // 30 minutes

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
  const supabase = await createClient()
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

  return <ProductDetailPage product={product} />
}