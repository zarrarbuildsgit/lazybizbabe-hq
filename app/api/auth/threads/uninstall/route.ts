import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Meta pings this when Ope deauthorizes the app from Threads settings
// We delete the stored token from Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const userId = body?.user_id ?? null

    if (userId) {
      const supabase = createServerClient()
      await supabase.from('threads_auth').delete().eq('user_id', userId)
      console.log('[Threads Uninstall] Removed token for user:', userId)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Threads Uninstall] Error:', err)
    // Always return 200 — Meta expects it
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

// Also handle GET in case Meta sends a verification ping
export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 })
}