'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Sale } from '@/types'

const DREAM_GOALS = [
  { emoji: '📱', name: 'New Tablet',         ngn: 350000 },
  { emoji: '📷', name: 'Digicamera',         ngn: 150000 },
  { emoji: '💻', name: 'Laptop',             ngn: 500000 },
  { emoji: '🌍', name: 'Finland / China trip', ngn: null },
]

const USD_TO_NGN = 1600 // approximate

export function MoneyClient({ initialSales }: { initialSales: Sale[] }) {
  const [sales, setSales]       = useState<Sale[]>(initialSales)
  const [amount, setAmount]     = useState('')
  const [product, setProduct]   = useState('')
  const [logging, setLogging]   = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.amount), 0)
  const totalNGN     = totalRevenue * USD_TO_NGN

  async function logSale() {
    if (!amount || !product) return
    setLogging(true)
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), product }),
    })
    const newSale = await res.json()
    setSales(prev => [newSale, ...prev])
    setAmount('')
    setProduct('')
    setLogging(false)
    celebrate()
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          The Bag <em style={{ color: 'var(--terracotta)' }}>Vault</em> 💰
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Every naira counts. Every dollar is proof. Track it all here.
        </p>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-8 mb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1520 0%, #2A1A2E 100%)', color: 'white' }}
      >
        <div style={{ position: 'absolute', right: 24, bottom: 16, fontSize: 64, opacity: 0.15 }}>💰</div>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Total revenue — all time</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, fontWeight: 300, lineHeight: 1, color: 'var(--honey)' }}>
          {formatCurrency(totalRevenue)}
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          ≈ {formatCurrency(totalNGN, 'NGN')}
        </div>
        <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>
          Goal: $10,000 · You're {((totalRevenue / 10000) * 100).toFixed(2)}% there · Keep going.
        </p>
        <div className="progress-track" style={{ marginTop: 16, background: 'rgba(255,255,255,0.1)' }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, (totalRevenue / 10000) * 100)}%` }} />
        </div>
      </div>

      {/* Log + History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card label="Log a sale">
          <input
            type="number"
            placeholder="Amount in USD (e.g. 27)"
            className="lbb-input mb-3"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product name"
            className="lbb-input mb-3"
            value={product}
            onChange={e => setProduct(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && logSale()}
          />
          <button className="btn-primary w-full" onClick={logSale} disabled={logging || !amount || !product}>
            {logging ? 'Logging...' : '🎉 Log this sale'}
          </button>
        </Card>

        <Card label="Sale log">
          {sales.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.6, fontStyle: 'italic' }}>
              First sale incoming. It's coming. 🤍
            </p>
          ) : (
            <div>
              {sales.slice(0, 8).map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2.5 border-b"
                  style={{ borderColor: 'var(--border)', fontSize: 13 }}
                >
                  <span style={{ color: 'var(--slate)' }}>{s.product}</span>
                  <div className="text-right">
                    <div style={{ color: 'var(--terracotta)', fontWeight: 500 }}>{formatCurrency(Number(s.amount))}</div>
                    <div style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.6 }}>{formatDate(s.created_at)}</div>
                  </div>
                </div>
              ))}
              {sales.length === 1 && (
                <p style={{ fontSize: 12, color: 'var(--mauve)', opacity: 0.6, marginTop: 12, fontStyle: 'italic' }}>
                  "I made my first sale in 5 days. That was proof enough." 🤍
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Dream goals */}
      <Card label="Dream fund goals">
        {DREAM_GOALS.map(goal => {
          const usdNeeded = goal.ngn ? goal.ngn / USD_TO_NGN : null
          const pct = usdNeeded ? Math.min(100, (totalRevenue / usdNeeded) * 100) : 0
          return (
            <div key={goal.name} className="flex items-center gap-3 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <span style={{ fontSize: 20 }}>{goal.emoji}</span>
              <div className="flex-1">
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{goal.name}</div>
                <div style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.8 }}>
                  {goal.ngn
                    ? `${formatCurrency(goal.ngn, 'NGN')} · ≈ ${formatCurrency(goal.ngn / USD_TO_NGN)}`
                    : 'The dream goal. Far away. Coming.'}
                </div>
                {goal.ngn && (
                  <div className="progress-track" style={{ marginTop: 6 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--terracotta)', fontWeight: 500 }}>
                {goal.ngn ? `${pct.toFixed(1)}%` : '✦'}
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function celebrate() {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
  document.body.appendChild(overlay)
  const emojis = ['🎉', '✨', '💰', '🌟', '🎊', '💫', '🔥', '🤍']
  for (let i = 0; i < 30; i++) {
    const e = document.createElement('div')
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    e.style.cssText = `position:absolute;font-size:${20 + Math.random() * 20}px;left:${Math.random() * 100}%;top:-40px;animation:fall ${1 + Math.random() * 2}s ease-in forwards;pointer-events:none;`
    overlay.appendChild(e)
  }
  setTimeout(() => overlay.remove(), 3000)
}
