'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { timeAgo } from '@/lib/utils'
import type { BrainDump, LaterIdea } from '@/types'

const CAPTURE_TYPES = ['💡 Idea', '📝 Task', '📱 Content', '💰 Money', '😤 Worry']

const SABOTAGE_PATTERNS = [
  { key: 'perf',  label: '🎯 Perfectionism — "it\'s not good enough yet"' },
  { key: 'over',  label: '😤 Overwhelm — "there\'s too much, I can\'t start"' },
  { key: 'ick',   label: '😬 Selling ick — "I feel gross promoting this"' },
  { key: 'shiny', label: '✨ Shiny object — "what if I built this other thing instead"' },
]

export function BrainClient({ initialDumps, initialLaterIdeas }: {
  initialDumps: BrainDump[]
  initialLaterIdeas: LaterIdea[]
}) {
  const [dumps, setDumps]           = useState<BrainDump[]>(initialDumps)
  const [ideas, setIdeas]           = useState<LaterIdea[]>(initialLaterIdeas)
  const [captureType, setCaptureType] = useState('💡 Idea')
  const [dumpText, setDumpText]     = useState('')
  const [laterText, setLaterText]   = useState('')
  const [sabotage, setSabotage]     = useState<string | null>(null)
  const [sabMsg, setSabMsg]         = useState('')
  const [loadingSab, setLoadingSab] = useState(false)

  async function saveDump() {
    if (!dumpText.trim()) return
    const { data } = await supabase
      .from('brain_dumps')
      .insert({ type: captureType, text: dumpText.trim() })
      .select()
      .single()
    if (data) setDumps(prev => [data, ...prev])
    setDumpText('')
  }

  async function addLaterIdea() {
    if (!laterText.trim()) return
    const { data } = await supabase
      .from('later_ideas')
      .insert({ idea: laterText.trim(), excitement: 3 })
      .select()
      .single()
    if (data) setIdeas(prev => [data, ...prev])
    setLaterText('')
  }

  async function setExcitement(id: string, val: number) {
    await supabase.from('later_ideas').update({ excitement: val }).eq('id', id)
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, excitement: val } : i))
  }

  async function pickSabotage(pattern: typeof SABOTAGE_PATTERNS[0]) {
    setSabotage(pattern.key)
    setSabMsg('')
    setLoadingSab(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sabotage',
          prompt: `My loudest sabotage pattern right now is: ${pattern.label}. Give me a direct, honest response with one action I can take in the next 10 minutes.`,
        }),
      })
      const { content } = await res.json()
      setSabMsg(content)
    } catch {
      setSabMsg('Could not get AI response. But you already know what to do — close the tab and do the one thing.')
    }
    setLoadingSab(false)
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          The Chaos <em style={{ color: 'var(--terracotta)' }}>Organiser</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          For your specific brain. No shame. Just systems that actually work.
        </p>
      </div>

      {/* Brain dump */}
      <Card label="Brain dump — capture it before your brain deletes it" className="mb-5">
        <div className="flex gap-2 flex-wrap mb-3">
          {CAPTURE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setCaptureType(t)}
              className="px-3 py-2 rounded-full text-xs border transition-all duration-200"
              style={{
                border: captureType === t ? '1px solid var(--terracotta)' : '1px solid var(--border)',
                background: captureType === t ? 'var(--terracotta)' : 'transparent',
                color: captureType === t ? 'white' : 'var(--slate)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          className="lbb-input resize-none"
          rows={3}
          placeholder="Just type. Don't organise. Just get it out..."
          value={dumpText}
          onChange={e => setDumpText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) saveDump() }}
        />
        <button className="btn-primary mt-2.5" onClick={saveDump}>Save it ✓</button>

        {dumps.length > 0 && (
          <div className="mt-4 flex flex-col gap-1.5">
            {dumps.slice(0, 10).map(d => (
              <div key={d.id} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <span
                  className="rounded-full text-[9px] tracking-wide uppercase px-2 py-0.5 whitespace-nowrap mt-0.5"
                  style={{ background: 'rgba(155,133,156,0.15)', color: 'var(--mauve)' }}
                >
                  {d.type}
                </span>
                <p style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }}>{d.text}</p>
                <span style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.6, whiteSpace: 'nowrap' }}>{timeAgo(d.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Later list */}
      <Card label="Later list — shiny ideas that must wait" className="mb-5">
        <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.8, marginBottom: 14, fontStyle: 'italic' }}>
          "The new idea will still be there when this one is done."
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="The exciting new idea..."
            className="lbb-input flex-1"
            value={laterText}
            onChange={e => setLaterText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLaterIdea()}
          />
          <button className="btn-ghost" onClick={addLaterIdea}>Lock it →</button>
        </div>
        {ideas.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.6, fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            Your ideas are safe here. Come back after May 15. 🤍
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {ideas.map(idea => (
              <div key={idea.id} className="p-3.5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 14, marginBottom: 8 }}>{idea.idea}</p>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7 }}>{timeAgo(idea.created_at)}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <div
                        key={n}
                        onClick={() => setExcitement(idea.id, n)}
                        className="w-2 h-2 rounded-full cursor-pointer transition-all duration-200"
                        style={{ background: n <= idea.excitement ? 'var(--honey)' : 'var(--border)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Sabotage check with AI */}
      <Card label="Sabotage pattern check-in + AI response">
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Which one is loudest right now?</p>
        <div className="flex flex-col gap-2 mb-3">
          {SABOTAGE_PATTERNS.map(p => (
            <button
              key={p.key}
              onClick={() => pickSabotage(p)}
              className="w-full px-4 py-3 rounded-xl text-left text-[13px] border transition-all duration-200"
              style={{
                border: sabotage === p.key ? '1px solid var(--terracotta)' : '1px solid var(--border)',
                background: sabotage === p.key ? 'rgba(194,139,106,0.1)' : 'transparent',
                color: 'var(--slate)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {loadingSab && (
          <p className="animate-pulse-soft" style={{ fontSize: 13, color: 'var(--mauve)', fontStyle: 'italic' }}>
            AI is thinking...
          </p>
        )}
        {sabMsg && !loadingSab && (
          <div className="ai-bubble mt-2">{sabMsg}</div>
        )}
      </Card>
    </div>
  )
}
