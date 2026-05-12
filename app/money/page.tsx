import { createServerClient } from '@/lib/supabase'
import { MoneyClient } from '@/components/sections/MoneyClient'

export default async function MoneyPage() {
  const supabase = createServerClient()
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })

  return <MoneyClient initialSales={sales ?? []} />
}
