import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// ── TOKEN REFRESH ──
// Long-lived tokens last 60 days but CAN be refreshed if still valid.
// Call this route via a Vercel Cron Job every 45 days to keep it alive.
//
// Vercel cron setup (add to vercel.json):
// "crons": [{ "path": "/api/auth/threads/refresh", "schedule": "0 0 */45 * *" }]
//
// Or Ope can visit /api/auth/threads/refresh manually from the Settings page.

export async function GET() {
  const appSecret = process.env.THREADS_APP_SECRET!
  const supabase  = createServerClient()

  // Get current token from Supabase
  const { data: auth, error } = await supabase
    .from('threads_auth')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !auth) {
    return NextResponse.json(
      { error: 'No Threads token found. Please connect Threads first via /api/auth/threads' },
      { status: 404 }
    )
  }

  // Check if token is within 15 days of expiry (refresh window)
  const expiresAt   = new Date(auth.expires_at)
  const daysLeft    = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const needsRefresh = daysLeft < 15

  if (!needsRefresh) {
    return NextResponse.json({
      message: `Token is healthy. ${daysLeft} days until expiry. No refresh needed.`,
      expires_at: auth.expires_at,
      days_left: daysLeft,
    })
  }

  try {
    // Refresh the long-lived token
    const refreshRes = await fetch(
      `https://graph.threads.net/refresh_access_token?` + new URLSearchParams({
        grant_type:   'th_refresh_token',
        access_token: auth.access_token,
      })
    )

    if (!refreshRes.ok) {
      const err = await refreshRes.text()
      console.error('[Threads Refresh] Failed:', err)
      return NextResponse.json({ error: 'Token refresh failed', detail: err }, { status: 500 })
    }

    const refreshed: { access_token: string; token_type: string; expires_in: number } =
      await refreshRes.json()

    const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()

    // Update Supabase
    await supabase
      .from('threads_auth')
      .update({
        access_token: refreshed.access_token,
        expires_at:   newExpiresAt,
        updated_at:   new Date().toISOString(),
      })
      .eq('id', auth.id)

    console.log('[Threads Refresh] ✓ Token refreshed. New expiry:', newExpiresAt)

    return NextResponse.json({
      message: 'Token refreshed successfully ✦',
      expires_at: newExpiresAt,
      days_until_expiry: 60,
    })

  } catch (err) {
    console.error('[Threads Refresh] Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error during refresh' }, { status: 500 })
  }
}
