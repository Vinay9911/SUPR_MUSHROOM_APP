import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserOrdersPage } from '@/components/pages/UserOrdersPage'

export const metadata: Metadata = {
  title: 'My Orders | Supr Mushrooms',
  description: 'Track your Supr Mushrooms orders',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(name, images))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <UserOrdersPage orders={orders || []} />
}