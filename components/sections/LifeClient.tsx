'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { daysUntil, formatDate } from '@/lib/utils'
import type { Milestone } from '@/types'

const HABITS = [
  { id: 'shower',  emoji: '🚿', name: 'Shower' },
  { id: 'post',    emoji: '📱', name: 'Post on Threads' },
  { id: 'reply',   emoji: '💬', name: 'Reply to 10' },
  { id: 'water',   emoji: '💧', name: 'Drink water' },
  { id: 'outside', emoji: '🌤️', name: 'Go outside' },
  { id: 'pray',    emoji: '🙏', name: 'Pray / Devotion' },
  { id: 'read',    emoji: '📖', name: 'Read anything' },
  { id: 'create',  emoji: '✨', name: 'Create something' },
]

export function LifeClient({ completedToday, initialMilestones, recentJournals }: {
  completedToday: string[]
  initialMilestones: Milestone[]
  recentJournals: { entry: string; created_at: string }[]
}) {
  const [done, setDone]             = useState<Set<string>>(new Set(completedToday))
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [journal, setJournal]       = useState('')
  const [journalSaved, setJournalSaved] = useState(false)

  async function toggleHabit(id: string) {
    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habit_id: id }),
    })
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function saveJournal() {
    if (!journal.trim()) return
    await supabase.from('journals').insert({ entry: journal.trim() })
    setJournalSaved(true)
    setTimeout(() => setJournalSaved(false), 2000)
  }

  async function addMilestone() {
    const text = window.prompt('What milestone did you hit?')
    if (!text) return
    const icon = window.prompt('Icon (emoji)?') || '✦'
    const { data } = await supabase
      .from('milestones')
      .insert({ text: text.trim(), icon })
      .select()
      .single()
    if (data) setMilestones(prev => [data, ...prev])
    celebrate()
  }

  const doneCount = done.size
  const totalHabits = HABITS.length

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          The Becoming <em style={{ color: 'var(--terracotta)' }}>Hub</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Because you're building a life, not just a business. Track who you're becoming.
        </p>
      </div>

      {/* Habits */}
      <Card label={`Daily habits — ${doneCount}/${totalHabits} done today`} className="mb-5">
        <div className="progress-track mb-4">
          <div className="progress-fill" style={{ width: `${(doneCount / totalHabits) * 100}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HABITS.map(h => {
            const isDone = done.has(h.id)
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className="rounded-xl p-4 text-center cursor-pointer transition-all duration-200 select-none"
                style={{
                  background: isDone ? 'rgba(194,139,106,0.12)' : 'var(--card)',
                  border: isDone ? '1px solid rgba(194,139,106,0.4)' : '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{h.emoji}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', opacity: 0.8 }}>{h.name}</div>
                {isDone && <div style={{ fontSize: 10, color: 'var(--terracotta)', marginTop: 4 }}>✓ done</div>}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Journal */}
      <Card label="Today's journal" className="mb-5">
        <p className="font-serif-italic mb-3" style={{ fontSize: 15, color: 'var(--mauve)', opacity: 0.9 }}>
          What's one thing that felt good today?
        </p>
        <textarea
          className="w-full rounded-xl p-4 outline-none resize-none transition-all duration-200"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 16, fontStyle: 'italic',
            color: 'var(--slate)', lineHeight: 1.8,
            background: 'transparent',
            border: '1px solid var(--border)',
            minHeight: 140,
          }}
          placeholder="Even if it's just 'I woke up.' That counts. Write it."
          value={journal}
          onChange={e => setJournal(e.target.value)}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--lavender)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        <button className="btn-ghost mt-2.5" onClick={saveJournal} disabled={journalSaved}>
          {journalSaved ? 'Saved 🤍' : 'Save entry 🤍'}
        </button>

        {recentJournals.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="card-label">Recent entries</div>
            {recentJournals.map((j, i) => (
              <div key={i} className="mb-2">
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontStyle: 'italic', opacity: 0.7, lineHeight: 1.6 }}>
                  {j.entry.substring(0, 100)}{j.entry.length > 100 ? '...' : ''}
                </p>
                <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.5, marginTop: 2 }}>{formatDate(j.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Milestones */}
      <Card label="Personal milestones — the ones that matter" className="mb-5">
        {milestones.map(m => (
          <div key={m.id} className="flex items-center gap-3.5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(194,139,106,0.15)', fontSize: 16 }}
            >
              {m.icon}
            </div>
            <div>
              <p style={{ fontSize: 13, lineHeight: 1.4, flex: 1 }}>{m.text}</p>
              <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7, marginTop: 2 }}>{formatDate(m.created_at)}</p>
            </div>
          </div>
        ))}
        <button className="btn-ghost mt-3.5" onClick={addMilestone}>+ Add milestone</button>
      </Card>

      {/* Countdowns */}
      <Card label="Countdowns">
        <div className="flex flex-col gap-0">
          {[
            { icon: '🎂', label: '18th Birthday', date: '2026-08-25' },
            { icon: '🚀', label: 'Soft Chaos Launch', date: '2026-05-15' },
          ].map(c => (
            <div key={c.date} className="flex items-center gap-3.5 py-3.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(194,139,106,0.15)', fontSize: 16 }}>
                {c.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, lineHeight: 1.4 }}>{c.label}</p>
                <p style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 2, fontWeight: 500 }}>
                  {daysUntil(c.date)} days away
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function celebrate() {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
  document.body.appendChild(overlay)
  const emojis = ['🎉', '✨', '💫', '🌟', '🎊', '🤍', '🔥']
  for (let i = 0; i < 25; i++) {
    const e = document.createElement('div')
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    e.style.cssText = `position:absolute;font-size:${20+Math.random()*20}px;left:${Math.random()*100}%;top:-40px;animation:fall ${1+Math.random()*2}s ease-in forwards;pointer-events:none;`
    overlay.appendChild(e)
  }
  setTimeout(() => overlay.remove(), 3000)
}
