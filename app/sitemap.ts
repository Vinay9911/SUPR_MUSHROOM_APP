import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/config'
import { blogPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, updated_at')
    .eq('is_deleted', false)

  const productUrls = (products || []).map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const blogUrls = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/chef`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...blogUrls,
    ...productUrls,
  ]
}