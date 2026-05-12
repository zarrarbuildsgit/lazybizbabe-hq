import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { ThreadsInsights } from '@/types'

const BASE = 'https://graph.threads.net/v1.0'

export async function GET() {
  const supabase = createServerClient()

  // Pull token from Supabase (set via OAuth flow)
  const { data: auth } = await supabase
    .from('threads_auth')
    .select('access_token, user_id, expires_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  // Fall back to env var (manual override)
  const token  = auth?.access_token ?? process.env.THREADS_ACCESS_TOKEN
  const userId = auth?.user_id      ?? process.env.THREADS_USER_ID

  // No credentials at all — return mock data
  if (!token || !userId) {
    return NextResponse.json({
      followers_count: 429,
      mock: true,
      connect_url: '/settings',
      posts: [
        { id: 'mock-1', text: '"having adhd is like / you KNOW what to do / you just... don\'t do it / then you hate yourself for not doing it"', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), like_count: 34, replies_count: 7, repost_count: 3, views: 1200 },
        { id: 'mock-2', text: '"I\'m growing here slow but steadily. Finally hit the 400 mark."', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), like_count: 49, replies_count: 48, repost_count: 2, views: 1050 },
        { id: 'mock-3', text: '"Selling is not asking for permission. It\'s offering a solution."', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), like_count: 25, replies_count: 26, repost_count: 1, views: 820 },
      ],
    })
  }

  const expiresAt = auth?.expires_at ? new Date(auth.expires_at) : null
  const daysLeft  = expiresAt ? Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  try {
    const profileRes = await fetch(
      `${BASE}/${userId}?fields=id,username,followers_count&access_token=${token}`
    )

    if (!profileRes.ok) {
      console.error('[Threads API] Profile fetch failed:', await profileRes.text())
      return NextResponse.json({ followers_count: 429, mock: true, token_expired: true, connect_url: '/settings', posts: [] })
    }

    const profile  = await profileRes.json()
    const postsRes = await fetch(
      `${BASE}/${userId}/threads?fields=id,text,timestamp,like_count,replies_count,repost_count,views&limit=20&access_token=${token}`
    )
    const postsData = postsRes.ok ? await postsRes.json() : { data: [] }

    return NextResponse.json({
      followers_count: profile.followers_count ?? 0,
      posts: postsData.data ?? [],
      token_expires_in_days: daysLeft ?? undefined,
    } as ThreadsInsights & { token_expires_in_days?: number })

  } catch (err) {
    console.error('[Threads API] Error:', err)
    return NextResponse.json({ error: 'Threads API failed', mock: true, followers_count: 429, posts: [] }, { status: 500 })
  }
}
