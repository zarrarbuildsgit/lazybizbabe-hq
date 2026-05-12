'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { section: 'Home', items: [
    { href: '/',        icon: '🏠', label: 'Dashboard' },
    { href: '/growth',  icon: '📈', label: 'Growth' },
  ]},
  { section: 'Business', items: [
    { href: '/money',    icon: '💰', label: 'Bag Vault' },
    { href: '/products', icon: '📦', label: 'Product Vault' },
    { href: '/content',  icon: '✍️', label: 'Content Kitchen' },
  ]},
  { section: 'Brain', items: [
    { href: '/brain', icon: '🧠', label: 'Chaos Organiser' },
    { href: '/life',  icon: '🌸', label: 'Becoming Hub' },
  ]},
  { section: 'System', items: [
    { href: '/settings', icon: '⚙️', label: 'Settings' },
  ]},
]

const MODES = [
  { key: 'power',    emoji: '🔥', label: 'Power' },
  { key: 'normal',   emoji: '✅', label: 'Normal' },
  { key: 'survival', emoji: '🌙', label: 'Rest' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] z-50"
      style={{
        background: 'linear-gradient(160deg, rgba(194,139,106,0.03) 0%, rgba(155,133,156,0.06) 100%)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-8 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="font-serif-italic leading-tight mb-1"
          style={{ fontSize: 18, color: 'var(--terracotta)' }}
        >
          LazyBizBabe<br />HQ ✦
        </div>
        <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.7 }}>
          Your command centre
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <div style={{ fontSize: 8, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--mauve)', opacity: 0.5, padding: '0 24px 8px', marginTop: 16 }}>
              {group.section}
            </div>
            {group.items.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-6 py-2.5 text-[13px] transition-all duration-200 border-l-2 no-underline',
                    active
                      ? 'border-l-[var(--terracotta)] bg-[rgba(194,139,106,0.08)] font-medium'
                      : 'border-l-transparent opacity-70 hover:opacity-100 hover:bg-[rgba(194,139,106,0.04)]'
                  )}
                  style={{ color: active ? 'var(--terracotta)' : 'var(--slate)' }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Energy Mode */}
      <EnergyMode />
    </aside>
  )
}

function EnergyMode() {
  return (
    <div className="mx-4 mb-4 rounded-xl p-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--mauve)', marginBottom: 8 }}>
        Energy Mode
      </div>
      <div className="flex gap-1">
        {MODES.map(m => (
          <button
            key={m.key}
            className="flex-1 py-1.5 rounded-lg text-xs text-center border transition-all duration-200"
            style={{
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--slate)',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
            }}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
