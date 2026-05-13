// ── DATABASE TYPES ──

export interface Sale {
  id: string
  amount: number
  product: string
  created_at: string
}

export interface FollowerLog {
  id: string
  count: number
  created_at: string
}

export interface BrainDump {
  id: string
  type: string
  text: string
  created_at: string
}

export interface LaterIdea {
  id: string
  idea: string
  excitement: number
  created_at: string
}

export interface HabitEntry {
  id: string
  habit_id: string
  completed_date: string // YYYY-MM-DD
}

export interface JournalEntry {
  id: string
  entry: string
  created_at: string
}

export interface Milestone {
  id: string
  text: string
  icon: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  price: string
  status: 'live' | 'draft' | 'retired'
  sales: number
  description: string
  created_at: string
}

export interface Testimonial {
  id: string
  text: string
  from_who: string
  created_at: string
}

export interface PostDraft {
  id: string
  content: string
  tag: string
  created_at: string
}

export interface OneThing {
  id: string
  text: string
  date: string // YYYY-MM-DD
}

export interface MoodEntry {
  id: string
  mood: string
  created_at: string
}

// ── THREADS API TYPES ──

export interface ThreadsPost {
  id: string
  text: string
  timestamp: string
  like_count?: number
  replies_count?: number
  repost_count?: number
  views?: number
}

export interface ThreadsInsights {
  followers_count: number
  posts: ThreadsPost[]
  mock?: boolean
  connect_url?: string
  token_expired?: boolean
  token_expires_in_days?: number
}

// ── AI TYPES ──

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  error?: string
}

// ── UI TYPES ──

export type Section =
  | 'home'
  | 'growth'
  | 'money'
  | 'products'
  | 'content'
  | 'brain'
  | 'life'

export type EnergyMode = 'power' | 'normal' | 'survival'