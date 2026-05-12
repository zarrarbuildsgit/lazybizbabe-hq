'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MOBILE_NAV = [
  { href: '/',         icon: '🏠', label: 'Home' },
  { href: '/money',    icon: '💰', label: 'Money' },
  { href: '/content',  icon: '✍️', label: 'Content' },
  { href: '/brain',    icon: '🧠', label: 'Brain' },
  { href: '/life',     icon: '🌸', label: 'Life' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: 'var(--card)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex justify-around py-2">
        {MOBILE_NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] transition-all duration-200 no-underline',
                active ? 'opacity-100' : 'opacity-50'
              )}
              style={{ color: active ? 'var(--terracotta)' : 'var(--slate)' }}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
