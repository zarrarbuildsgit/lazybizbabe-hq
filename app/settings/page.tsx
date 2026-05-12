import { createServerClient } from '@/lib/supabase'
import { SettingsClient } from '@/components/sections/SettingsClient'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ threads_error?: string; threads_connected?: string }>
}) {
  const supabase = createServerClient()
  const params   = await searchParams

  // Check if Threads is already connected
  const { data: auth } = await supabase
    .from('threads_auth')
    .select('user_id, expires_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const expiresAt = auth?.expires_at ? new Date(auth.expires_at) : null
  const daysLeft  = expiresAt
    ? Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <SettingsClient
      isConnected={!!auth}
      userId={auth?.user_id ?? null}
      daysLeft={daysLeft}
      justConnected={params.threads_connected === 'true'}
      errorMessage={params.threads_error ?? null}
    />
  )
}
