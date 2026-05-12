'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { formatDate, timeAgo } from '@/lib/utils'
import type { Product, Testimonial } from '@/types'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  live:    { bg: 'rgba(123,175,123,0.15)', color: '#5A9A5A', label: '🟢 Live' },
  draft:   { bg: 'rgba(212,169,106,0.15)', color: 'var(--honey)', label: '🟡 Draft' },
  retired: { bg: 'rgba(155,133,156,0.15)', color: 'var(--mauve)', label: '💜 Retired' },
}

export function ProductsClient({ initialProducts, initialTestimonials }: {
  initialProducts: Product[]
  initialTestimonials: Testimonial[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [testis, setTestis]     = useState<Testimonial[]>(initialTestimonials)

  async function addTestimonial() {
    const text = window.prompt('Paste the testimonial or DM:')
    const from = window.prompt('Who said it / where?')
    if (!text) return
    const { data } = await supabase
      .from('testimonials')
      .insert({ text, from_who: from ?? 'Anonymous' })
      .select()
      .single()
    if (data) setTestis(prev => [data, ...prev])
  }

  async function copyTesti(text: string, btn: HTMLButtonElement) {
    try {
      await navigator.clipboard.writeText(text)
      btn.textContent = 'Copied!'
      setTimeout(() => btn.textContent = 'Copy', 1800)
    } catch {
      // fallback
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-serif-italic font-light" style={{ fontSize: 28 }}>
          Product <em style={{ color: 'var(--terracotta)' }}>Vault</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
          Every product you've ever built. Nothing gets lost here.
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {products.map(p => {
          const style = STATUS_STYLES[p.status] ?? STATUS_STYLES.draft
          return (
            <div
              key={p.id}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div
                className="inline-block rounded-full mb-3"
                style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', padding: '3px 10px', background: style.bg, color: style.color }}
              >
                {style.label}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 19, fontStyle: 'italic', marginBottom: 4, color: 'var(--slate)' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--terracotta)', fontWeight: 500 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.8, marginTop: 4 }}>
                {p.sales} sales
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)', fontSize: 12, color: 'var(--mauve)', opacity: 0.8, lineHeight: 1.6 }}>
                {p.description}
              </div>
              {p.status === 'retired' && (
                <p style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 8, fontStyle: 'italic' }}>
                  Your first proof. Don't forget this. 🤍
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Testimonials */}
      <Card label="Testimonial bank">
        {testis.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--mauve)', opacity: 0.7, fontStyle: 'italic' }}>
            Every kind word goes here. Add your first one.
          </p>
        ) : (
          testis.map(t => (
            <div
              key={t.id}
              className="rounded-none rounded-r-xl p-4 mb-2.5 relative"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderLeft: '3px solid var(--terracotta)' }}
            >
              <button
                className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full border transition-all duration-200"
                style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--mauve)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                onClick={e => copyTesti(t.text, e.currentTarget)}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--terracotta)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--terracotta)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--mauve)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                Copy
              </button>
              <p style={{ fontSize: 13, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 8, color: 'var(--slate)' }}>{t.text}</p>
              <p style={{ fontSize: 10, color: 'var(--mauve)', opacity: 0.8 }}>{t.from_who} · {timeAgo(t.created_at)}</p>
            </div>
          ))
        )}
        <button className="btn-ghost mt-3" onClick={addTestimonial}>+ Add testimonial</button>
      </Card>
    </div>
  )
}
