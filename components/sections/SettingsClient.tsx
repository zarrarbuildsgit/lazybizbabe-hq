'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

interface Props {
  isConnected:  boolean
  userId:       string | null
  daysLeft:     number | null
  justConnected: boolean
  errorMessage: string | null
}

export function SettingsClient({ isConnected, userId, daysLeft, justConnected, errorMessage }: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null)

  const tokenHealthy  = daysLeft !== null && daysLeft > 15
  const tokenWarning  = daysLeft !== null && daysLeft <= 15 && daysLeft > 0
  const tokenExpired  = daysLeft !== null && daysLeft <= 0

  async function refreshToken() {
    setRefreshing(true)
    setRefreshMsg(null)
    try {
      const res  = await fetch('/api/auth/threads/refresh')
      const data = await res.json()
      setRefreshMsg(data.message ?? 'Done.')
    } catch {
      setRefreshMsg('Refresh failed. Try reconnecting Threads.')
    }
    setRefreshing(false)
  }

  return (
    <div className="animate-fade-up max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          Settings <em style={{ color: 'var(--terracotta)' }}>& Connections</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Connect your accounts. Everything lives here.
        </p>
      </div>

      {/* Success banner */}
      {justConnected && (
        <div
          className="rounded-xl p-4 mb-5 flex items-center gap-3"
          style={{ background: 'rgba(123,175,123,0.15)', border: '1px solid rgba(123,175,123,0.4)' }}
        >
          <span style={{ fontSize: 20 }}>🎉</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#5A9A5A' }}>Threads connected successfully!</p>
            <p style={{ fontSize: 12, opacity: 0.8, color: '#5A9A5A' }}>
              Your live follower count and post data is now showing in Growth.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: 'rgba(212,100,100,0.1)', border: '1px solid rgba(212,100,100,0.3)' }}
        >
          <p style={{ fontSize: 14, fontWeight: 500, color: '#C45A5A' }}>Connection failed</p>
          <p style={{ fontSize: 12, color: '#C45A5A', opacity: 0.8, marginTop: 4 }}>{errorMessage}</p>
          <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.7, marginTop: 8 }}>
            Make sure your Threads app is live (not in development mode) and the redirect URI matches exactly.
          </p>
        </div>
      )}

      {/* Threads Connection Card */}
      <Card className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(194,139,106,0.15)' }}
            >
              🧵
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--slate)' }}>Threads</p>
              <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.8, marginTop: 2 }}>
                Live follower count · Post engagement · Growth tracking
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="rounded-full px-3 py-1 flex-shrink-0"
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              background: isConnected && tokenHealthy
                ? 'rgba(123,175,123,0.15)'
                : tokenWarning
                ? 'rgba(212,169,106,0.15)'
                : 'rgba(155,133,156,0.15)',
              color: isConnected && tokenHealthy
                ? '#5A9A5A'
                : tokenWarning
                ? 'var(--honey)'
                : 'var(--mauve)',
            }}
          >
            {isConnected && tokenHealthy ? '✓ Connected'
              : tokenWarning              ? '⚠ Expiring soon'
              : tokenExpired              ? '✗ Expired'
              : '○ Not connected'}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          {isConnected ? (
            <div>
              {/* Token info */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl p-3" style={{ background: 'rgba(194,139,106,0.06)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.6, marginBottom: 4 }}>User ID</p>
                  <p style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--slate)' }}>{userId}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(194,139,106,0.06)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.6, marginBottom: 4 }}>Token expires</p>
                  <p style={{ fontSize: 13, color: daysLeft !== null && daysLeft <= 15 ? 'var(--honey)' : 'var(--slate)', fontWeight: daysLeft !== null && daysLeft <= 15 ? 500 : 400 }}>
                    {daysLeft !== null ? `${daysLeft} days` : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Warning if expiring */}
              {(tokenWarning || tokenExpired) && (
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(212,169,106,0.1)', border: '1px solid rgba(212,169,106,0.3)' }}
                >
                  <p style={{ fontSize: 13, color: 'var(--honey)' }}>
                    {tokenExpired
                      ? '⚠ Token has expired. Reconnect Threads to restore live data.'
                      : `⚠ Token expires in ${daysLeft} days. Refresh it now to stay connected.`}
                  </p>
                </div>
              )}

              {refreshMsg && (
                <p style={{ fontSize: 13, color: 'var(--mauve)', marginBottom: 12, fontStyle: 'italic' }}>{refreshMsg}</p>
              )}

              <div className="flex gap-2 flex-wrap">
                {(tokenWarning || tokenExpired) && (
                  <button className="btn-primary" onClick={refreshToken} disabled={refreshing}>
                    {refreshing ? '⟳ Refreshing...' : '⟳ Refresh token'}
                  </button>
                )}
                <a href="/api/auth/threads" className="btn-ghost inline-block text-center" style={{ textDecoration: 'none' }}>
                  {tokenExpired ? 'Reconnect Threads' : 'Reconnect'}
                </a>
                <a href="/growth" className="btn-ghost inline-block text-center" style={{ textDecoration: 'none' }}>
                  View Growth →
                </a>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, lineHeight: 1.7, marginBottom: 16 }}>
                Connect your Threads account to see your live follower count, post engagement,
                and top performing content — all inside the Growth tracker.
              </p>

              {/* What you need checklist */}
              <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(194,139,106,0.06)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.6, marginBottom: 10 }}>
                  Before connecting
                </p>
                {[
                  { done: !!process.env.THREADS_APP_ID, text: 'THREADS_APP_ID added to environment variables' },
                  { done: !!process.env.THREADS_APP_SECRET, text: 'THREADS_APP_SECRET added to environment variables' },
                  { done: true, text: 'Redirect URI set to: [your-url]/api/auth/threads/callback' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <span style={{ fontSize: 14, color: item.done ? '#5A9A5A' : 'var(--mauve)', opacity: item.done ? 1 : 0.5 }}>
                      {item.done ? '✓' : '○'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--slate)', opacity: item.done ? 1 : 0.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <a
                href="/api/auth/threads"
                className="btn-primary inline-block"
                style={{ textDecoration: 'none' }}
              >
                Connect Threads ✦
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Auto-refresh info */}
      <Card label="Token auto-refresh">
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, lineHeight: 1.7, marginBottom: 12 }}>
          Threads tokens last 60 days. To keep your connection alive automatically,
          add this cron job to your <code style={{ fontSize: 12, background: 'rgba(194,139,106,0.1)', padding: '2px 6px', borderRadius: 4 }}>vercel.json</code>:
        </p>
        <pre
          className="rounded-xl p-4 text-xs overflow-x-auto"
          style={{ background: 'var(--slate)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}
        >
{`"crons": [{
  "path": "/api/auth/threads/refresh",
  "schedule": "0 0 1 * *"
}]`}
        </pre>
        <p style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.6, marginTop: 8 }}>
          This runs on the 1st of every month — well within the 60-day window.
        </p>
      </Card>
    </div>
  )
}
