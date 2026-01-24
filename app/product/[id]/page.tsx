import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailPage } from '@/components/pages/ProductDetailPage'
import { ProductSchema } from '@/components/shared/SEO'
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
      title: 'Product Not Found | Supr Mushrooms',
    }
  }

  const keywords = [
    `${product.name} Delhi`,
    `buy ${product.name} Delhi NCR`,
    `fresh ${product.name} Noida`,
    `organic ${product.name} Gurugram`,
    `${product.name} Ghaziabad`,
    'mushrooms Delhi',
    'organic mushrooms NCR'
  ]

  return {
    title: `Buy ${product.name} in Delhi NCR | Fresh Organic ${product.name} | Supr Mushrooms`,
    description: `${product.description} Delivered fresh across Delhi, Noida, Gurugram, Ghaziabad. Order premium ${product.name} from our climate-controlled vertical farm. ${product.weight} - ₹${product.price}`,
    keywords,
    openGraph: {
      title: `${product.name} - Fresh Organic Mushrooms Delhi NCR`,
      description: `${product.description} Climate-controlled farming. Farm-fresh delivery.`,
      images: product.images,
    },
    alternates: {
      canonical: `https://supr-mushroom.vercel.app/product/${params.id}`,
    }
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
  }

  return (
    <>
      <ProductSchema product={seoData} />
      <ProductDetailPage product={product} />
    </>
  )
}