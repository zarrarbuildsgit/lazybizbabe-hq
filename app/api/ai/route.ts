import { NextRequest, NextResponse } from 'next/server'
import { callOpenRouter, CONTENT_SYSTEM, SABOTAGE_SYSTEM, INSIGHTS_SYSTEM, OPE_CONTEXT } from '@/lib/openrouter'

export async function POST(req: NextRequest) {
  try {
    const { type, prompt, context } = await req.json()

    if (!type || !prompt) {
      return NextResponse.json({ error: 'Missing type or prompt' }, { status: 400 })
    }

    let systemPrompt: string
    let maxTokens = 600

    switch (type) {
      case 'content':
        systemPrompt = CONTENT_SYSTEM
        maxTokens = 400
        break
      case 'sabotage':
        systemPrompt = SABOTAGE_SYSTEM
        maxTokens = 300
        break
      case 'insight':
        systemPrompt = INSIGHTS_SYSTEM
        maxTokens = 300
        break
      case 'post-improve':
        systemPrompt = `${CONTENT_SYSTEM}\nImprove this Threads post. Keep the voice authentic and casual. Make the hook stronger. Return only the improved post, no commentary.`
        maxTokens = 500
        break
      case 'post-ideas':
        systemPrompt = `${CONTENT_SYSTEM}\nGenerate 5 Threads post ideas based on the context provided. Return as a JSON array of objects with "text" and "type" fields (story/value/hottake/sell/milestone). Only return valid JSON, no other text.`
        maxTokens = 600
        break
      default:
        systemPrompt = OPE_CONTEXT
    }

    const messages = context
      ? [{ role: 'system' as const, content: `${systemPrompt}\n\nContext: ${context}` }, { role: 'user' as const, content: prompt }]
      : [{ role: 'system' as const, content: systemPrompt }, { role: 'user' as const, content: prompt }]

    const content = await callOpenRouter(messages, 'llama', maxTokens)
    return NextResponse.json({ content })

  } catch (err) {
    console.error('[AI route error]', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
