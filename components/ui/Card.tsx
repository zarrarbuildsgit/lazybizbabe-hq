import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  label?: string
  hover?: boolean
}

export function Card({ children, className, label, hover = true }: CardProps) {
  return (
    <div className={cn('lbb-card', !hover && 'hover:transform-none hover:shadow-[var(--shadow)]', className)}>
      {label && <div className="card-label">{label}</div>}
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  delta,
  progress,
  progressMax,
}: {
  label: string
  value: string | number
  sub?: string
  delta?: string
  progress?: number
  progressMax?: number
}) {
  const pct = progress !== undefined && progressMax ? Math.min(100, (progress / progressMax) * 100) : null

  return (
    <Card label={label}>
      <div className="stat-num">{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--mauve)', marginTop: 4, opacity: 0.8 }}>{sub}</div>}
      {pct !== null && (
        <>
          <div className="progress-track" style={{ margin: '12px 0 6px' }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--mauve)', opacity: 0.7 }}>
            {progress?.toLocaleString()} / {progressMax?.toLocaleString()} goal
          </div>
        </>
      )}
      {delta && <div style={{ fontSize: 11, color: '#7BAF7B', marginTop: 4 }}>{delta}</div>}
    </Card>
  )
}
