'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card } from '@/components/ui/Card'
import { format } from 'date-fns'
import type { ThreadsInsights } from '@/types'
import { supabase } from '@/lib/supabase'

interface Props {
  followerHistory: { count: number; created_at: string }[]
}

export function GrowthClient({ followerHistory }: Props) {
  const [threads, setThreads]       = useState<ThreadsInsights | null>(null)
  const [loadingThreads, setLoading] = useState(true)
  const [newCount, setNewCount]     = useState('')
  const [waitlist, setWaitlist]     = useState(0)
  const [history, setHistory]       = useState(followerHistory)

  useEffect(() => {
    fetch('/api/threads')
      .then(r => r.json())
      .then(data => { setThreads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function logFollowers() {
    const count = parseInt(newCount)
    if (!count) return
    await supabase.from('followers_log').insert({ count })
    setHistory(prev => [...prev, { count, created_at: new Date().toISOString() }])
    setNewCount('')
  }

  const currentFollowers = threads?.followers_count ?? history[history.length - 1]?.count ?? 429
  const chartData = history.map(h => ({
    date: format(new Date(h.created_at), 'MMM d'),
    count: h.count,
  }))

  // Sort posts by engagement
  const topPosts = [...(threads?.posts ?? [])].sort((a, b) =>
    ((b.like_count ?? 0) + (b.replies_count ?? 0)) - ((a.like_count ?? 0) + (a.replies_count ?? 0))
  ).slice(0, 5)

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          Growth <em style={{ color: 'var(--terracotta)' }}>Tracker</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Slow and steady keeps the chain. You're building something real.
        </p>
      </div>

      {/* Follower stat + waitlist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card label="Threads followers">
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 72, fontWeight: 300, color: 'var(--terracotta)', lineHeight: 1, marginBottom: 4 }}>
            {loadingThreads ? '...' : currentFollowers.toLocaleString()}
          </div>
          {threads?.mock && (
            <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.6, fontStyle: 'italic', marginBottom: 8 }}>
              ⚠ Mock data — add Threads API credentials to see live data
            </p>
          )}
          <div style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.7, marginBottom: 12 }}>
            {currentFollowers.toLocaleString()} / 2,000 goal
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(100, (currentFollowers / 2000) * 100)}%` }} />
          </div>
        </Card>

        <Card label="Waitlist signups">
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, fontWeight: 300, color: 'var(--terracotta)', lineHeight: 1, marginBottom: 8 }}>
            {waitlist}
          </div>
          <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.7 }}>Goal: 25 before May 15</p>
          <div className="progress-track" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, (waitlist / 25) * 100)}%` }} />
          </div>
          <input
            type="number"
            placeholder="Update waitlist count"
            className="lbb-input mt-3"
            onChange={e => setWaitlist(parseInt(e.target.value) || 0)}
          />
        </Card>
      </div>

      {/* Chart */}
      <Card label="Follower growth" className="mb-5">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--mauve)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--mauve)' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="count" stroke="var(--terracotta)" strokeWidth={2} dot={{ fill: 'var(--terracotta)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.7, fontStyle: 'italic' }}>Log a few days of followers to see your growth chart.</p>
        )}

        {/* Log new count */}
        <div className="flex gap-2 mt-4">
          <input
            type="number"
            placeholder="Today's follower count (e.g. 435)"
            className="lbb-input flex-1"
            value={newCount}
            onChange={e => setNewCount(e.target.value)}
          />
          <button className="btn-primary" onClick={logFollowers}>Log it</button>
        </div>
      </Card>

      {/* Top posts */}
      <Card label="Top performing posts">
        {loadingThreads ? (
          <div className="animate-pulse-soft" style={{ fontSize: 13, color: 'var(--mauve)' }}>Fetching from Threads...</div>
        ) : topPosts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {topPosts.map(post => (
              <div
                key={post.id}
                className="p-3 rounded-xl transition-all duration-200 cursor-pointer"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6, color: 'var(--slate)' }}>
                  {post.text?.substring(0, 200)}{(post.text?.length ?? 0) > 200 ? '...' : ''}
                </p>
                <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.7 }}>
                  ❤️ {post.like_count ?? 0} · 💬 {post.replies_count ?? 0} · 🔁 {post.repost_count ?? 0}
                  {post.views ? ` · 👁 ${post.views.toLocaleString()}` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.7, fontStyle: 'italic' }}>No post data yet.</p>
        )}
      </Card>
    </div>
  )
}
