import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { mood } = await req.json()

  if (!mood) return NextResponse.json({ error: 'mood required' }, { status: 400 })

  const { data, error } = await supabase
    .from('mood_log')
    .insert({ mood })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
