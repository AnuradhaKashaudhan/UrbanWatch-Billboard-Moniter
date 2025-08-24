import React, { useState } from 'react';
import { User, Award, TrendingUp, MapPin, Calendar, Star, Settings, Bell } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');

  const userStats = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    joinDate: 'January 2024',
    totalReports: 23,
    verifiedReports: 18,
    pointsEarned: 1150,
    rank: 'Gold Contributor',
    level: 4,
    nextLevelPoints: 350
  };

  const achievements = [
    {
      id: 1,
      title: 'First Report',
      description: 'Submitted your first billboard report',
      icon: '🎯',
      earned: true,
      date: 'Jan 15, 2024'
    },
    {
      id: 2,
      title: 'Sharp Eye',
      description: 'Found 10 violations in a single month',
      icon: '👁️',
      earned: true,
      date: 'Feb 8, 2024'
    },
    {
      id: 3,
      title: 'Community Guardian',
      description: 'Helped resolve 5 billboard violations',
      icon: '🛡️',
      earned: true,
      date: 'Feb 20, 2024'
    },
    {
      id: 4,
      title: 'Tech Savvy',
      description: 'Used AI detection feature 50 times',
      icon: '🤖',
      earned: false,
      progress: 35
    },
    {
      id: 5,
      title: 'City Explorer',
      description: 'Reported from 25 different locations',
      icon: '🗺️',
      earned: false,
      progress: 68
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report_verified',
      description: 'Your report from MG Road was verified',
      points: 50,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'achievement_earned',
      description: 'Earned "Community Guardian" achievement',
      points: 100,
      timestamp: '1 day ago'
    },
    {
      id: 3,
      type: 'report_submitted',
      description: 'New report submitted at Brigade Road',
      points: 25,
      timestamp: '2 days ago'
    }
  ];

  const progressPercentage = (userStats.pointsEarned % 1000) / 10;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{userStats.name}</h1>
            <p className="text-gray-600">{userStats.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Joined {userStats.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4 text-gold-500" />
                <span className="text-sm font-medium text-blue-600">{userStats.rank}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{userStats.pointsEarned}</div>
            <div className="text-sm text-gray-600">Total Points</div>
            <div className="mt-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {userStats.nextLevelPoints} pts to Level {userStats.level + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'achievements', label: 'Achievements' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.totalReports}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.verifiedReports}</div>
              <div className="text-sm text-gray-600">Verified Reports</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{(userStats.verifiedReports / userStats.totalReports * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'report_verified' ? 'bg-green-100' :
                      activity.type === 'achievement_earned' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'report_verified' && <Award className="h-4 w-4 text-green-600" />}
                      {activity.type === 'achievement_earned' && <Star className="h-4 w-4 text-yellow-600" />}
                      {activity.type === 'report_submitted' && <MapPin className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-blue-600 font-medium">+{activity.points} points</span>
                        <span className="text-sm text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                achievement.earned ? 'ring-2 ring-green-200' : 'opacity-75'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.earned ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  {achievement.earned ? (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Earned on {achievement.date}
                      </span>
                    </div>
                  ) : achievement.progress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Report Updates</h4>
                  <p className="text-sm text-gray-600">Get notified when your reports are reviewed</p>
                </div>
                <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Achievement Alerts</h4>
                  <p className="text-sm text-gray-600">Receive notifications for new achievements</p>
                </div>
                <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Weekly Summary</h4>
                  <p className="text-sm text-gray-600">Get a weekly summary of your activity</p>
                </div>
                <input type="checkbox" className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Location Services</h4>
                  <p className="text-sm text-gray-600">Allow app to access your location for reports</p>
                </div>
                <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Public Profile</h4>
                  <p className="text-sm text-gray-600">Show your profile on leaderboards</p>
                </div>
                <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Export My Data
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Privacy Policy
                </button>
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile