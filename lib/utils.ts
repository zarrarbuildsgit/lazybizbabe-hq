import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'USD' | 'NGN' = 'USD'): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`
  }
  return `$${amount.toFixed(2)}`
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.max(0, differenceInDays(target, now))
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function progressPct(current: number, goal: number): number {
  return Math.min(100, (current / goal) * 100)
}

// Ope's quotes from Soft Chaos
export const QUOTES = [
  "Scattered doesn't mean stuck. Your brain isn't broken; it just needs systems built for it, not against it.",
  "Done is better than perfect. A finished imperfect product is a business. An unfinished perfect one is a hobby.",
  "Selling is not asking for permission. It's offering a solution.",
  "The product that exists is worth infinitely more than the perfect product that doesn't.",
  "Slow and steady keeps the chain. Sprinting and burning breaks it every time.",
  "You cannot build trust by staying invisible.",
  "Your brain writes checks your executive function can't cash. That's not laziness. That's ADHD.",
  "The version of you that needed this product is searching for it right now.",
  "The grass is greener on the other side because you haven't tried to grow it yet.",
]

export function randomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

// Threads post prompts
export const POST_PROMPTS = [
  "The most embarrassing part of being a serial restarter isn't telling people you stopped. It's the opposite — tell your version.",
  "What's the most annoying productivity advice your ADHD brain has ever received? And what actually works instead?",
  "I used to think [wrong belief]. Here's what I know now.",
  "If 'just start' has never worked for your brain, this post is for you →",
  "The honest reason I disappeared for 6 months after my first sale.",
  "3 things I stopped doing once I accepted I have ADHD:",
  "Starting from $0 doesn't mean starting from nothing. Here's what you actually have:",
  "The difference between selling and begging (because I confused them for too long):",
  "Proof that you don't need a laptop, a team, or a brand to sell something →",
]

export function randomPrompt(): string {
  return POST_PROMPTS[Math.floor(Math.random() * POST_PROMPTS.length)]
}
