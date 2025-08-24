import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  city?: string
  userType: 'citizen' | 'official'
}

export interface SignInData {
  email: string
  password: string
}

class AuthService {
  async signUp(data: SignUpData) {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            city: data.city,
            user_type: data.userType
          }
        }
      })

      if (authError) throw authError

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone,
            city: data.city,
            user_type: data.userType,
            points: 0,
            level: 0,
            rank: 'Newcomer'
          })

        if (profileError) throw profileError
      }

      return { user: authData.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error

      return { user: authData.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error: any) {
      return { profile: null, error: error.message }
    }
  }

  async updateUserProfile(userId: string, updates: Partial<any>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (error: any) {
      return { profile: null, error: error.message }
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

export const authService = new AuthService()