import { createServerClient } from '@/lib/supabase'
import { ProductsClient } from '@/components/sections/ProductsClient'

export default async function ProductsPage() {
  const supabase = createServerClient()
  const [productsRes, testiRes] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
  ])
  return (
    <ProductsClient
      initialProducts={productsRes.data ?? []}
      initialTestimonials={testiRes.data ?? []}
    />
  )
}
