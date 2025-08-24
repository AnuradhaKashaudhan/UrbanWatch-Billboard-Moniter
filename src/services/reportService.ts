import { supabase } from '../lib/supabase'
import type { Report } from '../lib/supabase'

export interface CreateReportData {
  location: string
  coordinates: { lat: number; lng: number }
  imageUrl: string
  violations: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  aiAnalysis: any
}

class ReportService {
  async createReport(userId: string, data: CreateReportData) {
    try {
      // Calculate points based on severity
      const pointsMap = {
        low: 25,
        medium: 50,
        high: 75,
        critical: 100
      }
      const pointsEarned = pointsMap[data.severity]

      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          user_id: userId,
          location: data.location,
          coordinates: data.coordinates,
          image_url: data.imageUrl,
          violations: data.violations,
          severity: data.severity,
          points_earned: pointsEarned,
          ai_analysis: data.aiAnalysis,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Update user points
      await this.updateUserPoints(userId, pointsEarned)

      return { report, error: null }
    } catch (error: any) {
      return { report: null, error: error.message }
    }
  }

  async getUserReports(userId: string) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { reports: data, error: null }
    } catch (error: any) {
      return { reports: [], error: error.message }
    }
  }

  async getAllReports() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { reports: data, error: null }
    } catch (error: any) {
      return { reports: [], error: error.message }
    }
  }

  async updateReportStatus(reportId: string, status: 'pending' | 'verified' | 'resolved' | 'rejected') {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId)
        .select()
        .single()

      if (error) throw error

      // Award bonus points for verified reports
      if (status === 'verified') {
        const { data: report } = await supabase
          .from('reports')
          .select('user_id, points_earned')
          .eq('id', reportId)
          .single()

        if (report) {
          await this.updateUserPoints(report.user_id, 25) // Bonus points
        }
      }

      return { report: data, error: null }
    } catch (error: any) {
      return { report: null, error: error.message }
    }
  }

  private async updateUserPoints(userId: string, points: number) {
    try {
      // Get current user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', userId)
        .single()

      if (profile) {
        const newPoints = profile.points + points
        const newLevel = Math.floor(newPoints / 100) // Level up every 100 points
        const newRank = this.calculateRank(newPoints)

        await supabase
          .from('profiles')
          .update({
            points: newPoints,
            level: newLevel,
            rank: newRank
          })
          .eq('id', userId)
      }
    } catch (error) {
      console.error('Error updating user points:', error)
    }
  }

  private calculateRank(points: number): string {
    if (points < 100) return 'Newcomer'
    if (points < 500) return 'Bronze Contributor'
    if (points < 1000) return 'Silver Guardian'
    if (points < 2000) return 'Gold Protector'
    if (points < 5000) return 'Platinum Champion'
    return 'Diamond Legend'
  }

  async getReportStats() {
    try {
      const { data: totalReports } = await supabase
        .from('reports')
        .select('id', { count: 'exact' })

      const { data: pendingReports } = await supabase
        .from('reports')
        .select('id', { count: 'exact' })
        .eq('status', 'pending')

      const { data: verifiedReports } = await supabase
        .from('reports')
        .select('id', { count: 'exact' })
        .eq('status', 'verified')

      const { data: resolvedReports } = await supabase
        .from('reports')
        .select('id', { count: 'exact' })
        .eq('status', 'resolved')

      return {
        total: totalReports?.length || 0,
        pending: pendingReports?.length || 0,
        verified: verifiedReports?.length || 0,
        resolved: resolvedReports?.length || 0
      }
    } catch (error) {
      console.error('Error getting report stats:', error)
      return { total: 0, pending: 0, verified: 0, resolved: 0 }
    }
  }
}

export const reportService = new ReportService()