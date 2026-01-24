import { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Fresh Lab-Grown Mushrooms Delhi | Supr Mushrooms',
  description: 'Buy fresh Oyster and Shiitake mushrooms in Delhi NCR. Grown in sterile environments, chemical-free, and delivered farm-to-table in 24 hours.',
}

export const revalidate = 3600 // Revalidate every hour

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function Home() {
  const products = await getProducts()
  
  return <HomePage initialProducts={products} />
}