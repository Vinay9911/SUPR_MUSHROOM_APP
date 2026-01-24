import { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Buy Fresh Mushrooms in Delhi NCR | Organic Oyster & Button Mushrooms | Premium Farm',
  description: 'Fresh organic mushrooms delivered across Delhi, Noida, Gurugram, Ghaziabad. Buy oyster mushrooms, button mushrooms, cremini & king oyster. Climate-controlled vertical farming. Wholesale & restaurant supply. Order now!',
  keywords: [
    'mushrooms Delhi',
    'buy oyster mushrooms Delhi',
    'fresh mushrooms Noida',
    'button mushrooms Gurugram',
    'wholesale mushrooms NCR',
    'organic mushrooms Ghaziabad',
    'mushroom farm Delhi',
    'vertical farm mushrooms',
    'aeroponic mushrooms',
    'mushroom delivery Delhi NCR',
    'premium mushrooms Delhi',
    'restaurant mushroom supplier'
  ],
  openGraph: {
    title: 'Fresh Organic Mushrooms Delhi NCR - Premium Vertical Farm',
    description: 'Climate-controlled mushroom farming in Delhi. Farm-fresh oyster, button, cremini mushrooms delivered to your door.',
  },
  alternates: {
    canonical: 'https://supr-mushroom.vercel.app',
  }
}

// ✅ This makes the page STATIC (pre-rendered at build time)
export const revalidate = 3600 // Revalidate every hour

async function getProducts(): Promise<Product[]> {
  // ✅ Use direct Supabase client (NO cookies, NO dynamic APIs)
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
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