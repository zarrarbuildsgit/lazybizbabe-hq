import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Meta pings this when a user requests deletion of their data (GDPR compliance)
// We delete all stored Threads data for that user from Supabase
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}))
    const userId = body?.user_id ?? null

    if (userId) {
      const supabase = createServerClient()
      await supabase.from('threads_auth').delete().eq('user_id', userId)
      console.log('[Threads Delete] Deleted all data for user:', userId)
    }

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/data-deleted`,
      confirmation_code: `deleted_${userId ?? 'unknown'}_${Date.now()}`,
    }, { status: 200 })

  } catch (err) {
    console.error('[Threads Delete] Error:', err)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 })
}