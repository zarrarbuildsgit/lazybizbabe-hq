import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { todayStr } from '@/lib/utils'

export async function GET() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('one_thing')
    .select('*')
    .eq('date', todayStr())
    .single()

  return NextResponse.json(data ?? { text: '' })
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { text } = await req.json()
  const date = todayStr()

  const { data, error } = await supabase
    .from('one_thing')
    .upsert({ text: text ?? '', date }, { onConflict: 'date' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
