import { createServerClient } from '@/lib/supabase'
import { GrowthClient } from '@/components/sections/GrowthClient'

export default async function GrowthPage() {
  const supabase = createServerClient()

  const { data: followerHistory } = await supabase
    .from('followers_log')
    .select('count, created_at')
    .order('created_at', { ascending: true })
    .limit(30)

  return <GrowthClient followerHistory={followerHistory ?? []} />
}
