'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const TYPES = ['💡 Idea', '📝 Task', '📱 Post', '😤 Worry']

export function QuickCapture() {
  const [open, setOpen]   = useState(false)
  const [type, setType]   = useState('💡 Idea')
  const [text, setText]   = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!text.trim()) return
    setSaving(true)
    await supabase.from('brain_dumps').insert({ type, text: text.trim() })
    setText('')
    setOpen(false)
    setSaving(false)
  }

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-50">
      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-16 right-0 w-72 rounded-2xl p-4 shadow-xl animate-fade-up"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}
        >
          <div className="card-label mb-2">Quick capture</div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-2.5 py-1 rounded-full text-[10px] border transition-all duration-200"
                style={{
                  border: t === type ? '1px solid var(--terracotta)' : '1px solid var(--border)',
                  background: t === type ? 'var(--terracotta)' : 'transparent',
                  color: t === type ? 'white' : 'var(--slate)',
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
            placeholder="Just get it out of your head..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) save() }}
          />
          <button
            className="btn-primary w-full mt-2"
            onClick={save}
            disabled={saving || !text.trim()}
          >
            {saving ? 'Saving...' : 'Captured ✓'}
          </button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white border-none transition-all duration-200 hover:scale-110"
        style={{
          background: 'var(--terracotta)',
          boxShadow: '0 4px 20px rgba(194,139,106,0.4)',
          cursor: 'pointer',
        }}
      >
        {open ? '×' : '+'}
      </button>
    </div>
  )
}
