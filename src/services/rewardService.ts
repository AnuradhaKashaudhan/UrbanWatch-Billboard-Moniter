export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'reporting' | 'accuracy' | 'community' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    target: number;
    current?: number;
  };
  earned: boolean;
  earnedDate?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'voucher' | 'badge' | 'certificate';
  value: string;
  pointsCost: number;
  expiryDate?: string;
  partnerLogo?: string;
  termsAndConditions: string[];
}

export interface UserStats {
  totalPoints: number;
  level: number;
  rank: string;
  reportsSubmitted: number;
  reportsVerified: number;
  accuracyRate: number;
  streak: number; // consecutive days with reports
  achievements: Achievement[];
  availableRewards: Reward[];
  redeemedRewards: Reward[];
}

class RewardService {
  private achievements: Achievement[] = [
    {
      id: 'first_report',
      title: 'First Steps',
      description: 'Submit your first billboard report',
      icon: '🎯',
      points: 50,
      category: 'reporting',
      rarity: 'common',
      requirements: { type: 'reports_submitted', target: 1 },
      earned: false
    },
    {
      id: 'sharp_eye',
      title: 'Sharp Eye',
      description: 'Find 10 violations in a single month',
      icon: '👁️',
      points: 200,
      category: 'reporting',
      rarity: 'rare',
      requirements: { type: 'monthly_violations', target: 10 },
      earned: false
    },
    {
      id: 'accuracy_master',
      title: 'Accuracy Master',
      description: 'Maintain 90% accuracy rate with 20+ reports',
      icon: '🎯',
      points: 300,
      category: 'accuracy',
      rarity: 'epic',
      requirements: { type: 'accuracy_rate', target: 90 },
      earned: false
    },
    {
      id: 'community_guardian',
      title: 'Community Guardian',
      description: 'Help resolve 25 billboard violations',
      icon: '🛡️',
      points: 500,
      category: 'community',
      rarity: 'epic',
      requirements: { type: 'resolved_reports', target: 25 },
      earned: false
    },
    {
      id: 'tech_pioneer',
      title: 'Tech Pioneer',
      description: 'Use AI detection feature 100 times',
      icon: '🤖',
      points: 250,
      category: 'special',
      rarity: 'rare',
      requirements: { type: 'ai_scans', target: 100 },
      earned: false
    },
    {
      id: 'city_explorer',
      title: 'City Explorer',
      description: 'Report from 50 different locations',
      icon: '🗺️',
      points: 400,
      category: 'reporting',
      rarity: 'epic',
      requirements: { type: 'unique_locations', target: 50 },
      earned: false
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Submit reports for 30 consecutive days',
      icon: '🔥',
      points: 600,
      category: 'special',
      rarity: 'legendary',
      requirements: { type: 'daily_streak', target: 30 },
      earned: false
    },
    {
      id: 'drone_operator',
      title: 'Drone Operator',
      description: 'Successfully complete 5 drone surveys',
      icon: '🚁',
      points: 800,
      category: 'special',
      rarity: 'legendary',
      requirements: { type: 'drone_surveys', target: 5 },
      earned: false
    }
  ];

  private rewards: Reward[] = [
    {
      id: 'coffee_discount',
      title: '20% Off Coffee',
      description: 'Get 20% discount at Cafe Coffee Day',
      type: 'discount',
      value: '20%',
      pointsCost: 100,
      expiryDate: '2024-12-31',
      partnerLogo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      termsAndConditions: [
        'Valid at participating outlets only',
        'Cannot be combined with other offers',
        'Valid for 30 days from redemption'
      ]
    },
    {
      id: 'movie_ticket',
      title: 'Free Movie Ticket',
      description: 'Complimentary movie ticket at PVR Cinemas',
      type: 'voucher',
      value: '₹300',
      pointsCost: 500,
      expiryDate: '2024-12-31',
      partnerLogo: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      termsAndConditions: [
        'Valid for 2D movies only',
        'Subject to seat availability',
        'Valid for 60 days from redemption'
      ]
    },
    {
      id: 'eco_warrior_badge',
      title: 'Eco Warrior Digital Badge',
      description: 'Special recognition badge for your profile',
      type: 'badge',
      value: 'Digital Badge',
      pointsCost: 200,
      termsAndConditions: [
        'Displayed on your public profile',
        'Permanent achievement',
        'Shows your environmental commitment'
      ]
    },
    {
      id: 'city_champion_certificate',
      title: 'City Champion Certificate',
      description: 'Official certificate from Municipal Corporation',
      type: 'certificate',
      value: 'Official Certificate',
      pointsCost: 1000,
      termsAndConditions: [
        'Digitally signed certificate',
        'Can be used for resume/portfolio',
        'Official recognition from authorities'
      ]
    },
    {
      id: 'restaurant_voucher',
      title: '₹500 Restaurant Voucher',
      description: 'Dining voucher at partner restaurants',
      type: 'voucher',
      value: '₹500',
      pointsCost: 800,
      expiryDate: '2024-12-31',
      partnerLogo: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      termsAndConditions: [
        'Valid at 50+ partner restaurants',
        'Minimum order value ₹1000',
        'Valid for 90 days from redemption'
      ]
    }
  ];

