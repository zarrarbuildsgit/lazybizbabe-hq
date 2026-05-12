import { BrainClient } from '@/components/sections/BrainClient'
import { createServerClient } from '@/lib/supabase'

export default async function BrainPage() {
  const supabase = createServerClient()
  const [dumpsRes, ideasRes] = await Promise.all([
    supabase.from('brain_dumps').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('later_ideas').select('*').order('created_at', { ascending: false }),
  ])
  return (
    <BrainClient
      initialDumps={dumpsRes.data ?? []}
      initialLaterIdeas={ideasRes.data ?? []}
    />
  )
}
