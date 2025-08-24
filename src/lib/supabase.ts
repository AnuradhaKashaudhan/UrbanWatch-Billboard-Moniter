import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  city?: string
  user_type: 'citizen' | 'official'
  points: number
  level: number
  rank: string
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  user_id: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  image_url: string
  status: 'pending' | 'verified' | 'resolved' | 'rejected'
  violations: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  points_earned: number
  ai_analysis: any
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string
  points: number
  earned_at: string
}