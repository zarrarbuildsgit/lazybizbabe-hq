import { NextResponse } from 'next/server'

// ── STEP 1: Start the Threads OAuth flow ──
// Ope visits /api/auth/threads → gets redirected to Meta's login screen
// After she authorises, Meta sends her back to /api/auth/threads/callback

export async function GET() {
  const appId      = process.env.THREADS_APP_ID
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/threads/callback`

  if (!appId) {
    return NextResponse.json(
      { error: 'THREADS_APP_ID is not set in environment variables' },
      { status: 500 }
    )
  }

  // Scopes needed:
  // threads_basic          → read profile + posts
  // threads_read_replies   → read replies/engagement
  // threads_manage_insights → read follower count + post metrics
  const scopes = [
    'threads_basic',
    'threads_read_replies',
    'threads_manage_insights',
  ].join(',')

  const authUrl = new URL('https://threads.net/oauth/authorize')
  authUrl.searchParams.set('client_id', appId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('response_type', 'code')

  // Redirect Ope to Meta's auth screen
  return NextResponse.redirect(authUrl.toString())
}
