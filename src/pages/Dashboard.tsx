import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle, Users, Calendar, Bone as Drone, Eye, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  const violationData = [
    { name: 'Oversized', count: 45, color: '#EF4444' },
    { name: 'Wrong Placement', count: 32, color: '#F97316' },
    { name: 'No License', count: 28, color: '#EAB308' },
    { name: 'Content Issues', count: 15, color: '#8B5CF6' },
  ];

  const monthlyReports = [
    { month: 'Jan', reports: 45, violations: 28 },
    { month: 'Feb', reports: 52, violations: 31 },
    { month: 'Mar', reports: 38, violations: 22 },
    { month: 'Apr', reports: 61, violations: 35 },
    { month: 'May', reports: 55, violations: 33 },
    { month: 'Jun', reports: 67, violations: 41 },
  ];

  const topLocations = [
    { area: 'MG Road', violations: 23, trend: '+12%' },
    { area: 'Brigade Road', violations: 18, trend: '-5%' },
    { area: 'Commercial Street', violations: 15, trend: '+8%' },
    { area: 'Koramangala', violations: 12, trend: '+3%' },
    { area: 'Indiranagar', violations: 10, trend: '-2%' },
  ];

  const recentActions = [
    {
      id: 1,
      action: 'Billboard Removed',
      location: 'MG Road Junction',
      timestamp: '2 hours ago',
      type: 'resolved'
    },
    {
      id: 2,
      action: 'Notice Issued',
      location: 'Brigade Road',
      timestamp: '4 hours ago',
      type: 'action'
    },
    {
      id: 3,
      action: 'New Report Verified',
      location: 'Commercial Street',
      timestamp: '6 hours ago',
      type: 'verified'
    },
  ];

  const stats = [
    {
      label: 'Total Reports',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Active Violations',
      value: '342',
      change: '+8%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50'
    },
    {
      label: 'Resolved Cases',
      value: '198',
      change: '+15%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Active Citizens',
      value: '5,432',
      change: '+23%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Administrative Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Reports Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Reports & Violations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#3B82F6" name="Total Reports" />
              <Bar dataKey="violations" fill="#EF4444" name="Violations Found" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Violation Types Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Violation Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={violationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {violationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Violation Areas */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top Violation Areas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topLocations.map((location, index) => (
                <div key={location.area} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? 'bg-red-100 text-red-600' :
                      index === 1 ? 'bg-orange-100 text-orange-600' :
                      index === 2 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{location.area}</p>
                      <p className="text-sm text-gray-600">{location.violations} violations</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    location.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {location.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Actions</h3>
          </div>
          <div className="divide-y">
            {recentActions.map((action) => (
              <div key={action.id} className="p-6">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    action.type === 'resolved' ? 'bg-green-100' :
                    action.type === 'action' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {action.type === 'resolved' ? (
                      <CheckCircle className={`h-4 w-4 ${
                        action.type === 'resolved' ? 'text-green-600' :
                        action.type === 'action' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`} />
                    ) : action.type === 'action' ? (
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.action}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{action.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{action.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;