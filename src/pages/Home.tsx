import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp, Award, MapPin, AlertTriangle, CheckCircle, Bone as Drone, Eye, Shield, QrCode } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Reports Submitted', value: '1,247', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Violations Found', value: '342', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Resolved Cases', value: '198', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Active Users', value: '5,432', icon: Award, color: 'text-purple-600' },
  ];

  const recentReports = [
    {
      id: 1,
      location: 'MG Road Junction',
      status: 'Under Review',
      timestamp: '2 hours ago',
      violation: 'Oversized billboard blocking traffic sign',
      severity: 'high'
    },
    {
      id: 2,
      location: 'Brigade Road',
      status: 'Verified',
      timestamp: '5 hours ago',
      violation: 'Unauthorized placement near school',
      severity: 'medium'
    },
    {
      id: 3,
      location: 'Commercial Street',
      status: 'Resolved',
      timestamp: '1 day ago',
      violation: 'Missing license information',
      severity: 'low'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to UrbanWatch</h2>
        <p className="mb-4 opacity-90">
          Advanced AI-powered billboard monitoring system with drone integration, 
          OCR text recognition, and privacy-first design.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Eye className="h-4 w-4" />
            <span>AI Detection</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Drone className="h-4 w-4" />
            <span>Drone Surveys</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <QrCode className="h-4 w-4" />
            <span>QR Scanning</span>
          </div>
        </div>
        <Link
          to="/camera"
          className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <Camera className="h-5 w-5 mr-2" />
          Start AI Scan
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <Link
              to="/reports"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="divide-y">
          {recentReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900">{report.location}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(report.severity)}`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.violation}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Status: {report.status}</span>
                    <span>{report.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 AI-Powered Actions</h3>
          <div className="space-y-3">
            <Link
              to="/camera"
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-700">AI Billboard Scan</span>
              </div>
              <div className="flex space-x-1">
                <Eye className="h-3 w-3 text-blue-500" />
                <QrCode className="h-3 w-3 text-blue-500" />
                <Shield className="h-3 w-3 text-blue-500" />
              </div>
            </Link>
            <Link
              to="/reports"
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-700">Track Reports</span>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Real-time</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <Drone className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-700">Drone Control</span>
              </div>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Admin</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Your Impact & Rewards</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reports Submitted</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">23</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+5 this week</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Points Earned</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-blue-600">1,150</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+75 today</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rank</span>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold text-yellow-600">Gold Contributor</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next Reward</span>
                <span className="text-blue-600 font-medium">Coffee Voucher (50 pts)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Showcase */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">🤖 Advanced AI Features</h3>
          <p className="text-gray-600">Cutting-edge technology for comprehensive billboard monitoring</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">OCR Detection</h4>
            </div>
            <p className="text-sm text-gray-600">Automatically reads and analyzes text content for policy violations</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Drone className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Drone Surveys</h4>
            </div>
            <p className="text-sm text-gray-600">Large-scale automated detection covering entire city areas</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Privacy First</h4>
            </div>
            <p className="text-sm text-gray-600">Auto-blur faces and license plates with end-to-end encryption</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <QrCode className="h-5 w-5 text-yellow-600" />
              </div>
              <h4 className="font-medium text-gray-900">QR Verification</h4>
            </div>
            <p className="text-sm text-gray-600">Instant license verification through QR code scanning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;