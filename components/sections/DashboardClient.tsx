'use client'

import { useState, useEffect } from 'react'
import { Card, StatCard } from '@/components/ui/Card'
import { formatCurrency, daysUntil, getGreeting, randomQuote, randomPrompt } from '@/lib/utils'

interface Props {
  totalRevenue: number
  salesCount: number
  currentFollowers: number
  initialOneThing: string
}

const MOODS = [
  { emoji: '😤', label: 'Struggling', msg: "That's okay. Survival mode is still mode. One tiny task. Just one." },
  { emoji: '😐', label: 'Neutral',    msg: "Neutral is underrated. You're here. That's enough." },
  { emoji: '🙂', label: 'Okay',       msg: "Okay is the launchpad for good. Keep going." },
  { emoji: '😊', label: 'Good',       msg: "Good energy — use it. Do the thing you've been putting off." },
  { emoji: '🔥', label: 'Power',      msg: "POWER MODE. This is the time. Go." },
]

export function DashboardClient({ totalRevenue, salesCount, currentFollowers, initialOneThing }: Props) {
  const [oneThing, setOneThing]         = useState(initialOneThing)
  const [mood, setMood]                 = useState<string | null>(null)
  const [moodMsg, setMoodMsg]           = useState('')
  const [countdown, setCountdown]       = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [streakCount, setStreak]        = useState(0)
  const [currentPrompt, setPrompt]      = useState('')
  const [quote, setQuote]               = useState('')
  const [savingThing, setSavingThing]   = useState(false)
  const [dailyInsight, setInsight]      = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(false)

  const LAUNCH_DATE = '2026-05-15'
  const launchDays  = daysUntil(LAUNCH_DATE)

  // Set random values client-side only — avoids hydration mismatch
  useEffect(() => {
    setQuote(randomQuote())
    setPrompt(randomPrompt())
  }, [])

  // Load streak from localStorage
  useEffect(() => {
    const s = localStorage.getItem('lbb-streak')
    if (s) setStreak(parseInt(s))
  }, [])

  // Live countdown
  useEffect(() => {
    const target = new Date('2026-05-15T00:00:00').getTime()
    function tick() {
      const diff = target - Date.now()
      if (diff <= 0) return
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  async function getInsight() {
    setLoadingInsight(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'insight',
          prompt: 'Give me one sharp insight and one action for today.',
          context: `Revenue: $${totalRevenue.toFixed(2)}, Sales: ${salesCount}, Followers: ${currentFollowers}, Streak: ${streakCount} days, Mood: ${mood ?? 'not set yet'}`,
        }),
      })
      const data = await res.json()
      setInsight(data.content ?? 'Could not generate insight right now.')
    } catch {
      setInsight('Could not reach AI right now. Check your OpenRouter key in Vercel.')
    }
    setLoadingInsight(false)
  }

  async function saveOneThing(val: string) {
    setOneThing(val)
    setSavingThing(true)
    await fetch('/api/one-thing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: val }),
    })
    setSavingThing(false)
  }

  async function logMood(m: typeof MOODS[0]) {
    setMood(m.emoji)
    setMoodMsg(m.msg)
    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: m.emoji }),
    })
  }

  function addStreak() {
    const next = streakCount + 1
    setStreak(next)
    localStorage.setItem('lbb-streak', String(next))
    if (next % 7 === 0) celebrate()
  }

  function newPrompt() {
    setPrompt(randomPrompt())
  }

  return (
    <div className="animate-fade-up">
      {/* Greeting */}
      <div className="mb-8">
        <h1
          className="font-serif-italic font-light leading-tight mb-1"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--slate)' }}
        >
          Scattered doesn't <em style={{ color: 'var(--terracotta)' }}>mean stuck,</em><br />Ope. ✦
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8 }}>
          {getGreeting()} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })} · Launch in {launchDays} days
        </p>
      </div>

      {/* Row 1: One Thing + Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--terracotta) 0%, #B87A5A 100%)', color: 'white' }}
        >
          <div style={{ position: 'absolute', right: 20, top: 16, fontSize: 48, opacity: 0.15 }}>✦</div>
          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8, marginBottom: 8 }}>
            Today's one non-negotiable
          </div>
          <input
            className="w-full bg-transparent border-none outline-none"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontStyle: 'italic', color: 'white', lineHeight: 1.4 }}
            placeholder="What's the ONE thing today?"
            value={oneThing}
            onChange={e => saveOneThing(e.target.value)}
          />
        </div>

        <Card label={`Launch countdown — May 15`}>
          <div className="flex gap-3">
            {[['d', countdown.d], ['h', countdown.h], ['m', countdown.m], ['s', countdown.s]].map(([lbl, val]) => (
              <div
                key={lbl as string}
                className="flex-1 text-center rounded-xl py-3"
                style={{ background: 'rgba(194,139,106,0.1)', border: '1px solid rgba(194,139,106,0.2)' }}
              >
                <div className="font-serif-italic" style={{ fontSize: 28, color: 'var(--terracotta)', fontWeight: 300 }}>{val}</div>
                <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.7 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.7, marginTop: 10 }}>Soft Chaos goes live. You're ready. 🤍</p>
        </Card>
      </div>

      {/* Row 2: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <StatCard label="Threads followers" value={currentFollowers} sub="Current count" progress={currentFollowers} progressMax={2000} />
        <StatCard label="Total sales" value={salesCount} sub="Products sold" delta={salesCount > 0 ? `Last sale recorded ✦` : 'First sale incoming ✦'} />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} sub="All time" progress={totalRevenue} progressMax={10000} />
      </div>

      {/* Row 3: Mood + Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card label="How are you feeling right now?">
          <div className="flex gap-2 mt-2">
            {MOODS.map(m => (
              <button
                key={m.emoji}
                onClick={() => logMood(m)}
                title={m.label}
                className="flex-1 py-2.5 rounded-xl border text-xl transition-all duration-200"
                style={{
                  border: mood === m.emoji ? '1px solid var(--terracotta)' : '1px solid var(--border)',
                  background: mood === m.emoji ? 'rgba(194,139,106,0.15)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          {moodMsg && (
            <p style={{ fontSize: 12, color: 'var(--mauve)', marginTop: 10, opacity: 0.8, fontStyle: 'italic' }}>
              {moodMsg}
            </p>
          )}
        </Card>

        <div
          className="rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(155,133,156,0.1) 0%, rgba(196,176,200,0.12) 100%)', border: '1px solid rgba(196,176,200,0.3)' }}
        >
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 60, color: 'var(--lavender)', opacity: 0.4, lineHeight: 0.5, display: 'block', marginBottom: 12 }}>"</span>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--slate)' }}>
            {quote || '...'}
          </p>
          <p style={{ fontSize: 11, color: 'var(--mauve)', marginTop: 12, opacity: 0.7 }}>— from your own Soft Chaos guide</p>
        </div>
      </div>

      {/* Row 4: Post Prompt + AI Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card label="Today's post prompt">
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12 }}>
            {currentPrompt || '...'}
          </p>
          <button className="btn-ghost" onClick={newPrompt}>Shuffle prompt →</button>
        </Card>

        <Card label="AI daily insight">
          {dailyInsight ? (
            <div className="ai-bubble">{dailyInsight}</div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginBottom: 14 }}>
                Get one sharp observation about your business right now.
              </p>
              <button className="btn-primary" onClick={getInsight} disabled={loadingInsight}>
                {loadingInsight ? 'Thinking...' : '✦ Get today\'s insight'}
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Streak */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="card-label">Posting streak</div>
            <div className="stat-num">{streakCount}</div>
            <div style={{ fontSize: 12, color: 'var(--mauve)', marginTop: 4, opacity: 0.8 }}>days consistent</div>
          </div>
          <div style={{ fontSize: 48 }}>{streakCount === 0 ? '🌱' : streakCount < 7 ? '🌿' : streakCount < 30 ? '🔥' : '⚡'}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={addStreak}>✓ Posted today</button>
          <button className="btn-ghost">❄️ Freeze day</button>
        </div>
      </Card>
    </div>
  )
}

function celebrate() {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
  document.body.appendChild(overlay)
  const emojis = ['🎉', '✨', '💫', '🌟', '🎊', '💰', '🔥', '🤍']
  for (let i = 0; i < 25; i++) {
    const e = document.createElement('div')
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    e.style.cssText = `position:absolute;font-size:${20 + Math.random() * 20}px;left:${Math.random() * 100}%;top:-40px;animation:fall ${1 + Math.random() * 2}s ease-in forwards;pointer-events:none;`
    overlay.appendChild(e)
  }
  setTimeout(() => overlay.remove(), 3000)
}