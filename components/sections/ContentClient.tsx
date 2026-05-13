'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'

const TEMPLATES = [
  { text: 'the thing about having adhd and ambition is [relatable truth]. it\'s exhausting. and nobody talks about the [specific part].', type: '🔥 Hot take · High engagement template' },
  { text: 'I used to think [wrong belief]. So I\'d [self-defeating behaviour]. Turns out [the real reason]. Now I [solution/product].', type: '📖 Story → sell · Your strongest format' },
  { text: '[number] things I wish someone told me when I was starting from $0:\n\n1. [insight]\n2. [insight]\n3. [insight]', type: '💡 Value list · Saves + reposts magnet' },
  { text: 'another person just joined the waitlist. that\'s [number] people waiting. wild. if you\'ve been thinking about it → link in bio 🤍', type: '🛒 Waitlist update · Post every 2-3 signups' },
]

const IDEA_BANK = [
  { text: 'The origin story post — made first sale in 5 days, disappeared for 6 months, here\'s what actually happened', priority: '⚡ HIGH PRIORITY · Pin this when posted' },
  { text: 'Copycat credibility post — someone copied my HTML format and credited me as the original', priority: '📖 Authority builder' },
  { text: 'Dark mode + font size update — "because some of our brains literally cannot read on a bright screen at 2am"', priority: '🎉 Product feature · Post today' },
]

const POST_TAGS = [
  { key: 'story',     label: '📖 Story' },
  { key: 'value',     label: '💡 Value' },
  { key: 'hottake',   label: '🔥 Hot take' },
  { key: 'sell',      label: '🛒 Soft sell' },
  { key: 'milestone', label: '🎉 Milestone' },
]

export function ContentClient() {
  const [postText, setPostText]         = useState('')
  const [tag, setTag]                   = useState('')
  const [aiIdeas, setAiIdeas]           = useState<{ text: string; type: string }[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [improving, setImproving]       = useState(false)
  const [ideas, setIdeas]               = useState(IDEA_BANK)

  const charCount = postText.length
  const hookScore = charCount === 0       ? 'Write something...'
    : charCount < 50   ? 'Keep going...'
    : charCount < 150  ? 'Looking good ✦'
    : charCount < 300  ? 'Strong hook territory 🔥'
    : charCount < 500  ? 'Solid post length ✓'
    : '⚠ Getting long for Threads'

  async function generateIdeas() {
    setLoadingIdeas(true)
    setAiIdeas([])
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post-ideas',
          prompt: 'Generate 5 Threads post ideas for Ope.',
          context: 'Nigerian creator, ADHD, digital products (Soft Chaos guide $37), 429 followers, authentic voice, no hashtags',
        }),
      })
      const data = await res.json()
      if (!data.content) throw new Error('No content')
      const cleaned = data.content.replace(/```json\n?|\n?```/g, '').trim()
      const parsed  = JSON.parse(cleaned)
      setAiIdeas(Array.isArray(parsed) ? parsed : [])
    } catch {
      setAiIdeas([{ text: 'Could not generate ideas right now. Check your OpenRouter API key in Vercel env vars.', type: '⚠ Error' }])
    }
    setLoadingIdeas(false)
  }

  async function improvePost() {
    if (!postText.trim()) return
    setImproving(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post-improve', prompt: postText }),
      })
      const data = await res.json()
      if (data.content) setPostText(data.content)
    } catch {}
    setImproving(false)
  }

  async function saveDraft() {
    if (!postText.trim()) return
    await supabase.from('post_drafts').insert({ content: postText, tag })
    alert('Draft saved 🤍')
  }

  async function copyPost() {
    if (!postText.trim()) return
    try {
      await navigator.clipboard.writeText(postText)
      alert('Copied! Paste into Threads.')
    } catch {}
  }

  function addIdea() {
    const text = window.prompt('What\'s the idea?')
    if (!text) return
    setIdeas(prev => [{ text, priority: 'Added today' }, ...prev])
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          Content <em style={{ color: 'var(--terracotta)' }}>Kitchen</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Plan, write, and track every post. Your ideas have a home now.
        </p>
      </div>

      {/* Composer */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="card-label">Write a post</div>
        <textarea
          className="w-full bg-transparent border-none outline-none resize-none"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--slate)', lineHeight: 1.7, minHeight: 120 }}
          placeholder="Start with your hook. What's the first thing they'll read?..."
          value={postText}
          onChange={e => setPostText(e.target.value)}
          maxLength={500}
        />
        <div className="flex gap-1.5 flex-wrap mt-2">
          {POST_TAGS.map(t => (
            <button
              key={t.key}
              onClick={() => setTag(tag === t.key ? '' : t.key)}
              className="px-2.5 py-1 rounded-full text-[10px] border transition-all duration-200"
              style={{
                border: tag === t.key ? '1px solid var(--mauve)' : '1px solid var(--border)',
                background: tag === t.key ? 'var(--mauve)' : 'transparent',
                color: tag === t.key ? 'white' : 'var(--slate)',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t flex-wrap gap-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.7 }}>{charCount} / 500</span>
            <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: 'rgba(212,169,106,0.15)', color: 'var(--honey)' }}>
              {hookScore}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs px-3 py-2" onClick={improvePost} disabled={improving || !postText.trim()}>
              {improving ? '✦ Improving...' : '✨ AI improve'}
            </button>
            <button className="btn-ghost text-xs px-3 py-2" onClick={saveDraft}>Save draft</button>
            <button className="btn-primary text-xs px-3 py-2" onClick={copyPost}>Copy to Threads</button>
          </div>
        </div>
      </div>

      {/* AI Ideas */}
      <Card label="AI-generated post ideas" className="mb-5">
        <button className="btn-primary mb-4" onClick={generateIdeas} disabled={loadingIdeas}>
          {loadingIdeas ? '✦ Generating...' : '✦ Generate 5 ideas for me'}
        </button>
        {(aiIdeas ?? []).length > 0 && (
          <div className="flex flex-col gap-2">
            {(aiIdeas ?? []).map((idea, i) => (
              <div
                key={i}
                className="p-3 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onClick={() => setPostText(idea.text)}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{idea.text}</p>
                <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7 }}>{idea.type} · Click to use</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Templates */}
      <Card label="Post templates from Soft Chaos" className="mb-5">
        <div className="flex flex-col gap-2">
          {TEMPLATES.map((t, i) => (
            <div
              key={i}
              className="p-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onClick={() => setPostText(t.text)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{t.text}</p>
              <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7 }}>{t.type}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Idea bank */}
      <Card label="Idea bank — posts waiting to be written">
        <div className="flex flex-col gap-2 mb-3">
          {ideas.map((idea, i) => (
            <div
              key={i}
              className="p-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onClick={() => setPostText(idea.text)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{idea.text}</p>
              <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7 }}>{idea.priority}</p>
            </div>
          ))}
        </div>
        <button className="btn-ghost" onClick={addIdea}>+ Add idea</button>
      </Card>
    </div>
  )
}