  calculateUserLevel(points: number): number {
    // Level calculation: 100 points for level 1, then +200 for each subsequent level
    if (points < 100) return 0;
    return Math.floor((points - 100) / 200) + 1;
  }

  getUserRank(points: number): string {
    if (points < 100) return 'Newcomer';
    if (points < 500) return 'Bronze Contributor';
    if (points < 1000) return 'Silver Guardian';
    if (points < 2000) return 'Gold Protector';
    if (points < 5000) return 'Platinum Champion';
    return 'Diamond Legend';
  }

  checkAchievements(userStats: any): Achievement[] {
    const newAchievements: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.earned) return;

      let qualified = false;
      const req = achievement.requirements;

      switch (req.type) {
        case 'reports_submitted':
          qualified = userStats.reportsSubmitted >= req.target;
          break;
        case 'monthly_violations':
          qualified = userStats.monthlyViolations >= req.target;
          break;
        case 'accuracy_rate':
          qualified = userStats.accuracyRate >= req.target && userStats.reportsSubmitted >= 20;
          break;
        case 'resolved_reports':
          qualified = userStats.resolvedReports >= req.target;
          break;
        case 'ai_scans':
          qualified = userStats.aiScans >= req.target;
          break;
        case 'unique_locations':
          qualified = userStats.uniqueLocations >= req.target;
          break;
        case 'daily_streak':
          qualified = userStats.dailyStreak >= req.target;
          break;
        case 'drone_surveys':
          qualified = userStats.droneSurveys >= req.target;
          break;
      }

      if (qualified) {
        achievement.earned = true;
        achievement.earnedDate = new Date().toISOString();
        newAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  calculatePointsForAction(action: string, details?: any): number {
    const pointsMap: { [key: string]: number } = {
      'report_submitted': 25,
      'report_verified': 50,
      'report_resolved': 100,
      'high_accuracy_bonus': 25,
      'first_report_bonus': 50,
      'streak_bonus': 10,
      'ai_scan_used': 5,
      'drone_survey_completed': 200,
      'qr_code_scanned': 15,
      'structural_hazard_found': 75,
      'obscene_content_found': 100,
      'political_ad_found': 150
    };

    let basePoints = pointsMap[action] || 0;

    // Apply multipliers based on details
    if (details?.severity === 'critical') {
      basePoints *= 2;
    } else if (details?.severity === 'high') {
      basePoints *= 1.5;
    }

    if (details?.firstTimeLocation) {
      basePoints += 20; // Bonus for reporting from new location
    }

    return Math.floor(basePoints);
  }

  getAvailableRewards(userPoints: number): Reward[] {
    return this.rewards.filter(reward => reward.pointsCost <= userPoints);
  }

  redeemReward(rewardId: string, userPoints: number): { success: boolean; message: string; newPoints?: number } {
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }

    if (userPoints < reward.pointsCost) {
      return { success: false, message: 'Insufficient points' };
    }

    // Check if reward is still valid
    if (reward.expiryDate && new Date(reward.expiryDate) < new Date()) {
      return { success: false, message: 'Reward has expired' };
    }

    const newPoints = userPoints - reward.pointsCost;
    return { 
      success: true, 
      message: `Successfully redeemed ${reward.title}!`,
      newPoints 
    };
  }

  generateLeaderboard(users: any[]): any[] {
    return users
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        position: index + 1,
        rank: this.getUserRank(user.totalPoints),
        level: this.calculateUserLevel(user.totalPoints)
      }));
  }

  getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  getProgressToNextLevel(points: number): { currentLevel: number; nextLevel: number; pointsNeeded: number; progress: number } {
    const currentLevel = this.calculateUserLevel(points);
    const nextLevel = currentLevel + 1;
    const pointsForNextLevel = currentLevel === 0 ? 100 : 100 + (currentLevel * 200);
    const pointsNeeded = pointsForNextLevel - points;
    const progress = currentLevel === 0 
      ? (points / 100) * 100 
      : ((points - (100 + ((currentLevel - 1) * 200))) / 200) * 100;

    return {
      currentLevel,
      nextLevel,
      pointsNeeded: Math.max(0, pointsNeeded),
      progress: Math.min(100, Math.max(0, progress))
    };
  }
}

export const rewardService = new RewardService();