import { createServerClient } from '@/lib/supabase'
import { DashboardClient } from '@/components/sections/DashboardClient'
import { randomQuote, randomPrompt } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createServerClient()

  // Parallel fetch all dashboard data
  const [salesRes, followersRes, oneThing] = await Promise.all([
    supabase.from('sales').select('amount').order('created_at', { ascending: false }),
    supabase.from('followers_log').select('count, created_at').order('created_at', { ascending: false }).limit(7),
    supabase.from('one_thing').select('text').eq('date', new Date().toISOString().split('T')[0]).single(),
  ])

  const sales     = salesRes.data ?? []
  const followers = followersRes.data ?? []
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.amount), 0)
  const currentFollowers = followers[0]?.count ?? 429

  return (
    <DashboardClient
      totalRevenue={totalRevenue}
      salesCount={sales.length}
      currentFollowers={currentFollowers}
      initialOneThing={oneThing.data?.text ?? ''}
      quote={randomQuote()}
      prompt={randomPrompt()}
    />
  )
}
