import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { todayStr } from '@/lib/utils'

export async function GET() {
  const supabase = createServerClient()
  const today = todayStr()

  // Get last 30 days of habits
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .gte('completed_date', new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0])
    .order('completed_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { habit_id, completed_date } = await req.json()

  const date = completed_date || todayStr()

  // Toggle: check if exists first
  const { data: existing } = await supabase
    .from('habits')
    .select('id')
    .eq('habit_id', habit_id)
    .eq('completed_date', date)
    .single()

  if (existing) {
    // Un-complete
    await supabase.from('habits').delete().eq('id', existing.id)
    return NextResponse.json({ action: 'removed' })
  } else {
    // Complete
    const { data, error } = await supabase
      .from('habits')
      .insert({ habit_id, completed_date: date })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ action: 'added', data })
  }
}
