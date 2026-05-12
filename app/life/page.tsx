import { createServerClient } from '@/lib/supabase'
import { LifeClient } from '@/components/sections/LifeClient'
import { todayStr } from '@/lib/utils'

export default async function LifePage() {
  const supabase = createServerClient()
  const today = todayStr()

  const [habitsRes, milestonesRes, journalRes] = await Promise.all([
    supabase.from('habits').select('habit_id').eq('completed_date', today),
    supabase.from('milestones').select('*').order('created_at', { ascending: false }),
    supabase.from('journals').select('entry, created_at').order('created_at', { ascending: false }).limit(3),
  ])

  return (
    <LifeClient
      completedToday={(habitsRes.data ?? []).map(h => h.habit_id)}
      initialMilestones={milestonesRes.data ?? []}
      recentJournals={journalRes.data ?? []}
    />
  )
}
