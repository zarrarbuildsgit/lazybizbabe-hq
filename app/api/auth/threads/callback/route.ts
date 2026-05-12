import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// ── STEP 2: Handle Meta's redirect back to our app ──
// Meta sends: /api/auth/threads/callback?code=XXXX
// We then:
//   1. Exchange the code for a SHORT-lived token (1 hour)
//   2. Exchange that for a LONG-lived token (60 days)
//   3. Save the long-lived token + user ID to Supabase
//   4. Redirect Ope to the Growth page — all done

const THREADS_API = 'https://graph.threads.net'

export async function GET(req: NextRequest) {
  const appId       = process.env.THREADS_APP_ID!
  const appSecret   = process.env.THREADS_APP_SECRET!
  const appUrl      = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/threads/callback`

  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  // ── Meta returned an error ──
  if (error) {
    const desc = searchParams.get('error_description') ?? 'Unknown error'
    console.error('[Threads OAuth] Error from Meta:', error, desc)
    return NextResponse.redirect(
      `${appUrl}/settings?threads_error=${encodeURIComponent(desc)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?threads_error=no_code`)
  }

  try {
    // ── Step 2a: Exchange code for short-lived token ──
    const shortTokenRes = await fetch(`${THREADS_API}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     appId,
        client_secret: appSecret,
        grant_type:    'authorization_code',
        redirect_uri:  redirectUri,
        code,
      }),
    })

    if (!shortTokenRes.ok) {
      const err = await shortTokenRes.text()
      console.error('[Threads OAuth] Short token exchange failed:', err)
      return NextResponse.redirect(
        `${appUrl}/settings?threads_error=${encodeURIComponent('Token exchange failed')}`
      )
    }

    const shortToken: { access_token: string; user_id: string } = await shortTokenRes.json()
    console.log('[Threads OAuth] Got short-lived token for user:', shortToken.user_id)

    // ── Step 2b: Exchange for long-lived token (60 days) ──
    const longTokenRes = await fetch(
      `${THREADS_API}/access_token?` + new URLSearchParams({
        grant_type:        'th_exchange_token',
        client_secret:     appSecret,
        access_token:      shortToken.access_token,
      })
    )

    if (!longTokenRes.ok) {
      const err = await longTokenRes.text()
      console.error('[Threads OAuth] Long token exchange failed:', err)
      // Fall back to short-lived token if long-lived fails
      // Short-lived is only 1hr but better than nothing
    }

    const longToken: { access_token: string; token_type: string; expires_in: number } =
      longTokenRes.ok ? await longTokenRes.json() : { access_token: shortToken.access_token, token_type: 'bearer', expires_in: 3600 }

    // Calculate expiry date (expires_in is in seconds)
    const expiresAt = new Date(Date.now() + longToken.expires_in * 1000).toISOString()

    // ── Step 2c: Save to Supabase ──
    const supabase = createServerClient()

    // Upsert — if a token already exists, update it
    const { error: dbError } = await supabase
      .from('threads_auth')
      .upsert(
        {
          user_id:      shortToken.user_id,
          access_token: longToken.access_token,
          token_type:   longToken.token_type ?? 'bearer',
          expires_at:   expiresAt,
          updated_at:   new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (dbError) {
      console.error('[Threads OAuth] Supabase save failed:', dbError)
      return NextResponse.redirect(
        `${appUrl}/settings?threads_error=${encodeURIComponent('Database save failed')}`
      )
    }

    console.log('[Threads OAuth] ✓ Token saved. Expires:', expiresAt)

    // ── Done! Redirect to Growth page with success ──
    return NextResponse.redirect(`${appUrl}/growth?threads_connected=true`)

  } catch (err) {
    console.error('[Threads OAuth] Unexpected error:', err)
    return NextResponse.redirect(
      `${appUrl}/settings?threads_error=${encodeURIComponent('Something went wrong')}`
    )
  }
}
