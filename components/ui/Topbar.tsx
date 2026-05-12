'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

const PAGE_TITLES: Record<string, string> = {
  '/':         'Good morning, Ope ✦',
  '/growth':   'Growth Tracker',
  '/money':    'The Bag Vault 💰',
  '/products': 'Product Vault',
  '/content':  'Content Kitchen',
  '/brain':    'Chaos Organiser',
  '/life':     'The Becoming Hub',
  '/settings': 'Settings & Connections',
}

export function Topbar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const title = PAGE_TITLES[pathname] ?? 'LazyBizBabe HQ'

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-5 lg:px-10 py-5 border-b"
      style={{
        background: theme === 'dark' ? 'rgba(26,21,32,0.85)' : 'rgba(250,245,239,0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="font-serif-italic font-light"
        style={{ fontSize: 22, color: 'var(--slate)' }}
      >
        {title}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-200"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card)',
            cursor: 'pointer',
          }}
          title="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}
