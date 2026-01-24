import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('is_deleted', false)

  const productUrls = (products || []).map((product) => ({
    url: `https://supr-mushroom.vercel.app/product/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://supr-mushroom.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://supr-mushroom.vercel.app/chef',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}